import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../../pages/registerPage';
import { fakerUsers } from '../../utils/registerUsers';

test.describe('Registration Tests with Hooks', () => {
  // beforeEach: Navigate to homepage and click register before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
  });

  test('Register with invalid data - empty first name', async ({ page }) => {

    const registerPage = new RegisterPage(page);
    const user = fakerUsers();
    await registerPage.register('', user.lastName, user.email, user.password);
    const firstname = page.getByLabel('First Name');
    await expect(firstname).toHaveJSProperty('validationMessage', 'Please fill in this field.');

  });

  test('Register Happy Path', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = fakerUsers();
    await registerPage.register(user.name, user.lastName, user.email, user.password);
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
  });
});