import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that page loads
    await expect(page).toHaveTitle(/SIGIL.ZERO/);
    
    // Check that navigation is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check that main content exists
    await expect(page.locator('main')).toBeVisible();
    
    // Check that footer exists
    await expect(page.locator('footer')).toBeVisible();
  });

  test('can navigate to all main pages', async ({ page }) => {
    await page.goto('/');
    
    // Test About page
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Artists page
    await page.goto('/artists');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Releases page
    await page.goto('/releases');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Mixtapes page
    await page.goto('/mixtapes');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test Press Kit page
    await page.goto('/press-kit');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('404 page works', async ({ page }) => {
    await page.goto('/non-existent-page-xyz');
    
    // Should show 404 or redirect
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
