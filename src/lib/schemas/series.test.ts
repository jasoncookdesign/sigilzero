import { describe, it, expect } from 'vitest';
import { SeriesSchema } from './series';

describe('SeriesSchema', () => {
  const validSeries = {
    id: 'test-series',
    slug: 'test-series',
    name: 'Test Series',
    short_label: 'TEST',
  };

  describe('valid data', () => {
    it('should accept valid series data', () => {
      const result = SeriesSchema.safeParse(validSeries);
      expect(result.success).toBe(true);
    });

    it('should accept optional fields', () => {
      const withOptionals = {
        ...validSeries,
        order: 1,
        active: false,
        color_hex: '#000000',
        glyph: '/assets/glyphs/test.svg',
      };
      const result = SeriesSchema.safeParse(withOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe('required fields', () => {
    it('should require id', () => {
      const { id, ...missing } = validSeries;
      const result = SeriesSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require slug', () => {
      const { slug, ...missing } = validSeries;
      const result = SeriesSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require name', () => {
      const { name, ...missing } = validSeries;
      const result = SeriesSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });

    it('should require short_label', () => {
      const { short_label, ...missing } = validSeries;
      const result = SeriesSchema.safeParse(missing);
      expect(result.success).toBe(false);
    });
  });

  describe('default values', () => {
    it('should default active to true', () => {
      const result = SeriesSchema.parse(validSeries);
      expect(result.active).toBe(true);
    });
  });

  describe('validation', () => {
    it('should reject empty string fields', () => {
      const fields = ['id', 'slug', 'name', 'short_label'];
      fields.forEach(field => {
        const invalid = { ...validSeries, [field]: '' };
        const result = SeriesSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });

    it('should accept positive order', () => {
      const valid = { ...validSeries, order: 1 };
      const result = SeriesSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject non-integer order', () => {
      const invalid = { ...validSeries, order: 1.5 };
      const result = SeriesSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept zero as order', () => {
      const withZero = { ...validSeries, order: 0 };
      const result = SeriesSchema.safeParse(withZero);
      expect(result.success).toBe(true);
    });
  });
});
