import { test, expect } from '@playwright/test';
import * as testData from '../../testdata/testdata.json';

test.describe('Data-Driven Login Tests', () => {
  // Test with valid users
  for (const user of testData.validUsers) {
    test(`login with valid user: ${user.email}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Log In' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
      await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
      await page.getByRole('button', { name: 'Log In' }).click();

      // Verify successful login
      const logoutButton = page.getByRole('button', { name: 'Log Out' });
      await expect(logoutButton).toBeVisible();
    });
  }

  // Test with invalid users
  for (const user of testData.invalidUsers) {
    test.only(`login with invalid user: ${user.email}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Log In' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
      await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
      await page.getByRole('button', { name: 'Log In' }).click();

      // Verify error message appears
      await expect(
        page.getByText('Sorry, those credentials do not match')
      ).toBeVisible();
    });
  }
});
