#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')

const argv = process.argv.slice(2)
const url = argv[0] || 'https://jaostudio.vercel.app/'

;(async ()=>{
  const stampDate = new Date().toISOString().split('T')[0]
  const outDir = path.join(process.cwd(),'reports','accessibility', stampDate)
  await fs.ensureDir(outDir)
  const browser = await chromium.launch()
  const page = await browser.newPage({viewport: {width: 412, height: 915}})
  console.log('Opening', url)
  await page.goto(url, {waitUntil: 'load', timeout: 30000})
  console.log('Fetching axe-core to inject (server-side)')
  const https = require('https')
  const fetchAxe = (u) => new Promise((resolve, reject) => {
    https.get(u, (res) => {
      if (res.statusCode !== 200) return reject(new Error('Failed to fetch axe: ' + res.statusCode))
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (c) => data += c)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })

  const axeUrl = 'https://cdn.jsdelivr.net/npm/axe-core@4.11.4/axe.min.js'
  const axeSource = await fetchAxe(axeUrl)
  console.log('Injecting axe-core (inline)')
  await page.addScriptTag({ content: axeSource })
  console.log('Running axe')
  const results = await page.evaluate(async () => {
    return await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2aa', 'wcag21aa', 'section508'] } })
  })
  const stamp = new Date().toISOString().replace(/[:.]/g,'-')
  const outPath = path.join(outDir, `axe-${stamp}.json`)
  await fs.writeJSON(outPath, results, { spaces: 2 })
  console.log('Axe results saved to', outPath)
  await page.screenshot({ path: path.join(outDir, `axe-${stamp}.png`), fullPage: true })
  await browser.close()
})().catch((err)=>{
  console.error('Axe run failed:', err && err.message)
  process.exit(1)
})
