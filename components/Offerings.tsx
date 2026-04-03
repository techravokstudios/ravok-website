"use client";

import { FadeIn } from "./FadeIn";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";

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
        <section className="py-32 bg-black text-white px-6 relative z-10 rounded-t-3xl shadow-2xl overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/bg_image.png"
                    alt="Offerings Background"
                    className="w-full h-full object-cover opacity-80 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/20 to-black pointer-events-none z-[1]" />

            <div className="container mx-auto relative z-10 pb-24">
                <div className="text-center mb-24">
                    <FadeIn>
                        <p className="text-ravok-gold uppercase tracking-[0.2em] text-xs font-bold mb-4">
                            Our 2025 slate proves the model works.
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
                                {/* Statue Image above the card */}
                                <div className="h-56 lg:h-72 w-full mb-0 lg:mb-[-50px] relative z-[1] flex justify-center overflow-hidden">
                                    <img
                                        src={`/images/${i + 1}.png`}
                                        alt={`${offer.title} sculpture`}
                                        className="h-full w-auto max-w-full object-contain opacity-70 group-hover:blur-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
                                    />
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
