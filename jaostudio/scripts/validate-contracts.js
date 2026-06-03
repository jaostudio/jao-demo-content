const en = require('../messages/en.json')
const tl = require('../messages/tl.json')

function extractAllContractKeys(content) {
  const regex = /export interface (\w+)Contract \{([^}]+)\}/g
  const result = {}
  let match
  while ((match = regex.exec(content)) !== null) {
    const ns = match[1].charAt(0).toLowerCase() + match[1].slice(1)
    const keys = match[2]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('/') && !l.startsWith('*'))
      .map((l) => {
        const parts = l.split(':')
        return parts.length > 1 ? parts[0].trim() : null
      })
      .filter(Boolean)
    result[ns] = keys
  }
  return result
}

function flattenKeys(obj, prefix = '') {
  const result = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) {
      result.push(path)
    } else if (typeof value === 'object' && value !== null) {
      result.push(path, ...flattenKeys(value, path))
    } else {
      result.push(path)
    }
  }
  return result
}

const fs = require('fs')
const path = require('path')
const contractsPath = path.resolve(__dirname, '../src/i18n/contracts/contracts.ts')
const content = fs.readFileSync(contractsPath, 'utf8')
const contracts = extractAllContractKeys(content)

let exitCode = 0

for (const [ns, expectedKeys] of Object.entries(contracts)) {
  const enKeys = flattenKeys(en[ns] || {}).map((k) => k.replace(`${ns}.`, ''))
  const tlKeys = flattenKeys(tl[ns] || {}).map((k) => k.replace(`${ns}.`, ''))

  for (const key of expectedKeys) {
    if (!enKeys.includes(key)) {
      console.error(`  ❌ [${ns}] Missing EN key: ${key}`)
      exitCode = 1
    }
    if (!tlKeys.includes(key)) {
      console.error(`  ❌ [${ns}] Missing TL key: ${key}`)
      exitCode = 1
    }
  }

  for (const key of enKeys) {
    const parent = key.includes('.') ? key.split('.')[0] : null
    if (!expectedKeys.includes(key) && !(parent && expectedKeys.includes(parent))) {
      console.warn(`  ⚠️  [${ns}] EN has extra key not in contract: ${key}`)
    }
  }
}

const enAll = flattenKeys(en)
const tlAll = flattenKeys(tl)

for (const key of enAll) {
  if (!tlAll.includes(key)) {
    console.error(`  ❌ Key in EN but missing from TL: ${key}`)
    exitCode = 1
  }
}
for (const key of tlAll) {
  if (!enAll.includes(key)) {
    console.error(`  ❌ Key in TL but missing from EN: ${key}`)
    exitCode = 1
  }
}

if (exitCode === 0) {
  console.log('  ✅ All contracts valid — no missing or extra keys.')
}
console.log()
process.exit(exitCode)
