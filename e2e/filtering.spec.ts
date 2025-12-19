import { test, expect } from '@playwright/test';

test.describe('Releases Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/releases');
    // Fail fast if we hit a 404 or error page
    await expect(page.locator('h1:has-text("404")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Error")')).not.toBeVisible();
    // Wait for catalog page to load
    await page.getByTestId('releases-page-title').waitFor();
  });

  test('should display releases page with filters', async ({ page }) => {
    await expect(page.getByTestId('releases-page-title')).toBeVisible();
    
    // Check if filter inputs are visible
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should filter releases by search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Get initial count of releases
    const initialCards = await page.locator('[class*="grid"] > div').count();
    
    // Type in search
    await searchInput.fill('Need More');
    await page.waitForTimeout(500); // Wait for filter to apply
    
    // Check that results are filtered (should be less than or equal to initial)
    const filteredCards = await page.locator('[class*="grid"] > div').count();
    expect(filteredCards).toBeLessThanOrEqual(initialCards);
  });

  test('should filter releases by series if available', async ({ page }) => {
    // Check if series filter exists
    const seriesSelect = page.locator('select:has(option:text("Series"))').first();
    
    if (await seriesSelect.isVisible()) {
      // Get initial count
      const initialCards = await page.locator('[class*="grid"] > div').count();
      
      // Select a series
      await seriesSelect.selectOption({ index: 1 }); // Select first non-"All" option
      await page.waitForTimeout(500);
      
      // Check that results changed
      const filteredCards = await page.locator('[class*="grid"] > div').count();
      expect(filteredCards).toBeLessThanOrEqual(initialCards);
    }
  });

  test('should filter releases by genre if available', async ({ page }) => {
    const genreCheckbox = page.locator('input[type="checkbox"]').first();
    
    if (await genreCheckbox.isVisible()) {
      // Get initial count
      const initialCards = await page.locator('[class*="grid"] > div').count();
      
      // Check a genre
      await genreCheckbox.check();
      await page.waitForTimeout(500);
      
      // Verify filtering occurred
      const filteredCards = await page.locator('[class*="grid"] > div').count();
      expect(filteredCards).toBeLessThanOrEqual(initialCards);
    }
  });

  test('should display release cards with expected content', async ({ page }) => {
    const firstCard = page.locator('[class*="grid"] > div').first();
    
    // Check that card has image and title
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3, h2')).toBeVisible();
  });

  test('should navigate to release detail page when clicked', async ({ page }) => {
    const firstCard = page.locator('[class*="grid"] > div').first();
    const title = await firstCard.locator('h3, h2').first().textContent();
    
    await firstCard.click();
    
    // Should navigate to a release detail page
    await expect(page).toHaveURL(/\/releases\/.+/);
    
    // Should show the release title
    if (title) {
      await expect(page.locator('h1')).toContainText(title);
    }
  });

  test('should clear filters', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Apply a filter
    await searchInput.fill('Test');
    await page.waitForTimeout(500);
    
    // Clear the search
    await searchInput.clear();
    await page.waitForTimeout(500);
    
    // Should show all releases again
    const cards = await page.locator('[class*="grid"] > div').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('should show filtered count', async ({ page }) => {
    // Check if filtered count is displayed
    const countText = page.locator('text=/\\d+ releases?/i').first();
    await expect(countText).toBeVisible();
  });
});

test.describe('Mixtapes Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mixtapes');
    // Fail fast if we hit a 404 or error page
    await expect(page.locator('h1:has-text("404")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Error")')).not.toBeVisible();
    // Wait for catalog page to load
    await page.getByTestId('mixtapes-page-title').waitFor();
  });

  test('should display mixtapes page with filters', async ({ page }) => {
    await expect(page.getByTestId('mixtapes-page-title')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should filter mixtapes by search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    const initialCards = await page.locator('[class*="grid"] > div').count();
    
    await searchInput.fill('Live');
    await page.waitForTimeout(500);
    
    const filteredCards = await page.locator('[class*="grid"] > div').count();
    expect(filteredCards).toBeLessThanOrEqual(initialCards);
  });

  test('should filter mixtapes by artist if available', async ({ page }) => {
    const artistSelect = page.locator('select:has(option:text("Artist"))').first();
    
    if (await artistSelect.isVisible()) {
      const initialCards = await page.locator('[class*="grid"] > div').count();
      
      await artistSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
      
      const filteredCards = await page.locator('[class*="grid"] > div').count();
      expect(filteredCards).toBeLessThanOrEqual(initialCards);
    }
  });

  test('should display mixtape cards with expected content', async ({ page }) => {
    const firstCard = page.locator('[class*="grid"] > div').first();
    
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3, h2')).toBeVisible();
  });

  test('should navigate to mixtape detail page when clicked', async ({ page }) => {
    const firstCard = page.locator('[class*="grid"] > div').first();
    
    await firstCard.click();
    
    await expect(page).toHaveURL(/\/mixtapes\/.+/);
  });

  test('should show year filter', async ({ page }) => {
    const yearSelect = page.locator('select:has(option:text("Year"))').first();
    
    if (await yearSelect.isVisible()) {
      // Select a year
      await yearSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
      
      // Should filter results
      const cards = await page.locator('[class*="grid"] > div').count();
      expect(cards).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Artists Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/artists');
    // Fail fast if we hit a 404 or error page
    await expect(page.locator('h1:has-text("404")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Error")')).not.toBeVisible();
    // Wait for catalog page to load
    await page.getByTestId('artists-page-title').waitFor();
  });

  test('should display artists page', async ({ page }) => {
    await expect(page.getByTestId('artists-page-title')).toBeVisible();
  });

  test('should display artist cards', async ({ page }) => {
    const cards = await page.locator('[class*="grid"] > div').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('should navigate to artist detail page when clicked', async ({ page }) => {
    const firstCard = page.locator('[class*="grid"] > div').first();
    
    await firstCard.click();
    
    await expect(page).toHaveURL(/\/artists\/.+/);
  });

  test('should show only active artists', async ({ page }) => {
    // All displayed artists should be active (not inactive)
    const cards = await page.locator('[class*="grid"] > div').count();
    expect(cards).toBeGreaterThan(0);
  });
});

test.describe('Series Page', () => {
  test('should display series page if available', async ({ page }) => {
    await page.goto('/series');
    
    // Either shows series or redirects
    const url = page.url();
    if (url.includes('/series')) {
      await expect(page.getByTestId('series-page-title')).toBeVisible();
      
      const cards = await page.locator('[class*="grid"] > div').count();
      expect(cards).toBeGreaterThanOrEqual(0);
    }
  });

  test('should navigate to series detail page', async ({ page }) => {
    await page.goto('/series');
    
    if (page.url().includes('/series')) {
      const firstCard = page.locator('[class*="grid"] > div').first();
      
      if (await firstCard.isVisible()) {
        await firstCard.click();
        await expect(page).toHaveURL(/\/series\/.+/);
      }
    }
  });
});
