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
    paddingY = "py-32",
    className = "",
    noTopFade = false,
}: CRevealSectionProps) {
    const positionClass = nonSticky ? "relative" : "sticky top-0";
    // Sticky sections need exactly 100vh to play the cover-from-below role.
    // Non-sticky sections size to content (no forced 100vh, so tall content
    // displays in full instead of being clipped by the next sticky covering it).
    const heightClass = nonSticky ? "" : "min-h-screen";

    return (
        <section
            id={id}
            className={`${positionClass} ${heightClass} ${paddingY} px-10 section-card ${className}`.trim()}
            style={{
                zIndex,
                // Layered background: gold top fade + per-section grid (vertical + horizontal) + solid bg
                backgroundImage: [
                    !noTopFade && "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                    "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    "linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                ]
                    .filter(Boolean)
                    .join(", "),
                backgroundSize: noTopFade
                    ? "80px 80px, 80px 80px"
                    : "100% 100%, 80px 80px, 80px 80px",
                backgroundColor: "var(--ds-bg)",
            }}
        >
            <div
                className={`relative z-10 mx-auto w-full ${centerHeader ? "text-center" : ""}`.trim()}
                style={{ maxWidth: contentMaxWidth }}
            >
                {(eyebrow || headline || lead) && (
                    <header className={`mb-16 ${centerHeader ? "" : "max-w-[820px]"}`.trim()}>
                        {eyebrow && (typeof eyebrow === "string" ? <SectionLabel>{eyebrow}</SectionLabel> : eyebrow)}
                        {headline && (
                            <h2 className="font-heading font-normal text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] tracking-[-0.015em] text-[var(--ds-ink)] mb-6">
                                {headline}
                            </h2>
                        )}
                        {lead && (
                            <p className="font-heading text-[1.15rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[720px] mx-auto">
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
