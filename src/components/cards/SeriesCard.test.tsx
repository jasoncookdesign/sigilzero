import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeriesCard from './SeriesCard';
import type { Series } from '../../lib/schemas/series';

describe('SeriesCard', () => {
  const mockSeries: Series = {
    id: 'test-series',
    slug: 'test-series',
    name: 'Test Series',
    short_label: 'TEST',
    default_genres: [],
    active: true,
  };

  it('should render series name', () => {
    render(<SeriesCard series={mockSeries} />);
    expect(screen.getByText('Test Series')).toBeInTheDocument();
  });

  it('should render short label', () => {
    render(<SeriesCard series={mockSeries} />);
    const labels = screen.getAllByText('TEST');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should render tagline when present', () => {
    const withTagline = { ...mockSeries, tagline: 'The Future Sound' };
    render(<SeriesCard series={withTagline} />);
    expect(screen.getByText('The Future Sound')).toBeInTheDocument();
  });

  it('should not render tagline when not present', () => {
    render(<SeriesCard series={mockSeries} />);
    const tagline = screen.queryByText('The Future Sound');
    expect(tagline).not.toBeInTheDocument();
  });

  it('should render link to series detail page', () => {
    render(<SeriesCard series={mockSeries} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/series/test-series');
  });

  it('should render glyph image when present', () => {
    const withGlyph = { ...mockSeries, glyph: '/assets/glyphs/test.svg' };
    render(<SeriesCard series={withGlyph} />);
    const img = screen.getByAltText('Test Series');
    expect(img).toBeInTheDocument();
  });

  it('should render short_label as fallback when no glyph', () => {
    const { container } = render(<SeriesCard series={mockSeries} />);
    // Check that short_label is rendered in the gradient background
    const gradientDiv = container.querySelector('.absolute.inset-0');
    expect(gradientDiv).toBeInTheDocument();
    expect(gradientDiv).toHaveTextContent('TEST');
  });

  it('should apply custom colors when provided', () => {
    const withColors = {
      ...mockSeries,
      color_hex: '#ff0000',
      accent_hex: '#00ff00',
    };
    const { container } = render(<SeriesCard series={withColors} />);
    const gradientDiv = container.querySelector('.absolute.inset-0');
    expect(gradientDiv).toHaveStyle({
      backgroundImage: 'linear-gradient(135deg, #ff0000 0%, #00ff00 100%)',
    });
  });
});
