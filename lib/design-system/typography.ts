/**
 * RAVOK Studios — Typography System
 * Source of truth: ravok-master-plan/ravok-brand-guidelines.md Section 4
 *
 * Primary fonts: ITC Baskerville (headings) + Coco Gothic (body)
 * Free fallbacks: Libre Baskerville + Montserrat
 * Current code fonts: Cormorant Garamond + Kanit + Instrument Sans (to be migrated)
 */

export const fontFamilies = {
  heading: {
    primary: 'ITC Baskerville',
    fallback: 'Libre Baskerville, Baskervville, Georgia, serif',
    current: 'var(--font-cormorant)', // Current code — to migrate
  },
  body: {
    primary: 'Coco Gothic',
    fallback: 'Montserrat, Raleway, sans-serif',
    current: 'var(--font-kanit)', // Current code — to migrate
  },
  ui: {
    primary: 'Coco Gothic',
    fallback: 'Montserrat, sans-serif',
    current: 'var(--font-instrument)', // Current code — to migrate
  },
  mono: {
    primary: 'JetBrains Mono',
    fallback: 'Fira Code, monospace',
  },
} as const;

export const typeScale = {
  display: {
    size: { mobile: '48px', tablet: '72px', desktop: '96px' },
    lineHeight: 1.0,
    letterSpacing: '-0.02em',
    font: 'heading',
  },
  h1: {
    size: { mobile: '36px', tablet: '48px', desktop: '64px' },
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
    font: 'heading',
  },
  h2: {
    size: { mobile: '28px', tablet: '36px', desktop: '48px' },
    lineHeight: 1.15,
    letterSpacing: '0',
    font: 'heading',
  },
  h3: {
    size: { mobile: '20px', tablet: '24px', desktop: '32px' },
    lineHeight: 1.2,
    letterSpacing: '0',
    font: 'heading',
  },
  h4: {
    size: { mobile: '16px', tablet: '18px', desktop: '24px' },
    lineHeight: 1.3,
    letterSpacing: '0.01em',
    font: 'heading',
  },
  body: {
    size: { mobile: '16px', tablet: '16px', desktop: '18px' },
    lineHeight: 1.6,
    letterSpacing: '0',
    font: 'body',
  },
  small: {
    size: { mobile: '13px', tablet: '13px', desktop: '14px' },
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    font: 'body',
  },
  caption: {
    size: { mobile: '10px', tablet: '11px', desktop: '12px' },
    lineHeight: 1.4,
    letterSpacing: '0.05em',
    font: 'body',
    textTransform: 'uppercase' as const,
  },
  label: {
    size: { mobile: '9px', tablet: '9px', desktop: '10px' },
    lineHeight: 1.3,
    letterSpacing: '0.15em',
    font: 'body',
    textTransform: 'uppercase' as const,
  },
  uiNav: {
    size: { mobile: '12px', tablet: '13px', desktop: '14px' },
    lineHeight: 1.3,
    letterSpacing: '0.12em',
    font: 'ui',
    textTransform: 'uppercase' as const,
  },
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
