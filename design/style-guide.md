# RAVOK Studios — Visual Language Reference

## Quick Reference for Claude Code + Amanda

This file is the at-a-glance summary of the visual rules. Full specs live in:
- `ravok-master-plan/ravok-brand-guidelines.md` (comprehensive)
- `lib/design-system/` (TypeScript tokens)

---

## Color Rules
- **Never** use pure black (`#000000`). Minimum dark: `#1c1c1a`
- **Never** use pure white (`#ffffff`). Use off-white: `#e8e4dc`
- Gold (`#c4953a`) is an **accent only** — never a background fill (except very low opacity glows)
- All text must meet WCAG AA contrast ratio on dark backgrounds

## Typography Rules
- **Headlines**: ITC Baskerville (or Libre Baskerville free fallback), italic or normal
- **Body text**: Coco Gothic (or Montserrat free fallback), regular weight
- **UI/Nav labels**: Coco Gothic uppercase, letter-spacing 2-3px
- Self-host all fonts as WOFF2 in `/public/fonts/`

## Wireframe Rules
- Line weight: 0.3-0.5px (extremely thin)
- Lines are white/off-white on dark, never colored
- No fill — interior is transparent/dark
- Dense areas (face, hands) = many closely-spaced lines
- Sparse areas (chest, fabric) = fewer, wider-spaced lines
- Hair: flowing organic spirals, never grid-based

## Card Styles
- Background: transparent or very low-opacity surface
- Border: thin solid or hand-drawn feel
- Slight rotation (-2 to +2 degrees) for newspaper clipping aesthetic on editorial cards
- Varied sizes for visual rhythm
- Hover: subtle gold glow or border brighten

## Button Styles
- Gold text on transparent bg with gold border
- Hover: gold fills bg, text goes dark
- Uppercase, letter-spacing 2-3px
- No rounded corners (squared or max 2-3px radius)

## Responsive Rules
- Mobile: 320-480px — everything stacks, 44px min touch targets
- Tablet: 768-1024px — grids start at 2 cols
- Laptop: 1024-1440px
- Desktop: 1440px+ — full layout, max content width 1440px
- Reduced motion: fade-only (no slides/transforms), shorter durations
- Mobile animations: lighter (fewer particles, lower poly counts)

## Section Transitions
- Gradient blend between Canva-designed and code sections
- p5.js atmosphere runs continuously across ALL sections
- SVG glows extend from designed sections into code sections
