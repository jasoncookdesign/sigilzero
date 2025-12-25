import { describe, it, expect } from 'vitest';
import { ReleaseSchema } from './release';

describe('ReleaseSchema', () => {
  const validRelease = {
    catalog_number: 'SIG001',
    id: 'test-release',
    slug: 'test-release',
    title: 'Test Release',
    type: 'single' as const,
    series_id: 'core',
    primary_artists: ['artist-1'],
    release_date: '2024-01-15',
    cover_art: '/assets/covers/test.jpg',
    tracks: [],
  };

  describe('valid data', () => {
    it('should accept valid release data', () => {
      const result = ReleaseSchema.safeParse(validRelease);
      expect(result.success).toBe(true);
    });

    it('should accept all release types', () => {
      const types = ['single', 'maxi-single', 'ep', 'album'];
      types.forEach(type => {
        const result = ReleaseSchema.safeParse({ ...validRelease, type });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all status values', () => {
      const statuses = ['released', 'upcoming', 'promo-only'];
      statuses.forEach(status => {
        const result = ReleaseSchema.safeParse({ ...validRelease, status });
        expect(result.success).toBe(true);
      });
    });

    it('should accept optional fields', () => {
      const withOptionals = {
        ...validRelease,
        remix_artists: ['remixer-1'],
        preorder_date: '2024-01-01',
        bpm_range: '128-132',
        key_center: 'A minor',
        flagship: true,
        active: false,
      };
      const result = ReleaseSchema.safeParse(withOptionals);
      expect(result.success).toBe(true);
    });

    it('should accept featured artists on tracks', () => {
      const result = ReleaseSchema.safeParse({
        ...validRelease,
        tracks: [
          {
            id: 't1',
            title: 'Song',
            position: 1,
            primary_artists: ['artist-1'],
            featured_artists: ['artist-2'],
          },
        ],
      });

      expect(result.success).toBe(true);
    });
  });

  describe('required fields', () => {
    it('should require catalog_number', () => {
      const { catalog_number, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require id', () => {
      const { id, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require slug', () => {
      const { slug, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require title', () => {
      const { title, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require type', () => {
      const { type, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require series_id', () => {
      const { series_id, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require primary_artists', () => {
      const { primary_artists, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require release_date', () => {
      const { release_date, ...missing } = validRelease;
      const result = ReleaseSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });
  });

  describe('default values', () => {
    it('should default status to "released"', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.status).toBe('released');
    });

    it('should default genres to empty array', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.genres).toEqual([]);
    });

    it('should default moods to empty array', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.moods).toEqual([]);
    });

    it('should default remix_artists to empty array', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.remix_artists).toEqual([]);
    });

    it('should default flagship to false', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.flagship).toBe(false);
    });

    it('should default active to true', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.active).toBe(true);
    });

    it('should default tracks to empty array', () => {
      const result = ReleaseSchema.parse(validRelease);
      expect(result.tracks).toEqual([]);
    });

    it('should default track remix_artists to empty array', () => {
      const result = ReleaseSchema.parse({
        ...validRelease,
        tracks: [
          {
            id: 't1',
            title: 'Song',
            position: 1,
            primary_artists: ['artist-1'],
          },
        ],
      });

      expect(result.tracks[0].remix_artists).toEqual([]);
    });

    it('should default track featured_artists to empty array', () => {
      const result = ReleaseSchema.parse({
        ...validRelease,
        tracks: [
          {
            id: 't1',
            title: 'Song',
            position: 1,
            primary_artists: ['artist-1'],
          },
        ],
      });

      expect(result.tracks[0].featured_artists).toEqual([]);
    });
  });

  describe('validation', () => {
    it('should reject invalid type', () => {
      const invalid = { ...validRelease, type: 'invalid-type' };
      const result = ReleaseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalid = { ...validRelease, status: 'invalid-status' };
      const result = ReleaseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject empty primary_artists array', () => {
      const invalid = { ...validRelease, primary_artists: [] };
      const result = ReleaseSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject empty string fields', () => {
      const fields = ['catalog_number', 'id', 'slug', 'title', 'series_id', 'release_date'];
      fields.forEach(field => {
        const invalid = { ...validRelease, [field]: '' };
        const result = ReleaseSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });
  });
});
