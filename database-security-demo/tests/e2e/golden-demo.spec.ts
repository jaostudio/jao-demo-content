import { test, expect } from '@playwright/test'

test.describe('Golden demo path', () => {
  test('1. Visit / and confirm hero renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('IslaVault is a fictional')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Launch Security Demo' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Architecture' })).toBeVisible()
  })

  test('2. Navigate to /demo and see identity cards', async ({ page }) => {
    await page.goto('/demo')
    await expect(page.getByText('Maria Santos')).toBeVisible()
    await expect(page.getByText('Paolo Reyes')).toBeVisible()
    await expect(page.getByText('Ana Villarin')).toBeVisible()
    await expect(page.getByText('Rafael Cruz')).toBeVisible()
  })

  async function signInAs(page: any, email: string) {
    await page.goto('/demo')
    await page.locator('#email').fill(email)
    await page.locator('#password').fill('password123')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('**/dashboard')
  }

  test('3. Sign in as Paolo Reyes (ORG_USER, Luntian Health)', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')
    await expect(page.getByText('Security Posture Overview')).toBeVisible()
  })

  test('4. Dashboard shows tenant scope and ORG_USER role', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')
    await expect(page.getByText('Luntian Health Network', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('ORG_USER').first()).toBeVisible()
    await expect(page.getByText('Tenant Scope Active')).toBeVisible()
  })

  test('5. Documents page only shows Luntian documents', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')

    await page.getByRole('link', { name: 'Documents' }).click()
    await page.waitForURL('**/documents')

    // Luntian docs should be visible
    await expect(page.getByText('Regional Clinic Access Matrix').first()).toBeVisible()
    await expect(page.getByText('Vendor Security Assessment').first()).toBeVisible()

    // TalaPay docs should NOT be visible
    await expect(page.getByText('Member Data Handling Policy')).not.toBeVisible()
  })

  test('6. ORG_USER cannot access admin pages', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')

    // Direct navigation to admin should redirect
    await page.goto('/admin/users')
    await page.waitForURL('**/dashboard')
    await expect(page.getByText('Security Posture Overview')).toBeVisible()
  })

  test('7. Demo switcher changes to Rafael (SYSTEM_ADMIN)', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')

    // Use demo switcher
    await page.getByRole('button', { name: 'Switch Account' }).click()
    await page.getByText('Rafael Cruz').click()
    await page.waitForTimeout(1000)
    await page.goto('/dashboard')
    await page.waitForURL('**/dashboard')

    await expect(page.getByText('SYSTEM_ADMIN')).toBeVisible()
  })

  test('8. SYSTEM_ADMIN sees admin navigation', async ({ page }) => {
    await signInAs(page, 'rafael@islavault.demo')

    // Admin link should be visible in sidebar
    await expect(page.getByRole('link', { name: 'System Admin' })).toBeVisible()
  })

  test('9. SYSTEM_ADMIN can access /admin/users', async ({ page }) => {
    await signInAs(page, 'rafael@islavault.demo')

    await page.getByRole('link', { name: 'System Admin' }).click()
    await page.waitForURL('**/admin/users')
    await expect(page.getByText('Create User')).toBeVisible()
  })

  test('10. Security Lab simulation runs and shows result', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')

    await page.getByRole('link', { name: 'Security Lab' }).click()
    await page.waitForURL('**/security-lab')

    // Run cross-tenant simulation
    const runButtons = page.getByRole('button', { name: 'Run Simulation' })
    await runButtons.first().click()

    // Wait for result to appear
    await expect(page.getByText('BLOCKED').or(page.getByText('ALLOWED'))).toBeVisible({ timeout: 10000 })
  })
})
