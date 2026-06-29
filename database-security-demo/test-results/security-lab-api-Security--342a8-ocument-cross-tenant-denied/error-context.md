# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-lab-api.spec.ts >> Security Lab API — Org-scoped user (Jao) >> Cross-tenant access: simulatedResponseCode 404 + BLOCKED + document.cross_tenant_denied
- Location: tests\e2e\security-lab-api.spec.ts:27:7

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "IslaVault" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: IslaVault
      - navigation [ref=e8]:
        - link "Security" [ref=e9] [cursor=pointer]:
          - /url: /security
        - link "Architecture" [ref=e10] [cursor=pointer]:
          - /url: /architecture
        - link "Demo" [ref=e11] [cursor=pointer]:
          - /url: /demo
        - link "Sign In" [ref=e12] [cursor=pointer]:
          - /url: /signin
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: Try IslaVault
        - generic [ref=e17]: password password123
      - heading "Launch Security Demo" [level=1] [ref=e18]
      - paragraph [ref=e19]: Select a demo identity to explore tenant boundaries, test RBAC enforcement, and inspect the audit trail.
      - paragraph [ref=e20]: This public demo runs in sandbox mode. Every interaction hits real server code, but writes are contained to an ephemeral database — production Turso data is never touched.
      - generic [ref=e21]:
        - heading "Demo Accounts" [level=2] [ref=e22]
        - generic [ref=e23]:
          - generic [ref=e24]:
            - generic [ref=e25]:
              - generic [ref=e26]:
                - generic [ref=e27]: Jao
                - generic [ref=e28]: jao@luntian.demo
              - generic [ref=e29]: ORG_ADMIN
            - generic [ref=e30]: "Tenant: Luntian Health"
            - generic [ref=e31]: "Access: Documents, Audit, Settings"
            - generic [ref=e32]: Tenant Scope Active
            - button "Sign In as Jao" [ref=e35]
          - generic [ref=e36]:
            - generic [ref=e37]:
              - generic [ref=e38]:
                - generic [ref=e39]: Gina
                - generic [ref=e40]: gina@talapay.demo
              - generic [ref=e41]: ORG_ADMIN
            - generic [ref=e42]: "Tenant: TalaPay"
            - generic [ref=e43]: "Access: Documents, Audit, Settings"
            - generic [ref=e44]: Tenant Scope Active
            - button "Sign In as Gina" [ref=e47]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e50]:
                - generic [ref=e51]: Kiko
                - generic [ref=e52]: kiko@bayani.demo
              - generic [ref=e53]: ORG_USER
            - generic [ref=e54]: "Tenant: Bayani Freight"
            - generic [ref=e55]: "Access: Documents only"
            - generic [ref=e56]: Tenant Scope Active
            - button "Sign In as Kiko" [ref=e59]
          - generic [ref=e60]:
            - generic [ref=e61]:
              - generic [ref=e62]:
                - generic [ref=e63]: Grace
                - generic [ref=e64]: grace@pulodata.demo
              - generic [ref=e65]: SYSTEM_ADMIN
            - generic [ref=e66]: "Tenant: Global Control Plane"
            - generic [ref=e67]: "Access: All organizations"
            - generic [ref=e68]: Tenant Scope Active
            - button "Sign In as Grace" [ref=e71]
      - generic [ref=e73]:
        - heading "Or use your own credentials" [level=2] [ref=e74]
        - generic [ref=e75]:
          - generic [ref=e76]:
            - generic [ref=e77]: Email
            - textbox "Email" [ref=e78]:
              - /placeholder: you@example.com
              - text: jao@luntian.demo
          - generic [ref=e79]:
            - generic [ref=e80]: Password
            - textbox "Password" [ref=e81]:
              - /placeholder: ••••••••
              - text: password123
          - paragraph [ref=e82]: Invalid credentials
          - button "Sign In" [ref=e83]
    - generic [ref=e84]: IslaVault — A fictional Philippine-inspired secure client portal. Not a real product.
  - generic [ref=e89] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e90]:
      - img [ref=e91]
    - generic [ref=e94]:
      - button "Open issues overlay" [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]: "0"
          - generic [ref=e98]: "1"
        - generic [ref=e99]: Issue
      - button "Collapse issues badge" [ref=e100]:
        - img [ref=e101]
  - alert [ref=e103]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | async function signInAs(page: any, email: string) {
  4   |   await page.goto('/demo')
  5   |   await page.locator('#email').fill(email)
  6   |   await page.locator('#password').fill('password123')
  7   |   await page.locator('button[type="submit"]').click()
> 8   |   await page.waitForURL('**/dashboard')
      |              ^ Error: page.waitForURL: Test timeout of 60000ms exceeded.
  9   | }
  10  | 
  11  | async function simulate(page: any, type: string) {
  12  |   return page.evaluate(async (t: string) => {
  13  |     const res = await fetch('/api/security-lab/simulate', {
  14  |       method: 'POST',
  15  |       headers: { 'Content-Type': 'application/json' },
  16  |       body: JSON.stringify({ type: t }),
  17  |     })
  18  |     return { status: res.status, body: await res.json() }
  19  |   }, type)
  20  | }
  21  | 
  22  | test.describe('Security Lab API — Org-scoped user (Jao)', () => {
  23  |   test.beforeEach(async ({ page }) => {
  24  |     await signInAs(page, 'jao@luntian.demo')
  25  |   })
  26  | 
  27  |   test('Cross-tenant access: simulatedResponseCode 404 + BLOCKED + document.cross_tenant_denied', async ({ page }) => {
  28  |     const { status, body } = await simulate(page, 'cross-tenant')
  29  |     expect(status).toBe(200)
  30  |     expect(body.simulatedResponseCode).toBe(404)
  31  |     expect(body.result).toBe('BLOCKED')
  32  |     expect(body.auditEvent).toBe('document.cross_tenant_denied')
  33  |     expect(body.auditRecorded).toBe(true)
  34  |     expect(Array.isArray(body.steps)).toBe(true)
  35  |   })
  36  | 
  37  |   test('Admin-only action: simulatedResponseCode 403 + BLOCKED + admin.action_denied', async ({ page }) => {
  38  |     const { status, body } = await simulate(page, 'admin-action')
  39  |     expect(status).toBe(200)
  40  |     expect(body.simulatedResponseCode).toBe(403)
  41  |     expect(body.result).toBe('BLOCKED')
  42  |     expect(body.auditEvent).toBe('admin.action_denied')
  43  |     expect(body.auditRecorded).toBe(true)
  44  |   })
  45  | 
  46  |   test('Org ID injection: simulatedResponseCode 200 + ALLOWED + security.client_org_injection_blocked', async ({ page }) => {
  47  |     const { status, body } = await simulate(page, 'org-id-injection')
  48  |     expect(status).toBe(200)
  49  |     expect(body.simulatedResponseCode).toBe(200)
  50  |     expect(body.result).toBe('ALLOWED')
  51  |     expect(body.auditEvent).toBe('security.client_org_injection_blocked')
  52  |     expect(body.auditRecorded).toBe(true)
  53  |   })
  54  | 
  55  |   test('Audit tamper: simulatedResponseCode 405 + BLOCKED + security.audit_tamper_denied', async ({ page }) => {
  56  |     const { status, body } = await simulate(page, 'audit-tamper')
  57  |     expect(status).toBe(200)
  58  |     expect(body.simulatedResponseCode).toBe(405)
  59  |     expect(body.result).toBe('BLOCKED')
  60  |     expect(body.auditEvent).toBe('security.audit_tamper_denied')
  61  |     expect(body.auditRecorded).toBe(true)
  62  |   })
  63  | 
  64  |   test('Escalated edit: simulatedResponseCode 403 + BLOCKED + admin.action_denied', async ({ page }) => {
  65  |     const { status, body } = await simulate(page, 'escalated-edit')
  66  |     expect(status).toBe(200)
  67  |     expect(body.simulatedResponseCode).toBe(403)
  68  |     expect(body.result).toBe('BLOCKED')
  69  |     expect(body.auditEvent).toBe('admin.action_denied')
  70  |     expect(body.auditRecorded).toBe(true)
  71  |   })
  72  | 
  73  |   test('Audit trail shows simulation events after running', async ({ page }) => {
  74  |     await simulate(page, 'cross-tenant')
  75  |     await simulate(page, 'admin-action')
  76  | 
  77  |     await page.goto('/audit')
  78  |     await page.waitForURL('**/audit')
  79  | 
  80  |     await expect(page.getByText('CROSS_TENANT_DENIED').first()).toBeVisible()
  81  |     await expect(page.getByText('ACTION_DENIED').first()).toBeVisible()
  82  |   })
  83  | })
  84  | 
  85  | test.describe('Security Lab API — SYSTEM_ADMIN (Grace)', () => {
  86  |   test.beforeEach(async ({ page }) => {
  87  |     await signInAs(page, 'grace@pulodata.demo')
  88  |   })
  89  | 
  90  |   test('Cross-tenant: simulatedResponseCode 200 + ALLOWED + security_lab.cross_tenant_document_access (bypass)', async ({ page }) => {
  91  |     const { status, body } = await simulate(page, 'cross-tenant')
  92  |     expect(status).toBe(200)
  93  |     expect(body.simulatedResponseCode).toBe(200)
  94  |     expect(body.result).toBe('ALLOWED')
  95  |     expect(body.auditEvent).toBe('security_lab.cross_tenant_document_access')
  96  |     expect(body.auditRecorded).toBe(true)
  97  |   })
  98  | 
  99  |   test('Admin action: simulatedResponseCode 200 + ALLOWED + security_lab.admin_only_action', async ({ page }) => {
  100 |     const { status, body } = await simulate(page, 'admin-action')
  101 |     expect(status).toBe(200)
  102 |     expect(body.simulatedResponseCode).toBe(200)
  103 |     expect(body.result).toBe('ALLOWED')
  104 |     expect(body.auditEvent).toBe('security_lab.admin_only_action')
  105 |     expect(body.auditRecorded).toBe(true)
  106 |   })
  107 | 
  108 |   test('Org ID injection: simulatedResponseCode 200 + ALLOWED + security_lab.fake_org_id_injection', async ({ page }) => {
```