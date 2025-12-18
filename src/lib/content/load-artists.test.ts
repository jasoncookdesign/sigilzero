import { describe, it, expect } from 'vitest';
import { loadAllArtists, loadArtistBySlug } from './load-artists';

describe('load-artists', () => {
  describe('loadAllArtists', () => {
    it('should load all artist documents', () => {
      const artists = loadAllArtists();
      
      expect(artists).toBeDefined();
      expect(Array.isArray(artists)).toBe(true);
      expect(artists.length).toBeGreaterThan(0);
    });

    it('should have valid artist metadata', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        expect(doc.meta).toHaveProperty('id');
        expect(doc.meta).toHaveProperty('slug');
        expect(doc.meta).toHaveProperty('name');
        expect(doc.meta).toHaveProperty('active');
        expect(typeof doc.meta.active).toBe('boolean');
        expect(doc.body).toBeDefined();
        expect(typeof doc.body).toBe('string');
      });
    });

    it('should have valid roles array', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        expect(doc.meta).toHaveProperty('roles');
        expect(Array.isArray(doc.meta.roles)).toBe(true);
        expect(doc.meta.roles.length).toBeGreaterThan(0);
      });
    });

    it('should have valid genres_primary array', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        expect(doc.meta).toHaveProperty('genres_primary');
        expect(Array.isArray(doc.meta.genres_primary)).toBe(true);
      });
    });

    it('should have valid social structure if present', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        if (doc.meta.social) {
          expect(typeof doc.meta.social).toBe('object');
          
          // Check for common social platforms
          if (doc.meta.social.instagram) {
            expect(typeof doc.meta.social.instagram).toBe('string');
          }
          if (doc.meta.social.soundcloud) {
            expect(typeof doc.meta.social.soundcloud).toBe('string');
          }
          if (doc.meta.social.spotify) {
            expect(typeof doc.meta.social.spotify).toBe('string');
          }
        }
      });
    });

    it('should have valid photo path if present', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        if (doc.meta.photo) {
          expect(typeof doc.meta.photo).toBe('string');
          expect(doc.meta.photo.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('loadArtistBySlug', () => {
    it('should load a specific artist by slug', () => {
      const allArtists = loadAllArtists();
      if (allArtists.length === 0) return;

      const firstSlug = allArtists[0].meta.slug;
      const artist = loadArtistBySlug(firstSlug);
      
      expect(artist).not.toBeNull();
      expect(artist?.meta.slug).toBe(firstSlug);
    });

    it('should return null for non-existent slug', () => {
      const artist = loadArtistBySlug('non-existent-artist-slug');
      expect(artist).toBeNull();
    });

    it('should load complete artist data including bio', () => {
      const allArtists = loadAllArtists();
      if (allArtists.length === 0) return;

      const firstSlug = allArtists[0].meta.slug;
      const artist = loadArtistBySlug(firstSlug);
      
      expect(artist?.body).toBeDefined();
      expect(typeof artist?.body).toBe('string');
      expect(artist?.body.length).toBeGreaterThan(0);
    });
  });
});
