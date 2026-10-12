import { test, expect } from '@playwright/test';

// The release page is static HTML built on one day and viewed on another.
// Status and stream/buy links must follow the visitor's date, not the build's.
// "Drums in the Deep" is dated 2026-06-02 and has streaming and purchase links.
const RELEASE = '/releases/drums-in-the-deep/';
const SPOTIFY = 'a[href^="https://open.spotify.com/"]';
const BEATPORT = 'a[href^="https://www.beatport.com/"]';

test.describe('Release status follows the visitor date', () => {
  test('before the release date: Coming Soon and no live links', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-01T12:00:00'));
    await page.goto(RELEASE);

    await expect(page.getByText('Coming Soon', { exact: true })).toBeVisible();
    await expect(page.locator(SPOTIFY)).toHaveCount(0);
    await expect(page.locator(BEATPORT)).toHaveCount(0);
    // The controls are still shown, as inert placeholders.
    await expect(page.locator('span[title="Spotify"]')).toBeVisible();
  });

  test('on the release date: New Release and live links', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-02T09:00:00'));
    await page.goto(RELEASE);

    await expect(page.getByText('New Release', { exact: true })).toBeVisible();
    await expect(page.locator(SPOTIFY)).toHaveCount(1);
    await expect(page.locator(BEATPORT)).toHaveCount(1);
  });

  test('more than 30 days after release: no badge, live links', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-08-01T12:00:00'));
    await page.goto(RELEASE);

    await expect(page.locator(SPOTIFY)).toHaveCount(1);
    await expect(page.getByText('New Release', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Coming Soon', { exact: true })).toHaveCount(0);
  });

  test.describe('east of UTC', () => {
    test.use({ timezoneId: 'Europe/Berlin' });

    test('goes live at local midnight, while it is still the day before in UTC', async ({ page }) => {
      // 00:30 on 2026-06-02 in Berlin is 22:30 UTC on 2026-06-01.
      await page.clock.setFixedTime(new Date('2026-06-01T22:30:00Z'));
      await page.goto(RELEASE);

      await expect(page.getByText('New Release', { exact: true })).toBeVisible();
      await expect(page.locator(BEATPORT)).toHaveCount(1);
    });
  });

  test('release cards on the catalog follow the visitor date too', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-06-01T12:00:00'));
    await page.goto('/releases/');

    const card = page.locator('a[href="/releases/drums-in-the-deep"], a[href="/releases/drums-in-the-deep/"]');
    await expect(card.getByText('Coming Soon', { exact: true })).toBeVisible();
  });
});
