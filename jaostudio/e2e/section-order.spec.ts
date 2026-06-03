import { test, expect } from '@playwright/test'

/**
 * P2.3: Section order on the homepage.
 *
 * Asserts the user-visible rendered order of the four anchored sections
 * (#work, #capabilities, #process, #contact) by comparing their rendered
 * top positions (boundingBox.y). This validates actual layout, not DOM
 * structure, so future refactors that preserve user-visible order won't
 * break the test.
 *
 * Expected order: Work -> Services -> Process -> Contact.
 */
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

const locales = [
  { prefix: '', label: 'en' },
  { prefix: 'tl', label: 'tl' },
] as const

async function getTop(page: import('@playwright/test').Page, selector: string): Promise<number> {
  // Wait for the section to mount. BelowFold sections are dynamic({ ssr: false })
  // inside a LazyMount (IntersectionObserver with 200px rootMargin) — they only
  // mount when their placeholder enters the viewport. Scroll the section into
  // view first to trigger the observer, then read the absolute document Y.
  const locator = page.locator(selector).first()
  await locator.waitFor({ state: 'attached', timeout: 20000 })
  await locator.scrollIntoViewIfNeeded()
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    const docY = await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const rect = el.getBoundingClientRect()
      if (rect.height === 0) return null
      return rect.top + window.scrollY
    }, selector)
    if (docY !== null && docY !== undefined) return docY
    await page.waitForTimeout(200)
  }
  throw new Error(`No bounding box for ${selector} after 20s`)
}

for (const vp of viewports) {
  for (const loc of locales) {
    test(`${vp.name} ${loc.label}: sections render in narrative order (Work -> Services -> Process -> Contact)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(`/${loc.prefix}`)
      await page.waitForLoadState('networkidle')

      const workTop = await getTop(page, '#work')
      const capabilitiesTop = await getTop(page, '#capabilities')
      const processTop = await getTop(page, '#process')
      const contactTop = await getTop(page, '#contact')

      // Required narrative: Work -> Services -> Process -> Contact.
      expect(workTop).toBeLessThan(capabilitiesTop)
      expect(capabilitiesTop).toBeLessThan(processTop)
      expect(processTop).toBeLessThan(contactTop)
    })
  }
}
