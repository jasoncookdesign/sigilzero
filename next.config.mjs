import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // important for GitHub Pages static hosting
  trailingSlash: true,   // (recommended so GitHub Pages handles folders cleanly)
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
   images: {
    unoptimized: true, // <-- required for static export + next/image
  },
  env: {
    // The calendar day (UTC) this build was made. Static HTML renders date-driven
    // state such as release status for this day; the browser then re-evaluates it
    // for the visitor's local day (see src/lib/use-today.ts).
    SIGILZERO_BUILD_DAY: new Date().toISOString().slice(0, 10),
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
