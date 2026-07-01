import { test, chromium, expect } from '@playwright/test';

test('Login test', async ({ page }) => {
  await page.goto('/');
});

test(
  'Login basic test using page content',
  { tag: ['@smoke', '@sanity'] },
  async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/');
  }
);

/**
 * Todo
 * - navigate to the homepage stage.keiclean.co.uk
 * - click on login button
 * - locate email input field
 * - fill email
 * - locate password input field
 * - fill password
 * - locate login button
 * - click login button
 * - asset success by seeing the logout button
 * - or negative error message - Sorry, those credential do not match
 */

test('login e2e test UI (Happy Path)', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/');
  page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Log In' }).click();

  const logoutButton = page.getByRole('button', { name: 'Log Out' });
  await expect(logoutButton).toBeVisible();
});

test('login e2e test UI (Negative Path)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
  await page.getByRole('button', { name: 'Log In' }).click();

  const errorMessage = page.getByText('Sorry, those credentials do not match');
  await expect(errorMessage).toBeVisible();
});

/**
 Scenario
As a user, I want to search for a product so I can see matching results
use google.com as the base url

 */

test('search product test', async ({ page }) => {
  await page.goto('https://www.google.co.uk');

  // Handle Google cookie consent popup
  try {
    const acceptCookies = page.locator(
      'button:has-text("Accept all"), button:has-text("I agree"), button[aria-label="Accept all"]'
    );
    if (await acceptCookies.isVisible({ timeout: 3000 })) {
      await acceptCookies.click();
    }
  } catch {
    // No cookie popup found, continue
  }
  await page.getByRole('combobox', { name: 'Search' }).fill('laptop');
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');
  await page.waitForLoadState('networkidle');

  /**
   * there is a captcha challenge that needs to be solved on google and amazon so i will leave this test for now
   * this test is not working as expected so that we can use npx playwright test loginBasic.spec.ts --ui to see the issue
   */
  const searchResults = page.getByRole('article').or(page.locator('div.g'));
  await expect(searchResults.first()).toBeVisible();
});
