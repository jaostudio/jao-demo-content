import { test, expect } from '@playwright/test'

const widths = [360, 375, 390, 412]
const height = 844

for (const w of widths) {
  test.describe(`Mobile overflow check — ${w}px`, () => {
    test(`document.documentElement.scrollWidth should not exceed window.innerWidth at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height })
      await page.goto('/')
      await page.waitForTimeout(200)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const innerWidth = await page.evaluate(() => window.innerWidth)
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
    })
  })
}
