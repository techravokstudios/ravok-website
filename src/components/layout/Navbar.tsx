"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser } from "@/lib/api";
import { DEFAULT_NAVBAR, type NavbarContent } from "@/lib/site-content";
import { EditableText, EditableImage, useEditMode } from "@/lib/edit-mode";

type NavbarProps = {
    /** CMS-driven navbar content. When omitted, uses DEFAULT_NAVBAR.
     *  When the parent EditModeProvider's content carries a `navbar` field,
     *  Navbar reads from that instead (live editing). */
    content?: NavbarContent;
};

export default function Navbar({ content }: NavbarProps = {}) {
    // If the surrounding EditModeProvider has navbar content, use it (lets
    // admin edits show immediately and persist via the provider's save flow).
    // Otherwise fall back to the prop or bundled defaults.
    const ctx = useEditMode();
    const liveContent = (ctx.content as unknown as { navbar?: NavbarContent }).navbar;
    const cmsContent: NavbarContent = liveContent ?? content ?? DEFAULT_NAVBAR;
    const editingEnabled = ctx.enabled && !!liveContent;
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

    const navItems = cmsContent.links;
    const logoSrc = cmsContent.logoImage || "/images/logo.png";

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full z-[100] text-[var(--ds-ink)] transition-all duration-500 ${scrolled ? 'bg-[rgba(28,28,26,0.8)] backdrop-blur-xl border-b border-[var(--ds-border)]' : ''
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
                    {editingEnabled ? (
                        <EditableImage
                            path="navbar.logoImage"
                            value={logoSrc}
                            alt="RAVOK"
                            className="h-10 w-auto object-contain"
                        />
                    ) : (
                        <Link href="/" className="block">
                            <motion.img
                                src={logoSrc}
                                alt="RAVOK"
                                className="h-10 w-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>
                    )}
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-12 font-sans text-sm tracking-widest text-[var(--ds-ink)]">
                    {navItems.map((item, i) => (
                        <motion.div
                            key={`${i}-${item.href}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.1,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            {editingEnabled ? (
                                <div className="relative group">
                                    <EditableText
                                        path={`navbar.links.${i}.label`}
                                        value={item.label}
                                        as="span"
                                        inline
                                        className="relative z-10 text-[var(--ds-ink)] group-hover:text-ravok-gold transition-colors duration-300"
                                    />
                                    <EditableText
                                        path={`navbar.links.${i}.href`}
                                        value={item.href}
                                        as="div"
                                        inline={false}
                                        className="font-mono text-[0.55rem] text-[var(--ds-ink-muted)] mt-1"
                                    />
                                </div>
                            ) : (
                                <Link href={item.href} className="relative group">
                                    <span className="relative z-10 text-[var(--ds-ink)] group-hover:text-ravok-gold transition-colors duration-300">
                                        {item.label}
                                    </span>
                                    <motion.span
                                        className="absolute -bottom-1 left-0 w-0 h-px bg-ravok-gold group-hover:w-full transition-all duration-300"
                                    />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Dashboard - only visible when logged in */}
                {user && (
                    <motion.div
                        className="hidden lg:flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
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
                    </motion.div>
                )}
            </div>

            {/* Mobile Menu Overlay - high z-index so it sits above all page content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className="fixed inset-0 min-h-screen min-h-[100dvh] bg-[var(--ds-bg)] z-[90] flex flex-col items-center justify-center gap-8 text-xl font-heading touch-manipulation"
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
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: navItems.length * 0.1 }}
                                className="flex gap-6 pt-4 border-t border-[var(--ds-border)]"
                            >
                                <Link
                                    href={user.role === "admin" ? "/admin" : user.status === "approved" ? "/investor" : "/pending"}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 hover:text-ravok-gold transition-colors text-sm tracking-widest py-3 px-4"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    DASHBOARD
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
