"use client";

import { FadeIn } from "@/components/shared/FadeIn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function OfferingIcon({ index }: { index: number }) {
    if (index === 0) {
        // Film Ventures — wireframe film reel / clapperboard
        return (
            <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto max-h-[220px] opacity-70 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
                <g stroke="#C9A84C" strokeWidth="0.8">
                    {/* Film reel circle */}
                    <circle cx="100" cy="120" r="70" strokeOpacity="0.4" />
                    <circle cx="100" cy="120" r="50" strokeOpacity="0.3" />
                    <circle cx="100" cy="120" r="12" strokeOpacity="0.5" />
                    {/* Spokes */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => {
                        const rad = (angle * Math.PI) / 180;
                        return <line key={angle} x1={100 + 12 * Math.cos(rad)} y1={120 + 12 * Math.sin(rad)} x2={100 + 50 * Math.cos(rad)} y2={120 + 50 * Math.sin(rad)} strokeOpacity="0.25" />;
                    })}
                    {/* Sprocket holes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                        const rad = (angle * Math.PI) / 180;
                        return <circle key={angle} cx={100 + 60 * Math.cos(rad)} cy={120 + 60 * Math.sin(rad)} r="4" strokeOpacity="0.3" />;
                    })}
                </g>
            </svg>
        );
    }
    if (index === 1) {
        // Production Labels — wireframe building/pillars
        return (
            <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto max-h-[220px] opacity-70 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
                <g stroke="#C9A84C" strokeWidth="0.8">
                    {/* Pediment */}
                    <polygon points="100,30 30,80 170,80" strokeOpacity="0.5" fill="none" />
                    {/* Entablature */}
                    <rect x="25" y="80" width="150" height="10" strokeOpacity="0.4" />
                    {/* Columns */}
                    {[50, 90, 110, 150].map((x) => (
                        <g key={x}>
                            <rect x={x - 6} y="90" width="12" height="120" strokeOpacity="0.35" />
                            <line x1={x - 3} y1="92" x2={x - 3} y2="208" strokeOpacity="0.15" />
                            <line x1={x + 3} y1="92" x2={x + 3} y2="208" strokeOpacity="0.15" />
                        </g>
                    ))}
                    {/* Base */}
                    <rect x="20" y="210" width="160" height="8" strokeOpacity="0.4" />
                    <rect x="15" y="218" width="170" height="6" strokeOpacity="0.3" />
                </g>
            </svg>
        );
    }
    // Tech Ventures — wireframe circuit/network
    return (
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto max-h-[220px] opacity-70 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
            <g stroke="#C9A84C" strokeWidth="0.8">
                {/* Central processor */}
                <rect x="70" y="90" width="60" height="60" strokeOpacity="0.5" />
                <rect x="80" y="100" width="40" height="40" strokeOpacity="0.3" />
                {/* Pins / connections */}
                {[80, 100, 120].map((x) => (
                    <g key={`v${x}`}>
                        <line x1={x} y1="90" x2={x} y2="60" strokeOpacity="0.3" />
                        <line x1={x} y1="150" x2={x} y2="180" strokeOpacity="0.3" />
                        <circle cx={x} cy="55" r="3" strokeOpacity="0.25" />
                        <circle cx={x} cy="185" r="3" strokeOpacity="0.25" />
                    </g>
                ))}
                {[100, 120].map((y) => (
                    <g key={`h${y}`}>
                        <line x1="70" y1={y} x2="40" y2={y} strokeOpacity="0.3" />
                        <line x1="130" y1={y} x2="160" y2={y} strokeOpacity="0.3" />
                        <circle cx="35" cy={y} r="3" strokeOpacity="0.25" />
                        <circle cx="165" cy={y} r="3" strokeOpacity="0.25" />
                    </g>
                ))}
                {/* Outer network nodes */}
                <circle cx="30" cy="50" r="5" strokeOpacity="0.2" />
                <circle cx="170" cy="50" r="5" strokeOpacity="0.2" />
                <circle cx="30" cy="190" r="5" strokeOpacity="0.2" />
                <circle cx="170" cy="190" r="5" strokeOpacity="0.2" />
                <line x1="33" y1="53" x2="77" y2="87" strokeOpacity="0.15" strokeDasharray="3 4" />
                <line x1="167" y1="53" x2="123" y2="87" strokeOpacity="0.15" strokeDasharray="3 4" />
                <line x1="33" y1="187" x2="77" y2="153" strokeOpacity="0.15" strokeDasharray="3 4" />
                <line x1="167" y1="187" x2="123" y2="153" strokeOpacity="0.15" strokeDasharray="3 4" />
            </g>
        </svg>
    );
}

export default function Offerings() {
    const offerings = [
        {
            title: "Film Ventures",
            description: "Each film project is launched as a Special Purpose Vehicle (SPV)—a standalone company that we co-found and incorporate with the creative partner. Ravok deploys pre-seed development capital to complete packaging and attract external financing. This creates creator-driven cinema structured for commercial success while maintaining artistic integrity. Our partnership model means the equity stake is determined by the development stage at which the creative co-founder joins.",
            footer: "Projects",
            stats: "4 in development, 1 financing"
        },
        {
            title: "Production Labels",
            description: "We build the next generation of IP engines by developing and managing specialized production subsidiaries. These subsidiaries are designed to function as repeatable venture pipelines, continuously spinning up new SPVs. Each label focuses on a specific genre or audience niche, allowing it to tailor development, marketing, and acquisition strategies to a broad, underserved market. This strategy eliminates single-project risk by creating a self-sustaining ecosystem that curates talent and develops franchises, owning the upside of IP creation.",
            footer: "Divisions",
            stats: "4"
        },
        {
            title: "Tech Ventures",
            description: "Our dedicated Tech Ventures pillar is where we incubate, incorporate, and scale proprietary technology companies. This infrastructure is designed to eliminate traditional media gatekeepers and give creators direct relationships with their audiences. These ventures focus on capturing valuable first-party audience data on engagement and narrative preferences, feeding this information back into the studio’s greenlight process to quantitatively de-risk future ventures and provide measurable returns.",
            footer: "Ventures",
            stats: "3 in development, 1 in validation stage"
        }
    ];

    return (
        <section className="py-32 bg-ravok-charcoal/90 text-white px-6 relative z-10 rounded-t-3xl shadow-2xl overflow-hidden">

            <div className="container mx-auto relative z-10 pb-24">
                <div className="text-center mb-24">
                    <FadeIn>
                        <p className="text-ravok-gold uppercase tracking-[0.2em] text-xs font-bold mb-4">
                            Our 2026 slate proves the model works.
                        </p>
                        <h2 className="text-5xl lg:text-7xl font-heading mb-4">
                            Here's what we offer
                        </h2>
                        <p className="text-ravok-gold font-heading text-3xl font-normal">
                            All Structured for Success.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="max-w-3xl mx-auto mt-8 text-ravok-slate text-sm font-sans">
                            Our focus is in rebuilding the system. Our inaugural portfolio is fully committed, structured, and in development. Each venture is an independent entity with creator ownership, GTM, legal entity set, initial backing, and strategic partners attached.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 gap-y-16 lg:gap-y-8 text-center pt-20 relative">
                    {offerings.map((offer, i) => (
                        <div key={`offering-${i}-${offer.title}`} className="relative isolate mb-12 lg:mb-0 w-full">
                            <FadeIn delay={0.2 + (i * 0.2)} className="relative group w-full">
                                {/* Wireframe icon above the card */}
                                <div className="h-56 lg:h-72 w-full mb-0 lg:mb-[-50px] relative z-[1] flex justify-center items-center overflow-hidden">
                                    <OfferingIcon index={i} />
                                </div>

                                <div className="border border-ravok-gold p-4 lg:p-5 bg-black/90 backdrop-blur-md relative z-[2] h-full flex flex-col items-center hover:bg-zinc-950 transition-colors duration-500 shadow-2xl shadow-black mt-8 lg:mt-0">
                                    <h3 className="text-xl font-heading text-ravok-beige mb-2 pb-2 border-b border-white/10 w-full">
                                        {offer.title}
                                    </h3>

                                    <p className="text-sm text-ravok-slate leading-relaxed font-sans mb-4 flex-grow text-justify">
                                        {offer.description}
                                    </p>

                                    <div className="w-full flex justify-between items-center text-xs text-ravok-gold uppercase tracking-wider mb-3 border-t border-white/10 pt-2">
                                        <span>{offer.footer}</span>
                                        <span className="text-white">{offer.stats}</span>
                                    </div>

                                    <Link href="/contact-us" className="border border-ravok-gold/30 text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-ravok-gold hover:text-black transition-all flex items-center justify-center gap-2 w-full">
                                        Contact us <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </FadeIn>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
