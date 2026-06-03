const en = require('../messages/en.json')
const tl = require('../messages/tl.json')
const fs = require('fs')
const path = require('path')

const contractsPath = path.resolve(__dirname, '../src/i18n/contracts/contracts.ts')
const content = fs.readFileSync(contractsPath, 'utf8')
const regex = /export interface (\w+)Contract \{([^}]+)\}/g

const contracts = []
let match
while ((match = regex.exec(content)) !== null) {
  const ns = match[1].charAt(0).toLowerCase() + match[1].slice(1)
  contracts.push(ns)
}

let exitCode = 0

console.log('\nOrphan Namespace Detection\n')

for (const ns of contracts) {
  if (!en[ns]) {
    console.error(`  ❌ [en] Contract "${ns}Contract" declared but namespace "${ns}" missing from en.json`)
    exitCode = 1
  }
  if (!tl[ns]) {
    console.error(`  ❌ [tl] Contract "${ns}Contract" declared but namespace "${ns}" missing from tl.json`)
    exitCode = 1
  }
}

if (exitCode === 0) {
  console.log('  ✅ All contract namespaces present in both en.json and tl.json.\n')
} else {
  console.log()
}

process.exit(exitCode)
