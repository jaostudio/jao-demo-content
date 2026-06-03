const fs = require('fs')

const baseline = JSON.parse(fs.readFileSync('lighthouse/2026-06-02/_summary_baseline.json', 'utf8'))
const current = JSON.parse(fs.readFileSync('lighthouse/2026-06-02/_summary_new.json', 'utf8'))

function indexByRoute(rows) {
  const m = new Map()
  for (const r of rows) m.set(`${r.formFactor}::${r.route}`, r)
  return m
}

const b = indexByRoute(baseline.rows)
const c = indexByRoute(current.rows)

const fmtDelta = (newV, oldV, dir) => {
  const delta = newV - oldV
  if (dir === 'higher') return delta >= 0 ? `+${delta.toFixed(0)}` : `${delta.toFixed(0)}`
  return delta >= 0 ? `+${delta.toFixed(0)}` : `${delta.toFixed(0)}`
}

const routes = ['/', '/tl', '/projects', '/projects/isp-platform', '/services', '/contact']

console.log('\n=== DELTA TABLE (current build vs 2026-06-02 baseline) ===\n')

for (const ff of ['desktop', 'mobile']) {
  console.log(`\n--- ${ff.toUpperCase()} ---\n`)
  console.log('Route                       | Perf Δ   | LCP Δ     | CLS Δ     | TBT Δ       | JS KB Δ | Verdict')
  console.log('-'.repeat(115))
  for (const r of routes) {
    const bRow = b.get(`${ff}::${r}`)
    const cRow = c.get(`${ff}::${r}`)
    if (!bRow || !cRow) continue
    const perfD = cRow.perf * 100 - bRow.perf * 100
    const lcpD = cRow.lcp - bRow.lcp
    const clsD = cRow.cls - bRow.cls
    const tbtD = cRow.tbt - bRow.tbt
    const jsD = Math.round((cRow.jsBytes - bRow.jsBytes) / 1024)
    const lcpBetter = lcpD < -50
    const lcpWorse = lcpD > 50
    const tbtBetter = tbtD < -20
    const tbtWorse = tbtD > 20
    const perfBetter = perfD > 0
    const perfWorse = perfD < 0
    let verdict = ''
    if ((lcpBetter && tbtBetter) || (lcpBetter && perfBetter)) verdict = 'IMPROVED'
    else if ((lcpWorse && tbtWorse) || perfWorse > 3) verdict = 'REGRESSED'
    else verdict = '~variance'
    console.log(
      `${r.padEnd(27)} | ${(perfD >= 0 ? '+' : '') + perfD.toFixed(0).padStart(3)}     | ${(lcpD >= 0 ? '+' : '') + (lcpD/1000).toFixed(2) + 's'.padStart(8)} | ${(clsD >= 0 ? '+' : '') + clsD.toFixed(3).padStart(8)} | ${(tbtD >= 0 ? '+' : '') + tbtD.toFixed(0).padStart(4) + 'ms'.padStart(7)}    | ${(jsD >= 0 ? '+' : '') + jsD.toString().padStart(3)} KB | ${verdict}`
    )
  }
}

console.log('\n=== KEY OBSERVATIONS ===\n')
const homeImprovements = []
const regressions = []
for (const ff of ['desktop', 'mobile']) {
  for (const r of routes) {
    const bRow = b.get(`${ff}::${r}`)
    const cRow = c.get(`${ff}::${r}`)
    if (!bRow || !cRow) continue
    const tbtD = cRow.tbt - bRow.tbt
    const lcpD = cRow.lcp - bRow.lcp
    const label = `${r} [${ff}]`
    if (tbtD < -20) homeImprovements.push(`${label}: TBT ${bRow.tbt.toFixed(0)}ms → ${cRow.tbt.toFixed(0)}ms (${tbtD.toFixed(0)}ms better)`)
    if (lcpD < -100) homeImprovements.push(`${label}: LCP ${(bRow.lcp/1000).toFixed(2)}s → ${(cRow.lcp/1000).toFixed(2)}s (${(lcpD/1000).toFixed(2)}s better)`)
    if (tbtD > 50) regressions.push(`${label}: TBT ${bRow.tbt.toFixed(0)}ms → ${cRow.tbt.toFixed(0)}ms (+${tbtD.toFixed(0)}ms worse)`)
    if (lcpD > 200) regressions.push(`${label}: LCP ${(bRow.lcp/1000).toFixed(2)}s → ${(cRow.lcp/1000).toFixed(2)}s (+${(lcpD/1000).toFixed(2)}s worse)`)
  }
}

console.log('Improvements (TBT < -20ms or LCP < -100ms):')
if (homeImprovements.length === 0) console.log('  (none)')
for (const i of homeImprovements) console.log(`  ✓ ${i}`)

console.log('\nRegressions (TBT > +50ms or LCP > +200ms):')
if (regressions.length === 0) console.log('  (none)')
for (const r of regressions) console.log(`  ✗ ${r}`)
