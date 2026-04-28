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
export type SectionKey = "intro" | "bridge" | "portfolio" | "team";
export const ALL_SECTION_KEYS: SectionKey[] = ["intro", "bridge", "portfolio", "team"];

export type HomeContent = {
    sectionOrder?: SectionKey[];
    hero: {
        tagline: string;
        logoImage: string;
        templeImage: string;
        scrollCue: string;
        logoImageTransform?: ImageTransform;
        templeImageTransform?: ImageTransform;
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
    };
    portfolio: {
        label: string;
        counterSuffix: string;
        steps: PortfolioStepContent[];
    };
    team: {
        eyebrow: string;
        headline: string;
        lead: string;
        members: TeamMemberContent[];
        coinFrame: string;
        coinFrameTransform?: ImageTransform;
    };
    footer: {
        email: string;
        logoText: string;
        links: FooterLink[];
        copyright: string;
    };
};

export type SiteContentEnvelope<T = HomeContent> = {
    slug: string;
    content: T;
    updated_at?: string;
};
