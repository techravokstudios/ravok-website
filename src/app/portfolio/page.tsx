"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type VentureStatus = "Development" | "Financing" | "Production" | "Released";
type VentureCategory = "Film Ventures" | "Production Labels" | "Tech Ventures";

interface Venture {
  title: string;
  category: VentureCategory;
  status: VentureStatus;
  description: string;
  details?: {
    genre?: string;
    team?: string;
    distribution?: string;
  };
}

const VENTURES: Venture[] = [
  {
    title: "Film Venture SPV I",
    category: "Film Ventures",
    status: "Financing",
    description: "First film project structured as a Special Purpose Vehicle with creator co-ownership and transparent profit participation.",
    details: { genre: "Drama / Thriller", team: "Writer-director attached", distribution: "Festival strategy + sales agent" },
  },
  {
    title: "Film Venture SPV II",
    category: "Film Ventures",
    status: "Development",
    description: "Second slate project in early development. Creator partnership finalized, packaging in progress.",
    details: { genre: "Sci-Fi", team: "Director attached" },
  },
  {
    title: "Film Venture SPV III",
    category: "Film Ventures",
    status: "Development",
    description: "Third venture in concept validation stage with attached creative talent.",
  },
  {
    title: "Film Venture SPV IV",
    category: "Film Ventures",
    status: "Development",
    description: "Fourth venture exploring franchise potential in an underserved genre market.",
  },
  {
    title: "HYSTERA Pictures",
    category: "Production Labels",
    status: "Development",
    description: "Horror and thriller production label designed as a repeatable venture pipeline, continuously spinning up new SPVs in the genre space.",
  },
  {
    title: "SHEARLINE",
    category: "Production Labels",
    status: "Development",
    description: "Action and genre production subsidiary focused on high-concept IP with franchise potential.",
  },
  {
    title: "WITHERHOUSE",
    category: "Production Labels",
    status: "Development",
    description: "Elevated drama and prestige content label targeting festival circuits and awards positioning.",
  },
  {
    title: "BRINKHOUSE",
    category: "Production Labels",
    status: "Development",
    description: "Emerging formats and experimental content label exploring new distribution models.",
  },
  {
    title: "Delphi AI Co-Pilot",
    category: "Tech Ventures",
    status: "Development",
    description: "AI-powered development tool for film projects. Assists with script analysis, packaging strategy, and market validation.",
  },
  {
    title: "Phema",
    category: "Tech Ventures",
    status: "Development",
    description: "AVOD streaming platform designed to capture first-party audience data and feed insights back into the greenlight process.",
  },
  {
    title: "Meris",
    category: "Tech Ventures",
    status: "Development",
    description: "Fintech platform for transparent profit participation tracking. Real-time dashboards for creators and investors.",
  },
];

const STATUS_COLORS: Record<VentureStatus, string> = {
  Development: "bg-white/10 text-ravok-slate",
  Financing: "bg-ravok-gold/15 text-ravok-gold",
  Production: "bg-green-500/15 text-green-400",
  Released: "bg-blue-500/15 text-blue-400",
};

const CATEGORIES: VentureCategory[] = ["Film Ventures", "Production Labels", "Tech Ventures"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<VentureCategory | "All">("All");
  const [expandedVenture, setExpandedVenture] = useState<string | null>(null);

  const filteredVentures = activeCategory === "All"
    ? VENTURES
    : VENTURES.filter((v) => v.category === activeCategory);

  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      {/* Hero */}
      <header className="border-b border-[var(--ds-border)] px-6 pt-32 pb-12">
        <div className="container mx-auto max-w-6xl">
          <motion.p
            className="font-sans text-xs font-medium uppercase tracking-widest text-ravok-slate mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Our 2026 Slate
          </motion.p>
          <motion.h1
            className="font-heading text-[clamp(3rem,6.5vw,5.5rem)] font-normal tracking-tight text-[var(--ds-ink)] mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Portfolio
          </motion.h1>
          <motion.p
            className="font-sans text-base text-ravok-slate/90 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Every venture is an independent entity with creator ownership, legal structure, initial backing, and strategic partners attached.
          </motion.p>
          <motion.div
            className="mt-4 h-0.5 w-16 bg-ravok-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </header>

      {/* Filter tabs */}
      <div className="border-b border-[var(--ds-border)] sticky top-0 bg-[var(--ds-bg)]/90 backdrop-blur-xl z-10">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex gap-6 overflow-x-auto">
            {(["All", ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-sm pb-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "text-ravok-gold border-ravok-gold font-medium"
                    : "text-ravok-slate border-transparent hover:text-[var(--ds-ink)] hover:border-[var(--ds-border-strong)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ventures grid */}
      <section className="px-6 py-16 lg:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVentures.map((venture, i) => (
              <motion.div
                key={venture.title}
                className="border border-ravok-gold/20 bg-[var(--ds-bg)]/90 backdrop-blur-md p-6 hover:bg-zinc-950 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onClick={() => setExpandedVenture(expandedVenture === venture.title ? null : venture.title)}
                whileHover={{ y: -4 }}
              >
                {/* Status badge */}
                <span className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-medium uppercase tracking-wider mb-4 ${STATUS_COLORS[venture.status]}`}>
                  {venture.status}
                </span>

                {/* Category */}
                <p className="font-sans text-[10px] text-ravok-slate uppercase tracking-wider mb-2">
                  {venture.category}
                </p>

                {/* Title */}
                <h3 className="font-heading text-xl text-ravok-beige mb-3 group-hover:text-white transition-colors">
                  {venture.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm text-ravok-slate leading-relaxed mb-4">
                  {venture.description}
                </p>

                {/* Expanded details */}
                {expandedVenture === venture.title && venture.details && (
                  <motion.div
                    className="border-t border-[var(--ds-border)] pt-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {venture.details.genre && (
                      <div className="flex justify-between">
                        <span className="font-sans text-[10px] text-[var(--ds-ink)] uppercase tracking-wider font-semibold">Genre</span>
                        <span className="font-sans text-xs text-ravok-slate">{venture.details.genre}</span>
                      </div>
                    )}
                    {venture.details.team && (
                      <div className="flex justify-between">
                        <span className="font-sans text-[10px] text-[var(--ds-ink)] uppercase tracking-wider font-semibold">Team</span>
                        <span className="font-sans text-xs text-ravok-slate">{venture.details.team}</span>
                      </div>
                    )}
                    {venture.details.distribution && (
                      <div className="flex justify-between">
                        <span className="font-sans text-[10px] text-[var(--ds-ink)] uppercase tracking-wider font-semibold">Distribution</span>
                        <span className="font-sans text-xs text-ravok-slate">{venture.details.distribution}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--ds-border)] px-6 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl text-[var(--ds-ink)] mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Want to build with us?
          </motion.h2>
          <motion.p
            className="font-sans text-ravok-slate mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Whether you&apos;re a creator, investor, or strategic partner — we&apos;d love to hear from you.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/contact-us"
              className="bg-ravok-gold text-black px-8 py-3 rounded-full font-sans font-semibold text-[0.68rem] tracking-[0.2em] uppercase hover:bg-[#d4a54a] hover:-translate-y-px transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pitch-us"
              className="border border-[var(--ds-border-strong)] text-[var(--ds-ink)] px-6 py-[0.85rem] rounded-full font-sans text-[0.68rem] font-semibold tracking-[0.2em] uppercase hover:border-ravok-gold hover:text-ravok-gold hover:-translate-y-px transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)]"
            >
              Pitch Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
