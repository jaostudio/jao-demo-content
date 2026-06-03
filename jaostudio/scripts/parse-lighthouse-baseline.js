const fs = require('fs')
const path = require('path')

const REPORTS_DIR = path.join(__dirname, '..', 'lighthouse', '2026-06-02')
const PREFIX = 'portfolio-v1-git-fix-perf-acc-7567aa-jamesonolitoquits-projects.vercel.app'

const reportFiles = fs.readdirSync(REPORTS_DIR)
  .filter(f => f.startsWith(PREFIX) && f.endsWith('.json') && f !== '_summary.json')

const THRESHOLDS = { perf: 0.9, lcp: 2500, cls: 0.05, tbt: 150 }

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

console.log('\n=== DESKTOP (BASELINE 2026-06-02) ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB')
console.log('-'.repeat(100))
for (const r of rows.filter(r => r.formFactor === 'desktop')) {
  console.log(`${r.route.padEnd(20)} | ${(r.perf * 100).toFixed(0).padStart(3)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt).padStart(3)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes).padStart(3)} | ${fmtBytes(r.imgBytes).padStart(3)}`)
}

console.log('\n=== MOBILE (BASELINE 2026-06-02) ===\n')
console.log('Route | Perf | LCP | CLS | TBT | INP | JS KB | Img KB')
console.log('-'.repeat(100))
for (const r of rows.filter(r => r.formFactor === 'mobile')) {
  console.log(`${r.route.padEnd(20)} | ${(r.perf * 100).toFixed(0).padStart(3)} | ${fmtS(r.lcp)}s | ${r.cls.toFixed(3)} | ${fmtMs(r.tbt).padStart(3)}ms | ${r.inp ? fmtMs(r.inp) + 'ms' : 'N/A'} | ${fmtBytes(r.jsBytes).padStart(3)} | ${fmtBytes(r.imgBytes).padStart(3)}`)
}

const summaryPath = path.join(REPORTS_DIR, '_summary_baseline.json')
fs.writeFileSync(summaryPath, JSON.stringify({ rows, generatedAt: new Date().toISOString() }, null, 2))
console.log(`\nSummary: ${summaryPath}`)
