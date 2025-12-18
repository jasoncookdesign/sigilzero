import { describe, it, expect } from 'vitest';
import { buildPlaceholdUrl } from "./placehold";

describe('buildPlaceholdUrl', () => {
  it('should build URL with width and height', () => {
    const url = buildPlaceholdUrl({ width: 600, height: 400 });
    expect(url).toContain('placehold.co');
    expect(url).toContain('600x400');
  });

  it('should build URL with SVG format and custom colors', () => {
    const url = buildPlaceholdUrl({ 
      width: 300, 
      format: "svg", 
      background: "000", 
      color: "fff", 
      text: "Missing+Image" 
    });
    expect(url).toContain('placehold.co');
    expect(url).toContain('300');
    expect(url).toContain('.svg');
    expect(url).toContain('000');
    expect(url).toContain('fff');
  });

  it('should handle square dimensions', () => {
    const url = buildPlaceholdUrl({ width: 500 });
    expect(url).toContain('placehold.co');
    expect(url).toContain('500');
  });
});
