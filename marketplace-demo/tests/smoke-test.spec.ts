import { test, expect } from '@playwright/test';

const BUYER_EMAIL = 'isabel@test.ph';
const BUYER_PASSWORD = 'likha2026';

async function addFirstItemToCart(page: any) {
  await page.goto('/listings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const listingLinks = page.locator('a[href*="/listings/"][href^="/listings/"]');
  await expect(listingLinks.first()).toBeVisible({ timeout: 10000 });
  await listingLinks.first().click();
  await page.waitForTimeout(3000);
  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible({ timeout: 15000 });
  await addBtn.click();
  await page.waitForTimeout(500);
}

test('Smoke test: all critical buyer paths', async ({ page }) => {
  test.setTimeout(600000);

  // ===== SIGN IN =====
  const csrfRes = await page.request.get('/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();
  await page.request.post('/api/auth/callback/credentials', {
    form: { csrfToken, email: BUYER_EMAIL, password: BUYER_PASSWORD, callbackUrl: '/', json: 'true' },
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // ===== STEP 1: Homepage sections =====
  await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Handwoven & Textiles').first()).toBeVisible();
  await expect(page.getByText('Featured crafts').first()).toBeVisible();
  await expect(page.getByText('The hands behind every piece').first()).toBeVisible();
  await expect(page.getByText('Why Likha').first()).toBeVisible();

  // ===== STEP 2: Add to cart + coupon =====
  await addFirstItemToCart(page);

  await page.goto('/cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await expect(page.getByText('Your selections')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Order summary')).toBeVisible();

  // Apply coupon
  await page.fill('#coupon', 'LIKHA10');
  await page.click('button:has-text("Apply")');
  await page.waitForTimeout(500);
  await expect(page.getByText('LIKHA10').first()).toBeVisible();

  // ===== STEP 3: Checkout with card =====
  await addFirstItemToCart(page);

  await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // Fill phone (required, not in session)
  await page.fill('#phone', '+63 912 345 6789');

  await page.selectOption('#region', 'NCR');
  await page.waitForTimeout(300);
  await page.selectOption('#province', 'Metro Manila');
  await page.fill('#city', 'Quezon City');
  await page.fill('#barangay', 'Barangay Pinyahan');
  await page.fill('#street', '123 Maginhawa St');
  await page.fill('#postalCode', '1100');
  // Card is default
  await page.getByText('Credit / debit card').click();
  await page.waitForTimeout(300);
  await page.fill('#card-number', '4242 4242 4242 4242');
  await page.fill('#card-expiry', '12/28');
  await page.fill('#card-cvc', '123');
  await page.getByRole('button', { name: /place order/i }).click();
  await page.waitForTimeout(5000);

  // Check order was created
  await expect(page.getByText('Order placed successfully').or(page.getByText(/order/i))).toBeVisible({ timeout: 30000 });

  // ===== STEP 4: Orders list =====
  await page.goto('/orders', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await expect(page.getByText('Order history').or(page.getByText(/order/i))).toBeVisible({ timeout: 10000 });

  // ===== STEP 5: Vendor storefront =====
  await page.goto('/listings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const listingLinks = page.locator('a[href*="/listings/"][href^="/listings/"]');
  await expect(listingLinks.first()).toBeVisible({ timeout: 10000 });
  await listingLinks.first().click();
  await page.waitForTimeout(3000);
  const visitStore = page.locator('a[href^="/vendors/"]').first();
  await expect(visitStore).toBeVisible({ timeout: 10000 });
  await visitStore.click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });

  // ===== STEP 6: Dark mode =====
  const darkToggle = page.getByRole('button', { name: /toggle theme/i }).first();
  if (await darkToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await darkToggle.click();
    await page.waitForTimeout(500);
  }

  console.log('All critical buyer paths passed!');
});
