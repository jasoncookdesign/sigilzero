import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all navigation items when showSeries is true', () => {
    render(<Navigation showSeries={true} />);
    expect(screen.getByText('Releases')).toBeInTheDocument();
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Mixtapes')).toBeInTheDocument();
    expect(screen.getByText('Series')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Press Kit')).toBeInTheDocument();
  });

  it('should hide Series link when showSeries is false', () => {
    render(<Navigation showSeries={false} />);
    expect(screen.getByText('Releases')).toBeInTheDocument();
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Mixtapes')).toBeInTheDocument();
    expect(screen.queryByText('Series')).not.toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Press Kit')).toBeInTheDocument();
  });

  it('should default showSeries to true', () => {
    render(<Navigation />);
    expect(screen.getByText('Series')).toBeInTheDocument();
  });

  it('should render logo image', () => {
    render(<Navigation />);
    const logo = screen.getByAltText('SIGIL.ZERO');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/images/site_elements/logos/SZLogo_glyph-Wtrans-400.png');
  });

  it('should render logo link to home', () => {
    render(<Navigation />);
    const logoLink = screen.getByAltText('SIGIL.ZERO').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should have correct href for each navigation item', () => {
    render(<Navigation />);
    expect(screen.getByText('Releases').closest('a')).toHaveAttribute('href', '/releases');
    expect(screen.getByText('Artists').closest('a')).toHaveAttribute('href', '/artists');
    expect(screen.getByText('Mixtapes').closest('a')).toHaveAttribute('href', '/mixtapes');
    expect(screen.getByText('Series').closest('a')).toHaveAttribute('href', '/series');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
    expect(screen.getByText('Press Kit').closest('a')).toHaveAttribute('href', '/press-kit');
  });

  it('should be sticky positioned at top', () => {
    const { container } = render(<Navigation />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('sticky');
    expect(nav).toHaveClass('top-0');
    expect(nav).toHaveClass('z-50');
  });

  it('should have mobile menu button', () => {
    render(<Navigation />);
    // Mobile menu button should exist (it's hidden on desktop)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
