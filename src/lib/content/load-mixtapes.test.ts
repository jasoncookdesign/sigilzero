import { describe, it, expect } from 'vitest';
import { loadAllMixtapes, loadMixtapeBySlug } from './load-mixtapes';

describe('load-mixtapes', () => {
  describe('loadAllMixtapes', () => {
    it('should load all mixtape documents', () => {
      const mixtapes = loadAllMixtapes();
      
      expect(mixtapes).toBeDefined();
      expect(Array.isArray(mixtapes)).toBe(true);
      expect(mixtapes.length).toBeGreaterThan(0);
    });

    it('should have valid mixtape metadata', () => {
      const mixtapes = loadAllMixtapes();
      
      mixtapes.forEach((doc) => {
        expect(doc.meta).toHaveProperty('id');
        expect(doc.meta).toHaveProperty('slug');
        expect(doc.meta).toHaveProperty('title');
        expect(doc.meta).toHaveProperty('artist_id');
        expect(doc.meta).toHaveProperty('date');
        expect(doc.meta).toHaveProperty('active');
        expect(typeof doc.meta.active).toBe('boolean');
        expect(doc.body).toBeDefined();
        expect(typeof doc.body).toBe('string');
      });
    });

    it('should have valid genres and moods arrays', () => {
      const mixtapes = loadAllMixtapes();
      
      mixtapes.forEach((doc) => {
        expect(Array.isArray(doc.meta.genres)).toBe(true);
        expect(Array.isArray(doc.meta.moods)).toBe(true);
      });
    });

    it('should have valid platform', () => {
      const mixtapes = loadAllMixtapes();
      
      mixtapes.forEach((doc) => {
        expect(doc.meta).toHaveProperty('platform');
        expect(typeof doc.meta.platform).toBe('string');
        expect(['youtube', 'soundcloud', 'mixcloud', 'other']).toContain(doc.meta.platform);
      });
    });

    it('should have valid duration_minutes if present', () => {
      const mixtapes = loadAllMixtapes();
      
      mixtapes.forEach((doc) => {
        if (doc.meta.duration_minutes !== undefined) {
          expect(typeof doc.meta.duration_minutes).toBe('number');
          expect(doc.meta.duration_minutes).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('loadMixtapeBySlug', () => {
    it('should load a specific mixtape by slug', () => {
      const allMixtapes = loadAllMixtapes();
      if (allMixtapes.length === 0) return;

      const firstSlug = allMixtapes[0].meta.slug;
      const mixtape = loadMixtapeBySlug(firstSlug);
      
      expect(mixtape).not.toBeNull();
      expect(mixtape?.meta.slug).toBe(firstSlug);
    });

    it('should return null for non-existent slug', () => {
      const mixtape = loadMixtapeBySlug('non-existent-mixtape-slug');
      expect(mixtape).toBeNull();
    });

    it('should load complete mixtape data including body', () => {
      const allMixtapes = loadAllMixtapes();
      if (allMixtapes.length === 0) return;

      const firstSlug = allMixtapes[0].meta.slug;
      const mixtape = loadMixtapeBySlug(firstSlug);
      
      expect(mixtape?.body).toBeDefined();
      expect(typeof mixtape?.body).toBe('string');
      expect(mixtape?.body.length).toBeGreaterThan(0);
    });
  });
});
