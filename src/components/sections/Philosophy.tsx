"use client";

/**
 * Philosophy — Multi-step thesis (every other industry → Hollywood).
 * Per rules §12: ideal pattern is ScrollytellSection (multi-step thesis).
 * That primitive isn't built yet — using CRevealSection for now with a
 * staggered-reveal panel list as a v1. Upgrade to ScrollytellSection later.
 */

import { motion } from "framer-motion";
import { CRevealSection } from "@/components/design-system";

const items = [
    "Tech startups get seed funding to build MVPs.",
    "Hardware companies get capital for prototypes.",
    "Software founders get invested in before revenue.",
];

export default function Philosophy() {
    return (
        <CRevealSection zIndex={11} centerHeader={false} contentMaxWidth="1400px">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left — text */}
                <div className="order-2 lg:order-1">
                    <motion.p
                        className="font-sans text-[0.62rem] font-semibold tracking-[0.3em] text-[var(--ds-ink-muted)] uppercase mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        Here&apos;s what we realized.
                    </motion.p>

                    <motion.h2
                        className="font-heading font-normal text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] mb-2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        In Every Other <br />
                        Industry,
                    </motion.h2>

                    <motion.h2
                        className="font-heading font-normal italic text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-ravok-gold mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        This Is Just Called R&amp;D
                    </motion.h2>

                    <div className="space-y-5 font-heading text-[1.15rem] leading-[1.6] text-[var(--ds-ink-dim)]">
                        {items.map((text, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.6, 0.2, 1] }}
                                className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-ravok-gold before:rounded-full"
                            >
                                {text}
                            </motion.p>
                        ))}

                        <motion.p
                            className="pt-4 text-[var(--ds-ink)]"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            But in Hollywood? Early-stage development is called &ldquo;too risky.&rdquo;
                        </motion.p>
                    </div>

                    <motion.p
                        className="mt-8 font-heading italic text-[1.4rem] lg:text-[1.6rem] text-ravok-gold leading-[1.5]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                    >
                        The real risk is letting gatekeepers decide what gets made.
                    </motion.p>
                </div>

                {/* Right — visual */}
                <motion.div
                    className="order-1 lg:order-2 relative flex items-center justify-center"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.6, 0.2, 1] }}
                >
                    <img
                        src="/images/slide1.png"
                        alt=""
                        className="w-full max-w-lg object-contain opacity-90"
                    />
                </motion.div>
            </div>
        </CRevealSection>
    );
}
