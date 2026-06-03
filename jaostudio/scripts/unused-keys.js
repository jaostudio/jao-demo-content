const fs = require('fs')
const path = require('path')
const en = require('../messages/en.json')

const SRC_DIR = path.resolve(__dirname, '../src')

function flatten(obj, prefix = '') {
  const result = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      result.push({ key: fullKey, namespace: key })
      result.push(...flatten(value, fullKey))
    } else {
      result.push({ key: fullKey, value: String(value) })
    }
  }
  return result
}

function findTsFiles(dir) {
  const files = []
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true })
    for (const e of entries) {
      const p = path.join(d, e.name)
      if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        walk(p)
      } else if (e.isFile() && /\.(ts|tsx)$/.test(e.name)) {
        files.push(p)
      }
    }
  }
  walk(dir)
  return files
}

const tsFiles = findTsFiles(SRC_DIR)
const sourceContent = tsFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')

const allKeys = flatten(en)
const nsKeys = {}
for (const entry of allKeys) {
  const parts = entry.key.split('.')
  if (parts.length >= 2) {
    const ns = parts[0]
    const key = parts.slice(1).join('.')
    if (!nsKeys[ns]) nsKeys[ns] = []
    nsKeys[ns].push(key)
  }
}

let unusedCount = 0
for (const [ns, keys] of Object.entries(nsKeys)) {
  for (const key of keys) {
    const pattern1 = new RegExp(`['"\`]${key}['"\`]`)
    const pattern2 = new RegExp(`['"\`]${ns}\\.${key}['"\`]`)
    const pattern3 = new RegExp(`key: '${key}'`)
    if (!pattern1.test(sourceContent) && !pattern2.test(sourceContent) && !pattern3.test(sourceContent)) {
      console.log(`  ⚠  [${ns}] Possibly unused: "${key}"`)
      unusedCount++
    }
  }
}

if (unusedCount === 0) {
  console.log('  ✅ No potentially unused keys found.\n')
} else {
  console.log(`\n  Found ${unusedCount} potentially unused keys. Review carefully — some may use dynamic access (e.g. t(\`card\${i}Title\`)).\n`)
}

process.exit(0)
