"use client";

/**
 * IntroSection — Manifesto / brand statement.
 * Per rules §12: "Manifesto / brand statement" → C-Reveal, single column, max-width 820px.
 *
 * Refactored to use CRevealSection. First reveal section after hero —
 * lives outside the sticky stack (nonSticky=true) so the hero scrolls away cleanly.
 */

import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { CRevealSection, Button } from "@/components/design-system";

export default function IntroSection() {
    return (
        <CRevealSection
            zIndex={10}
            eyebrow="2025 Slate: Fully Committed"
            centerHeader={false}
            contentMaxWidth="1200px"
        >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left — text */}
                <div className="order-2 lg:order-1">
                    <h2 className="font-heading font-normal text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-[var(--ds-ink)] mb-6">
                        The System Is Broken.
                        <br />
                        <em className="text-ravok-gold not-italic font-heading italic">We Built a New One.</em>
                    </h2>

                    <p className="font-sans text-[1.15rem] leading-[1.65] text-[var(--ds-ink-dim)] mb-8 max-w-[520px]">
                        RAVOK STUDIOS is the first venture studio turning filmmakers into founders—and films into sustainable businesses.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button href="#investors" variant="primary">
                            Partner with us
                        </Button>
                        <button
                            type="button"
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,228,218,0.15)] bg-transparent transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-ravok-gold hover:-translate-y-px"
                            aria-label="Watch"
                        >
                            <Eye className="h-5 w-5 text-ravok-gold" />
                        </button>
                    </div>
                </div>

                {/* Right — image */}
                <motion.div
                    className="order-1 lg:order-2 relative flex items-center justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
                >
                    <img
                        src="/images/broken.png"
                        alt=""
                        className="w-full h-auto max-h-[600px] lg:max-h-[700px] object-contain opacity-90 grayscale"
                    />
                </motion.div>
            </div>
        </CRevealSection>
    );
}
