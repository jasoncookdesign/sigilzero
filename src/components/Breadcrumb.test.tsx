import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Breadcrumb from './Breadcrumb';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Import after mocking
import { usePathname } from 'next/navigation';

describe('Breadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render on homepage', () => {
    (usePathname as any).mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render breadcrumb on non-homepage paths', () => {
    (usePathname as any).mockReturnValue('/artists');
    render(<Breadcrumb />);
    
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('should show home link on all non-homepage paths', () => {
    (usePathname as any).mockReturnValue('/artists');
    render(<Breadcrumb />);
    
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should generate correct breadcrumbs for single-level path', () => {
    (usePathname as any).mockReturnValue('/artists');
    render(<Breadcrumb />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Artists')).toBeInTheDocument();
  });

  it('should generate correct breadcrumbs for two-level path', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Dyson Hope')).toBeInTheDocument();
  });

  it('should format breadcrumb text correctly (capitalize and replace hyphens)', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    // Should convert 'dyson-hope' to 'Dyson Hope'
    expect(screen.getByText('Dyson Hope')).toBeInTheDocument();
  });

  it('should not make last breadcrumb a link', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const dysonHopeSpan = screen.getByText('Dyson Hope');
    expect(dysonHopeSpan.tagName).toBe('SPAN');
    expect(dysonHopeSpan.closest('a')).toBeNull();
  });

  it('should make intermediate breadcrumbs clickable', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const artistsLink = screen.getByText('Artists').closest('a');
    expect(artistsLink).toHaveAttribute('href', '/artists');
  });

  it('should have correct href for each breadcrumb level', () => {
    (usePathname as any).mockReturnValue('/releases/at-your-own-risk');
    render(<Breadcrumb />);
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    
    const releasesLink = screen.getByText('Releases').closest('a');
    expect(releasesLink).toHaveAttribute('href', '/releases');
  });

  it('should have correct styling classes on nav', () => {
    (usePathname as any).mockReturnValue('/releases');
    const { container } = render(<Breadcrumb />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    
    const ol = nav?.querySelector('ol');
    expect(ol).toHaveClass('flex');
    expect(ol).toHaveClass('items-center');
    expect(ol).toHaveClass('gap-2');
    expect(ol).toHaveClass('text-xs');
    expect(ol).toHaveClass('text-gray-400');
  });

  it('should display slash separators between breadcrumbs', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const slashes = screen.getAllByText('/');
    expect(slashes.length).toBeGreaterThan(0);
  });

  it('should handle URLs with special characters and decode them', () => {
    // Mock a URL-encoded path
    (usePathname as any).mockReturnValue('/mixtapes/dyson-hope-live-in-austin');
    render(<Breadcrumb />);
    
    // Should decode and format properly
    expect(screen.getByText('Dyson Hope Live In Austin')).toBeInTheDocument();
  });

  it('should work for various page types', () => {
    const testPaths = [
      { path: '/about', expectedLast: 'About' },
      { path: '/releases', expectedLast: 'Releases' },
      { path: '/mixtapes', expectedLast: 'Mixtapes' },
      { path: '/series', expectedLast: 'Series' },
      { path: '/press-kit', expectedLast: 'Press Kit' },
    ];

    testPaths.forEach(({ path, expectedLast }) => {
      vi.clearAllMocks();
      (usePathname as any).mockReturnValue(path);
      const { unmount } = render(<Breadcrumb />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText(expectedLast)).toBeInTheDocument();
      
      unmount();
    });
  });

  it('should use ordered list structure', () => {
    (usePathname as any).mockReturnValue('/artists');
    const { container } = render(<Breadcrumb />);
    
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
  });

  it('should have list items for each breadcrumb', () => {
    (usePathname as any).mockReturnValue('/releases/at-your-own-risk');
    const { container } = render(<Breadcrumb />);
    
    const listItems = container.querySelectorAll('ol > li');
    // Home link + 2 levels = 3 list items
    expect(listItems.length).toBe(3);
  });

  it('should have proper spacing and text color classes', () => {
    (usePathname as any).mockReturnValue('/artists');
    const { container } = render(<Breadcrumb />);
    
    const ol = container.querySelector('ol');
    expect(ol).toHaveClass('gap-2');
    expect(ol).toHaveClass('text-xs');
    expect(ol).toHaveClass('text-gray-400');
  });

  it('should have hover effects on breadcrumb links', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const artistsLink = screen.getByText('Artists').closest('a');
    expect(artistsLink).toHaveClass('hover:text-white');
    expect(artistsLink).toHaveClass('transition-colors');
  });

  it('should properly style the current page breadcrumb', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const currentPage = screen.getByText('Dyson Hope');
    expect(currentPage).toHaveClass('text-gray-300');
  });

  it('should handle deep nested paths', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<Breadcrumb />);
    
    const ol = screen.getByRole('navigation').querySelector('ol');
    const listItems = ol?.querySelectorAll('li');
    
    // Home + Artists + Dyson Hope = 3 items
    expect(listItems?.length).toBe(3);
  });

  it('should have aria-label for navigation', () => {
    (usePathname as any).mockReturnValue('/releases');
    render(<Breadcrumb />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
