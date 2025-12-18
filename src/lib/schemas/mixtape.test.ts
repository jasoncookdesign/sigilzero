import { describe, it, expect } from 'vitest';
import { MixtapeSchema } from './mixtape';

describe('MixtapeSchema', () => {
  const validMixtape = {
    id: 'test-mixtape',
    slug: 'test-mixtape',
    artist_id: 'test-artist',
    title: 'Test Mixtape',
    date: '2024-01-15',
    platform: 'soundcloud' as const,
    embed_url: 'https://soundcloud.com/test/embed',
    cover_image: '/assets/covers/test.jpg',
  };

  describe('valid data', () => {
    it('should accept valid mixtape data', () => {
      const result = MixtapeSchema.safeParse(validMixtape);
      expect(result.success).toBe(true);
    });

    it('should accept all platform types', () => {
      const platforms = ['youtube', 'soundcloud', 'mixcloud', 'other'];
      platforms.forEach(platform => {
        const result = MixtapeSchema.safeParse({ ...validMixtape, platform });
        expect(result.success).toBe(true);
      });
    });

    it('should accept optional fields', () => {
      const withOptionals = {
        ...validMixtape,
        event_name: 'Summer Festival',
        event_series: 'Festival Series',
        location: 'Austin, TX',
        external_url: 'https://soundcloud.com/test',
        duration_minutes: 60,
        thumbnail_image: '/assets/thumbs/test.jpg',
        genres: ['house', 'techno'],
        moods: ['energetic'],
        tags: ['live', 'recorded'],
        featured: true,
        active: false,
        related_releases: ['rel-1', 'rel-2'],
      };
      const result = MixtapeSchema.safeParse(withOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe('required fields', () => {
    const requiredFields = [
      'id', 'slug', 'artist_id', 'title', 'date', 'platform', 'embed_url', 'cover_image'
    ];

    requiredFields.forEach(field => {
      it(`should require ${field}`, () => {
        const { [field]: removed, ...missing } = validMixtape as any;
        const result = MixtapeSchema.safeParse(missing);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('default values', () => {
    it('should default genres to empty array', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.genres).toEqual([]);
    });

    it('should default moods to empty array', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.moods).toEqual([]);
    });

    it('should default tags to empty array', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.tags).toEqual([]);
    });

    it('should default featured to false', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.featured).toBe(false);
    });

    it('should default active to true', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.active).toBe(true);
    });

    it('should default related_releases to empty array', () => {
      const result = MixtapeSchema.parse(validMixtape);
      expect(result.related_releases).toEqual([]);
    });
  });

  describe('validation', () => {
    it('should reject invalid platform', () => {
      const invalid = { ...validMixtape, platform: 'invalid-platform' };
      const result = MixtapeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid embed_url', () => {
      const invalid = { ...validMixtape, embed_url: 'not-a-url' };
      const result = MixtapeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid external_url', () => {
      const invalid = { ...validMixtape, external_url: 'not-a-url' };
      const result = MixtapeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject empty string fields', () => {
      const fields = ['id', 'slug', 'artist_id', 'title', 'date', 'cover_image'];
      fields.forEach(field => {
        const invalid = { ...validMixtape, [field]: '' };
        const result = MixtapeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });

    it('should accept positive duration_minutes', () => {
      const valid = { ...validMixtape, duration_minutes: 60 };
      const result = MixtapeSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject non-integer duration_minutes', () => {
      const invalid = { ...validMixtape, duration_minutes: 60.5 };
      const result = MixtapeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
