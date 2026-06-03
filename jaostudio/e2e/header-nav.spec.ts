import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const
const locales = [
  { prefix: '', label: 'en', studioPath: '/studio' },
  { prefix: 'tl', label: 'tl', studioPath: '/tl/studio' },
] as const

for (const vp of viewports) {
  for (const loc of locales) {
    const homeUrl = `/${loc.prefix}`
    const ctaLabel = loc.label === 'tl' ? /Simulan ang Proyekto/i : /Start a Project/i
    const studioUrlPattern = new RegExp(`${loc.studioPath.replace(/\//g, '\\/')}\\/?$`)

    test(`${vp.name} ${loc.label}: header CTA scrolls to #contact on home page`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(homeUrl)

      if (vp.name === 'mobile') {
        await page.getByRole('button', { name: /^(toggle menu|menu)$/i }).click()
        await page.waitForTimeout(1000)
      }

      // Scope to header on desktop (CTA is in navbar). On mobile, the menu
      // is portaled to document.body, so scope to the dialog.
      const scope = vp.name === 'desktop'
        ? page.locator('header')
        : page.getByRole('dialog')

      const cta = scope.getByRole('link', { name: ctaLabel }).first()
      await cta.click()
      await page.waitForTimeout(1500)

      await expect(page.locator('#contact')).toBeInViewport()
    })

    test(`${vp.name} ${loc.label}: header nav to Studio navigates to studio page`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(homeUrl)

      if (vp.name === 'mobile') {
        await page.getByRole('button', { name: /^(toggle menu|menu)$/i }).click()
        await page.waitForTimeout(1000)
      }

      const scope = vp.name === 'desktop'
        ? page.locator('header')
        : page.getByRole('dialog')

      // Use exact match: the logo "JAOstudio" contains "studio" (case-insensitive),
      // so a substring match would pick the logo link (href="/") instead of the
      // nav link (href="/studio").
      const studio = scope.getByRole('link', { name: 'Studio', exact: true }).first()
      await studio.click()
      // Poll window.location.href directly. Next.js Link uses history.pushState
      // for SPA navigations; waitForURL sometimes misses pushState on dev server.
      await page.waitForFunction(
        (src) => new RegExp(src).test(window.location.href),
        studioUrlPattern.source,
        { timeout: 30000 }
      )
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }
}
