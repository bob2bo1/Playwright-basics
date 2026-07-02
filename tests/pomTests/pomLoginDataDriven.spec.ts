import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { readCsvFile } from '../../utils/csvReader';

// Read test data from CSV file
const loginData = readCsvFile('testdata/loginData.csv');

test.describe('Login Data-Driven Tests from CSV', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  // Generate a test for each row in the CSV file
  loginData.forEach((row, index) => {
    test(`Login test case ${index + 1}: ${row.email}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.login(row.email, row.password);

      if (row.expectedResult === 'success') {
        await expect(loginPage.logoutButton).toBeVisible();
      } else {
        await expect(loginPage.errorMessage).toBeVisible();
      }
    });
  });
});
