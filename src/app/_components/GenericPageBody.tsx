"use client";

/**
 * GenericPageBody — renders an admin-created page (anything other than home).
 *
 * Wraps the section tree in EditModeProvider configured for the page's slug,
 * so admins can edit it the same way they edit the homepage. Renders only
 * customBlocks (no fixed sections), plus a global decoration layer and the
 * shared Footer.
 *
 * The EditModeProvider currently expects HomeContent shape. For generic
 * pages we adapt: we wrap GenericPageContent into a HomeContent-shaped
 * skeleton with empty defaults for the fixed sections, expose the real
 * data via customBlocks, and on save extract back to GenericPageContent.
 *
 * For v14 (this slice) we use the simpler path: a separate GenericEditModeProvider
 * focused only on customBlocks. Same APIs, smaller surface.
 */

import { useEffect, useState } from "react";
import {
    ImageBlockSection,
    RichTextSection,
    TwoColumnSection,
    CalloutSection,
    CtaBlockSection,
} from "@/components/sections";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
    EditModeProvider,
    EditModeOverlay,
    useEditMode,
} from "@/lib/edit-mode";
import {
    DEFAULT_HOME_CONTENT,
    type GenericPageContent,
    type HomeContent,
    type NavbarContent,
} from "@/lib/site-content";

/**
 * Adapter: wrap GenericPageContent in a HomeContent skeleton so we can reuse
 * EditModeProvider unchanged. Only customBlocks + footer are user-visible
 * here; the fixed sections render as empty placeholders.
 *
 * Effective content paths used by editable components:
 *   customBlocks.<i>.props.<field>  — main editing surface
 *   footer.<field>                  — shared footer
 *
 * On save the whole HomeContent is sent, but only customBlocks + footer +
 * decorations are meaningful for generic pages. The site_content row keeps
 * the full JSON; render layers ignore the fixed-section fields.
 */
function adaptToHomeShape(
    generic: GenericPageContent,
    navbar?: NavbarContent
): HomeContent {
    return {
        ...DEFAULT_HOME_CONTENT,
        customBlocks: generic.customBlocks ?? [],
        // Title + meta + navbar are stored alongside (not part of HomeContent
        // type but PHP backend accepts arbitrary JSON, so they survive
        // round-trips). We keep them via a non-standard cast.
        ...({
            title: generic.title,
            metaDescription: generic.metaDescription,
            navbar,
        } as object),
    } as HomeContent;
}

export default function GenericPageBody({
    slug,
    initialContent,
    navbar,
}: {
    slug: string;
    initialContent: GenericPageContent;
    navbar?: NavbarContent;
}) {
    const adapted = adaptToHomeShape(initialContent, navbar);
    const saveFn = async (content: HomeContent): Promise<HomeContent> => {
        const { saveSplitPageAndNavbar } = await import("@/lib/site-content");
        const persisted = await saveSplitPageAndNavbar(
            slug,
            content as unknown as Record<string, unknown>
        );
        return persisted as unknown as HomeContent;
    };

    return (
        <EditModeProvider initialContent={adapted} saveFn={saveFn}>
            <BodyClassToggle />
            <Navbar content={navbar} />
            <main
                className="min-h-screen text-white selection:bg-ravok-gold selection:text-black"
                style={{ overflowX: "clip" }}
                data-page-slug={slug}
            >
                <PageHeader title={initialContent.title} />
                <CustomBlocks />
                <div className="relative z-[60] section-anchor" data-section="footer" style={{ position: "relative" }}>
                    <Footer />
                </div>
            </main>
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function PageHeader({ title }: { title: string }) {
    return (
        <section className="py-32 px-6 lg:px-10 text-center">
            <h1 className="font-heading font-normal text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[var(--ds-ink)]">
                {title}
            </h1>
        </section>
    );
}

function CustomBlocks() {
    const { content } = useEditMode();
    const blocks = content.customBlocks ?? [];
    const BASE_Z = 14;
    return (
        <>
            {blocks.map((block, i) => {
                const z = BASE_Z + i;
                const id = `custom-${block.id}`;
                switch (block.type) {
                    case "image-block":
                        return <ImageBlockSection key={block.id} blockIndex={i} zIndex={z} id={id} content={block.props} />;
                    case "rich-text":
                        return <RichTextSection key={block.id} blockIndex={i} zIndex={z} id={id} content={block.props} />;
                    case "two-column":
                        return <TwoColumnSection key={block.id} blockIndex={i} zIndex={z} id={id} content={block.props} />;
                    case "callout":
                        return <CalloutSection key={block.id} blockIndex={i} zIndex={z} id={id} content={block.props} />;
                    case "cta-block":
                        return <CtaBlockSection key={block.id} blockIndex={i} zIndex={z} id={id} content={block.props} />;
                    default:
                        return null;
                }
            })}
        </>
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
