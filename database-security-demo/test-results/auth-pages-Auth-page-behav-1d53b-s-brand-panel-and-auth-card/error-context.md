# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-pages.spec.ts >> Auth page behavior >> /register page renders brand panel and auth card
- Location: tests\e2e\auth-pages.spec.ts:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('IslaVault')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('IslaVault')

```

```yaml
- main:
  - heading "Registration Disabled" [level=1]
  - paragraph: New account registration is currently disabled on this deployment.
  - link "View Demo Accounts":
    - /url: /demo
  - paragraph:
    - text: Already have an account?
    - link "Sign In":
      - /url: /signin
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Auth page behavior', () => {
  4  |   test('Unauthenticated /dashboard redirects to /signin', async ({ page }) => {
  5  |     await page.goto('/dashboard')
  6  |     await page.waitForURL('**/signin')
  7  |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  8  |   })
  9  | 
  10 |   test('Unauthenticated /documents redirects to /signin', async ({ page }) => {
  11 |     await page.goto('/documents')
  12 |     await page.waitForURL('**/signin')
  13 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  14 |   })
  15 | 
  16 |   test('Unauthenticated /security-lab redirects to /signin', async ({ page }) => {
  17 |     await page.goto('/security-lab')
  18 |     await page.waitForURL('**/signin')
  19 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  20 |   })
  21 | 
  22 |   test('Unauthenticated /settings redirects to /signin', async ({ page }) => {
  23 |     await page.goto('/settings')
  24 |     await page.waitForURL('**/signin')
  25 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  26 |   })
  27 | 
  28 |   test('/signin page renders brand panel and auth card', async ({ page }) => {
  29 |     await page.goto('/signin')
  30 |     await expect(page.getByText('IslaVault')).toBeVisible()
  31 |     await expect(page.getByText('Tenant-scoped access')).toBeVisible()
  32 |     await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  33 |     await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
  34 |   })
  35 | 
  36 |   test('/register page renders brand panel and auth card', async ({ page }) => {
  37 |     await page.goto('/register')
> 38 |     await expect(page.getByText('IslaVault')).toBeVisible()
     |                                               ^ Error: expect(locator).toBeVisible() failed
  39 |     await expect(page.getByText('Tenant-scoped access')).toBeVisible()
  40 |     await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible()
  41 |     await expect(page.getByPlaceholder('Your name')).toBeVisible()
  42 |   })
  43 | })
  44 | 
```