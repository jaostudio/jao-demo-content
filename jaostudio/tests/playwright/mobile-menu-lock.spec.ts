import { test, expect } from '@playwright/test'

const widths = [360, 375, 390, 412]
const height = 844

for (const w of widths) {
  test.describe(`Mobile menu lock — ${w}px`, () => {
    test(`should not change page scroll when menu is opened at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height })
      await page.goto('http://localhost:3000/')

      // try three positions: top, middle, near-footer
      const footerPos = await page.evaluate(() => Math.max(document.body.scrollHeight - 300, 0))
      const positions = [0, 650, footerPos]
      for (const pos of positions) {
        await page.evaluate((y) => window.scrollTo(0, y), pos)
        await page.waitForTimeout(120)
        const before = await page.evaluate(() => window.scrollY)

        // open menu
        const toggle = page.locator('button[aria-label="Toggle menu"]')
        await toggle.click()
        await page.waitForTimeout(180)

        // attempt to scroll via wheel and programmatic scroll
        await page.mouse.wheel(0, 400)
        await page.evaluate(() => window.scrollBy(0, 300))
        await page.waitForTimeout(120)

        const after = await page.evaluate(() => window.scrollY)
        expect(after).toBe(before)

        // close menu
        await toggle.click()
        await page.waitForTimeout(80)
      }
    })
  })
}
