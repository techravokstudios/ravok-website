"use client";

/**
 * LegalPageBody — shared CMS-driven body for the long-form legal pages
 * (/submission-agreement, /privacy-policy, /terms-and-conditions).
 *
 * Content is `LegalPageContent`: title + lastUpdated + intro + numbered
 * sections. Each section has a title and a body string with simple
 * markdown-like conventions — paragraphs separated by blank lines,
 * lines starting with "- " become bullet items.
 *
 * Admin in-page editing: the existing EditableText / EditableList from
 * edit-mode work; saving goes to the page's slug via saveGenericPage.
 */

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    EditModeProvider,
    EditModeOverlay,
    EditableText,
    EditableList,
    useEditMode,
} from "@/lib/edit-mode";
import {
    type LegalPageContent,
    type HomeContent,
    type NavbarContent,
    saveSplitPageAndNavbar,
} from "@/lib/site-content";

function cast(c: LegalPageContent & { navbar?: NavbarContent }): HomeContent {
    return c as unknown as HomeContent;
}
function uncast(c: HomeContent): LegalPageContent {
    return c as unknown as LegalPageContent;
}

function makeSaveLegalPage(slug: string) {
    return async (content: HomeContent): Promise<HomeContent> => {
        const persisted = await saveSplitPageAndNavbar(
            slug,
            content as unknown as Record<string, unknown>
        );
        return persisted as unknown as HomeContent;
    };
}

export default function LegalPageBody({
    slug,
    initialContent,
    navbar,
}: {
    slug: string;
    initialContent: LegalPageContent;
    navbar?: NavbarContent;
}) {
    const saveFn = makeSaveLegalPage(slug);
    const combined = { ...initialContent, navbar };
    return (
        <EditModeProvider initialContent={cast(combined)} saveFn={saveFn}>
            <BodyClassToggle />
            <Navbar content={navbar} />
            <LegalPage />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function LegalPage() {
    const { content } = useEditMode();
    const c = uncast(content);

    return (
        <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black overflow-x-hidden">
            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-ravok-gold/5 via-transparent to-transparent" />
                    <div className="absolute top-1/4 left-0 w-40 h-px bg-gradient-to-r from-ravok-gold/40 to-transparent" />
                    <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-ravok-gold/30 to-transparent" />
                </div>
                <div className="container mx-auto max-w-4xl relative z-10">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-ravok-slate font-sans text-sm uppercase tracking-widest hover:text-ravok-gold transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to home
                        </Link>
                    </motion.div>

                    <motion.div
                        className="flex items-start gap-5 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <FileText className="w-10 h-10 text-ravok-gold shrink-0 mt-1" />
                        <div className="flex-1">
                            <EditableText
                                path="title"
                                value={c.title}
                                as="h1"
                                multiline
                                inline={false}
                                className="text-4xl sm:text-5xl font-heading font-normal text-ravok-gold leading-tight"
                            />
                            <EditableText
                                path="lastUpdated"
                                value={c.lastUpdated}
                                as="p"
                                className="font-sans text-sm text-ravok-slate mt-3"
                            />
                        </div>
                    </motion.div>

                    <EditableText
                        path="intro"
                        value={c.intro}
                        as="p"
                        multiline
                        inline={false}
                        className="font-sans text-sm text-white/70 leading-relaxed max-w-3xl"
                    />
                </div>
            </section>

            {/* Sections */}
            <section className="px-6 pb-24">
                <div className="container mx-auto max-w-4xl space-y-16">
                    <EditableList
                        arrayPath="sections"
                        items={c.sections}
                        defaultNewItem={{ title: "New section", body: "Section body." }}
                        addLabel="Add section"
                        as="div"
                        className="space-y-16"
                        renderItem={(section, i) => (
                            <LegalSectionRow section={section} index={i} />
                        )}
                    />
                </div>
            </section>

            <Footer />
        </main>
    );
}

function LegalSectionRow({
    section,
    index,
}: {
    section: { title: string; body: string };
    index: number;
}) {
    return (
        <motion.div
            id={`section-${index + 1}`}
            className="scroll-mt-32 pl-6 lg:pl-8 border-l-2 border-ravok-gold/30 hover:border-ravok-gold/50 transition-colors duration-300 py-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 rounded-full border-2 border-ravok-gold flex items-center justify-center font-heading text-ravok-gold text-sm font-bold shrink-0">
                    {index + 1}
                </span>
                <EditableText
                    path={`sections.${index}.title`}
                    value={section.title}
                    as="h2"
                    inline={false}
                    className="text-xl font-heading text-ravok-gold flex-1"
                />
            </div>
            <div className="font-sans text-white/85 leading-relaxed space-y-4">
                <EditableText
                    path={`sections.${index}.body`}
                    value={section.body}
                    as="div"
                    multiline
                    inline={false}
                    className="legal-body whitespace-pre-line"
                />
            </div>
        </motion.div>
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
