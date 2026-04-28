import type { HomeContent } from "./types";

/**
 * Hard-coded fallback content. Used when:
 *   - The Laravel backend is unreachable (cold start, network error).
 *   - The site_content table hasn't been seeded yet.
 *
 * Kept in sync with `backend/database/seeders/SiteContentSeeder.php`.
 * Treat this as the canonical zero state — the homepage must render correctly
 * from this even if the API is down.
 */
export const DEFAULT_HOME_CONTENT: HomeContent = {
    sectionOrder: ["intro", "bridge", "portfolio", "team"],
    hero: {
        tagline: "A New Architecture for Entertainment",
        logoImage: "/images/logo.png",
        templeImage: "/images/bg_image.png",
        scrollCue: "↓ Scroll",
    },

    intro: {
        eyebrow: "— About",
        headline: "Film is historically uninvestable. **Until now.**",
        body1:
            "The legal and accounting infrastructure that makes a tech startup underwritable — cap tables, audit trails, verifiable performance — was never built for film. **So we're building it.**",
        body2:
            "RAVOK is a venture studio for entertainment. Each project incorporates as its own company, with creator equity, transparent waterfalls, and audit-grade reporting. The same structural rigor every other industry takes for granted — finally applied to a $2.9T market that still runs on handshake deals.",
        facts: [
            "2 films incorporated as SPVs",
            "20+ IPs in development",
            "Emmy-nominated director attached",
            "PGA producer on board",
            "Tax rebate secured",
            "Meris beta live",
        ],
        ctas: [
            { label: "Read the thesis →", href: "/thesis", variant: "primary" },
            { label: "See the portfolio", href: "#portfolio", variant: "secondary" },
        ],
        statueImage: "/images/statues/intro-statue.svg",
    },

    bridge: {
        eyebrow: "— The Pattern",
        headline: "REITs did it for real estate.\nWe're doing it for **entertainment**.",
        lead:
            "Before REITs, real estate was illiquid, opaque, relationship-driven. A legal structure and a disclosure regime turned it into a **$4T asset class**. Same pattern. Different industry.",
        columnOldLabel: "Hollywood (today)",
        columnNewLabel: "RAVOK",
        rows: [
            {
                dim: "Cap table",
                old: 'Opaque waterfalls. Hidden positions. "Hollywood accounting."',
                next: "Clean SPV equity. **Every position visible**, every dollar tracked.",
            },
            {
                dim: "Project structure",
                old: "Co-mingled studio P&L. Cross-collateralized risk.",
                next: "Each film is its own **standalone company**. Isolated upside.",
            },
            {
                dim: "Creator share",
                old: "Backend that never pays. Net points worth nothing.",
                next: "Standardized profit participation. **Real equity**, real distributions.",
            },
            {
                dim: "Audit trail",
                old: "Statements arrive months late, if ever. No real-time visibility.",
                next: "Real-time reporting through **Meris**. Audit-grade by default.",
            },
            {
                dim: "Capital access",
                old: "Relationship-gated. Insiders only. Uninvestable for institutions.",
                next: "Underwritable structure. **Institutional-ready** from day one.",
            },
            {
                dim: "Distribution",
                old: "Studio gatekeeping. Output deals dictate the upside.",
                next: "DTC optional via **Phema**. The SPV controls its own exit.",
            },
        ],
        statueImage: "/images/statues/bridge-statue.svg",
    },

    portfolio: {
        label: "The Portfolio",
        counterSuffix: "THE PORTFOLIO",
        steps: [
            {
                tag: "Entertainment · 01",
                name: "Film SPVs",
                title: "Each film, a **standalone company**.",
                body:
                    "Creator equity, clean cap table, auditable economics. Every project incorporates as its own LLC under the RAVOK umbrella, with profit participation flowing transparently from box office to cap table.",
                meta: [
                    "**2** films incorporated",
                    "**20+** IPs in development",
                    "Emmy-nominated director · PGA producer attached",
                ],
                chip: "10–50% Equity",
                badgeNum: "01",
                badgeLabel: "Film SPVs",
                comingSoon: false,
            },
            {
                tag: "Fintech · 02",
                name: "Meris",
                title: "The accounting layer that makes waterfalls **actually auditable**.",
                body:
                    "Carta meets Robinhood for film. Cap table management, profit participation tracking, real-time distribution to every position on the waterfall — from above-the-line to grip.",
                meta: [
                    "Core product built",
                    "Beta live at **merisbeta.com**",
                    "First SPV onboarded",
                ],
                chip: "Card + SaaS",
                badgeNum: "02",
                badgeLabel: "Meris",
                comingSoon: false,
            },
            {
                tag: "AI Validation · 03",
                name: "Delphi",
                title: "Coming soon.",
                body: "",
                meta: [],
                chip: "Coming Soon",
                badgeNum: "03",
                badgeLabel: "Delphi",
                comingSoon: true,
            },
            {
                tag: "Creator Economy · 04",
                name: "Phema",
                title: "Coming soon.",
                body: "",
                meta: [],
                chip: "Coming Soon",
                badgeNum: "04",
                badgeLabel: "Phema",
                comingSoon: true,
            },
        ],
    },

    team: {
        eyebrow: "— Who's building this",
        headline: "Built by people who've **lived the problem**.",
        lead:
            "Film veterans, finance operators, and platform builders. Advised by executives who've shaped the last fifty years of the industry.",
        members: [
            {
                name: "Amanda Aoki Rak",
                role: "Founder & CEO",
                bio:
                    "Packaged 3 feature films across 7+ years in entertainment — now building the venture studio to restructure how they're financed and owned.",
                photo: "/images/team/amanda.jpg",
                linkedin: "",
            },
            {
                name: "Thibault Dominici",
                role: "Chief of Finance",
                bio:
                    "15y+ managing royalties and profit participation at eOne / Lionsgate — ensuring financial accuracy across RAVOK's portfolio.",
                photo: "/images/team/thibault.jpg",
                linkedin: "",
            },
            {
                name: "Lois Ungar",
                role: "Board Member / Advisor",
                bio:
                    "30y+ as a senior finance executive at Disney, DreamWorks, Universal, and Unified Pictures — advising on scaling the studio model.",
                photo: "/images/team/lois.jpg",
                linkedin: "",
            },
            {
                name: "Pye Eshraghian",
                role: "Board Advisor",
                bio:
                    "3x founder with 20+ years across SaaS, finance, and capital markets — advising on SPV infrastructure and capital strategy from 0 → 1.",
                photo: "/images/team/pye.jpg",
                linkedin: "",
            },
        ],
        coinFrame: "/images/coins/coin-frame.svg",
    },

    footer: {
        email: "contact@ravokstudios.com",
        logoText: "RAVOK",
        links: [
            { label: "Field Notes", href: "/insights" },
            { label: "Terms", href: "/terms-and-conditions" },
            { label: "Privacy", href: "/privacy-policy" },
        ],
        copyright: "© RAVOK Studios",
    },
    floatingElements: [],
};
