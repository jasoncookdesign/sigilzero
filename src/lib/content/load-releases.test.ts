import { describe, it, expect } from 'vitest';
import { loadAllReleases, loadReleaseBySlug } from './load-releases';

describe('load-releases', () => {
  describe('loadAllReleases', () => {
    it('should load all release documents', () => {
      const releases = loadAllReleases();
      
      expect(releases).toBeDefined();
      expect(Array.isArray(releases)).toBe(true);
      expect(releases.length).toBeGreaterThan(0);
    });

    it('should have valid release metadata', () => {
      const releases = loadAllReleases();
      
      releases.forEach((doc) => {
        expect(doc.meta).toHaveProperty('id');
        expect(doc.meta).toHaveProperty('slug');
        expect(doc.meta).toHaveProperty('title');
        expect(doc.meta).toHaveProperty('catalog_number');
        expect(doc.meta).toHaveProperty('primary_artists');
        expect(doc.meta).toHaveProperty('release_date');
        expect(doc.meta).toHaveProperty('series_id');
        expect(doc.meta).toHaveProperty('active');
        expect(typeof doc.meta.active).toBe('boolean');
        expect(doc.body).toBeDefined();
        expect(typeof doc.body).toBe('string');
      });
    });

    it('should have valid genres and moods arrays', () => {
      const releases = loadAllReleases();
      
      releases.forEach((doc) => {
        expect(Array.isArray(doc.meta.genres)).toBe(true);
        expect(Array.isArray(doc.meta.moods)).toBe(true);
      });
    });

    it('should have valid BPM range if present', () => {
      const releases = loadAllReleases();
      
      releases.forEach((doc) => {
        if (doc.meta.bpm_range) {
          expect(typeof doc.meta.bpm_range).toBe('string');
          expect(doc.meta.bpm_range.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('loadReleaseBySlug', () => {
    it('should load a specific release by slug', () => {
      const allReleases = loadAllReleases();
      if (allReleases.length === 0) return;

      const firstSlug = allReleases[0].meta.slug;
      const release = loadReleaseBySlug(firstSlug);
      
      expect(release).not.toBeNull();
      expect(release?.meta.slug).toBe(firstSlug);
    });

    it('should return null for non-existent slug', () => {
      const release = loadReleaseBySlug('non-existent-release-slug');
      expect(release).toBeNull();
    });

    it('should load complete release data including body', () => {
      const allReleases = loadAllReleases();
      if (allReleases.length === 0) return;

      const firstSlug = allReleases[0].meta.slug;
      const release = loadReleaseBySlug(firstSlug);
      
      expect(release?.body).toBeDefined();
      expect(typeof release?.body).toBe('string');
      expect(release?.body.length).toBeGreaterThan(0);
    });
  });
});
