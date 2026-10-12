# SigilZero — Codebase Audit (October 2026)

Read-only audit of the whole repository against test-driven development, systematic debugging, and contract-first delivery, with explicit coverage of three known trouble spots: tests that don't verify what they claim, data definitions unused in the presentation layer, and weak implementation areas. The 2026-07-16 simplicity audit (`simplicity-audit-2026-07-16.md`) was used as input and re-verified; its findings are cross-referenced in the last section rather than repeated.

This is a prioritizable backlog, not a fix-everything mandate. Each finding stands alone so it can become its own issue. No production code, tests, content, or workflows were changed. Line numbers refer to `main` at `9004c26c`.

## How this was checked

- Baseline: `npx vitest run` (21 files, 313 tests, all pass), `npx playwright test` (37 tests, all pass, against `npm run dev`), `npm run validate:content` (all files valid), `npx next build` (passes, 51 static pages), `npx tsc --noEmit` (160 errors, all in test files).
- Test integrity: 43 unit mutations and 4 end-to-end mutations. Each one edited a single production line, ran the test file that claims to cover it (or the whole suite), recorded whether any test failed, then restored the file with `git checkout`. A mutation that "survives" means the code was broken and every test still passed. Results are in the appendix.
- Data model: every field in the four Zod schemas, the three YAML files, and the loader return types was traced to its consumers in `src/app` and `src/components`. A small script checked cross-file references (series ids, link group ids, artist ids, `featured_*`, `related_releases`, slug-to-filename) and date validity across all content.
- Behavior probes: a throwaway Playwright spec (deleted after the run) checked analytics page context after client-side navigation, the mixtape year filter options, and what the e2e card selector actually matches.
- Branch protection and workflow runs were read with `gh api` and `gh run list`.

Severity is impact if left alone: **High** (wrong behavior users or the label can see, or a gate that doesn't gate), **Medium** (latent defect, misleading signal, or a contract gap likely to bite during the transactional-content work), **Low** (hygiene or polish). Effort: **S** (under 2 hours), **M** (half a day to a day), **L** (multiple days).

## Prioritized backlog

| ID | Sev | Effort | Finding | Trouble spot |
|---|---|---|---|---|
| T1 | High | M | End-to-end filtering and navigation tests pass when filtering is disabled and when zero cards render | Tests |
| W1 | High | S | Deploys to production are not gated by CI | Weak impl. |
| W2 | High | M | Release status (Coming Soon / New Release, disabled buy links) is frozen at build time | Weak impl. |
| T2 | High | S | Loader tests can't detect broken ordering or a removed schema | Tests |
| T6 | High | S | Release-status logic, which gates stream and buy links, has no tests | Tests |
| D1 | Medium | M | Series has two sources of truth that have already drifted | Data |
| W13 | Medium | S | Search matches most of the catalog for short queries (subsequence matching over joined fields) | Weak impl. |
| D3 | Medium | S | `status` field and date-derived status contradict each other | Data |
| D2 | Medium | M | 40 schema and YAML fields have no live consumer or only a dead one, and several already hold dangling references | Data |
| D6 | Medium | S | Validation accepts an invalid date that the UI renders as "NaN", and checks no cross-references | Data |
| D7 | Medium | S | Three of four content validators crash instead of reporting errors (Zod 3 API on Zod 4) | Data |
| W3 | Medium | S | Analytics page context leaks across client-side navigation; five routes never send a page view | Weak impl. |
| T4 | Medium | S | Search tests never exercise fuzzy matching or most searched fields; type and key filters untested | Tests |
| T9 | Medium | S | Test files carry 160 type errors that nothing checks | Tests |
| T10 | Medium | M | The 948-line tracking script, including its PII sanitization, has no tests | Tests |
| D5 | Medium | S | YAML data files are cast to types without validation | Data |
| W4 | Medium | S | Detail pages look up content by filename substring, not by slug | Weak impl. |
| W5 | Medium | S | Markdown bodies render as raw text; multi-paragraph bodies collapse | Weak impl. |
| W6 | Medium | S | The `active` flag hides navigation but not routes or listings | Weak impl. |
| W7 | Medium | S | `npm run lint` is broken and nothing lints the code | Weak impl. |
| D4 | Medium | S | Label metadata lives in `label.yml` but the pages hard-code it | Data |
| T3 | Medium | S | `sort.test.ts` tests a copy of the helper (confirmed) | Tests |
| T5 | Medium | S | Breadcrumb tests named for decoding and deep paths test neither | Tests |
| T7 | Low | S | Interactive and analytics behaviors in components are untested | Tests |
| T8 | Low | S | Many component tests assert Tailwind class names instead of behavior | Tests |
| W8 | Low | S | Loader validation errors don't name the failing file | Weak impl. |
| W9 | Low | S | Mixtape detail only embeds SoundCloud though the schema allows four platforms | Weak impl. |
| W10 | Low | S | Catalog URL contract supports multi-value and key filters the UI never reads | Weak impl. |
| W11 | Low | S | README deployment and CI sections are partly stale | Weak impl. |
| W12 | Low | S | Client catalogs receive full documents, including unused fields and bodies | Weak impl. |

Suggested first slice, given the transactional-artifact work ahead: W1, then T1 and T2 together (so the suite becomes a real gate), then W2 with T6 and D3 (status is the closest existing thing to transactional logic), then D6 and D1.

## 1. Tests that don't verify what they claim

### T1 — End-to-end tests pass with filtering disabled and with zero cards rendered (High, M)

Evidence. With `filterReleases` bypassed in `ReleasesCatalog.tsx` (E1) all 8 "Releases Filtering" tests pass. With `filterMixtapes` returning its input (E2) all 6 "Mixtapes Filtering" tests pass. With the releases grid rendering no cards (E3) all 8 still pass, and with the artists grid rendering no cards (E4) all 4 "Artists Filtering" tests pass.

Causes, all in `e2e/filtering.spec.ts` unless noted:

- The card selector `[class*="grid"] > div` doesn't select cards. Cards render as `<a data-target="release_card">` (via `Card` in `src/components/ui/Card.tsx:22-29`). On `/releases` the selector matched 3 elements (the footer columns) while the page had 9 release cards; a card is an `<a>`, so it can never be a direct `div` child of a grid. It appears 25 times in the file (for example lines 24, 31, 115, 149, and 230).
- Assertions that can't fail: `toBeLessThanOrEqual(initialCards)` after filtering (32, 49, 66, 155, 168), `toBeGreaterThanOrEqual(0)` (210, 271), and "should show only active artists" only checks that the count is above zero (254-258).
- Conditional bodies that silently skip. The common cause is that the filter panel is collapsed by default (`filtersOpen` starts false; `hidden` class at `ReleasesCatalog.tsx:220` and `MixtapesCatalog.tsx:211`), so every select reports `isVisible() === false` (observed for the year select). That skips the series test (35-51), "should filter mixtapes by artist" (158-170), and "should show year filter" (200-212). The series select is additionally hidden because no series is active. The genre test would skip even with the panel open: it looks for `input[type="checkbox"]`, but genre filters are buttons (`ReleasesCatalog.tsx:317-327`) (53-68). The detail-navigation tests only assert if the URL happened to change (78-101, 234-252).
- The search tests can't distinguish working search from broken search partly because search itself over-matches (W13): "test" returns 6 of 9 releases.
- "should clear filters" never clicks the Clear button (103-117).
- `e2e/navigation.spec.ts:56-68` would fail if it ran: it expects an `h1` containing "Series", but the series page title is an `h2` (`src/app/series/page.tsx:14`); it also expects the URL `/series` exactly (line 65) while `trailingSlash: true` (`next.config.mjs:6`) likely yields `/series/` (not run). The `if (isVisible)` guard hides both because the Series link is hidden.
- `e2e/navigation.spec.ts:109-125` "should navigate on mobile devices" accepts any visible link containing "Artists" (`nav a, a[href="/artists"]`), and the home page has visible ones outside the nav (`src/app/page.tsx:127, 292, 299`), so it likely passes without opening the mobile menu (inferred from markup, not run).
- `e2e/smoke.spec.ts:44-50` "404 page works" only asserts the body has text.

### T2 — Loader tests can't detect broken ordering or a removed schema (High, S)

Evidence. Reversing the date sort in `load-releases.ts:50-54` (M02) or `load-mixtapes.ts:49-53` (M03) passes (M02 against the whole suite, M03 against its loader test). Replacing `XSchema.parse(data)` with an unchecked cast in each of the four loaders (M10-M13) also passes. The artist and series order tests do catch order inversions (M04, M05 killed).

Cause. `src/lib/content/load-*.test.ts` assert properties of the committed content (`toHaveProperty`, `typeof`, array checks) that the content satisfies whether or not the loader validates or sorts it. The release and mixtape test files have no ordering test at all, though the catalog pages display in loader order. Several tests also return early when no content exists (`load-releases.test.ts:56, 72`; `load-mixtapes.test.ts:64, 80`; `load-artists.test.ts:138, 154`; `load-series.test.ts:44`), so an empty content directory passes vacuously. These are content-coupled integration checks presented as loader unit tests. A loader contract test needs fixture directories with known order and at least one invalid file.

### T3 — `sort.test.ts` tests a copy of the helper (Medium, S)

Confirms the simplicity audit. `src/lib/utils/sort.test.ts:3-13` redefines `sortByDateDesc` locally; reversing the real one in `src/app/page.tsx:25` (M01) leaves all 7 tests passing.

### T4 — Search and filter tests miss most of their branches (Medium, S)

- `src/lib/filters/releases.test.ts:99-104` "should use fuzzy matching" searches `tech`, an exact substring of "Techno Beat", so it never reaches the fuzzy branch. Making the fuzzy branch always return false (M16) passes the whole suite. Same for mixtapes (M17); `mixtapes.test.ts` has no fuzzy test.
- Removing searched fields survives: mixtape search on `artist_id` (M18), release search on track titles (M19), release search on remix artists (M21).
- The release `types` filter (M14) and `keys` filter (M15) have no tests; removing either passes.
- Positive: BPM overlap (M20) and mixtape year (M22) are covered and were killed.

### T5 — Breadcrumb tests named for behavior they don't exercise (Medium, S)

`src/components/Breadcrumb.test.tsx:126-133` "should handle URLs with special characters and decode them" passes `/mixtapes/dyson-hope-live-in-austin`, which has nothing to decode; removing `decodeURIComponent` from `Breadcrumb.tsx:19` (M32) passes the suite. Lines 200-209 "should handle deep nested paths" use a two-segment path.

### T6 — Release-status logic has no tests (High, S)

`src/lib/release-status.ts` has no test file. Inverting `isComingSoon` (M27) or removing the badge from `ReleaseCard.tsx:60-68` (M28) passes all 313 tests. This logic decides whether stream and buy links render disabled on the release page (`src/app/releases/[slug]/page.tsx:118`, `StreamingLinks.tsx:36-41`), which makes it the closest thing to transactional logic in the codebase today. The `ReleaseCard` test fixture uses a 2024 date, so the badge path is never rendered.

### T7 — Interactive and analytics behavior in components is untested (Low, S)

All of these mutations passed the full suite: making `ArtistCard` link by `id` instead of `slug` (M34; every card fixture and every real artist has `id === slug`, so id/slug mix-ups in hrefs can't be detected), inverting the Navigation active-state check (M29), making the mobile menu button do nothing (M30; `Navigation.test.tsx:86-91` only asserts that some button exists), dropping `trackingAttrs` from `Card` (M31, which silently removes release and artist click analytics), disabling the `PlaceholderImage` fallback (M33), changing three-or-more artist formatting in `ReleaseCard` (M35), and removing `placehold.ts` retina, clamping, or text handling (M24-M26). Only the clamp and text cases matter in practice; `PlaceholderImage` relies on `text`.

### T8 — Class-name assertions standing in for behavior (Low, S)

`Section.test.tsx:15-45`, `BackButton.test.tsx:59-87, 119-129`, `Breadcrumb.test.tsx:103-116, 173-198`, and `Navigation.test.tsx:78-84` assert Tailwind classes (`py-16`, `sticky`, `hover:text-white`). They break on restyling and catch no behavioral regression. Low priority; worth pruning when those files are touched.

### T9 — Test files don't type-check (Medium, S)

`npx tsc --noEmit` reports 160 errors, all in 16 test files (none in production code). Examples: track fixtures missing the required `remix_artists` and `featured_artists` (`releases.test.ts:50, 71, 72, 231`), and `exactOptionalPropertyTypes`/`noUncheckedIndexedAccess` violations throughout. Vitest strips types and `next build` passes its TypeScript step, so nothing gates test typing. The practical risk is fixtures drifting from the real `Release` and `Track` shapes without anyone noticing.

### T10 — Tracking script has no tests (Medium, M)

`public/assets/js/tracking.js` (948 lines) implements the analytics event contract and the PII rules the README documents (`README.md:57-69, 145-165`: email and phone blocking, `mailto:`/`tel:` redaction, querystring stripping). No unit or e2e test references `tracking`, `dataLayer`, or `SigilZeroTracking`. It lives in `public/`, so it isn't type-checked either. Privacy sanitization is a trust boundary; it deserves a small contract suite (jsdom is already configured).

### What the tests do verify

Not everything is weak. Schema unit tests kill targeted mutations (S1-S4: dropping `.url()` on `embed_url`, loosening the release `status` enum, flipping the series `active` default, dropping `.email()` on `booking_email`). `serialize-filters.test.ts` catches a changed delimiter (S5) and a dropped `key` parse (M36). The `MixtapeCard` and `SeriesCard` tests catch a wrong href (S6) and a missing tagline (S7). Artist and series ordering (M04, M05), slug lookup (M07-M09), `hasActiveSeries` (M06), BPM overlap (M20), mixtape year (M22), and placeholder dimensions (M23) are covered. The schema tests do, however, also lock in fields nothing uses (D2).

## 2. Data definitions unused or duplicated

### D1 — Series has two sources of truth that have already drifted (Medium, M)

`data/series.yml` is loaded by `load-series-registry.ts` without validation and feeds release cards, the release detail line, and the catalog series filter (`src/app/page.tsx:62, 190-194`; `releases/page.tsx:13`; `releases/[slug]/page.tsx:42-43`). `content/series/*.md` is loaded through `SeriesSchema` and feeds the series pages, the home series section, and nav visibility (`layout.tsx:59`, `page.tsx:61, 86-93`). They describe the same four series with different fields and have drifted: Red's `accent_hex` is `#D32F2F` in `data/series.yml:26` and `#FFBABA` in `content/series/red.md:9`; the registry carries `description` and `light_accent_hex` (`series.yml:27`), which nothing reads, while the markdown carries `tagline`, `background_hex`, and `default_genres`. Two TypeScript types follow (`SeriesRegistryItem` and `Series`), consumed by different cards (`ReleaseCard.tsx:12` and `SeriesCard.tsx:8`). Every series is `active: false`, which hides the Series nav and filter, while the registry still labels every release card with a series name. Rated Medium because the only visible drift today is Red's accent color and the series pages are unlinked; it rises in priority if series becomes part of the transactional model.

### D2 — Fields with no live consumer (Medium, M)

Traced from schema to every non-test consumer in `src/app` and `src/components`. "Dead path only" means the only reader is code the simplicity audit already marks unreachable.

| Source | Field (line) | Status |
|---|---|---|
| `schemas/artist.ts` | `instagram_handle` (19), `booking_email` (44), `management_email` (45), `label_join_year` (47), `featured_releases` (50), `featured_mixtapes` (51), `genres_primary` (53), `tags` (54) | No consumer |
| `schemas/artist.ts` | `roles` (12), `for_fans_of` (15) | Dead path only (`ArtistAssetCard`, behind `{false && …}` in press kit) |
| `schemas/release.ts` | `isrc` (15), `preorder_date` (42), `bpm_range` (49), `background_art` (53), `label_copy_short` (55), `link_groups.other` (26) | No consumer |
| `schemas/release.ts` | `preview_url` (19) | Dead path only; populated on many tracks, passed to `ReleaseTrackList` (`releases/[slug]/page.tsx:148`) which declares it (`ReleaseTrackList.tsx:12`) and ignores it |
| `schemas/release.ts` | `flagship` (56) | Dead path only (press-kit flagship section, disabled) |
| `schemas/mixtape.ts` | `external_url` (21), `duration_minutes` (23), `thumbnail_image` (26), `featured` (32), `related_releases` (35) | No consumer |
| `schemas/mixtape.ts` | `tags` (30) | Wired to filter UI, but no mixtape has tags, so the control never renders |
| `schemas/series.ts` | `background_hex` (14), `default_genres` (18) | No consumer |
| `data/series.yml` | `description`, `light_accent_hex`, `color_hex`, `order`, `slug` | No consumer (registry readers use only `id`, `name`, `short_label`, `accent_hex`) |
| `data/label.yml` | `name`, `tagline`, `contact_email`, `booking_email`, `demo_email`, `location`, `founded_year`, `social.facebook`, `social.beatport` | No consumer (see D4) |
| `data/links.yml` | nine `SIGxxx-other` groups | Never loaded; all empty |

Unused fields rot, and several already hold references that resolve to nothing: `related_releases` uses lowercase `sig001`-style values that match no release id or catalog number (`dyson-hope-burning-man-2025-sound-camp-house.md:22-25` and two "matrix rave" mixtapes); `featured_mixtapes` names three mixtapes that don't exist (`b-squared.md:39, 41`; `dyson-hope.md:43`); `featured_releases` uses catalog numbers (`SIG001`) where every other reference uses release ids. Schema tests (`src/lib/schemas/*.test.ts`) lock these fields in place, which makes them look supported. Decide per field whether it is planned (and document the consumer) or removable.

### D3 — `status` field and date-derived status contradict (Medium, S)

The home page splits New Releases and Coming Soon on the frontmatter `status` field (`src/app/page.tsx:71, 75`). Release cards and the release page ignore `status` and derive Coming Soon or New Release from `release_date` (`ReleaseCard.tsx:17`; `releases/[slug]/page.tsx:57`). A release marked `upcoming` with a past date appears under Coming Soon on the home page with live buy links on its own page; a release marked `released` with a future date shows a Coming Soon badge and disabled links. `promo-only` (`release.ts:4`) has no behavior anywhere. This needs one owning rule before any transactional state is added.

### D4 — Label metadata defined once, hard-coded three times (Medium, S)

`data/label.yml` holds the label's socials and emails, but the home page hard-codes five social links (`src/app/page.tsx:30-56`), the footer hard-codes socials and emails (`layout.tsx:156-203`), and the press kit reads only three socials from the YAML (`press-kit/page.tsx:47-103`) and hard-codes its contact block (`press-kit/page.tsx:165-166`), including `press@sigilzero.com`, which isn't in `label.yml` at all.

### D5 — YAML data is cast, not validated (Medium, S)

`src/lib/content/load-yaml.ts:5-9` returns `yaml.load(raw) as T`. `label.yml`, `links.yml`, and `series.yml` have no schema, and `validate:content` doesn't look at them. A typo in a link group id or a missing `links` array becomes `undefined` at render time rather than a build failure. Markdown content gets Zod at the boundary; the YAML half of the data model doesn't.

### D6 — Validation passes data the UI can't handle and checks no references (Medium, S)

- Dates are `z.string().min(1)` (`release.ts:41`, `mixtape.ts:16`). `content/mixtapes/b-squared-space-rave-2026.md:7` has `date: "2026-27-02"`. It passes `validate:content`, renders a "NaN" option in the `/mixtapes` year filter (observed: options were All years, NaN, 2026, 2025, 2024; the dev server also logs "Received NaN for the `value` attribute"), and feeds `NaN` into the loader's sort comparator (`load-mixtapes.ts:50-52`).
- No referential checks exist for `series_id`, `link_groups.*`, artist ids, `artist_id`, `featured_*`, or `related_releases`. Today the live references resolve (checked); the unused ones in D2 don't.
- Unknown keys are stripped silently: `content/artists/dj-anti.md:23` has a top-level `other: []`, clearly a mis-indented `social.other`. It validates, and the only signal is a field-order warning.

### D7 — Content validators crash instead of reporting (Medium, S)

`scripts/validate-releases.mjs:72`, `validate-series.mjs:41`, and `validate-artists.mjs:84` read `error.errors`, which Zod 4 removed (installed: `zod ^4.1.13`); `validate-mixtapes.mjs:51` correctly uses `error.issues`. Reproduced by setting a release `type` to an invalid value: the script exits 1 with `TypeError: Cannot read properties of undefined (reading 'map')` and no list of what's wrong. The gate still blocks, but the diagnostics content authors rely on are gone. This sits on top of the duplicated-schema finding from the simplicity audit, and `scripts/normalize-mixtapes.mjs` and `normalize-releases.mjs` add a fourth copy of the field lists; neither is referenced by `package.json`, hooks, workflows, or docs.

## 3. Weak implementation areas

### W1 — Deploys are not gated by CI (High, S)

`.github/workflows/deploy.yml` runs on every push to `main` with no dependency on the test workflows, and branch protection on `main` has no required status checks (`gh api …/branches/main/protection` returns no `required_status_checks`). On the last `main` push, Deploy, CI, and CI Tests all started at 2026-10-06T14:06:04Z in parallel. A PR with failing tests can be merged and will deploy. `README.md:312` says all jobs "must pass," which isn't enforced. The fix touches repository settings or `.github/`, so it's an owner change.

### W2 — Release status is frozen at build time (High, M)

`release-status.ts:8-13` compares `release_date` to `new Date()` at render, but the site is a static export (`next.config.mjs:5`), so render happens once at build. Coming Soon and New Release badges, and the disabled stream and buy buttons on the release page (`releases/[slug]/page.tsx:118`), only change when something else triggers a deploy. A release scheduled for Friday keeps dead buy buttons after Friday until the next merge; a New Release badge outlives its 30 days the same way. Any transactional content (pre-orders, drops, availability windows) will hit this first. Options include a scheduled rebuild, client-side evaluation, or both; that's a design decision.

### W3 — Analytics page context leaks across client navigation (Medium, S)

`PageContextTracker` is rendered on 7 of 12 page routes; it's missing from `mixtapes`, `mixtapes/[slug]`, `series`, `series/[slug]`, and `calendar`. It sets `data-page-type` and release and artist attributes on `<body>` (`PageContextTracker.tsx:55-58`) and never resets them on unmount (cleanup at 132-140 only clears timers and listeners). Observed with Playwright: from `/releases/drums-in-the-deep`, clicking the Mixtapes nav link left `data-page-type="release_detail"` and `data-release-title="Drums in the Deep"` on the body, and no page-view event was pushed for `/mixtapes`. Clicks on those pages are attributed to the previous release. Separately, the mixtape page's "Open on SoundCloud" link is tagged `data-entity="release"` and `data-target="streaming_link"` (`SoundCloudEmbed.tsx:70-77`); `MixtapeCard` and `SeriesCard` pass no `trackingAttrs` (`MixtapeCard.tsx:15`, `SeriesCard.tsx:13`), so those card clicks are untracked; and the press-kit Key Links are tagged `data-section="footer"` (`press-kit/page.tsx:60` and siblings).

### W4 — Slug lookup by filename substring (Medium, S)

`loadReleaseBySlug`, `loadArtistBySlug`, `loadMixtapeBySlug`, and `loadSeriesBySlug` return the first file whose name contains the slug (`load-releases.ts:31`, `load-artists.ts:30`, `load-mixtapes.ts:30`, `load-series.ts:30`), while `generateStaticParams` uses the frontmatter `slug`. The filename-contains-slug rule is undocumented and unchecked. No collisions exist today (checked), but slugs like `…-sessions-3` and `…-sessions-30` would resolve to whichever file `readdir` lists first, and a renamed file would silently 404.

### W5 — Markdown bodies render as raw text (Medium, S)

Release, mixtape, and series pages render `{body}` directly (`releases/[slug]/page.tsx:108-112`, `mixtapes/[slug]/page.tsx:79-83`, `series/[slug]/page.tsx:71-75`) with no Markdown rendering and no whitespace preservation. The built `out/series/black/index.html` contains a literal `**Black**`, and the multi-paragraph bodies of five releases and one mixtape collapse into a single block. The artist page preserves line breaks with `whitespace-pre-wrap` (`artists/[slug]/page.tsx:105`) but still doesn't render Markdown. `CLAUDE.md` describes content as Markdown. This interacts with the unused MDX/remark stack in the simplicity audit: either render Markdown with one small dependency or treat bodies as plain text and say so.

### W6 — `active` hides navigation but not routes or listings (Medium, S)

All four series are inactive, yet `/series` and all four `/series/[slug]` pages are built and reachable (build output; the e2e run loads `/series`). `generateStaticParams` in every detail route ignores `active` (for example `releases/[slug]/page.tsx:24-29`), so inactive releases, mixtapes, and artists still get public pages, and the artist page lists releases and mixtapes without an `active` filter (`artists/[slug]/page.tsx:42-62`). Index pages do filter. The meaning of `active` needs a single definition.

### W7 — Lint is broken and absent (Medium, S)

`package.json` defines `"lint": "next lint"`. Next 16.1.6 no longer has that command; running it fails with "Invalid project directory provided, no such directory: …/lint". ESLint isn't installed or configured, and no workflow lints.

### W8 — Loader errors don't name the file (Low, S)

`parseReleaseFile` and its siblings (`load-releases.ts:12-22` and equivalents) let `ZodError` propagate without the file path. Reproduced: an invalid `type` produces "Invalid option: expected one of …" with no indication of which of the nine release files is wrong.

### W9 — Mixtape player only supports SoundCloud (Low, S)

`mixtapes/[slug]/page.tsx:89` renders a player only when `platform === "soundcloud"`; the schema allows `youtube`, `mixcloud`, and `other` (`mixtape.ts:3`), which would render no player and no link. All 23 current mixtapes are SoundCloud, so this is latent.

### W10 — Catalog URL contract wider than the UI (Low, S)

`serialize-filters.ts` round-trips multi-value series, type, and artist params and a `key` param, and tests cover that. The catalogs read only the first value of each (`ReleasesCatalog.tsx:55-57`, `MixtapesCatalog.tsx:44-45`), never read `keys`, and offer no key filter. A shared link with two artists silently drops one.

### W11 — README deployment and CI sections are partly stale (Low, S)

`README.md:297-312` says the build validates frontmatter (it doesn't; `npm run build` is `next build && cp -r out docs`), that e2e runs "against a built server" (Playwright runs `npm run dev`, `playwright.config.ts:28-33`), and that all jobs "must pass" (the `ci-status` job in `test.yml` aggregates them, but nothing requires it before merge or deploy, W1). It also describes `npm run build` and `/docs` as the deploy path, while `deploy.yml` runs `npx next build` and uploads `./out`. The `/docs` output and the `test.yml` build check are accurate.

### W12 — Client catalogs receive whole documents (Low, S)

`ReleasesCatalog` and `MixtapesCatalog` receive full `ReleaseDocument[]`/`MixtapeDocument[]`, bodies and unused fields included; the `/releases` HTML payload contains `label_copy_short`, which nothing renders. Minor payload weight now; it matters more if transactional fields (prices, codes, private notes) are ever added to frontmatter, because anything in frontmatter will be shipped to the browser by default.

### W13 — Search matches most of the catalog for short queries (Medium, S)

`fuzzyMatch` (`filters/releases.ts:21-38`, duplicated in `filters/mixtapes.ts:15-32`) falls back to subsequence matching over one string that joins title, catalog number, track titles, and artist ids (`filters/releases.ts:54-61`). Over that much text, short queries match almost anything. Observed on `/releases`: "test" returned 6 of 9 releases, none containing "test" in any searched field; "Need More" returned "Need More Drugs" and "Get Up and Go". This is user-visible and is one reason the e2e search assertions carry no signal (T1). Fuzzy search is a solved problem; if fuzziness is wanted, an existing small library or per-field matching with a threshold beats the hand-rolled version.

## 4. Contract-first review of module boundaries

Contract-first asks whether each boundary has an executable contract (a typed interface plus a test that fails on missing behavior) and whether each cross-module invariant has an owning test against the assembled system.

| Boundary | Executable contract today | Gap |
|---|---|---|
| Content files → loaders (`load-*.ts`) | Zod schemas at parse time; schema unit tests | Loader behavior (ordering, slug lookup, rejection of invalid files) has no fixture-based test (T2, W4, W8). Dates are untyped strings (D6). |
| YAML data → loaders (`load-yaml.ts`, `load-label.ts`, `load-links.ts`, `load-series-registry.ts`) | TypeScript types only, by cast | No runtime contract (D5); series duplicated with the markdown model (D1). |
| Schemas → validator scripts | None; four hand-copied schemas | Drift is structural (simplicity audit), and three scripts are broken on Zod 4 (D7). |
| Loaders → pages and components | Inferred Zod types | Many fields have no consumer (D2); `status` has two competing interpretations (D3); `active` has no single meaning (W6). |
| Filters and URL serialization (`lib/filters`) | Good unit coverage of serialization; partial coverage of filtering | Fuzzy search, type, and key filters untested (T4); fuzzy search over-matches (W13); UI uses a narrower contract than the serializer (W10). |
| Release status (`release-status.ts`) | None | Untested (T6) and evaluated at build time (W2). |
| Components → tracking script (`data-*` attributes, body context) | README prose only | No test owns the event contract or PII rules (T10); context leaks on navigation (W3); dropping `trackingAttrs` is undetected (T7). |
| Assembled site (e2e) | 37 Playwright tests | Selectors and assertions don't bind to behavior (T1). |
| Build → deploy | Workflows exist | Deploy not gated (W1); lint absent (W7). |

Cross-module invariants with no owning test against the assembled system: every `series_id`, link group id, and artist id resolves; every detail route's slug resolves to the file it was generated from; every page sets its own analytics context; and the stream and buy controls reflect the release's actual availability on the day a visitor sees them. Each of these is a candidate for one small test.

## 5. Simplicity audit (2026-07-16) re-verified

All 15 findings still hold on current `main`. Spot checks: the audio subsystem is still mounted in `layout.tsx:7-8, 82-88` and `MixtapePlayButton` has no importer; the three `{false && …}` press-kit sections remain (`press-kit/page.tsx:113, 128, 143`); `SHOW_MIXTAPES = false` remains (`page.tsx:65`); `SpotifyPlayer`, `InstagramFeed`, `fetch-posts.ts`, and `api/placeholder/route.ts` have no importers or references (the build still emits `/api/placeholder` as a dynamic route in a static export); no source imports `remark`, `rehype`, or `mdx-config`; `ci.yml` and `test.yml` still overlap; the validator scripts still duplicate the schemas; `fuzzyMatch` is still duplicated (`filters/releases.ts:21-38`, `filters/mixtapes.ts:15-32`); `sort.test.ts` still tests a copy (now confirmed by mutation, T3); the seven empty files are still 0 bytes; the `tsconfig.json:17-19` emit options and `package.json:4` `main` remain; `ci:test` still repeats `check-frontmatter`; and both `CNAME` copies remain.

This audit adds to that list rather than replacing it. Where they overlap, the simplicity finding is the deletion and the finding here is the defect: for example, the dead audio path is why `preview_url` has no consumer (D2), and the unused MDX stack sits next to Markdown that never renders (W5).

## Coverage and limits

Covered: every file under `src/`, `scripts/`, `e2e/`, `.github/workflows/`, `.husky/`, `data/`, and the root configuration; all content frontmatter for validity and references; `public/assets/js/tracking.js` for structure and test coverage (not a line-by-line review of its sanitization rules). Not covered: visual design and accessibility (the 2026-06 design work has its own spec in `DESIGN.md`), binary assets, GTM container configuration, and production analytics data. E2E ran locally against `npm run dev` on Chromium only. The mutation set is targeted, not exhaustive; it was chosen to test each test file's headline claims.

## Appendix — mutation results

Each row is one production edit, run against the named test scope, then reverted. Survived means every test still passed.

| ID | Production change | Scope | Result |
|---|---|---|---|
| M01 | `page.tsx` home sort reversed | `sort.test.ts` | Survived |
| M02 | `load-releases.ts` date sort reversed | loader test; full suite | Survived |
| M03 | `load-mixtapes.ts` date sort reversed | loader test | Survived |
| M04 | `load-artists.ts` order reversed | loader test | Killed |
| M05 | `load-series.ts` order reversed | loader test | Killed |
| M06 | `hasActiveSeries` negated | loader test | Killed |
| M07-M09 | `load*BySlug` ignores slug (releases, artists, mixtapes) | loader tests | Killed |
| M10-M13 | Loader skips `Schema.parse` (artists, releases, mixtapes, series) | loader tests; full suite for releases | Survived |
| M14 | Release `types` filter removed | `releases.test.ts` | Survived |
| M15 | Release `keys` filter removed | `releases.test.ts` | Survived |
| M16 | Release fuzzy branch always false | `releases.test.ts`; full suite | Survived |
| M17 | Mixtape fuzzy branch always false | `mixtapes.test.ts` | Survived |
| M18 | Mixtape search drops `artist_id` | `mixtapes.test.ts` | Survived |
| M19 | Release search drops track titles | `releases.test.ts` | Survived |
| M20 | Release BPM overlap check broken | `releases.test.ts` | Killed |
| M21 | Release search drops remix artists | `releases.test.ts` | Survived |
| M22 | Mixtape year filter removed | `mixtapes.test.ts` | Killed |
| M23 | `placehold.ts` width and height swapped | `placehold.test.ts` | Killed |
| M24-M26 | `placehold.ts` retina, clamp, text removed | `placehold.test.ts` | Survived |
| M27 | `isComingSoon` inverted | full suite | Survived |
| M28 | `ReleaseCard` status badge removed | full suite | Survived |
| M29 | Navigation active state inverted | full suite | Survived |
| M30 | Mobile menu button no-op | full suite | Survived |
| M31 | `Card` drops tracking attributes | full suite | Survived |
| M32 | Breadcrumb skips `decodeURIComponent` | full suite | Survived |
| M33 | `PlaceholderImage` never falls back | full suite | Survived |
| M34 | `ArtistCard` links by id instead of slug | full suite | Survived (fixtures use `id === slug`; an earlier run that appeared killed used a malformed edit, corrected on independent re-run) |
| M35 | `ReleaseCard` 3+ artist formatting changed | full suite | Survived |
| M36 | Serializer ignores `key` param | full suite | Killed |
| S1-S4 | Schema loosened (mixtape `embed_url` URL check, release `status` enum, series `active` default, artist `booking_email` check) | schema tests | Killed |
| S5 | Serializer artist delimiter changed | `serialize-filters.test.ts` | Killed |
| S6 | `MixtapeCard` href changed | `MixtapeCard.test.tsx` | Killed |
| S7 | `SeriesCard` tagline removed | `SeriesCard.test.tsx` | Killed |
| E1 | Releases catalog bypasses `filterReleases` | e2e Releases Filtering | Survived (8/8 pass) |
| E2 | `filterMixtapes` returns input | e2e Mixtapes Filtering | Survived (6/6 pass) |
| E3 | Releases catalog renders no cards | e2e Releases Filtering | Survived (8/8 pass) |
| E4 | Artists grid renders no cards | e2e Artists Filtering | Survived (4/4 pass) |
