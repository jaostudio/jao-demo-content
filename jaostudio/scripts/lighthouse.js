#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const lighthouse = require('lighthouse').default
const chromeLauncher = require('chrome-launcher')
const yargs = require('yargs')
const { chromium } = require('playwright')

const argv = yargs
  .option('url', {type: 'string', demandOption: true})
  .option('mobile', {type: 'boolean', default: false, description: 'Emulate mobile device'})
  .argv
const base = (Array.isArray(argv.url) ? argv.url[0] : argv.url).replace(/\/$/, '')
const isMobile = argv.mobile
// 2026-06-02 P1 baseline: added /tl to verify locale routing + translation payload.
const routes = ["/", "/tl", "/projects", "/projects/isp-platform", "/services", "/contact"]

const MOBILE_CONFIG = {
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
  throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
}

async function killChrome(chrome) {
  try { await chrome.kill() } catch (e) {
    // Windows temp cleanup may fail — non-critical
  }
}

async function runSingle(url, outDir){
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless','--no-sandbox','--disable-gpu']})
  const lhOptions = {port: chrome.port, output: 'json', ...(isMobile ? MOBILE_CONFIG : {})}
  try{
    const runnerResult = await lighthouse(url, lhOptions)
    const reportJson = runnerResult.report
    const name = url.replace(/https?:\/\//,'').replace(/[\/\:\?\=\&]/g,'_')
    const label = isMobile ? `${name}_mobile` : name
    await fs.ensureDir(outDir)
    const jsonPath = path.join(outDir, `${label}.json`)
    await fs.writeFile(jsonPath, reportJson, 'utf8')
    // also write html
    const html = await lighthouse(url, {...lhOptions, output:'html'})
    const htmlPath = path.join(outDir, `${label}.html`)
    await fs.writeFile(htmlPath, html.report, 'utf8')
    // screenshot the html report using Playwright
    const browser = await chromium.launch()
    const vp = isMobile ? {width:390,height:844} : {width:1200,height:900}
    const page = await browser.newPage({viewport: vp})
    await page.goto('file://' + htmlPath)
    const pngPath = path.join(outDir, `${label}.png`)
    await page.screenshot({path: pngPath, fullPage: true})
    await browser.close()
    await killChrome(chrome)
    return {jsonPath, htmlPath, pngPath}
  }catch(err){
    console.error('Lighthouse run failed for', url, err && err.message)
    await killChrome(chrome)
    throw err
  }
}

;(async ()=>{
  const stamp = new Date().toISOString().split('T')[0]
  const outDir = path.join(process.cwd(),'lighthouse', stamp)
  await fs.ensureDir(outDir)
  for(const r of routes){
    const url = base + r
    console.log('Running lighthouse for', url, isMobile ? '(mobile)' : '(desktop)')
    await runSingle(url, outDir)
    console.log('Done', url)
  }
  console.log('All lighthouse runs complete. Reports in', outDir)
})()
