"use client";

import { memo } from "react";

/**
 * Layer 1 — SVG Lighting Rig
 * Background grid lines, radial gold glows, vignettes, gradient overlays.
 * Pure SVG, no JS animation — lightest layer.
 */
export const SVGLightingRig = memo(function SVGLightingRig() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Background grid pattern */}
        <pattern id="grid-fine" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(201,168,76,0.025)" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-thick" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#grid-fine)" />
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="0.5" />
        </pattern>

        {/* Gold spotlight gradient — top-left warm glow */}
        <radialGradient id="gold-spotlight" cx="15%" cy="10%" r="50%" fx="15%" fy="10%">
          <stop offset="0%" stopColor="rgba(196,149,58,0.08)" />
          <stop offset="40%" stopColor="rgba(196,149,58,0.03)" />
          <stop offset="100%" stopColor="rgba(196,149,58,0)" />
        </radialGradient>

        {/* Ambient center glow */}
        <radialGradient id="ambient-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(235,231,220,0.015)" />
          <stop offset="100%" stopColor="rgba(235,231,220,0)" />
        </radialGradient>

        {/* Vignette — dark edges */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
        </radialGradient>
      </defs>

      {/* Grid */}
      <rect width="100%" height="100%" fill="url(#grid-thick)" />

      {/* Gold spotlight — top left */}
      <rect width="100%" height="100%" fill="url(#gold-spotlight)" />

      {/* Ambient center glow */}
      <rect width="100%" height="100%" fill="url(#ambient-glow)" />

      {/* Vignette overlay — darkens edges */}
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  );
});
