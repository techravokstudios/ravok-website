/**
 * Investor portal design spec — ravokstudios.com/investor
 * Deck page mapped: 10 (The Ask)
 */

export const investorsPageSpec = {
  route: '/investor',
  sections: [
    'dashboard',    // Overview metrics, recent updates
    'documents',    // Investor documents, pitch deck, financials
    'profile',      // Investor profile management
    'posts',        // Investor-only content/updates
  ],
  layout: {
    mobile: 'sidebar collapses to hamburger, single-column content',
    tablet: 'sidebar visible, content area adapts',
    desktop: 'fixed sidebar + scrollable content area',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
