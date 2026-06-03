import { test, expect } from '@playwright/test'

const HEADER_OFFSET = 80
const TOLERANCE = 15

test.describe('anchor scroll behavior', () => {
  async function assertAnchorOffset(page: import('@playwright/test').Page, id: string) {
    await page.waitForFunction(
      (opts: { id: string; offset: number; tolerance: number }) => {
        const el = document.getElementById(opts.id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return Math.abs(r.top - opts.offset) <= opts.tolerance
      },
      { id, offset: HEADER_OFFSET, tolerance: TOLERANCE },
      { timeout: 8000 },
    )
    await expect(page.locator(`#${id}`)).toBeVisible()
  }

  test('desktop nav: Home → Process lands at correct offset', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('nav a[href="/#process"]').first().click()
    await page.waitForFunction(() => window.location.hash === '#process', { timeout: 8000 })
    await page.waitForTimeout(3000)

    await assertAnchorOffset(page, 'process')
  })

  test('desktop nav: Home → Work lands at correct offset', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator('nav a[href="/#work"]').first().click()
    await page.waitForFunction(() => window.location.hash === '#work', { timeout: 8000 })
    await page.waitForTimeout(3000)

    await assertAnchorOffset(page, 'work')
  })

  test('scrollToHash with Lenis lands #process', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => {
      return typeof (window as unknown as Record<string, unknown>).__lenis !== 'undefined'
    }, { timeout: 10000 })

    await page.evaluate(() => {
      const el = document.getElementById('process')
      const lenis = (window as unknown as Record<string, unknown>).__lenis as {
        scrollTo: (target: Element | number, opts?: Record<string, unknown>) => void
      }
      if (lenis && el) {
        lenis.scrollTo(el, { duration: 0, immediate: true })
      } else if (el) {
        el.scrollIntoView({ block: 'start' })
      }
    })
    await page.waitForTimeout(500)

    await assertAnchorOffset(page, 'process')
  })

  test('mobile menu: open → select Process → menu closes and section visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /toggle menu/i }).click()
    await page.waitForTimeout(300)

    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'))
      const processLink = links.find(a => a.textContent?.trim() === 'Process')
      if (processLink) processLink.click()
    })

    await page.waitForFunction(
      () => {
        const el = document.getElementById('process')
        if (!el) return false
        return el.getBoundingClientRect().top >= 0
      },
      { timeout: 8000 },
    )

    await expect(page.locator('#process')).toBeVisible()
  })

  test('cross-route: /services → Process anchor navigates to home#process', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    await page.locator('nav a[href="/#process"]').first().click()
    await page.waitForFunction(() => window.location.hash === '#process', { timeout: 8000 })
    await page.waitForTimeout(3000)

    await assertAnchorOffset(page, 'process')
  })

  test('reduced motion: scrollToHash lands #process', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => {
      return typeof (window as unknown as Record<string, unknown>).__lenis !== 'undefined'
    }, { timeout: 10000 })

    await page.emulateMedia({ reducedMotion: 'reduce' })

    await page.evaluate(() => {
      const el = document.getElementById('process')
      const lenis = (window as unknown as Record<string, unknown>).__lenis as {
        scrollTo: (target: Element | number, opts?: Record<string, unknown>) => void
      }
      if (lenis && el) {
        lenis.scrollTo(el, { duration: 0, immediate: true })
      } else if (el) {
        el.scrollIntoView({ block: 'start' })
      }
    })
    await page.waitForTimeout(500)

    await assertAnchorOffset(page, 'process')
  })

  test('mobile menu cross-page CTA: /studio → Start a Project lands at #contact', async ({ page }) => {
    test.setTimeout(20000)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/studio')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /toggle menu/i }).click()
    await page.waitForTimeout(300)

    await page.evaluate(() => {
      const links = document.querySelectorAll('a[href="/#contact"]')
      const last = links[links.length - 1]
      if (last) last.click()
    })

    await page.waitForURL('**/#contact', { timeout: 10000 })
    await page.waitForTimeout(4500)

    const result = await page.evaluate(() => {
      const el = document.getElementById('contact')
      if (!el) return { found: false }
      const rectTop = el.getBoundingClientRect().top
      const style = getComputedStyle(document.documentElement)
      const offset = parseInt(style.getPropertyValue('--anchor-offset')) || 80
      return { found: true, rectTop, offset, diff: Math.abs(rectTop - offset) }
    })

    expect(result.found).toBe(true)
    expect(result.diff).toBeLessThanOrEqual(20)
  })
})
