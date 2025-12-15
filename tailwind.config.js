/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SIGIL.ZERO brand colors
        sigil: {
          black: '#000000',
          charcoal: '#0a0a0a',
          dark: '#050505',
          grey: {
            950: '#0f0f0f',
            900: '#1a1a1a',
            800: '#222222',
            700: '#333333',
            600: '#444444',
            500: '#666666',
            400: '#888888',
            300: '#aaaaaa',
            200: '#cccccc',
            100: '#e0e0e0',
          },
          red: '#ff0000',
          crimson: '#d32f2f',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e0e0e0',
            a: {
              color: '#ffffff',
              '&:hover': {
                color: '#ff0000',
              },
            },
            strong: {
              color: '#ffffff',
            },
            code: {
              color: '#cccccc',
            },
          },
        },
      },
      spacing: {
        gutter: '2rem',
      },
      maxWidth: {
        container: '1200px',
        wide: '1400px',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
