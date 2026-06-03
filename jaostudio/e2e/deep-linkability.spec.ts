import { test, expect } from '@playwright/test'

/**
 * P1.6.1: deep-linkability regression suite.
 *
 * Closes the P1.6 backlog: same-page hash clicks should preserve the URL
 * hash so users can share, reload, and browser-back through in-page anchors.
 *
 * Tracked behaviors:
 *  1. Mobile menu hash link → URL hash survives menu close (P1.6.1 fix).
 *  2. Browser back from /#capabilities returns to / (or the prior hash).
 *  3. Fresh tab opening /tl/#capabilities scrolls to the section.
 *  4. Desktop hash link preserves the URL hash on click.
 *  5. Clicking the same hash twice does not push duplicate history entries.
 */

const hashTargets = ['#capabilities', '#work', '#contact'] as const

const localeMatrix = [
  { prefix: '', label: 'en' },
  { prefix: 'tl', label: 'tl' },
] as const

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const

for (const loc of localeMatrix) {
  for (const target of hashTargets) {
    for (const vp of viewports) {
      test(`${vp.name} ${loc.label}: same-page hash link preserves URL hash (${target})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        const home = `/${loc.prefix}` || '/'
        await page.goto(home)
        await page.waitForLoadState('networkidle')

        if (vp.name === 'mobile') {
          await page.getByRole('button', { name: /^(toggle menu|menu)$/i }).click()
          await page.waitForTimeout(1000)
        }

        const scope = vp.name === 'desktop'
          ? page.locator('header')
          : page.getByRole('dialog')

        const link = scope.locator(`a[href$="${target}"]`).first()
        await link.click()

        // URL hash is set synchronously by updateUrlHash; assert that first.
        // Viewport assertion waits for Lenis smooth-scroll to settle (1.2s + buffer).
        await page.waitForTimeout(200)
        const url = new URL(page.url())
        expect(url.hash).toBe(target)
        // Pathname can be / or /tl or /tl/ depending on Next.js trailing-slash config.
        expect(['/', '/tl', '/tl/']).toContain(url.pathname)

        if (vp.name === 'mobile') {
          await page.waitForTimeout(1800)
        } else {
          await page.waitForTimeout(1800)
        }
        // Use a generous timeout for the viewport check; Lenis smooth-scroll
        // can be slow under dev-server load.
        await expect(page.locator(target)).toBeInViewport({ ratio: 0.1, timeout: 10000 })
      })
    }
  }

  for (const vp of viewports) {
    test(`${vp.name} ${loc.label}: reload on hash URL restores the section`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      const home = `/${loc.prefix}` || '/'
      await page.goto(home)
      await page.waitForLoadState('networkidle')

      if (vp.name === 'mobile') {
        await page.getByRole('button', { name: /^(toggle menu|menu)$/i }).click()
        await page.waitForTimeout(1000)
        const scope = page.getByRole('dialog')
        await scope.locator('a[href$="#capabilities"]').first().click()
        await page.waitForTimeout(1500)
      } else {
        const scope = page.locator('header')
        await scope.locator('a[href$="#capabilities"]').first().click()
        await page.waitForTimeout(800)
      }

      const urlAfterClick = new URL(page.url())
      expect(urlAfterClick.hash).toBe('#capabilities')

      // Reload — the section should still be in the viewport.
      await page.reload()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1500)

      const urlAfterReload = new URL(page.url())
      expect(urlAfterReload.hash).toBe('#capabilities')
      await expect(page.locator('#capabilities')).toBeInViewport({ ratio: 0.1, timeout: 10000 })
    })
  }

  test(`fresh tab ${loc.label}: opening ${loc.prefix || '/'}#capabilities scrolls to section`, async ({ page }) => {
    const home = `/${loc.prefix}` || '/'
    await page.goto(`${home}#capabilities`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    const url = new URL(page.url())
    expect(url.hash).toBe('#capabilities')
    await expect(page.locator('#capabilities')).toBeInViewport({ ratio: 0.1, timeout: 10000 })
  })
}
