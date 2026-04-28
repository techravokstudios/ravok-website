"use client";

/**
 * EditModeSidebar — Webflow-style left panel that opens alongside edit mode.
 *
 * Tabs:
 *   - Layers:   tree of sections + their key elements with click-to-scroll
 *               and trash icons for removable elements
 *   - Add:      library of things to insert (image slot, new section, etc.)
 *
 * The sidebar is mounted by EditModeOverlay only when enabled === true and
 * the user has explicitly opened it via the toolbar button.
 */

import { useEffect, useRef, useState } from "react";
import {
    Layers,
    Plus,
    Trash2,
    Image as ImageIcon,
    Type,
    LayoutGrid,
    ChevronDown,
    ChevronRight,
    X,
    Upload,
    Loader2,
} from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import { ALL_SECTION_KEYS, type HomeContent, type SectionKey } from "@/lib/site-content";
import { uploadAsset } from "@/lib/site-content/api";

/**
 * Find the .section-anchor element whose bounding rect best contains the
 * viewport center. Decorations supports sections that participate in their
 * own animations (sticky, marquee). Returns the section key + the bounding
 * rect so callers can position new decorations relative to it.
 */
type DetectedAnchor = {
    sectionKey: string;
    rect: DOMRect;
};
function detectAnchorInViewport(): DetectedAnchor | null {
    if (typeof document === "undefined") return null;
    const cy = window.innerHeight / 2;
    const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(".section-anchor[data-section]")
    );
    let best: { key: string; rect: DOMRect; distance: number } | null = null;
    for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = (rect.top + rect.bottom) / 2;
        const distance = Math.abs(center - cy);
        const key = el.dataset.section ?? "";
        if (!key) continue;
        if (!best || distance < best.distance) {
            best = { key, rect, distance };
        }
    }
    if (!best) return null;
    return { sectionKey: best.key, rect: best.rect };
}

/**
 * Position relative to a section's bounding rect. Returns
 * coordinates suitable for a FloatingImage stored inside that section's
 * decorations[] array.
 */
function computeCenterInRect(rect: DOMRect): { top: number; left: number } {
    const cyScreen = window.innerHeight / 2;
    const cxScreen = window.innerWidth / 2;
    const topPx = cyScreen - rect.top - 100;
    const leftPct = ((cxScreen - rect.left) / Math.max(1, rect.width)) * 100;
    return {
        top: Math.max(20, topPx),
        left: Math.min(85, Math.max(5, leftPct - 10)),
    };
}

/** Section keys that have a decorations[] field in HomeContent */
const DECORATABLE_SECTIONS = new Set([
    "hero",
    "intro",
    "bridge",
    "portfolio",
    "team",
]);

type Tab = "layers" | "add";

export function EditModeSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [tab, setTab] = useState<Tab>("layers");

    // Toggle body class so main content shifts right when sidebar is open
    useEffect(() => {
        const cls = "edit-mode-sidebar-open";
        if (open) document.body.classList.add(cls);
        else document.body.classList.remove(cls);
        return () => document.body.classList.remove(cls);
    }, [open]);

    if (!open) return null;

    return (
        <aside className="edit-mode-sidebar">
            <div className="edit-mode-sidebar-header">
                <div className="edit-mode-sidebar-tabs">
                    <button
                        type="button"
                        className={tab === "layers" ? "is-active" : ""}
                        onClick={() => setTab("layers")}
                    >
                        <Layers className="w-3.5 h-3.5" /> Layers
                    </button>
                    <button
                        type="button"
                        className={tab === "add" ? "is-active" : ""}
                        onClick={() => setTab("add")}
                    >
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                </div>
                <button
                    type="button"
                    className="edit-mode-sidebar-close"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="edit-mode-sidebar-body">
                {tab === "layers" ? <LayersPanel /> : <AddPanel />}
            </div>
        </aside>
    );
}

/* ───────────── LAYERS ───────────── */

function LayersPanel() {
    const { content, setAt } = useEditMode();
    const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
        ALL_SECTION_KEYS.includes(k)
    );
    const missing = ALL_SECTION_KEYS.filter((k) => !stored.includes(k));
    const order: SectionKey[] = [...stored, ...missing];

    return (
        <div className="edit-mode-layers">
            <SectionNode
                label="Hero"
                anchor="top"
                locked
                summary={`Logo · "${content.hero.tagline}"`}
            />
            {order.map((key) => (
                <SectionNode
                    key={key}
                    label={sectionLabel(key)}
                    anchor={key === "intro" ? "about" : key}
                    summary={sectionSummary(key, content)}
                    onHide={() => {
                        if (!confirm(`Hide the ${sectionLabel(key)} section from this page?`)) return;
                        const next = order.filter((k) => k !== key);
                        setAt("sectionOrder", next);
                    }}
                />
            ))}
            <SectionNode label="Footer" anchor="contact" locked summary="Email · links · copyright" />
        </div>
    );
}

function SectionNode({
    label,
    anchor,
    summary,
    locked,
    onHide,
}: {
    label: string;
    anchor: string;
    summary?: string;
    locked?: boolean;
    onHide?: () => void;
}) {
    const [open, setOpen] = useState(false);

    function scrollTo() {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div className="edit-mode-layers-section">
            <div className="edit-mode-layers-section-header">
                <button
                    type="button"
                    className="edit-mode-layers-toggle"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Collapse" : "Expand"}
                >
                    {open ? (
                        <ChevronDown className="w-3 h-3" />
                    ) : (
                        <ChevronRight className="w-3 h-3" />
                    )}
                </button>
                <button
                    type="button"
                    className="edit-mode-layers-name"
                    onClick={scrollTo}
                    title="Scroll to this section"
                >
                    {label}
                </button>
                {!locked && onHide && (
                    <button
                        type="button"
                        className="edit-mode-layers-trash"
                        onClick={onHide}
                        aria-label={`Hide ${label}`}
                        title="Remove section from page"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </div>
            {summary && (
                <div className="edit-mode-layers-summary">{summary}</div>
            )}
        </div>
    );
}

function sectionLabel(k: SectionKey): string {
    switch (k) {
        case "intro":
            return "Intro / About";
        case "bridge":
            return "Bridge / REITs";
        case "portfolio":
            return "Portfolio";
        case "team":
            return "Team";
    }
}

function sectionSummary(k: SectionKey, c: HomeContent): string {
    switch (k) {
        case "intro":
            return `${c.intro.headline.slice(0, 40)}…`;
        case "bridge":
            return `${c.bridge.rows.length} comparison rows`;
        case "portfolio":
            return `${c.portfolio.steps.length} pillars`;
        case "team":
            return `${c.team.members.length} members`;
    }
}

/* ───────────── ADD ───────────── */

function AddPanel() {
    const { content, setAt, pushAt } = useEditMode();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [lastAddedTo, setLastAddedTo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function addHiddenSection(key: SectionKey) {
        const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
            ALL_SECTION_KEYS.includes(k)
        );
        if (stored.includes(key)) {
            alert("That section is already on the page.");
            return;
        }
        setAt("sectionOrder", [...stored, key]);
    }

    /**
     * Drop a new decoration into whichever section is currently most visible
     * in the viewport. Decoration is INSIDE that section's content tree, so
     * it rides along with whatever the section is doing (sticky cover,
     * marquee scroll, etc.). Position relative to the section's bounding box.
     */
    function addFloatingImage(src: string) {
        const detected = detectAnchorInViewport();
        if (!detected || !DECORATABLE_SECTIONS.has(detected.sectionKey)) {
            alert(
                "Scroll to a section (Hero / Intro / Bridge / Portfolio / Team) first, then click Add image. Decorations are scoped to a section so they ride along with its animations."
            );
            return;
        }
        const id = `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const { top, left } = computeCenterInRect(detected.rect);
        const sectionPath = `${detected.sectionKey}.decorations`;
        pushAt(sectionPath, {
            id,
            type: "image",
            src,
            top,
            left,
            width: 200,
        });
        setLastAddedTo(detected.sectionKey);
    }

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const rec = await uploadAsset(file);
            addFloatingImage(rec.url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
        ALL_SECTION_KEYS.includes(k)
    );
    const hiddenSections = ALL_SECTION_KEYS.filter((k) => !stored.includes(k));
    const totalDecorations =
        (content.hero.decorations?.length ?? 0) +
        (content.intro.decorations?.length ?? 0) +
        (content.bridge.decorations?.length ?? 0) +
        (content.portfolio.decorations?.length ?? 0) +
        (content.team.decorations?.length ?? 0);

    return (
        <div className="edit-mode-add">
            <div className="edit-mode-add-group">
                <div className="edit-mode-add-group-label">Decorations (free-form image)</div>
                <p className="edit-mode-add-empty">
                    Drop an image inside the section currently in your viewport. It rides along
                    with that section&apos;s animation (sticky cover, marquee scroll). Drag to move,
                    corner to resize, bottom-left to rotate. Total on this page:{" "}
                    <strong>{totalDecorations}</strong>.
                    {lastAddedTo && (
                        <>
                            {" "}
                            Last added to <strong>{lastAddedTo}</strong>.
                        </>
                    )}
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                />
                <button
                    type="button"
                    className="edit-mode-image-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{ width: "100%", justifyContent: "center" }}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading…
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Add image (upload)
                        </>
                    )}
                </button>
                {uploadError && (
                    <p className="edit-mode-image-upload-error">{uploadError}</p>
                )}
                <button
                    type="button"
                    className="edit-mode-add-tile"
                    style={{ width: "100%", marginTop: "0.5rem", flexDirection: "row", gap: "0.4rem" }}
                    onClick={() => {
                        const url = prompt("Paste image URL");
                        if (url && url.trim()) addFloatingImage(url.trim());
                    }}
                >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Add image (paste URL)</span>
                </button>
            </div>

            <div className="edit-mode-add-group">
                <div className="edit-mode-add-group-label">Sections currently hidden</div>
                {hiddenSections.length === 0 ? (
                    <p className="edit-mode-add-empty">
                        All sections are on the page. Use the trash icon in Layers to hide one first,
                        then come back here to re-add it.
                    </p>
                ) : (
                    <div className="edit-mode-add-grid">
                        {hiddenSections.map((k) => (
                            <button
                                key={k}
                                type="button"
                                className="edit-mode-add-tile"
                                onClick={() => addHiddenSection(k)}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span>{sectionLabel(k)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="edit-mode-add-group">
                <div className="edit-mode-add-group-label">Within-section actions</div>
                <p className="edit-mode-add-empty">
                    Inside each section: drag handles let you reorder items; the <strong>+ Add</strong>{" "}
                    button at the bottom of each list adds a new fact / row / member / pillar; trash
                    icons on each item remove it.
                </p>
                <div className="edit-mode-add-icon-row">
                    <span><ImageIcon className="w-3 h-3" /> Image slots are removable + replaceable</span>
                    <span><Type className="w-3 h-3" /> Click any text to edit inline</span>
                </div>
            </div>
        </div>
    );
}
