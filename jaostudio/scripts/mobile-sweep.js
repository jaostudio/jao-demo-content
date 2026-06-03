#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')
const yargs = require('yargs')

const argv = yargs.option('url',{type:'string',demandOption:true}).argv
const base = argv.url.replace(/\/$/, '')
const pages = ['/', '/projects', '/services', '/process', '/contact', '/#work']
const widths = [360, 390, 412]

;(async ()=>{
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const outBase = path.join(process.cwd(), '.opencode', 'screenshots')
  await fs.ensureDir(outBase)

  for(const p of pages){
    for(const w of widths){
      const destDir = path.join(outBase, p.replace(/[^a-z0-9\-]/ig,'').replace(/^$/,'root'))
      await fs.ensureDir(destDir)
      const filename = path.join(destDir, `${w}.png`)
      const url = base + p
      console.log('Capturing', url, 'at', w)
      try{
        await page.setViewportSize({ width: w, height: 800 })
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      }catch(e){ console.warn('nav error', e && e.message) }
      await page.waitForTimeout(800)

      // attempt to wake animations and allow safe settle
      try{ await page.evaluate(()=>document.fonts.status ) }catch(e){}
      await page.waitForTimeout(300)

      try{
        await page.screenshot({ path: filename, fullPage: false })
        const stat = await fs.stat(filename)
        console.log('Wrote', filename, stat.size)
      }catch(e){ console.warn('screenshot failed', e && e.message) }
    }
  }

  await browser.close()
  console.log('Done. Screenshots in .opencode/screenshots')
})()
