# SIGIL.ZERO

A catalog system for underground electronic music.

## What SIGIL.ZERO Is

SIGIL.ZERO operates as a record label and release platform for dark, underground, and experimental electronic dance music. The label organizes its catalog through a series structure: modular collections that group releases by concept, aesthetic, or sonic territory.

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

## Tracking And Analytics

### Architecture Overview

SIGIL.ZERO uses a browser-side tracker at `/public/assets/js/tracking.js` with a GTM-first pipeline.

- `tracking.js` is vendor-agnostic and only pushes normalized objects into `window.dataLayer`.
- Google Tag Manager (GTM) is installed once in the root app shell, and loads only when the page hostname is `sigilzero.com` (`src/lib/analytics/gtm.ts`). On localhost, in CI and on any other host, `window.dataLayer` still exists and `tracking.js` still pushes to it, but GTM never loads, so nothing reaches GA4 or Meta. (The `<noscript>` GTM iframe can't be gated and still renders for visitors with JavaScript disabled.)
- GA4 and Meta are configured in GTM, not in application code.
- No direct `gtag()` or `fbq()` calls exist in the app code.

### GTM-First Rationale

This keeps analytics implementation centralized and safer to evolve:

- Application code emits one stable event contract.
- Tag vendors are configured in GTM without redeploying app code.
- Event governance, filtering, and mapping live in one place.
- Privacy controls remain inside a single normalization layer.

### Container Configuration

- GTM Container ID: `GTM-TLP35C5T`
- GA4 Measurement ID (configured in GTM): `G-K5W8ENE0DH`

### Event Schema Contract

All custom events must push with:

- `event: "sigilzero_event"`

Core contract:

- `entity`
- `action`
- `target`

Events missing any of those three required fields are blocked and not pushed.

### Supported Payload Fields

`tracking.js` emits a flat payload (no arrays/objects) and allows these keys:

- `event`
- `entity`
- `action`
- `target`
- `platform`
- `page_type`
- `page_path`
- `page_title`
- `release_title`
- `release_catalog_id`
- `artist_name`
- `track_title`
- `cta_type`
- `section`
- `component`
- `link_url`
- `link_text`
- `destination_domain`
- `is_external`
- `debug_source`

### Debug Mode

Enable debug mode either way:

- Set local storage: `localStorage.setItem("sigilzero_debug_tracking", "true")`
- Or use URL param: `?debug_tracking=true`

When enabled, events include:

- `debug_source: "tracking.js"`

And helper methods are available in the console:

- `window.SigilZeroTracking.debugStatus()`
- `window.SigilZeroTracking.testEvent()`
- `window.SigilZeroTracking.getConsoleTestExamples()`

### GTM Setup Workflow

1. Open GTM container `GTM-TLP35C5T`.
2. Create a Custom Event trigger where `Event name = sigilzero_event`.
3. Create Data Layer Variables for fields you need (for example `entity`, `action`, `target`, `platform`, `page_type`, `link_url`).
4. Attach GA4/Meta tags to the custom event trigger.
5. Use GTM Preview against `https://sigilzero.com` to validate payload values before publishing. GTM does not load on localhost, so Preview can't connect to a dev server; use `window.SigilZeroTracking.debugStatus()` and the `dataLayer` there instead.

### GA4 Setup Workflow

1. In GTM, create a GA4 Configuration tag using measurement ID `G-K5W8ENE0DH`.
2. Create a GA4 Event tag triggered by `sigilzero_event`.
3. Map Data Layer Variables to GA4 event parameters.
4. Validate in GTM Preview, then GA4 DebugView.

### Meta Setup Workflow

1. Add a Meta Pixel tag in GTM (no direct pixel script in app code).
2. Trigger from `sigilzero_event` (or filtered subsets).
3. Map only approved, non-PII fields.
4. Validate in Meta Test Events.

### Embed play_intent Behavior

Embed interactions (Spotify/SoundCloud) push:

- `entity: "embed"`
- `action: "play_intent"`
- `target: "spotify_embed"` or `target: "soundcloud_embed"`

Embed events are deduped with a longer window (`EMBED_DEDUPE_WINDOW_MS = 2000`) to prevent duplicate pushes from iframe focus/blur behavior.

### Privacy And PII Rules

`tracking.js` applies defensive sanitization:

- Blocks email-like and phone-like free-text values.
- Redacts `mailto:` and `tel:` links (`link_url: "redacted"`, `target: "contact_link"`).
- Blocks nested objects/arrays from payload output.
- Drops undefined/null values.

### URL Sanitization Rules

- Only `http`/`https` URLs are allowed for normal tracked links.
- Querystrings are stripped from `link_url`.
- Hash fragments are stripped from `link_url`.
- External domain extraction is preserved for external links only.
- Valid commerce URLs with numeric path IDs are preserved.

Notes:

- Query parameter stripping is intentional to avoid analytics noise and accidental parameter leakage.
- `mailto:` and `tel:` are never sent as raw URLs.

### Local Testing Workflow

1. Run `npm run dev`.
2. Open the site and DevTools console.
3. Confirm `window.dataLayer` exists and receives `sigilzero_event` payloads.
4. Exercise page views, release/artist/social/stream/store links, and embed interactions.
5. Confirm payloads stay flat and contain no undefined values.

### GTM Preview Testing Workflow

1. Start GTM Preview for `GTM-TLP35C5T`.
2. Navigate core routes (`/`, `/releases`, release detail, artist detail).
3. Trigger representative interactions (stream/store/social/embed).
4. Confirm each event appears as `sigilzero_event`.
5. Verify mapped variables and publish after validation.

### GA4 DebugView Workflow

1. Keep GTM Preview active.
2. Open GA4 DebugView.
3. Trigger key interactions and confirm receipt.
4. Validate expected parameters (`entity`, `action`, `target`, page context, link metadata).
5. Confirm no unexpected PII-like parameter values appear.

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

Global site data lives in `/data`:

- `/data/label.yml` — Label metadata
- `/data/links.yml` — External link definitions
- `/data/series.yml` — Series registry

Each markdown file requires specific frontmatter fields. Dates (`release_date` on releases, `date` on mixtapes) must be real calendar dates in `YYYY-MM-DD` form; validation rejects anything else, such as `2026-27-02`. Run validation:

```bash
npm run check-frontmatter
```

Additional validators:

```bash
# Fast local validation (frontmatter + mixtapes)
npm run validate:quick

# Full validation (frontmatter + all content types)
npm run validate:content
```

### Testing

Run unit and integration tests:

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:ui       # Browser-based UI
npm run test:coverage # With coverage report
```

Run end-to-end tests:

```bash
npm run e2e          # Headless
npm run e2e:ui       # Interactive mode
npm run e2e:headed   # With browser visible
npm run e2e:debug    # Debug mode
npm run e2e:report   # Show last Playwright report
```

Lint the code (ESLint with Next's core-web-vitals and TypeScript presets, configured in `eslint.config.mjs`):

```bash
npm run lint
```

Loader and validator tests read fixture content from `src/lib/content/__fixtures__/` rather than the live `content/` directory.

### Release status and the build day

Release cards and release pages show "Coming Soon" before a release's date (with stream and buy buttons shown but inactive) and "New Release" for 30 days from it. The site is static, so this is evaluated twice: the HTML is rendered for the day of the build, and the browser re-evaluates it for the visitor's local date as soon as the page loads. A release goes live on its date without a redeploy.

`SIGILZERO_BUILD_DAY` is set automatically in `next.config.mjs` to the build's UTC date and inlined into the client bundle so server HTML and hydration agree. It is not meant to be set by hand. The browser side lives in `src/lib/use-today.ts`; the date rule in `src/lib/release-status.ts`.

### Git Hooks

This repository uses Husky to enforce validation and tests during development:

- Pre-commit: runs frontmatter + mixtape validation.
- Pre-push: runs full content validation and unit tests.
- Pre-push E2E: optional, enabled with `RUN_E2E_ON_PUSH=1`.

Default pre-push checks match:

```bash
npm run prepush:local
```

Run all checks (including E2E) manually before larger merges/releases:

```bash
npm run prepush:full
# or
RUN_E2E_ON_PUSH=1 git push
```

Bypass hooks only if necessary:

```bash
git commit --no-verify -m "message"
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

CI pipeline runs on push/PR as three parallel jobs:

1. **Unit & Integration Tests** — runs `check-frontmatter`, `test:run`, and `test:coverage`
2. **E2E Tests (Playwright)** — runs the full Playwright suite against a built server
3. **Build Verification** — runs `npm run build` and confirms `docs/index.html` was produced

All three jobs must pass for the CI status check to succeed.

GitHub Actions policy in this repository:

1. Workflows use `actions/checkout@v5`, `actions/setup-node@v5`, and `actions/upload-artifact@v7`.
2. Build/test runtime is pinned via `setup-node` to Node `22` for Next.js stability.
3. Workflows set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to proactively validate JavaScript action runtime compatibility.

## Project Status

Version 1.0 publicly released.

The catalog system is operational. Testing infrastructure is complete. Content added.

## Philosophy

This system prioritizes content over presentation. Releases are data. The interface is an access layer.

The architecture enforces constraints:

- Static output only. No server, no database.
- Markdown as the source of truth. No CMS.
- Type-safe schemas. Invalid content fails the build.
- Comprehensive test coverage. Behavior is verified.

Speed and simplicity over feature accumulation.

## License

- This repository’s source code is released under the MIT License.
- Brand identity, artwork, and site content are excluded and remain proprietary.
