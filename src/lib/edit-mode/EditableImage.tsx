"use client";

/**
 * EditableImage — wraps an image whose `src` lives in CMS content. In edit
 * mode admins can:
 *   1. Click "Change" → swap the image (picker modal, with R2 upload).
 *   2. Click "Transform" → free-form mode: drag to move, drag corner to
 *      scale, drag bottom-edge to rotate. Persists as an ImageTransform on
 *      a parallel content path (e.g. `intro.statueImageTransform`).
 *
 * Out of edit mode the transform metadata still applies — that's how the
 * public site renders Amanda's resized/repositioned images.
 */

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";
import { ImagePlus, Upload, X, Loader2, Move, Maximize2, RotateCcw, Trash2, Plus } from "lucide-react";
import { IMAGE_MANIFEST } from "@/lib/site-content/image-manifest";
import { uploadAsset, listAssets, type AssetRecord } from "@/lib/site-content/api";
import type { ImageTransform } from "@/lib/site-content/types";
import { useEditMode } from "./EditModeProvider";

type Props = {
    /** Dot-path into HomeContent that holds the image src */
    path: string;
    /** Current image src */
    value: string;
    /** Optional dot-path that holds the ImageTransform overrides for this image.
     *  When provided, free-form transform mode is enabled. */
    transformPath?: string;
    /** Current ImageTransform (from content). */
    transform?: ImageTransform;
    /** Alt text for the rendered image */
    alt?: string;
    /** Optional className for the rendered <img> */
    className?: string;
    /** Optional inline style for the <img> */
    style?: CSSProperties;
    /** If true, render aria-hidden on the image (decorative). Default true. */
    decorative?: boolean;
    /** If provided, overrides the default <img> rendering. Useful when the
     *  image is wrapped in a special container (e.g. coin frame). */
    children?: (src: string, transformStyle: CSSProperties) => ReactNode;
};

/** Convert ImageTransform → inline CSS values applied to the image element. */
function transformToStyle(t?: ImageTransform): CSSProperties {
    if (!t) return {};
    const style: CSSProperties = {};
    const parts: string[] = [];
    if (t.offsetX || t.offsetY) {
        parts.push(`translate(${t.offsetX ?? 0}px, ${t.offsetY ?? 0}px)`);
    }
    if (t.scale && t.scale !== 1) parts.push(`scale(${t.scale})`);
    if (t.rotate) parts.push(`rotate(${t.rotate}deg)`);
    if (parts.length > 0) style.transform = parts.join(" ");
    if (t.width) style.width = t.width;
    if (t.zIndex !== undefined) style.zIndex = t.zIndex;
    return style;
}

export function EditableImage({
    path,
    value,
    transformPath,
    transform,
    alt = "",
    className,
    style,
    decorative = true,
    children,
}: Props) {
    const { enabled, setAt } = useEditMode();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [transformMode, setTransformMode] = useState(false);

    const canTransform = !!transformPath;
    const transformStyle = transformToStyle(transform);
    const isEmpty = !value;

    const rendered =
        children !== undefined ? (
            children(value, transformStyle)
        ) : (
            <img
                src={value}
                alt={alt}
                className={className}
                style={{ ...style, ...transformStyle }}
                aria-hidden={decorative ? true : undefined}
            />
        );

    // Out of edit mode: empty src renders nothing (no placeholder on public site)
    if (!enabled) {
        if (isEmpty) return null;
        return <>{rendered}</>;
    }

    // Edit mode + empty src: show a placeholder that opens the picker on click
    if (isEmpty) {
        return (
            <span
                className="edit-mode-image-empty"
                onClick={() => setPickerOpen(true)}
                role="button"
                tabIndex={0}
            >
                <Plus className="w-4 h-4" />
                <span>Add image</span>
                {pickerOpen && (
                    <ImagePickerModal
                        current=""
                        onClose={() => setPickerOpen(false)}
                        onPick={(picked) => {
                            setAt(path, picked);
                            setPickerOpen(false);
                        }}
                    />
                )}
            </span>
        );
    }

    return (
        <span className={`edit-mode-image-wrap ${transformMode ? "is-transforming" : ""}`}>
            {rendered}

            <div className="edit-mode-image-toolbar">
                <button
                    type="button"
                    className="edit-mode-image-edit-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPickerOpen(true);
                    }}
                    aria-label="Change image"
                >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>Change</span>
                </button>
                {canTransform && (
                    <button
                        type="button"
                        className={`edit-mode-image-edit-btn ${transformMode ? "is-active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTransformMode((m) => !m);
                        }}
                        aria-label={transformMode ? "Done" : "Transform"}
                    >
                        <Move className="w-3.5 h-3.5" />
                        <span>{transformMode ? "Done" : "Transform"}</span>
                    </button>
                )}
                {canTransform && transform && (
                    <button
                        type="button"
                        className="edit-mode-image-edit-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm("Reset image to default position/size?")) {
                                setAt(transformPath!, undefined);
                            }
                        }}
                        aria-label="Reset transform"
                        title="Reset position + size"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    type="button"
                    className="edit-mode-image-edit-btn edit-mode-image-edit-btn--danger"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm("Remove this image? It will be gone from the live site.")) {
                            setAt(path, "");
                            // Also reset transform when removing
                            if (transformPath) setAt(transformPath, undefined);
                        }
                    }}
                    aria-label="Remove image"
                    title="Remove image"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {transformMode && transformPath && (
                <TransformOverlay
                    transform={transform}
                    onChange={(t) => setAt(transformPath, t)}
                />
            )}

            {pickerOpen && (
                <ImagePickerModal
                    current={value}
                    onClose={() => setPickerOpen(false)}
                    onPick={(picked) => {
                        setAt(path, picked);
                        setPickerOpen(false);
                    }}
                />
            )}
        </span>
    );
}

/* ───────────────── TRANSFORM OVERLAY ───────────────── */

/**
 * Renders four corner handles + a center drag area. Mouse interactions
 * compute deltas and patch the ImageTransform via onChange.
 *
 * The overlay sits on top of the image inside .edit-mode-image-wrap; sizing
 * is 100%/100% relative to the wrapper.
 */
function TransformOverlay({
    transform,
    onChange,
}: {
    transform: ImageTransform | undefined;
    onChange: (t: ImageTransform) => void;
}) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [dragMode, setDragMode] = useState<"move" | "resize" | "rotate" | null>(null);
    const dragStart = useRef<{
        x: number;
        y: number;
        startX: number;
        startY: number;
        startScale: number;
        startRotate: number;
        startWidth: number;
    } | null>(null);

    // Snapshot the wrapper width so resize math is stable
    const wrapperWidthRef = useRef<number>(0);
    useEffect(() => {
        if (overlayRef.current?.parentElement) {
            wrapperWidthRef.current = overlayRef.current.parentElement.offsetWidth;
        }
    });

    function start(mode: "move" | "resize" | "rotate", e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragMode(mode);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            startX: transform?.offsetX ?? 0,
            startY: transform?.offsetY ?? 0,
            startScale: transform?.scale ?? 1,
            startRotate: transform?.rotate ?? 0,
            startWidth: parseWidthAsPx(transform?.width, wrapperWidthRef.current),
        };
    }

    useEffect(() => {
        if (!dragMode) return;

        function onMove(e: MouseEvent) {
            const s = dragStart.current;
            if (!s) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            const next: ImageTransform = { ...(transform ?? {}) };
            if (dragMode === "move") {
                next.offsetX = s.startX + dx;
                next.offsetY = s.startY + dy;
            } else if (dragMode === "resize") {
                // Use diagonal magnitude as scale delta — bigger = scale up
                const delta = (dx + dy) / Math.max(200, wrapperWidthRef.current);
                const newScale = Math.max(0.2, Math.min(3, s.startScale + delta));
                next.scale = round2(newScale);
            } else if (dragMode === "rotate") {
                next.rotate = s.startRotate + dx * 0.5;
            }
            onChange(next);
        }
        function onUp() {
            setDragMode(null);
            dragStart.current = null;
        }
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [dragMode, onChange, transform]);

    return (
        <div ref={overlayRef} className="edit-mode-transform-overlay" data-mode={dragMode}>
            <div
                className="edit-mode-transform-move"
                onMouseDown={(e) => start("move", e)}
                title="Drag to move"
            >
                <Move className="w-5 h-5" />
            </div>
            <button
                type="button"
                className="edit-mode-transform-handle edit-mode-transform-handle--corner"
                onMouseDown={(e) => start("resize", e)}
                title="Drag to resize"
                aria-label="Resize"
            >
                <Maximize2 className="w-3 h-3" />
            </button>
            <button
                type="button"
                className="edit-mode-transform-handle edit-mode-transform-handle--rotate"
                onMouseDown={(e) => start("rotate", e)}
                title="Drag to rotate"
                aria-label="Rotate"
            >
                <RotateCcw className="w-3 h-3" />
            </button>
        </div>
    );
}

function parseWidthAsPx(width: string | undefined, fallback: number): number {
    if (!width) return fallback;
    const m = /^([0-9.]+)(px|%)?$/.exec(width.trim());
    if (!m) return fallback;
    const n = Number.parseFloat(m[1]);
    if (m[2] === "%" || !m[2]) return (fallback * n) / (m[2] === "%" ? 100 : 1);
    return n;
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

/* ───────────────── PICKER MODAL (unchanged from prev — with R2 upload) ───────────────── */

function ImagePickerModal({
    current,
    onClose,
    onPick,
}: {
    current: string;
    onClose: () => void;
    onPick: (path: string) => void;
}) {
    const [customPath, setCustomPath] = useState("");
    const [uploads, setUploads] = useState<AssetRecord[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        listAssets()
            .then(setUploads)
            .catch(() => {});
    }, []);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const rec = await uploadAsset(file);
            setUploads((prev) => [rec, ...prev]);
            onPick(rec.url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    return (
        <div className="edit-mode-modal-backdrop" onClick={onClose}>
            <div
                className="edit-mode-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Pick an image"
            >
                <div className="edit-mode-modal-header">
                    <h3>Change image</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="edit-mode-modal-close"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="edit-mode-modal-body">
                    <div className="edit-mode-image-upload">
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
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload new image
                                </>
                            )}
                        </button>
                        {uploadError && (
                            <p className="edit-mode-image-upload-error">{uploadError}</p>
                        )}
                    </div>

                    {uploads.length > 0 && (
                        <div className="edit-mode-image-group">
                            <div className="edit-mode-image-group-label">Uploaded</div>
                            <div className="edit-mode-image-grid">
                                {uploads.map((u) => (
                                    <button
                                        key={u.key}
                                        type="button"
                                        className={`edit-mode-image-tile ${
                                            u.url === current ? "is-current" : ""
                                        }`}
                                        onClick={() => onPick(u.url)}
                                        title={u.original_name ?? u.key}
                                    >
                                        <img src={u.url} alt="" />
                                        <span className="edit-mode-image-tile-label">
                                            {(u.original_name ?? u.key).split("/").pop()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.entries(IMAGE_MANIFEST).map(([group, items]) => (
                        <div key={group} className="edit-mode-image-group">
                            <div className="edit-mode-image-group-label">{group}</div>
                            <div className="edit-mode-image-grid">
                                {items.map((src) => (
                                    <button
                                        key={src}
                                        type="button"
                                        className={`edit-mode-image-tile ${
                                            src === current ? "is-current" : ""
                                        }`}
                                        onClick={() => onPick(src)}
                                        title={src}
                                    >
                                        <img src={src} alt="" />
                                        <span className="edit-mode-image-tile-label">
                                            {src.split("/").pop()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="edit-mode-image-custom">
                        <label>
                            Or paste a custom URL:
                            <input
                                type="text"
                                value={customPath}
                                onChange={(e) => setCustomPath(e.target.value)}
                                placeholder="https://… or /images/…"
                            />
                        </label>
                        <button
                            type="button"
                            disabled={!customPath.trim()}
                            onClick={() => onPick(customPath.trim())}
                        >
                            Use custom URL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
