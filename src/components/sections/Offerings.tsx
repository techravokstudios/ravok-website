"use client";

/**
 * Offerings — Portfolio scrollytelling.
 * 2-column grid: text steps stacked on left, statue visual pinned on right.
 * Active step (closest to viewport center) gets full opacity; others dim.
 *
 * Copy preserved from prior version — only the section's *layout* changed,
 * not the words.
 */

import { ScrollytellSection, type ScrollytellStep } from "@/components/design-system";

const offerings: ScrollytellStep[] = [
    {
        tag: "Projects · 01",
        name: "Film Ventures",
        description:
            "Each film project is launched as a Special Purpose Vehicle (SPV)—a standalone company that we co-found and incorporate with the creative partner. Ravok deploys pre-seed development capital to complete packaging and attract external financing. This creates creator-driven cinema structured for commercial success while maintaining artistic integrity.",
        chip: "4 in development · 1 financing",
        visual: <img src="/images/1.png" alt="" className="max-w-full max-h-full object-contain" style={{ mixBlendMode: "screen" }} />,
    },
    {
        tag: "Divisions · 02",
        name: "Production Labels",
        description:
            "We build the next generation of IP engines by developing and managing specialized production subsidiaries. These subsidiaries are designed to function as repeatable venture pipelines, continuously spinning up new SPVs. Each label focuses on a specific genre or audience niche, eliminating single-project risk.",
        chip: "4 active divisions",
        visual: <img src="/images/2.png" alt="" className="max-w-full max-h-full object-contain" style={{ mixBlendMode: "screen" }} />,
    },
    {
        tag: "Ventures · 03",
        name: "Tech Ventures",
        description:
            "Our dedicated Tech Ventures pillar is where we incubate, incorporate, and scale proprietary technology companies. This infrastructure is designed to eliminate traditional media gatekeepers and give creators direct relationships with their audiences. These ventures capture first-party data that feeds back into greenlight decisions.",
        chip: "3 in development · 1 in validation",
        visual: <img src="/images/3.png" alt="" className="max-w-full max-h-full object-contain" style={{ mixBlendMode: "screen" }} />,
    },
];

export default function Offerings() {
    return (
        <ScrollytellSection
            zIndex={14}
            label="What We Build"
            counterSuffix="THE PORTFOLIO"
            steps={offerings}
        />
    );
}
