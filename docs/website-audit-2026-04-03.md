# Ravok Website Audit (April 3, 2026)

## What the earlier changes mean

The previous PR did two core things:

1. **Removed `@vercel/analytics` usage.**
   - Effect: fewer third-party runtime calls and no install blocker tied to that package in restricted environments.
   - Tradeoff: no Vercel analytics events unless reintroduced via an allowed telemetry provider.

2. **Changed custom cursor behavior to be conditional.**
   - Effect: users on touch/coarse pointers and users preferring reduced motion keep native pointer behavior.
   - UX win: avoids “missing cursor” confusion and improves accessibility.

## Current issues observed

### High priority
- **Two “scroll to top” controls in footer create redundant interaction and visual noise.**
  - One inline decorative dot + one fixed action button duplicates the same job.
- **External social links open in the same tab and lacked explicit security relationship.**
  - This can unexpectedly navigate users away from funnel pages.

### Medium priority
- **Main-nav/hero flow is visually rich but CTA hierarchy is diffuse.**
  - The user has multiple sections and animated content before a single clear conversion intent.
- **Copy tone is strong, but some statements are broad and not proof-backed on-page.**
  - Claims like “first venture studio...” should be paired with trust signals.
- **Hardcoded API rewrite fallback points to production backend.**
  - Environment drift risk when testing/staging if env vars are missing.

### Low priority
- **Heavy animation density across stacked sections can increase cognitive load.**
  - Especially on long scroll journeys with multiple parallax and motion layers.
- **Mixed heading voice/capitalization across sections.**
  - Some sections are assertive manifesto style; others are informational, creating tonal variance.

## Suggested fixes (prioritized)

1. **Funnel clarity (conversion-first)**
   - Add a single primary CTA (“Apply as Partner” or “Book Intro Call”) that appears in hero + sticky nav.
   - Add one secondary CTA only (“View Venture Model”).

2. **Trust and proof block above fold+1**
   - Add logos, partner count, or milestones (e.g., committed slate count, deal flow throughput).
   - Include one concise “How we underwrite” explainer.

3. **Copy tightening**
   - Replace broad claims with measurable phrasing.
   - Keep “manifesto” tone in hero, switch to concrete/operational tone in lower sections.

4. **Motion governance**
   - Define a motion budget: fewer simultaneous background motions, preserve meaning-focused transitions.
   - Keep reduced-motion support consistent across all animated sections.

5. **Environment safety**
   - Move rewrite fallback to environment-specific config to avoid accidental production coupling.

## Marketing copy direction (recommended)

### Positioning line
“We finance creator-led film ventures with startup discipline.”

### Proof line
“Each project is structured as an independent venture with ownership, governance, and distribution strategy from day one.”

### CTA pair
- Primary: “Apply to Partner”
- Secondary: “See the Venture Model”

## Next implementation candidates

1. Add a compact “Proof Strip” section (metrics + partner logos) below Intro.
2. Standardize CTA labels across Hero, Intro, Venture Model, and Footer.
3. Replace generic “Contact us” card actions in Offerings with intent-based actions (“Request Deck”, “Discuss Co-Production”, etc.).
