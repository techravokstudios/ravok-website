/**
 * RAVOK Studios — Wireframe Illustration Constants
 * Defines line weights, density rules, mesh topology, and glow parameters
 * for the signature wireframe sculpture illustrations.
 *
 * Source: ravok-master-plan/ravok-brand-guidelines.md Section 5
 */

export const lineWeights = {
  thin: 0.3,
  standard: 0.4,
  thick: 0.5,
  accent: 0.8,
} as const;

export const meshDensity = {
  dense: {
    spacing: 2,
    opacity: 0.45,
    usage: 'Face, hands, hair, detailed accessories',
  },
  standard: {
    spacing: 4,
    opacity: 0.3,
    usage: 'Body, medium detail areas',
  },
  sparse: {
    spacing: 8,
    opacity: 0.12,
    usage: 'Chest, shoulders, flat drapery, backgrounds',
  },
} as const;

export const backgroundGrid = {
  cellSize: 45,
  lineColor: 'rgba(255,255,255,0.025)',
  strongLineColor: 'rgba(255,255,255,0.04)',
  strongLineInterval: 5,
} as const;

export const glowParams = {
  edge: {
    color: 'rgba(235,231,220,0.04)',
    radius: 20,
    blur: 15,
  },
  goldSpotlight: {
    color: 'rgba(196,149,58,0.08)',
    radius: 300,
    position: 'top-left' as const,
  },
  ambient: {
    color: 'rgba(235,231,220,0.015)',
    radius: 500,
  },
} as const;

export const hairRendering = {
  style: 'organic-spiral',
  curlTurns: 3,
  lineWeight: 0.3,
  opacity: 0.2,
} as const;

export const shatterEffect = {
  shardCount: { min: 8, max: 20 },
  shardMaxSize: 80,
  rotationRange: [-15, 15] as [number, number],
  driftDistance: 40,
} as const;
