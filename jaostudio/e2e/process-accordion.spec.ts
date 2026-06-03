import { test, expect } from '@playwright/test'

test.describe('Process mobile accordion', () => {
  test.describe('mobile 390px', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test('renders 5 accordion cards (one per process step)', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const process = page.locator('#process')
      await expect(process).toBeVisible()

      // 5 buttons with aria-expanded, one per step
      const triggers = process.locator('button[aria-expanded]')
      await expect(triggers).toHaveCount(5)
    })

    test('tapping a step expands it and reveals its body', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const process = page.locator('#process')
      const triggers = process.locator('button[aria-expanded]')

      // Step 1 is open by default
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')

      // Open step 3
      await triggers.nth(2).click()
      await expect(triggers.nth(2)).toHaveAttribute('aria-expanded', 'true')

      // The "What happens here" label inside the open panel should be visible
      await expect(process.getByText('What happens here').first()).toBeVisible()
    })

    test('tapping a different step closes the previous (exclusive open)', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const triggers = page.locator('#process button[aria-expanded]')

      // Open step 2
      await triggers.nth(1).click()
      await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true')

      // Open step 4
      await triggers.nth(3).click()
      await expect(triggers.nth(3)).toHaveAttribute('aria-expanded', 'true')

      // Step 2 should now be closed
      await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'false')

      // Only one panel should be expanded at any time
      const expandedCount = await triggers.evaluateAll((els) =>
        els.filter((el) => el.getAttribute('aria-expanded') === 'true').length,
      )
      expect(expandedCount).toBe(1)
    })

    test('all 5 steps are individually expandable', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const triggers = page.locator('#process button[aria-expanded]')

      for (let i = 0; i < 5; i++) {
        await triggers.nth(i).click()
        await expect(triggers.nth(i)).toHaveAttribute('aria-expanded', 'true')
      }
    })

    test('keyboard: Enter expands a step', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const triggers = page.locator('#process button[aria-expanded]')

      // Focus step 2 (closed by default)
      await triggers.nth(1).focus()
      await expect(triggers.nth(1)).toBeFocused()

      // Press Enter to open
      await page.keyboard.press('Enter')
      await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true')
    })

    test('keyboard: Space expands a step', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const triggers = page.locator('#process button[aria-expanded]')

      await triggers.nth(2).focus()
      await page.keyboard.press('Space')
      await expect(triggers.nth(2)).toHaveAttribute('aria-expanded', 'true')
    })

    test('auto-advance is disabled: accordion state does not change without interaction', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const triggers = page.locator('#process button[aria-expanded]')

      // Step 1 is open by default
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')

      // Wait longer than the desktop auto-advance interval (3.6s)
      await page.waitForTimeout(5000)

      // Step 1 should still be the open one
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')

      // No other step should be open
      const expandedCount = await triggers.evaluateAll((els) =>
        els.filter((el) => el.getAttribute('aria-expanded') === 'true').length,
      )
      expect(expandedCount).toBe(1)
    })
  })

  test.describe('mobile 360px (tightest constraint)', () => {
    test.use({ viewport: { width: 360, height: 800 } })

    test('no horizontal overflow on accordion', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Wait for the process section to mount and accordion to render.
      const process = page.locator('#process')
      await expect(process).toBeVisible()
      await expect(process.locator('button[aria-expanded]')).toHaveCount(5)

      // Verify the process section itself doesn't introduce horizontal scroll
      // at the tightest mobile width. The accordion uses the same container
      // width as the section, so if the section fits, the accordion fits.
      const overflow = await process.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }))
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1)
    })
  })

  test.describe('desktop 1440px (regression)', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('still renders pill strip + detail card (no accordion)', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const process = page.locator('#process')
      await expect(process).toBeVisible()

      // The accordion trigger buttons should NOT be present on desktop
      const triggers = process.locator('button[aria-expanded]')
      await expect(triggers).toHaveCount(0)

      // The desktop step pills (with .bg-accent class for the active one) should exist
      await expect(process.getByText('Process map')).toBeVisible()
    })
  })
})
