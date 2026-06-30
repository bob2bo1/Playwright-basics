import { test, expect } from '@playwright/test';

test('iframe test using accessibility locators', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  // Use getByRole to locate the heading
  const heading = page.getByRole('heading', {
    name: 'An iFrame containing the TinyMCE WYSIWYG Editor',
  });
  await expect(heading).toBeVisible();

  // Get the main iframe using frameLocator
  const frame = page.frameLocator('iframe');

  // Wait for the editor iframe to be present
  const editorIframe = frame.locator('iframe#mce_0_ifr');
  await expect(editorIframe).toBeVisible();

  // Get the nested iframe content
  const editorFrame = frame.frameLocator('#mce_0_ifr');

  // Get the body element which is the editable area
  const editorBody = editorFrame.locator('body');
  await expect(editorBody).toBeVisible();

  // Clear the default text and type new content
  await editorBody.click();
  await editorBody.fill('');
  await editorBody.type('Hello from Playwright!');

  // Verify the text was entered
  await expect(editorBody).toHaveText('Hello from Playwright!');
});

test('iframe basic interaction test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  // Use getByRole to locate the heading
  const heading = page.getByRole('heading', {
    name: 'An iFrame containing the TinyMCE WYSIWYG Editor',
  });
  await expect(heading).toBeVisible();

  // Get the main iframe using frameLocator
  const frame = page.frameLocator('iframe');

  // Get the nested iframe content
  const editorFrame = frame.frameLocator('#mce_0_ifr');

  // Get the body element which is the editable area
  const editorBody = editorFrame.locator('body');
  await expect(editorBody).toBeVisible();

  // Type some text
  await editorBody.click();
  await editorBody.fill('Testing iframe with Playwright');

  // Verify the content
  await expect(editorBody).toHaveText('Testing iframe with Playwright');
});
