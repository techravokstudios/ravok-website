/**
 * Home page design spec — ravokstudios.com/
 * Filled in as Amanda designs each section in Canva.
 *
 * Deck pages mapped: 1 (Hero), 2 (Problem), 3 (Market), 4 (Why Now), 11 (Closing)
 */

export const homePageSpec = {
  route: '/',
  sections: [
    'hero',           // RAVOK logo, tagline, wireframe sculptures, contact info
    'problem',        // "Film is historically uninvestable" + press clippings
    'market',         // $2.9T TAM → $362B SAM → $50M SOM nested circles
    'whyNow',         // 3 pillars: consolidation, audience shift, AI validation
    'confessions',    // Hollywood Confessions feed (dynamic, code-only)
    'closing',        // RAVOK logo + contact info
  ],
  layout: {
    mobile: 'single-column, sections stack vertically',
    tablet: 'single-column with wider margins',
    desktop: 'full-width sections with max-width content area (1440px)',
  },
  wireframeSculptures: [],  // Amanda fills in after Canva design
  canvaExports: [],         // Populated by Canvas Bridge pipeline
} as const;
