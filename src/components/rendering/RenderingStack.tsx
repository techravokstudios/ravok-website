"use client";

import { SVGLightingRig } from "./SVGLightingRig";
import { P5Atmosphere } from "./P5Atmosphere";
import { CanvasIllustrator } from "./CanvasIllustrator";
import { ThreeSculptor } from "./ThreeSculptor";

/**
 * RAVOK 4-Layer Rendering Stack
 *
 * Composes all visual layers behind page content.
 * Add to layout.tsx for global use, or per-page for custom configs.
 *
 * Layer order (bottom to top):
 * 1. SVG Lighting Rig — grid, glows, vignette
 * 2. p5.js Atmosphere — particles, breathing textures
 * 3. Canvas Illustrator — wireframe drawings, architectural elements
 * 4. Three.js Sculptor — 3D wireframe models (desktop only)
 *
 * Props let each page toggle layers and customize the 3D shape.
 */

interface RenderingStackProps {
  /** Enable/disable individual layers */
  layers?: {
    svg?: boolean;
    p5?: boolean;
    canvas?: boolean;
    three?: boolean;
  };
  /** Canvas illustrator elements to draw */
  canvasElements?: ("grid" | "columns" | "frame" | "mesh")[];
  /** Three.js sculpture shape */
  sculptureShape?: "icosahedron" | "torus" | "column" | "sphere";
  /** Three.js sculpture position */
  sculpturePosition?: [number, number, number];
  /** Three.js sculpture scale */
  sculptureScale?: number;
}

export function RenderingStack({
  layers = { svg: true, p5: true, canvas: true, three: false },
  canvasElements = ["grid", "mesh", "frame"],
  sculptureShape = "icosahedron",
  sculpturePosition = [2, 0, 0],
  sculptureScale = 1,
}: RenderingStackProps) {
  return (
    <>
      {layers.svg && <SVGLightingRig />}
      {layers.p5 && <P5Atmosphere />}
      {layers.canvas && <CanvasIllustrator elements={canvasElements} />}
      {layers.three && (
        <ThreeSculptor
          shape={sculptureShape}
          position={sculpturePosition}
          scale={sculptureScale}
        />
      )}
    </>
  );
}
