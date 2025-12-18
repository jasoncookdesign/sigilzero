import { describe, it, expect } from 'vitest';
import { loadAllSeries, loadSeriesBySlug, hasActiveSeries } from './load-series';

describe('load-series', () => {
  describe('loadAllSeries', () => {
    it('should load all series documents', () => {
      const series = loadAllSeries();
      
      expect(series).toBeDefined();
      expect(Array.isArray(series)).toBe(true);
      expect(series.length).toBeGreaterThan(0);
    });

    it('should have valid series metadata', () => {
      const series = loadAllSeries();
      
      series.forEach((doc) => {
        expect(doc.meta).toHaveProperty('id');
        expect(doc.meta).toHaveProperty('slug');
        expect(doc.meta).toHaveProperty('name');
        expect(doc.meta).toHaveProperty('short_label');
        expect(doc.meta).toHaveProperty('active');
        expect(typeof doc.meta.active).toBe('boolean');
        expect(doc.body).toBeDefined();
        expect(typeof doc.body).toBe('string');
      });
    });

    it('should sort series by order property', () => {
      const series = loadAllSeries();
      
      // Check if order is respected (if all have order prop)
      for (let i = 0; i < series.length - 1; i++) {
        const current = series[i].meta.order ?? 999;
        const next = series[i + 1].meta.order ?? 999;
        expect(current).toBeLessThanOrEqual(next);
      }
    });
  });

  describe('loadSeriesBySlug', () => {
    it('should load a specific series by slug', () => {
      const allSeries = loadAllSeries();
      if (allSeries.length === 0) return;

      const firstSlug = allSeries[0].meta.slug;
      const series = loadSeriesBySlug(firstSlug);
      
      expect(series).not.toBeNull();
      expect(series?.meta.slug).toBe(firstSlug);
    });

    it('should return null for non-existent slug', () => {
      const series = loadSeriesBySlug('non-existent-slug-that-does-not-exist');
      expect(series).toBeNull();
    });
  });

  describe('hasActiveSeries', () => {
    it('should return a boolean', () => {
      const result = hasActiveSeries();
      expect(typeof result).toBe('boolean');
    });

    it('should match presence of active series in loadAllSeries', () => {
      const allSeries = loadAllSeries();
      const hasActive = allSeries.some((s) => s.meta.active === true);
      const result = hasActiveSeries();
      
      expect(result).toBe(hasActive);
    });
  });
});
