"use client";

import { FadeIn } from "./FadeIn";
import { Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroSection() {
    return (
        <section className="py-24 lg:py-32 px-6 bg-black text-white relative overflow-hidden rounded-t-3xl shadow-2xl">
            {/* Background Image Layer - Fixed Size */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/images/bg_image.png"
                    alt="Intro Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
            </div>

            <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                {/* Left Side - Text Content */}
                <div className="order-2 lg:order-1">
                    <FadeIn>
                        {/* Badge */}
                        <div className="mb-6">
                            <span className="inline-block rounded-md bg-ravok-gold/20 px-3 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-white sm:px-4 sm:py-2 sm:text-sm">
                                2025 Slate: Fully Committed
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
                        <img
                            src="/images/broken.png"
                            alt="Sculpture with laptop"
                            className="w-full h-auto max-h-[600px] lg:max-h-[700px] object-contain opacity-90 grayscale"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
