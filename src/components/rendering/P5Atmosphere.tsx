"use client";

import { useEffect, useRef, memo } from "react";

/**
 * Layer 2 — p5.js Atmosphere
 * Living particle dust, pulsing gold glows, breathing textures.
 * Adapts particle count + FPS to device capability.
 */
export const P5Atmosphere = memo(function P5Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect device tier
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    const maxParticles = isMobile ? 30 : isTablet ? 60 : 120;
    const targetInterval = isMobile ? 33 : isTablet ? 22 : 16; // ms per frame

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Reduced motion check
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Create particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      phase: number;
      speed: number;
      isGold: boolean;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1, // slight upward drift
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.3,
        isGold: Math.random() < 0.15, // 15% are gold-tinted
      });
    }

    let lastTime = 0;

    const draw = (time: number) => {
      if (time - lastTime < targetInterval) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const t = time * 0.001;

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;

          // Breathing opacity
          const breath = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5;
          const alpha = p.opacity * (0.4 + breath * 0.6);

          // Wrap around edges
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.y > canvas.height + 10) p.y = -10;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

          if (p.isGold) {
            ctx.fillStyle = `rgba(196,149,58,${alpha})`;
          } else {
            ctx.fillStyle = `rgba(235,231,220,${alpha * 0.6})`;
          }
          ctx.fill();

          // Soft glow around larger particles
          if (p.size > 1.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            const glowAlpha = alpha * 0.08;
            ctx.fillStyle = p.isGold
              ? `rgba(196,149,58,${glowAlpha})`
              : `rgba(235,231,220,${glowAlpha})`;
            ctx.fill();
          }
        } else {
          // Reduced motion: static particles, no animation
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.isGold
            ? `rgba(196,149,58,${p.opacity * 0.5})`
            : `rgba(235,231,220,${p.opacity * 0.3})`;
          ctx.fill();
        }
      }

      // Pulsing gold glow in center
      if (!prefersReduced) {
        const pulseAlpha = (Math.sin(t * 0.4) * 0.5 + 0.5) * 0.03;
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.5,
          canvas.height * 0.35,
          0,
          canvas.width * 0.5,
          canvas.height * 0.35,
          canvas.width * 0.4
        );
        gradient.addColorStop(0, `rgba(196,149,58,${pulseAlpha})`);
        gradient.addColorStop(1, "rgba(196,149,58,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
});
