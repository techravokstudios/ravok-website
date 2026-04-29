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
    NavbarContent,
    LegalPageContent,
} from "./types";

/** Default navbar — used when site_content has no row for slug "navbar".
 *  First admin save persists. */
export const DEFAULT_NAVBAR: NavbarContent = {
    logoImage: "/images/logo.png",
    links: [
        { label: "HOME", href: "/" },
        { label: "ABOUT US", href: "/about-us" },
        { label: "OUR MODEL", href: "/our-model" },
        { label: "BLOG", href: "/insights" },
        { label: "CONTACT", href: "/contact-us" },
    ],
};

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

/* ============================================================
 * Legal pages — long-form numbered-section content. Stored at
 * slugs "submission-agreement", "privacy-policy", "terms-and-conditions".
 * Body strings use blank-line paragraph separators (\n\n).
 * Bullet lines start with "- " (renderer can group them).
 * ============================================================ */

export const DEFAULT_SUBMISSION_AGREEMENT: LegalPageContent = {
    title: "Script Submission Terms & Conditions",
    lastUpdated: "Last Updated April 1, 2026",
    intro:
        "Please read these terms and conditions carefully before submitting any material. By submitting a script, treatment, synopsis, or any related material (collectively, “Submission”) through this website, you (“Submitter”) acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree, do not submit any material.",
    sections: [
        {
            title: "Eligibility",
            body: "The Submitter must be at least 18 years of age and legally authorized to enter into a binding agreement. By making a Submission, you represent and warrant that you meet these requirements.",
        },
        {
            title: "Unsolicited Material Acknowledgment",
            body: "The Submitter acknowledges that Ravok Studios receives numerous script submissions and that ideas, themes, story elements, and concepts contained within the Submission may be similar to material already under development, previously received from other sources, or independently created by Ravok Studios or its affiliates. The Submitter agrees that no confidential or fiduciary relationship is established between the Submitter and Ravok Studios by virtue of this Submission.",
        },
        {
            title: "Ownership and Originality",
            body: "The Submitter represents and warrants that:\n\n(a) The Submission is the Submitter's original work, or the Submitter has obtained all necessary rights, permissions, and licenses to submit the material and to grant the rights described herein.\n\n(b) The Submission does not infringe upon or violate any copyright, trademark, right of privacy, right of publicity, or any other intellectual property or proprietary right of any third party.\n\n(c) The Submission does not contain any defamatory, libelous, obscene, or otherwise unlawful content.\n\n(d) No prior agreement, obligation, or encumbrance exists that conflicts with the rights granted herein.\n\n(e) If the Submission is based upon, adapted from, or derived from any pre-existing work, the Submitter has obtained all necessary rights to such underlying material and is authorized to grant the rights described herein.",
        },
        {
            title: "Limited License to Review",
            body: "By submitting material, the Submitter grants Ravok Studios a non-exclusive, royalty-free, worldwide license to read, evaluate, analyze (including through automated or AI-assisted means), and internally discuss the Submission for the purpose of determining its suitability for development or production.",
        },
        {
            title: "No Obligation",
            body: "Ravok Studios is under no obligation to:\n\n(a) Review, respond to, or acknowledge receipt of any Submission.\n\n(b) Develop, produce, or otherwise use any Submission.\n\n(c) Return any submitted material to the Submitter.\n\n(d) Enter into any agreement with the Submitter regarding the Submission.\n\nRavok Studios reserves the sole and absolute discretion to accept or reject any Submission for any reason or no reason at all.",
        },
        {
            title: "Compensation",
            body: "No compensation, payment, credit, or other consideration is owed to the Submitter for the act of submitting material or for Ravok Studios' review thereof. If Ravok Studios elects to proceed with development or production of a Submission, any compensation or credit shall be subject to a separate written agreement negotiated between the parties.",
        },
        {
            title: "Data Collection and Use",
            body: "7.1 Personal Information\n\nIn connection with the Submission, Ravok Studios may collect personal information including the Submitter's name, email address, phone number, mailing address, professional biography, and any other information provided through the submission form. This information will be processed in accordance with Ravok Studios' Privacy Policy.\n\n7.2 Use of Submission Data in Connection with Proprietary AI-Assisted Analysis\n\nBy submitting material through this website, the Submitter acknowledges and agrees that Ravok Studios utilizes a proprietary AI-powered analytical framework in connection with the evaluation and development of submitted material. The Submitter consents to the following uses of the Submission:\n\n(a) Analytical Processing. The Submission may be processed by Ravok Studios' proprietary systems and by third-party artificial intelligence services for script analysis, market assessment, audience evaluation, concept validation, financial modeling, and other analytical functions related to the evaluation of the Submission's viability for development or production.\n\n(b) Data Retention and Contextual Learning. Ravok Studios may retain Submission data, including analytical results, metadata, and project-level context derived from the Submission, within its proprietary systems to improve the accuracy, relevance, and depth of its analytical capabilities over time.\n\n(c) Anonymized and Aggregated Insights. Ravok Studios may derive anonymized, aggregated, or statistical insights from Submissions for the purpose of improving its proprietary analytical models, benchmarking tools, market databases, and platform functionality. Such derived data shall not identify the Submitter or the specific content of any individual Submission.\n\nThe Submitter acknowledges that AI-assisted analysis is one component of Ravok Studios' evaluation process and that all development and production decisions are made at Ravok Studios' sole discretion. The Submitter waives any right to additional compensation, notification, or approval in connection with the uses described in this Section 7.2.\n\n7.3 Data Retention\n\nRavok Studios reserves the right to retain Submission data and associated personal information for as long as reasonably necessary to fulfill the evaluation and analytical purposes described herein, or as required by applicable law. Anonymized or aggregated data derived from Submissions pursuant to Section 7.2(c) may be retained indefinitely.",
        },
        {
            title: "Indemnification",
            body: "The Submitter agrees to indemnify, defend, and hold harmless Ravok Studios, its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all claims, demands, liabilities, losses, damages, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with:\n\n(a) Any breach of the Submitter's representations, warranties, or obligations under these Terms.\n\n(b) Any claim that the Submission infringes or misappropriates any intellectual property or other rights of any third party.\n\n(c) Any dispute between the Submitter and any third party relating to the Submission.",
        },
        {
            title: "Limitation of Liability",
            body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RAVOK STUDIOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR OPPORTUNITIES, ARISING OUT OF OR RELATED TO THESE TERMS OR ANY SUBMISSION, REGARDLESS OF THE THEORY OF LIABILITY.",
        },
        {
            title: "No Waiver of Rights",
            body: "The Submitter retains ownership of the Submission. Nothing in these Terms shall be construed as an assignment of copyright or other ownership rights, except as expressly stated herein. However, the Submitter acknowledges that the licenses and consents granted under these Terms are irrevocable with respect to any use that has already occurred.",
        },
        {
            title: "Modification of Terms",
            body: "Ravok Studios reserves the right to modify these Terms and Conditions at any time without prior notice. Any modifications will be effective upon posting to the website. Continued submission of material following the posting of updated Terms constitutes acceptance of such changes.",
        },
        {
            title: "Governing Law and Dispute Resolution",
            body: "These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles, except to the extent that the internal affairs, corporate governance, or entity-level obligations of Ravok Studios are governed by the laws of the State of Delaware. Any dispute arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Los Angeles County, California. The Submitter irrevocably consents to personal jurisdiction in such courts and waives any objection to venue, including on the basis of inconvenient forum.",
        },
        {
            title: "Severability",
            body: "If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.",
        },
        {
            title: "Entire Agreement",
            body: "These Terms and Conditions constitute the entire agreement between the Submitter and Ravok Studios with respect to the submission of material and supersede all prior or contemporaneous communications, representations, or agreements, whether written or oral.",
        },
    ],
};

export const DEFAULT_PRIVACY_POLICY: LegalPageContent = {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: June 24, 2026",
    intro:
        "This Privacy Notice describes how RAVOK STUDIOS, INC. (\"Ravok Studios,\" \"we,\" \"us,\" or \"our\") collects, uses, and protects personal information from users (\"you\") who access our website at ravokstudios.com (the \"Site\") and request password-protected access to our confidential materials.\n\nBy accessing or using the Site, you agree to the terms of this Privacy Notice.",
    sections: [
        {
            title: "What Information We Collect",
            body: "We collect personal information that you voluntarily provide when you submit your full name and email address through our access request form. We do not collect sensitive personal data (e.g., race, sexual orientation, health data), nor do we knowingly collect data from minors under 18.\n\nWe may also automatically collect limited technical data (e.g., IP address, browser type, and device information) using cookies for security and analytics purposes.",
        },
        {
            title: "How We Use Your Information",
            body: "We use your information to:\n\n- Provide password-protected access to our film slate and business materials\n- Communicate with you regarding your access or related updates\n- Maintain security and improve the Site\n\nWe process your data only as necessary to deliver our services or comply with legal obligations.",
        },
        {
            title: "How We Share Your Information",
            body: "We do not sell or rent your information. We may share your personal data only with:\n\n- Hosting providers and cloud platforms (to operate the Site)\n- Email service providers (to send you your access credentials)\n\nThese third parties are contractually required to protect your information and may not use it for any unrelated purpose.",
        },
        {
            title: "Cookies and Tracking Technologies",
            body: "We use cookies and similar tools to enhance functionality and analyze usage. These may include session cookies and analytics cookies. You can manage cookies via your browser settings.\n\nWe do not currently respond to \"Do Not Track\" (DNT) browser signals.",
        },
        {
            title: "Children's Privacy",
            body: "We do not knowingly collect or solicit personal information from anyone under the age of 18. If we learn that a child under 18 has submitted personal data, we will delete it promptly. Parents or guardians may contact us to request removal.",
        },
        {
            title: "Data Security and Retention",
            body: "We implement commercially reasonable safeguards to protect your data. We retain your information only for as long as needed to fulfill the purposes described above, or as required by law.",
        },
        {
            title: "Your Rights (Including California Residents)",
            body: "If you are a California resident, you have the right to:\n\n- Request access to the personal information we hold about you\n- Request deletion of your personal information\n- Request information about how we collect and use your data\n\nTo exercise these rights, please contact us at contact@ravokstudios.com.",
        },
        {
            title: "Updates to This Privacy Notice",
            body: "We may revise this Privacy Notice from time to time. The updated version will be posted on this page with the \"Last Updated\" date. Please review it regularly.",
        },
        {
            title: "Contact Information",
            body: "If you have questions or requests, contact us at:\n\nRAVOK STUDIOS, INC.\n1401 21st ST STE R\nSacramento, CA 95811\n\nEmail: contact@ravokstudios.com",
        },
    ],
};

export const DEFAULT_TERMS_AND_CONDITIONS: LegalPageContent = {
    title: "Terms & Conditions",
    lastUpdated: "Last Updated: June 24, 2026",
    intro:
        "These Terms & Conditions govern your access to and use of ravokstudios.com (the \"Site\") and any services offered via the Site (collectively, the \"Services\"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.",
    sections: [
        {
            title: "Introduction",
            body: "Welcome to RAVOK Studios (the \"Website\", \"we\", \"us\", or \"our\"). These Terms & Conditions (\"Terms\") govern your access to and use of https://ravokstudios.com (the \"Site\") and any services offered via the Site (collectively, the \"Services\"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue use of the Site immediately.\n\nWe may modify these Terms at any time by posting revised versions on the Site — your continued use after such posting means you accept the modifications.",
        },
        {
            title: "Eligibility",
            body: "You represent and warrant that you are at least 18 years old (or the legal age of majority in your jurisdiction) and that you have the legal capacity to enter into a binding agreement. If you are accessing the Site on behalf of a company or other legal entity, you further represent and warrant that you have authority to bind such entity and \"you\" and \"your\" refer to that entity.",
        },
        {
            title: "Services & Content",
            body: "a. The Site may provide information about our venture-studio model, film/tech ventures, partnership opportunities, contact links, and other related content.\n\nb. All content on the Site (text, graphics, logos, images, audio, video, software) is owned by or licensed to RAVOK Studios, unless otherwise indicated, and is protected by copyright, trademark, and other laws.\n\nc. You are authorised to view, download or print single copies of material on the Site for your personal, non-commercial use only — provided you retain all copyright and other proprietary notices. Any other use, including reproduction, modification, distribution, transmission, republication, display or performance, is strictly prohibited unless authorised in writing by RAVOK Studios.\n\nd. We reserve the right (but are not obligated) to monitor or remove any content or account that we determine violates these Terms or is otherwise harmful to the Site or our users.",
        },
        {
            title: "User Conduct",
            body: "By using the Site, you agree not to:\n\n- Use the Site for any unlawful purpose or in violation of applicable laws.\n- Upload, post or transmit any content that is defamatory, infringing, obscene, hateful, threatening or otherwise objectionable.\n- Impersonate any person or entity or misrepresent your affiliation with a person or entity.\n- Interfere with or disrupt the Site, servers or networks connected to the Site, or violate any requirements, procedures, policies or regulations of networks connected to the Site.\n- Use any automated system (e.g., bots, scrapers) to access the Site for any purpose without our express written permission.\n- Attempt to gain unauthorised access to any portion of the Site or its related systems or networks.",
        },
        {
            title: "Intellectual Property Rights",
            body: "All intellectual property rights (including but not limited to copyrights, trademarks, trade names, designs, patents, moral rights) in the Site and the content contained therein are owned by or licensed to RAVOK Studios. You agree that you will not use our trademarks, service marks or logos without our prior written consent.\n\nIf you provide any feedback, suggestions or ideas (\"Feedback\") to us, you hereby assign all rights in such Feedback to RAVOK Studios and agree we may freely use and exploit it without compensation to you.",
        },
        {
            title: "Third-Party Links & Services",
            body: "The Site may contain links to third-party websites or services that are not owned or controlled by RAVOK Studios. We do not endorse, guarantee or assume any responsibility for the accuracy, completeness or reliability of any content or services offered by such third parties. Your use of third-party websites is at your own risk and subject to the third-party's terms.\n\nWe may also use third-party services (e.g., analytics, social media, email) that collect data in accordance with their own privacy policies.",
        },
        {
            title: "Disclaimers",
            body: "a. The Site and Services are provided \"as-is\" and \"as available\" without warranties of any kind, whether express or implied. To the fullest extent permitted by law, RAVOK Studios expressly disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness or reliability of information.\n\nb. We make no guarantee that the Site will be uninterrupted, timely, secure or error-free, or that defects will be corrected, or that the Site or the servers are free of viruses or other harmful components.\n\nc. Any content provided on or through the Site is for general informational purposes only and does not constitute advice (legal, financial, business, or otherwise). You should consult professional advisers for specific advice tailored to your circumstances.",
        },
        {
            title: "Limitation of Liability",
            body: "To the maximum extent permitted by applicable law, in no event will RAVOK Studios, its affiliates, directors, officers, employees or agents be liable for any indirect, incidental, special, consequential, punitive or exemplary damages (including loss of profits, revenue, business, data or goodwill) arising out of or in connection with your access to or use of (or inability to use) the Site or Services, even if advised of the possibility of such damages.\n\nOur total aggregate liability for all claims arising out of or relating to your use of the Site or Services shall not exceed the amount, if any, you paid us for access to the Services during the 6 months immediately preceding the claim (or, if you paid nothing, a nominal amount of USD 1).\n\nSome jurisdictions do not allow exclusion or limitation of certain warranties or damages; accordingly some of the above exclusions may not apply to you.",
        },
        {
            title: "Indemnification",
            body: "You agree to indemnify, defend and hold harmless RAVOK Studios and its affiliates, officers, directors, employees and agents from and against any and all claims, demands, liabilities, losses, damages, costs and expenses (including reasonable attorneys' fees) arising out of or in connection with:\n\n- your violation of these Terms;\n- your use of the Site or Services;\n- any content you upload, post or transmit; or\n- any alleged infringement of third-party rights by you.",
        },
        {
            title: "Privacy",
            body: "Use of the Site is also governed by our Privacy Policy (accessible via the Site). Please review the Privacy Policy carefully. By using the Site, you consent to our collection, use and disclosure of your personal information as set out therein.\n\nView the Privacy Policy at /privacy-policy.",
        },
        {
            title: "Termination",
            body: "We reserve the right to suspend or terminate your access to the Site (or any part thereof) at our discretion, for any reason or no reason, without notice. Upon termination, the rights and licenses granted to you under these Terms will immediately cease and you must stop using the Site.\n\nSections 3 (Services & Content), 5 (Intellectual Property), 7 (Disclaimers), 8 (Limitation of Liability), 9 (Indemnification), 12 (Governing Law) and 13 (Other) shall survive termination.",
        },
        {
            title: "Governing Law & Dispute Resolution",
            body: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which RAVOK Studios is established (without regard to its conflict-of-law provisions). Any dispute arising out of or in connection with these Terms or your use of the Site shall be resolved exclusively by the courts located in that jurisdiction, and you hereby consent to the personal jurisdiction of such courts.",
        },
        {
            title: "Other Provisions",
            body: "a. Entire Agreement. These Terms (and any documents expressly incorporated by reference) constitute the entire agreement between you and RAVOK Studios concerning the Site and supersede all prior or contemporaneous communications and proposals, whether oral, written or electronic, between you and us.\n\nb. Severability. If any provision of these Terms is held to be invalid or unenforceable in whole or in part, the remaining provisions shall continue in full force and effect.\n\nc. Waiver. No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or condition or any other term or condition.\n\nd. Assignment. You may not assign or transfer any of your rights or obligations under these Terms without our prior written consent. We may assign or transfer our rights and obligations at any time without restriction.\n\ne. Notices. Any notices required or permitted under these Terms shall be in writing and delivered by email to contact@ravokstudios.com (or such other email address as we may provide) or by posting on the Site.\n\nf. Changes to the Site / Services. We reserve the right to modify, suspend or discontinue the Site or Services (or any part thereof) at any time, with or without notice.",
        },
        {
            title: "Contact Information",
            body: "If you have questions about these Terms, contact us at:\n\nRAVOK STUDIOS, INC.\nEmail: contact@ravokstudios.com",
        },
    ],
};
