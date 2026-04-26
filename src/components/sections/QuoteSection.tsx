"use client";

/**
 * QuoteSection — Quote / testimonial slot.
 * Per rules §12: quotes go INLINE within other sections, but we keep this as a
 * dedicated CRevealSection for now to preserve the existing flow. Future cleanup:
 * fold into Philosophy or VentureModel as inline.
 */

import { motion } from "framer-motion";
import { CRevealSection } from "@/components/design-system";

export default function QuoteSection() {
    return (
        <CRevealSection zIndex={12} centerHeader paddingY="py-40" contentMaxWidth="900px">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1] }}
                className="border-2 border-ravok-gold p-12 lg:p-16 text-center rounded-[24px]"
            >
                <p className="font-heading italic text-[1.5rem] lg:text-[1.85rem] leading-[1.5] text-[var(--ds-ink)] mb-6">
                    &ldquo;What if we funded creators the way VCs fund founders? What if films were structured like
                    startups—with equity, governance, and long-term thinking?&rdquo;
                </p>
                <p className="font-sans text-[0.7rem] uppercase tracking-[0.3em] text-ravok-gold">
                    — Amanda Aoki, Founder
                </p>
            </motion.div>

            <motion.p
                className="text-center font-sans text-[0.7rem] uppercase tracking-[0.3em] text-[var(--ds-ink-muted)] mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                That&apos;s exactly what we built.
            </motion.p>
        </CRevealSection>
    );
}
