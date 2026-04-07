"use client";

import { FadeIn } from "./FadeIn";

export default function QuoteSection() {
    return (
        <section className="bg-black py-32 px-6 flex flex-col items-center justify-center rounded-t-3xl shadow-2xl relative">
            <FadeIn>
                <div className="max-w-4xl mx-auto border-2 border-ravok-gold p-12 lg:p-16 text-center relative rounded-lg">
                    <h3 className="text-2xl lg:text-3xl font-heading leading-relaxed text-ravok-beige mb-6">
                        “What if we funded creators the way VCs fund founders?
                        What if films were structured like startups—with equity,
                        governance, and long-term thinking?”
                    </h3>
                    <p className="text-ravok-gold text-lg tracking-wider font-sans">
                        -Amanda Aoki, Founder.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.3}>
                <p className="text-center text-ravok-slate/60 text-sm tracking-[0.3em] uppercase mt-12">
                    That's exactly what we built.
                </p>
            </FadeIn>
        </section>
    );
}
