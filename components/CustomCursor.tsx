"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const canUseCustomCursor =
            window.matchMedia("(pointer: fine)").matches &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        setIsEnabled(canUseCustomCursor);
        if (!canUseCustomCursor) return;
        document.documentElement.classList.add("custom-cursor-enabled");

        const mouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if target is clickable
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-pointer")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            document.documentElement.classList.remove("custom-cursor-enabled");
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    // Don't render anything until mounted on client
    if (!isMounted || !isEnabled) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 bg-ravok-gold rounded-full mix-blend-difference pointer-events-none z-[9999]"
            animate={{
                x: mousePosition.x - (isHovering ? 20 : 6),
                y: mousePosition.y - (isHovering ? 20 : 6),
                width: isHovering ? 40 : 12,
                height: isHovering ? 40 : 12,
                opacity: 1
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
        />
    );
};
