"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
    const sectionRef = useRef(null);
    const { scrollY } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Transform logic with smooth transitions: 
    // As scroll goes from 0 to 500px:
    // 1. Tagline fades out (opacity 1 -> 0)
    // 2. RAVOK text scales down (large -> small) and moves slightly up/left to 'pass off' to the navbar

    // Logo animations with smooth transitions - extended ranges for smoother feel
    const logoScale = useTransform(
        scrollY, 
        [0, 450], 
        [1, 0.35],
        { clamp: true }
    );
    const logoY = useTransform(
        scrollY, 
        [0, 450], 
        ["0%", "-75%"],
        { clamp: true }
    );
    const logoOpacity = useTransform(
        scrollY, 
        [400, 550], 
        [1, 0],
        { clamp: true }
    );

    // Tagline animations with smooth fade - extended range
    const taglineOpacity = useTransform(
        scrollY, 
        [0, 250], 
        [1, 0],
        { clamp: true }
    );
    const taglineY = useTransform(
        scrollY, 
        [0, 250], 
        [0, 25],
        { clamp: true }
    );
    
    // Parallax background with smooth movement - reduced intensity for smoother feel
    const backgroundY = useTransform(
        scrollY,
        [0, 1200],
        ["0%", "25%"],
        { clamp: true }
    );

    return (
        <section 
            ref={sectionRef} 
            className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            {/* Background Image - Smooth Parallax Effect */}
            <motion.div
                className="absolute inset-0 z-0 will-change-transform"
                style={{ 
                    y: backgroundY,
                    transform: "translateZ(0)", // Force hardware acceleration
                }}
            >
                <img
                    src="/images/bg_image.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-80"
                    style={{ 
                        willChange: 'transform',
                        transform: "translateZ(0)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black" />
                {/* Vignette for depth - hero effect only */}
                <div className="absolute inset-0 shadow-[inset_0_0_120px_60px_rgba(0,0,0,0.4)] pointer-events-none" />
            </motion.div>

            <div className="z-10 text-center flex flex-col items-center px-4 fixed inset-0 pointer-events-none flex justify-center items-center">
                {/* The Logo Graphic Text - Smooth Animated */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.21, 0.47, 0.32, 0.98],
                        delay: 0.2,
                    }}
                    style={{ 
                        scale: logoScale, 
                        y: logoY, 
                        opacity: logoOpacity,
                        transform: "translateZ(0)", // Force hardware acceleration
                    }} 
                    className="origin-center will-change-transform"
                >
                    <img
                        src="/images/logo.png"
                        alt="RAVOK"
                        className="w-[60vw] lg:w-[40vw] max-w-4xl object-contain opacity-90"
                        style={{ 
                            willChange: 'transform',
                            transform: "translateZ(0)",
                        }}
                    />
                </motion.div>

                {/* Tagline - Smooth Fade Out */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1,
                        ease: [0.21, 0.47, 0.32, 0.98],
                        delay: 0.8,
                    }}
                    style={{ 
                        opacity: taglineOpacity, 
                        y: taglineY,
                        transform: "translateZ(0)", // Force hardware acceleration
                    }}
                    className="will-change-transform"
                >
                    <motion.div 
                        className="h-px w-24 bg-ravok-gold my-8 mx-auto origin-center"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ 
                            duration: 0.8, 
                            delay: 1.2, 
                            ease: [0.21, 0.47, 0.32, 0.98] 
                        }}
                    />
                    <motion.p 
                        className="text-sm lg:text-lg font-sans tracking-[0.3em] text-ravok-slate uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                            duration: 0.8, 
                            delay: 1.4,
                            ease: "easeOut"
                        }}
                    >
                        A New Architecture for Entertainment
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
