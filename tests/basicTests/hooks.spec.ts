import { test, expect, type Page } from '@playwright/test';

test.describe('Login Tests with Hooks', () => {
  // beforeEach: Runs before each test in this describe block
  test.beforeEach(async ({ page }) => {
    console.log('Starting login test...');
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    console.log('Finished login test, cleaning up...');
  });

  test('Happy Path - Successful Login', async ({ page }) => {
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByRole('button', { name: 'Log In' }).click();

    const logoutButton = page.getByRole('button', { name: 'Log Out' });
    await expect(logoutButton).toBeVisible();
  });

  test('Negative Path - Invalid Credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Log In' }).click();

    const errorMessage = page.getByText('Sorry, those credentials do not match');
    await expect(errorMessage).toBeVisible();
  });
});

test.describe('Search Tests with Hooks', () => {
  let searchPage: Page | null = null;

  // beforeAll: Runs once before all tests in this describe block
  test.beforeAll(async ({ browser }) => {
    console.log('Setting up search test suite...');
    searchPage = await browser.newPage();
  });

  // afterAll: Runs once after all tests in this describe block
  test.afterAll(async () => {
    console.log('Cleaning up search test suite...');
    if (searchPage) {
      await searchPage.close();
    }
  });

  test('Google Search for Product', async ({ page }) => {
    await page.goto('https://www.google.com');

    // Handle Google cookie consent popup
    try {
      const acceptCookies = page.locator('button:has-text("Accept all"), button:has-text("I agree"), button[aria-label="Accept all"]');
      if (await acceptCookies.isVisible({ timeout: 3000 })) {
        await acceptCookies.click();
      }
    } catch (e) {
      // No cookie popup found, continue
    }

    await page.getByRole('combobox', { name: 'Search' }).fill('laptop');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');
    await page.waitForLoadState('networkidle');

    const searchResults = page.getByRole('article').or(page.locator('div.g'));
    await expect(searchResults.first()).toBeVisible();
  });
});


