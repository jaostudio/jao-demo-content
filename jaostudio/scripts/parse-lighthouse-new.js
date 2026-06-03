const fs = require('fs')
const path = require('path')

const REPORTS_DIR = path.join(__dirname, '..', 'lighthouse', '2026-06-02')
const PREFIX = 'portfolio-v1-i2q09js0f-jamesonolitoquits-projects.vercel.app'

const reportFiles = fs.readdirSync(REPORTS_DIR)
  .filter(f => f.startsWith(PREFIX) && f.endsWith('.json') && f !== '_summary.json')

const THRESHOLDS = {
  perf: 0.9,
  lcp: 2500,
  cls: 0.05,
  tbt: 150,
}

const rows = []
for (const file of reportFiles) {
  const full = path.join(REPORTS_DIR, file)
  const data = JSON.parse(fs.readFileSync(full, 'utf8'))
  const url = data.finalDisplayedUrl || data.requestedUrl
  const audits = data.audits
  const cats = data.categories
  const perf = cats.performance.score
  const lcp = audits['largest-contentful-paint'].numericValue
  const cls = audits['cumulative-layout-shift'].numericValue
  const tbt = audits['total-blocking-time'].numericValue
  const inp = audits['experimental-interaction-to-next-paint']?.numericValue ?? null
  const fcp = audits['first-contentful-paint'].numericValue
  const tti = audits['interactive']?.numericValue ?? null
  const items = data.audits['resource-summary']?.details?.items ?? []
  let jsBytes = 0, imgBytes = 0, cssBytes = 0, fontBytes = 0, totalBytes = 0
  for (const item of items) {
    const size = item.transferSize || 0
    const type = (item.resourceType || '').toLowerCase()
    if (type === 'total') continue
    totalBytes += size
    if (type === 'script') jsBytes += size
    else if (type === 'image') imgBytes += size
    else if (type === 'stylesheet') cssBytes += size
    else if (type === 'font') fontBytes += size
  }
  const isMobile = file.endsWith('_mobile.json')
  let route = url.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/'
  rows.push({ route, formFactor: isMobile ? 'mobile' : 'desktop', perf, lcp, cls, tbt, inp, fcp, tti, jsBytes, imgBytes, cssBytes, fontBytes, totalBytes })
}

rows.sort((a, b) => {
  if (a.formFactor !== b.formFactor) return a.formFactor === 'desktop' ? -1 : 1
  return a.route.localeCompare(b.route)
})

const fmtBytes = b => `${Math.round(b / 1024)}`
const fmtMs = ms => ms.toFixed(0)
const fmtS = ms => (ms / 1000).toFixed(2)
const pass = (val, threshold, dir) => {
  if (val === null || val === undefined) return 'N/A'
  if (dir === 'lower') return val < threshold ? 'PASS' : 'FAIL'
  return val >= threshold ? 'PASS' : 'FAIL'
}

console.log('\n=== DESKTOP (NEW BUILD) ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB | Pass/Fail')
console.log('-'.repeat(110))
for (const r of rows.filter(r => r.formFactor === 'desktop')) {
  const p = pass(r.perf * 100, THRESHOLDS.perf * 100, 'higher')
  const l = pass(r.lcp, THRESHOLDS.lcp, 'lower')
  const c = pass(r.cls, THRESHOLDS.cls, 'lower')
  const t = pass(r.tbt, THRESHOLDS.tbt, 'lower')
  const overall = (p === 'PASS' && l === 'PASS' && c === 'PASS' && t === 'PASS') ? 'PASS' : 'FAIL'
  console.log(`${r.route.padEnd(20)} | ${(r.perf * 100).toFixed(0).padStart(3)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt).padStart(3)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes).padStart(3)} | ${fmtBytes(r.imgBytes).padStart(3)} | ${overall}`)
}

console.log('\n=== MOBILE (NEW BUILD) ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB | Pass/Fail')
console.log('-'.repeat(110))
for (const r of rows.filter(r => r.formFactor === 'mobile')) {
  const p = pass(r.perf * 100, THRESHOLDS.perf * 100, 'higher')
  const l = pass(r.lcp, THRESHOLDS.lcp, 'lower')
  const c = pass(r.cls, THRESHOLDS.cls, 'lower')
  const t = pass(r.tbt, THRESHOLDS.tbt, 'lower')
  const overall = (p === 'PASS' && l === 'PASS' && c === 'PASS' && t === 'PASS') ? 'PASS' : 'FAIL'
  console.log(`${r.route.padEnd(20)} | ${(r.perf * 100).toFixed(0).padStart(3)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt).padStart(3)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes).padStart(3)} | ${fmtBytes(r.imgBytes).padStart(3)} | ${overall}`)
}

console.log('\n=== SUMMARY (NEW BUILD) ===\n')
const worstByPerf = [...rows].sort((a, b) => a.perf - b.perf)[0]
const bestByPerf = [...rows].sort((a, b) => b.perf - a.perf)[0]
const worstLCP = [...rows].sort((a, b) => b.lcp - a.lcp)[0]
const worstTBT = [...rows].sort((a, b) => b.tbt - a.tbt)[0]
const largestJS = [...rows].sort((a, b) => b.jsBytes - a.jsBytes)[0]
console.log(`Worst Perf:      ${worstByPerf.route} (${worstByPerf.formFactor}) — ${(worstByPerf.perf * 100).toFixed(0)}`)
console.log(`Best Perf:       ${bestByPerf.route} (${bestByPerf.formFactor}) — ${(bestByPerf.perf * 100).toFixed(0)}`)
console.log(`Worst LCP:       ${worstLCP.route} (${worstLCP.formFactor}) — ${fmtS(worstLCP.lcp)}s`)
console.log(`Worst TBT:       ${worstTBT.route} (${worstTBT.formFactor}) — ${fmtMs(worstTBT.tbt)}ms`)
console.log(`Largest JS:      ${largestJS.route} (${largestJS.formFactor}) — ${fmtBytes(largestJS.jsBytes)} KB`)

const summaryPath = path.join(REPORTS_DIR, '_summary_new.json')
fs.writeFileSync(summaryPath, JSON.stringify({ rows, generatedAt: new Date().toISOString() }, null, 2))
console.log(`\nSummary: ${summaryPath}`)
