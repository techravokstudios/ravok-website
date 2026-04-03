"use client";

import { FadeIn } from "./FadeIn";
import { Check, Eye } from "lucide-react";
import Link from "next/link";

export default function VentureModel() {
    return (
        <section id="model" className="py-24 lg:py-32 bg-zinc-950 text-white border-t border-white/5 relative overflow-hidden rounded-t-3xl shadow-2xl">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/ventureModel.png"
                    alt="Venture Model Background"
                    className="w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-zinc-950/80 to-black" />
            </div>

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

                {/* Right Image (Statue) */}
                <FadeIn delay={0.5} className="hidden lg:block h-full min-h-[600px] relative">
                    {/* Placeholder for the Torso Statue */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent z-10" />
                    <img
                        src="/images/bg_1.png"
                        alt="Venture Studio Statue"
                        className="w-full h-full object-cover grayscale opacity-60 mix-blend-lighten"
                    />
                </FadeIn>

            </div>
        </section>
    );
}
