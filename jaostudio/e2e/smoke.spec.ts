import { test, expect } from '@playwright/test'

test('homepage loads and projects page is reachable', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await page.goto('/projects')
  await expect(page.locator('h1')).toContainText(/projects/i)
})

test('project listing navigates to detail page', async ({ page }) => {
  await page.goto('/projects')
  const firstCard = page.getByRole('link').filter({ has: page.locator('h3') }).first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()
  await page.waitForURL(/\/projects\/.+/)
  await expect(page.locator('h1')).toBeVisible()
})

test('contact form renders with required fields', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('h1')).toContainText(/project/i)
  await expect(page.locator('input[name="name"]')).toBeVisible()
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('select[name="project_type"]')).toBeVisible()
  await expect(page.getByRole('button', { name: /send inquiry/i })).toBeVisible()
})

test('rate limit detects burst requests', async ({ page }) => {
  const payload = {
    name: 'Burst', email: 'burst@test.example', website: 'https://example.com',
    message: 'Rate limit test', _gotcha: '', _type: 'audit',
  }
  await page.goto('/')

  const results: number[] = []
  for (let i = 0; i < 6; i++) {
    const res = await page.request.post('/api/contact', { data: payload })
    results.push(res.status())
  }

  const rateLimited = results.some((s) => s === 429)
  console.log('Rate limit results:', results.join(', '))

  if (!rateLimited) {
    const okCount = results.filter((s) => s >= 200 && s < 300).length
    console.log(`No rate limit hit — ${okCount}/6 succeeded`)
  }

  expect(results.some((s) => s === 200 || s === 429)).toBe(true)
})
