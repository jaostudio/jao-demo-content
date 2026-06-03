const fs = require('fs')
const path = require('path')

const argDir = process.argv[2] || path.join(__dirname, '..', 'lighthouse', '2026-06-02')
const REPORTS_DIR = path.resolve(argDir)

const reportFiles = fs.readdirSync(REPORTS_DIR).filter(f => {
  if (!f.endsWith('.json')) return false
  if (f === '_summary.json' || f === '_summary_new.json' || f === '_summary_baseline.json') return false
  try {
    const probe = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8'))
    return probe && probe.audits && probe.audits['largest-contentful-paint']
  } catch {
    return false
  }
})

for (const f of reportFiles) {
  const d = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8'))
  const url = d.finalDisplayedUrl
  const isMobile = f.endsWith('_mobile.json')
  console.log(`\n=== ${url} [${isMobile ? 'mobile' : 'desktop'}] ===`)

  // LCP element
  const lcpEl = d.audits['largest-contentful-paint-element']
  if (lcpEl?.details?.items?.[0]?.node) {
    const n = lcpEl.details.items[0].node
    console.log(`LCP element: <${n.nodeLabel || n.snippet?.slice(0, 100)}>`)
  } else {
    console.log('LCP element: (none reported)')
  }

  // Render-blocking
  const rb = d.audits['render-blocking-resources']
  if (rb?.details?.items) {
    console.log(`Render-blocking: ${rb.details.items.length} resource(s)`)
    for (const it of rb.details.items.slice(0, 3)) {
      console.log(`  - ${it.url?.slice(0, 100)} (wastedMs: ${it.wastedMs})`)
    }
  }

  // Unused JS
  const unused = d.audits['unused-javascript']
  if (unused?.details?.items) {
    console.log(`Unused JS top entries: ${unused.details.items.length}`)
    for (const it of unused.details.items.slice(0, 3)) {
      console.log(`  - ${it.url?.slice(0, 100)} (wastedBytes: ${it.wastedBytes})`)
    }
  }

  // LCP breakdown
  const lcpBreakdown = d.audits['lcp-lazy-loaded']
  if (lcpBreakdown?.details?.items) {
    console.log(`LCP lazy-loaded entries: ${lcpBreakdown.details.items.length}`)
  }
  const lcpTiming = d.audits['prioritize-lcp-image']
  if (lcpTiming?.score !== null && lcpTiming?.score !== undefined) {
    console.log(`Prioritize LCP image: score=${lcpTiming.score} (${lcpTiming.displayValue || ''})`)
  }

  // Network requests
  const requests = d.audits['network-requests']?.details?.items || []
  const slow = requests
    .filter(r => r.networkEndTime && r.networkRequestTime && (r.networkEndTime - r.networkRequestTime) > 200)
    .sort((a, b) => (b.networkEndTime - a.networkRequestTime) - (a.networkEndTime - b.networkRequestTime))
    .slice(0, 3)
  if (slow.length) {
    console.log(`Slowest requests:`)
    for (const r of slow) {
      const dur = Math.round(r.networkEndTime - r.networkRequestTime)
      console.log(`  - ${r.url?.slice(0, 100)} (${dur}ms, ${Math.round((r.transferSize || 0) / 1024)}KB)`)
    }
  }
}
