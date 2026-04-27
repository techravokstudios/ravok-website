"use client";

/**
 * ScrollytellSection — sticky-outer + translated track pattern.
 *
 * Outer is sticky h-screen at top (locks at top:0 once engaged so the next
 * section can flip over it). Inside the outer, the left column has a
 * "track" containing stacked steps (each h-screen). The track gets a
 * scroll-driven translateY so the steps slide UP through the viewport
 * as the user scrolls — text content actually MOVES, not cross-fades,
 * matching the sample's portfolio scrollytelling feel.
 *
 * A scroll-tracker div is rendered AFTER the section to provide the
 * scroll range that drives the track translation. Tracker height =
 * (N-1) × 100vh — that's the distance the track has to translate to
 * cycle through all N steps.
 *
 * Active step is computed from scroll progress (clamped to last step).
 * The pinned visual on the right cross-fades to match.
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
    const trackerRef = useRef<HTMLDivElement | null>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [trackY, setTrackY] = useState(0); // in vh
    const lastIdxRef = useRef(0);

    useEffect(() => {
        let rafId: number | null = null;
        const maxTranslateVh = (steps.length - 1) * 100;

        function update() {
            rafId = null;
            const tracker = trackerRef.current;
            if (!tracker) return;
            const r = tracker.getBoundingClientRect();
            // The transition phase uses the FIRST (N-1)*100vh of the tracker.
            // After that, the track stays at max translate (last step at top)
            // while the user scrolls the remaining tracker — which is when
            // section 7 rises up to cover. This gives the last step a clean
            // dwell + visible cover-from-below.
            const vh = window.innerHeight;
            const transitionRangePx = maxTranslateVh * vh / 100; // (N-1) * 100vh in px
            const scrolled = Math.max(0, -r.top);
            const transitionProgress = Math.min(1, scrolled / Math.max(1, transitionRangePx));
            const translateVh = -transitionProgress * maxTranslateVh;
            setTrackY(translateVh);
            // Active step = whichever step is currently at viewport top (round to nearest 100vh)
            const idx = Math.min(steps.length - 1, Math.max(0, Math.round(-translateVh / 100)));
            if (idx !== lastIdxRef.current) {
                lastIdxRef.current = idx;
                setActiveIdx(idx);
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
    }, [steps.length]);

    return (
        <>
            {/* Sticky scrollytell scene — exactly 100vh, locks at top */}
            <section
                id={id}
                className={`sticky top-0 h-screen w-full overflow-hidden section-card ${className}`.trim()}
                style={{
                    zIndex,
                    backgroundColor: "var(--ds-bg)",
                    backgroundImage: noTopFade
                        ? undefined
                        : "linear-gradient(to bottom, rgba(196,149,58,0.06) 0, transparent 200px)",
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 px-6 lg:px-[6vw] h-full max-w-[1500px] mx-auto w-full">
                    {/* Left — stacked text track that translates up with scroll */}
                    <div className="relative h-full overflow-hidden flex flex-col py-20 lg:py-24">
                        {label && <SectionLabel className="mb-10 lg:mb-14 flex-shrink-0">{label}</SectionLabel>}
                        <div className="relative flex-1 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 right-0"
                                style={{
                                    transform: `translateY(${trackY}vh)`,
                                    willChange: "transform",
                                }}
                            >
                                {steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="h-[80vh] flex flex-col justify-center transition-opacity duration-500"
                                        style={{ opacity: activeIdx === i ? 1 : 0.25 }}
                                    >
                                        {step.tag && (
                                            <span className="font-sans text-[0.56rem] font-semibold tracking-[0.3em] uppercase text-ravok-gold mb-4">
                                                {step.tag}
                                            </span>
                                        )}
                                        <h3 className="font-heading italic font-normal text-ravok-gold text-[clamp(2.5rem,4vw,3.5rem)] leading-[1] mb-5">
                                            {step.name}
                                        </h3>
                                        {step.title && (
                                            <h4 className="font-heading font-normal text-[1.5rem] lg:text-[1.7rem] leading-tight mb-4 text-[var(--ds-ink)]">
                                                {step.title}
                                            </h4>
                                        )}
                                        {step.description && (
                                            <p className="font-sans text-[1rem] leading-[1.65] text-[var(--ds-ink-dim)] max-w-[480px] mb-5">
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
                        </div>
                    </div>

                    {/* Right — pinned visual that cross-fades to match active step */}
                    <div className="relative hidden lg:flex items-center justify-center h-full">
                        {counterSuffix !== undefined && (
                            <div className="absolute top-[5vh] left-1/2 -translate-x-1/2 font-sans text-[13px] tracking-[0.3em] uppercase text-[var(--ds-ink-dim)] z-[3] whitespace-nowrap">
                                <span className="text-ravok-gold italic">
                                    {String(activeIdx + 1).padStart(2, "0")}
                                </span>{" "}
                                / {String(steps.length).padStart(2, "0")} — {counterSuffix}
                            </div>
                        )}
                        <div className="relative w-full aspect-square max-h-[75vh] mx-auto">
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
            </section>

            {/* Scroll tracker — invisible spacer that drives both the track
                translation and the page-flip into the next section.
                Total height = (N-1)*100vh transition + 100vh dwell on last step
                + 100vh during which the next sticky section rises and covers.
                The last 100vh is where section 7 flips up over the still-visible
                last step of section 6. */}
            <div
                ref={trackerRef}
                aria-hidden="true"
                style={{ height: `${(steps.length + 1) * 100}vh` }}
            />
        </>
    );
}
