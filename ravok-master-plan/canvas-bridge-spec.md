# RAVOK Canvas Bridge — Project Spec
## Canva Design → Next.js → Vercel Deployment Pipeline

### The Problem

Amanda designs in Canva. Her site runs on Next.js deployed to Vercel. No tool exists that takes a Canva design and turns it into a deployable Next.js page. Existing Canva MCP servers (`mattcoatsworth/canva-mcp-server`, `universal-mcp/canva`) are API wrappers — they can read/write Canva data but don't generate code, don't touch GitHub, and don't deploy anything.

### What This Tool Does

Takes a Canva design ID → extracts layout, text, and images → generates a Next.js page → pushes to GitHub → Vercel auto-deploys. Amanda designs in Canva, runs one command, and her website updates.

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌────────┐
│              │     │                  │     │              │     │        │
│  Canva API   │────→│  Canvas Bridge   │────→│   GitHub     │────→│ Vercel │
│  (MCP/REST)  │     │  (MCP Server)    │     │   Push       │     │ Deploy │
│              │     │                  │     │              │     │        │
└──────────────┘     └──────────────────┘     └──────────────┘     └────────┘
                            │
                     What it does:
                     1. Read design structure
                     2. Export pages as PNGs
                     3. Extract text + positions
                     4. Generate Next.js page
                     5. Push to repo
```

---

## Pipeline Steps (Detail)

### Step 1: Read Design
- Input: Canva design ID (e.g., `DAHFjWIOFu0`)
- Use Canva Connect API to:
  - `GET /designs/{id}` — metadata, page count, dimensions
  - Start editing transaction → get all richtexts (text content + positions + dimensions) and fills (images + positions)
  - Cancel transaction (read-only)
- Output: JSON structure of every element on every page

### Step 2: Export Page Images
- Use Canva Connect API: `POST /designs/{id}/exports`
- Export each page as high-res PNG (1920px wide or 2x for retina)
- Option: transparent background where possible
- Download exported PNGs to local/temp storage
- Output: PNG file per page

### Step 3: Extract Text Overlay Map
- From Step 1 data, build a map of every text element:
```json
{
  "page": 1,
  "element_id": "PBK4TFR8JkqS0DRY-LBQvljsZ45SpHGTf",
  "text": "Film is historically uninvestable.",
  "position": { "top": 108, "left": 108 },
  "dimensions": { "width": 1061, "height": 323 },
  "links": [],
  "formatting": { "font_size": null, "font_weight": null }
}
```
- Flag which text elements should be rendered as real HTML (for SEO, accessibility, and dynamic content) vs which can remain in the image (decorative text, small labels)
- Heuristic: text elements larger than 20px → HTML overlay. Smaller → leave in image.

### Step 4: Generate Next.js Page
- For each Canva page, generate a React component:
```tsx
// app/(public)/page.tsx (homepage example)
export default function HomePage() {
  return (
    <div className="relative">
      {/* Section 1: Hero — from Canva page 1 */}
      <section className="relative w-full" style={{ aspectRatio: '1920/1080' }}>
        <Image
          src="/canva-exports/page-1.png"
          alt="RAVOK - The Venture Studio for Entertainment"
          fill
          className="object-cover"
          priority
        />
        {/* Text overlay — real HTML for SEO */}
        <div
          className="absolute"
          style={{ top: '58%', left: '6.3%', width: '47%' }}
        >
          <h1 className="text-white text-4xl font-serif">
            The Venture Studio for entertainment
          </h1>
        </div>
      </section>

      {/* Section 2: Problem — from Canva page 2 */}
      <section className="relative w-full" style={{ aspectRatio: '1920/1080' }}>
        <Image
          src="/canva-exports/page-2.png"
          alt="Film is historically uninvestable"
          fill
          className="object-cover"
        />
        <div
          className="absolute"
          style={{ top: '10%', left: '5.6%', width: '55%' }}
        >
          <h2 className="text-white text-5xl font-serif">
            Film is historically uninvestable.
          </h2>
        </div>
      </section>

      {/* Dynamic sections — not from Canva */}
      <ConfessionsFeed />
      <InvestorCTA />
    </div>
  );
}
```

### Step 5: Handle Dynamic Sections
- Some page sections are dynamic (confessions feed, contact form, investor login)
- These get stub components that Claude Code fills with real functionality
- The bridge marks these as `<!-- DYNAMIC: confessions_feed -->` or similar
- Config file maps Canva pages to route: page 1 → homepage hero, page 2 → homepage problem, page 5 → /model, etc.

### Step 6: Push to GitHub
- Copy exported PNGs to `public/canva-exports/`
- Write generated page components to `app/` directory
- Git add, commit, push to `dev` branch
- Vercel auto-deploys preview from `dev`
- Amanda reviews → merge to `main` → production deploy

---

## MCP Server Specification

### Server Info
- Name: `canvas-bridge`
- Transport: stdio (local) or SSE (remote)
- Language: TypeScript (Node.js)
- Dependencies: Canva Connect API SDK, Octokit (GitHub API), sharp (image processing)

### Tools Exposed

#### `canvas_bridge_preview`
Preview what the bridge will generate without deploying.
- Input: `{ design_id: string, pages?: number[] }`
- Output: Generated component code + text overlay map
- No side effects — read only

#### `canvas_bridge_deploy`
Full pipeline: read design → export → generate → push → deploy.
- Input:
```json
{
  "design_id": "DAHFjWIOFu0",
  "repo": "techravokstudios/ravok-website",
  "branch": "dev",
  "page_mapping": {
    "1": { "route": "/", "section": "hero" },
    "2": { "route": "/", "section": "problem" },
    "3": { "route": "/", "section": "market" },
    "4": { "route": "/", "section": "why-now" },
    "5": { "route": "/model", "section": "comparison" },
    "6": { "route": "/model", "section": "portfolio" },
    "7": { "route": "/about", "section": "traction" },
    "8": { "route": "/about", "section": "roadmap" },
    "9": { "route": "/about", "section": "team" }
  },
  "dynamic_sections": [
    { "after_page": 4, "component": "ConfessionsFeed" },
    { "after_page": 6, "component": "InvestorCTA" },
    { "after_page": 9, "component": "ContactForm" }
  ]
}
```
- Output: GitHub commit URL, Vercel preview URL

#### `canvas_bridge_sync`
Re-sync after Amanda edits the Canva design. Only re-exports changed pages.
- Input: `{ design_id: string, repo: string }`
- Compares current export hashes vs stored hashes
- Only re-exports and pushes pages that changed
- Output: List of updated pages, new commit URL

#### `canvas_bridge_config`
Set up the page mapping and dynamic section configuration.
- Input: Config object (as shown above)
- Stores in `ravok-master-plan/canvas-bridge-config.json` in the repo

---

## What the API Gives Us vs What We Need

| Data Point | Available from Canva API? | How We Handle It |
|-----------|--------------------------|-----------------|
| Text content | Yes — full text with positions | Extract → HTML overlay |
| Text formatting (size, weight, style) | Partial — no font family | Use closest web font match |
| Image assets | Yes — asset IDs, can export | Export page as PNG captures everything |
| Element positions (x, y) | Yes — pixel coordinates | Convert to percentage-based CSS positioning |
| Element dimensions | Yes — width, height in px | Convert to responsive units |
| Page backgrounds | Captured in PNG export | PNG IS the background |
| Gradients, shadows, effects | NOT in API | Captured in PNG export |
| Animations | NOT available | Add manually in code |
| Links/URLs on text | Yes — in formatting data | Apply to HTML overlay text |
| Rotation | NOT in API | Captured in PNG but not on overlaid text |
| Z-index/layering | Implicit in API order | PNG handles this, overlays go on top |

### The Key Insight
The PNG export captures 100% of the visual design — every gradient, shadow, texture, rotation, and effect. The API data lets us overlay real HTML text for SEO and interactivity. This hybrid approach means we don't need to reconstruct the design in CSS. The image IS the design. Code adds what images can't do (links, forms, dynamic content, SEO).

---

## Known Limitations

1. **Text in images isn't selectable/searchable** unless overlaid with HTML. The bridge auto-overlays large text but small labels stay in the image.
2. **Responsive behavior** — Canva designs are fixed-dimension (1920x1080). The bridge scales them proportionally but they won't reflow like native responsive layouts. For mobile, Amanda may need to design a separate mobile version in Canva, or we apply CSS adjustments.
3. **Page load** — Full-page PNGs are heavy. We use Next.js Image optimization (WebP, lazy loading, responsive sizes) to mitigate. Target: <500KB per section image after optimization.
4. **Dynamic content** — Can't be designed in Canva. The confessions feed, contact form, investor portal are code-only sections inserted between Canva-designed sections.
5. **Editing flow** — Changes in Canva require re-running the bridge. It's not real-time. But `canvas_bridge_sync` makes it a one-command update.

---

## Build Plan

### Phase 1: Core Pipeline (1-2 weeks in Claude Code)
- [ ] Set up MCP server boilerplate (TypeScript, stdio transport)
- [ ] Implement Canva API client (OAuth2 flow, design read, export)
- [ ] Build page export pipeline (PNG download + optimization with sharp)
- [ ] Build text extraction + overlay map generation
- [ ] Build Next.js component generator (template-based)
- [ ] Test with Amanda's Q2 deck (design ID: DAHFjWIOFu0)

### Phase 2: GitHub Integration (3-5 days)
- [ ] Implement Octokit client for GitHub push
- [ ] Build branch management (always push to dev, never main)
- [ ] Implement file diffing (only push changed pages)
- [ ] Test full pipeline: Canva → GitHub → Vercel preview

### Phase 3: Sync + Config (3-5 days)
- [ ] Build `canvas_bridge_sync` for incremental updates
- [ ] Build `canvas_bridge_config` for page mapping
- [ ] Add mobile breakpoint handling
- [ ] Build CLI wrapper for non-MCP usage

### Phase 4: Polish (1 week)
- [ ] Image optimization pipeline (WebP, srcset, lazy loading)
- [ ] SEO metadata extraction (use text content for meta tags)
- [ ] Error handling, retry logic, rate limiting
- [ ] Documentation + setup guide

**Total estimated build time: 3-4 weeks with Claude Code.**

---

## How Amanda Uses It

### First Time Setup:
1. Clone the bridge repo
2. Connect Canva account (OAuth2)
3. Connect GitHub account (token)
4. Run `canvas_bridge_config` to map Canva pages to website routes

### Design → Deploy Workflow:
1. Amanda designs/edits pages in Canva (her normal workflow)
2. Amanda runs: `canvas_bridge_deploy --design DAHFjWIOFu0`
3. Bridge exports all pages, generates code, pushes to GitHub
4. Vercel auto-deploys a preview
5. Amanda reviews at preview URL
6. If happy → merge dev to main → live at ravokstudios.com

### Quick Update:
1. Amanda changes one slide in Canva
2. Runs: `canvas_bridge_sync`
3. Only that page re-exports and updates
4. Live in ~2 minutes

---

## Existing Tools We Can Build On

| Repo | What It Does | How We Use It |
|------|-------------|---------------|
| `mattcoatsworth/canva-mcp-server` | Wraps Canva API | Reference implementation for auth flow and API patterns |
| `universal-mcp/canva` | Standardized Canva MCP | Possible base to extend rather than build from scratch |
| Canva's official MCP (already connected) | Full API access in Claude | Use directly for prototyping before building standalone server |
| Vercel MCP (already connected) | Deployment management | Can trigger deploys, check status from within Claude |

### Build vs Extend Decision:
**Recommend: Build from scratch** using the existing repos as reference. The core logic (design → code generation → deploy) doesn't exist in any of them. The Canva API wrapper part is the easy part — the code generation pipeline is where the real work is.

---

## Alternative: Canva Websites + Subdomain Split

If the bridge proves too complex for v1, the fallback is:
- ravokstudios.com → Canva Website (Amanda designs, Canva hosts, custom domain)
- app.ravokstudios.com → Next.js on Vercel (investor portal, confessions, dynamic features)
- This ships faster but splits the domain and limits SEO

**The bridge is the better long-term solution because it keeps everything on one domain, one codebase, one deployment.**

---

---

## Brand Identity & Visual Language

### Core Aesthetic
- **Dark mode default** — warm dark backgrounds (#1c1c1a to #0d0d0b), never pure black
- **Wireframe sculpture illustrations** — the signature RAVOK visual
- **Gold accents** (#c4953a) — used sparingly for emphasis, buttons, and lighting effects
- **Off-white text** (#e8e4dc / #ebe7dc) — warm, not clinical white
- **Serif headlines** (Georgia or equivalent) — editorial, cinematic authority
- **Sans-serif UI chrome** (Inter or equivalent) — clean functional elements
- **Newspaper clipping style** for editorial content — scattered, slightly rotated, bordered text blocks
- **Background grid** — faint, large-cell grid behind all pages, separate from illustration wireframes

### Wireframe Illustration Style (from 12 reference images)

Amanda's workflow: Find/generate a rendered statue or classical figure → run through OpenArt AI with wireframe LoRA → produces the RAVOK wireframe aesthetic.

**Style rules:**
- Lines are white/off-white on dark background, weight 0.3–0.5px (extremely thin)
- Lines follow 3D mesh topology like a UV unwrap — contour lines wrap around the form
- **Density creates depth** — dense lines = shadow/detail areas, sparse lines = highlighted/flat surfaces
- Hair rendered as flowing organic spiral curves, never as grid
- Background grid is separate from figure mesh (larger squares, even spacing, very faint)
- Subtle glow/bloom around figure edges — luminous, not sharp cutouts
- Accessories rendered in same wireframe style (sunglasses, megaphone, coffee cup, money, clapperboard)
- Shattered/fragmented variants have geometric shards breaking off with their own internal mesh

**Source images include:** David drinking coffee, split-face bust, Perseus holding Medusa's head, figure with megaphone, figure holding money with sunglasses, Greek temple facade, film clapperboard, gallery of female figures in draped clothing, David with architectural measurements

### Rendering Stack (4 Languages)

Each code language handles a specific visual layer. They stack in the browser DOM like Photoshop layers:

| Layer | Language | Role | What It Handles |
|-------|----------|------|-----------------|
| Bottom | **SVG** | Lighting rig | Background grid lines, radial glows, vignettes, gradient overlays, warm gold spotlights |
| Middle | **p5.js** | Atmosphere | Living particle dust, pulsing glows, breathing textures, floating animation, organic motion |
| Content | **Canvas API** | Illustrator | Draw NEW wireframe elements not yet created — geometric objects, patterns, textures, decorative accents. For complex illustrations: **trace over reference images** using edge detection rather than freehand drawing |
| Top | **Three.js** | Sculptor | Wireframe → rendered sculpture reveal on hover, 3D objects that respond to mouse, real lighting and shadow |

### Canvas API Illustration Strategy

**What Canvas API should create from scratch:**
- Geometric objects in wireframe style (columns, pedestals, film reels, clapperboards, geometric shapes)
- Abstract wireframe patterns and textures as background/decorative elements
- Wireframe borders, dividers, and frame elements between sections
- Ambient mesh patterns that extend the visual language

**What Canvas API should TRACE over reference images:**
- Human figures, faces, anatomy — too complex to freehand convincingly
- Workflow: load a rendered statue image as hidden reference → run edge detection (Canny/Sobel) → draw thin contour lines following detected edges → remove reference, keep only wireframe lines
- This mirrors Amanda's OpenArt workflow but in code — the image provides the form, code adds the wireframe lines

**What should stay in Amanda's OpenArt pipeline:**
- Hero sculptures (the big statement pieces on main pages)
- Complex organic forms (draped fabric, smoke, shattered fragments, hair detail)
- Any illustration that needs to feel "artist-made" rather than algorithmic
- These get exported as PNGs and placed via the Canvas Bridge

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | #1c1c1a | Primary background (warm dark) |
| `--bg-deeper` | #0d0d0b | Deep sections, footer |
| `--text-primary` | #e8e4dc | Body text, headlines |
| `--text-muted` | rgba(232,228,218,0.4) | Secondary text, labels |
| `--accent-gold` | #c4953a | CTAs, highlights, lighting effects |
| `--grid-line` | rgba(255,255,255,0.03) | Background grid |
| `--wireframe-line` | rgba(235,231,220,0.3) | Illustration wireframe lines |
| `--wireframe-dense` | rgba(235,231,220,0.45) | Dense detail areas (eyes, hands) |
| `--wireframe-sparse` | rgba(235,231,220,0.12) | Sparse areas (fabric, backgrounds) |
| `--glow` | rgba(235,231,220,0.04) | Subtle figure glow/bloom |

### Typography

| Element | Font | Weight | Style | Web Fallback |
|---------|------|--------|-------|-------------|
| Headlines (H1-H2) | ITC Baskerville | 400 | italic or normal | Libre Baskerville, Baskervville, Georgia, serif |
| Sub-headlines (H3-H4) | ITC Baskerville | 400 | normal | Libre Baskerville, Georgia, serif |
| Body text | Coco Gothic | 400 | normal | Montserrat, Raleway, sans-serif |
| UI labels / navigation | Coco Gothic | 500-600 | uppercase, letter-spacing: 2-3px | Montserrat, sans-serif |
| Clipping quotes | ITC Baskerville | 400 | italic | Libre Baskerville, Georgia, serif |
| Data / numbers | Coco Gothic | 700 | normal | Montserrat, sans-serif |

**Font loading notes:**
- ITC Baskerville is a licensed font (not on Google Fonts). Options: purchase web license from MyFonts/Adobe Fonts, or use Libre Baskerville (free, close match) as the web version.
- Coco Gothic is a licensed font. Options: purchase web license, or use Montserrat (free, similar geometric sans-serif feel) as the web fallback.
- Both fonts should be self-hosted as WOFF2 files in `/public/fonts/` for best performance. No external font service dependencies.

### Dynamic Section Styling

For code-only sections (confessions feed, forms, interactive elements) that sit between Canva-designed sections:

- Match the warm dark background (#1c1c1a)
- Use CSS `text-shadow`, `filter: drop-shadow()`, and `backdrop-filter` to approximate the surrounding lighting atmosphere
- Use gradient blends at section boundaries to smooth the transition from image sections to code sections
- p5.js particle atmosphere layer runs continuously behind everything, including code sections, creating visual continuity
- SVG radial glows extend from Canva sections into code sections

---

## This Is Also a Product

If this works for RAVOK, it works for every Canva designer who wants a real website. This is literally the tool Amanda said "why the hell hasn't anyone built this yet." It could become one of RAVOK's tech ventures — or an open-source project that builds Amanda's reputation as a builder, not just a studio founder.

Just saying.
