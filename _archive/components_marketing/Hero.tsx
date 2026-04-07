"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Minimal inline SVG of an Ionic column (architectural elevation style).
 * Matches the blueprint-drawing motif from the Q2 pitch deck.
 * Replace with <img src="/images/column.png"> when the real asset is ready.
 */
function ArchitecturalColumn({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Entablature / top beam */}
      <rect x="5" y="0" width="110" height="14" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.55" />
      <rect x="10" y="14" width="100" height="6" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.4" />

      {/* Ionic capital — volute suggestion */}
      <rect x="15" y="20" width="90" height="8" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.5" />
      {/* Left volute */}
      <path d="M15 28 Q8 34 15 40 Q22 46 28 40" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.45" />
      {/* Right volute */}
      <path d="M105 28 Q112 34 105 40 Q98 46 92 40" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.45" />
      {/* Neck / echinus */}
      <rect x="28" y="40" width="64" height="10" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.45" />

      {/* Fluted shaft — 7 flutes */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = 30 + i * 9;
        return (
          <line
            key={i}
            x1={x} y1="50"
            x2={x} y2="390"
            stroke="#C9A84C"
            strokeWidth="0.6"
            strokeOpacity="0.3"
          />
        );
      })}
      {/* Shaft outline */}
      <rect x="28" y="50" width="64" height="340" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Base — three steps */}
      <rect x="20" y="390" width="80" height="12" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.5" />
      <rect x="12" y="402" width="96" height="10" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.45" />
      <rect x="5" y="412" width="110" height="10" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.55" />

      {/* Stylobate */}
      <rect x="0" y="422" width="120" height="6" stroke="#C9A84C" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* Dimension tick marks — blueprint flavour */}
      <line x1="0" y1="0"   x2="0" y2="428" stroke="#C9A84C" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="2 4" />
      <line x1="120" y1="0" x2="120" y2="428" stroke="#C9A84C" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="2 4" />
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const logoScale = useTransform(scrollY, [0, 450], [1, 0.35], { clamp: true });
  const logoY = useTransform(scrollY, [0, 450], ["0%", "-75%"], { clamp: true });
  const logoOpacity = useTransform(scrollY, [400, 550], [1, 0], { clamp: true });

  const taglineOpacity = useTransform(scrollY, [0, 250], [1, 0], { clamp: true });
  const taglineY = useTransform(scrollY, [0, 250], [0, 25], { clamp: true });

  const backgroundY = useTransform(scrollY, [0, 1200], ["0%", "25%"], { clamp: true });

  // Columns drift slightly slower than background for layered depth
  const columnY = useTransform(scrollY, [0, 1200], ["0%", "12%"], { clamp: true });
  const columnOpacity = useTransform(scrollY, [0, 400], [1, 0], { clamp: true });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-[#1C1B14] overflow-hidden"
    >
      {/* Background Image — Smooth Parallax */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: backgroundY, transform: "translateZ(0)" }}
      >
        <img
          src="/images/bg_image.png"
          alt=""
          className="w-full h-full object-cover opacity-60"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        />
        {/* Warm charcoal overlay — replaces pure-black gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1B14]/60 via-[#1C1B14]/10 to-[#1C1B14]" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_60px_rgba(28,27,20,0.5)] pointer-events-none" />
      </motion.div>

      {/* Architectural columns — left & right, blueprint style */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none flex items-end justify-between px-[6vw] pb-0"
        style={{ y: columnY, opacity: columnOpacity }}
      >
        <ArchitecturalColumn className="w-[6vw] max-w-[72px] h-auto opacity-50" />
        <ArchitecturalColumn className="w-[6vw] max-w-[72px] h-auto opacity-50 scale-x-[-1]" />
      </motion.div>

      {/* Horizontal rule at top — deck motif */}
      <motion.div
        className="absolute top-[18%] left-0 right-0 z-[2] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        style={{ opacity: taglineOpacity }}
      >
        <div className="w-[40vw] max-w-xs h-px bg-ravok-gold opacity-25" />
        <div className="mx-4 w-1.5 h-1.5 rounded-full bg-ravok-gold opacity-40" />
        <div className="w-[40vw] max-w-xs h-px bg-ravok-gold opacity-25" />
      </motion.div>

      {/* Central content */}
      <div className="z-10 text-center flex flex-col items-center px-4 fixed inset-0 pointer-events-none flex justify-center items-center">
        {/* RAVOK Logo — animated entry + scroll shrink */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
          style={{
            scale: logoScale,
            y: logoY,
            opacity: logoOpacity,
            transform: "translateZ(0)",
          }}
          className="origin-center will-change-transform"
        >
          <img
            src="/images/logo.png"
            alt="RAVOK"
            className="w-[60vw] lg:w-[40vw] max-w-4xl object-contain opacity-90"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.8 }}
          style={{ opacity: taglineOpacity, y: taglineY, transform: "translateZ(0)" }}
          className="will-change-transform"
        >
          <motion.div
            className="h-px w-24 bg-ravok-gold my-8 mx-auto origin-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
          <motion.p
            className="text-sm lg:text-lg font-sans tracking-[0.3em] text-ravok-slate uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            A New Architecture for Entertainment
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1C1B14] to-transparent z-[3] pointer-events-none" />
    </section>
  );
}
