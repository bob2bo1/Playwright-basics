import { test, expect } from '@playwright/test';
/**
 Because a browser dialog blocks page execution, the event listener must 
 be set up prior to clicking the button or triggering the action.
 If you place the listener after the click, the test will stall and timeout
 */

test('Handle native alert', async ({ page }) => {
  // 1. Setup listener first
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert'); // Verify type
    expect(dialog.message()).toBe('Welcome to our site!'); // Verify text
    await dialog.accept(); // Click "OK"
  });

  // 2. Trigger the alert
  await page.getByRole('button', { name: 'Show Alert' }).click();
});

test('Handle confirm dialog (Cancel)', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    await dialog.dismiss(); // Simulates clicking 'Cancel'
  });

  await page.getByRole('button', { name: 'Delete Account' }).click();
});
