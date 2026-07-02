import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { fakerUsers, validUsers, invalidUsers } from '../../utils/loginUsers';

test.describe('Login Tests with Hooks', () => {
  // beforeEach: Navigate to homepage and click login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('Login Happy Path', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = validUsers()[0];
    await loginPage.login(user.email, user.password);
    await expect(loginPage.logoutButton).toBeVisible();
  });

  test('Login Negative Path - Invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = invalidUsers()[0];
    await loginPage.login(user.email, user.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Login with faker generated user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = fakerUsers();
    await loginPage.login(user.email, user.password);
    // Note: This will likely fail with random credentials, but demonstrates the pattern
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
