import { test } from '@playwright/test';

// using frame() method to interact with frames with name or url
test('handle frames test', async ({ page }) => {
  await page.goto('https://ui.vision/demo/webtest/frames/');
  //total frames

  const frames = page.frames();
  console.log('Total frames:', frames.length);
  const frame = page.frame({
    url: 'https://ui.vision/demo/webtest/frames/frame_1.html',
  });
  frame?.fill('input[ name="mytext1"]', 'test');
});

// using frameLocator() method to interact with frames
test('handle frames test with frameLocator', async ({ page }) => {
  await page.goto('https://ui.vision/demo/webtest/frames/');
  //total frames

  const frames = page.frames();
  console.log('Total frames:', frames.length);
  const frame = page.frameLocator('frame[src="frame_1.html"]');
  frame.locator('input[name="mytext1"]').fill('test');
});
