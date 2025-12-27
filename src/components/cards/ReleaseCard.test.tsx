import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReleaseCard from './ReleaseCard';
import type { ReleaseDocument } from '../../lib/content/load-releases';
import type { Artist } from '../../lib/schemas/artist';

describe('ReleaseCard', () => {
  const mockArtists: Artist[] = [
    {
      id: 'artist-1',
      slug: 'artist-1',
      name: 'Test Artist',
      roles: ['producer'],
      active: true,
      featured_releases: [],
      featured_mixtapes: [],
      genres_primary: [],
      tags: [],
    },
    {
      id: 'artist-2',
      slug: 'artist-2',
      name: 'Second Artist',
      roles: ['producer'],
      active: true,
      featured_releases: [],
      featured_mixtapes: [],
      genres_primary: [],
      tags: [],
    },
  ];

  const mockRelease: ReleaseDocument['meta'] = {
    catalog_number: 'SIG001',
    id: 'test-release',
    slug: 'test-release',
    title: 'Test Release',
    type: 'single',
    series_id: 'core',
    primary_artists: ['artist-1'],
    remix_artists: [],
    release_date: '2024-01-15',
    status: 'released',
    genres: ['house'],
    moods: ['energetic'],
    cover_art: '/assets/covers/test.jpg',
    flagship: false,
    active: true,
    tracks: [],
  };

  const mockSeries = {
    id: 'core',
    slug: 'core',
    name: 'Core Series',
    short_label: 'CORE',
  };

  it('should render release title', () => {
    render(<ReleaseCard release={mockRelease} />);
    expect(screen.getByText('Test Release')).toBeInTheDocument();
  });

  it('should render catalog number', () => {
    render(<ReleaseCard release={mockRelease} />);
    expect(screen.getByText('SIG001')).toBeInTheDocument();
  });

  it('should render release date', () => {
    render(<ReleaseCard release={mockRelease} />);
    expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
  });

  it('should render series name when series prop provided', () => {
    render(<ReleaseCard release={mockRelease} series={mockSeries} />);
    expect(screen.getByText(/Core Series/)).toBeInTheDocument();
  });

  it('should render series_id when series prop not provided', () => {
    render(<ReleaseCard release={mockRelease} />);
    expect(screen.getByText(/core/)).toBeInTheDocument();
  });

  it('should render link to release detail page', () => {
    render(<ReleaseCard release={mockRelease} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/releases/test-release');
  });

  it('should render cover art image', () => {
    render(<ReleaseCard release={mockRelease} />);
    const img = screen.getByAltText('Test Release');
    expect(img).toBeInTheDocument();
  });

  it('should render artist name when artists prop provided', () => {
    render(<ReleaseCard release={mockRelease} artists={mockArtists} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('should render multiple artists with proper formatting', () => {
    const releaseWithMultipleArtists = {
      ...mockRelease,
      primary_artists: ['artist-1', 'artist-2'],
    };
    render(<ReleaseCard release={releaseWithMultipleArtists} artists={mockArtists} />);
    expect(screen.getByText('Test Artist & Second Artist')).toBeInTheDocument();
  });

  it('should not render artist names when artists prop not provided', () => {
    render(<ReleaseCard release={mockRelease} />);
    expect(screen.queryByText('Test Artist')).not.toBeInTheDocument();
  });
});
