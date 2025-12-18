import { describe, it, expect } from 'vitest';

// Utility function from src/app/page.tsx
function sortByDateDesc<T extends { meta: { release_date?: string; date?: string } }>(
  items: T[],
  field: "release_date" | "date"
): T[] {
  return items.slice().sort((a, b) => {
    const da = a.meta[field] ? new Date(a.meta[field] as string).getTime() : 0;
    const db = b.meta[field] ? new Date(b.meta[field] as string).getTime() : 0;
    return db - da;
  });
}

describe('sortByDateDesc', () => {
  const mockReleases = [
    { meta: { release_date: '2024-01-15', title: 'First' } },
    { meta: { release_date: '2024-06-20', title: 'Third' } },
    { meta: { release_date: '2024-03-10', title: 'Second' } },
  ];

  const mockMixtapes = [
    { meta: { date: '2023-12-01', title: 'Oldest' } },
    { meta: { date: '2024-01-15', title: 'Middle' } },
    { meta: { date: '2024-06-20', title: 'Newest' } },
  ];

  it('should sort releases by release_date in descending order', () => {
    const sorted = sortByDateDesc(mockReleases, 'release_date');
    expect(sorted[0].meta.release_date).toBe('2024-06-20');
    expect(sorted[1].meta.release_date).toBe('2024-03-10');
    expect(sorted[2].meta.release_date).toBe('2024-01-15');
  });

  it('should sort mixtapes by date in descending order', () => {
    const sorted = sortByDateDesc(mockMixtapes, 'date');
    expect(sorted[0].meta.date).toBe('2024-06-20');
    expect(sorted[1].meta.date).toBe('2024-01-15');
    expect(sorted[2].meta.date).toBe('2023-12-01');
  });

  it('should not mutate the original array', () => {
    const original = [...mockReleases];
    sortByDateDesc(mockReleases, 'release_date');
    expect(mockReleases).toEqual(original);
  });

  it('should handle empty array', () => {
    const sorted = sortByDateDesc([], 'release_date');
    expect(sorted).toEqual([]);
  });

  it('should handle single item', () => {
    const single = [{ meta: { release_date: '2024-01-15' } }];
    const sorted = sortByDateDesc(single, 'release_date');
    expect(sorted).toEqual(single);
  });

  it('should handle missing dates by treating them as 0', () => {
    const withMissing = [
      { meta: { release_date: '2024-01-15' } },
      { meta: {} as any },
      { meta: { release_date: '2024-06-20' } },
    ];
    const sorted = sortByDateDesc(withMissing, 'release_date');
    expect(sorted[0].meta.release_date).toBe('2024-06-20');
    expect(sorted[1].meta.release_date).toBe('2024-01-15');
    expect(sorted[2].meta.release_date).toBeUndefined();
  });

  it('should handle same dates', () => {
    const sameDates = [
      { meta: { release_date: '2024-01-15', title: 'A' } },
      { meta: { release_date: '2024-01-15', title: 'B' } },
      { meta: { release_date: '2024-01-15', title: 'C' } },
    ];
    const sorted = sortByDateDesc(sameDates, 'release_date');
    expect(sorted.length).toBe(3);
    sorted.forEach(item => {
      expect(item.meta.release_date).toBe('2024-01-15');
    });
  });
});
