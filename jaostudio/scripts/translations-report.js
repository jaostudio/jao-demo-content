const en = require('../messages/en.json')
const tl = require('../messages/tl.json')

const args = process.argv.slice(2)
const failUnder = parseArg('--fail-under')
const nsThresholds = parseNamespaceThresholds()
const detectLeakage = args.includes('--detect-english-leakage')
const detectDrift = args.includes('--detect-drift')
const detectMetaLength = args.includes('--detect-meta-length')

function parseArg(name) {
  const arg = args.find((a) => a.startsWith(`${name}=`))
  return arg ? parseFloat(arg.split('=')[1]) : null
}

function parseNamespaceThresholds() {
  const arg = args.find((a) => a.startsWith('--namespace-threshold'))
  if (!arg) return null
  const pairs = arg.split('=')[1].split(',')
  const map = {}
  for (const p of pairs) {
    const [ns, val] = p.split('=')
    map[ns] = parseFloat(val)
  }
  return map
}

function flatten(obj, prefix = '') {
  const result = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      result.push(...flatten(value, path))
    } else {
      result.push({ path, value: String(value) })
    }
  }
  return result
}

const enKeys = flatten(en)
const tlKeys = flatten(tl)

const enMap = new Map(enKeys.map((k) => [k.path, k.value]))
const tlMap = new Map(tlKeys.map((k) => [k.path, k.value]))

const byNamespace = {}
const driftIssues = []
const leakageIssues = []

for (const { path, value: enVal } of enKeys) {
  const ns = path.split('.')[0]
  if (!byNamespace[ns]) byNamespace[ns] = { total: 0, done: 0 }
  byNamespace[ns].total++

  const tlVal = tlMap.get(path)

  if (tlVal === undefined) {
    driftIssues.push({ path, enVal })
    byNamespace[ns].done++
    continue
  }

  if (tlVal !== enVal) {
    byNamespace[ns].done++
  }

  if (detectLeakage && tlVal === enVal) {
    const plainVal = enVal.toLowerCase()
    if (/[a-z]{3,}/.test(plainVal) && !/^[A-Z\s]+$/.test(enVal)) {
      leakageIssues.push({ path, enVal, tlVal })
    }
  }
}

const sorted = Object.entries(byNamespace).sort((a, b) => b[1].total - a[1].total)

const nsPad = Math.max(...sorted.map(([n]) => n.length), 9)
const donePad = 4
const totalPad = 5

const sep = '-'.repeat(nsPad + donePad + totalPad + 14)

console.log('\nTranslation Coverage Report\n')
console.log(`  ${'Namespace'.padEnd(nsPad)} Done   Total   Coverage`)
console.log(`  ${sep}`)

let totalDone = 0
let totalAll = 0
let exitCode = 0

for (const [ns, { total, done }] of sorted) {
  const pct = ((done / total) * 100).toFixed(1)
  console.log(
    `  ${ns.padEnd(nsPad)} ${String(done).padStart(donePad)}   ${String(total).padStart(totalPad)}   ${String(pct).padStart(5)}%`,
  )
  totalDone += done
  totalAll += total

  if (nsThresholds && nsThresholds[ns] !== undefined && done / total < nsThresholds[ns] / 100) {
    console.error(`  ❌ ${ns} at ${pct}% (threshold: ${nsThresholds[ns]}%)`)
    exitCode = 1
  }
}

const overall = ((totalDone / totalAll) * 100).toFixed(1)
console.log(`  ${sep}`)
console.log(`  ${'TOTAL'.padEnd(nsPad)} ${String(totalDone).padStart(donePad)}   ${String(totalAll).padStart(totalPad)}   ${String(overall).padStart(5)}%\n`)

if (failUnder !== null && totalDone / totalAll < failUnder / 100) {
  console.error(`  ❌ Overall coverage ${overall}% is below threshold ${failUnder}%\n`)
  exitCode = 1
}

if (detectDrift && driftIssues.length > 0) {
  console.log(`  Drift Issues (keys in en.json missing from tl.json):\n`)
  for (const { path, enVal } of driftIssues) {
    console.log(`    ${path}: "${enVal}"`)
  }
  console.log()
  exitCode = 1
}

if (detectLeakage && leakageIssues.length > 0) {
  console.log(`  Potential English Leakage (tl.json matches en.json):\n`)
  for (const { path, enVal } of leakageIssues.slice(0, 20)) {
    console.log(`    ${path}: "${enVal}"`)
  }
  if (leakageIssues.length > 20) {
    console.log(`    ... and ${leakageIssues.length - 20} more`)
  }
  console.log()
}

if (detectMetaLength) {
  const metaTitleKeys = [...enKeys, ...tlKeys].filter((k) => k.path.endsWith('.metaTitle'))
  const metaDescKeys = [...enKeys, ...tlKeys].filter((k) => k.path.endsWith('.metaDescription'))
  let metaOk = true

  for (const { path, value } of metaTitleKeys) {
    if (value.length > 60) {
      console.error(`  ❌ [${path}] metaTitle is ${value.length} chars (max 60): "${value}"`)
      metaOk = false
    }
  }
  for (const { path, value } of metaDescKeys) {
    if (value.length > 160) {
      console.error(`  ❌ [${path}] metaDescription is ${value.length} chars (max 160): "${value}"`)
      metaOk = false
    }
  }
  if (metaOk) {
    console.log(`  ✅ All metaTitle ≤ 60 chars and metaDescription ≤ 160 chars.\n`)
  } else {
    exitCode = 1
  }
}

process.exit(exitCode)
