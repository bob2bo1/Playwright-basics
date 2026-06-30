import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page
    .getByRole('heading', { name: 'Playwright enables reliable' })
    .locator('span')
    .click();
  await page.getByRole('button', { name: 'Search (Control+k)' }).click();
  await page.getByRole('searchbox', { name: 'Search' }).fill('await');
  await page.getByRole('searchbox', { name: 'Search' }).press('Enter');
  await page.getByRole('heading', { name: '🔍 Snapshots and' }).click();
  await page.getByText("page.locator('body').ariaSnapshot()").click();
});
