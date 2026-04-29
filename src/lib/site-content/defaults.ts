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
        coinFrame:
            "https://pub-0c5b0ff2bc9242ffa0b31812b16adf4e.r2.dev/2026/04/i1swh4tzrnnd.svg",
        coinFrameScale: 130,
        coinPortraitScale: 58,
    },

    footer: {
        email: "contact@ravokstudios.com",
        logoText: "RAVOK",
        links: [
            { label: "Field Notes", href: "/insights" },
            { label: "Terms", href: "/terms-and-conditions" },
            { label: "Privacy", href: "/privacy-policy" },
        ],
        linkGroups: [
            {
                title: "Company",
                links: [
                    { label: "Home", href: "/" },
                    { label: "About Us", href: "/about-us" },
                    { label: "Our Model", href: "/our-model" },
                    { label: "Blog", href: "/insights" },
                    { label: "Contact Us", href: "/contact-us" },
                ],
            },
            {
                title: "Policies",
                links: [
                    { label: "Terms and Conditions", href: "/terms-and-conditions" },
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "Submission Release Agreement", href: "/submission-agreement" },
                ],
            },
            {
                title: "Portal",
                links: [
                    { label: "Investor Portal", href: "/login" },
                    { label: "Admin Portal", href: "/admin" },
                ],
            },
        ],
        socialLinks: [
            { icon: "facebook", href: "https://www.facebook.com/people/Ravok-Studios/61578824300063/" },
            { icon: "instagram", href: "https://www.instagram.com/ravokstudios?igsh=NTc4MTIwNjQ2YQ==" },
            { icon: "linkedin", href: "https://www.linkedin.com/company/ravok-studios/?viewAsMember=true" },
        ],
        backgroundImage: "/images/footer.png",
        logoImage: "/images/logo.png",
        copyright: "© 2026 Ravok Studios | All Rights Reserved.",
        decorations: [],
    },
    floatingElements: [],
    customBlocks: [],
};

/* ============================================================
 * Per-page defaults for the migrated static pages. Used as
 * fallback when the CMS row hasn't been created yet — first
 * admin save persists these values to the DB.
 * ============================================================ */

import type {
    ContactPageContent,
    AboutUsPageContent,
    OurModelPageContent,
} from "./types";

export const DEFAULT_CONTACT_PAGE: ContactPageContent = {
    title: "Contact Us",
    headline:
        "Whether you're a partner, investor, or creator—we want to hear from you.",
    formCtas: [
        { label: "Writer Form", href: "/form/writer" },
        { label: "Director Form", href: "/form/director" },
        { label: "Producer Form", href: "/form/producer" },
    ],
    contactSectionHeading: "Contact Information",
    inquiryTypes: [
        { label: "General Inquiries", email: "contact@ravokstudios.com" },
        { label: "Partnership Inquiries", email: "contact@ravokstudios.com" },
        { label: "Investor Relations", email: "contact@ravokstudios.com" },
    ],
    decorations: [],
};

export const DEFAULT_ABOUT_US_PAGE: AboutUsPageContent = {
    title: "About Us",
    heroEyebrow: "— About Ravok Studios",
    heroHeadline: "We're rebuilding entertainment from the operating agreement up.",
    heroSubheadline:
        "Ravok is a venture studio for entertainment — applying startup methodology to film and the businesses around it. Founders own equity. Investors get transparent waterfalls. Creators get partnership, not patronage.",
    sections: [
        {
            eyebrow: "— Origin",
            heading: "Built by people who've lived the problem.",
            body:
                "Founder Amanda Aoki Rak moved from Brazil to Los Angeles on an acting scholarship and learned the entertainment industry from the inside — including its exploitative practices. After packaging three feature films across seven years, she taught herself to code and started building the institutional infrastructure she wished had existed when she was a creator.",
        },
        {
            eyebrow: "— Mission",
            heading: "Make film historically investable.",
            body:
                "Film has historically been uninvestable as an asset class. We're changing that with SPV-per-project structures, transparent profit waterfalls, creator equity, and a tech stack that brings real-time accounting to revenues that have always been hidden.",
        },
        {
            eyebrow: "— Approach",
            heading: "Treat each film like a startup.",
            body:
                "Each project is its own venture with founder equity, board governance, and clear decision rights. We provide capital, infrastructure, and strategic support without taking creative control. The creator stays the founder.",
        },
    ],
    closingHeadline: "Want to build something with us?",
    closingBody:
        "We're actively looking at writer-director projects, packaging deals, and platform partnerships.",
    closingCta: { label: "Get in touch", href: "/contact-us" },
    decorations: [],
};

export const DEFAULT_OUR_MODEL_PAGE: OurModelPageContent = {
    title: "Our Model",
    heroEyebrow: "— OUR MODEL, EXPLAINED SIMPLY",
    heroHeadline: "Three stages. Real equity at every one.",
    heroLead:
        "We treat each film like a startup. Seed it. Build it. Distribute it. Creators own equity from day one — not points that disappear in the waterfall.",
    stages: [
        {
            title: "STAGE 1: SEED & STRUCTURE",
            traditional:
                "Creator pitches. If they're lucky, gets option money or development deal. Studio owns everything. Creator hopes for backend points that never pay out.",
            ravok:
                "We provide seed capital for development. Structure the project as an independent venture with an operating agreement. Creator gets founder equity (typically 30-50%). Clear governance from day one.",
            bullets: [
                "You own a piece of what you build",
                "Transparent cap table",
                'Real decision rights, not "creative control" that disappears in production',
            ],
            bulletIcon: "plus",
        },
        {
            title: "STAGE 2: BUILD & PACKAGE",
            traditional:
                'Creator assembles package alone, begging for attachments. Studio steps in only when it\'s "ready." Endless notes from executives who\'ve never made anything.',
            ravok:
                "Strategic support throughout packaging. Access to our network of actors, DPs, producers. Professional infrastructure (legal, finance, marketing strategy). Clear decision rights—you're the founder, not an employee.",
            bullets: [
                "You're not alone in development",
                "Professional support without giving up control",
                "Partnership, not patronage",
            ],
            bulletIcon: "check",
        },
        {
            title: "STAGE 3: PRODUCTION & DISTRIBUTION",
            traditional:
                "Film gets made (if you're lucky). Studio controls distribution. Creator gets paid once, maybe twice. No ongoing revenue. Next project starts from zero.",
            ravok:
                "Production with strategic partners. Distribution through festivals, boutique streamers, or our platform (Phema). Revenue flows back to the venture. Creator sees the numbers. Build for franchise potential and IP longevity.",
            bullets: [
                "Transparent revenue",
                "Ongoing economics, not one-off deals",
                "Sustainable creative career",
            ],
            bulletIcon: "check",
        },
    ],
    structuralEyebrow: "— THE STRUCTURAL DIFFERENCE",
    structuralHeading: "Side by side.",
    traditionalLabel: "Traditional Studio",
    traditionalItems: [
        "Studio owns 100%",
        "Creator: Work-for-hire",
        "Backend points (fake)",
        "No board seat",
        '"Creative control" (disappears)',
        "Opaque accounting",
        "One-off project",
        "Hope for backend",
    ],
    ravokLabel: "Ravok",
    ravokItems: [
        "Board seat with voting rights",
        "Operating agreement with defined decision rights",
        "Transparent books",
        "Sustainable venture",
        "Real equity value",
    ],
    ctaEyebrow: "— READY TO BUILD?",
    ctaHeading: "Bring us your project.",
    ctaBody:
        "We're actively looking at writer-director-led features and packaging-stage projects.",
    ctaPrimary: { label: "Submit your project", href: "/pitch-us" },
    ctaSecondary: { label: "Learn more", href: "/about-us" },
    decorations: [],
};
