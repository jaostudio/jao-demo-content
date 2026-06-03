#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const { chromium } = require('playwright')
const yargs = require('yargs')

const argv = yargs.option('url',{type:'string',demandOption:true}).argv
const base = argv.url.replace(/\/$/, '')
const projectsFile = path.join(process.cwd(),'src','lib','projects.ts')

function extractSlugs(content){
  const re = /slug:\s*'([a-z0-9\-]+)'/g
  const slugs = []
  let m
  while((m = re.exec(content))){ slugs.push(m[1]) }
  return slugs
}

;(async ()=>{
  const content = await fs.readFile(projectsFile,'utf8')
  const slugs = extractSlugs(content).slice(0,7)
  if(slugs.length===0) throw new Error('No project slugs found')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for(const slug of slugs){
    const outDir = path.join(process.cwd(),'public','projects',slug)
    await fs.ensureDir(outDir)
    const url = `${base}/projects/${slug}`
    console.log('Capturing', url)

    // 1. Set viewport before navigation
    await page.setViewportSize({ width: 1440, height: 900 })

    // 2. Navigate with network idle (all XHR/fonts/analytics settled)
    try{
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    }catch(e){ console.warn('networkidle timeout - proceeding', e && e.message) }

    // 3. Wait for font loading to finish
    try{
      await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 10000 })
    }catch(e){ console.warn('font wait timeout - proceeding', e && e.message) }

    // 4. Paint settle delay (hydration + framer-motion + layout shifts)
    await page.waitForTimeout(800)

    // 5. Force full scroll to trigger lazy images + lazy sections
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)

    // 6. Confirm viewport (re-set after scroll reset)
    await page.setViewportSize({ width: 1440, height: 900 })

    // 7. Hero screenshot (top of page)
    const heroPng = path.join(outDir,'hero.png')
    await page.screenshot({ path: heroPng, fullPage: false })
    // verify non-empty
    const heroStat = await fs.stat(heroPng)
    if(heroStat.size < 2000){
      console.warn('hero screenshot suspiciously small', heroStat.size, 'retrying with longer settle')
      await page.waitForTimeout(2000)
      await page.screenshot({ path: heroPng, fullPage: false })
    }

    // 8. Scroll to detail section (~800px down)
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForTimeout(400)
    const detailPng = path.join(outDir,'detail.png')
    await page.screenshot({ path: detailPng, fullPage: false })
    const detailStat = await fs.stat(detailPng)
    if(detailStat.size < 2000){
      console.warn('detail screenshot suspiciously small', detailStat.size)
    }

    // 9. Convert both to WebP with quality/size enforcement
    for(const pair of [{src:heroPng,dst:path.join(outDir,'hero.webp')},{src:detailPng,dst:path.join(outDir,'detail.webp')}]){
      let quality = 85
      let buf = await fs.readFile(pair.src)
      let webp = await sharp(buf).webp({quality}).toBuffer()
      while(webp.length > 300*1024 && quality > 40){ quality -= 5; webp = await sharp(buf).webp({quality}).toBuffer() }
      await fs.writeFile(pair.dst, webp)
      const stat = await fs.stat(pair.dst)
      console.log('Wrote', pair.dst, stat.size, 'bytes')
      await fs.remove(pair.src)
    }
  }

  await browser.close()
  console.log('All screenshots saved under public/projects')
  console.log('')
  console.log('Next step: verify file sizes vary (>20KB) and contain visible content')
  console.log('Then update gallery arrays in src/lib/projects.ts')
})()
