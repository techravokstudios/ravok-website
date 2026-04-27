"use client";

/**
 * VentureModel — Comparison + how-it-works. Compact 100vh layout.
 */

import { motion } from "framer-motion";
import { Check, Eye } from "lucide-react";
import { CRevealSection, Button } from "@/components/design-system";

const howItWorks = [
    "Seed capital for development and packaging",
    "Creator ownership through venture structure",
    "Strategic support from development to distribution",
    "Built to scale — turning projects into sustainable IP businesses",
];

export default function VentureModel() {
    return (
        <CRevealSection id="model" zIndex={13} centerHeader={false} contentMaxWidth="1300px">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                {/* Left — text */}
                <div className="max-w-2xl">
                    <h2 className="font-heading font-normal text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.015em] text-[var(--ds-ink)] mb-5">
                        Not a Production Company.
                        <br />
                        Not an Accelerator.
                        <br />
                        <em className="text-ravok-gold not-italic font-heading italic">A Venture Studio.</em>
                    </h2>

                    <p className="font-sans text-[0.72rem] tracking-[0.2em] uppercase leading-[1.7] text-[var(--ds-ink-muted)] mb-8">
                        RAVOK applies proven venture capital principles to filmmaking. We provide seed capital,
                        structure each project as an independent venture, and give creators real equity and control.
                    </p>

                    <h3 className="font-heading text-[1.1rem] mb-4 text-[var(--ds-ink)]">How It Works:</h3>
                    <ul className="space-y-3 mb-8">
                        {howItWorks.map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.6, 0.2, 1] }}
                                className="flex items-start gap-3 text-[var(--ds-ink-dim)] font-sans text-[0.95rem] lg:text-[1rem] leading-[1.5]"
                            >
                                <Check className="w-4 h-4 text-ravok-gold mt-1 shrink-0" />
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <Button href="/our-model" variant="primary">
                            Learn more
                        </Button>
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full border border-[rgba(232,228,218,0.15)] flex items-center justify-center transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-ravok-gold hover:-translate-y-px"
                            aria-label="Watch"
                        >
                            <Eye className="w-4 h-4 text-ravok-gold" />
                        </button>
                    </div>
                </div>

                {/* Right — hero image (height-capped to fit in viewport) */}
                <motion.div
                    className="hidden lg:block relative max-h-[70vh] overflow-hidden"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1] }}
                >
                    <div className="absolute inset-0 bg-gradient-to-l from-[var(--ds-bg)] via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                        src="/images/bg_1.png"
                        alt=""
                        className="w-full max-h-[70vh] object-cover grayscale opacity-60"
                    />
                </motion.div>
            </div>
        </CRevealSection>
    );
}
