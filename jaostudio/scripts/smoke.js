#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')
const yargs = require('yargs')

const argv = yargs
  .option('url', { type: 'string', demandOption: true })
  .option('burst', { type: 'number', default: 6, describe: 'Number of burst requests for rate limit test' })
  .parse()

const BASE = (Array.isArray(argv.url) ? argv.url[0] : argv.url).replace(/\/$/, '')
const BURST_COUNT = argv.burst

const ROUTES = [
  { path: '/', label: 'Homepage' },
  { path: '/studio', label: 'Studio' },
  { path: '/projects', label: 'Projects Listing' },
  { path: '/projects/isp-platform', label: 'Project Detail (ISP)' },
  { path: '/projects/saas-frontend', label: 'Project Detail (SaaS)' },
  { path: '/projects/web-application', label: 'Project Detail (Web App)' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
  { path: '/audit', label: 'Audit' },
]

const PASS = 'PASS'
const FAIL = 'FAIL'
const WARN = 'WARN'

const results = []

function record(name, status, detail) {
  results.push({ name, status, detail })
  const icon = status === PASS ? '  ✓' : status === WARN ? '  ~' : '  ✗'
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ''}`)
}

async function run() {
  console.log(`\n  Smoke Test — ${BASE}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  const consoleLogs = []
  const requests = []
  const posthogEvents = []
  const cspViolations = []

  page.on('console', (msg) => {
    const entry = { type: msg.type(), text: msg.text(), ts: Date.now() }
    consoleLogs.push(entry)
    if (msg.text().toLowerCase().includes('csp') || msg.text().includes('Content Security Policy')) {
      cspViolations.push(entry)
    }
  })

  page.on('request', (r) => {
    requests.push({ url: r.url(), method: r.method(), ts: Date.now() })
    if (r.url().includes('posthog') || r.url().includes('phc_')) {
      posthogEvents.push({ url: r.url(), method: r.method(), ts: Date.now() })
    }
  })

  page.on('requestfailed', (r) => {
    const err = r.failure()?.errorText || 'unknown'
    requests.push({ url: r.url(), failed: true, err, ts: Date.now() })
    if (r.url().includes('posthog') || r.url().includes('phc_')) {
      posthogEvents.push({ url: r.url(), failed: true, err, ts: Date.now() })
    }
  })

  page.on('response', (r) => {
    if (r.url().includes('/api/contact')) {
      const status = r.status()
      record(`API /api/contact responded ${status}`, status < 500 ? PASS : FAIL, `Status ${status}`)
    }
    if (r.url().includes('/api/csp-report')) {
      record('CSP report endpoint reached', PASS, 'Report received')
    }
  })

  try {
    await page.goto(BASE, { waitUntil: 'load', timeout: 30000 })
    await page.waitForTimeout(1000)
    record('Homepage loads', PASS, `${page.url()}`)
  } catch (e) {
    record('Homepage loads', FAIL, e.message)
  }

  const pageTitle = await page.title()
  record('Page title exists', pageTitle ? PASS : FAIL, pageTitle || 'empty')

  for (const route of ROUTES) {
    try {
      const fullUrl = BASE + route.path
      await page.goto(fullUrl, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(500)
      const ok = page.url().includes(route.path.replace(/\/$/, ''))
      record(`Route: ${route.label}`, ok ? PASS : FAIL, ok ? fullUrl : `Redirected to ${page.url()}`)
    } catch (e) {
      record(`Route: ${route.label}`, FAIL, e.message)
    }
  }

  try {
    const contactPayload = {
      name: 'Smoke Test',
      email: 'smoke@jaostudio.dev',
      message: 'Automated smoke test submission — please ignore.',
      project_type: 'web-development',
      budget: '$1,000 – $3,000',
      timeline: '2–4 weeks',
      priority: 'Conversions',
      source: 'Portfolio Review',
      _gotcha: '',
    }

    const response = await page.evaluate(async (payload) => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return { status: res.status, body: await res.json(), remaining: res.headers.get('x-ratelimit-remaining') }
    }, contactPayload)

    if (response.status === 200 && response.body.ok === true) {
      record('Contact form submission', PASS, '200 OK with ok:true')
    } else if (response.status === 429) {
      record('Contact form submission', WARN, 'Rate limited — previous run may have exhausted slots (rate limiter working)')
    } else {
      record('Contact form submission', FAIL, `${response.status} ${JSON.stringify(response.body)}`)
    }
  } catch (e) {
    record('Contact form submission', FAIL, e.message)
  }

  try {
    const burstResults = []
    for (let i = 0; i < BURST_COUNT; i++) {
      const res = await page.evaluate(async () => {
        const r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Burst Test', email: 'burst@test.com', message: 'Rate limit test', _gotcha: '' }),
        })
        return { status: r.status, remaining: r.headers.get('x-ratelimit-remaining') }
      })
      burstResults.push(res)
    }

    const rateLimited = burstResults.some((r) => r.status === 429)
    const hasHeaders = burstResults.some((r) => r.remaining !== null)
    record('Rate limiting (burst test)', hasHeaders ? PASS : FAIL,
      hasHeaders
        ? rateLimited
          ? `Rate limited after ${burstResults.filter((r) => r.status === 200).length} requests`
          : `No rate limit hit in ${BURST_COUNT} requests (may be disabled)`
        : 'No x-ratelimit-remaining headers')
  } catch (e) {
    record('Rate limiting (burst test)', FAIL, e.message)
  }

  record('PostHog analytics events', posthogEvents.length > 0 ? PASS : WARN,
    posthogEvents.length > 0
      ? `${posthogEvents.length} events captured (${posthogEvents.filter((e) => e.failed).length} failed)`
      : 'No PostHog events captured (may be expected if key not set)')

  record('Console errors', consoleLogs.filter((l) => l.type === 'error').length === 0 ? PASS : WARN,
    (() => {
      const errors = consoleLogs.filter((l) => l.type === 'error')
      return errors.length === 0 ? 'No console errors' : `${errors.length} console error(s)`
    })())

  record('CSP violations', cspViolations.length === 0 ? PASS : FAIL,
    cspViolations.length === 0 ? 'No CSP violations detected' : `${cspViolations.length} CSP violation(s)`)

  record('Failed requests', requests.filter((r) => r.failed).length === 0 ? PASS : WARN,
    (() => {
      const failed = requests.filter((r) => r.failed)
      return failed.length === 0 ? 'All requests succeeded' : `${failed.length} failed request(s): ${failed.map((r) => r.url).join(', ').slice(0, 200)}`
    })())

  const outDir = path.join(process.cwd(), 'logs')
  await fs.ensureDir(outDir)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const jsonPath = path.join(outDir, `smoke-${stamp}.json`)
  await fs.writeJSON(jsonPath, {
    url: BASE,
    timestamp: stamp,
    results,
    totalTests: results.length,
    passed: results.filter((r) => r.status === PASS).length,
    warnings: results.filter((r) => r.status === WARN).length,
    failed: results.filter((r) => r.status === FAIL).length,
    consoleLogs,
    cspViolations,
    posthogEvents,
    requests,
  }, { spaces: 2 })
  const screenshotPath = path.join(outDir, `smoke-${stamp}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: true })

  const passed = results.filter((r) => r.status === PASS).length
  const warnings = results.filter((r) => r.status === WARN).length
  const failedCount = results.filter((r) => r.status === FAIL).length
  const total = results.length

  console.log(`\n  Results: ${passed}/${total} passed, ${warnings} warnings, ${failedCount} failed`)
  console.log(`  Artifacts: ${jsonPath}\n`)

  await browser.close()
  process.exit(failedCount > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error('Smoke test crashed:', err)
  process.exit(1)
})
