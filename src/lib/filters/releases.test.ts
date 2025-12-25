import { describe, it, expect } from 'vitest';
import { filterReleases } from './releases';
import type { Release } from '../schemas/release';

// Helper to create mock release
const createMockRelease = (overrides: Partial<Release> = {}): Release => ({
  catalog_number: 'SIG001',
  id: 'test-release',
  slug: 'test-release',
  title: 'Test Release',
  type: 'single',
  series_id: 'core',
  primary_artists: ['test-artist'],
  remix_artists: [],
  release_date: '2025-01-01',
  status: 'released',
  genres: ['house'],
  moods: ['energetic'],
  flagship: false,
  active: true,
  tracks: [],
  ...overrides,
});

describe('filterReleases', () => {
  const mockReleases: Release[] = [
    createMockRelease({
      catalog_number: 'SIG100',
      id: 'rel-1',
      title: 'House Track',
      genres: ['house', 'tech-house'],
      moods: ['energetic'],
      series_id: 'core',
      bpm_range: '125-128',
      release_date: '2024-01-15',
    }),
    createMockRelease({
      catalog_number: 'SIG101',
      id: 'rel-2',
      title: 'Techno Beat',
      genres: ['techno'],
      moods: ['dark', 'hypnotic'],
      series_id: 'black',
      bpm_range: '130-135',
      release_date: '2024-06-20',
    }),
    createMockRelease({
      catalog_number: 'SIG102',
      id: 'rel-3',
      title: 'Ambient Soundscape',
      genres: ['ambient'],
      moods: ['chill', 'atmospheric'],
      series_id: 'void',
      release_date: '2023-12-01',
    }),
    createMockRelease({
      catalog_number: 'SIG103',
      id: 'rel-4',
      title: 'Bass House Banger',
      genres: ['bass-house', 'house'],
      moods: ['energetic', 'groovy'],
      series_id: 'red',
      bpm_range: '128-130',
      release_date: '2024-03-10',
    }),
  ];

  // Convert Release[] to ReleaseDocument[] for testing
  const mockDocuments = mockReleases.map(meta => ({ meta, body: 'Test body' }));

  describe('search query filtering', () => {
    it('should return all releases when search is empty', () => {
      const result = filterReleases(mockDocuments, {});
      expect(result).toHaveLength(4);
    });

    it('should filter by title (case-insensitive)', () => {
      const result = filterReleases(mockDocuments, { query: 'house' });
      expect(result).toHaveLength(2);
      expect(result.map(r => r.meta.id)).toContain('rel-1');
      expect(result.map(r => r.meta.id)).toContain('rel-4');
    });

    it('should filter by catalog number', () => {
      const result = filterReleases(mockDocuments, { query: 'SIG100' });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('rel-1');
    });

    it('should use fuzzy matching', () => {
      // Fuzzy match - all characters in order
      const result = filterReleases(mockDocuments, { query: 'tech' });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-2'); // 'Techno Beat'
    });
  });

  describe('series filtering', () => {
    it('should filter by specific series', () => {
      const result = filterReleases(mockDocuments, { seriesIds: ['core'] });
      expect(result).toHaveLength(1);
      expect(result[0].meta.series_id).toBe('core');
    });

    it('should return all when series is undefined', () => {
      const result = filterReleases(mockDocuments, { seriesIds: undefined });
      expect(result).toHaveLength(4);
    });

    it('should filter by multiple series', () => {
      const result = filterReleases(mockDocuments, { seriesIds: ['core', 'black'] });
      expect(result).toHaveLength(2);
    });
  });

  describe('genre filtering', () => {
    it('should filter by specific genre', () => {
      const result = filterReleases(mockDocuments, { genres: ['house'] });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-1');
      expect(ids).toContain('rel-4');
    });

    it('should return all when genre is undefined', () => {
      const result = filterReleases(mockDocuments, { genres: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('mood filtering', () => {
    it('should filter by specific mood', () => {
      const result = filterReleases(mockDocuments, { moods: ['energetic'] });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-1');
      expect(ids).toContain('rel-4');
    });

    it('should return all when mood is undefined', () => {
      const result = filterReleases(mockDocuments, { moods: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('BPM filtering', () => {
    it('should filter by BPM minimum and exclude releases without BPM', () => {
      const result = filterReleases(mockDocuments, { bpmMin: 129 });
      // Only releases with BPM >= 129
      expect(result).toHaveLength(2); // rel-2 (130-135) and rel-4 (128-130 overlaps)
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-2');
    });

    it('should filter by BPM maximum and exclude releases without BPM', () => {
      const result = filterReleases(mockDocuments, { bpmMax: 127 });
      // Only releases with BPM <= 127
      expect(result).toHaveLength(1); // rel-1 (125-128)
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-1');
    });

    it('should filter by BPM range and exclude releases without BPM', () => {
      // This should match releases with BPM overlap in 125-130 range
      const result = filterReleases(mockDocuments, { bpmMin: 125, bpmMax: 130 });
      // rel-1: 125-128 (overlaps), rel-2: 130-135 (overlaps at 130), rel-4: 128-130 (overlaps), rel-3: no BPM (excluded)
      expect(result.length).toBe(3);
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-1');
      expect(ids).toContain('rel-2');
      expect(ids).toContain('rel-4');
    });

    it('should include all releases when no BPM filter is set', () => {
      const result = filterReleases(mockDocuments, {});
      expect(result).toHaveLength(4); // Includes release without BPM
    });
  });

  describe('artist filtering', () => {
    it('should filter by primary artist', () => {
      const docsWithArtists = [
        { meta: createMockRelease({ id: 'rel-a', primary_artists: ['artist-1'], remix_artists: [] }), body: '' },
        { meta: createMockRelease({ id: 'rel-b', primary_artists: ['artist-2'], remix_artists: [] }), body: '' },
        { meta: createMockRelease({ id: 'rel-c', primary_artists: ['artist-3'], remix_artists: [] }), body: '' },
      ];
      const result = filterReleases(docsWithArtists, { artistIds: ['artist-1'] });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('rel-a');
    });

    it('should filter by remix artist', () => {
      const docsWithArtists = [
        { meta: createMockRelease({ id: 'rel-a', primary_artists: ['artist-1'], remix_artists: [] }), body: '' },
        { meta: createMockRelease({ id: 'rel-b', primary_artists: ['artist-1'], remix_artists: ['artist-2'] }), body: '' },
        { meta: createMockRelease({ id: 'rel-c', primary_artists: ['artist-3'], remix_artists: ['artist-2'] }), body: '' },
      ];
      const result = filterReleases(docsWithArtists, { artistIds: ['artist-2'] });
      expect(result).toHaveLength(2);
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-b');
      expect(ids).toContain('rel-c');
    });

    it('should filter by multiple artists (primary or remix)', () => {
      const docsWithArtists = [
        { meta: createMockRelease({ id: 'rel-a', primary_artists: ['artist-1'], remix_artists: [] }), body: '' },
        { meta: createMockRelease({ id: 'rel-b', primary_artists: ['artist-2'], remix_artists: ['artist-3'] }), body: '' },
        { meta: createMockRelease({ id: 'rel-c', primary_artists: ['artist-4'], remix_artists: [] }), body: '' },
      ];
      const result = filterReleases(docsWithArtists, { artistIds: ['artist-1', 'artist-3'] });
      expect(result).toHaveLength(2);
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-a'); // Has artist-1 as primary
      expect(ids).toContain('rel-b'); // Has artist-3 as remix
    });

    it('should include releases where artist is featured on a track', () => {
      const docsWithArtists = [
        {
          meta: createMockRelease({
            id: 'rel-a',
            tracks: [
              {
                id: 't1',
                title: 'Track 1',
                position: 1,
                primary_artists: ['artist-1'],
                featured_artists: ['artist-2'],
              },
            ],
          }),
          body: '',
        },
        { meta: createMockRelease({ id: 'rel-b', primary_artists: ['artist-3'], remix_artists: [] }), body: '' },
      ];

      const result = filterReleases(docsWithArtists, { artistIds: ['artist-2'] });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('rel-a');
    });

    it('should return all when artistIds is undefined', () => {
      const result = filterReleases(mockDocuments, { artistIds: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('year filtering', () => {
    it('should filter by year', () => {
      const result = filterReleases(mockDocuments, { year: 2024 });
      expect(result).toHaveLength(3);
      expect(result.every(r => r.meta.release_date.startsWith('2024'))).toBe(true);
    });

    it('should return all when year is undefined', () => {
      const result = filterReleases(mockDocuments, { year: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('combined filtering', () => {
    it('should apply multiple filters together', () => {
      const result = filterReleases(mockDocuments, {
        genres: ['house'],
        moods: ['energetic'],
        year: 2024
      });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('rel-1');
      expect(ids).toContain('rel-4');
      expect(result).toHaveLength(2);
    });

    it('should combine search with filters', () => {
      const result = filterReleases(mockDocuments, {
        query: 'bass',
        seriesIds: ['red']
      });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('rel-4');
    });
  });
});
