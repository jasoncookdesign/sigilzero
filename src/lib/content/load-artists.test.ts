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

    it('should have order property when present', () => {
      const artists = loadAllArtists();
      
      artists.forEach((doc) => {
        if (doc.meta.order !== undefined) {
          expect(typeof doc.meta.order).toBe('number');
          expect(Number.isInteger(doc.meta.order)).toBe(true);
        }
      });
    });

    it('should sort artists by order property', () => {
      const artists = loadAllArtists();
      
      // Filter artists that have order defined
      const artistsWithOrder = artists.filter((a) => a.meta.order !== undefined);
      
      if (artistsWithOrder.length > 1) {
        for (let i = 1; i < artistsWithOrder.length; i++) {
          const prevOrder = artistsWithOrder[i - 1].meta.order!;
          const currOrder = artistsWithOrder[i].meta.order!;
          expect(currOrder).toBeGreaterThanOrEqual(prevOrder);
        }
      }
    });

    it('should place artists without order after those with order', () => {
      const artists = loadAllArtists();
      
      const withOrder = artists.filter((a) => a.meta.order !== undefined);
      const withoutOrder = artists.filter((a) => a.meta.order === undefined);
      
      if (withOrder.length > 0 && withoutOrder.length > 0) {
        const lastWithOrderIndex = artists.indexOf(withOrder[withOrder.length - 1]);
        const firstWithoutOrderIndex = artists.indexOf(withoutOrder[0]);
        
        expect(firstWithoutOrderIndex).toBeGreaterThan(lastWithOrderIndex);
      }
    });

    it('should sort artists alphabetically by name when orders are equal or undefined', () => {
      const artists = loadAllArtists();
      
      // Check artists without order are alphabetically sorted
      const withoutOrder = artists.filter((a) => a.meta.order === undefined);
      
      if (withoutOrder.length > 1) {
        for (let i = 1; i < withoutOrder.length; i++) {
          const prevName = withoutOrder[i - 1].meta.name;
          const currName = withoutOrder[i].meta.name;
          expect(prevName.localeCompare(currName)).toBeLessThanOrEqual(0);
        }
      }
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
