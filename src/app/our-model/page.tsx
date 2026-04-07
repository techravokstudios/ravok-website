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
    <main className="min-h-screen bg-black/90 text-white selection:bg-ravok-gold selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Section 1: Hero - OUR MODEL, EXPLAINED SIMPLY */}
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative overflow-hidden">
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
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-ravok-gold leading-[1.05] mb-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Our model,
            </motion.h1>
            <motion.h2
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold text-white leading-[1.05] mb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              explained simply
            </motion.h2>
            <motion.p
              className="text-white/90 font-sans text-lg lg:text-xl leading-relaxed mb-4 pl-6 border-l-2 border-ravok-gold/40"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              How we actually structure ventures differently
            </motion.p>
            <motion.p
              className="text-white/80 font-sans text-base lg:text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              People ask &ldquo;what do you mean by venture studio?&rdquo; Here&apos;s what we actually do:
            </motion.p>
          </div>
          <motion.div
            className="relative order-first lg:order-last min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Wireframe SPV structure diagram */}
            <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3/4 h-auto opacity-50" aria-hidden="true">
              <g stroke="#C9A84C" strokeWidth="0.8">
                {/* Top: Studio entity */}
                <rect x="100" y="30" width="100" height="40" strokeOpacity="0.5" />
                <text x="150" y="55" textAnchor="middle" fill="#C9A84C" fillOpacity="0.3" fontSize="8" fontFamily="monospace">STUDIO</text>

                {/* Lines to SPVs */}
                <line x1="120" y1="70" x2="60" y2="130" strokeOpacity="0.35" />
                <line x1="150" y1="70" x2="150" y2="130" strokeOpacity="0.35" />
                <line x1="180" y1="70" x2="240" y2="130" strokeOpacity="0.35" />

                {/* SPV boxes */}
                <rect x="30" y="130" width="60" height="35" strokeOpacity="0.4" />
                <rect x="120" y="130" width="60" height="35" strokeOpacity="0.4" />
                <rect x="210" y="130" width="60" height="35" strokeOpacity="0.4" />
                <text x="60" y="152" textAnchor="middle" fill="#C9A84C" fillOpacity="0.25" fontSize="6" fontFamily="monospace">SPV 1</text>
                <text x="150" y="152" textAnchor="middle" fill="#C9A84C" fillOpacity="0.25" fontSize="6" fontFamily="monospace">SPV 2</text>
                <text x="240" y="152" textAnchor="middle" fill="#C9A84C" fillOpacity="0.25" fontSize="6" fontFamily="monospace">SPV 3</text>

                {/* Equity splits — pie chart wireframes */}
                <circle cx="60" cy="210" r="20" strokeOpacity="0.3" />
                <line x1="60" y1="190" x2="60" y2="210" strokeOpacity="0.25" />
                <line x1="60" y1="210" x2="77" y2="220" strokeOpacity="0.25" />

                <circle cx="150" cy="210" r="20" strokeOpacity="0.3" />
                <line x1="150" y1="190" x2="150" y2="210" strokeOpacity="0.25" />
                <line x1="150" y1="210" x2="167" y2="220" strokeOpacity="0.25" />

                <circle cx="240" cy="210" r="20" strokeOpacity="0.3" />
                <line x1="240" y1="190" x2="240" y2="210" strokeOpacity="0.25" />
                <line x1="240" y1="210" x2="257" y2="220" strokeOpacity="0.25" />

                {/* Revenue flow arrows */}
                <line x1="60" y1="230" x2="60" y2="290" strokeOpacity="0.2" strokeDasharray="4 4" />
                <line x1="150" y1="230" x2="150" y2="290" strokeOpacity="0.2" strokeDasharray="4 4" />
                <line x1="240" y1="230" x2="240" y2="290" strokeOpacity="0.2" strokeDasharray="4 4" />

                {/* Returns bar */}
                <rect x="30" y="290" width="240" height="30" strokeOpacity="0.3" />
                <text x="150" y="310" textAnchor="middle" fill="#C9A84C" fillOpacity="0.2" fontSize="7" fontFamily="monospace">TRANSPARENT RETURNS</text>
              </g>
              <g stroke="#E8E4DC" strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="2 4">
                <line x1="15" y1="20" x2="15" y2="340" />
                <line x1="285" y1="20" x2="285" y2="340" />
              </g>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Sections 2–4: STAGE 1, 2, 3 */}
      {stages.map((stage, stageIndex) => (
        <section
          key={stageIndex}
          className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative"
        >
          {/* Stage number watermark */}
          <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[18vw] font-heading font-bold text-white/[0.04] leading-none select-none pointer-events-none">
            {String(stageIndex + 1).padStart(2, "0")}
          </span>
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-ravok-gold uppercase tracking-wide mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {stage.title}
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-14">
              <motion.div
                className="group p-6 lg:p-8 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-ravok-slate/80 font-sans text-xs tracking-[0.2em] uppercase block mb-3">Traditional</span>
                <h3 className="text-xl font-heading text-white mb-4">Traditional studio approach:</h3>
                <p className="text-white/70 font-sans text-base lg:text-lg leading-relaxed">{stage.traditional}</p>
              </motion.div>
              <motion.div
                className="group p-6 lg:p-8 rounded-xl bg-ravok-gold/5 border-2 border-ravok-gold hover:shadow-[0_0_40px_-8px_rgba(169,129,71,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-ravok-gold/80 font-sans text-xs tracking-[0.2em] uppercase block mb-3">Our approach</span>
                <h3 className="text-xl font-heading text-white mb-4">RAVOK approach:</h3>
                <p className="text-white/90 font-sans text-base lg:text-lg leading-relaxed">{stage.ravok}</p>
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
      <section className="min-h-screen flex flex-col justify-center py-24 lg:py-32 px-6 border-t border-white/5 relative">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-heading font-bold text-white/[0.03] select-none pointer-events-none">
          VS
        </span>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white text-center uppercase tracking-wide mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The structural difference:
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              className="group p-8 lg:p-10 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-heading text-white/90 uppercase tracking-wide mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-white/30" />
                Traditional model
              </h3>
              <ul className="space-y-4">
                {traditionalItems.map((item, i) => (
                  <motion.li
                    key={i}
                    className="text-white/80 font-sans text-base lg:text-lg flex items-start gap-3"
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
                    className="text-white/90 font-sans text-base lg:text-lg flex items-start gap-3"
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

      {/* Section 6: CTA */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 py-32 overflow-hidden">
        {/* Radial glow accent */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-thin text-white uppercase tracking-wide leading-tight mb-8"
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
              className="inline-flex items-center gap-2 border-2 border-ravok-gold text-ravok-gold px-10 py-5 rounded-full font-sans text-base font-semibold uppercase tracking-widest hover:bg-ravok-gold hover:text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(169,129,71,0.25)]"
            >
              Get in touch
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.p
            className="text-white/70 font-sans text-sm uppercase tracking-widest"
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
