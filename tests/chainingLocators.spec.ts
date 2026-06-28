import { test, expect } from '@playwright/test';

test('Practice handling herokuapp data tables', async ({ page }) => {
  // Navigate to the live test site
  await page.goto('https://the-internet.herokuapp.com/tables');

  // 1. Target the table element specifically (ID: table1)
  const targetTable = page.locator('#table1');

  // 2. Find the row containing both 'Smith' and 'John' (they're in separate td elements)
  const johnRow = targetTable.locator('tr').filter({ hasText: 'Smith' }).filter({ hasText: 'John' });

  // 3. Click the edit link within John's row
  await johnRow.getByRole('link', { name: 'edit' }).click();

  // 4. Assert that the page URL shifts or appends the edit hash fragment
  await expect(page).toHaveURL(/#edit/);
});