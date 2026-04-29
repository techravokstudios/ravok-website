/**
 * Type definitions for the editable site content (CMS MVP).
 *
 * These types must stay in sync with the seeded JSON shape in
 * `backend/database/seeders/SiteContentSeeder.php`. The same shape is what
 * the admin UI sends back via `PUT /api/v1/admin/site/content/{slug}`.
 *
 * Inline emphasis convention: text fields can contain `**phrase**` markers.
 * `renderInline()` (in ./render.tsx) wraps these in <em> with the gold-italic
 * style. Admins type plain text + `**...**` markers — no HTML, no JSX.
 */

export type CtaVariant = "primary" | "secondary";

/**
 * Per-image transform overrides. Allows admins to free-form an image
 * (resize, move, rotate) outside the column layout. All fields optional —
 * absence means "render at the section's default size and position".
 *
 * Values are applied as inline styles + a CSS transform on the rendered img.
 */
export type ImageTransform = {
    scale?: number;        // 1 = native column-fill, 1.5 = 50% bigger
    offsetX?: number;      // px, positive = move right
    offsetY?: number;      // px, positive = move down
    rotate?: number;       // degrees
    width?: string;        // e.g. "120%" or "640px" — overrides parent column
    zIndex?: number;       // for stacking when bleeding past sibling sections
};

export type Cta = {
    label: string;
    href: string;
    variant: CtaVariant;
};

export type FooterLink = {
    label: string;
    href: string;
};

export type FooterLinkGroup = {
    title: string;
    links: FooterLink[];
};

export type FooterSocialIcon = "instagram" | "linkedin" | "facebook" | "twitter";

export type FooterSocialLink = {
    icon: FooterSocialIcon;
    href: string;
};

export type ComparisonRow = {
    dim: string;
    old: string;
    next: string;
};

export type PortfolioStepContent = {
    tag: string;
    name: string;
    title: string;
    body: string;
    meta: string[];
    chip: string;
    badgeNum: string;
    badgeLabel: string;
    comingSoon: boolean;
    /**
     * Optional image (URL) that REPLACES the gold-circle badge for this step.
     * When set, the visual column renders an EditableImage instead of StepBadge.
     * Empty string or undefined → render the badge (default).
     */
    visualImage?: string;
    /** Free-form transform on the visual image (when visualImage is set). */
    visualImageTransform?: ImageTransform;
};

export type TeamMemberContent = {
    name: string;
    role: string;
    bio: string;
    photo: string;
    linkedin: string;
};

/**
 * Order of body sections (after the always-first Hero, and before the
 * always-last Footer). Admins can drag-reorder these in edit mode.
 *
 * Optional in schema for backwards compat — when missing, the default
 * order from DEFAULT_HOME_CONTENT is used.
 */
export type SectionKey = "intro" | "bridge" | "portfolio" | "team" | "window" | "signal";
export const ALL_SECTION_KEYS: SectionKey[] = ["intro", "bridge", "portfolio", "team", "window", "signal"];

/**
 * A decoration image that lives INSIDE a section's content. Position is
 * relative to the section's content area; the decoration participates in
 * whatever the section is doing (sticky reveal, marquee scroll, etc.) so
 * placements stay locked to the section's content visually.
 *
 * Coordinate system:
 *   - `top`: px from the top of the section content
 *   - `left`: % of the section's width (0–100)
 *   - `width`: px (height auto, preserves source aspect)
 *
 * Each section's content has an optional `decorations[]` array.
 *
 * Legacy: HomeContent.floatingElements (page-level) is preserved for
 * backwards-compat with older saved data and is treated as anchored to
 * the document overall.
 */
/**
 * What container the decoration tracks. Determines which animation it
 * follows.
 *  - "section":     anchored to the sticky <section>. Stays put while the
 *                   section is on-screen, scrolls off when the next section
 *                   covers from below. Default — used by sections without
 *                   internal motion (Hero, Intro, Bridge).
 *  - "marquee":     rendered INSIDE the team-marquee-inner. Scrolls
 *                   horizontally with the coins.
 *  - "scrollytell": rendered INSIDE the scrollytell sticky visual.
 *                   Crossfades / pins with the active step.
 */
export type FloatingTarget = "section" | "marquee" | "scrollytell";

export type FloatingImage = {
    id: string;
    type: "image";
    src: string;
    top: number;
    left: number;
    width: number;
    rotate?: number;
    zIndex?: number;
    /** Which sub-container of the parent section this decoration tracks.
     *  Defaults to "section". Set automatically based on drop position. */
    target?: FloatingTarget;
};

export type FloatingElement = FloatingImage; // future: text | shape | …

export type HomeContent = {
    sectionOrder?: SectionKey[];
    hero: {
        tagline: string;
        logoImage: string;
        templeImage: string;
        scrollCue: string;
        logoImageTransform?: ImageTransform;
        templeImageTransform?: ImageTransform;
        decorations?: FloatingImage[];
    };
    intro: {
        eyebrow: string;
        headline: string;
        body1: string;
        body2: string;
        facts: string[];
        ctas: Cta[];
        statueImage: string;
        statueImageTransform?: ImageTransform;
        decorations?: FloatingImage[];
    };
    bridge: {
        eyebrow: string;
        headline: string;
        lead: string;
        columnOldLabel: string;
        columnNewLabel: string;
        rows: ComparisonRow[];
        statueImage: string;
        statueImageTransform?: ImageTransform;
        decorations?: FloatingImage[];
    };
    portfolio: {
        label: string;
        counterSuffix: string;
        steps: PortfolioStepContent[];
        decorations?: FloatingImage[];
        /** design-cms-v2 / #93 — Era + Pillars framing for Section 4.
         *  Existing portfolio.steps[] become the Pillars of the current Era.
         *  All era* fields are optional for backwards compat — old data
         *  renders with sensible defaults until admin edits. */
        eraLabel?: string;       // e.g. "Era Zero"
        eraEyebrow?: string;     // e.g. "Founding slate"
        headline?: string;       // e.g. "Four pillars of what we're building first."
        lead?: string;           // 1-2 line lead body
        ctaLabel?: string;       // e.g. "See the full slate"
        ctaHref?: string;        // e.g. "/portfolio"
    };
    team: {
        eyebrow: string;
        headline: string;
        lead: string;
        members: TeamMemberContent[];
        coinFrame: string;
        coinFrameTransform?: ImageTransform;
        /** % of coin width — sets `.coin-frame` width. Default 450 (matches the
         *  small wireframe SVG that needs to be huge to read). For frames that
         *  are sized to the coin (like a laurel ring), drop to ~130. */
        coinFrameScale?: number;
        /** % of coin width — sets `.coin-portrait` width. Default 75. Drop to
         *  ~58 to make the photo well smaller so it nests inside an ornate
         *  frame instead of sitting on top of it. */
        coinPortraitScale?: number;
        decorations?: FloatingImage[];
    };
    /** Section 5 — submissions / email capture. */
    window?: {
        eyebrow: string;
        headline: string;
        lead: string;
        emailPlaceholder: string;
        emailCta: string;
        decorations?: FloatingImage[];
    };
    /** Section 6 — final CTA / closing signal. */
    signal?: {
        eyebrow: string;
        headline: string;
        body: string;
        ctas: Cta[];
        decorations?: FloatingImage[];
    };
    footer: {
        email: string;
        logoText: string;
        /** Legacy flat links list — kept for backwards compat with v1–v9 data.
         *  New code uses `linkGroups` instead. */
        links: FooterLink[];
        /** Optional grouped link columns (Company / Policies / Portal style). */
        linkGroups?: FooterLinkGroup[];
        socialLinks?: FooterSocialLink[];
        backgroundImage?: string;
        logoImage?: string;
        copyright: string;
        decorations?: FloatingImage[];
    };
    /** Free-floating images dropped anywhere on the page (Canva-style). */
    floatingElements?: FloatingElement[];
    /**
     * Admin-added custom section blocks. Rendered after the core sections
     * (Hero, Intro, Bridge, Portfolio, Team) and before the Footer.
     * v8 ships with one type: "image-block". More types can be added without
     * breaking existing data.
     */
    customBlocks?: CustomBlock[];
};

/* ───────── Custom blocks (v8) ───────── */

export type ImageBlockProps = {
    image: string;
    imageTransform?: ImageTransform;
    caption: string;
    /** Layout: full-bleed (no max-width) or constrained to the page max */
    fullBleed?: boolean;
    /** Optional decorations specific to this block */
    decorations?: FloatingImage[];
};

export type RichTextBlockProps = {
    eyebrow: string;
    heading: string;
    body: string;
    align?: "left" | "center";
    decorations?: FloatingImage[];
};

export type TwoColumnBlockProps = {
    imagePosition: "left" | "right";
    image: string;
    imageTransform?: ImageTransform;
    eyebrow: string;
    heading: string;
    body: string;
    decorations?: FloatingImage[];
};

export type CalloutBlockProps = {
    quote: string;
    attribution: string;
    decorations?: FloatingImage[];
};

export type CtaBlockProps = {
    eyebrow: string;
    heading: string;
    body: string;
    ctas: Cta[];
    decorations?: FloatingImage[];
};

export type CustomBlock =
    | { id: string; type: "image-block"; props: ImageBlockProps }
    | { id: string; type: "rich-text"; props: RichTextBlockProps }
    | { id: string; type: "two-column"; props: TwoColumnBlockProps }
    | { id: string; type: "callout"; props: CalloutBlockProps }
    | { id: string; type: "cta-block"; props: CtaBlockProps };

export const CUSTOM_BLOCK_TYPES: Array<CustomBlock["type"]> = [
    "image-block",
    "rich-text",
    "two-column",
    "callout",
    "cta-block",
];

export type SiteContentEnvelope<T = HomeContent> = {
    slug: string;
    content: T;
    updated_at?: string;
    /** #79: present on admin-facing endpoints; whether a saved-but-unpublished
     *  draft exists for this slug. */
    has_draft?: boolean;
    /** #79: timestamp of last publish. null if never published. */
    published_at?: string | null;
};

/** #79: standardized save result returned from saveSplitPageAndNavbar +
 *  per-page saveFn passed to EditModeProvider. Carries draft metadata so the
 *  toolbar can show publish state. */
export type SaveResult<T = unknown> = {
    content: T;
    hasDraft: boolean;
    publishedAt: string | null;
};

/**
 * Generic page content for admin-created pages (anything other than `home`).
 * Built entirely from custom blocks — no fixed sections.
 */
export type GenericPageContent = {
    title: string;
    metaDescription?: string;
    customBlocks?: CustomBlock[];
    /** Optional global decorations across the page (rendered above all blocks) */
    decorations?: FloatingImage[];
};

/** Quick check: a generic page has a `title` field, home doesn't. */
export function isGenericPage(c: HomeContent | GenericPageContent): c is GenericPageContent {
    return typeof (c as GenericPageContent).title === "string" && !("hero" in c);
}

/* ============================================================
 * Per-page content types for the static pages migrated to CMS.
 * Each preserves the page's existing layout/design — only the
 * text and image content is admin-editable. Stored in
 * site_content table keyed by their respective slugs.
 * ============================================================ */

/** /contact-us page content shape. */
export type ContactPageContent = {
    title: string;
    headline: string;
    formCtas: Array<{ label: string; href: string }>;
    contactSectionHeading: string;
    inquiryTypes: Array<{ label: string; email: string }>;
    decorations?: FloatingImage[];
};

/** /about-us page content shape. */
export type AboutUsSection = {
    eyebrow: string;
    heading: string;
    body: string;
};

export type AboutUsPageContent = {
    title: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    sections: AboutUsSection[];
    closingHeadline: string;
    closingBody: string;
    closingCta: { label: string; href: string };
    decorations?: FloatingImage[];
};

/** Site-wide navbar content. Stored at slug "navbar" in site_content. */
export type NavbarLink = {
    label: string;
    href: string;
};

export type NavbarContent = {
    logoImage: string;
    links: NavbarLink[];
};

/** Shared shape for /submission-agreement, /privacy-policy, /terms-and-conditions.
 *  Each section's `body` is a multi-paragraph string — paragraphs separated by
 *  blank lines (\n\n), bullet lines start with "- ". Renderer splits + groups. */
export type LegalSection = {
    title: string;
    body: string;
};

export type LegalPageContent = {
    title: string;
    lastUpdated: string;
    intro: string;
    sections: LegalSection[];
};

/** /our-model page content shape. */
export type OurModelStage = {
    title: string;
    traditional: string;
    ravok: string;
    bullets: string[];
    bulletIcon: "plus" | "check";
};

export type OurModelPageContent = {
    title: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroLead: string;
    stages: OurModelStage[];
    structuralEyebrow: string;
    structuralHeading: string;
    traditionalLabel: string;
    traditionalItems: string[];
    ravokLabel: string;
    ravokItems: string[];
    ctaEyebrow: string;
    ctaHeading: string;
    ctaBody: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    decorations?: FloatingImage[];
};
