const TARGET = process.env.TARGET_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000'

const expectedHeaders = [
  { name: 'X-Content-Type-Options', expected: 'nosniff' },
  { name: 'X-Frame-Options', expected: 'DENY' },
  { name: 'X-XSS-Protection', expected: '0' },
  { name: 'Referrer-Policy', expected: 'strict-origin-when-cross-origin' },
  { name: 'Strict-Transport-Security', expected: 'max-age=31536000; includeSubDomains; preload' },
  { name: 'Content-Security-Policy' },
  { name: 'Permissions-Policy' },
  { name: 'Cross-Origin-Opener-Policy', expected: 'same-origin' },
  { name: 'Cross-Origin-Resource-Policy', expected: 'same-origin' },
]

async function check() {
  const url = TARGET.startsWith('http') ? TARGET : `https://${TARGET}`
  console.log(`\n  Checking security headers for: ${url}\n`)

  let passed = 0
  let failed = 0

  const res = await fetch(url, { redirect: 'follow' })

  for (const h of expectedHeaders) {
    const val = res.headers.get(h.name)
    if (!val) {
      console.log(`  \u2716 ${h.name} — MISSING`)
      failed++
      continue
    }
    if (h.expected && val !== h.expected && !val.includes(h.expected)) {
      console.log(`  \u2716 ${h.name} — expected "${h.expected}" got "${val}"`)
      failed++
      continue
    }
    console.log(`  \u2714 ${h.name}: ${val}`)
    passed++
  }

  console.log(`\n  Result: ${passed} passed, ${failed} failed\n`)
  process.exit(failed > 0 ? 1 : 0)
}

check().catch((err) => {
  console.error(`  \u2716 Error: ${err.message}`)
  process.exit(1)
})
