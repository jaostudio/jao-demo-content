const fs = require('fs')
const path = require('path')

const argDir = process.argv[2]
const REPORTS_DIR = argDir
  ? path.resolve(argDir)
  : path.join(__dirname, '..', 'lighthouse', '2026-06-02')
const THRESHOLDS = {
  perf: 0.9,    // >= 90
  lcp: 2500,    // ms, < 2500
  cls: 0.05,    // < 0.05
  tbt: 150,     // ms, < 150
}

const reportFiles = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.json') && f !== '_summary.json')

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
  // Total byte weight by resource type
  const items = data.audits['resource-summary']?.details?.items ?? []
  let jsBytes = 0
  let imgBytes = 0
  let cssBytes = 0
  let fontBytes = 0
  let totalBytes = 0
  for (const item of items) {
    const size = item.transferSize || 0
    const type = (item.resourceType || '').toLowerCase()
    if (type === 'total') continue // skip the aggregate row
    totalBytes += size
    if (type === 'script') jsBytes += size
    else if (type === 'image') imgBytes += size
    else if (type === 'stylesheet') cssBytes += size
    else if (type === 'font') fontBytes += size
  }
  // Extract route key
  const isMobile = file.endsWith('_mobile.json')
  const cleanedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '') || '/'
  let route = cleanedUrl
    .replace('portfolio-v1-git-fix-perf-acc-7567aa-jamesonolitoquits-projects.vercel.app', '')
  if (!route) route = '/'
  rows.push({
    route,
    formFactor: isMobile ? 'mobile' : 'desktop',
    perf,
    lcp,
    cls,
    tbt,
    inp,
    fcp,
    tti,
    jsBytes,
    imgBytes,
    cssBytes,
    fontBytes,
    totalBytes,
  })
}

// Sort: desktop first, then by route
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

console.log('\n=== DESKTOP ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB | Pass/Fail')
console.log('-'.repeat(110))
const desktop = rows.filter(r => r.formFactor === 'desktop')
for (const r of desktop) {
  const p = pass(r.perf * 100, THRESHOLDS.perf * 100, 'higher')
  const l = pass(r.lcp, THRESHOLDS.lcp, 'lower')
  const c = pass(r.cls, THRESHOLDS.cls, 'lower')
  const t = pass(r.tbt, THRESHOLDS.tbt, 'lower')
  const overall = (p === 'PASS' && l === 'PASS' && c === 'PASS' && t === 'PASS') ? 'PASS' : 'FAIL'
  console.log(`${r.route} | ${(r.perf * 100).toFixed(0)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes)} | ${fmtBytes(r.imgBytes)} | ${overall}`)
}

console.log('\n=== MOBILE ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB | Pass/Fail')
console.log('-'.repeat(110))
const mobile = rows.filter(r => r.formFactor === 'mobile')
for (const r of mobile) {
  const p = pass(r.perf * 100, THRESHOLDS.perf * 100, 'higher')
  const l = pass(r.lcp, THRESHOLDS.lcp, 'lower')
  const c = pass(r.cls, THRESHOLDS.cls, 'lower')
  const t = pass(r.tbt, THRESHOLDS.tbt, 'lower')
  const overall = (p === 'PASS' && l === 'PASS' && c === 'PASS' && t === 'PASS') ? 'PASS' : 'FAIL'
  console.log(`${r.route} | ${(r.perf * 100).toFixed(0)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes)} | ${fmtBytes(r.imgBytes)} | ${overall}`)
}

console.log('\n=== SUMMARY ===\n')

// Worst route by perf (mobile)
const worstByPerf = [...rows].sort((a, b) => a.perf - b.perf)[0]
const bestByPerf = [...rows].sort((a, b) => b.perf - a.perf)[0]
const worstLCP = [...rows].sort((a, b) => b.lcp - a.lcp)[0]
const worstCLS = [...rows].sort((a, b) => b.cls - a.cls)[0]
const worstTBT = [...rows].sort((a, b) => b.tbt - a.tbt)[0]
const largestJS = [...rows].sort((a, b) => b.jsBytes - a.jsBytes)[0]
const largestImg = [...rows].sort((a, b) => b.imgBytes - a.imgBytes)[0]
const largestTotal = [...rows].sort((a, b) => b.totalBytes - a.totalBytes)[0]

console.log(`Worst route by Perf:        ${worstByPerf.route} (${worstByPerf.formFactor}) — ${(worstByPerf.perf * 100).toFixed(0)}`)
console.log(`Best route by Perf:         ${bestByPerf.route} (${bestByPerf.formFactor}) — ${(bestByPerf.perf * 100).toFixed(0)}`)
console.log(`Worst LCP:                  ${worstLCP.route} (${worstLCP.formFactor}) — ${fmtS(worstLCP.lcp)}s`)
console.log(`Worst CLS:                  ${worstCLS.route} (${worstCLS.formFactor}) — ${worstCLS.cls.toFixed(3)}`)
console.log(`Worst TBT:                  ${worstTBT.route} (${worstTBT.formFactor}) — ${fmtMs(worstTBT.tbt)}ms`)
console.log(`Largest JS bundle:          ${largestJS.route} (${largestJS.formFactor}) — ${fmtBytes(largestJS.jsBytes)} KB`)
console.log(`Largest image payload:      ${largestImg.route} (${largestImg.formFactor}) — ${fmtBytes(largestImg.imgBytes)} KB`)
console.log(`Largest total transfer:     ${largestTotal.route} (${largestTotal.formFactor}) — ${fmtBytes(largestTotal.totalBytes)} KB`)

console.log('\n=== PER-ROUTE FULL METRICS (for the report) ===\n')
for (const r of rows) {
  console.log(`${r.route} [${r.formFactor}]: perf=${(r.perf * 100).toFixed(0)} lcp=${fmtS(r.lcp)}s cls=${r.cls.toFixed(3)} tbt=${fmtMs(r.tbt)}ms inp=${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} fcp=${fmtS(r.fcp)}s tti=${r.tti ? fmtS(r.tti) + 's' : 'N/A'} js=${fmtBytes(r.jsBytes)}KB img=${fmtBytes(r.imgBytes)}KB css=${fmtBytes(r.cssBytes)}KB font=${fmtBytes(r.fontBytes)}KB total=${fmtBytes(r.totalBytes)}KB`)
}

// Write JSON summary for the doc generator
const summaryPath = path.join(REPORTS_DIR, '_summary.json')
fs.writeFileSync(summaryPath, JSON.stringify({ rows, generatedAt: new Date().toISOString() }, null, 2))
console.log(`\nSummary JSON: ${summaryPath}`)
