/**
 * RAVOK Studios — Design Tokens
 * TypeScript mirror of CSS variables from app/globals.css + brand guidelines
 * Source of truth: ravok-master-plan/ravok-brand-guidelines.md
 */

// --- Colors ---

export const colors = {
  // Primary palette
  bgDark: '#1c1c1a',
  bgDeeper: '#0d0d0b',
  bgSurface: '#242420',
  textPrimary: '#e8e4dc',
  textSecondary: 'rgba(232,228,218,0.6)',
  textMuted: 'rgba(232,228,218,0.4)',
  textFaint: 'rgba(232,228,218,0.2)',
  accentGold: '#c4953a',
  accentGoldHover: '#d4a54a',
  accentGoldMuted: 'rgba(196,149,58,0.15)',
  border: 'rgba(232,228,218,0.08)',
  borderStrong: 'rgba(232,228,218,0.15)',

  // Legacy/current CSS tokens (from globals.css @theme)
  ravokGold: '#C9A84C',
  ravokGoldDim: '#A98147',
  ravokBeige: '#F3E4B9',
  ravokSlate: '#98958C',
  ravokCharcoal: '#1C1B14',
  ravokCharcoalLight: '#252419',
} as const;

export const wireframeColors = {
  line: 'rgba(235,231,220,0.3)',
  dense: 'rgba(235,231,220,0.45)',
  sparse: 'rgba(235,231,220,0.12)',
  hair: 'rgba(235,231,220,0.2)',
  glow: 'rgba(235,231,220,0.04)',
  gridLine: 'rgba(255,255,255,0.025)',
  gridLineStrong: 'rgba(255,255,255,0.04)',
} as const;

export const lighting = {
  glowGold: 'rgba(196,149,58,0.03)',
  glowGoldStrong: 'rgba(196,149,58,0.08)',
  glowWhite: 'rgba(235,231,220,0.015)',
  vignette: 'rgba(0,0,0,0.4)',
} as const;

// --- Breakpoints ---

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1440,
  '2xl': 1920,
} as const;

export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  touch: '(hover: none) and (pointer: coarse)',
} as const;

// --- Spacing ---

export const spacing = {
  page: {
    mobile: '1rem',
    tablet: '2rem',
    desktop: '4rem',
    maxWidth: '1440px',
  },
  section: {
    mobile: '3rem',
    tablet: '4rem',
    desktop: '6rem',
  },
} as const;

// --- Z-Index ---

export const zIndex = {
  svgLighting: 0,
  p5Atmosphere: 1,
  canvasIllustrator: 2,
  content: 10,
  threeSculptor: 20,
  navbar: 50,
  modal: 100,
  toast: 200,
} as const;

// --- Borders / Radius ---

export const radius = {
  none: '0px',
  sm: '2px',
  md: '3px',
  button: '2px',
} as const;

// --- Touch targets ---

export const touchTarget = {
  min: '44px',
} as const;
