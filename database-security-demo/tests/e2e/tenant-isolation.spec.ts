import { test, expect } from '@playwright/test'

async function signInAs(page: any, email: string) {
  await page.goto('/demo')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill('password123')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/dashboard')
}

const luntianDocs = [
  'Regional Clinic Access Matrix',
  'Vendor Security Assessment',
  'Incident Response Checklist',
  'Confidential Operations Memo',
  'Patient Data Handling Protocol',
]

const talapayDocs = [
  'Member Data Handling Policy',
  'Loan Review Board Notes',
  'Branch Cash Audit Summary',
  'Partner API Access Request',
]

test.describe('Tenant Isolation', () => {
  test('1. Paolo sees all Luntian document titles', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')
    await page.getByRole('link', { name: 'Documents' }).click()
    await page.waitForURL('**/documents')

    for (const title of luntianDocs) {
      await expect(page.getByText(title).first()).toBeVisible()
    }
  })

  test('2. Ana sees all TalaPay document titles', async ({ page }) => {
    await signInAs(page, 'ana@talapay.demo')
    await page.getByRole('link', { name: 'Documents' }).click()
    await page.waitForURL('**/documents')

    for (const title of talapayDocs) {
      await expect(page.getByText(title).first()).toBeVisible()
    }
  })

  test('3. Paolo cannot see any TalaPay document titles', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')
    await page.getByRole('link', { name: 'Documents' }).click()
    await page.waitForURL('**/documents')

    for (const title of talapayDocs) {
      await expect(page.getByText(title)).not.toBeVisible()
    }
  })

  test('4. Cross-tenant attempt is logged to audit trail', async ({ page }) => {
    await signInAs(page, 'paolo@luntian.demo')

    const { body } = await page.evaluate(async () => {
      const res = await fetch('/api/security-lab/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cross-tenant' }),
      })
      return { status: res.status, body: await res.json() }
    })

    expect(body.auditEvent).toBe('document.cross_tenant_denied')
    expect(body.auditRecorded).toBe(true)

    await page.goto('/audit')
    await page.waitForURL('**/audit')
    await expect(page.getByText('CROSS_TENANT_DENIED').first()).toBeVisible()
  })
})
