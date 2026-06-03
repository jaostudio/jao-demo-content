import { test, expect } from '@playwright/test'

test('SocialProof renders on home page in EN and TL', async ({ page }) => {
  // EN
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // SocialProof has a unique border-y class on its outer wrapper.
  // Scroll into view since it's below the fold.
  const socialProofEN = page.locator('.border-y.border-border-subtle')
  await socialProofEN.scrollIntoViewIfNeeded()
  await expect(socialProofEN).toBeVisible()
  await expect(socialProofEN.getByText('95+ Lighthouse')).toBeVisible()
  await expect(socialProofEN.getByText('SEO-optimized')).toBeVisible()

  // TL (tech credentials are the same in both locales)
  await page.goto('/tl')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('html')).toHaveAttribute('lang', 'tl')
  const socialProofTL = page.locator('.border-y.border-border-subtle')
  await socialProofTL.scrollIntoViewIfNeeded()
  await expect(socialProofTL).toBeVisible()
  await expect(socialProofTL.getByText('95+ Lighthouse')).toBeVisible()
})
