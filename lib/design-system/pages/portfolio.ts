/**
 * Portfolio page design spec
 * Film SPVs, production brands, tech ventures
 */

export const portfolioPageSpec = {
  route: '/portfolio',
  sections: [
    'filmSPVs',         // Individual film projects as SPVs
    'productionBrands', // HYSTERA, SHEARLINE, WITHERHOUSE, BRINKHOUSE
    'techVentures',     // Phema, Meris, Delphi AI
  ],
  layout: {
    mobile: 'card stack, 1 col',
    tablet: '2-col grid',
    desktop: 'masonry or staggered grid with varied card sizes',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
