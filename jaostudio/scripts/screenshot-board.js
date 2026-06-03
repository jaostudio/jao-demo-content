#!/usr/bin/env node
const fs = require('fs-extra')
const path = require('path')
const { chromium } = require('playwright')
const yargs = require('yargs')

const argv = yargs
  .option('url', { type: 'string', demandOption: true })
  .option('out', { type: 'string', default: 'reports/screenshots', description: 'Output dir' })
  .argv

const base = argv.url.replace(/\/$/, '')
const outRoot = path.resolve(process.cwd(), argv.out)

const ROUTES = ['/', '/projects', '/projects/isp-platform', '/services', '/contact']

const VIEWPORTS = [
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 },
  { name: '768x1024', width: 768, height: 1024 },
]

const SCROLL_POINTS = ['top', 'mid', 'full']

;(async () => {
  await fs.ensureDir(outRoot)
  const browser = await chromium.launch()

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await context.newPage()

    for (const route of ROUTES) {
      const url = base + route
      const routeDir = path.join(outRoot, vp.name, route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_'))

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      } catch (e) {
        console.warn(`[${vp.name}] ${route} — networkidle timeout, proceeding`)
      }

      try {
        await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 8000 })
      } catch (e) { /* proceed */ }

      await page.waitForTimeout(600)

      const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight)
      await fs.ensureDir(routeDir)

      // top screenshot
      await page.screenshot({ path: path.join(routeDir, 'top.png'), fullPage: false })
      console.log(`[${vp.name}] ${route} — top captured`)

      // mid screenshot (scroll to ~40%)
      const midY = Math.round(fullHeight * 0.4)
      await page.evaluate((y) => window.scrollTo(0, y), midY)
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(routeDir, 'mid.png'), fullPage: false })
      console.log(`[${vp.name}] ${route} — mid captured`)

      // full-page screenshot
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(200)
      await page.screenshot({ path: path.join(routeDir, 'full.png'), fullPage: true })
      console.log(`[${vp.name}] ${route} — full captured`)
    }

    await context.close()
  }

  await browser.close()
  console.log('\nAll screenshots saved under', outRoot)
  console.log('\nStructure:')
  console.log('  reports/screenshots/<viewport>/<route>/{top,mid,full}.png')
})()
