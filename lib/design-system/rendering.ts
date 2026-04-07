/**
 * RAVOK Studios — 4-Layer Rendering Stack Config
 * Defines the configuration for each rendering layer.
 *
 * Layer order (bottom to top):
 * 1. SVG — Lighting rig (background grid, radial glows, vignettes)
 * 2. p5.js — Atmosphere (particles, pulsing glows, breathing textures)
 * 3. Canvas API — Illustrator (wireframe drawings, traced illustrations)
 * 4. Three.js — Sculptor (3D wireframe models, hover reveal effects)
 *
 * Source: ravok-master-plan/ravok-brand-guidelines.md Section 6
 */

export const layers = {
  svg: {
    name: 'SVG Lighting Rig',
    zIndex: 0,
    role: 'Background grid lines, radial gold glows, vignettes, gradient overlays, warm spotlights',
    pointerEvents: false,
  },
  p5: {
    name: 'p5.js Atmosphere',
    zIndex: 1,
    role: 'Living particle dust, pulsing glows, breathing textures, floating organic motion',
    pointerEvents: false,
    performance: {
      maxParticles: { mobile: 30, tablet: 60, desktop: 120 },
      targetFps: { mobile: 30, tablet: 45, desktop: 60 },
    },
  },
  canvas: {
    name: 'Canvas API Illustrator',
    zIndex: 2,
    role: 'Wireframe drawings (geometric objects from scratch, complex forms via edge detection tracing)',
    pointerEvents: false,
  },
  three: {
    name: 'Three.js Sculptor',
    zIndex: 20,
    role: 'Wireframe-to-rendered sculpture reveal on hover, 3D objects responding to mouse/scroll',
    pointerEvents: true,
    performance: {
      maxPolycount: { mobile: 5000, tablet: 15000, desktop: 50000 },
      antialias: { mobile: false, tablet: true, desktop: true },
      pixelRatio: { mobile: 1, tablet: 1.5, desktop: 2 },
    },
  },
} as const;

export const canvasStrategy = {
  fromScratch: [
    'Geometric objects: columns, pedestals, film reels, clapperboards',
    'Abstract wireframe patterns and textures',
    'Wireframe borders, dividers, frame elements',
    'Ambient mesh patterns',
  ],
  traceReference: [
    'Load rendered statue as hidden reference',
    'Run edge detection (Canny/Sobel) on pixel data',
    'Draw thin contour lines following detected edges',
    'Remove reference, keep wireframe lines only',
  ],
  leaveToAmanda: [
    'Hero sculptures (statement pieces per page)',
    'Complex organic forms (draped fabric, hair, smoke, shattered fragments)',
    'Any illustration needing artist-made feel',
    'Export as PNG via Canvas Bridge pipeline',
  ],
} as const;
