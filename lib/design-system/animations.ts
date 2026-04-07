/**
 * RAVOK Studios — Animation Presets
 * Framer Motion variants extracted from existing components + brand guidelines.
 * Includes reduced-motion variants for accessibility.
 */

import type { Variants, Transition } from 'framer-motion';

// --- Transition presets ---

export const transitions = {
  smooth: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } satisfies Transition,
  snappy: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  slow: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } satisfies Transition,
  spring: { type: 'spring', stiffness: 120, damping: 20 } satisfies Transition,
} as const;

// --- Shared variants ---

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smooth },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitions.smooth },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transitions.smooth },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transitions.smooth },
};

// --- Reduced motion variants (for prefers-reduced-motion) ---

export const reducedMotion = {
  fadeInUp: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  } satisfies Variants,
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  } satisfies Variants,
};

// --- Mobile-optimized (lighter animations for performance) ---

export const mobileVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  } satisfies Variants,
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  } satisfies Variants,
};

// --- Parallax helper (from Hero component) ---

export const parallaxConfig = {
  hero: {
    speed: 0.3,
    maxOffset: 100,
  },
  section: {
    speed: 0.15,
    maxOffset: 50,
  },
} as const;

// --- Scroll-triggered viewport config ---

export const viewportTrigger = {
  once: true,
  amount: 0.2,
  margin: '-50px',
} as const;
