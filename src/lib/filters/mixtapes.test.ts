import { describe, it, expect } from 'vitest';
import { filterMixtapes } from './mixtapes';
import type { Mixtape } from '../schemas/mixtape';

// Helper to create mock mixtape
const createMockMixtape = (overrides: Partial<Mixtape> = {}): Mixtape => ({
  id: 'test-mixtape',
  slug: 'test-mixtape',
  artist_id: 'test-artist',
  title: 'Test Mixtape',
  date: '2025-01-01',
  platform: 'soundcloud',
  embed_url: 'https://soundcloud.com/test',
  cover_image: '/test.jpg',
  genres: ['house'],
  moods: ['energetic'],
  tags: [],
  featured: false,
  active: true,
  related_releases: [],
  ...overrides,
});

describe('filterMixtapes', () => {
  const mockMixtapes: Mixtape[] = [
    createMockMixtape({
      id: 'mix-1',
      title: 'House Mix Vol 1',
      artist_id: 'dj-house',
      genres: ['house', 'tech-house'],
      moods: ['energetic'],
      platform: 'soundcloud',
      date: '2024-01-15',
      event_name: 'Summer Festival',
      location: 'Austin, TX',
    }),
    createMockMixtape({
      id: 'mix-2',
      title: 'Dark Techno Journey',
      artist_id: 'dj-techno',
      genres: ['techno'],
      moods: ['dark', 'hypnotic'],
      platform: 'mixcloud',
      date: '2024-06-20',
      tags: ['live', 'recorded'],
    }),
    createMockMixtape({
      id: 'mix-3',
      title: 'Ambient Exploration',
      artist_id: 'dj-ambient',
      genres: ['ambient'],
      moods: ['chill', 'atmospheric'],
      platform: 'youtube',
      date: '2023-12-01',
      location: 'Berlin',
    }),
    createMockMixtape({
      id: 'mix-4',
      title: 'Bass House Party',
      artist_id: 'dj-house',
      genres: ['bass-house', 'house'],
      moods: ['energetic', 'groovy'],
      platform: 'soundcloud',
      date: '2024-03-10',
      tags: ['party', 'club'],
    }),
  ];

  // Convert Mixtape[] to MixtapeDocument[] for testing
  const mockDocuments = mockMixtapes.map(meta => ({ meta, body: 'Test body' }));

  describe('search query filtering', () => {
    it('should return all mixtapes when search is empty', () => {
      const result = filterMixtapes(mockDocuments, {});
      expect(result).toHaveLength(4);
    });

    it('should filter by title (case-insensitive)', () => {
      const result = filterMixtapes(mockDocuments, { query: 'house' });
      expect(result).toHaveLength(2);
      expect(result.map(r => r.meta.id)).toContain('mix-1');
      expect(result.map(r => r.meta.id)).toContain('mix-4');
    });

    it('should filter by event name', () => {
      const result = filterMixtapes(mockDocuments, { query: 'summer festival' });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('mix-1');
    });

    it('should filter by location', () => {
      const result = filterMixtapes(mockDocuments, { query: 'berlin' });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('mix-3');
    });
  });

  describe('artist filtering', () => {
    it('should filter by specific artist', () => {
      const result = filterMixtapes(mockDocuments, { artistIds: ['dj-house'] });
      expect(result).toHaveLength(2);
      expect(result.every(r => r.meta.artist_id === 'dj-house')).toBe(true);
    });

    it('should return all when artist is undefined', () => {
      const result = filterMixtapes(mockDocuments, { artistIds: undefined });
      expect(result).toHaveLength(4);
    });

    it('should filter by multiple artists', () => {
      const result = filterMixtapes(mockDocuments, { artistIds: ['dj-house', 'dj-techno'] });
      expect(result).toHaveLength(3);
    });
  });

  describe('platform filtering', () => {
    it('should filter by specific platform', () => {
      const result = filterMixtapes(mockDocuments, { platforms: ['soundcloud'] });
      expect(result).toHaveLength(2);
      expect(result.every(r => r.meta.platform === 'soundcloud')).toBe(true);
    });

    it('should return all when platform is undefined', () => {
      const result = filterMixtapes(mockDocuments, { platforms: undefined });
      expect(result).toHaveLength(4);
    });

    it('should filter by multiple platforms', () => {
      const result = filterMixtapes(mockDocuments, { platforms: ['soundcloud', 'mixcloud'] });
      expect(result).toHaveLength(3);
    });
  });

  describe('genre filtering', () => {
    it('should filter by specific genre', () => {
      const result = filterMixtapes(mockDocuments, { genres: ['house'] });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('mix-1');
      expect(ids).toContain('mix-4');
    });

    it('should return all when genre is undefined', () => {
      const result = filterMixtapes(mockDocuments, { genres: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('mood filtering', () => {
    it('should filter by specific mood', () => {
      const result = filterMixtapes(mockDocuments, { moods: ['energetic'] });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('mix-1');
      expect(ids).toContain('mix-4');
    });

    it('should return all when mood is undefined', () => {
      const result = filterMixtapes(mockDocuments, { moods: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('tags filtering', () => {
    it('should filter by specific tags', () => {
      const result = filterMixtapes(mockDocuments, { tags: ['live'] });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('mix-2');
    });

    it('should filter by multiple tags', () => {
      const result = filterMixtapes(mockDocuments, { tags: ['party', 'club'] });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('mix-4');
    });
  });

  describe('year filtering', () => {
    it('should filter by year', () => {
      const result = filterMixtapes(mockDocuments, { year: 2024 });
      expect(result).toHaveLength(3);
      expect(result.every(r => r.meta.date.startsWith('2024'))).toBe(true);
    });

    it('should return all when year is undefined', () => {
      const result = filterMixtapes(mockDocuments, { year: undefined });
      expect(result).toHaveLength(4);
    });
  });

  describe('combined filtering', () => {
    it('should apply multiple filters together', () => {
      const result = filterMixtapes(mockDocuments, {
        artistIds: ['dj-house'],
        genres: ['house'],
        moods: ['energetic'],
        year: 2024
      });
      const ids = result.map(r => r.meta.id);
      expect(ids).toContain('mix-1');
      expect(ids).toContain('mix-4');
      expect(result).toHaveLength(2);
    });

    it('should combine search with filters', () => {
      const result = filterMixtapes(mockDocuments, {
        query: 'party',
        platforms: ['soundcloud']
      });
      expect(result).toHaveLength(1);
      expect(result[0].meta.id).toBe('mix-4');
    });
  });
});
