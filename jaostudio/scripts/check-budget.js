const { execSync } = require('child_process')
const path = require('path')

const BUDGETS = {
  sharedFirstLoadJsKb: { warn: 185, fail: 195 },
  homepageJsKb:        { warn: 320, fail: 350 },
  projectPageJsKb:     { warn: 300, fail: 330 },
}

function lastKb(raw) {
  const matches = String(raw).matchAll(/([\d.]+)\s*kB/gi)
  let last = null
  for (const m of matches) last = parseFloat(m[1])
  return last
}

function routeKind(line) {
  const t = line.trim()
  // tree-drawing prefixes like ├ └ +, then static/dynamic indicator
  const m = t.match(/^[┌├└+]\s*([○●])\s+(\/\S*)/)
  if (!m) return null
  return { dynamic: m[1] === '●', path: m[2] }
}

async function main() {
  const cwd = process.cwd()
  console.log('Building to extract bundle sizes...')
  const output = execSync('npm run build', { cwd, encoding: 'utf8' })

  const lines = output.split('\n')
  let sharedSize = null
  let homepageSize = null
  let projectPageSize = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('+ First Load JS shared by all')) {
      sharedSize = lastKb(trimmed)
      continue
    }

    const kind = routeKind(line)
    if (!kind) continue

    if (kind.path === '/') {
      homepageSize = lastKb(trimmed)
    } else if (kind.path === '/projects/[slug]') {
      projectPageSize = lastKb(trimmed)
    }
  }

  const results = {
    sharedFirstLoadJsKb: sharedSize,
    homepageJsKb: homepageSize,
    projectPageJsKb: projectPageSize,
  }

  let exitCode = 0
  const warnings = []
  const failures = []

  for (const [key, value] of Object.entries(results)) {
    const budget = BUDGETS[key]
    if (value === null) {
      warnings.push(`${key}: could not parse — check build output format`)
      continue
    }
    if (value > budget.fail) {
      failures.push(`${key}: ${value} kB exceeds failure threshold ${budget.fail} kB`)
      exitCode = 1
    } else if (value > budget.warn) {
      warnings.push(`${key}: ${value} kB exceeds warning threshold ${budget.warn} kB`)
    } else {
      console.log(`  ✓ ${key}: ${value} kB (budget: ${budget.warn} kB warn / ${budget.fail} kB fail)`)
    }
  }

  if (warnings.length) {
    console.log('\n\u26a0\ufe0f  Warnings:')
    warnings.forEach(w => console.log('  ', w))
  }

  if (failures.length) {
    console.log('\n\u274c Failures:')
    failures.forEach(f => console.log('  ', f))
  }

  if (exitCode === 0) {
    console.log('\n\u2705 All budgets met.')
  }

  process.exit(exitCode)
}

main().catch(err => {
  console.error('Budget check failed:', err.message)
  process.exit(1)
})
