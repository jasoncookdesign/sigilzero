import { test, expect, type Page } from '@playwright/test';
import {
  activeArtists,
  activeMixtapes,
  activeReleases,
  allSeries,
  hasActiveSeries,
} from './content';

const releaseCards = (page: Page) => page.getByTestId('release-card');
const mixtapeCards = (page: Page) => page.getByTestId('mixtape-card');
const artistCards = (page: Page) => page.getByTestId('artist-card');

async function cardTitles(cards: ReturnType<Page['getByTestId']>) {
  return (await cards.locator('h3').allTextContents()).map((t) => t.trim()).sort();
}

async function openFilters(page: Page) {
  await page.getByRole('button', { name: 'More Filters' }).click();
  await expect(page.getByRole('button', { name: 'Hide Filters' })).toBeVisible();
}

const titlesOf = (docs: Record<string, any>[]) => docs.map((d) => d.title as string).sort();

test.describe('Releases Filtering', () => {
  const releases = activeReleases();

  test.beforeEach(async ({ page }) => {
    await page.goto('/releases');
    await expect(page.getByTestId('releases-page-title')).toBeVisible();
    await expect(releaseCards(page)).toHaveCount(releases.length);
  });

  test('shows a card for every active release', async ({ page }) => {
    expect(releases.length).toBeGreaterThan(1);
    expect(await cardTitles(releaseCards(page))).toEqual(titlesOf(releases));
  });

  test('search narrows to the matching release', async ({ page }) => {
    await page.getByPlaceholder(/Search/).fill('Afterphase');

    // Fuzzy matching also lets some unrelated releases through, so this checks
    // that the match is shown and the list shrank, not an exact result set.
    const cards = releaseCards(page);
    await expect(cards.filter({ hasText: 'Afterphase' })).toHaveCount(1);
    await expect(cards).not.toHaveCount(releases.length);
  });

  test('series filter matches whether any series is active', async ({ page }) => {
    await openFilters(page);
    const seriesSelect = page.getByLabel('Filter by series');

    if (!hasActiveSeries()) {
      await expect(seriesSelect).toHaveCount(0);
      return;
    }
    const seriesId = allSeries().find((s) => s.active !== false)!.id as string;
    await seriesSelect.selectOption(seriesId);
    expect(await cardTitles(releaseCards(page))).toEqual(
      titlesOf(releases.filter((r) => r.series_id === seriesId))
    );
  });

  test('genre filter shows exactly the releases with that genre', async ({ page }) => {
    const genre = 'progressive tech house';
    const expected = titlesOf(releases.filter((r) => (r.genres ?? []).includes(genre)));
    expect(expected.length).toBeGreaterThan(0);
    expect(expected.length).toBeLessThan(releases.length);

    await openFilters(page);
    await page.getByRole('button', { name: genre, exact: true }).click();

    await expect(releaseCards(page)).toHaveCount(expected.length);
    expect(await cardTitles(releaseCards(page))).toEqual(expected);
  });

  test('type filter shows exactly the releases of that type', async ({ page }) => {
    const expected = titlesOf(releases.filter((r) => r.type === 'album'));
    expect(expected.length).toBeGreaterThan(0);

    await openFilters(page);
    await page.getByLabel('Filter by type').selectOption('album');

    await expect(releaseCards(page)).toHaveCount(expected.length);
    expect(await cardTitles(releaseCards(page))).toEqual(expected);
  });

  test('year filter shows exactly the releases from that year', async ({ page }) => {
    const expected = titlesOf(releases.filter((r) => String(r.release_date).startsWith('2023-')));
    expect(expected.length).toBeGreaterThan(0);

    await openFilters(page);
    await page.getByLabel('Filter by year').selectOption('2023');

    await expect(releaseCards(page)).toHaveCount(expected.length);
    expect(await cardTitles(releaseCards(page))).toEqual(expected);
  });

  test('clicking a card opens that release', async ({ page }) => {
    await releaseCards(page).filter({ hasText: 'Afterphase' }).click();

    await expect(page).toHaveURL(/\/releases\/afterphase\/?$/);
    await expect(page.locator('h1')).toContainText('Afterphase');
  });

  test('Clear filters restores every release', async ({ page }) => {
    await page.getByPlaceholder(/Search/).fill('Afterphase');
    await expect(releaseCards(page)).not.toHaveCount(releases.length);

    await page.getByRole('button', { name: 'Clear filters' }).first().click();

    await expect(page.getByPlaceholder(/Search/)).toHaveValue('');
    await expect(releaseCards(page)).toHaveCount(releases.length);
  });

  test('filtered count reports the visible cards', async ({ page }) => {
    await page.getByPlaceholder(/Search/).fill('Afterphase');
    await expect(releaseCards(page)).not.toHaveCount(releases.length);

    const shown = await releaseCards(page).count();
    await expect(page.getByText(`Showing ${shown} of ${releases.length} releases`)).toBeVisible();
  });
});

test.describe('Mixtapes Filtering', () => {
  const mixtapes = activeMixtapes();

  test.beforeEach(async ({ page }) => {
    await page.goto('/mixtapes');
    await expect(page.getByTestId('mixtapes-page-title')).toBeVisible();
    await expect(mixtapeCards(page)).toHaveCount(mixtapes.length);
  });

  test('shows a card for every active mixtape', async ({ page }) => {
    expect(mixtapes.length).toBeGreaterThan(1);
    expect(await cardTitles(mixtapeCards(page))).toEqual(titlesOf(mixtapes));
  });

  test('search narrows to the matching mixtape', async ({ page }) => {
    await page.getByPlaceholder(/Search/).fill('Caribbean');

    const cards = mixtapeCards(page);
    await expect(cards.filter({ hasText: 'Live in the Caribbean' })).toHaveCount(1);
    await expect(cards).not.toHaveCount(mixtapes.length);
  });

  test('artist filter shows exactly that artist\'s mixtapes', async ({ page }) => {
    const expected = titlesOf(mixtapes.filter((m) => m.artist_id === 'b-squared'));
    expect(expected.length).toBeGreaterThan(0);

    await openFilters(page);
    await page.getByLabel('Filter by artist').selectOption('b-squared');

    await expect(mixtapeCards(page)).toHaveCount(expected.length);
    expect(await cardTitles(mixtapeCards(page))).toEqual(expected);
  });

  test('year filter offers each content year and filters by it', async ({ page }) => {
    const years = [...new Set(mixtapes.map((m) => String(m.date).slice(0, 4)))].sort().reverse();

    await openFilters(page);
    const yearSelect = page.getByLabel('Filter by year');
    await expect(yearSelect.locator('option')).toHaveText(['All years', ...years]);

    const expected = titlesOf(mixtapes.filter((m) => String(m.date).startsWith('2024-')));
    await yearSelect.selectOption('2024');
    await expect(mixtapeCards(page)).toHaveCount(expected.length);
    expect(await cardTitles(mixtapeCards(page))).toEqual(expected);
  });

  test('clicking a card opens that mixtape', async ({ page }) => {
    await mixtapeCards(page).filter({ hasText: 'Live in the Caribbean' }).click();

    await expect(page).toHaveURL(/\/mixtapes\/dyson-hope-live-in-the-caribbean\/?$/);
    await expect(page.locator('h1')).toContainText('Live in the Caribbean');
  });
});

test.describe('Artists Filtering', () => {
  const artists = activeArtists();

  test.beforeEach(async ({ page }) => {
    await page.goto('/artists');
    await expect(page.getByTestId('artists-page-title')).toBeVisible();
  });

  test('shows exactly the active artists', async ({ page }) => {
    expect(artists.length).toBeGreaterThan(0);
    await expect(artistCards(page)).toHaveCount(artists.length);
    expect(await cardTitles(artistCards(page))).toEqual(artists.map((a) => a.name as string).sort());
  });

  test('clicking a card opens that artist', async ({ page }) => {
    const artist = artists[0]!;
    await artistCards(page).filter({ hasText: artist.name }).click();

    await expect(page).toHaveURL(new RegExp(`/artists/${artist.slug}/?$`));
    await expect(page.locator('h1')).toContainText(artist.name);
  });
});

test.describe('Series Page', () => {
  const series = allSeries();

  test('lists every series', async ({ page }) => {
    await page.goto('/series');
    await expect(page.getByTestId('series-page-title')).toBeVisible();
    await expect(page.getByTestId('series-card')).toHaveCount(series.length);
  });

  test('clicking a series card opens that series', async ({ page }) => {
    await page.goto('/series');
    const first = page.getByTestId('series-card').first();
    const href = await first.getAttribute('href');
    expect(href).toMatch(/^\/series\/.+/);

    await first.click();
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/\/$/, '')}/?$`));
  });
});
