#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')
const https = require('https')

const BASE = (process.argv[2] || 'https://jaostudio.vercel.app').replace(/\/+$/, '')
const LOCALES = ['en', 'tl']
const THEMES = ['dark', 'light']
const VIEWPORTS = [
  { label: 'desktop', w: 1200, h: 900 },
  { label: 'mobile', w: 412, h: 915 },
]
const ROUTES = [
  '/', '/studio', '/contact', '/cv', '/demos', '/docs/demo-credentials',
  '/playground', '/projects', '/services',
  '/projects/isp-platform', '/projects/landing-page', '/projects/web-application',
  '/case-studies',
]

const stamp = new Date().toISOString().split('T')[0]
const outDir = path.join(process.cwd(), 'reports', 'full-audit', stamp)
const resultsFile = path.join(outDir, 'results.jsonl')
const summaryFile = path.join(outDir, 'summary.json')

let totals = { total: 0, passed: 0, failed: 0, contrastFails: 0 }
const violationMap = {}

function ratio(hex1, hex2) {
  const lin = c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  const l = h => 0.2126 * lin(parseInt(h.slice(1,3),16)) + 0.7152 * lin(parseInt(h.slice(3,5),16)) + 0.0722 * lin(parseInt(h.slice(5,7),16))
  const l1 = l(hex1), l2 = l(hex2)
  return (Math.max(l1,l2)+0.05) / (Math.min(l1,l2)+0.05)
}

async function fetchAxe(u) {
  return new Promise((resolve, reject) => {
    https.get(u, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(d)); }).on('error', reject)
  })
}

;(async () => {
  await fs.ensureDir(outDir)
  const axeSrc = await fetchAxe('https://cdn.jsdelivr.net/npm/axe-core@4.11.4/axe.min.js')
  const browser = await chromium.launch()
  const results = []

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        for (const vp of VIEWPORTS) {
          const label = `${locale}_${theme}_${vp.label}${route.replace(/\//g,'_') || '_home'}`
          const url = `${BASE}/${locale}${route}`
          process.stdout.write(`  ${label}... `)

          const ctx = await browser.newContext({
            viewport: { width: vp.w, height: vp.h },
            colorScheme: theme,
            deviceScaleFactor: 1,
          })
          const page = await ctx.newPage()
          let result = { label, url, locale, theme, viewport: vp.label, route: route || '/', pass: false, violations: [] }

          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 })
            await page.emulateMedia({ colorScheme: theme })
            await page.evaluate(t => { try { localStorage.setItem('theme', t) } catch(e) {} }, theme)
            await page.waitForTimeout(300)

            // Screenshot
            await page.screenshot({ path: path.join(outDir, `${label}.png`), fullPage: true })

            // Axe
            await page.addScriptTag({ content: axeSrc })
            const axe = await page.evaluate(async () => {
              try { return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2aa','wcag21aa','section508'] } }) }
              catch(e) { return { violations: [], error: e.message } }
            })

            result.violations = (axe.violations || []).map(v => ({
              id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
              tags: v.tags,
            }))
            result.contrastFails = (axe.violations || []).filter(v => v.id.includes('contrast')).length
            result.pass = (axe.violations || []).filter(v => v.impact === 'critical' || v.impact === 'serious').length === 0

            totals.total++
            if (result.pass) totals.passed++
            else totals.failed++
            if (result.contrastFails > 0) totals.contrastFails++

            for (const v of result.violations) {
              if (!violationMap[v.id]) violationMap[v.id] = { id: v.id, count: 0, impact: v.impact, pages: new Set() }
              violationMap[v.id].count++
              violationMap[v.id].pages.add(label)
            }

            process.stdout.write(result.pass ? 'PASS\n' : `FAIL (${result.violations.length} violations)\n`)
          } catch (err) {
            process.stdout.write(`ERROR: ${err.message?.slice(0,60)}\n`)
            result.error = err.message
            totals.total++
            totals.failed++
          }

          results.push(result)
          // Write incremental
          await fs.appendFile(resultsFile, JSON.stringify(result) + '\n')
          await ctx.close()
        }
      }
    }
  }

  await browser.close()

  // Build summary
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE,
    total: totals.total,
    passed: totals.passed,
    failed: totals.failed,
    contrastFails: totals.contrastFails,
    violationBreakdown: Object.values(violationMap).map(v => ({
      id: v.id, count: v.count, impact: v.impact, affectedPages: v.pages.size,
    })).sort((a,b) => b.count - a.count),
  }
  await fs.writeJSON(summaryFile, summary, { spaces: 2 })

  console.log(`\n${'='.repeat(50)}`)
  console.log(`FULL AUDIT COMPLETE`)
  console.log(`${'='.repeat(50)}`)
  console.log(`Total:  ${totals.total}`)
  console.log(`Passed: ${totals.passed}`)
  console.log(`Failed: ${totals.failed}`)
  console.log(`Contrast-specific failures: ${totals.contrastFails}`)
  if (Object.keys(violationMap).length > 0) {
    console.log(`\nViolations:`)
    for (const [id, v] of Object.entries(violationMap).sort((a,b) => b[1].count - a[1].count)) {
      console.log(`  ${id} (${v.impact}): ${v.count}x — ${v.pages.size} pages affected`)
    }
  }
  console.log(`\nReport: ${summaryFile}`)
})().catch(err => { console.error('FATAL:', err.message); process.exit(1) })
