"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser } from "@/lib/api";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
    const isHomePage = pathname === "/";

    // After mount, read stored user so we show Dashboard when logged in (avoids hydration mismatch)
    useEffect(() => {
        setUser(getStoredUser());
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // On home: show logo only after scrolling. On other pages: always show logo.
            setShowLogo(!isHomePage || scrollPosition > 500);

            if (scrollPosition > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        handleScroll(); // run once for initial pathname
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]);

    // Body scroll lock when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close mobile menu when route changes (e.g. after tapping a link)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Build nav items dynamically so "INVESTORS" behaves by role:
    // - Logged out: shows INVESTORS -> /login
    // - Investor: shows INVESTOR -> /investor
    // - Admin: hides the Investor entry entirely
    const navItems = (() => {
        const items = [
            { href: "/", label: "HOME" },
            { href: "/about-us", label: "ABOUT US" },
            { href: "/our-model", label: "OUR MODEL" },
            { href: "/insights", label: "INSIGHTS" },
            { href: "/contact-us", label: "CONTACT US" },
        ] as { href: string; label: string }[];
        if (!user) {
            items.splice(2, 0, { href: "/login", label: "INVESTORS" });
        } else if (user.role !== "admin") {
            items.splice(2, 0, { href: "/investor", label: "INVESTOR" });
        }
        return items;
    })();

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full z-[100] text-white transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : ''
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                {/* Mobile Menu Button - large tap target for touch */}
                <button
                    type="button"
                    className="lg:hidden z-[110] min-w-[44px] min-h-[44px] flex items-center justify-center -m-2 p-3 touch-manipulation"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.div>
                </button>

                {/* Logo - Visible on scroll (home) or always (other pages) */}
                <motion.div
                    className="transition-opacity duration-500 min-w-[80px] flex justify-center lg:justify-start"
                    animate={{ opacity: (!isHomePage || showLogo) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="block">
                        <motion.img
                            src="/images/logo.png"
                            alt="RAVOK"
                            className="h-10 w-auto object-contain"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        />
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-12 font-sans text-sm tracking-widest text-white">
                    {navItems.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            <Link
                                href={item.href}
                                className="relative group"
                            >
                                <span className="relative z-10 text-white group-hover:text-ravok-gold transition-colors duration-300">
                                    {item.label}
                                </span>
                                <motion.span
                                    className="absolute -bottom-1 left-0 w-0 h-px bg-ravok-gold group-hover:w-full transition-all duration-300"
                                />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Login & Register (when not logged in) or Dashboard (when logged in) */}
                <motion.div
                    className="hidden lg:flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {user ? (
                        <Link
                            href={user.role === "admin" ? "/admin" : user.status === "approved" ? "/investor" : "/pending"}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                className="flex items-center gap-2 px-6 py-2 border border-ravok-gold/50 bg-ravok-gold/10 text-ravok-gold text-xs tracking-widest transition-all overflow-hidden relative group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="relative z-10">DASHBOARD</span>
                            </motion.div>
                        </Link>
                    ) : (
                        <>
                            <Link href="/register">
                                <span className="text-white/80 hover:text-ravok-gold font-sans text-xs tracking-widest transition-colors duration-300">
                                    REGISTER
                                </span>
                            </Link>
                            <Link href="/login">
                                <motion.div
                                    className="px-6 py-2 border border-white/20 text-xs tracking-widest transition-all overflow-hidden relative group"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">LOGIN</span>
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Mobile Menu Overlay - high z-index so it sits above all page content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className="fixed inset-0 min-h-screen min-h-[100dvh] bg-black z-[90] flex flex-col items-center justify-center gap-8 text-xl font-heading touch-manipulation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item, i) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: i * 0.1 }}
                                className="py-2"
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-ravok-gold transition-colors block py-2 px-4 -mx-4"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: navItems.length * 0.1 }}
                            className="flex gap-6 pt-4 border-t border-white/10"
                        >
                            {user ? (
                                <Link
                                    href={user.role === "admin" ? "/admin" : user.status === "approved" ? "/investor" : "/pending"}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 hover:text-ravok-gold transition-colors text-sm tracking-widest py-3 px-4"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    DASHBOARD
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="hover:text-ravok-gold transition-colors text-sm tracking-widest py-3 px-4"
                                    >
                                        REGISTER
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="hover:text-ravok-gold transition-colors text-sm tracking-widest py-3 px-4"
                                    >
                                        LOGIN
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
