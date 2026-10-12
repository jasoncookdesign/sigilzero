import { test, expect } from '@playwright/test';

// GTM must only load on the production hostname, so dev and CI runs on
// localhost never send hits to Google Analytics or the Meta Pixel.
test('does not request Google Tag Manager on localhost', async ({ page }) => {
  const gtmRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('googletagmanager.com')) gtmRequests.push(request.url());
  });

  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await page.waitForLoadState('networkidle');

  expect(gtmRequests).toEqual([]);
  // The page still exposes a dataLayer for the site's own tracking code.
  expect(await page.evaluate(() => Array.isArray((window as unknown as { dataLayer?: unknown[] }).dataLayer))).toBe(true);
});
