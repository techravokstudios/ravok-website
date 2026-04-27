"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Plus, Check } from "lucide-react";

const stages = [
  {
    title: "STAGE 1: SEED & STRUCTURE",
    traditional: "Creator pitches. If they're lucky, gets option money or development deal. Studio owns everything. Creator hopes for backend points that never pay out.",
    ravok: "We provide seed capital for development. Structure the project as an independent venture with an operating agreement. Creator gets founder equity (typically 30-50%). Clear governance from day one.",
    bullets: [
      "You own a piece of what you build",
      "Transparent cap table",
      'Real decision rights, not "creative control" that disappears in production',
    ],
    bulletIcon: "plus" as const,
  },
  {
    title: "STAGE 2: BUILD & PACKAGE",
    traditional: "Creator assembles package alone, begging for attachments. Studio steps in only when it's \"ready.\" Endless notes from executives who've never made anything.",
    ravok: "Strategic support throughout packaging. Access to our network of actors, DPs, producers. Professional infrastructure (legal, finance, marketing strategy). Clear decision rights—you're the founder, not an employee.",
    bullets: [
      "You're not alone in development",
      "Professional support without giving up control",
      "Partnership, not patronage",
    ],
    bulletIcon: "check" as const,
  },
  {
    title: "STAGE 3: PRODUCTION & DISTRIBUTION",
    traditional: "Film gets made (if you're lucky). Studio controls distribution. Creator gets paid once, maybe twice. No ongoing revenue. Next project starts from zero.",
    ravok: "Production with strategic partners. Distribution through festivals, boutique streamers, or our platform (Phema). Revenue flows back to the venture. Creator sees the numbers. Build for franchise potential and IP longevity.",
    bullets: [
      "Transparent revenue",
      "Ongoing economics, not one-off deals",
      "Sustainable creative career",
    ],
    bulletIcon: "check" as const,
  },
];

const traditionalItems = [
  "Studio owns 100%",
  "Creator: Work-for-hire",
  "Backend points (fake)",
  "No board seat",
  '"Creative control" (disappears)',
  "Opaque accounting",
  "One-off project",
  "Hope for backend",
];

const ravokItems = [
  "Board seat with voting rights",
  "Operating agreement with defined decision rights",
  "Transparent books",
  "Sustainable venture",
  "Real equity value",
];

export default function OurModelPage() {
  return (
    <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Section 1: Hero - OUR MODEL, EXPLAINED SIMPLY */}
      <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)] relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-28 h-px bg-gradient-to-r from-ravok-gold/40 to-transparent z-10" />
        <div className="absolute bottom-1/3 right-0 w-32 h-px bg-gradient-to-l from-ravok-gold/30 to-transparent z-10" />
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <motion.span
              className="inline-block text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              The model
            </motion.span>
            <motion.h1
              className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal text-ravok-gold leading-[1.05] mb-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Our model,
            </motion.h1>
            <motion.h2
              className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.05] mb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              explained simply
            </motion.h2>
            <motion.p
              className="text-[var(--ds-ink-dim)] font-sans text-lg lg:text-xl leading-relaxed mb-4 pl-6 border-l-2 border-ravok-gold/40"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              How we actually structure ventures differently
            </motion.p>
            <motion.p
              className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              People ask &ldquo;what do you mean by venture studio?&rdquo; Here&apos;s what we actually do:
            </motion.p>
          </div>
          <motion.div
            className="relative order-first lg:order-last min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-[var(--ds-border)]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 z-0">
              <img
                src="/images/3.png"
                alt=""
                className="w-full h-full object-cover object-top grayscale opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[var(--ds-bg)] via-[rgba(28,28,26,0.5)] to-transparent lg:from-[rgba(28,28,26,0.8)]" />
            </div>
            <div className="absolute top-6 right-6 flex gap-2 z-10">
              <span className="w-3 h-3 rounded-full border border-[var(--ds-border-strong)]" />
              <span className="w-3 h-3 rounded-full bg-[rgba(232,228,218,0.6)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections 2–4: STAGE 1, 2, 3 */}
      {stages.map((stage, stageIndex) => (
        <section
          key={stageIndex}
          className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)] relative"
        >
          {/* Stage number watermark */}
          <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[18vw] font-heading font-bold text-[rgba(232,228,218,0.04)] leading-none select-none pointer-events-none">
            {String(stageIndex + 1).padStart(2, "0")}
          </span>
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.h2
              className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-ravok-gold uppercase tracking-wide mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {stage.title}
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-14">
              <motion.div
                className="group p-6 lg:p-8 rounded-xl bg-[rgba(232,228,218,0.04)] border border-[var(--ds-border)] hover:border-[var(--ds-border-strong)] transition-all duration-300"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-ravok-slate/80 font-sans text-xs tracking-[0.2em] uppercase block mb-3">Traditional</span>
                <h3 className="text-xl font-heading text-[var(--ds-ink)] mb-4">Traditional studio approach:</h3>
                <p className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg leading-relaxed">{stage.traditional}</p>
              </motion.div>
              <motion.div
                className="group p-6 lg:p-8 rounded-xl bg-ravok-gold/5 border-2 border-ravok-gold hover:shadow-[0_0_40px_-8px_rgba(169,129,71,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-ravok-gold/80 font-sans text-xs tracking-[0.2em] uppercase block mb-3">Our approach</span>
                <h3 className="text-xl font-heading text-[var(--ds-ink)] mb-4">RAVOK approach:</h3>
                <p className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg leading-relaxed">{stage.ravok}</p>
              </motion.div>
            </div>

            <motion.div
              className="flex gap-6 pl-4 border-l-2 border-ravok-gold/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-1 self-stretch min-h-[100px] bg-gradient-to-b from-ravok-gold to-ravok-gold/50 shrink-0 rounded-full" />
              <div>
                <h4 className="text-2xl font-heading text-ravok-gold mb-6">What this means:</h4>
                <ul className="space-y-4">
                  {stage.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-4 text-ravok-gold font-sans text-base lg:text-lg"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    >
                      {stage.bulletIcon === "plus" ? (
                        <span className="w-6 h-6 rounded-full border-2 border-ravok-gold flex items-center justify-center shrink-0 mt-0.5">
                          <Plus className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-ravok-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-ravok-gold" />
                        </span>
                      )}
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Section 5: THE STRUCTURAL DIFFERENCE - vs layout */}
      <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)] relative">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-heading font-bold text-[rgba(232,228,218,0.04)] select-none pointer-events-none">
          VS
        </span>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.h2
            className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-[var(--ds-ink)] text-center uppercase tracking-wide mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The structural difference:
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              className="group p-8 lg:p-10 rounded-2xl bg-[rgba(232,228,218,0.04)] border border-[var(--ds-border)] hover:border-[var(--ds-border-strong)] transition-all duration-300"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-heading text-[var(--ds-ink-dim)] uppercase tracking-wide mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-[rgba(232,228,218,0.3)]" />
                Traditional model
              </h3>
              <ul className="space-y-4">
                {traditionalItems.map((item, i) => (
                  <motion.li
                    key={i}
                    className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg flex items-start gap-3"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <span className="text-ravok-slate mt-1.5">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="group p-8 lg:p-10 rounded-2xl bg-ravok-gold/5 border-2 border-ravok-gold hover:shadow-[0_0_50px_-10px_rgba(169,129,71,0.3)] hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-heading text-ravok-gold uppercase tracking-wide mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-ravok-gold" />
                RAVOK model
              </h3>
              <ul className="space-y-4">
                {ravokItems.map((item, i) => (
                  <motion.li
                    key={i}
                    className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg flex items-start gap-3"
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <Check className="w-5 h-5 text-ravok-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 6: CTA - We've been waiting for you! (matches About Us CTA style) */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/philosophy.png"
            alt=""
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-[rgba(28,28,26,0.6)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_0%,#1c1c1a_70%)]" />
        </div>
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.h2
            className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal text-[var(--ds-ink)] uppercase tracking-wide leading-tight mb-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            We&apos;ve been waiting for you!
          </motion.h2>
          <motion.p
            className="text-ravok-gold/90 font-sans text-xl lg:text-2xl leading-relaxed mb-14 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Whether you&apos;re a partner, investor, or creator—we want to hear from you.
          </motion.p>
          <motion.div
            className="mb-14 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 border-2 border-ravok-gold text-ravok-gold px-6 py-[0.85rem] rounded-full font-sans text-base font-semibold uppercase tracking-widest hover:bg-ravok-gold hover:text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(169,129,71,0.25)]"
            >
              Get in touch
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.p
            className="text-[var(--ds-ink-dim)] font-sans text-sm uppercase tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Questions?{" "}
            <a href="mailto:contact@ravokstudios.com" className="text-ravok-gold hover:text-ravok-beige transition-colors underline underline-offset-4">
              contact@ravokstudios.com
            </a>
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
