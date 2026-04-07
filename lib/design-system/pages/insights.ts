/**
 * Insights page design spec — ravokstudios.com/insights
 * Hollywood Confessions wall + Blog/Articles feed
 */

export const insightsPageSpec = {
  route: '/insights',
  sections: [
    'confessionWall',   // Anonymous Hollywood confessions feed
    'articlesFeed',     // Blog posts, analysis, creator stories
    'categories',       // Category navigation
  ],
  layout: {
    mobile: 'single-column feed, confession cards full-width',
    tablet: 'two-column grid for articles',
    desktop: 'confessions left (wider), articles right sidebar, or full masonry',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
