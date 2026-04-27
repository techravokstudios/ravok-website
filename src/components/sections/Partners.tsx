"use client";

/**
 * Partners — partner-types scrollytelling (4 steps).
 * 2-column grid: text steps on left, big icon visual pinned on right.
 *
 * Copy preserved from prior version. Bring/get details rendered inside
 * the description block of each step.
 */

import { Video, DollarSign, Monitor, User, Mail, LucideIcon } from "lucide-react";
import { ScrollytellSection, type ScrollytellStep } from "@/components/design-system";

type PartnerData = {
    type: string;
    icon: LucideIcon;
    desc: string;
    bring: string;
    get: string;
};

const partners: PartnerData[] = [
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

const partnerSteps: ScrollytellStep[] = partners.map((p, i) => {
    const Icon = p.icon;
    return {
        tag: `Partners · 0${i + 1}`,
        name: p.type,
        description: (
            <>
                {p.desc}
                <br />
                <br />
                <strong className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-ravok-gold">
                    What you bring:
                </strong>{" "}
                {p.bring}
                <br />
                <br />
                <strong className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-ravok-gold">
                    What you get:
                </strong>{" "}
                {p.get}
            </>
        ),
        visual: (
            <div className="flex items-center justify-center w-full h-full">
                <Icon className="w-[60%] h-[60%] text-ravok-gold opacity-90" strokeWidth={0.8} />
            </div>
        ),
    };
});

export default function Partners() {
    return (
        <>
            <ScrollytellSection
                id="investors"
                zIndex={15}
                label="Who We Build With"
                counterSuffix="THE PARTNERS"
                steps={partnerSteps}
            />

            {/* Email contact strip — final cap below the scrollytell */}
            <div
                className="relative section-card px-6 lg:px-10 py-24 z-[16]"
                style={{
                    backgroundColor: "var(--ds-bg)",
                    backgroundImage: [
                        "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                        "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        "linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    ].join(", "),
                    backgroundSize: "100% 100%, 80px 80px, 80px 80px",
                }}
            >
                <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-[rgba(15,15,13,0.5)] backdrop-blur-sm border-y border-[var(--ds-border)] px-8 py-8">
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
                </div>
            </div>
        </>
    );
}
