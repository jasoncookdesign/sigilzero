# DESIGN.md — SIGIL.ZERO

**Property:** sigilzero.com  
**Document type:** AI Implementation Guidance  
**Initiative:** INI-042 — SIGIL.ZERO Brand Design System  
**Pipeline phase:** INI-042 Phase 3 — Canonization  
**Date:** 2026-06-11  
**Status:** Draft — pending CEO review

---

## Purpose

This document is written for AI systems operating on the SIGIL.ZERO codebase. It synthesizes the canonical brand documents (Brand.md, Audience.md, DesignLanguage.md, DesignPrinciples.md, DesignSystem.md, DesignCritique.md) into a compact implementation guide. When working on this codebase, read this file first.

For decisions not covered here, defer to the canonical docs above. For decisions that feel like they require judgment beyond the canonical docs, escalate to the President Agent.

---

## What SIGIL.ZERO Is

SIGIL.ZERO Records is an underground electronic music imprint. The website at sigilzero.com is a **release catalog** — the authoritative public record of what the label has released, who releases on it, and how those releases are classified.

The catalog uses a four-**series** classification architecture, each series with a distinct color identity and sonic scope:
- **Core** — foundational label expression (`#222222` / `#888888`)
- **Black** — peak-time, dark, maximal contrast (`#000000` / `#FF0000`)
- **Red** — groove-forward, warmer (`#D32F2F` / `#FFBABA`)
- **Void** — experimental, near-invisible (`#111111` / `#555555`)

**The series system is planned, not fully deployed.** Series are introduced one at a time as the catalog reaches sufficient depth. Currently all releases are undifferentiated core catalogue — no series color environments are active. Series color values are canonical and built into the design system now so each series can launch without structural retrofit. Do not apply series color treatments to any series that has not been formally announced.

---

## Key Constraints

### Color Rules
- Color has one of three meanings on this site: **global ground** (near-black palette), **series identity** (for active series only), or **interaction state** (hover/active)
- `#FF0000` appears as the interaction hover color for prose links; it also maps to the planned Black series accent — this overlap is accepted and will be re-evaluated at Black series launch. Use it only for interaction states and Black series contexts (when launched) — **never decoratively**
- Do not apply series color environments for any series that has not been formally launched
- Do not introduce any color not in the existing `tailwind.config.js` custom palette without CEO approval
- Do not add gradients, glow effects, or decorative color treatments

### Typography Rules
- **Della Respira** (`--font-heading`): headings and display text (2xl and above)
- **Mulish** (`--font-body`): all body, paragraph, and description text
- **Space Mono** (`--font-mono`): catalog numbers (SIG001, etc.), dates in metadata contexts, format fields, system labels
- Do not substitute, replace, or add fonts to this stack

### Catalog Rules
- Every release card **must** display: cover art, title, artist, catalog number (Space Mono), release date (Space Mono); series indicator is displayed only if the release's series has been formally launched
- No marketing copy in catalog card contexts — metadata only
- No visual hierarchy that elevates one release over others without a documented catalog-level reason
- `npm run validate:content` **must pass** before any PR — run it; do not disable or skip it
- `links.yml` must have entries for any platform links referenced in new release content

### Layout Rules
- Use `.container-sigil` for all page-level containers
- Use `.section-band` alternation for zone differentiation — do not introduce new background colors
- Series pages for **active series** must apply the series background color as the dominant visual decision; series pages for unannounced series should not expose series color environments

---

## What the Design Should Feel Like

**Institutional, not warm.** This is not an artist website. It is a catalog system — the official infrastructure of a serious organization. Coldness is correct.

**Disciplined, not minimal.** The design uses restraint as a strategy, not an absence of effort. Typography is selected, spacing is tuned, hierarchy is deliberate.

**Catalog-first, always.** Every design choice that makes the catalog harder to navigate is wrong, even if it is visually interesting.

---

## What to Avoid

| Avoid | Why |
|---|---|
| Neon colors | Not SIGIL.ZERO's institutional-dark; neon is generic "EDM aesthetic" |
| Gradient backgrounds | Decorative — this is a catalog, not a brand campaign |
| Glow effects / UI chrome | AI cosplay aesthetic; categorically rejected |
| Skull / flame / lightning imagery | Generic dark music shorthand |
| Warm or amber tones in non-Red-series contexts | Wrong temperature for SIGIL.ZERO's register |
| Editorial layouts for catalog pages | Catalog entries are catalog entries, not content features |
| Softening the institutional character | That is Dyson Hope's job; this site is colder by design |

---

## File Structure Reference

```
sigilzero/
  content/
    releases/     ← markdown with YAML frontmatter (Zod-validated)
    artists/
    mixtapes/
    series/
  data/
    label.yml     ← label identity, contacts
    links.yml     ← HARD DEPENDENCY for release platform links
    series.yml    ← series registry (color_hex, accent_hex — canonical)
  src/
    app/          ← Next.js App Router pages
    components/   ← React components
    lib/          ← content loaders, schemas, utilities
  tailwind.config.js  ← custom color tokens (sigil.*)
  src/app/globals.css ← global base styles
```

---

## Validation Workflow

Before any PR:

```bash
# Required — must pass
npm run validate:content

# Optional but recommended for component work
npm run test        # Vitest unit tests
npm run build       # verify static export
```

Husky hooks run validate on pre-commit and pre-push. Do not disable them.

---

## Ecosystem Position

SIGIL.ZERO is the **coldest, most institutional** property in the Dyson Hope creative ecosystem. When making design decisions, anchor against this:

- More institutional/cold than: dysonhope.com (warmer, personal), dishnbeats.com (warmest, hospitable), Temple of Unicorns (most expressive)
- The label's relationship to the artist: SIGIL.ZERO is the institution; Dyson Hope is the individual

If a design choice would be appropriate for dysonhope.com but feels warm or personal for a record label — it belongs there, not here.

---

## Escalation Triggers

Stop and escalate to President Agent if:
- A change to `data/series.yml` color values is required
- A change to the Tailwind font configuration is proposed
- A new color must be introduced to the global palette
- The design language requirements conflict in a way this document does not resolve
- A new site feature (editorial content, community features, etc.) would change the site's scope beyond a release catalog
