/**
 * Creators page design spec — submission forms for writers, directors, producers
 * Routes: /form, /form/[type]
 */

export const creatorsPageSpec = {
  route: '/form',
  sections: [
    'formSelector',     // Choose: writer, director, or producer
    'submissionForm',   // Dynamic form based on type
    'termsAgreement',   // T&C checkbox + agreed_at timestamp
  ],
  layout: {
    mobile: 'full-width form, inputs stack, all touch targets 44px+',
    tablet: 'centered form with max-width',
    desktop: 'centered form with visual sidebar (wireframe illustration)',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
