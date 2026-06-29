# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tenant-isolation.spec.ts >> Tenant Isolation >> 1. Jao sees all Luntian document titles
- Location: tests\e2e\tenant-isolation.spec.ts:27:7

# Error details

```
Test timeout of 60000ms exceeded.
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
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | async function signInAs(page: any, email: string) {
  4  |   await page.goto('/demo')
  5  |   await page.locator('#email').fill(email)
  6  |   await page.locator('#password').fill('password123')
  7  |   await page.locator('button[type="submit"]').click()
> 8  |   await page.waitForURL('**/dashboard')
     |              ^ Error: page.waitForURL: Test timeout of 60000ms exceeded.
  9  | }
  10 | 
  11 | const luntianDocs = [
  12 |   'Regional Clinic Access Matrix',
  13 |   'Vendor Security Assessment',
  14 |   'Incident Response Checklist',
  15 |   'Confidential Operations Memo',
  16 |   'Patient Data Handling Protocol',
  17 | ]
  18 | 
  19 | const bayaniDocs = [
  20 |   'Port Clearance Procedures',
  21 |   'Vendor Contract Database',
  22 |   'Fleet Security Assessment',
  23 |   'Cargo Manifest Review',
  24 | ]
  25 | 
  26 | test.describe('Tenant Isolation', () => {
  27 |   test('1. Jao sees all Luntian document titles', async ({ page }) => {
  28 |     await signInAs(page, 'jao@luntian.demo')
  29 |     await page.getByRole('link', { name: 'Documents' }).click()
  30 |     await page.waitForURL('**/documents')
  31 | 
  32 |     for (const title of luntianDocs) {
  33 |       await expect(page.getByText(title).first()).toBeVisible()
  34 |     }
  35 |   })
  36 | 
  37 |   test('2. Kiko sees all Bayani document titles', async ({ page }) => {
  38 |     await signInAs(page, 'kiko@bayani.demo')
  39 |     await page.getByRole('link', { name: 'Documents' }).click()
  40 |     await page.waitForURL('**/documents')
  41 | 
  42 |     for (const title of bayaniDocs) {
  43 |       await expect(page.getByText(title).first()).toBeVisible()
  44 |     }
  45 |   })
  46 | 
  47 |   test('3. Jao cannot see any Bayani document titles', async ({ page }) => {
  48 |     await signInAs(page, 'jao@luntian.demo')
  49 |     await page.getByRole('link', { name: 'Documents' }).click()
  50 |     await page.waitForURL('**/documents')
  51 | 
  52 |     for (const title of bayaniDocs) {
  53 |       await expect(page.getByText(title)).not.toBeVisible()
  54 |     }
  55 |   })
  56 | 
  57 |   test('4. Cross-tenant attempt is logged to audit trail', async ({ page }) => {
  58 |     await signInAs(page, 'jao@luntian.demo')
  59 | 
  60 |     const { body } = await page.evaluate(async () => {
  61 |       const res = await fetch('/api/security-lab/simulate', {
  62 |         method: 'POST',
  63 |         headers: { 'Content-Type': 'application/json' },
  64 |         body: JSON.stringify({ type: 'cross-tenant' }),
  65 |       })
  66 |       return { status: res.status, body: await res.json() }
  67 |     })
  68 | 
  69 |     expect(body.auditEvent).toBe('document.cross_tenant_denied')
  70 |     expect(body.auditRecorded).toBe(true)
  71 | 
  72 |     await page.goto('/audit')
  73 |     await page.waitForURL('**/audit')
  74 |     await expect(page.getByText('CROSS_TENANT_DENIED').first()).toBeVisible()
  75 |   })
  76 | })
  77 | 
```