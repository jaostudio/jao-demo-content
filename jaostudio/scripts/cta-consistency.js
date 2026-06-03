const en = require('../messages/en.json')
const tl = require('../messages/tl.json')

// Groups where all keys MUST resolve to the same value within a locale.
// Removed secondaryCTA/formSubmit/formSending — those contain
// semantically different actions (e.g. "View Projects" ≠ "Browse Projects").
const enforcedGroups = {
  primaryProjectCTA: [
    'navbar.cta',
    'hero.ctaPrimary',
    'process.cta',
    'services.ctaButton',
    'studio.cta',
    'projectDetail.ctaStartProject',
    'cv.startProject',
  ],
}

function resolveKey(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
}

let exitCode = 0

console.log('\nCTA Consistency Report\n')

for (const [group, keys] of Object.entries(enforcedGroups)) {
  for (const locale of ['en', 'tl']) {
    const msgs = locale === 'en' ? en : tl
    const values = keys.map((k) => ({ key: k, value: resolveKey(msgs, k) }))
    const missing = values.filter((v) => v.value === undefined)
    if (missing.length > 0) {
      console.error(`  ❌ [${locale}/${group}] Missing keys: ${missing.map((v) => v.key).join(', ')}`)
      exitCode = 1
      continue
    }

    const baseline = values[0].value
    const divergent = values.filter((v) => v.value !== baseline)
    if (divergent.length > 0) {
      console.error(`  ❌ [${locale}/${group}] Divergent values:`)
      for (const { key, value } of values) {
        const note = value === baseline ? '(baseline)' : '⚠️  drift'
        console.error(`       ${key}: "${value}"  ${note}`)
      }
      exitCode = 1
    }
  }
}

if (exitCode === 0) {
  console.log('  ✅ Primary project CTA consistent across all pages and locales.\n')
} else {
  console.log()
}

process.exit(exitCode)
