"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Philosophy() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
        <section className="py-24 lg:py-32 px-6 bg-black text-white relative border-t border-white/5 overflow-hidden rounded-t-3xl shadow-2xl">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/philosophy.png"
                    alt="Philosophy Background"
                    className="w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            </div>

            {/* Animated background particles - only render on client */}
            {isMounted && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-ravok-gold/20 rounded-full"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * 800,
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: [null, Math.random() * 800],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>
            )}

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
                    <motion.img
                        src="/images/slide1.png"
                        alt="R&D Philosophy"
                        className="w-full max-w-lg object-contain opacity-90"
                        whileHover={{ scale: 1.05, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
