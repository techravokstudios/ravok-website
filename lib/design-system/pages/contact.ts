/**
 * Contact page design spec — ravokstudios.com/contact-us
 */

export const contactPageSpec = {
  route: '/contact-us',
  sections: [
    'contactForm',    // Name, email, message, subject
    'socialLinks',    // Instagram, LinkedIn, email
    'officeInfo',     // LA office details
  ],
  layout: {
    mobile: 'form full-width, social links below',
    tablet: 'form with side info panel',
    desktop: 'split layout — form left, info + wireframe illustration right',
  },
  wireframeSculptures: [],
  canvaExports: [],
} as const;
