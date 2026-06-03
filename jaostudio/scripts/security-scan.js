const fs = require('fs')
const path = require('path')

const reportsRoot = path.join(__dirname, '..', 'reports', 'security')
if (!fs.existsSync(reportsRoot)) {
  console.error('reports/security directory not found:', reportsRoot)
  process.exit(1)
}
const subdirs = fs.readdirSync(reportsRoot).filter(d => fs.statSync(path.join(reportsRoot, d)).isDirectory()).sort()
if (!subdirs.length) {
  console.error('no dated reports in', reportsRoot)
  process.exit(1)
}
const baseDir = path.join(reportsRoot, subdirs[subdirs.length - 1])

function latestFile(prefix) {
  const files = fs.readdirSync(baseDir).filter(f => f.startsWith(prefix)).sort()
  return files.length ? path.join(baseDir, files[files.length-1]) : null
}

const headersFile = latestFile('headers-')
const tlsFile = latestFile('tls-')
const outFile = path.join(baseDir, 'security-analysis-' + Date.now() + '.txt')

const out = []
out.push('Security scan analysis for ' + new Date().toISOString())
out.push('baseDir: ' + baseDir)
out.push('')

if (!headersFile) {
  out.push('No headers file found.')
} else {
  out.push('Headers file: ' + headersFile)
  const txt = fs.readFileSync(headersFile, 'utf8')
  out.push('--- Raw headers ---')
  out.push(txt)
  out.push('')
  const headers = {}
  txt.split(/\r?\n/).forEach(l => {
    const idx = l.indexOf(':')
    if (idx > 0) {
      const k = l.slice(0, idx).trim().toLowerCase()
      const v = l.slice(idx + 1).trim()
      headers[k] = v
    }
  })

  out.push('--- Header checks ---')
  if (!headers['content-security-policy']) out.push('CSP: MISSING')
  else {
    out.push('CSP: ' + headers['content-security-policy'])
    if (headers['content-security-policy'].includes("unsafe-inline") || headers['content-security-policy'].includes("'unsafe-inline'")) out.push('CSP contains unsafe-inline')
    if (headers['content-security-policy'].includes("unsafe-eval") || headers['content-security-policy'].includes("'unsafe-eval'")) out.push('CSP contains unsafe-eval')
  }
  if (!headers['strict-transport-security']) out.push('HSTS: MISSING')
  else out.push('HSTS: ' + headers['strict-transport-security'])
  ['x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy'].forEach(h => {
    out.push(h + ': ' + (headers[h] || 'MISSING'))
  })
}

if (!tlsFile) {
  out.push('No TLS file found.')
} else {
  out.push('TLS probe file: ' + tlsFile)
  const jt = JSON.parse(fs.readFileSync(tlsFile, 'utf8'))
  out.push('--- TLS details ---')
  out.push('protocol: ' + jt.protocol)
  out.push('cipher: ' + JSON.stringify(jt.cipher))
  out.push('authorized: ' + jt.authorized)
  out.push('peer cert subject: ' + JSON.stringify(jt.peerCert.subject || {}))
  out.push('peer cert issuer: ' + JSON.stringify(jt.peerCert.issuer || {}))
  if (jt.peerCert && jt.peerCert.valid_to) out.push('cert valid to: ' + jt.peerCert.valid_to)
}

fs.writeFileSync(outFile, out.join('\n'))
console.log('analysis written to', outFile)
