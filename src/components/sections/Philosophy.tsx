"use client";

/**
 * Philosophy — Multi-step thesis content. Compact 100vh layout.
 * Sized so total height (text + image + padding) fits in viewport during
 * sticky cover-from-below.
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
        <CRevealSection zIndex={11} centerHeader={false} contentMaxWidth="1300px">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left — text */}
                <div className="order-2 lg:order-1">
                    <motion.p
                        className="font-sans text-[0.62rem] font-semibold tracking-[0.3em] text-[var(--ds-ink-muted)] uppercase mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        Here&apos;s what we realized.
                    </motion.p>

                    <motion.h2
                        className="font-heading font-normal text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.015em] mb-1"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        In Every Other Industry,
                    </motion.h2>

                    <motion.h2
                        className="font-heading font-normal italic text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.015em] text-ravok-gold mb-7"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        This Is Just Called R&amp;D
                    </motion.h2>

                    <div className="space-y-3 font-heading text-[1rem] lg:text-[1.05rem] leading-[1.55] text-[var(--ds-ink-dim)]">
                        {items.map((text, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.2, 0.6, 0.2, 1] }}
                                className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-ravok-gold before:rounded-full"
                            >
                                {text}
                            </motion.p>
                        ))}

                        <motion.p
                            className="pt-2 text-[var(--ds-ink)]"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            But in Hollywood? Early-stage development is called &ldquo;too risky.&rdquo;
                        </motion.p>
                    </div>

                    <motion.p
                        className="mt-6 font-heading italic text-[1.15rem] lg:text-[1.3rem] text-ravok-gold leading-[1.4]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.75 }}
                    >
                        The real risk is letting gatekeepers decide what gets made.
                    </motion.p>
                </div>

                {/* Right — visual (height capped to fit in 100vh alongside text) */}
                <motion.div
                    className="order-1 lg:order-2 hidden lg:flex items-center justify-center"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.6, 0.2, 1] }}
                >
                    <img
                        src="/images/slide1.png"
                        alt=""
                        className="max-h-[60vh] w-auto max-w-full object-contain opacity-90"
                    />
                </motion.div>
            </div>
        </CRevealSection>
    );
}
