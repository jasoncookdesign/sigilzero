import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArtistCard from './ArtistCard';
import type { ArtistDocument } from '../../lib/content/load-artists';

describe('ArtistCard', () => {
  const mockArtist: ArtistDocument['meta'] = {
    id: 'test-artist',
    slug: 'test-artist',
    name: 'Test Artist',
    roles: ['producer', 'dj'],
    for_fans_of: [],
    active: true,
    featured_releases: [],
    featured_mixtapes: [],
    genres_primary: ['house', 'techno'],
    tags: [],
  };

  it('should render artist name', () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('should render artist roles separated by slash', () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(screen.getByText('producer / dj')).toBeInTheDocument();
  });

  it('should render single role', () => {
    const singleRole = { ...mockArtist, roles: ['producer' as const] };
    render(<ArtistCard artist={singleRole} />);
    expect(screen.getByText('producer')).toBeInTheDocument();
  });

  it('should render location when present', () => {
    const withLocation = { ...mockArtist, location: 'Berlin' };
    render(<ArtistCard artist={withLocation} />);
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('should not render location when not present', () => {
    render(<ArtistCard artist={mockArtist} />);
    const locationText = screen.queryByText('Berlin');
    expect(locationText).not.toBeInTheDocument();
  });

  it('should render link to artist detail page', () => {
    render(<ArtistCard artist={mockArtist} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/artists/test-artist');
  });

  it('should render photo image', () => {
    const withPhoto = { ...mockArtist, photo: '/assets/photos/test.jpg' };
    render(<ArtistCard artist={withPhoto} />);
    const img = screen.getByAltText('Test Artist');
    expect(img).toBeInTheDocument();
  });
});
