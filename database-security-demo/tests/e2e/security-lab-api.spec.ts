import { test, expect } from '@playwright/test'

async function signInAs(page: any, email: string) {
  await page.goto('/demo')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill('password123')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/dashboard')
}

async function simulate(page: any, type: string) {
  return page.evaluate(async (t: string) => {
    const res = await fetch('/api/security-lab/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: t }),
    })
    return { status: res.status, body: await res.json() }
  }, type)
}

test.describe('Security Lab API — Org-scoped user (Jao)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, 'jao@luntian.demo')
  })

  test('Cross-tenant access: simulatedResponseCode 404 + BLOCKED + document.cross_tenant_denied', async ({ page }) => {
    const { status, body } = await simulate(page, 'cross-tenant')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(404)
    expect(body.result).toBe('BLOCKED')
    expect(body.auditEvent).toBe('document.cross_tenant_denied')
    expect(body.auditRecorded).toBe(true)
    expect(Array.isArray(body.steps)).toBe(true)
  })

  test('Admin-only action: simulatedResponseCode 403 + BLOCKED + admin.action_denied', async ({ page }) => {
    const { status, body } = await simulate(page, 'admin-action')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(403)
    expect(body.result).toBe('BLOCKED')
    expect(body.auditEvent).toBe('admin.action_denied')
    expect(body.auditRecorded).toBe(true)
  })

  test('Org ID injection: simulatedResponseCode 200 + ALLOWED + security.client_org_injection_blocked', async ({ page }) => {
    const { status, body } = await simulate(page, 'org-id-injection')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(200)
    expect(body.result).toBe('ALLOWED')
    expect(body.auditEvent).toBe('security.client_org_injection_blocked')
    expect(body.auditRecorded).toBe(true)
  })

  test('Audit tamper: simulatedResponseCode 405 + BLOCKED + security.audit_tamper_denied', async ({ page }) => {
    const { status, body } = await simulate(page, 'audit-tamper')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(405)
    expect(body.result).toBe('BLOCKED')
    expect(body.auditEvent).toBe('security.audit_tamper_denied')
    expect(body.auditRecorded).toBe(true)
  })

  test('Escalated edit: simulatedResponseCode 403 + BLOCKED + admin.action_denied', async ({ page }) => {
    const { status, body } = await simulate(page, 'escalated-edit')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(403)
    expect(body.result).toBe('BLOCKED')
    expect(body.auditEvent).toBe('admin.action_denied')
    expect(body.auditRecorded).toBe(true)
  })

  test('Audit trail shows simulation events after running', async ({ page }) => {
    await simulate(page, 'cross-tenant')
    await simulate(page, 'admin-action')

    await page.goto('/audit')
    await page.waitForURL('**/audit')

    await expect(page.getByText('CROSS_TENANT_DENIED').first()).toBeVisible()
    await expect(page.getByText('ACTION_DENIED').first()).toBeVisible()
  })
})

test.describe('Security Lab API — SYSTEM_ADMIN (Grace)', () => {
  test.beforeEach(async ({ page }) => {
    await signInAs(page, 'grace@pulodata.demo')
  })

  test('Cross-tenant: simulatedResponseCode 200 + ALLOWED + security_lab.cross_tenant_document_access (bypass)', async ({ page }) => {
    const { status, body } = await simulate(page, 'cross-tenant')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(200)
    expect(body.result).toBe('ALLOWED')
    expect(body.auditEvent).toBe('security_lab.cross_tenant_document_access')
    expect(body.auditRecorded).toBe(true)
  })

  test('Admin action: simulatedResponseCode 200 + ALLOWED + security_lab.admin_only_action', async ({ page }) => {
    const { status, body } = await simulate(page, 'admin-action')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(200)
    expect(body.result).toBe('ALLOWED')
    expect(body.auditEvent).toBe('security_lab.admin_only_action')
    expect(body.auditRecorded).toBe(true)
  })

  test('Org ID injection: simulatedResponseCode 200 + ALLOWED + security_lab.fake_org_id_injection', async ({ page }) => {
    const { status, body } = await simulate(page, 'org-id-injection')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(200)
    expect(body.result).toBe('ALLOWED')
    expect(body.auditEvent).toBe('security_lab.fake_org_id_injection')
    expect(body.auditRecorded).toBe(true)
  })

  test('Audit tamper: simulatedResponseCode 405 + BLOCKED + security.audit_tamper_denied', async ({ page }) => {
    const { status, body } = await simulate(page, 'audit-tamper')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(405)
    expect(body.result).toBe('BLOCKED')
    expect(body.auditEvent).toBe('security.audit_tamper_denied')
    expect(body.auditRecorded).toBe(true)
  })

  test('Escalated edit: simulatedResponseCode 200 + ALLOWED + security_lab.escalated_document_edit', async ({ page }) => {
    const { status, body } = await simulate(page, 'escalated-edit')
    expect(status).toBe(200)
    expect(body.simulatedResponseCode).toBe(200)
    expect(body.result).toBe('ALLOWED')
    expect(body.auditEvent).toBe('security_lab.escalated_document_edit')
    expect(body.auditRecorded).toBe(true)
  })
})

test.describe('Security Lab API — Unauthenticated', () => {
  test('Returns 401 without session', async ({ request }) => {
    const res = await request.post('/api/security-lab/simulate', { data: { type: 'cross-tenant' } })
    expect(res.status()).toBe(401)
  })
})
