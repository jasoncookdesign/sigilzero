import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section from './Section';

describe('Section', () => {
  it('should render children', () => {
    render(
      <Section>
        <div>Test Content</div>
      </Section>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default py-16 padding', () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('py-16');
  });

  it('should apply section-band class', () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('section-band');
  });

  it('should accept custom className', () => {
    const { container } = render(
      <Section className="custom-class">
        <div>Content</div>
      </Section>
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
    expect(section).toHaveClass('py-16'); // Should still have default classes
    expect(section).toHaveClass('section-band');
  });

  it('should render as section element', () => {
    const { container } = render(
      <Section>
        <div>Content</div>
      </Section>
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <Section>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Section>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
});
