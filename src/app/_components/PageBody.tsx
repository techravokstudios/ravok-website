"use client";

/**
 * PageBody — client-side wrapper around the homepage content tree.
 *
 * Why this exists:
 *   - The homepage is a server component that fetches `HomeContent` once.
 *   - Edit mode is a CLIENT concern (contentEditable, localStorage admin
 *     check, save state).
 *   - This wrapper owns the EditModeProvider and renders the section tree
 *     from the live context state, so admins see edits applied immediately.
 *
 * Section order is data-driven via `content.sectionOrder` (an array of
 * SectionKey). Hero is always first; Footer is always last; everything
 * between renders in the order defined by the array. Admins can drag-
 * reorder these sections in edit mode.
 */

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import {
    Hero,
    IntroSection,
    Bridge,
    Portfolio,
    Team,
    ImageBlockSection,
    RichTextSection,
    TwoColumnSection,
    CalloutSection,
    CtaBlockSection,
} from "@/components/sections";
import Footer from "@/components/layout/Footer";
import {
    EditModeProvider,
    EditModeOverlay,
    SectionFocusOverlay,
    useEditMode,
} from "@/lib/edit-mode";
import { ALL_SECTION_KEYS, type HomeContent, type SectionKey } from "@/lib/site-content";
import { moveInArrayAtPath } from "@/lib/edit-mode/path-utils";

export function PageBody({ initialContent }: { initialContent: HomeContent }) {
    return (
        <EditModeProvider initialContent={initialContent}>
            <BodyClassToggle />
            <Sections />
            <EditModeOverlay />
        </EditModeProvider>
    );
}

function Sections() {
    const { content } = useEditMode();
    // Resolve order: stored array (filtered to known keys) + any missing keys
    // appended at the end so newly-added section types still appear.
    const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
        ALL_SECTION_KEYS.includes(k)
    );
    const missing = ALL_SECTION_KEYS.filter((k) => !stored.includes(k));
    const order: SectionKey[] = [...stored, ...missing];

    const customBlocks = content.customBlocks ?? [];
    // Custom blocks render after the core sections — z-index above the core
    // ladder (10–13) but below footer (60). Each block gets its own z-index
    // so they cover-from-below in array order.
    const CUSTOM_BLOCK_BASE_Z = 14;

    return (
        <main
            className="min-h-screen text-white selection:bg-ravok-gold selection:text-black"
            style={{ overflowX: "clip" }}
        >
            <div className="section-anchor" data-section="hero" style={{ position: "relative" }}>
                <SectionFocusOverlay sectionKey="hero" />
                <Hero content={content.hero} />
            </div>
            {order.map((key, position) => (
                <SectionSlot key={key} sectionKey={key} position={position} />
            ))}
            {customBlocks.map((block, i) => (
                <CustomBlockSlot key={block.id} block={block} index={i} z={CUSTOM_BLOCK_BASE_Z + i} />
            ))}
            <div className="relative z-[60] section-anchor" data-section="footer" style={{ position: "relative" }}>
                <SectionFocusOverlay sectionKey="footer" />
                <Footer content={content.footer} />
            </div>
        </main>
    );
}

function CustomBlockSlot({
    block,
    index,
    z,
}: {
    block: NonNullable<HomeContent["customBlocks"]>[number];
    index: number;
    z: number;
}) {
    const { enabled, removeAt, moveAt } = useEditMode();
    const [dragFrom, setDragFrom] = useState<number | null>(null);
    const sectionId = `custom-${block.id}`;

    const inner = (() => {
        switch (block.type) {
            case "image-block":
                return (
                    <ImageBlockSection
                        blockIndex={index}
                        zIndex={z}
                        id={sectionId}
                        content={block.props}
                    />
                );
            case "rich-text":
                return (
                    <RichTextSection
                        blockIndex={index}
                        zIndex={z}
                        id={sectionId}
                        content={block.props}
                    />
                );
            case "two-column":
                return (
                    <TwoColumnSection
                        blockIndex={index}
                        zIndex={z}
                        id={sectionId}
                        content={block.props}
                    />
                );
            case "callout":
                return (
                    <CalloutSection
                        blockIndex={index}
                        zIndex={z}
                        id={sectionId}
                        content={block.props}
                    />
                );
            case "cta-block":
                return (
                    <CtaBlockSection
                        blockIndex={index}
                        zIndex={z}
                        id={sectionId}
                        content={block.props}
                    />
                );
            default:
                return null;
        }
    })();

    if (!enabled) {
        return (
            <div className="section-anchor" data-section={sectionId}>
                {inner}
            </div>
        );
    }

    return (
        <div
            className="edit-mode-section-slot section-anchor"
            data-section={sectionId}
            data-block-index={index}
            onDragOver={(e) => {
                if (dragFrom !== null && dragFrom !== index) e.preventDefault();
            }}
            onDrop={(e) => {
                e.preventDefault();
                const fromStr = e.dataTransfer.getData("application/x-custom-block");
                const from = Number.parseInt(fromStr, 10);
                if (Number.isNaN(from) || from === index) return;
                moveAt("customBlocks", from, index);
                setDragFrom(null);
            }}
        >
            <SectionFocusOverlay sectionKey={sectionId} />
            <div className="edit-mode-section-handle">
                <button
                    type="button"
                    className="edit-mode-section-handle-btn"
                    draggable
                    onDragStart={(e) => {
                        setDragFrom(index);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("application/x-custom-block", String(index));
                    }}
                    onDragEnd={() => setDragFrom(null)}
                    title={`Drag to reorder · ${block.type}`}
                    aria-label={`Reorder ${block.type} block`}
                >
                    <GripVertical className="w-3.5 h-3.5" />
                    <span>{block.type}</span>
                </button>
                <button
                    type="button"
                    className="edit-mode-section-handle-btn"
                    style={{ marginLeft: "0.4rem" }}
                    onClick={() => {
                        if (confirm("Remove this custom block? This can't be undone unless you don't save.")) {
                            removeAt("customBlocks", index);
                        }
                    }}
                    title="Remove custom block"
                >
                    Remove
                </button>
            </div>
            {inner}
        </div>
    );
}

/**
 * Renders one section by key, optionally wrapped in a drag-handle overlay
 * when in edit mode. The overlay sits at the top-left of each section's
 * page-pass edge so it doesn't obscure content.
 */
function SectionSlot({
    sectionKey,
    position,
}: {
    sectionKey: SectionKey;
    position: number;
}) {
    const { enabled, content, setAt } = useEditMode();
    const [dragFrom, setDragFrom] = useState<number | null>(null);

    const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
        ALL_SECTION_KEYS.includes(k)
    );
    const missing = ALL_SECTION_KEYS.filter((k) => !stored.includes(k));
    const fullOrder: SectionKey[] = [...stored, ...missing];

    function moveSection(from: number, to: number) {
        const moved = moveInArrayAtPath({ arr: fullOrder } as { arr: SectionKey[] }, "arr", from, to);
        setAt("sectionOrder", moved.arr);
    }

    const sectionEl = (() => {
        switch (sectionKey) {
            case "intro":
                return <IntroSection content={content.intro} />;
            case "bridge":
                return <Bridge content={content.bridge} />;
            case "portfolio":
                return <Portfolio content={content.portfolio} />;
            case "team":
                return <Team content={content.team} />;
        }
    })();

    if (!enabled) {
        return (
            <div className="section-anchor" data-section={sectionKey}>
                {sectionEl}
            </div>
        );
    }

    return (
        <div
            className="edit-mode-section-slot section-anchor"
            data-section={sectionKey}
            data-position={position}
            onDragOver={(e) => {
                if (dragFrom !== null && dragFrom !== position) e.preventDefault();
            }}
            onDrop={(e) => {
                e.preventDefault();
                const fromStr = e.dataTransfer.getData("text/plain");
                const from = Number.parseInt(fromStr, 10);
                if (Number.isNaN(from) || from === position) return;
                moveSection(from, position);
                setDragFrom(null);
            }}
        >
            <SectionFocusOverlay sectionKey={sectionKey} />
            <div className="edit-mode-section-handle">
                <button
                    type="button"
                    className="edit-mode-section-handle-btn"
                    draggable
                    onDragStart={(e) => {
                        setDragFrom(position);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(position));
                    }}
                    onDragEnd={() => setDragFrom(null)}
                    title={`Drag to reorder ${sectionKey}`}
                    aria-label={`Reorder ${sectionKey} section`}
                >
                    <GripVertical className="w-3.5 h-3.5" />
                    <span>{sectionKey}</span>
                </button>
            </div>
            {sectionEl}
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
