"use client";

import { FadeIn } from "@/components/shared/FadeIn";
import { Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroSection() {
    return (
        <section className="py-24 lg:py-32 px-6 bg-ravok-charcoal/90 text-white relative overflow-hidden rounded-t-3xl shadow-2xl">

            <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                {/* Left Side - Text Content */}
                <div className="order-2 lg:order-1">
                    <FadeIn>
                        {/* Badge */}
                        <div className="mb-6">
                            <span className="inline-block rounded-md bg-ravok-gold/20 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-white sm:px-4 sm:py-2 sm:text-sm">
                                2026 Slate: Fully Committed
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h2 className="text-4xl lg:text-6xl font-heading mb-4 leading-tight">
                            <span className="text-white">The System Is Broken.</span>
                            <br />
                            <span className="text-ravok-gold">We Built a New One.</span>
                        </h2>

                        {/* Description */}
                        <p className="text-base lg:text-lg text-gray-300 font-sans leading-relaxed mb-8 max-w-xl">
                            RAVOK STUDIOS is the first venture studio turning filmmakers into founders—and films into sustainable businesses.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="#investors"
                                className="rounded-full bg-ravok-gold px-6 py-3 font-sans text-xs font-medium uppercase tracking-wider text-white transition hover:bg-ravok-gold/80 sm:px-8 sm:py-4 sm:text-sm"
                            >
                                Partner with us
                            </Link>
                            <button
                                type="button"
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/5 transition hover:bg-white/10 sm:h-14 sm:w-14"
                                aria-label="Watch"
                            >
                                <Eye className="h-5 w-5 text-ravok-gold sm:h-6 sm:w-6" />
                            </button>
                        </div>
                    </FadeIn>
                </div>

                {/* Right Side - Image */}
                <motion.div
                    className="order-1 lg:order-2 relative flex items-center justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div className="w-full min-h-[500px] lg:min-h-[600px] relative flex items-center justify-center">
                        {/* Wireframe shattered geometric sculpture — "broken system" */}
                        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md h-auto opacity-80" aria-hidden="true">
                            {/* Shattered polyhedron — fragments separating */}
                            <g stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.6">
                                {/* Main broken form — left fragment */}
                                <polygon points="120,80 180,40 200,120 150,160" strokeOpacity="0.5" />
                                <polygon points="150,160 200,120 220,180 170,200" strokeOpacity="0.4" />
                                <line x1="120" y1="80" x2="170" y2="200" strokeOpacity="0.2" strokeDasharray="4 6" />

                                {/* Right fragment — displaced */}
                                <polygon points="230,60 300,90 280,170 220,140" strokeOpacity="0.5" />
                                <polygon points="220,140 280,170 260,240 210,210" strokeOpacity="0.4" />
                                <line x1="230" y1="60" x2="210" y2="210" strokeOpacity="0.2" strokeDasharray="4 6" />

                                {/* Center crack lines */}
                                <line x1="200" y1="120" x2="220" y2="140" strokeOpacity="0.7" strokeWidth="1" />
                                <line x1="200" y1="120" x2="190" y2="155" strokeOpacity="0.3" strokeDasharray="3 5" />

                                {/* Lower fragments — cascading */}
                                <polygon points="140,240 200,220 210,300 160,310" strokeOpacity="0.45" />
                                <polygon points="210,250 270,230 280,310 220,320" strokeOpacity="0.4" />
                                <polygon points="160,310 210,300 220,370 175,380" strokeOpacity="0.35" />
                                <polygon points="220,320 280,310 290,380 240,390" strokeOpacity="0.3" />

                                {/* Floating debris */}
                                <polygon points="90,180 110,170 115,195 95,200" strokeOpacity="0.25" />
                                <polygon points="300,200 320,185 325,210 305,220" strokeOpacity="0.25" />
                                <polygon points="180,400 195,390 200,415 185,420" strokeOpacity="0.2" />
                                <polygon points="260,400 275,395 278,418 263,422" strokeOpacity="0.2" />
                            </g>

                            {/* Dimension/blueprint lines */}
                            <g stroke="#E8E4DC" strokeWidth="0.4" strokeOpacity="0.15" strokeDasharray="2 4">
                                <line x1="100" y1="40" x2="100" y2="450" />
                                <line x1="300" y1="40" x2="300" y2="450" />
                                <line x1="100" y1="250" x2="300" y2="250" />
                            </g>

                            {/* Subtle gold accent glow at fracture point */}
                            <circle cx="210" cy="150" r="60" fill="url(#introGlow)" />
                            <defs>
                                <radialGradient id="introGlow">
                                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.08" />
                                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
