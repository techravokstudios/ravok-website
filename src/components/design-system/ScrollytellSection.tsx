"use client";

/**
 * ScrollytellSection — portfolio scrollytelling pattern.
 * Per the sample's `.portfolio` section.
 *
 * Layout:
 *   2-column grid. Left = stacked text steps (each min-h 90vh, opacity 0.22 default,
 *   full opacity when "active"). Right = pinned visual (sticky top:0 h-screen) that
 *   cross-fades between step visuals as the active step changes.
 *
 * Active step detection:
 *   On every scroll, the step whose vertical center is closest to the viewport
 *   center wins. (Same algorithm as the sample.)
 *
 * z-index/cover behavior:
 *   The outer section is position:relative with the section's z-index. As the
 *   user scrolls in, this section's z-index covers prior sticky sections via
 *   stacking context. The next section (Partners or wherever) needs higher z
 *   to cover this one when it enters.
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import { SectionLabel } from "./SectionLabel";

export type ScrollytellStep = {
    /** Small uppercase tag, e.g. "Entertainment · 01" */
    tag?: string;
    /** Big italic gold name, e.g. "Film SPVs" */
    name: ReactNode;
    /** Heading sentence (serif, with optional <em> for gold accents) */
    title?: ReactNode;
    /** Body paragraph */
    description?: ReactNode;
    /** Pill chip at the bottom, e.g., "10–50% Equity" */
    chip?: string;
    /** The pinned visual for this step (img, icon, anything) */
    visual: ReactNode;
};

type ScrollytellSectionProps = {
    zIndex?: number;
    /** Eyebrow label at the top of the text column */
    label?: string;
    /** Counter suffix, e.g., "THE PORTFOLIO". If undefined, counter hidden. */
    counterSuffix?: string;
    steps: ScrollytellStep[];
    id?: string;
    className?: string;
    noTopFade?: boolean;
};

export function ScrollytellSection({
    zIndex = 11,
    label,
    counterSuffix,
    steps,
    id,
    className = "",
    noTopFade = false,
}: ScrollytellSectionProps) {
    const [activeIdx, setActiveIdx] = useState(0);
    const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        // rAF-throttled scroll handler. Without this we ran getBoundingClientRect
        // on every step on every scroll event (60+/sec), forcing layout each time.
        // Now we batch into one update per frame, max.
        let rafId: number | null = null;
        let lastActive = -1;

        function update() {
            rafId = null;
            const viewportCenter = window.innerHeight / 2;
            let active = 0;
            let bestDist = Infinity;
            for (let i = 0; i < stepRefs.current.length; i++) {
                const el = stepRefs.current[i];
                if (!el) continue;
                const r = el.getBoundingClientRect();
                const stepCenter = r.top + r.height / 2;
                const dist = Math.abs(viewportCenter - stepCenter);
                if (dist < bestDist) {
                    bestDist = dist;
                    active = i;
                }
            }
            // Only setState if value actually changed — avoids React re-render churn.
            if (active !== lastActive) {
                lastActive = active;
                setActiveIdx(active);
            }
        }

        function onScroll() {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(update);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        update();
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section
            id={id}
            className={`relative section-card ${className}`.trim()}
            style={{
                zIndex,
                backgroundColor: "var(--ds-bg)",
                // Grid is now global (body::before z=99) — no per-section grid bg
                // so we skip the costly background-attachment: fixed paints.
                backgroundImage: noTopFade
                    ? undefined
                    : "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-6 lg:px-[6vw] pt-24 pb-0">
                {/* Left — scrolling text steps */}
                <div className="relative z-[2]">
                    {label && <SectionLabel className="mb-16 lg:mb-20">{label}</SectionLabel>}
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                stepRefs.current[i] = el;
                            }}
                            className={`min-h-[90vh] lg:min-h-[90vh] flex flex-col justify-center transition-opacity duration-500 py-4 ${
                                activeIdx === i ? "opacity-100" : "opacity-25"
                            }`}
                        >
                            {step.tag && (
                                <span className="font-sans text-[0.56rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-4">
                                    {step.tag}
                                </span>
                            )}
                            <h3 className="font-heading italic font-normal text-ravok-gold text-[clamp(2.5rem,4vw,3.5rem)] leading-[1] mb-6">
                                {step.name}
                            </h3>
                            {step.title && (
                                <h4 className="font-heading font-normal text-[1.6rem] lg:text-[1.8rem] leading-tight mb-5 text-[var(--ds-ink)]">
                                    {step.title}
                                </h4>
                            )}
                            {step.description && (
                                <p className="font-heading text-[1rem] lg:text-[1.05rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[480px] mb-6">
                                    {step.description}
                                </p>
                            )}
                            {step.chip && (
                                <span className="self-start font-sans text-[0.58rem] font-semibold tracking-[0.22em] uppercase px-[0.9rem] py-2 border border-[rgba(196,149,58,0.3)] rounded-full text-ravok-gold">
                                    {step.chip}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right — pinned visual */}
                <div className="relative hidden lg:block">
                    <div className="sticky top-0 h-screen flex items-center justify-center">
                        {counterSuffix !== undefined && (
                            <div className="absolute top-[5vh] left-1/2 -translate-x-1/2 font-heading text-[13px] tracking-[0.3em] uppercase text-[var(--ds-ink-dim)] z-[3] whitespace-nowrap">
                                <span className="text-ravok-gold italic">
                                    {String(activeIdx + 1).padStart(2, "0")}
                                </span>{" "}
                                / {String(steps.length).padStart(2, "0")} — {counterSuffix}
                            </div>
                        )}
                        <div className="relative w-full aspect-square max-h-[80vh] mx-auto">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                                        activeIdx === i ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    {step.visual}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
