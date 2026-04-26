"use client";

/**
 * Partners — Team / partner type grid.
 * Per rules §12: "Team / people" → C-Reveal w/ stone cards.
 *
 * Refactored to use design-system primitives.
 * Copy preserved; layout standardized to stone-card grid + email contact.
 */

import { motion } from "framer-motion";
import { Video, DollarSign, Monitor, User, Mail } from "lucide-react";
import { CRevealSection, StoneCard } from "@/components/design-system";

type Partner = {
    type: string;
    icon: typeof Video;
    desc: string;
    bring: string;
    get: string;
};

const partners: Partner[] = [
    {
        type: "Co-Producers",
        icon: Video,
        desc: "Experienced producers who want equity in creator-driven ventures.",
        bring: "Packaging expertise, talent relationships, production knowledge.",
        get: "Equity positions, producing credits, portfolio diversification.",
    },
    {
        type: "Financiers",
        icon: DollarSign,
        desc: "Capital partners who see the creator economy opportunity.",
        bring: "Smart capital, patient approach, industry understanding.",
        get: "Portfolio exposure across multiple ventures, transparent structures, creative + financial upside.",
    },
    {
        type: "Distribution Partners",
        icon: Monitor,
        desc: "Streamers, sales agents, distributors seeking original IP.",
        bring: "Distribution pathways, market access, festival relationships.",
        get: "First-look at creator-owned IP, festival-positioned projects, franchise potential.",
    },
    {
        type: "Operational Partners",
        icon: User,
        desc: "Operators, attorneys, strategists who want to build institutions.",
        bring: "COO bandwidth, legal expertise, marketing strategy, finance operations.",
        get: "Equity, ground-floor involvement, meaningful impact.",
    },
];

export default function Partners() {
    return (
        <CRevealSection
            id="investors"
            zIndex={15}
            eyebrow="To scale this model, we need the right partners."
            headline={
                <>
                    The Future of Media
                    <br />
                    <span className="text-[var(--ds-ink)]">Won&apos;t Be Built by Gatekeepers.</span>
                </>
            }
            lead="It will be built by creators, partners, and investors who believe ownership matters."
            contentMaxWidth="1400px"
        >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                {partners.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <motion.div
                            key={p.type}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.6, 0.2, 1] }}
                        >
                            <StoneCard
                                title={p.type}
                                className="h-full !p-8"
                            >
                                <Icon className="w-7 h-7 text-[var(--ds-stone-gold)] mb-4" />
                                <p className="text-[0.85rem] leading-relaxed mb-6 min-h-[40px]">{p.desc}</p>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-2">
                                            What you bring
                                        </h4>
                                        <p className="text-[0.78rem] leading-relaxed border-l border-[rgba(26,23,19,0.18)] pl-3 text-[rgba(26,23,19,0.7)]">
                                            {p.bring}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-2">
                                            What you get
                                        </h4>
                                        <p className="text-[0.78rem] leading-relaxed border-l border-[rgba(26,23,19,0.18)] pl-3 text-[rgba(26,23,19,0.7)]">
                                            {p.get}
                                        </p>
                                    </div>
                                </div>
                            </StoneCard>
                        </motion.div>
                    );
                })}
            </div>

            {/* Email contact strip — inline within the section per rules §12 (quote/contact slot) */}
            <motion.div
                className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-[rgba(15,15,13,0.5)] backdrop-blur-sm border-y border-[var(--ds-border)] px-8 py-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <Mail className="w-7 h-7 text-ravok-gold flex-shrink-0" />
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <span className="font-sans text-[0.95rem] text-[var(--ds-ink-dim)] whitespace-nowrap">
                        Questions? Email us at:
                    </span>
                    <a
                        href="mailto:contact@ravokstudios.com"
                        className="font-heading text-xl lg:text-2xl text-ravok-gold hover:text-[var(--ds-ink)] transition-colors break-all sm:break-normal"
                    >
                        contact@ravokstudios.com
                    </a>
                </div>
            </motion.div>
        </CRevealSection>
    );
}
