import { test, expect } from '@playwright/test'

test.describe('Auth page behavior', () => {
  test('Unauthenticated /dashboard redirects to /signin', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/signin')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('Unauthenticated /documents redirects to /signin', async ({ page }) => {
    await page.goto('/documents')
    await page.waitForURL('**/signin')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('Unauthenticated /security-lab redirects to /signin', async ({ page }) => {
    await page.goto('/security-lab')
    await page.waitForURL('**/signin')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('Unauthenticated /settings redirects to /signin', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForURL('**/signin')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('/signin page renders brand panel and auth card', async ({ page }) => {
    await page.goto('/signin')
    await expect(page.getByText('IslaVault')).toBeVisible()
    await expect(page.getByText('Tenant-scoped access')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  })

  test('/register page renders brand panel and auth card', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByText('IslaVault')).toBeVisible()
    await expect(page.getByText('Tenant-scoped access')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible()
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
  })
})
