import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Section wrapper that applies full-width alternating background colors.
 * Uses nth-of-type(odd/even) to alternate between two dark shades,
 * independent of the actual order or other elements on the page.
 * Children should be wrapped in a container (e.g., div with container-sigil class)
 * to constrain content width while allowing the background to span full width.
 */
export default function Section({ children, className = "" }: Props) {
  return (
    <section
      className={`py-8 section-band ${className}`}
    >
      {children}
    </section>
  );
}
