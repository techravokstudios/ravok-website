/**
 * Partners page design spec
 */

export const partnersPageSpec = {
  route: '/partners',
  sections: [
    'partnerLogos',     // Partner/collaborator logos grid
    'partnerDetails',   // Expanded partner info on click/hover
  ],
  layout: {
    mobile: 'logo grid 2 cols',
    tablet: 'logo grid 3 cols',
    desktop: 'logo grid 4-5 cols with hover detail panels',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
