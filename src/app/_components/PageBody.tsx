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
import { Hero, IntroSection, Bridge, Portfolio, Team } from "@/components/sections";
import Footer from "@/components/layout/Footer";
import {
    EditModeProvider,
    EditModeOverlay,
    FloatingElementsLayer,
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

    return (
        <main
            className="min-h-screen text-white selection:bg-ravok-gold selection:text-black"
            style={{ overflowX: "clip", position: "relative" }}
        >
            <div className="floating-anchor" data-anchor="hero" style={{ position: "relative" }}>
                <Hero content={content.hero} />
                <FloatingElementsLayer anchor="hero" />
            </div>
            {order.map((key, position) => (
                <SectionSlot key={key} sectionKey={key} position={position} />
            ))}
            <div
                className="relative z-[60] floating-anchor"
                data-anchor="footer"
                style={{ position: "relative" }}
            >
                <Footer />
                <FloatingElementsLayer anchor="footer" />
            </div>
            {/* Legacy / document-anchored elements still float over the whole page */}
            <FloatingElementsLayer anchor="document" />
        </main>
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
        // Out of edit mode: still wrap in floating-anchor container so floating
        // elements anchored to this section render relative to it.
        return (
            <div
                className="floating-anchor"
                data-anchor={sectionKey}
                style={{ position: "relative" }}
            >
                {sectionEl}
                <FloatingElementsLayer anchor={sectionKey} />
            </div>
        );
    }

    return (
        <div
            className="edit-mode-section-slot floating-anchor"
            data-section={sectionKey}
            data-anchor={sectionKey}
            data-position={position}
            style={{ position: "relative" }}
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
            <FloatingElementsLayer anchor={sectionKey} />
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
