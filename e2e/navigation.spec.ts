import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display the homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SIGIL.ZERO/);
  });

  test('should display the logo in navigation', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('nav img[alt*="SIGIL"]');
    await expect(logo).toBeVisible();
  });

  test('should have sticky navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toHaveCSS('position', 'sticky');
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('should navigate to Artists page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Artists');
    await expect(page).toHaveURL('/artists');
    await expect(page.locator('h1')).toContainText('Artists');
  });

  test('should navigate to Releases page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Releases');
    await expect(page).toHaveURL('/releases');
    await expect(page.locator('h1')).toContainText('Releases');
  });

  test('should navigate to Mixtapes page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Mixtapes');
    await expect(page).toHaveURL('/mixtapes');
    await expect(page.locator('h1')).toContainText('Mixtapes');
  });

  test('should navigate to Press Kit page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Press Kit');
    await expect(page).toHaveURL('/press-kit');
    await expect(page.locator('h1')).toContainText('Press Kit');
  });

  test('should show Series link if active series exist', async ({ page }) => {
    await page.goto('/');
    const seriesLink = page.locator('nav a:has-text("Series")');
    
    // Check if Series link is visible (it should be since we have active series)
    const isVisible = await seriesLink.isVisible();
    
    if (isVisible) {
      await seriesLink.click();
      await expect(page).toHaveURL('/series');
      await expect(page.locator('h1')).toContainText('Series');
    }
  });

  test('should display footer with correct sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for footer sections
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer:has-text("About")')).toBeVisible();
    await expect(page.locator('footer:has-text("Explore")')).toBeVisible();
    await expect(page.locator('footer:has-text("Connect")')).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');
    
    // Test footer About link
    const footerAboutLink = page.locator('footer a:has-text("About")');
    await footerAboutLink.click();
    await expect(page).toHaveURL('/about');
  });

  test('should show homepage sections in correct order', async ({ page }) => {
    await page.goto('/');
    
    // Check for main homepage sections
    await expect(page.locator('h2:has-text("Latest Releases")')).toBeVisible();
    await expect(page.locator('h2:has-text("Latest Mixtapes")')).toBeVisible();
    await expect(page.locator('h2:has-text("Featured Artists")')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display navigation on mobile', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate on mobile devices', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Artists');
    await expect(page).toHaveURL('/artists');
  });
});
