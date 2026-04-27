"use client";

/**
 * Offerings — Portfolio / projects content type.
 * Per rules §12: "Portfolio / projects" → C-Reveal w/ stone cards.
 *
 * Refactored to use design-system primitives (CRevealSection + StoneCard).
 * Copy and statue images preserved; layout standardized.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CRevealSection, StoneCard } from "@/components/design-system";

type Offering = {
    title: string;
    description: string;
    footer: string;
    stats: string;
    statueIndex: number;
};

const offerings: Offering[] = [
    {
        title: "Film Ventures",
        description:
            "Each film project is launched as a Special Purpose Vehicle (SPV)—a standalone company that we co-found and incorporate with the creative partner. Ravok deploys pre-seed development capital to complete packaging and attract external financing. This creates creator-driven cinema structured for commercial success while maintaining artistic integrity. Our partnership model means the equity stake is determined by the development stage at which the creative co-founder joins.",
        footer: "Projects",
        stats: "4 in development, 1 financing",
        statueIndex: 1,
    },
    {
        title: "Production Labels",
        description:
            "We build the next generation of IP engines by developing and managing specialized production subsidiaries. These subsidiaries are designed to function as repeatable venture pipelines, continuously spinning up new SPVs. Each label focuses on a specific genre or audience niche, allowing it to tailor development, marketing, and acquisition strategies to a broad, underserved market. This strategy eliminates single-project risk by creating a self-sustaining ecosystem that curates talent and develops franchises, owning the upside of IP creation.",
        footer: "Divisions",
        stats: "4",
        statueIndex: 2,
    },
    {
        title: "Tech Ventures",
        description:
            "Our dedicated Tech Ventures pillar is where we incubate, incorporate, and scale proprietary technology companies. This infrastructure is designed to eliminate traditional media gatekeepers and give creators direct relationships with their audiences. These ventures focus on capturing valuable first-party audience data on engagement and narrative preferences, feeding this information back into the studio's greenlight process to quantitatively de-risk future ventures and provide measurable returns.",
        footer: "Ventures",
        stats: "3 in development, 1 in validation stage",
        statueIndex: 3,
    },
];

export default function Offerings() {
    return (
        <CRevealSection
            zIndex={14}
            nonSticky
            eyebrow="Our 2025 slate proves the model works."
            headline={
                <>
                    Here&apos;s what we offer
                    <br />
                    <em className="not-italic font-heading text-ravok-gold text-[0.7em]">All Structured for Success.</em>
                </>
            }
            lead="Our focus is in rebuilding the system. Our inaugural portfolio is fully committed, structured, and in development. Each venture is an independent entity with creator ownership, GTM, legal entity set, initial backing, and strategic partners attached."
            contentMaxWidth="1400px"
        >
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 mt-20">
                {offerings.map((offer, i) => (
                    <motion.div
                        key={offer.title}
                        className="relative flex flex-col"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                        {/* Statue image hovers above the stone card */}
                        <div className="h-48 lg:h-64 w-full -mb-10 flex justify-center pointer-events-none relative z-[1]">
                            <img
                                src={`/images/${offer.statueIndex}.png`}
                                alt=""
                                className="h-full w-auto object-contain opacity-90"
                            />
                        </div>

                        <StoneCard
                            label={offer.footer}
                            title={offer.title}
                            className="flex-1 relative z-[2]"
                            footer={
                                <div className="flex justify-between items-center">
                                    <span>{offer.footer}</span>
                                    <span className="text-[var(--ds-stone-ink)]">{offer.stats}</span>
                                </div>
                            }
                        >
                            <p className="text-[0.95rem] leading-relaxed text-justify">{offer.description}</p>
                            <div className="mt-6">
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(26,23,19,0.2)] bg-transparent px-6 py-[0.85rem] font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--ds-stone-ink)] transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:bg-[var(--ds-stone-ink)] hover:text-[var(--ds-stone-bg)] hover:-translate-y-px"
                                >
                                    Contact us <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </StoneCard>
                    </motion.div>
                ))}
            </div>
        </CRevealSection>
    );
}
