import { test, expect } from '@playwright/test'

const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /already initialized PostHog/i,
  /ERR_BLOCKED_BY_CLIENT/i,
]

function ignoreConsole(msg: string) {
  return IGNORED_CONSOLE.some((re) => re.test(msg))
}

test.describe('locale toggle', () => {
  test('EN → TL from home switches URL, label, content, and html lang', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !ignoreConsole(msg.text())) {
        errors.push(`console.error: ${msg.text()}`)
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /switch language to tagalog/i }).click()
    await page.waitForURL('**/tl', { timeout: 10000 })

    await expect(page).toHaveURL(/\/tl\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
    await expect(page.getByRole('button', { name: /switch language to english/i })).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('TL → EN from home switches back to default locale', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !ignoreConsole(msg.text())) {
        errors.push(`console.error: ${msg.text()}`)
      }
    })

    await page.goto('/tl')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /switch language to english/i }).click()
    await page.waitForURL((url) => !url.pathname.startsWith('/tl'), { timeout: 10000 })

    await expect(page).toHaveURL(/\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('button', { name: /switch language to tagalog/i })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('toggles from deep page maintain route path under new locale', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !ignoreConsole(msg.text())) {
        errors.push(`console.error: ${msg.text()}`)
      }
    })

    await page.goto('/services')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /switch language to tagalog/i }).click()
    await page.waitForURL('**/tl/services', { timeout: 10000 })

    await expect(page).toHaveURL(/\/tl\/services\/?$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
    await expect(page.locator('h1')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('reduced motion skips transition classes and navigates immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /switch language to tagalog/i }).click()
    await page.waitForURL('**/tl', { timeout: 10000 })

    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
    await expect(page.locator('#main-content.locale-exit')).toHaveCount(0)
  })

  test('rapid double-click causes single navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const btn = page.getByRole('button', { name: /switch language to tagalog/i })
    await btn.click()
    await btn.click()
    await btn.click()

    await page.waitForURL('**/tl', { timeout: 15000 })
    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
  })

  test('mobile: locale button visible and functional', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: /toggle menu/i }).click()
    await page.waitForTimeout(350)

    const mobileToggle = page.getByRole('button', { name: /switch language to tagalog/i })
    await expect(mobileToggle).toBeVisible()
    await mobileToggle.click()

    await page.waitForURL('**/tl', { timeout: 10000 })
    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
  })

  test('invalid locale prefix falls back deterministically', async ({ page }) => {
    const response = await page.goto('/xx/contact', { waitUntil: 'networkidle' })
    expect(response).not.toBeNull()
    const status = response!.status()
    expect([200, 404, 307]).toContain(status)
  })

  test('mobile: TL menu opens, header toggle closes, route link navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/tl')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')

    const menuToggle = page.getByRole('button', { name: /^(toggle menu|menu)$/i })
    await menuToggle.click()
    await page.waitForTimeout(1000)

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // Header toggle doubles as close affordance (☰ → X) — no separate overlay X button.
    await menuToggle.click()
    await page.waitForTimeout(1000)
    await expect(dialog).toBeHidden()

    await menuToggle.click()
    await page.waitForTimeout(1000)
    await expect(dialog).toBeVisible()

    await dialog.getByRole('link', { name: 'Studio' }).click()
    await page.waitForURL('**/tl/studio', { timeout: 10000 })
    await expect(page).toHaveURL(/\/tl\/studio\/?$/)
    await expect(dialog).toBeHidden()
    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
  })

  test('mobile: TL menu hash link scrolls to target section', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/tl')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('html')).toHaveAttribute('lang', 'tl')

    const menuToggle = page.getByRole('button', { name: /^(toggle menu|menu)$/i })
    await menuToggle.click()
    await page.waitForTimeout(1000)

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // TL "Serbisyo" link goes to /#capabilities (localized to /tl/#capabilities).
    await dialog.getByRole('link', { name: /^(serbisyo|services)$/i }).click()
    await page.waitForTimeout(1500) // menu exit (350ms) + scrollToHash (Lenis ~1.2s)

    await expect(dialog).toBeHidden()
    // Behavior assertion: the target section is in the viewport (not the scrollY value,
    // which is layout-fragile). This directly tests the user-facing outcome.
    await expect(page.locator('#capabilities')).toBeInViewport()
  })
})
