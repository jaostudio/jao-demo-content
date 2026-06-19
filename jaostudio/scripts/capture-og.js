#!/usr/bin/env node
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs-extra')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'og')
const OUT_PATH = path.join(OUT_DIR, 'og-home.png')

async function capture() {
  const url = process.argv[2] || 'http://localhost:3000'
  console.log(`\n  OG Capture — ${url}\n`)

  await fs.ensureDir(OUT_DIR)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: OUT_PATH })
    console.log(`  ✓ Saved: ${OUT_PATH} (${Math.round((await fs.stat(OUT_PATH)).size / 1024)} KB)\n`)
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}\n`)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

capture()
