import { describe, it, expect } from 'vitest';
import { ArtistSchema } from './artist';

describe('ArtistSchema', () => {
  const validArtist = {
    id: 'test-artist',
    slug: 'test-artist',
    name: 'Test Artist',
    roles: ['producer' as const],
  };

  describe('valid data', () => {
    it('should accept valid artist data', () => {
      const result = ArtistSchema.safeParse(validArtist);
      expect(result.success).toBe(true);
    });

    it('should accept all role types', () => {
      const roles = ['producer', 'dj', 'live', 'vocalist'];
      roles.forEach(role => {
        const result = ArtistSchema.safeParse({ ...validArtist, roles: [role] });
        expect(result.success).toBe(true);
      });
    });

    it('should accept multiple roles', () => {
      const multiRole = { ...validArtist, roles: ['producer', 'dj', 'live'] };
      const result = ArtistSchema.safeParse(multiRole);
      expect(result.success).toBe(true);
    });

    it('should accept optional fields', () => {
      const withOptionals = {
        ...validArtist,
        location: 'Austin, TX',
        for_fans_of: ['Artist A', 'Artist B'],
        photo: '/assets/photos/test.jpg',
        instagram_handle: '@testartist',
        social: {
          instagram: 'https://instagram.com/testartist',
          soundcloud: 'https://soundcloud.com/testartist',
          spotify: 'https://open.spotify.com/artist/123',
          bandcamp: 'https://testartist.bandcamp.com',
          youtube: 'https://youtube.com/@testartist',
          other: ['https://example.com'],
        },
        booking_email: 'booking@test.com',
        management_email: 'mgmt@test.com',
        label_join_year: 2024,
        active: false,
        featured_releases: ['rel-1', 'rel-2'],
        featured_mixtapes: ['mix-1', 'mix-2'],
        genres_primary: ['house', 'techno'],
        tags: ['underground', 'experimental'],
      };
      const result = ArtistSchema.safeParse(withOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe('required fields', () => {
    it('should require id', () => {
      const { id, ...missing } = validArtist;
      const result = ArtistSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require slug', () => {
      const { slug, ...missing } = validArtist;
      const result = ArtistSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require name', () => {
      const { name, ...missing } = validArtist;
      const result = ArtistSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require roles', () => {
      const { roles, ...missing } = validArtist;
      const result = ArtistSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require non-empty roles array', () => {
      const invalid = { ...validArtist, roles: [] };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('default values', () => {
    it('should default for_fans_of to empty array', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.for_fans_of).toEqual([]);
    });

    it('should default active to true', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.active).toBe(true);
    });

    it('should default featured_releases to empty array', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.featured_releases).toEqual([]);
    });

    it('should default featured_mixtapes to empty array', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.featured_mixtapes).toEqual([]);
    });

    it('should default genres_primary to empty array', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.genres_primary).toEqual([]);
    });

    it('should default tags to empty array', () => {
      const result = ArtistSchema.parse(validArtist);
      expect(result.tags).toEqual([]);
    });
  });

  describe('validation', () => {
    it('should reject invalid role', () => {
      const invalid = { ...validArtist, roles: ['invalid-role'] };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject empty string fields', () => {
      const fields = ['id', 'slug', 'name'];
      fields.forEach(field => {
        const invalid = { ...validArtist, [field]: '' };
        const result = ArtistSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });

    it('should reject invalid booking_email', () => {
      const invalid = { ...validArtist, booking_email: 'not-an-email' };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept empty string for management_email', () => {
      const withEmpty = { ...validArtist, management_email: '' };
      const result = ArtistSchema.safeParse(withEmpty);
      expect(result.success).toBe(true);
    });

    it('should reject invalid management_email', () => {
      const invalid = { ...validArtist, management_email: 'not-an-email' };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid social URLs', () => {
      const invalid = {
        ...validArtist,
        social: { instagram: 'not-a-url' }
      };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer label_join_year', () => {
      const invalid = { ...validArtist, label_join_year: 2024.5 };
      const result = ArtistSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
