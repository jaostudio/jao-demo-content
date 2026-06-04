import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const OUT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots')

interface Capture {
  file: string
  url: string
}

interface Demo {
  name: string
  baseUrl: string
  captures: Capture[]
}

const demos: Demo[] = [
  {
    name: 'landing',
    baseUrl: 'https://jao-demo-landing.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'construction.png', url: '/construction' },
      { file: 'dental.png', url: '/dental' },
    ],
  },
  {
    name: 'commerce',
    baseUrl: 'https://jao-demo-commerce.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'products.png', url: '/products' },
      { file: 'cart.png', url: '/cart' },
      { file: 'checkout.png', url: '/checkout' },
      { file: 'admin.png', url: '/admin/orders' },
    ],
  },
  {
    name: 'marketplace',
    baseUrl: 'https://jao-demo-marketplace.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'listings.png', url: '/listings' },
    ],
  },
  {
    name: 'content',
    baseUrl: 'https://jao-demo-content.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'signin.png', url: '/signin' },
      { file: 'articles.png', url: '/articles' },
    ],
  },
  {
    name: 'webapp',
    baseUrl: 'https://jao-demo-webapp.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'signin.png', url: '/signin' },
    ],
  },
  {
    name: 'security',
    baseUrl: 'https://jao-demo-security.vercel.app',
    captures: [
      { file: 'home.png', url: '/' },
      { file: 'signin.png', url: '/signin' },
      { file: 'dashboard.png', url: '/dashboard' },
      { file: 'admin.png', url: '/admin/organizations' },
      { file: 'audit.png', url: '/audit' },
    ],
  },
]

async function capture(url: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await page.screenshot({ path: outputPath, fullPage: false })
  await browser.close()
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  let passed = 0
  let failed = 0

  for (const demo of demos) {
    const demoDir = path.join(OUT_DIR, demo.name)
    fs.mkdirSync(demoDir, { recursive: true })

    for (const c of demo.captures) {
      const fullUrl = `${demo.baseUrl}${c.url}`
      const outputPath = path.join(demoDir, c.file)
      const label = `${demo.name}/${c.file}`

      try {
        await capture(fullUrl, outputPath)
        console.log(`\u2713 ${label}`)
        passed++
      } catch (err) {
        const reason =
          err instanceof Error ? err.message.includes('timeout') ? 'timeout' : err.message : String(err)
        console.log(`\u2717 ${label} (${reason})`)
        failed++
      }
    }
  }

  console.log(`\nDone — ${passed} succeeded, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
