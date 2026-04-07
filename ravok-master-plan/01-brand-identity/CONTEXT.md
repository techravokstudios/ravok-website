# 01 — Brand Identity

## CONTEXT FOR CLAUDE CODE
> Read this before ANY design, copy, or styling work. The brand is the founder's voice amplified.

---

## Brand Positioning

**One-liner:** The first venture studio turning filmmakers into founders.

**Tagline options on current site:**
- "A New Architecture for Entertainment"
- "The System Is Broken. We Built a New One."
- "We built the system to fill it"

**Brand Personality:** Rebellious. Founder-led. Anti-gatekeeping. Intellectually rigorous. Not trying to be liked — trying to be right.

---

## Voice Guidelines

### DO:
- Write like Amanda talks — direct, confident, no hedging
- Use VC/startup language applied to film ("SPV", "pre-seed", "cap table", "equity")
- Be provocative: "The real risk is letting gatekeepers decide what gets made"
- Reference the broken system — but always offer what RAVOK is building instead
- Use short, punchy sentences. Then long ones for gravity.
- Address audiences directly: "If you're a creator who thinks like a founder..."

### DON'T:
- Use corporate jargon ("synergies", "leverage", "circle back")
- Be humble-braggy or apologetic
- Use passive voice
- Sound like every other production company
- Oversell — the model should speak for itself
- Use AI-generated fluff language ("innovative solutions", "cutting-edge", "transformative")

### Tone by page:
| Page | Tone |
|------|------|
| Homepage | Bold, manifesto-energy, visual-first |
| About Us | Personal, Amanda's story, raw and honest |
| Our Model | Intellectual, VC-fluent, structured |
| Investors | Professional but not sterile, transparent |
| Insights/Blog | Thought leadership, opinionated, educational |
| Contact | Warm, direct, low-barrier |

---

## Visual Language (Current Site Analysis)

### Current Assets:
- Logo: White "RAVOK" text mark on dark backgrounds
- Image style: Classical sculpture / marble statues juxtaposed with modern tech (laptop, headphones)
- Color palette: Dark backgrounds, gold/amber accents, white text
- Typography: Clean sans-serif headers, readable body text
- Background textures: Marble/stone patterns with gradient overlays
- Section images: `bg_image.png`, `philosophy.png`, `ventureModel.png`, `partners.png`, `footer.png`

### Design Tokens (to be formalized during rebrand):
```css
/* SUGGESTED — Amanda to confirm */
--color-bg-primary: #0a0a0a;        /* Near-black */
--color-bg-secondary: #1a1a1a;      /* Dark gray */
--color-accent: #c4953a;            /* Gold/amber */
--color-text-primary: #ffffff;       /* White */
--color-text-secondary: #a0a0a0;    /* Muted gray */
--color-cta: #c4953a;               /* Gold buttons */

--font-heading: 'Inter', sans-serif; /* or chosen display font */
--font-body: 'Inter', sans-serif;

--spacing-section: 120px;
--max-width-content: 1200px;
```

### Photography Direction:
- Classical art meets tech disruption (marble statues + modern objects)
- No stock photos of diverse teams in glass offices
- No film set BTS unless it's actual RAVOK productions
- Amanda's personal photos for About page
- Event photography from the 70+ person hosted event

---

## REBRAND SCOPE (Amanda's Call)

Questions for Amanda to answer before rebrand begins:
- [ ] Keep the sculpture/marble visual language or evolve it?
- [ ] New logo or just refinements?
- [ ] Color palette changes?
- [ ] Font preferences?
- [ ] Photography style shift?
- [ ] Any mood boards or reference sites?

---

## Brand Assets Inventory (from repo `/public/` and `/images/`)
- `logo.png` — White RAVOK wordmark
- `bg_image.png` — Main background texture
- `broken.png` — Sculpture with laptop (hero image)
- `philosophy.png` — Philosophy section background
- `slide1.png` — R&D philosophy slide
- `ventureModel.png` — Venture model background
- `bg_1.png` — Venture studio statue
- `1.png`, `2.png`, `3.png` — Film/Labels/Tech venture sculptures
- `partners.png` — Partners section background
- `footer.png` — Footer background
