# 02 — Public Site

## CONTEXT FOR CLAUDE CODE
> Read this before building or modifying any public-facing page. Includes page specs, component map, and SEO direction.

---

## Current Site Map (ravokstudios.com)

```
/ (Homepage)
/about-us/
/our-model/
/insights/
/contact-us/
/login/          → Investor Portal
/register/       → Investor Registration
/terms-and-conditions/
/privacy-policy/
```

## Target Site Map (Post-Rebrand)

```
/ (Homepage)                    — Hero manifesto + venture overview
/about                          — Amanda's story + team + advisory board
/model                          — How the venture studio works (visual explainer)
/portfolio                      — NEW: Showcase SPVs, labels, tech ventures
  /portfolio/film-ventures
  /portfolio/production-labels
  /portfolio/tech-ventures
/insights                       — Blog/thought leadership
  /insights/[slug]              — Individual articles
/investors                      — Gate page → login to portal
/creators                       — NEW: 2026 waitlist + how it works for filmmakers
/partners                       — NEW: For co-producers, distributors, operators
/contact
/legal/terms
/legal/privacy
```

---

## Page-by-Page Specifications

### Homepage `/`
**Goal:** Convert visitors into one of 4 CTAs within 30 seconds.

**Sections (scroll order):**
1. Hero — Bold statement + ambient video/animation background. CTA: "See the Model"
2. The Problem — Why Hollywood is broken (2-3 punchy lines)
3. The Solution — RAVOK venture studio model (visual diagram)
4. The Slate — 2025 portfolio cards (Bite Me, HYSTERA, Phema)
5. The Numbers — Key metrics (ventures in dev, capital deployed, charity impact)
6. Partner Types — 4 cards: Co-Producers, Financiers, Distributors, Operators
7. Amanda Quote — Pull quote with photo
8. CTA Bar — "Ready to build something?" → Contact / Invest / Create

**Components needed:**
- `<HeroSection />` — Full-viewport with animated text
- `<ProblemStatement />` — Minimal text, maximum impact
- `<VentureModelDiagram />` — Interactive or animated SVG showing SPV flow
- `<PortfolioGrid />` — Cards for each venture with status badges
- `<MetricsCounter />` — Animated number counters
- `<PartnerCards />` — 4 audience-specific CTAs
- `<FounderQuote />` — Styled blockquote with image
- `<CTABar />` — Sticky or section-bottom conversion bar

---

### About `/about`
**Goal:** Build trust through Amanda's authentic story.

**Sections:**
1. Founder story — First-person narrative (from the Shoutout LA interview + About page)
2. Mission — "Give filmmakers the same ownership tech founders get"
3. Team grid — Roles with headshots (when available)
4. Advisory board — Names + credentials (once finalized)
5. Timeline — Key milestones (founding → first slate → first event → PE raise)
6. Press mentions — Shoutout LA, any others

**Key copy source:** The current about-us page has a raw, honest founder letter. Keep that energy. The "[SPECIFIC MOMENT]" placeholder in the current copy needs Amanda to fill in her actual breaking-point story.

---

### Our Model `/model`
**Goal:** Make the venture studio model crystal clear to non-VC audiences.

**Sections:**
1. "Not a Production Company" — Positioning statement
2. How an SPV Works — Step-by-step visual (Idea → SPV incorporation → Seed capital → Packaging → Financing → Production → Distribution → Returns)
3. What Creators Get — Equity breakdown, governance rights, board seats
4. What Investors Get — Portfolio exposure, transparent structures, multiple exit paths
5. Comparison table — RAVOK model vs Traditional studio vs Production company
6. FAQ accordion

---

### Portfolio `/portfolio`
**Goal:** Showcase the slate as proof the model works.

**For each venture:**
- Title card with status badge (Development / Financing / Production / Released)
- Genre, budget range, target audience
- Key team members attached
- Distribution strategy
- NO spoilers or full scripts — this is investor/partner facing

---

### Insights `/insights`
**Goal:** Position Amanda and RAVOK as thought leaders.

See `06-content-engine/CONTEXT.md` for full CMS spec.

---

### Creators `/creators`
**Goal:** Attract filmmaker-founders for the 2026 cohort.

**Sections:**
1. "Think Like a Founder" — Manifesto for creators
2. What You Get — Equity, capital, legal, ops support
3. What We Look For — Stage, genre fit, founder mindset
4. How It Works — Application → Evaluation → SPV formation → Development
5. 2026 Waitlist Form — Name, email, project logline, portfolio link
6. FAQ

---

### Partners `/partners`
**Goal:** Convert co-producers, distributors, and operators.

**4 sections matching the homepage partner cards, each expanded:**
- Co-Producers: What you bring / What you get / CTA
- Financiers: Same structure
- Distribution Partners: Same
- Operational Partners: Same

---

## SEO Strategy

**Primary keywords:**
- venture studio film
- filmmaker equity
- independent film investment
- creator-owned cinema
- film SPV structure
- entertainment venture capital

**Technical SEO (Next.js):**
- Dynamic `<meta>` tags per page via App Router metadata API
- OpenGraph images auto-generated or custom per page
- Structured data (Organization, Person for Amanda, CreativeWork for ventures)
- Sitemap.xml auto-generated
- robots.txt configured
- Canonical URLs set

---

## Component Architecture

All components live in `/components/`. Suggested organization:

```
components/
├── layout/
│   ├── Header.tsx          # Nav + logo + CTA button
│   ├── Footer.tsx          # Links + socials + legal
│   └── PageWrapper.tsx     # Consistent padding/max-width
├── sections/
│   ├── HeroSection.tsx
│   ├── ProblemStatement.tsx
│   ├── VentureModelDiagram.tsx
│   ├── PortfolioGrid.tsx
│   ├── MetricsCounter.tsx
│   ├── PartnerCards.tsx
│   ├── FounderQuote.tsx
│   ├── CTABar.tsx
│   ├── TeamGrid.tsx
│   └── FAQAccordion.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   └── Modal.tsx
└── blog/
    ├── ArticleCard.tsx
    ├── ArticleGrid.tsx
    └── ArticleContent.tsx
```
