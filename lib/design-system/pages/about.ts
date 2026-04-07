/**
 * About page design spec — ravokstudios.com/about-us
 * Deck pages mapped: 7 (Traction), 8 (Roadmap), 9 (Team)
 */

export const aboutPageSpec = {
  route: '/about-us',
  sections: [
    'traction',   // One year of progress across 4 verticals
    'roadmap',    // Year 1-2-3 visual timeline
    'team',       // Amanda, Thibault, Lois, Pye — photos + bios
  ],
  layout: {
    mobile: 'single-column, team grid 1 col',
    tablet: 'team grid 2 cols',
    desktop: 'team grid 4 cols with hover bios',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
