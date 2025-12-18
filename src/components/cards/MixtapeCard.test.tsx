import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MixtapeCard from './MixtapeCard';
import type { MixtapeDocument } from '../../lib/content/load-mixtapes';

describe('MixtapeCard', () => {
  const mockMixtape: MixtapeDocument['meta'] = {
    id: 'test-mixtape',
    slug: 'test-mixtape',
    artist_id: 'test-artist',
    title: 'Test Mixtape',
    date: '2024-01-15',
    platform: 'soundcloud',
    embed_url: 'https://soundcloud.com/test/embed',
    cover_image: '/assets/covers/test.jpg',
    genres: ['house'],
    moods: ['energetic'],
    tags: [],
    featured: false,
    active: true,
    related_releases: [],
  };

  const mockArtist = {
    id: 'test-artist',
    slug: 'test-artist',
    name: 'Test Artist',
    roles: ['dj' as const],
    for_fans_of: [],
    active: true,
    featured_releases: [],
    featured_mixtapes: [],
    genres_primary: [],
    tags: [],
  };

  it('should render mixtape title', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    expect(screen.getByText('Test Mixtape')).toBeInTheDocument();
  });

  it('should render date', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('should render platform', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    expect(screen.getByText(/soundcloud/)).toBeInTheDocument();
  });

  it('should render artist name when artist prop provided', () => {
    render(<MixtapeCard mixtape={mockMixtape} artist={mockArtist} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('should not render artist name when artist prop not provided', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    expect(screen.queryByText('Test Artist')).not.toBeInTheDocument();
  });

  it('should render event name when present', () => {
    const withEvent = { ...mockMixtape, event_name: 'Summer Festival' };
    render(<MixtapeCard mixtape={withEvent} />);
    expect(screen.getByText(/Summer Festival/)).toBeInTheDocument();
  });

  it('should render location when present', () => {
    const withLocation = { ...mockMixtape, location: 'Austin, TX' };
    render(<MixtapeCard mixtape={withLocation} />);
    expect(screen.getByText(/Austin, TX/)).toBeInTheDocument();
  });

  it('should render link to mixtape detail page', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/mixtapes/test-mixtape');
  });

  it('should render cover image', () => {
    render(<MixtapeCard mixtape={mockMixtape} />);
    const img = screen.getByAltText('Test Mixtape');
    expect(img).toBeInTheDocument();
  });
});
