"use client";

/**
 * ContactPageBody — CMS-driven /contact-us page.
 *
 * Wraps the original static contact-us layout in EditModeProvider so admins
 * can edit text inline. Content is stored in site_content table at slug
 * "contact-us"; the bundled DEFAULT_CONTACT_PAGE is used as fallback when
 * the row hasn't been created yet (first save persists it).
 */

import { motion } from "framer-motion";
import Link from "next/link";
import {
    EditModeProvider,
    EditModeOverlay,
    EditableText,
    EditableList,
    useEditMode,
} from "@/lib/edit-mode";
import {
    type ContactPageContent,
    type HomeContent,
    saveGenericPage,
} from "@/lib/site-content";
import { useEffect } from "react";

const SLUG = "contact-us";

/** Backend stores arbitrary JSON. We cast the per-page shape to HomeContent
 *  so EditModeProvider's typing is satisfied; path-based access doesn't care. */
function cast(c: ContactPageContent): HomeContent {
    return c as unknown as HomeContent;
}
function uncast(c: HomeContent): ContactPageContent {
    return c as unknown as ContactPageContent;
}

async function saveContact(content: HomeContent): Promise<HomeContent> {
    const persisted = await saveGenericPage(
        SLUG,
        uncast(content) as unknown as Parameters<typeof saveGenericPage>[1]
    );
    return cast(persisted as unknown as ContactPageContent);
}

export default function ContactPageBody({
    initialContent,
}: {
    initialContent: ContactPageContent;
}) {
    return (
        <EditModeProvider initialContent={cast(initialContent)} saveFn={saveContact}>
            <BodyClassToggle />
            <ContactPage />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function ContactPage() {
    const { content } = useEditMode();
    const c = uncast(content);

    return (
        <main className="min-h-screen bg-[var(--ds-bg)] text-[var(--ds-ink)] selection:bg-ravok-gold selection:text-black">
            <section className="min-h-screen flex flex-col justify-center pt-32 pb-24 px-6 lg:px-12">
                <div className="container mx-auto w-full max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <EditableText
                            path="headline"
                            value={c.headline}
                            as="h1"
                            multiline
                            inline={false}
                            className="text-[clamp(3rem,6.5vw,5.5rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.1] mb-24 text-center lg:text-left"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-12"
                    >
                        <EditableList
                            arrayPath="formCtas"
                            items={c.formCtas}
                            defaultNewItem={{ label: "New Form", href: "/form/new" }}
                            addLabel="Add form CTA"
                            as="div"
                            className="flex flex-wrap gap-3"
                            renderItem={(cta, i) => (
                                <FormCtaItem cta={cta} index={i} />
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <EditableText
                            path="contactSectionHeading"
                            value={c.contactSectionHeading}
                            as="h2"
                            className="text-xl font-heading font-semibold text-[var(--ds-ink)] mb-8"
                        />
                        <EditableList
                            arrayPath="inquiryTypes"
                            items={c.inquiryTypes}
                            defaultNewItem={{ label: "New Inquiry", email: "contact@ravokstudios.com" }}
                            addLabel="Add inquiry type"
                            as="div"
                            className="space-y-6"
                            renderItem={(item, i) => (
                                <InquiryTypeItem item={item} index={i} />
                            )}
                        />
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

function FormCtaItem({
    cta,
    index,
}: {
    cta: { label: string; href: string };
    index: number;
}) {
    const { enabled } = useEditMode();

    const inner = (
        <EditableText
            path={`formCtas.${index}.label`}
            value={cta.label}
            as="span"
            inline
            className="font-sans tracking-widest text-xs uppercase"
        />
    );

    const className =
        "px-4 py-2 rounded-full border border-[var(--ds-border-strong)] bg-[rgba(28,28,26,0.3)] text-[var(--ds-ink)] hover:text-ravok-gold hover:bg-[rgba(232,228,218,0.08)] transition-colors";

    if (enabled) {
        return (
            <div className={className}>
                {inner}
                <EditableText
                    path={`formCtas.${index}.href`}
                    value={cta.href}
                    as="div"
                    inline={false}
                    className="font-mono text-[0.55rem] text-[var(--ds-ink-muted)] mt-1"
                />
            </div>
        );
    }

    return (
        <Link href={cta.href} className={className}>
            {inner}
        </Link>
    );
}

function InquiryTypeItem({
    item,
    index,
}: {
    item: { label: string; email: string };
    index: number;
}) {
    const { enabled } = useEditMode();

    return (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <EditableText
                path={`inquiryTypes.${index}.label`}
                value={item.label}
                as="span"
                inline
                className="text-ravok-gold font-sans text-sm sm:w-48 shrink-0"
            />
            {enabled ? (
                <EditableText
                    path={`inquiryTypes.${index}.email`}
                    value={item.email}
                    as="span"
                    inline
                    className="text-[var(--ds-ink-dim)] underline underline-offset-2"
                />
            ) : (
                <a
                    href={`mailto:${item.email}`}
                    className="text-[var(--ds-ink-dim)] hover:text-ravok-gold underline underline-offset-2 transition-colors"
                >
                    {item.email}
                </a>
            )}
        </div>
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
