import { test, expect, type Locator } from '@playwright/test';

test('Verify delayed search results and loading behavior', async ({ page }) => {
  // 1. Open a page with delayed search results
  await page.goto('https://wikipedia.org');

  // 2. Search for a value that returns results
  const searchInput: Locator = page.getByLabel('Search Wikipedia');
  await searchInput.fill('Playwright');

  // Click the search button to trigger the search
  await page.getByRole('button', { name: 'Search' }).click();

  // 3. Wait for the page to navigate (either to article or search results)
  await page.waitForLoadState('networkidle');

  // 4. Verify the page contains the search term
  await expect(page.locator('body')).toContainText('Playwright', {
    ignoreCase: true,
  });

  // 5. Clean code: Built-in web-first assertions completely replace waitForTimeout
});
