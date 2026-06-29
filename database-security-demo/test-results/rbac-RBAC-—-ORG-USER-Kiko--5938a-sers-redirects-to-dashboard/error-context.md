# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac.spec.ts >> RBAC — ORG_USER (Kiko) >> 1. Direct /admin/users redirects to /dashboard
- Location: tests\e2e\rbac.spec.ts:16:7

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
              - text: kiko@bayani.demo
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
  11 | test.describe('RBAC — ORG_USER (Kiko)', () => {
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await signInAs(page, 'kiko@bayani.demo')
  14 |   })
  15 | 
  16 |   test('1. Direct /admin/users redirects to /dashboard', async ({ page }) => {
  17 |     await page.goto('/admin/users')
  18 |     await page.waitForURL('**/dashboard')
  19 |     await expect(page.getByText('Security Posture Overview')).toBeVisible()
  20 |   })
  21 | 
  22 |   test('2. Direct /admin/organizations redirects to /dashboard', async ({ page }) => {
  23 |     await page.goto('/admin/organizations')
  24 |     await page.waitForURL('**/dashboard')
  25 |     await expect(page.getByText('Security Posture Overview')).toBeVisible()
  26 |   })
  27 | 
  28 |   test('3. Sidebar does not show System Admin link', async ({ page }) => {
  29 |     await expect(page.getByRole('link', { name: 'System Admin' })).not.toBeVisible()
  30 |   })
  31 | 
  32 |   test('4. Sidebar does not show Settings link', async ({ page }) => {
  33 |     await expect(page.getByRole('link', { name: 'Settings' })).not.toBeVisible()
  34 |   })
  35 | 
  36 |   test('5. API call to admin endpoint returns redirect/not-found', async ({ page }) => {
  37 |     const res = await page.request.get('/admin/users')
  38 |     expect(res.status()).toBeGreaterThanOrEqual(200)
  39 |     const body = await res.text()
  40 |     expect(body).toContain('dashboard')
  41 |   })
  42 | })
  43 | 
  44 | test.describe('RBAC — ORG_ADMIN (Gina)', () => {
  45 |   test.beforeEach(async ({ page }) => {
  46 |     await signInAs(page, 'gina@talapay.demo')
  47 |   })
  48 | 
  49 |   test('6. Sidebar shows Settings link', async ({ page }) => {
  50 |     await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
  51 |   })
  52 | 
  53 |   test('7. Sidebar does NOT show System Admin link', async ({ page }) => {
  54 |     await expect(page.getByRole('link', { name: 'System Admin' })).not.toBeVisible()
  55 |   })
  56 | 
  57 |   test('8. Direct /admin/users redirects to /dashboard', async ({ page }) => {
  58 |     await page.goto('/admin/users')
  59 |     await page.waitForURL('**/dashboard')
  60 |     await expect(page.getByText('Security Posture Overview')).toBeVisible()
  61 |   })
  62 | })
  63 | 
  64 | test.describe('RBAC — SYSTEM_ADMIN (Grace)', () => {
  65 |   test.beforeEach(async ({ page }) => {
  66 |     await signInAs(page, 'grace@pulodata.demo')
  67 |   })
  68 | 
  69 |   test('9. Sidebar shows System Admin link', async ({ page }) => {
  70 |     await expect(page.getByRole('link', { name: 'System Admin' })).toBeVisible()
  71 |   })
  72 | 
  73 |   test('10. Sidebar shows Settings link', async ({ page }) => {
  74 |     await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible()
  75 |   })
  76 | 
  77 |   test('11. /admin/users renders with Create User', async ({ page }) => {
  78 |     await page.goto('/admin/users')
  79 |     await page.waitForURL('**/admin/users')
  80 |     await expect(page.getByText('Create User')).toBeVisible()
  81 |   })
  82 | 
  83 |   test('12. /admin/organizations renders with Create Organization', async ({ page }) => {
  84 |     await page.goto('/admin/organizations')
  85 |     await page.waitForURL('**/admin/organizations')
  86 |     await expect(page.getByText('Create Organization')).toBeVisible()
  87 |   })
  88 | })
  89 | 
```