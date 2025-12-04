import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // important for GitHub Pages static hosting
  trailingSlash: true,   // (recommended so GitHub Pages handles folders cleanly)
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
   images: {
    unoptimized: true, // <-- required for static export + next/image
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
