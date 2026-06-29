# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: golden-demo.spec.ts >> Golden demo path >> 2. Navigate to /demo and see identity cards
- Location: tests\e2e\golden-demo.spec.ts:11:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Jao')
Expected: visible
Error: strict mode violation: getByText('Jao') resolved to 3 elements:
    1) <div class="text-sm font-semibold text-isla-white truncate">Jao</div> aka getByText('Jao', { exact: true })
    2) <div class="text-xs text-isla-muted mono mt-0.5 truncate">jao@luntian.demo</div> aka getByText('jao@luntian.demo')
    3) <button class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all bg-isla-amethyst text-white hover:bg-isla-amethyst/90 disabled:opacity-50 disabled:cursor-not-allowed">Sign In as Jao</button> aka getByRole('button', { name: 'Sign In as Jao' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Jao')

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
          - generic [ref=e79]:
            - generic [ref=e80]: Password
            - textbox "Password" [ref=e81]:
              - /placeholder: ••••••••
          - button "Sign In" [ref=e82]
    - generic [ref=e83]: IslaVault — A fictional Philippine-inspired secure client portal. Not a real product.
  - generic [ref=e88] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e89]:
      - img [ref=e90]
    - generic [ref=e93]:
      - button "Open issues overlay" [ref=e94]:
        - generic [ref=e95]:
          - generic [ref=e96]: "0"
          - generic [ref=e97]: "1"
        - generic [ref=e98]: Issue
      - button "Collapse issues badge" [ref=e99]:
        - img [ref=e100]
  - alert [ref=e102]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Golden demo path', () => {
  4   |   test('1. Visit / and confirm hero renders', async ({ page }) => {
  5   |     await page.goto('/')
  6   |     await expect(page.getByText('IslaVault is a fictional')).toBeVisible()
  7   |     await expect(page.getByRole('link', { name: 'Launch Security Demo' }).first()).toBeVisible()
  8   |     await expect(page.getByRole('link', { name: 'View Architecture' })).toBeVisible()
  9   |   })
  10  | 
  11  |   test('2. Navigate to /demo and see identity cards', async ({ page }) => {
  12  |     await page.goto('/demo')
> 13  |     await expect(page.getByText('Jao')).toBeVisible()
      |                                         ^ Error: expect(locator).toBeVisible() failed
  14  |     await expect(page.getByText('Gina')).toBeVisible()
  15  |     await expect(page.getByText('Kiko')).toBeVisible()
  16  |     await expect(page.getByText('Grace')).toBeVisible()
  17  |   })
  18  | 
  19  |   async function signInAs(page: any, email: string) {
  20  |     await page.goto('/demo')
  21  |     await page.locator('#email').fill(email)
  22  |     await page.locator('#password').fill('password123')
  23  |     await page.locator('button[type="submit"]').click()
  24  |     await page.waitForURL('**/dashboard')
  25  |   }
  26  | 
  27  |   test('3. Sign in as Jao (ORG_ADMIN, Luntian Health)', async ({ page }) => {
  28  |     await signInAs(page, 'jao@luntian.demo')
  29  |     await expect(page.getByText('Security Posture Overview')).toBeVisible()
  30  |   })
  31  | 
  32  |   test('4. Dashboard shows tenant scope and role', async ({ page }) => {
  33  |     await signInAs(page, 'jao@luntian.demo')
  34  |     await expect(page.getByText('Luntian Health', { exact: true }).first()).toBeVisible()
  35  |     await expect(page.getByText('ORG_ADMIN').first()).toBeVisible()
  36  |     await expect(page.getByText('Tenant Scope Active')).toBeVisible()
  37  |   })
  38  | 
  39  |   test('5. Documents page only shows Luntian documents', async ({ page }) => {
  40  |     await signInAs(page, 'jao@luntian.demo')
  41  | 
  42  |     await page.getByRole('link', { name: 'Documents' }).click()
  43  |     await page.waitForURL('**/documents')
  44  | 
  45  |     // Luntian docs should be visible
  46  |     await expect(page.getByText('Regional Clinic Access Matrix').first()).toBeVisible()
  47  |     await expect(page.getByText('Vendor Security Assessment').first()).toBeVisible()
  48  | 
  49  |     // TalaPay docs should NOT be visible
  50  |     await expect(page.getByText('Member Data Handling Policy')).not.toBeVisible()
  51  |   })
  52  | 
  53  |   test('6. Org-scoped user cannot access admin pages', async ({ page }) => {
  54  |     await signInAs(page, 'jao@luntian.demo')
  55  | 
  56  |     // Direct navigation to admin should redirect
  57  |     await page.goto('/admin/users')
  58  |     await page.waitForURL('**/dashboard')
  59  |     await expect(page.getByText('Security Posture Overview')).toBeVisible()
  60  |   })
  61  | 
  62  |   test('7. Demo switcher changes to Grace (SYSTEM_ADMIN)', async ({ page }) => {
  63  |     await signInAs(page, 'jao@luntian.demo')
  64  | 
  65  |     // Use demo switcher
  66  |     await page.getByRole('button', { name: 'Switch Account' }).click()
  67  |     await page.getByText('Grace').click()
  68  |     await page.waitForTimeout(1000)
  69  |     await page.goto('/dashboard')
  70  |     await page.waitForURL('**/dashboard')
  71  | 
  72  |     await expect(page.getByText('SYSTEM_ADMIN')).toBeVisible()
  73  |   })
  74  | 
  75  |   test('8. SYSTEM_ADMIN sees admin navigation', async ({ page }) => {
  76  |     await signInAs(page, 'grace@pulodata.demo')
  77  | 
  78  |     // Admin link should be visible in sidebar
  79  |     await expect(page.getByRole('link', { name: 'System Admin' })).toBeVisible()
  80  |   })
  81  | 
  82  |   test('9. SYSTEM_ADMIN can access /admin/users', async ({ page }) => {
  83  |     await signInAs(page, 'grace@pulodata.demo')
  84  | 
  85  |     await page.getByRole('link', { name: 'System Admin' }).click()
  86  |     await page.waitForURL('**/admin/users')
  87  |     await expect(page.getByText('Create User')).toBeVisible()
  88  |   })
  89  | 
  90  |   test('10. Security Lab simulation runs and shows result', async ({ page }) => {
  91  |     await signInAs(page, 'jao@luntian.demo')
  92  | 
  93  |     await page.getByRole('link', { name: 'Security Lab' }).click()
  94  |     await page.waitForURL('**/security-lab')
  95  | 
  96  |     // Run cross-tenant simulation
  97  |     const runButtons = page.getByRole('button', { name: 'Run Simulation' })
  98  |     await runButtons.first().click()
  99  | 
  100 |     // Wait for result to appear
  101 |     await expect(page.getByText('BLOCKED').or(page.getByText('ALLOWED'))).toBeVisible({ timeout: 10000 })
  102 |   })
  103 | })
  104 | 
```