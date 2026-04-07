"use client";

import { useEffect, useRef, memo } from "react";
import { lineWeights, meshDensity, backgroundGrid, glowParams } from "@/design-system/wireframe";

/**
 * Layer 3 — Canvas API Illustrator
 * Wireframe drawings: geometric objects from scratch, wireframe mesh patterns,
 * architectural elements (columns, pedestals, frames).
 *
 * This layer draws static + subtly animated wireframe geometry that gives
 * every page the RAVOK "technical drawing" feel.
 */

interface CanvasIllustratorProps {
  /** Which geometric elements to draw. Defaults to ambient mesh. */
  elements?: ("grid" | "columns" | "frame" | "mesh")[];
}

export const CanvasIllustrator = memo(function CanvasIllustrator({
  elements = ["grid", "mesh", "frame"],
}: CanvasIllustratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawGrid = () => {
      const { cellSize, lineColor, strongLineColor, strongLineInterval } = backgroundGrid;
      const w = canvas.width;
      const h = canvas.height;

      // Fine grid
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Strong grid lines
      ctx.strokeStyle = strongLineColor;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += cellSize * strongLineInterval) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += cellSize * strongLineInterval) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const drawWireframeMesh = (time: number) => {
      // Ambient wireframe mesh — diagonal cross-hatching
      const w = canvas.width;
      const h = canvas.height;
      const spacing = meshDensity.sparse.spacing * 12;
      const opacity = meshDensity.sparse.opacity;

      // Subtle sway for living feel
      const sway = prefersReduced ? 0 : Math.sin(time * 0.0003) * 2;

      ctx.strokeStyle = `rgba(235,231,220,${opacity})`;
      ctx.lineWidth = lineWeights.thin;

      // Diagonal lines — bottom-left corner accent
      for (let i = -h; i < w; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i + sway, h);
        ctx.lineTo(i + h + sway, 0);
        ctx.stroke();
      }
    };

    const drawFrame = (time: number) => {
      // Wireframe border frame — architectural drawing feel
      const w = canvas.width;
      const h = canvas.height;
      const margin = Math.min(w, h) * 0.03;
      const innerMargin = margin + 8;

      // Outer frame
      ctx.strokeStyle = `rgba(235,231,220,0.06)`;
      ctx.lineWidth = lineWeights.standard;
      ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

      // Inner frame with slight offset
      ctx.strokeStyle = `rgba(235,231,220,0.03)`;
      ctx.lineWidth = lineWeights.thin;
      ctx.strokeRect(innerMargin, innerMargin, w - innerMargin * 2, h - innerMargin * 2);

      // Corner ornaments — small L-shapes at each corner
      const cornerSize = 20;
      ctx.strokeStyle = `rgba(201,168,76,0.12)`;
      ctx.lineWidth = lineWeights.standard;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(margin, margin + cornerSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + cornerSize, margin);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(w - margin - cornerSize, margin);
      ctx.lineTo(w - margin, margin);
      ctx.lineTo(w - margin, margin + cornerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(margin, h - margin - cornerSize);
      ctx.lineTo(margin, h - margin);
      ctx.lineTo(margin + cornerSize, h - margin);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(w - margin - cornerSize, h - margin);
      ctx.lineTo(w - margin, h - margin);
      ctx.lineTo(w - margin, h - margin - cornerSize);
      ctx.stroke();
    };

    const drawColumns = (time: number) => {
      // Wireframe Ionic columns — left and right edges
      const w = canvas.width;
      const h = canvas.height;
      const colWidth = Math.min(w * 0.04, 50);
      const colInset = w * 0.02;

      ctx.strokeStyle = `rgba(235,231,220,0.05)`;
      ctx.lineWidth = lineWeights.thin;

      // Left column — vertical fluted lines
      for (let i = 0; i < 5; i++) {
        const x = colInset + (colWidth / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, h * 0.1);
        ctx.lineTo(x, h * 0.9);
        ctx.stroke();
      }

      // Right column
      for (let i = 0; i < 5; i++) {
        const x = w - colInset - (colWidth / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, h * 0.1);
        ctx.lineTo(x, h * 0.9);
        ctx.stroke();
      }

      // Column capitals (top) — simple horizontal lines
      ctx.strokeStyle = `rgba(235,231,220,0.07)`;
      ctx.lineWidth = lineWeights.standard;

      // Left capital
      ctx.beginPath();
      ctx.moveTo(colInset - 5, h * 0.1);
      ctx.lineTo(colInset + colWidth + 5, h * 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(colInset - 5, h * 0.1 + 4);
      ctx.lineTo(colInset + colWidth + 5, h * 0.1 + 4);
      ctx.stroke();

      // Right capital
      ctx.beginPath();
      ctx.moveTo(w - colInset - colWidth - 5, h * 0.1);
      ctx.lineTo(w - colInset + 5, h * 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - colInset - colWidth - 5, h * 0.1 + 4);
      ctx.lineTo(w - colInset + 5, h * 0.1 + 4);
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elements.includes("grid")) drawGrid();
      if (elements.includes("mesh")) drawWireframeMesh(time);
      if (elements.includes("frame")) drawFrame(time);
      if (elements.includes("columns")) drawColumns(time);

      // Edge glow — subtle gold at top-left
      const { goldSpotlight } = glowParams;
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.15, canvas.height * 0.1, 0,
        canvas.width * 0.15, canvas.height * 0.1, goldSpotlight.radius
      );
      gradient.addColorStop(0, goldSpotlight.color);
      gradient.addColorStop(1, "rgba(196,149,58,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!prefersReduced) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [elements]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
});
