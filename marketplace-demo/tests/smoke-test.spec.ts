import { test, expect } from '@playwright/test';

const BUYER_EMAIL = 'isabel@test.ph';
const BUYER_PASSWORD = 'likha2026';

async function addFirstItemToCart(page: any) {
  await page.goto('/listings');
  await page.waitForLoadState('load');
  await page.locator('a[href^="/listings/"]').first().click();
  await page.waitForLoadState('load');
  // Wait for session to load and "Add to cart" button to appear
  const addBtn = page.getByRole('button', { name: /add to cart/i });
  await expect(addBtn).toBeVisible({ timeout: 15000 });
  await addBtn.click();
  await page.waitForTimeout(500);
}

test('Smoke test: all critical buyer paths', async ({ page }) => {
  test.setTimeout(600000);

  // ===== SIGN IN =====
  await page.goto('/auth/signin');
  await page.waitForLoadState('load');
  await page.fill('#email', BUYER_EMAIL);
  await page.fill('#password', BUYER_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('/', { timeout: 15000 });
  await page.waitForLoadState('load');

  // ===== STEP 1: Homepage sections =====
  await expect(page.locator('h1:has-text("Filipino")')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Handwoven & Textiles').first()).toBeVisible();
  await expect(page.getByText('Featured crafts').first()).toBeVisible();
  await expect(page.getByText('The hands behind every piece').first()).toBeVisible();
  await expect(page.getByText('Artisan families').first()).toBeVisible();
  await expect(page.getByText('Why Likha').first()).toBeVisible();
  await expect(page.getByText('Discover new makers').first()).toBeVisible();

  // ===== STEP 2: Wishlist heart toggle =====
  const wishlistBtn = page.getByRole('button', { name: /add to wishlist/i }).first();
  if (await wishlistBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await wishlistBtn.click();
    await page.waitForTimeout(1000);
  }

  // ===== STEP 3: Add to cart + coupon =====
  await addFirstItemToCart(page);

  await page.goto('/cart');
  await page.waitForLoadState('load');
  // Expect non-empty cart
  await expect(page.getByText('Your selections')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Order summary')).toBeVisible();

  // Apply coupon
  await page.fill('#coupon', 'LIKHA10');
  await page.click('button:has-text("Apply")');
  await page.waitForTimeout(500);
  await expect(page.getByText('LIKHA10').first()).toBeVisible();

  // ===== STEP 4: Checkout with card =====
  await addFirstItemToCart(page);

  await page.goto('/checkout');
  await page.waitForURL('/checkout', { timeout: 10000 });
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
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
  await page.waitForURL(/\/orders\//, { timeout: 45000 });

  await expect(page.getByText('Order placed successfully')).toBeVisible({ timeout: 15000 });

  // ===== STEP 5: Checkout with COD =====
  await addFirstItemToCart(page);

  await page.goto('/checkout');
  await page.waitForURL('/checkout', { timeout: 10000 });
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  await page.fill('#phone', '+63 912 345 6789');

  await page.selectOption('#region', 'NCR');
  await page.waitForTimeout(300);
  await page.selectOption('#province', 'Metro Manila');
  await page.fill('#city', 'Quezon City');
  await page.fill('#barangay', 'Barangay Pinyahan');
  await page.fill('#street', '123 Maginhawa St');
  await page.fill('#postalCode', '1100');
  await page.getByText('Cash on delivery').click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /place order/i }).click();
  await page.waitForURL(/\/orders\//, { timeout: 45000 });

  await expect(page.getByText('Order placed successfully')).toBeVisible({ timeout: 15000 });

  // ===== STEP 6: Orders list =====
  await page.goto('/orders');
  await page.waitForLoadState('load');
  await expect(page.getByText('Order history')).toBeVisible({ timeout: 10000 });

  // ===== STEP 7: Vendor storefront =====
  await page.goto('/listings');
  await page.waitForLoadState('load');
  await page.locator('a[href^="/listings/"]').first().click();
  await page.waitForLoadState('load');
  // Click "Visit store" to go to vendor storefront
  const visitStore = page.locator('a[href^="/vendors/"]').first();
  await expect(visitStore).toBeVisible({ timeout: 5000 });
  await visitStore.click();
  await page.waitForLoadState('load');
  // Verify storefront rendered
  await expect(page.getByRole('heading', { name: /products/i }).or(page.getByText('No products yet'))).toBeVisible({ timeout: 10000 });

  // ===== STEP 8: Dark mode =====
  const darkToggle = page.getByRole('button', { name: /toggle theme/i }).first();
  if (await darkToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await darkToggle.click();
    await page.waitForTimeout(500);
  }
});
