"use client";

import { FadeIn } from "@/components/shared/FadeIn";
import { Check, Eye } from "lucide-react";
import Link from "next/link";

export default function VentureModel() {
    return (
        <section id="model" className="py-24 lg:py-32 bg-ravok-charcoal/90 text-white border-t border-white/5 relative overflow-hidden rounded-t-3xl shadow-2xl">

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left Content */}
                <div className="max-w-2xl">
                    <FadeIn>
                        <h2 className="text-5xl lg:text-7xl font-heading leading-tight mb-8">
                            Not a Production Company. <br />
                            Not an Accelerator. <br />
                            <span className="text-ravok-gold">A Venture Studio.</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p className="text-ravok-slate font-sans text-sm tracking-wider uppercase leading-loose mb-12">
                            RAVOK APPLIES PROVEN VENTURE CAPITAL PRINCIPLES TO FILMMAKING. WE PROVIDE SEED
                            CAPITAL, STRUCTURE EACH PROJECT AS AN INDEPENDENT VENTURE, AND GIVE CREATORS REAL
                            EQUITY AND CONTROL.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <h3 className="text-xl font-bold mb-6">How It Works:</h3>
                        <ul className="space-y-6 mb-12">
                            {[
                                "Seed capital for development and packaging",
                                "Creator ownership through venture structure",
                                "Strategic support from development to distribution",
                                "Built to scale — turning projects into sustainable IP businesses"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-ravok-slate">
                                    <Check className="w-5 h-5 text-ravok-gold mt-1 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </FadeIn>

                    <FadeIn delay={0.4} className="flex items-center gap-4">
                        <Link
                            href="/our-model"
                            className="bg-ravok-gold text-black px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors"
                        >
                            LEARN MORE
                        </Link>
                        <button
                            type="button"
                            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                            aria-label="Watch"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </FadeIn>
                </div>

                {/* Right — Wireframe venture architecture */}
                <FadeIn delay={0.5} className="hidden lg:flex h-full min-h-[600px] items-center justify-center">
                    <svg viewBox="0 0 320 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs h-auto" aria-hidden="true">
                        {/* SPV structure — branching tree from seed to ventures */}
                        <g stroke="#C9A84C" strokeWidth="0.8">
                            {/* Root / seed */}
                            <circle cx="160" cy="520" r="16" strokeOpacity="0.5" />
                            <circle cx="160" cy="520" r="4" fill="#C9A84C" fillOpacity="0.15" strokeOpacity="0.6" />

                            {/* Trunk */}
                            <line x1="160" y1="504" x2="160" y2="380" strokeOpacity="0.4" />

                            {/* First branch level — 3 SPVs */}
                            <line x1="160" y1="380" x2="80" y2="300" strokeOpacity="0.4" />
                            <line x1="160" y1="380" x2="160" y2="280" strokeOpacity="0.4" />
                            <line x1="160" y1="380" x2="240" y2="300" strokeOpacity="0.4" />

                            {/* SPV nodes */}
                            <rect x="55" y="275" width="50" height="50" strokeOpacity="0.45" />
                            <rect x="135" y="255" width="50" height="50" strokeOpacity="0.45" />
                            <rect x="215" y="275" width="50" height="50" strokeOpacity="0.45" />

                            {/* Second branch — growth */}
                            <line x1="80" y1="275" x2="50" y2="200" strokeOpacity="0.3" />
                            <line x1="80" y1="275" x2="110" y2="200" strokeOpacity="0.3" />
                            <line x1="160" y1="255" x2="160" y2="170" strokeOpacity="0.3" />
                            <line x1="240" y1="275" x2="210" y2="200" strokeOpacity="0.3" />
                            <line x1="240" y1="275" x2="270" y2="200" strokeOpacity="0.3" />

                            {/* Top nodes — portfolio */}
                            <circle cx="50" cy="190" r="10" strokeOpacity="0.3" />
                            <circle cx="110" cy="190" r="10" strokeOpacity="0.3" />
                            <circle cx="160" cy="160" r="12" strokeOpacity="0.35" />
                            <circle cx="210" cy="190" r="10" strokeOpacity="0.3" />
                            <circle cx="270" cy="190" r="10" strokeOpacity="0.3" />

                            {/* Crown — upward arrows indicating growth */}
                            <line x1="160" y1="148" x2="160" y2="80" strokeOpacity="0.25" strokeDasharray="4 4" />
                            <polygon points="152,88 160,70 168,88" strokeOpacity="0.3" fill="none" />
                        </g>

                        {/* Blueprint tick marks */}
                        <g stroke="#E8E4DC" strokeWidth="0.3" strokeOpacity="0.1" strokeDasharray="2 4">
                            <line x1="20" y1="70" x2="20" y2="540" />
                            <line x1="300" y1="70" x2="300" y2="540" />
                        </g>

                        {/* Labels */}
                        <text x="160" y="558" textAnchor="middle" fill="#C9A84C" fillOpacity="0.3" fontSize="8" fontFamily="monospace" letterSpacing="2">SEED</text>
                        <text x="160" y="138" textAnchor="middle" fill="#C9A84C" fillOpacity="0.25" fontSize="7" fontFamily="monospace" letterSpacing="2">PORTFOLIO</text>
                    </svg>
                </FadeIn>

            </div>
        </section>
    );
}
