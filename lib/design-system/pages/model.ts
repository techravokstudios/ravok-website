/**
 * Our Model page design spec — ravokstudios.com/our-model
 * Deck pages mapped: 5 (Comparison), 6 (Portfolio)
 */

export const modelPageSpec = {
  route: '/our-model',
  sections: [
    'comparison',   // Old model vs RAVOK model side-by-side
    'portfolio',    // Venture studio structure, Film SPVs, Meris, Phema, Delphi AI
  ],
  layout: {
    mobile: 'comparison table stacks or scrolls horizontally',
    tablet: 'side-by-side comparison starts',
    desktop: 'full side-by-side with hover details',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
