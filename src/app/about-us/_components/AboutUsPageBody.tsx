"use client";

/**
 * AboutUsPageBody — CMS-driven /about-us page (#76 part 2/3).
 *
 * Preserves the original page's visual structure (hero, numbered watermark
 * sections, alternating layouts) but makes all text editable in-place via
 * EditModeProvider. Falls back to DEFAULT_ABOUT_US_PAGE if no DB row exists
 * for slug "about-us"; first admin save persists.
 */

import { motion } from "framer-motion";
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
    type AboutUsPageContent,
    type HomeContent,
    type NavbarContent,
    saveSplitPageAndNavbar,
} from "@/lib/site-content";

const SLUG = "about-us";

function cast(c: AboutUsPageContent & { navbar?: NavbarContent }): HomeContent {
    return c as unknown as HomeContent;
}
function uncast(c: HomeContent): AboutUsPageContent {
    return c as unknown as AboutUsPageContent;
}

async function saveAboutUs(content: HomeContent): Promise<HomeContent> {
    const persisted = await saveSplitPageAndNavbar(
        SLUG,
        content as unknown as Record<string, unknown>
    );
    return persisted as unknown as HomeContent;
}

export default function AboutUsPageBody({
    initialContent,
    navbar,
}: {
    initialContent: AboutUsPageContent;
    navbar?: NavbarContent;
}) {
    const combined = { ...initialContent, navbar };
    return (
        <EditModeProvider initialContent={cast(combined)} saveFn={saveAboutUs}>
            <BodyClassToggle />
            <Navbar content={navbar} />
            <AboutUsPage />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function AboutUsPage() {
    const { content } = useEditMode();
    const c = uncast(content);

    return (
        <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
            {/* Hero */}
            <section className="min-h-screen flex flex-col justify-center relative px-6 pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/bg_image.png" alt="" className="w-full h-full object-cover opacity-40 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(28,28,26,0.7)] via-[rgba(28,28,26,0.8)] to-[var(--ds-bg)]" />
                </div>
                <div className="container mx-auto relative z-10 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <EditableText
                            path="heroEyebrow"
                            value={c.heroEyebrow}
                            as="p"
                            className="text-ravok-gold/60 font-sans text-sm tracking-[0.3em] uppercase mb-6 text-center"
                        />
                        <EditableText
                            path="heroHeadline"
                            value={c.heroHeadline}
                            as="h1"
                            multiline
                            inline={false}
                            className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal leading-[1.05] text-center text-[var(--ds-ink)] uppercase tracking-[0.02em] mb-8"
                        />
                    </motion.div>
                    <motion.div
                        className="max-w-2xl mx-auto relative pl-8 border-l-2 border-ravok-gold/50"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <EditableText
                            path="heroSubheadline"
                            value={c.heroSubheadline}
                            as="p"
                            multiline
                            inline={false}
                            className="text-ravok-gold font-heading text-xl lg:text-2xl leading-relaxed"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Sections (3 by default — Origin, Mission, Approach) */}
            <EditableList
                arrayPath="sections"
                items={c.sections}
                defaultNewItem={{ eyebrow: "— New section", heading: "New heading", body: "New body copy." }}
                addLabel="Add section"
                as="div"
                className=""
                renderItem={(section, i) => <AboutSection section={section} index={i} />}
            />

            {/* Closing */}
            <section className="py-32 px-6 lg:px-12 border-t border-[var(--ds-border)] text-center">
                <div className="container mx-auto max-w-3xl">
                    <EditableText
                        path="closingHeadline"
                        value={c.closingHeadline}
                        as="h2"
                        className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-ravok-gold leading-tight mb-8"
                    />
                    <EditableText
                        path="closingBody"
                        value={c.closingBody}
                        as="p"
                        multiline
                        inline={false}
                        className="text-[var(--ds-ink-dim)] font-sans text-lg lg:text-xl leading-relaxed mb-10"
                    />
                    <ClosingCta cta={c.closingCta} />
                </div>
            </section>
        </main>
    );
}

function AboutSection({
    section,
    index,
}: {
    section: { eyebrow: string; heading: string; body: string };
    index: number;
}) {
    const sectionNumber = String(index + 2).padStart(2, "0");
    return (
        <section className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-6 border-t border-[var(--ds-border)] relative overflow-hidden">
            <span className="absolute top-1/2 -translate-y-1/2 left-0 text-[20vw] font-heading font-bold text-[rgba(232,228,218,0.04)] leading-none select-none pointer-events-none">
                {sectionNumber}
            </span>
            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-3 flex items-center gap-4">
                        <span className="text-[var(--ds-ink-dim)] w-6 h-6 border border-[var(--ds-border-strong)] rounded-sm shrink-0" />
                        <EditableText
                            path={`sections.${index}.eyebrow`}
                            value={section.eyebrow}
                            as="span"
                            inline
                            className="text-[var(--ds-ink)] font-sans text-base tracking-widest uppercase"
                        />
                    </div>
                    <div className="lg:col-span-9">
                        <EditableText
                            path={`sections.${index}.heading`}
                            value={section.heading}
                            as="h2"
                            multiline
                            inline={false}
                            className="text-[clamp(2.5rem,4.5vw,4rem)] font-heading font-normal text-ravok-gold leading-tight mb-12"
                        />
                        <EditableText
                            path={`sections.${index}.body`}
                            value={section.body}
                            as="p"
                            multiline
                            inline={false}
                            className="text-[var(--ds-ink-dim)] font-sans text-lg lg:text-xl leading-relaxed"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ClosingCta({ cta }: { cta: { label: string; href: string } }) {
    const { enabled } = useEditMode();
    const className =
        "inline-flex items-center gap-2 px-8 py-4 rounded-full border border-ravok-gold bg-[rgba(196,149,58,0.1)] text-ravok-gold hover:bg-ravok-gold hover:text-[var(--ds-bg)] transition-colors font-sans tracking-widest text-sm uppercase";

    const inner = (
        <EditableText
            path="closingCta.label"
            value={cta.label}
            as="span"
            inline
            className=""
        />
    );

    if (enabled) {
        return (
            <div>
                <div className={className}>{inner}</div>
                <EditableText
                    path="closingCta.href"
                    value={cta.href}
                    as="div"
                    inline={false}
                    className="font-mono text-xs text-[var(--ds-ink-muted)] mt-2"
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
