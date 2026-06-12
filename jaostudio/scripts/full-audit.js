#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')
const https = require('https')

const argv = process.argv.slice(2)
const base = (argv[0] || 'https://jaostudio.vercel.app').replace(/\/+$/, '')
const LOCALES = ['en', 'tl']
const THEMES = ['dark', 'light']
const VIEWPORTS = [
  { label: 'desktop', width: 1200, height: 900 },
  { label: 'mobile', width: 412, height: 915 },
]

const ROUTES = [
  { path: '/', label: 'home' },
  { path: '/studio', label: 'studio' },
  { path: '/contact', label: 'contact' },
  { path: '/cv', label: 'cv' },
  { path: '/demos', label: 'demos' },
  { path: '/docs/demo-credentials', label: 'demo-credentials' },
  { path: '/playground', label: 'playground' },
  { path: '/projects', label: 'projects' },
  { path: '/services', label: 'services' },
  { path: '/projects/isp-platform', label: 'project-isp' },
  { path: '/projects/landing-page', label: 'project-landing' },
  { path: '/projects/web-application', label: 'project-webapp' },
]

const stampDate = new Date().toISOString().split('T')[0]
const outDir = path.join(process.cwd(), 'reports', 'full-audit', stampDate)
const WCAG_THRESHOLDS = { 'critical': 0, 'serious': 0, 'moderate': 5 }

function contrastRatio(hex1, hex2) {
  const l = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const lin = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  }
  const l1 = l(hex1), l2 = l(hex2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

async function fetchAxe(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Failed: ' + res.statusCode))
      let d = ''
      res.setEncoding('utf8')
      res.on('data', (c) => d += c)
      res.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

async function runAudit() {
  await fs.ensureDir(outDir)
  console.log(`Full audit starting — base: ${base}`)
  console.log(`Routes: ${ROUTES.length}, Locales: ${LOCALES.length}, Themes: ${THEMES.length}, Viewports: ${VIEWPORTS.length}`)
  console.log(`Total combinations: ${ROUTES.length * LOCALES.length * THEMES.length * VIEWPORTS.length}\n`)

  const axeSource = await fetchAxe('https://cdn.jsdelivr.net/npm/axe-core@4.11.4/axe.min.js')
  const browser = await chromium.launch()
  const allResults = []

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      const url = `${base}/${locale}${route.path}`
      for (const theme of THEMES) {
        for (const vp of VIEWPORTS) {
          const label = `${locale}_${theme}_${vp.label}_${route.label}`
          process.stdout.write(`  ${label}... `)

          const context = await browser.newContext({
            viewport: vp,
            deviceScaleFactor: 1,
            colorScheme: theme,
          })
          const page = await context.newPage()

          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
            // Set theme via localStorage if needed
            await page.evaluate((t) => {
              try { localStorage.setItem('theme', t) } catch(e) {}
            }, theme)
            // Force color scheme
            await page.emulateMedia({ colorScheme: theme })
            await page.waitForTimeout(500)

            // Screenshot
            const screenshotPath = path.join(outDir, `${label}.png`)
            await page.screenshot({ path: screenshotPath, fullPage: true })

            // Axe-core audit
            await page.addScriptTag({ content: axeSource })
            const axeResults = await page.evaluate(async () => {
              try {
                return await axe.run(document, {
                  runOnly: { type: 'tag', values: ['wcag2aa', 'wcag21aa', 'section508'] }
                })
              } catch(e) {
                return { error: e.message }
              }
            })

            // Check for contrast issues specifically
            const contrastIssues = axeResults.violations?.filter(v =>
              v.id.includes('color-contrast') || v.id.includes('contrast')
            ) || []
            const allViolations = axeResults.violations || []
            const pass = contrastIssues.length === 0 && allViolations.filter(v => v.impact === 'critical' || v.impact === 'serious').length === 0

            const result = {
              label,
              url,
              locale,
              theme,
              viewport: vp.label,
              route: route.label,
              pass,
              violations: allViolations.map(v => ({
                id: v.id,
                impact: v.impact,
                help: v.help,
                helpUrl: v.helpUrl,
                nodes: v.nodes.length,
                tags: v.tags,
              })),
              contrastViolations: contrastIssues.map(v => ({
                id: v.id,
                nodes: v.nodes.map(n => ({
                  target: n.target,
                  html: n.html?.slice(0, 120),
                  failureSummary: n.failureSummary?.slice(0, 200),
                })),
              })),
              screenshots: screenshotPath,
            }
            allResults.push(result)
            process.stdout.write(pass ? 'PASS\n' : `FAIL (${allViolations.length} violations)\n`)
          } catch (err) {
            process.stdout.write(`ERROR: ${err.message?.slice(0, 60)}\n`)
            allResults.push({
              label, url, locale, theme, viewport: vp.label, route: route.label,
              pass: false, violations: [], contrastViolations: [],
              error: err.message,
            })
          }

          await context.close()
        }
      }
    }
  }

  await browser.close()

  // Summary
  const total = allResults.length
  const passed = allResults.filter(r => r.pass).length
  const failed = allResults.filter(r => !r.pass).length
  const contrastFails = allResults.filter(r => r.contrastViolations?.length > 0).length
  const violationsByVs = {}
  const contrastDetails = []

  for (const r of allResults) {
    for (const v of r.violations || []) {
      const key = v.id
      if (!violationsByVs[key]) violationsByVs[key] = { id: key, count: 0, impacts: {}, pages: new Set() }
      violationsByVs[key].count++
      violationsByVs[key].impacts[v.impact] = (violationsByVs[key].impacts[v.impact] || 0) + 1
      violationsByVs[key].pages.add(r.label)
    }
    for (const cv of r.contrastViolations || []) {
      contrastDetails.push({ page: r.label, url: r.url, theme: r.theme, viewport: r.viewport, nodes: cv.nodes?.length || 0 })
    }
  }

  // Write report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: base,
    summary: { total, passed, failed, contrastFails },
    violationBreakdown: Object.entries(violationsByVs).map(([k, v]) => ({
      id: v.id,
      count: v.count,
      impacts: v.impacts,
      affectedPages: v.pages.size,
      pages: [...v.pages],
    })).sort((a, b) => b.count - a.count),
    contrastFailDetails: contrastDetails,
    allResults,
  }

  const reportPath = path.join(outDir, 'full-report.json')
  await fs.writeJSON(reportPath, report, { spaces: 2 })

  // Pretty console summary
  console.log(`\n${'='.repeat(50)}`)
  console.log(`FULL AUDIT COMPLETE`)
  console.log(`${'='.repeat(50)}`)
  console.log(`Total checks: ${total}`)
  console.log(`Passed:       ${passed}`)
  console.log(`Failed:       ${failed}`)
  console.log(`Contrast-specific failures: ${contrastFails}`)
  console.log(``)
  if (Object.keys(violationsByVs).length > 0) {
    console.log(`Violations by type:`)
    for (const [k, v] of Object.entries(violationsByVs).sort((a,b) => b[1].count - a[1].count)) {
      console.log(`  ${k}: ${v.count}x (${Object.entries(v.impacts).map(([i,c]) => `${i}=${c}`).join(', ')}) — ${v.pages.size} pages`)
    }
  }
  console.log(``)
  console.log(`Results saved to: ${reportPath}`)
  console.log(`Screenshots in:   ${outDir}`)
}

runAudit().catch(err => {
  console.error('Audit failed:', err.message)
  process.exit(1)
})
