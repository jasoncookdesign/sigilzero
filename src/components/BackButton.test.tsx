import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BackButton from './BackButton';

// Mock next/navigation
const mockRouterBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    back: mockRouterBack,
  })),
  usePathname: vi.fn(),
}));

// Import after mocking to get the mocked version
import { usePathname } from 'next/navigation';

describe('BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouterBack.mockClear();
  });

  it('should render back button on non-homepage paths', () => {
    (usePathname as any).mockReturnValue('/artists');
    render(<BackButton />);
    
    const button = screen.getByRole('button', { name: /go back/i });
    expect(button).toBeInTheDocument();
  });

  it('should display back button with arrow icon and text', () => {
    (usePathname as any).mockReturnValue('/releases');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not render on homepage', () => {
    (usePathname as any).mockReturnValue('/');
    const { container } = render(<BackButton />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should call router.back() when clicked', () => {
    (usePathname as any).mockReturnValue('/artists/dyson-hope');
    render(<BackButton />);
    
    const button = screen.getByRole('button', { name: /go back/i });
    button.click();
    
    expect(mockRouterBack).toHaveBeenCalledOnce();
  });

  it('should have correct styling classes', () => {
    (usePathname as any).mockReturnValue('/mixtapes');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('gap-2');
    expect(button).toHaveClass('text-sm');
  });

  it('should have button with hover styling', () => {
    (usePathname as any).mockReturnValue('/about');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:text-white');
    expect(button).toHaveClass('transition-colors');
  });

  it('should have arrow icon with transform on hover', () => {
    (usePathname as any).mockReturnValue('/series');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    
    expect(svg).toHaveClass('group-hover:-translate-x-1');
    expect(svg).toHaveClass('transition-transform');
  });

  it('should work on various non-homepage paths', () => {
    const testPaths = ['/artists', '/releases', '/mixtapes', '/about', '/press-kit', '/series', '/artists/dyson-hope'];
    
    testPaths.forEach((path) => {
      vi.clearAllMocks();
      (usePathname as any).mockReturnValue(path);
      const { unmount } = render(<BackButton />);
      
      const button = screen.queryByRole('button', { name: /go back/i });
      expect(button).toBeInTheDocument();
      
      unmount();
    });
  });

  it('should not render when pathname is root', () => {
    (usePathname as any).mockReturnValue('/');
    const { container } = render(<BackButton />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have aria-label for accessibility', () => {
    (usePathname as any).mockReturnValue('/artists');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Go back');
  });

  it('should maintain consistent gap and padding', () => {
    (usePathname as any).mockReturnValue('/releases');
    render(<BackButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('gap-2');
    expect(button).toHaveClass('text-sm');
  });
});
