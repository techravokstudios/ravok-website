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
    AlignLeft,
    Columns,
    Quote,
    MousePointer,
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
    const { content, setAt, removeAt } = useEditMode();
    const stored = (content.sectionOrder ?? []).filter((k): k is SectionKey =>
        ALL_SECTION_KEYS.includes(k)
    );
    const missing = ALL_SECTION_KEYS.filter((k) => !stored.includes(k));
    const order: SectionKey[] = [...stored, ...missing];
    const customBlocks = content.customBlocks ?? [];

    // Collect every decoration across every section so admins have a single
    // place to find + delete them (vs. having to hunt for hover-only toolbars
    // on each decoration scattered across the page).
    type DecorEntry = {
        sectionKey: string;
        sectionLabel: string;
        anchor: string;
        path: string; // dot-path of the decorations array
        index: number;
        src: string;
    };
    const allDecorations: DecorEntry[] = [];
    function collect(
        sectionKey: string,
        label: string,
        anchor: string,
        path: string,
        decorations: { id: string; type: string; src?: string }[] | undefined,
    ) {
        (decorations ?? []).forEach((d, i) => {
            allDecorations.push({
                sectionKey,
                sectionLabel: label,
                anchor,
                path,
                index: i,
                src: (d as { src?: string }).src ?? "",
            });
        });
    }
    collect("hero", "Hero", "top", "hero.decorations", content.hero.decorations);
    collect("intro", "Intro", "about", "intro.decorations", content.intro.decorations);
    collect("bridge", "Bridge", "bridge", "bridge.decorations", content.bridge.decorations);
    collect("portfolio", "Portfolio", "portfolio", "portfolio.decorations", content.portfolio.decorations);
    collect("team", "Team", "team", "team.decorations", content.team.decorations);

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
            {customBlocks.map((block, i) => (
                <SectionNode
                    key={block.id}
                    label={`+ ${customBlockLabel(block.type)}`}
                    anchor={`custom-${block.id}`}
                    summary={customBlockSummary(block)}
                    onHide={() => {
                        if (!confirm("Remove this custom block?")) return;
                        removeAt("customBlocks", i);
                    }}
                />
            ))}
            <SectionNode label="Footer" anchor="contact" locked summary="Email · links · copyright" />

            {allDecorations.length > 0 && (
                <div className="edit-mode-decor-list">
                    <div className="edit-mode-decor-list-header">
                        Decorations on this page ({allDecorations.length})
                    </div>
                    {allDecorations.map((d) => (
                        <div key={`${d.path}-${d.index}`} className="edit-mode-decor-item">
                            <button
                                type="button"
                                className="edit-mode-decor-thumb"
                                onClick={() => {
                                    const el = document.getElementById(d.anchor);
                                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                title={`Scroll to ${d.sectionLabel}`}
                            >
                                {d.src ? (
                                    <img src={d.src} alt="" />
                                ) : (
                                    <ImageIcon className="w-3 h-3" />
                                )}
                            </button>
                            <div className="edit-mode-decor-meta">
                                <div className="edit-mode-decor-section">{d.sectionLabel}</div>
                                <div className="edit-mode-decor-filename">
                                    {d.src ? d.src.split("/").pop() : "(no image)"}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="edit-mode-decor-delete"
                                onClick={() => {
                                    if (!confirm(`Delete this decoration from ${d.sectionLabel}?`)) return;
                                    removeAt(d.path, d.index);
                                }}
                                aria-label="Delete decoration"
                                title="Delete decoration"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function customBlockLabel(t: string): string {
    switch (t) {
        case "image-block": return "Image block";
        case "rich-text": return "Rich text";
        case "two-column": return "Two column";
        case "callout": return "Quote / callout";
        case "cta-block": return "CTA block";
        default: return t;
    }
}

function customBlockSummary(block: NonNullable<HomeContent["customBlocks"]>[number]): string {
    switch (block.type) {
        case "image-block": {
            const file = block.props.image ? block.props.image.split("/").pop() : "(no image)";
            return `Image: ${file}${block.props.caption ? ` · "${block.props.caption.slice(0, 30)}"` : ""}`;
        }
        case "rich-text":
            return `"${(block.props.heading || block.props.eyebrow || "Untitled").slice(0, 40)}"`;
        case "two-column": {
            const file = block.props.image ? block.props.image.split("/").pop() : "(no image)";
            return `${block.props.imagePosition} image · "${block.props.heading.slice(0, 30)}"`;
        }
        case "callout":
            return `"${block.props.quote.slice(0, 50)}…"`;
        case "cta-block":
            return `"${block.props.heading}" · ${block.props.ctas.length} CTA${block.props.ctas.length === 1 ? "" : "s"}`;
        default:
            return "";
    }
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
        case "window":
            return "The Window";
        case "signal":
            return "The Signal";
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
        case "window":
            return c.window?.headline ?? "Applications";
        case "signal":
            return c.signal?.headline.slice(0, 40) ?? "Final CTA";
    }
}

/* ───────────── ADD ───────────── */

function AddPanel() {
    const { content, setAt, pushAt } = useEditMode();
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [lastAddedTo, setLastAddedTo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /** Append a new custom block of the given type with sensible defaults. */
    function addBlock(blockType: "image-block" | "rich-text" | "two-column" | "callout" | "cta-block") {
        const id = `block-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

        let block;
        switch (blockType) {
            case "image-block":
                block = {
                    id,
                    type: "image-block" as const,
                    props: { image: "", caption: "", fullBleed: false },
                };
                break;
            case "rich-text":
                block = {
                    id,
                    type: "rich-text" as const,
                    props: {
                        eyebrow: "— Section",
                        heading: "New section heading",
                        body: "Body copy here. Use **phrase** for gold-italic emphasis.",
                        align: "left" as const,
                    },
                };
                break;
            case "two-column":
                block = {
                    id,
                    type: "two-column" as const,
                    props: {
                        imagePosition: "right" as const,
                        image: "",
                        eyebrow: "— Section",
                        heading: "New heading",
                        body: "Body copy here.",
                    },
                };
                break;
            case "callout":
                block = {
                    id,
                    type: "callout" as const,
                    props: {
                        quote: "A bold pull-quote that captures the moment.",
                        attribution: "— Source",
                    },
                };
                break;
            case "cta-block":
                block = {
                    id,
                    type: "cta-block" as const,
                    props: {
                        eyebrow: "— Take Action",
                        heading: "Ready to talk?",
                        body: "Short pitch line.",
                        ctas: [
                            { label: "Get in touch", href: "#contact", variant: "primary" as const },
                        ],
                    },
                };
                break;
        }

        pushAt("customBlocks", block);
        setLastAddedTo(blockType);
        setTimeout(() => {
            const el = document.getElementById(`custom-${id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }

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
     * marquee scroll, scrollytell). Position relative to the section's
     * bounding box.
     *
     * Target auto-detect: looks at the element under the viewport center for
     * an ancestor with [data-decoration-zone]. If found, that zone's value
     * (marquee | scrollytell) becomes the decoration's target. Otherwise
     * defaults to "section" — the decoration tracks the sticky chain only.
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

        // Target auto-detect — what sub-zone of the section is the drop over?
        let target: "section" | "marquee" | "scrollytell" = "section";
        if (typeof document !== "undefined") {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const elAtPoint = document.elementFromPoint(cx, cy) as HTMLElement | null;
            const zoneEl = elAtPoint?.closest("[data-decoration-zone]") as HTMLElement | null;
            const zone = zoneEl?.getAttribute("data-decoration-zone");
            if (zone === "marquee" || zone === "scrollytell") {
                target = zone;
            }
        }

        pushAt(sectionPath, {
            id,
            type: "image",
            src,
            top,
            left,
            width: 200,
            target,
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

    const customCount = (content.customBlocks ?? []).length;

    return (
        <div className="edit-mode-add">
            <div className="edit-mode-add-group">
                <div className="edit-mode-add-group-label">Add a section</div>
                <p className="edit-mode-add-empty">
                    New sections render after the existing ones (Team) and before the footer. Currently
                    on this page: <strong>{customCount}</strong>.
                </p>
                <div className="edit-mode-add-grid">
                    <button type="button" className="edit-mode-add-tile" onClick={() => addBlock("image-block")}>
                        <ImageIcon className="w-4 h-4" />
                        <span>Image</span>
                    </button>
                    <button type="button" className="edit-mode-add-tile" onClick={() => addBlock("rich-text")}>
                        <AlignLeft className="w-4 h-4" />
                        <span>Rich text</span>
                    </button>
                    <button type="button" className="edit-mode-add-tile" onClick={() => addBlock("two-column")}>
                        <Columns className="w-4 h-4" />
                        <span>Two column</span>
                    </button>
                    <button type="button" className="edit-mode-add-tile" onClick={() => addBlock("callout")}>
                        <Quote className="w-4 h-4" />
                        <span>Quote</span>
                    </button>
                    <button type="button" className="edit-mode-add-tile" onClick={() => addBlock("cta-block")}>
                        <MousePointer className="w-4 h-4" />
                        <span>CTA</span>
                    </button>
                </div>
            </div>

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
