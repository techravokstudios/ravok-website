"use client";

import { motion } from "framer-motion";

export default function Philosophy() {
    const textVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const
            }
        })
    };

    const items = [
        "Tech startups get seed funding to build MVPs.",
        "Hardware companies get capital for prototypes.",
        "Software founders get invested in before revenue."
    ];

    return (
        <section className="py-24 lg:py-32 px-6 bg-ravok-charcoal/90 text-white relative border-t border-white/5 overflow-hidden rounded-t-3xl shadow-2xl">

            <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Text Content */}
                <div className="order-2 lg:order-1">
                    <motion.p
                        className="text-xs font-sans tracking-widest text-ravok-slate uppercase mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Here's what we realized.
                    </motion.p>

                    <motion.h2
                        className="text-5xl lg:text-7xl font-heading font-thin leading-none mb-2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        In Every Other <br />
                        Industry,
                    </motion.h2>

                    <motion.h2
                        className="text-5xl lg:text-7xl font-heading text-ravok-gold leading-none mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        This Is Just Called R&D
                    </motion.h2>

                    <div className="space-y-4 text-xl font-sans font-light leading-relaxed text-gray-300">
                        {items.map((text, i) => (
                            <motion.p
                                key={i}
                                custom={i}
                                variants={textVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-ravok-gold before:rounded-full"
                            >
                                {text}
                            </motion.p>
                        ))}

                        <motion.p
                            className="pt-4 text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            But in Hollywood? Early-stage development is called "too risky."
                        </motion.p>
                    </div>

                    <motion.p
                        className="mt-8 text-xl lg:text-2xl text-ravok-gold font-heading italic"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        The real risk is letting gatekeepers decide what gets made.
                    </motion.p>
                </div>

                {/* Visual/Image */}
                <motion.div
                    className="order-1 lg:order-2 relative flex items-center justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    {/* Wireframe R&D beaker/flask — scientific methodology motif */}
                    <svg viewBox="0 0 360 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm h-auto" aria-hidden="true">
                        {/* Erlenmeyer flask wireframe */}
                        <g stroke="#C9A84C" strokeWidth="0.8">
                            {/* Flask neck */}
                            <line x1="155" y1="40" x2="155" y2="180" strokeOpacity="0.5" />
                            <line x1="205" y1="40" x2="205" y2="180" strokeOpacity="0.5" />
                            <line x1="145" y1="40" x2="215" y2="40" strokeOpacity="0.6" />
                            {/* Flask body — expanding */}
                            <line x1="155" y1="180" x2="80" y2="340" strokeOpacity="0.5" />
                            <line x1="205" y1="180" x2="280" y2="340" strokeOpacity="0.5" />
                            <line x1="80" y1="340" x2="280" y2="340" strokeOpacity="0.6" />
                            {/* Base */}
                            <rect x="70" y="340" width="220" height="12" strokeOpacity="0.4" />
                        </g>

                        {/* Internal reaction — bubbling circles */}
                        <g stroke="#C9A84C" strokeWidth="0.6" fill="none">
                            <circle cx="160" cy="280" r="12" strokeOpacity="0.3" />
                            <circle cx="200" cy="300" r="8" strokeOpacity="0.25" />
                            <circle cx="140" cy="310" r="10" strokeOpacity="0.2" />
                            <circle cx="220" cy="270" r="6" strokeOpacity="0.2" />
                            <circle cx="180" cy="250" r="5" strokeOpacity="0.15" />
                        </g>

                        {/* Connected nodes — R&D network */}
                        <g stroke="#E8E4DC" strokeWidth="0.5" strokeOpacity="0.25">
                            <circle cx="60" cy="120" r="4" />
                            <circle cx="300" cy="100" r="4" />
                            <circle cx="40" cy="240" r="4" />
                            <circle cx="320" cy="220" r="4" />
                            <line x1="60" y1="120" x2="155" y2="140" strokeDasharray="3 5" />
                            <line x1="300" y1="100" x2="205" y2="130" strokeDasharray="3 5" />
                            <line x1="40" y1="240" x2="120" y2="280" strokeDasharray="3 5" />
                            <line x1="320" y1="220" x2="240" y2="270" strokeDasharray="3 5" />
                        </g>

                        {/* Blueprint dimension lines */}
                        <g stroke="#E8E4DC" strokeWidth="0.3" strokeOpacity="0.12" strokeDasharray="2 4">
                            <line x1="30" y1="40" x2="30" y2="355" />
                            <line x1="330" y1="40" x2="330" y2="355" />
                        </g>

                        {/* Gold glow at reaction center */}
                        <circle cx="180" cy="290" r="50" fill="url(#philGlow)" />
                        <defs>
                            <radialGradient id="philGlow">
                                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.06" />
                                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}
