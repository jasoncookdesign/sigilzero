# SIGIL.ZERO

A catalog system for underground electronic music.

## What SIGIL.ZERO Is

SIGIL.ZERO operates as a record label and release platform for experimental electronic music. The label organizes its catalog through a series structure: modular collections that group releases by concept, aesthetic, or sonic territory.

This is not a streaming service. It is an index. A map of recorded transmissions.

## What This Repository Contains

The source code for the SIGIL.ZERO website. A static site generator built to serialize markdown content into structured release catalogs, artist profiles, and mixtape archives.

Content is stored as markdown files with YAML frontmatter. The system validates schemas, filters by metadata, and renders catalog pages with search and filter capabilities.

All content lives in `/content`. All logic lives in `/src`. All output is static HTML.

## Technology Stack

- **Next.js 16** with static export and Turbopack
- **React 19** for UI components
- **TypeScript** for type safety across content schemas and application logic
- **Zod** for runtime schema validation
- **Tailwind CSS** for styling
- **Vitest** for unit and integration testing
- **Playwright** for end-to-end testing
- **GitHub Actions** for continuous integration

Content processing uses gray-matter for frontmatter parsing, remark and rehype for markdown transformation.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

### Content Structure

Add new content to these directories:

- `/content/releases` — Official releases
- `/content/mixtapes` — DJ sets and mixes
- `/content/artists` — Artist profiles
- `/content/series` — Series definitions

Each markdown file requires specific frontmatter fields. Run validation:

```bash
npm run check-frontmatter
```

### Testing

Run unit and integration tests:

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

Run end-to-end tests:

```bash
npm run e2e          # Headless
npm run e2e:ui       # Interactive mode
npm run e2e:headed   # With browser visible
```

## Deployment

The site deploys as static HTML to GitHub Pages.

Build the production site:

```bash
npm run build
```

Output is written to `/docs`. The build process:

1. Validates all markdown frontmatter
2. Generates static pages for all routes
3. Copies output to `/docs` for GitHub Pages
4. Preserves CNAME for custom domain

Push to the `main` branch to trigger automatic deployment via GitHub Actions.

## Project Status

Version 1.0 nearing public release.

The catalog system is operational. Testing infrastructure is complete. Content is being added.

What remains is refinement of visual design and expansion of the release catalog.

## Philosophy

This system prioritizes content over presentation. Releases are data. The interface is an access layer.

The architecture enforces constraints:

- Static output only. No server, no database.
- Markdown as the source of truth. No CMS.
- Type-safe schemas. Invalid content fails the build.
- Comprehensive test coverage. Behavior is verified.

Speed and simplicity over feature accumulation.

## License

No license file is present. Usage terms are undefined.
