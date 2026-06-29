import { test, expect } from '@playwright/test'

async function signInAs(page: any, email: string) {
  await page.goto('/demo')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill('password123')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/dashboard')
}

test.describe('RBAC — ORG_USER (Kiko)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, 'kiko@bayani.demo')
  })

  test('1. Direct /admin/users redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForURL('**/dashboard')
    await expect(page.getByText('Security Posture Overview')).toBeVisible()
  })

  test('2. Direct /admin/organizations redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/organizations')
    await page.waitForURL('**/dashboard')
    await expect(page.getByText('Security Posture Overview')).toBeVisible()
  })

  test('3. Sidebar does not show System Admin link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'System Admin' })).not.toBeVisible()
  })

  test('4. Sidebar does not show Settings link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Settings' })).not.toBeVisible()
  })

  test('5. API call to admin endpoint returns redirect/not-found', async ({ page }) => {
    const res = await page.request.get('/admin/users')
    expect(res.status()).toBeGreaterThanOrEqual(200)
    const body = await res.text()
    expect(body).toContain('dashboard')
  })
})

test.describe('RBAC — ORG_ADMIN (Gina)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, 'gina@talapay.demo')
  })

  test('6. Sidebar shows Settings link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
  })

  test('7. Sidebar does NOT show System Admin link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'System Admin' })).not.toBeVisible()
  })

  test('8. Direct /admin/users redirects to /dashboard', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForURL('**/dashboard')
    await expect(page.getByText('Security Posture Overview')).toBeVisible()
  })
})

test.describe('RBAC — SYSTEM_ADMIN (Grace)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, 'grace@pulodata.demo')
  })

  test('9. Sidebar shows System Admin link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'System Admin' })).toBeVisible()
  })

  test('10. Sidebar shows Settings link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
  })

  test('11. /admin/users renders with Create User', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForURL('**/admin/users')
    await expect(page.getByText('Create User')).toBeVisible()
  })

  test('12. /admin/organizations renders with Create Organization', async ({ page }) => {
    await page.goto('/admin/organizations')
    await page.waitForURL('**/admin/organizations')
    await expect(page.getByText('Create Organization')).toBeVisible()
  })
})
