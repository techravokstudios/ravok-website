"use client";

/**
 * CRevealSection — the C-reveal pattern (cover-from-below).
 * Per WEBSITE-TECHNICAL-RULES.md §2c, §10, §11.
 *
 * Each section sticks at top, next section rises and covers it.
 * Solid background + per-section grid + gold top fade + page-pass edges.
 *
 * Use for: manifestos, comparisons, portfolio grids, team grids,
 * proof metrics, FAQs, CTAs. NOT for scrollytelling content.
 *
 * Z-index: pass via `zIndex` prop. The page composes the ladder ascending.
 *
 * Standardized header slot (eyebrow / headline / lead) is optional —
 * pass children for full custom layout.
 */

import { ReactNode } from "react";
import { SectionLabel } from "./SectionLabel";

type CRevealSectionProps = {
    /** z-index slot in the C-ladder (e.g., 11, 12, 13...) */
    zIndex?: number;
    /** Optional gold eyebrow above headline */
    eyebrow?: ReactNode;
    /** Optional section headline (renders as h2, serif, light weight) */
    headline?: ReactNode;
    /** Optional lead paragraph beneath headline */
    lead?: ReactNode;
    /** Main section content */
    children?: ReactNode;
    /** Anchor id (for in-page navigation) */
    id?: string;
    /** Tailwind container max-width override (default 1200px) */
    contentMaxWidth?: string;
    /** Center the standardized header? Default true. */
    centerHeader?: boolean;
    /** Disable sticky behavior (e.g., first reveal section after hero) */
    nonSticky?: boolean;
    /** Vertical padding override */
    paddingY?: string;
    /** Extra classes on the section element */
    className?: string;
    /** Hide the gold top fade (e.g., if used outside the C-ladder) */
    noTopFade?: boolean;
};

export function CRevealSection({
    zIndex = 11,
    eyebrow,
    headline,
    lead,
    children,
    id,
    contentMaxWidth = "1200px",
    centerHeader = true,
    nonSticky = false,
    paddingY = "py-20 lg:py-24",
    className = "",
    noTopFade = false,
}: CRevealSectionProps) {
    const positionClass = nonSticky ? "relative" : "sticky top-0";
    // Sticky sections need to fit content in 100vh (or 100dvh on mobile to handle
    // browser chrome). Non-sticky sections size to content.
    // We use min-h-[100dvh] for sticky so the cover effect locks at the visible
    // viewport height. Content inside MUST fit; otherwise it gets clipped by
    // the next sticky covering from below.
    const heightClass = nonSticky ? "" : "min-h-[100dvh]";

    return (
        <section
            id={id}
            className={`${positionClass} ${heightClass} ${paddingY} px-6 lg:px-10 section-card ${className}`.trim()}
            style={{
                zIndex,
                // Per-section grid removed — was forcing repaints via
                // background-attachment: fixed across every stacked section. The
                // wireframe grid is now a single fixed overlay (body::before in
                // globals.css, z-index 99) so it's painted once and stays aligned
                // across all sections. We keep just the gold top-fade + solid bg here.
                backgroundImage: noTopFade
                    ? undefined
                    : "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                backgroundColor: "var(--ds-bg)",
            }}
        >
            <div
                className={`relative z-10 mx-auto w-full ${centerHeader ? "text-center" : ""}`.trim()}
                style={{ maxWidth: contentMaxWidth }}
            >
                {(eyebrow || headline || lead) && (
                    <header className={`mb-10 ${centerHeader ? "" : "max-w-[820px]"}`.trim()}>
                        {eyebrow && (typeof eyebrow === "string" ? <SectionLabel>{eyebrow}</SectionLabel> : eyebrow)}
                        {headline && (
                            <h2 className="font-heading font-normal text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-4">
                                {headline}
                            </h2>
                        )}
                        {lead && (
                            <p className="font-sans text-[1rem] lg:text-[1.05rem] leading-[1.6] text-[var(--ds-ink-dim)] max-w-[680px] mx-auto">
                                {lead}
                            </p>
                        )}
                    </header>
                )}
                {children}
            </div>
        </section>
    );
}
