# RAVOK Studios — Brand Guidelines & Design System
## For ravokstudios.com / Next.js 16 + Laravel 12

---

## 1. Brand Overview

RAVOK Studios is an LA-based venture studio turning filmmakers into founders. The visual identity communicates cinematic authority, technological sophistication, and classical permanence — positioning RAVOK as the institution that will restructure entertainment's financial architecture.

The brand voice is confident, direct, and editorial. Not corporate. Not startup-cute. The visual language says: "This has always existed. You're just discovering it."

---

## 2. Core Aesthetic Principles

**Dark mode default.** Warm dark backgrounds, never pure black. Light mode available as a toggle but dark is the primary experience.

**Wireframe sculpture illustrations.** The signature RAVOK visual. Classical Greek/Roman statuary rendered as thin-line 3D mesh wireframes. These represent the intersection of ancient permanence and modern technology — old Hollywood reborn through new infrastructure.

**Gold accents.** Used sparingly for emphasis, interactive elements, and lighting effects. Gold = value, premium, authority.

**Newspaper clipping style.** Editorial text elements styled as scattered, slightly rotated, bordered text blocks. This references the industry press (Variety, THR, Deadline) and positions RAVOK within the conversation Hollywood is already having.

**Ambient background grid.** A faint, large-cell grid sits behind all pages — reminiscent of architectural blueprints and 3D modeling wireframes. Separate from the illustration wireframes.

---

## 3. Color System

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#1c1c1a` | Primary background — warm dark, slightly brown undertone |
| `--bg-deeper` | `#0d0d0b` | Deep sections, footer, modal overlays |
| `--bg-surface` | `#242420` | Cards, elevated surfaces, input fields |
| `--text-primary` | `#e8e4dc` | Headlines, body text — warm off-white |
| `--text-secondary` | `rgba(232,228,218,0.6)` | Supporting text, descriptions |
| `--text-muted` | `rgba(232,228,218,0.4)` | Labels, captions, metadata |
| `--text-faint` | `rgba(232,228,218,0.2)` | Watermarks, disabled states |
| `--accent-gold` | `#c4953a` | CTAs, active states, highlights, lighting effects |
| `--accent-gold-hover` | `#d4a54a` | Hover state for gold elements |
| `--accent-gold-muted` | `rgba(196,149,58,0.15)` | Gold backgrounds, subtle highlights |
| `--border` | `rgba(232,228,218,0.08)` | Dividers, card borders, separators |
| `--border-strong` | `rgba(232,228,218,0.15)` | Active borders, focused inputs |

### Wireframe Line Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--wireframe-line` | `rgba(235,231,220,0.3)` | Standard illustration wireframe lines |
| `--wireframe-dense` | `rgba(235,231,220,0.45)` | Dense detail areas (eyes, hands, face features) |
| `--wireframe-sparse` | `rgba(235,231,220,0.12)` | Sparse areas (fabric, large flat surfaces) |
| `--wireframe-hair` | `rgba(235,231,220,0.2)` | Hair curl spirals (slightly lighter than body) |
| `--wireframe-glow` | `rgba(235,231,220,0.04)` | Soft bloom/glow around figure edges |
| `--grid-line` | `rgba(255,255,255,0.025)` | Background architectural grid |
| `--grid-line-strong` | `rgba(255,255,255,0.04)` | Emphasized grid lines (every 5th line) |

### Lighting & Atmosphere

| Token | Value | Usage |
|-------|-------|-------|
| `--glow-gold` | `rgba(196,149,58,0.03)` | Warm gold radial glow (top-left lighting) |
| `--glow-gold-strong` | `rgba(196,149,58,0.08)` | Stronger gold spotlight for hero sections |
| `--glow-white` | `rgba(235,231,220,0.015)` | Subtle white ambient fill light |
| `--vignette` | `rgba(0,0,0,0.4)` | Edge darkening / vignette corners |

### Usage Rules
- Never use pure black (`#000000`) — always warm dark (`#1c1c1a` minimum)
- Never use pure white (`#ffffff`) — always warm off-white (`#e8e4dc`)
- Gold is an accent, never a background fill (except at very low opacity for glows)
- Text on dark backgrounds must maintain WCAG AA contrast ratio minimum

---

## 4. Typography

### Font Stack

| Element | Primary Font | Weight | Style | Web Fallback |
|---------|-------------|--------|-------|--------------|
| Headlines (H1-H2) | ITC Baskerville | 400 | italic or normal | Libre Baskerville, Baskervville, Georgia, serif |
| Sub-headlines (H3-H4) | ITC Baskerville | 400 | normal | Libre Baskerville, Georgia, serif |
| Body text | Coco Gothic | 400 | normal | Montserrat, Raleway, sans-serif |
| UI labels / navigation | Coco Gothic | 500-600 | uppercase, letter-spacing: 2-3px | Montserrat, sans-serif |
| Clipping quotes | ITC Baskerville | 400 | italic | Libre Baskerville, Georgia, serif |
| Data / numbers | Coco Gothic | 700 | normal | Montserrat, sans-serif |
| Code / technical | JetBrains Mono | 400 | normal | Fira Code, monospace |

### Font Licensing
- **ITC Baskerville** — licensed font, available in Canva Pro font library. For web: purchase web license from MyFonts or Adobe Fonts, or use Libre Baskerville (free Google Font, closest match).
- **Coco Gothic** — licensed font. For web: purchase web license, or use Montserrat (free Google Font, similar geometric sans-serif).
- Self-host all fonts as WOFF2 in `/public/fonts/` for performance. No external font service dependencies.

### Type Scale

| Level | Size | Line Height | Letter Spacing | Font |
|-------|------|-------------|----------------|------|
| Display | 72-96px | 1.0 | -0.02em | ITC Baskerville |
| H1 | 48-64px | 1.1 | -0.01em | ITC Baskerville |
| H2 | 36-48px | 1.15 | 0 | ITC Baskerville |
| H3 | 24-32px | 1.2 | 0 | ITC Baskerville |
| H4 | 18-24px | 1.3 | 0.01em | ITC Baskerville |
| Body | 16-18px | 1.6 | 0 | Coco Gothic |
| Small | 13-14px | 1.5 | 0.01em | Coco Gothic |
| Caption | 10-12px | 1.4 | 0.05em | Coco Gothic uppercase |
| Label | 9-10px | 1.3 | 0.15em | Coco Gothic uppercase |

---

## 5. Wireframe Illustration System

### Amanda's Production Workflow
1. Find or AI-generate a rendered classical statue/figure (Pinterest, Midjourney, stock)
2. Run through OpenArt AI with wireframe LoRA/style reference
3. Output: thin-line mesh wireframe on dark background
4. Place in Canva designs, export as PNG for website

### Wireframe Style Rules (extracted from 12 reference images)

**Line characteristics:**
- Weight: 0.3–0.5px (extremely thin, almost fragile)
- Color: white/off-white on dark background, never colored
- No fill — lines only, interior is transparent/dark

**Mesh topology:**
- Lines follow the 3D form like a UV unwrap — contour lines wrap around the surface
- Horizontal contour rings define the form's silhouette at each height
- Vertical meridian lines create the cross-mesh structure
- Lines converge at edges and inflection points

**Depth through density:**
- **Dense areas** (face, hands, hair, detailed accessories): many closely-spaced lines, creating visual "shadow"
- **Sparse areas** (chest, shoulders, flat drapery, background): fewer, wider-spaced lines, creating visual "highlight"
- This inverts traditional shading — more lines = darker/more detailed, fewer lines = lighter/simpler

**Hair rendering:**
- Never grid-based — always flowing organic spiral curves
- Each curl is a multi-turn spiral following the hair's direction
- Individual strands connect curls with flowing lines
- Creates a distinctly different texture from the body's grid mesh

**Accessories:**
- Objects held by figures (sunglasses, megaphone, coffee cup, money, clapperboard, film camera) rendered in the same wireframe style
- Geometric objects (cameras, clapperboards) use rectangular/cylindrical mesh grids
- Organic objects (fabric, smoke, hair) use flowing contour lines

**Background grid:**
- Separate layer from figure wireframe
- Larger squares (~40-50px cells), very faint (`rgba(255,255,255,0.025)`)
- Even spacing, no density variation
- Continues behind the figure (figure is transparent, grid shows through)

**Glow/bloom:**
- Subtle luminous edge around figure silhouette
- Not a hard outline — soft radial glow that fades
- Creates the feeling of the figure emitting light

**Shattered/fragmented variants:**
- Some figures have breaking/shattering effect
- Geometric shards break off with their own internal mesh topology
- Creates tension between permanence (classical form) and disruption (shattering)

### Reference Image Library (12 source images)

| Image | Subject | Key Features |
|-------|---------|-------------|
| Film clapperboard | RAVOK Studios clapperboard | Text integrated into wireframe, geometric mesh, slight rotation |
| Greek temple facade | "ABOUT US" temple entrance | Ionic columns, pediment with figure, architectural detail |
| Gallery of women | 3 classical female figures in gallery | Full-body wireframe, draped fabric, pedestals, warm gold lighting |
| Shattering David (bust) | Male bust breaking apart | Dense facial mesh, geometric shards, dramatic composition |
| Split-face bust | Two-faced classical head | Dense face mesh, flowing hair, organic disintegration |
| David drinking coffee | Classical bust with coffee cup | Accessories in wireframe style, steam rendered as thin lines |
| Rendered split bust | Full-render marble (pre-wireframe source) | Shows the before-state of wireframe conversion |
| Rendered David w/ coffee | Full-render marble (pre-wireframe source) | Source image before OpenArt conversion |
| Perseus with Medusa | Figure holding severed head | Full-body wireframe, dramatic pose, flowing fabric |
| David with measurements | Male torso with dimension lines | Architectural measurement overlay, technical drawing feel |
| Figure with megaphone | Shouting figure | Dynamic pose, open mouth, megaphone as geometric wireframe |
| Figure with money & sunglasses | Bearded figure in toga | Accessories (sunglasses, money) in wireframe, relaxed pose |

---

## 6. Rendering Stack (4 Code Languages)

The website uses 4 JavaScript rendering languages, layered in the browser DOM like Photoshop layers. Each handles a specific visual responsibility.

### Layer Architecture

```
┌─────────────────────────────────────────────────┐
│  Three.js — Top layer                           │
│  3D sculptures, wireframe→rendered hover reveal  │
├─────────────────────────────────────────────────┤
│  Content layer — Canva exports + HTML            │
│  Page images, text overlays, dynamic sections    │
├─────────────────────────────────────────────────┤
│  Canvas API — Illustrator layer                  │
│  New wireframe drawings, traced illustrations    │
├─────────────────────────────────────────────────┤
│  p5.js — Atmosphere layer                        │
│  Particles, pulsing glows, breathing textures    │
├─────────────────────────────────────────────────┤
│  SVG — Bottom layer (lighting rig)               │
│  Background grid, radial glows, vignettes        │
└─────────────────────────────────────────────────┘
```

### Layer Detail

| Layer | Language | Role | What It Handles |
|-------|----------|------|-----------------|
| Bottom | **SVG** | Lighting rig | Background grid lines, radial gold glows, vignettes, gradient overlays, warm spotlights |
| Lower-mid | **p5.js** | Atmosphere | Living particle dust, pulsing glows, breathing textures, floating organic motion |
| Upper-mid | **Canvas API** | Illustrator | Draw NEW wireframe elements that don't exist as images yet. For geometric objects: draw from scratch. For complex figures: trace over reference images using edge detection. |
| Top | **Three.js** | Sculptor | Wireframe → rendered sculpture reveal on hover, 3D objects that respond to mouse/scroll, real lighting and shadow |

### Canvas API Illustration Strategy

**Create from scratch:**
- Geometric objects in wireframe style (columns, pedestals, film reels, clapperboards)
- Abstract wireframe patterns and textures as decorative elements
- Wireframe borders, dividers, frame elements between page sections
- Ambient mesh patterns that extend the visual language

**Trace over reference images (for complex forms):**
- Load a rendered statue image as hidden reference
- Run edge detection (Canny/Sobel algorithm) on the pixel data
- Draw thin contour lines following detected edges
- Remove reference image, keep only the wireframe lines
- This mirrors Amanda's OpenArt workflow but in code

**Leave to Amanda's OpenArt pipeline:**
- Hero sculptures (big statement pieces per page)
- Complex organic forms (draped fabric, flowing hair, smoke, shattered fragments)
- Any illustration that needs to feel "artist-made" rather than algorithmic
- These export as PNGs and are placed via the Canvas Bridge pipeline

---

## 7. Component Design Patterns

### Cards (Confessions, Blog Posts, Portfolio Items)

- Background: transparent or `--bg-surface` at low opacity
- Border: hand-drawn feel using Rough.js or thin solid `--border`
- No fill — content readable against the dark background
- Slight rotation (-2° to +2°) for newspaper clipping feel on editorial cards
- Varied sizes for visual rhythm (not a uniform grid)
- Hover: subtle gold glow or border brighten

### Buttons

- Primary: `--accent-gold` text on transparent background with gold border
- Hover: gold fills the background, text goes dark
- Text: Coco Gothic uppercase, letter-spacing: 2-3px
- No rounded corners — squared or very slight radius (2-3px)
- Subtle `text-shadow` glow on hover

### Navigation

- Fixed top bar, transparent background with subtle backdrop-blur
- Logo left, links right (Coco Gothic uppercase, tracked wide)
- Active state: gold underline or gold text color
- Mobile: full-screen overlay with stacked links

### Forms (Confession submission, Contact, Investor login)

- Dark input fields (`--bg-surface`) with thin `--border` borders
- Placeholder text in `--text-muted`
- Focus state: border becomes `--accent-gold`
- Labels: Coco Gothic uppercase, small, tracked

### Section Transitions

- Between Canva-designed sections and code sections: gradient blend using `--bg-dark` to smooth the seam
- p5.js atmosphere layer runs continuously across ALL sections (designed and coded) for visual continuity
- SVG radial glows extend from designed sections into code sections

---

## 8. Page Structure (from Q2 Investor Deck)

### Canva Design ID: `DAHFjWIOFu0` (11 pages, 1920×1080 each)

| Deck Page | Website Route | Section | Content |
|-----------|--------------|---------|---------|
| 1 | `/` | Hero | RAVOK logo, tagline, wireframe sculptures, contact info |
| 2 | `/` | Problem | "Film is historically uninvestable" + press clippings |
| 3 | `/` | Market | $2.9T TAM → $362B SAM → $50M SOM nested circles |
| 4 | `/` | Why Now | 3 pillars: consolidation, audience shift, AI validation |
| 5 | `/model` | Comparison | Old model vs RAVOK model side-by-side |
| 6 | `/model` | Portfolio | Venture studio structure, Film SPVs, Meris, Phema, Delphi AI |
| 7 | `/about` | Traction | One year of progress across 4 verticals |
| 8 | `/about` | Roadmap | Year 1-2-3 visual timeline |
| 9 | `/about` | Team | Amanda, Thibault, Lois, Pye — photos + bios |
| 10 | `/invest` | The Ask | $1M pre-seed breakdown with donut chart |
| 11 | `/` | Closing | RAVOK Studios logo + contact info |

### Dynamic Sections (code-only, not from Canva)
- Hollywood Confessions feed — after Problem or Why Now section
- Investor portal login — `/portal` route
- Contact form — footer or `/contact` route
- Newsletter/digest signup — integrated into Confessions
- Blog/content engine — `/blog` route

---

## 9. Canva Websites Limitation & Solutions

### The Core Problem
Amanda designs in Canva. Canva Websites can only host on Canva's servers — no code export, no Vercel deployment, no database, no dynamic content.

### Solution A: Canvas Bridge MCP (preferred)
Full pipeline: Canva design → export pages as PNG → extract text with positions → generate Next.js page → push to GitHub → Vercel auto-deploys. See `canvas-bridge-spec.md` for full technical specification.

### Solution B: Subdomain Split (fallback)
- `ravokstudios.com` → Canva Website (static brand pages, Canva hosts)
- `app.ravokstudios.com` → Next.js on Vercel (investor portal, confessions, dynamic features)
- Ships faster but splits SEO and domain authority

### Solution C: Makeswift (under evaluation)
- Visual drag-and-drop editor that integrates directly into the existing Next.js app
- Claude Code builds custom React components → Amanda visually arranges them in Makeswift's editor
- Deploys on Vercel through the existing repo
- Already installed on Vercel at `vercel.com/ravokstudios/~/integrations/makeswift`
- Requires evaluation: is the visual editor intuitive enough compared to Canva?

---

## 10. Existing MCP Repos (Canva Ecosystem)

| Repo | What It Does | Limitation |
|------|-------------|-----------|
| `mattcoatsworth/canva-mcp-server` | Wraps Canva API — design, brand, asset, user management tools (`get_design`, `list_designs`, `get_asset`, `list_assets`, `upload_image`). Claims complete API endpoint coverage. | API wrapper only. No code generation, no layout reconstruction, no GitHub push, no deployment. |
| `universal-mcp/canva` | Standardized Canva MCP on Universal MCP framework. | Same limitation — no Next.js generation, no deployment features. |
| Canva's official MCP (connected in Claude) | Full API access including editing transactions, export, text/image read/write. | Can read/write designs but has no deployment pipeline. Useful for prototyping the Canvas Bridge. |

**What doesn't exist yet:** A tool that reads a Canva design and generates deployable website code. This is the Canvas Bridge.

---

## 11. File Deliverables from This Session

| File | Path | Description |
|------|------|-------------|
| Canvas Bridge Spec | `/mnt/user-data/outputs/canvas-bridge-spec.md` | Full MCP server spec: pipeline, tools, API mapping, build plan |
| Brand Guidelines (this doc) | `/mnt/user-data/outputs/ravok-brand-guidelines.md` | Complete brand identity, design system, rendering stack |
| 4-Language Comparison | `/mnt/user-data/outputs/ravok-4-languages.jsx` | Interactive React artifact comparing SVG, Canvas API, Three.js, p5.js |
| Wireframe Attempt v1 | `/mnt/user-data/outputs/ravok-wireframe-attempt.jsx` | First Canvas API wireframe attempt (basic) |
| Wireframe Attempt v2 | `/mnt/user-data/outputs/ravok-wireframe-v2.jsx` | Second attempt with more density |
| Wireframe Attempt v3 | `/mnt/user-data/outputs/ravok-wireframe-v3.jsx` | Third attempt — most lines, closest to style |
| Master Plan ZIP (prior session) | `/mnt/user-data/outputs/ravok-master-plan.zip` | 13-file knowledge base — needs update with today's decisions |

---

## 12. Decisions Made This Session

| Decision | Detail |
|----------|--------|
| Dark mode default | Light mode as toggle only |
| Rendering stack | SVG (lighting) + p5.js (atmosphere) + Canvas API (illustration) + Three.js (3D sculpture) |
| Canvas API illustration strategy | Trace over reference images for complex forms, draw from scratch for geometric objects |
| Hero sculptures stay in OpenArt | Anatomical complexity too high for code-generated wireframes |
| Fonts confirmed | ITC Baskerville (headings), Coco Gothic (body text) |
| Canva Websites can't deploy to Vercel | Canva hosts only — no code export |
| Canvas Bridge MCP is the solution | Design in Canva → export → generate Next.js → push to GitHub → Vercel deploys |
| Makeswift under evaluation | Already integrated on Vercel, may eliminate need for Canvas Bridge if editor is intuitive enough |
| Existing Canva MCPs are API wrappers only | Neither generates code or deploys — Canvas Bridge is new ground |

---

## 13. Open Questions

- [ ] Does Amanda have web licenses for ITC Baskerville and Coco Gothic, or should we use Libre Baskerville + Montserrat as fallbacks?
- [ ] Should the background grid animate (subtle parallax on scroll) or remain static?
- [ ] What's the hover reveal behavior? Wireframe → full render on the sculpture itself, or on a card/button containing the sculpture?
- [ ] Should the p5.js particle layer respond to mouse movement (particles scatter from cursor)?
- [ ] Makeswift evaluation: spend 30 minutes testing the editor to see if it replaces the need for Canvas Bridge
- [ ] Should Canvas Bridge be built as an open-source project (tech venture potential) or internal tool only?
