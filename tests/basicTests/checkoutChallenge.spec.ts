import { test, expect } from '@playwright/test';

test.describe('Mock Checkout Flow', () => {
  test('should complete checkout successfully and handle dynamic elements', async ({
    page,
  }) => {
    // 1. Open the mock checkout page
    await page.goto('https://example.com');

    // 2. Select delivery country from a dropdown
    const countryDropdown = page.locator('select#delivery-country');
    await countryDropdown.selectOption({ label: 'United Kingdom' });

    // 3. Fill payment details inside an iframe
    const paymentIframe = page.frameLocator('iframe#payment-gateway');

    // Seeded Failure Note: If debugging a failure in UI Mode / Trace Viewer,
    // verify if selectors match exactly (e.g., '#card-number' vs '#cc-num').
    await paymentIframe.locator('#card-number').fill('4111111111111111');
    await paymentIframe.locator('#expiry-date').fill('12/29');
    await paymentIframe.locator('#cvv').fill('123');

    // Submit the initial checkout form to trigger the dialog
    await page.locator('button#submit-order').click();

    // 4. Handle a confirmation dialog (Must be set up before the action triggers it)
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Confirm your purchase?');
      await dialog.accept();
    });

    // Action that triggers the confirmation dialog
    await page.locator('button#confirm-payment-modal').click();

    // 5. Wait for dynamic confirmation text
    const confirmationMessage = page.locator('.success-message');
    await expect(confirmationMessage).toBeVisible({ timeout: 10000 });
    await expect(confirmationMessage).toHaveText('Thank you for your order!');
  });
});
