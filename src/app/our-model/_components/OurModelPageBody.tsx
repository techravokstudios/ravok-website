"use client";

/**
 * OurModelPageBody — CMS-driven /our-model page (#76 part 3/3).
 *
 * Three-stage comparison + side-by-side structural difference + closing CTA,
 * all wrapped in EditModeProvider with a slug-aware saveFn so admins can
 * edit text inline. Falls back to DEFAULT_OUR_MODEL_PAGE.
 */

import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import {
    EditModeProvider,
    EditModeOverlay,
    EditableText,
    EditableList,
    useEditMode,
} from "@/lib/edit-mode";
import {
    type OurModelPageContent,
    type HomeContent,
    type NavbarContent,
    saveSplitPageAndNavbar,
} from "@/lib/site-content";

const SLUG = "our-model";

function cast(c: OurModelPageContent & { navbar?: NavbarContent }): HomeContent {
    return c as unknown as HomeContent;
}
function uncast(c: HomeContent): OurModelPageContent {
    return c as unknown as OurModelPageContent;
}

async function saveOurModel(content: HomeContent): Promise<HomeContent> {
    const persisted = await saveSplitPageAndNavbar(
        SLUG,
        content as unknown as Record<string, unknown>
    );
    return persisted as unknown as HomeContent;
}

export default function OurModelPageBody({
    initialContent,
    navbar,
}: {
    initialContent: OurModelPageContent;
    navbar?: NavbarContent;
}) {
    const combined = { ...initialContent, navbar };
    return (
        <EditModeProvider initialContent={cast(combined)} saveFn={saveOurModel}>
            <BodyClassToggle />
            <Navbar content={navbar} />
            <OurModelPage />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function OurModelPage() {
    const { content } = useEditMode();
    const c = uncast(content);

    return (
        <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
            {/* Hero */}
            <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)] relative overflow-hidden">
                <div className="absolute top-1/4 left-0 w-28 h-px bg-gradient-to-r from-ravok-gold/40 to-transparent z-10" />
                <div className="absolute bottom-1/3 right-0 w-32 h-px bg-gradient-to-l from-ravok-gold/30 to-transparent z-10" />
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <EditableText
                            path="heroEyebrow"
                            value={c.heroEyebrow}
                            as="p"
                            className="inline-block text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6"
                        />
                        <EditableText
                            path="heroHeadline"
                            value={c.heroHeadline}
                            as="h1"
                            multiline
                            inline={false}
                            className="text-[clamp(3rem,6vw,5rem)] font-heading font-normal leading-[1.05] text-[var(--ds-ink)] mb-8"
                        />
                        <EditableText
                            path="heroLead"
                            value={c.heroLead}
                            as="p"
                            multiline
                            inline={false}
                            className="max-w-2xl mx-auto text-ravok-gold font-heading text-xl lg:text-2xl leading-relaxed"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stages */}
            <EditableList
                arrayPath="stages"
                items={c.stages}
                defaultNewItem={{
                    title: "STAGE: NEW",
                    traditional: "Traditional approach.",
                    ravok: "Our approach.",
                    bullets: ["Bullet 1", "Bullet 2"],
                    bulletIcon: "check" as const,
                }}
                addLabel="Add stage"
                as="div"
                className=""
                renderItem={(stage, i) => <Stage stage={stage} index={i} />}
            />

            {/* Structural difference */}
            <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)]">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <EditableText
                            path="structuralEyebrow"
                            value={c.structuralEyebrow}
                            as="p"
                            className="inline-block text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6"
                        />
                        <EditableText
                            path="structuralHeading"
                            value={c.structuralHeading}
                            as="h2"
                            className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-[var(--ds-ink)] leading-tight"
                        />
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Traditional */}
                        <div className="p-8 lg:p-10 rounded-2xl border border-[var(--ds-border)] bg-[rgba(28,28,26,0.4)]">
                            <EditableText
                                path="traditionalLabel"
                                value={c.traditionalLabel}
                                as="h3"
                                className="text-xl font-heading text-[var(--ds-ink-dim)] uppercase tracking-wide mb-8"
                            />
                            <EditableList
                                arrayPath="traditionalItems"
                                items={c.traditionalItems}
                                defaultNewItem="New item"
                                addLabel="Add item"
                                as="ul"
                                className="space-y-3"
                                renderItem={(_, i) => (
                                    <li className="flex items-start gap-3 text-[var(--ds-ink-dim)] font-sans">
                                        <span className="text-[var(--ds-ink-muted)] mt-1">×</span>
                                        <EditableText
                                            path={`traditionalItems.${i}`}
                                            value={c.traditionalItems[i] ?? ""}
                                            as="span"
                                            inline
                                            className=""
                                        />
                                    </li>
                                )}
                            />
                        </div>
                        {/* Ravok */}
                        <div className="p-8 lg:p-10 rounded-2xl border border-ravok-gold/40 bg-[rgba(196,149,58,0.06)]">
                            <EditableText
                                path="ravokLabel"
                                value={c.ravokLabel}
                                as="h3"
                                className="text-xl font-heading text-ravok-gold uppercase tracking-wide mb-8"
                            />
                            <EditableList
                                arrayPath="ravokItems"
                                items={c.ravokItems}
                                defaultNewItem="New item"
                                addLabel="Add item"
                                as="ul"
                                className="space-y-3"
                                renderItem={(_, i) => (
                                    <li className="flex items-start gap-3 text-[var(--ds-ink)] font-sans">
                                        <Check className="w-4 h-4 text-ravok-gold mt-1 shrink-0" />
                                        <EditableText
                                            path={`ravokItems.${i}`}
                                            value={c.ravokItems[i] ?? ""}
                                            as="span"
                                            inline
                                            className=""
                                        />
                                    </li>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="py-32 px-6 lg:px-12 border-t border-[var(--ds-border)] text-center">
                <div className="container mx-auto max-w-3xl">
                    <EditableText
                        path="ctaEyebrow"
                        value={c.ctaEyebrow}
                        as="p"
                        className="inline-block text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6"
                    />
                    <EditableText
                        path="ctaHeading"
                        value={c.ctaHeading}
                        as="h2"
                        className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-ravok-gold leading-tight mb-8"
                    />
                    <EditableText
                        path="ctaBody"
                        value={c.ctaBody}
                        as="p"
                        multiline
                        inline={false}
                        className="text-[var(--ds-ink-dim)] font-sans text-lg lg:text-xl leading-relaxed mb-12"
                    />
                    <div className="flex flex-wrap justify-center gap-4">
                        <CtaButton path="ctaPrimary" cta={c.ctaPrimary} primary />
                        <CtaButton path="ctaSecondary" cta={c.ctaSecondary} primary={false} />
                    </div>
                </div>
            </section>
        </main>
    );
}

function Stage({
    stage,
    index,
}: {
    stage: {
        title: string;
        traditional: string;
        ravok: string;
        bullets: string[];
        bulletIcon: "plus" | "check";
    };
    index: number;
}) {
    const Icon = stage.bulletIcon === "plus" ? Plus : Check;
    return (
        <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)]">
            <div className="container mx-auto max-w-6xl">
                <EditableText
                    path={`stages.${index}.title`}
                    value={stage.title}
                    as="h2"
                    className="text-[clamp(1.5rem,3vw,2.25rem)] font-heading font-normal text-ravok-gold uppercase tracking-wide mb-12 text-center"
                />
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    <div className="p-8 lg:p-10 rounded-2xl border border-[var(--ds-border)] bg-[rgba(28,28,26,0.4)]">
                        <span className="text-[var(--ds-ink-muted)] font-sans text-xs tracking-[0.2em] uppercase block mb-4">
                            Traditional
                        </span>
                        <EditableText
                            path={`stages.${index}.traditional`}
                            value={stage.traditional}
                            as="p"
                            multiline
                            inline={false}
                            className="text-[var(--ds-ink-dim)] font-sans text-base lg:text-lg leading-relaxed"
                        />
                    </div>
                    <div className="p-8 lg:p-10 rounded-2xl border border-ravok-gold/40 bg-[rgba(196,149,58,0.06)]">
                        <span className="text-ravok-gold/70 font-sans text-xs tracking-[0.2em] uppercase block mb-4">
                            Ravok
                        </span>
                        <EditableText
                            path={`stages.${index}.ravok`}
                            value={stage.ravok}
                            as="p"
                            multiline
                            inline={false}
                            className="text-[var(--ds-ink)] font-sans text-base lg:text-lg leading-relaxed"
                        />
                    </div>
                </div>
                <ul className="space-y-2 max-w-2xl mx-auto">
                    {stage.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3 text-ravok-gold font-sans">
                            <Icon className="w-4 h-4 mt-1 shrink-0" />
                            <EditableText
                                path={`stages.${index}.bullets.${bi}`}
                                value={b}
                                as="span"
                                inline
                                className=""
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function CtaButton({
    path,
    cta,
    primary,
}: {
    path: string;
    cta: { label: string; href: string };
    primary: boolean;
}) {
    const { enabled } = useEditMode();
    const className = primary
        ? "inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ravok-gold text-[var(--ds-bg)] hover:bg-ravok-gold/90 transition-colors font-sans tracking-widest text-sm uppercase font-semibold"
        : "inline-flex items-center gap-2 px-8 py-4 rounded-full border border-ravok-gold text-ravok-gold hover:bg-ravok-gold/10 transition-colors font-sans tracking-widest text-sm uppercase";

    const inner = <EditableText path={`${path}.label`} value={cta.label} as="span" inline className="" />;

    if (enabled) {
        return (
            <div>
                <div className={className}>{inner}</div>
                <EditableText
                    path={`${path}.href`}
                    value={cta.href}
                    as="div"
                    inline={false}
                    className="font-mono text-xs text-[var(--ds-ink-muted)] mt-1"
                />
            </div>
        );
    }
    return (
        <a href={cta.href} className={className}>
            {inner}
        </a>
    );
}

function BodyClassToggle() {
    const { enabled } = useEditMode();
    useEffect(() => {
        const cls = "edit-mode-active";
        if (enabled) document.body.classList.add(cls);
        else document.body.classList.remove(cls);
        return () => document.body.classList.remove(cls);
    }, [enabled]);
    return null;
}
