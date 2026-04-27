"use client";

/**
 * Portfolio — 4-pillar scrollytelling.
 * Per WEBSITE-TECHNICAL-RULES.md §12: portfolio → ScrollytellSection.
 *
 * Steps: Film SPVs / Meris / Delphi / Phema — each with description, meta bullets, chip.
 * Visuals are large italic gold "badge" rings (numbered 01–04).
 */

import { ScrollytellSection, type ScrollytellStep } from "@/components/design-system";

function StepBadge({ num, label }: { num: string; label: string }) {
    return (
        <div className="w-[65%] aspect-square rounded-full border-[1.5px] border-ravok-gold flex flex-col items-center justify-center font-heading text-ravok-gold"
             style={{
                 background: "radial-gradient(ellipse at center, rgba(196,149,58,0.06) 0%, transparent 70%)",
             }}
        >
            <div className="font-heading italic text-[clamp(3rem,6vw,5rem)] leading-none mb-2">{num}</div>
            <div className="font-heading italic text-[clamp(1rem,1.5vw,1.4rem)] tracking-[0.05em]">{label}</div>
        </div>
    );
}

function StepBody({
    body,
    meta,
}: {
    body: React.ReactNode;
    meta: Array<React.ReactNode>;
}) {
    /* Important: ScrollytellSection wraps `description` in a <p>.
       Block-level children (ul/div) auto-close the <p> in browsers and
       break layout + cause hydration mismatches. Use spans w/ display:block
       so the structure stays valid inline. */
    return (
        <>
            <span className="block mb-4">{body}</span>
            <span className="block">
                {meta.map((m, i) => (
                    <span
                        key={i}
                        className="block relative pl-4 mb-1.5 last:mb-0 font-sans text-[0.78rem] tracking-[0.02em] text-[var(--ds-ink-dim)]"
                    >
                        <span className="absolute left-0 text-ravok-gold">—</span>
                        {m}
                    </span>
                ))}
            </span>
        </>
    );
}

const portfolioSteps: ScrollytellStep[] = [
    {
        tag: "Entertainment · 01",
        name: "Film SPVs",
        title: <>Each film, a <em className="text-ravok-gold not-italic font-heading italic">standalone company</em>.</>,
        description: (
            <StepBody
                body="Creator equity, clean cap table, auditable economics. Every project incorporates as its own LLC under the RAVOK umbrella, with profit participation flowing transparently from box office to cap table."
                meta={[
                    <><strong className="font-heading italic text-ravok-gold">2</strong> films incorporated</>,
                    <><strong className="font-heading italic text-ravok-gold">20+</strong> IPs in development</>,
                    <>Emmy-nominated director · PGA producer attached</>,
                ]}
            />
        ),
        chip: "10–50% Equity",
        visual: <StepBadge num="01" label="Film SPVs" />,
    },
    {
        tag: "Fintech · 02",
        name: "Meris",
        title: <>The accounting layer that makes waterfalls <em className="text-ravok-gold not-italic font-heading italic">actually auditable</em>.</>,
        description: (
            <StepBody
                body="Carta meets Robinhood for film. Cap table management, profit participation tracking, real-time distribution to every position on the waterfall — from above-the-line to grip."
                meta={[
                    <>Core product built</>,
                    <>Beta live at <strong className="text-[var(--ds-ink)]">merisbeta.com</strong></>,
                    <>First SPV onboarded</>,
                ]}
            />
        ),
        chip: "Card + SaaS",
        visual: <StepBadge num="02" label="Meris" />,
    },
    {
        tag: "AI Validation · 03",
        name: "Delphi",
        title: <>Audience signal <em className="text-ravok-gold not-italic font-heading italic">before</em> capital deploys.</>,
        description: (
            <StepBody
                body="Audience validation engine, talent analytics, and a project management Co-Pilot for every entertainment role. Data-backed greenlights instead of gut calls."
                meta={[
                    <><strong className="font-heading italic text-ravok-gold">880+</strong> films analyzed</>,
                    <><strong className="font-heading italic text-ravok-gold">70+</strong> talent analytics runs</>,
                    <><strong className="font-heading italic text-ravok-gold">7+</strong> AI agents deployed</>,
                ]}
            />
        ),
        chip: "Enterprise SaaS",
        visual: <StepBadge num="03" label="Delphi" />,
    },
    {
        tag: "Creator Economy · 04",
        name: "Phema",
        title: <>Direct-to-consumer distribution — <em className="text-ravok-gold not-italic font-heading italic">no studio deal required</em>.</>,
        description: (
            <StepBody
                body="Creator-first AVOD platform. The SPV owns its IP, controls its exit, and keeps the upside. Distribution stops being a tollbooth — it becomes a channel."
                meta={[
                    <>Frontend built</>,
                    <>Backend in development</>,
                    <>Creator-first economics</>,
                ]}
            />
        ),
        chip: "AVOD + Tips",
        visual: <StepBadge num="04" label="Phema" />,
    },
];

export default function Portfolio() {
    return (
        <ScrollytellSection
            zIndex={12}
            id="portfolio"
            label="The Portfolio"
            counterSuffix="THE PORTFOLIO"
            steps={portfolioSteps}
        />
    );
}
