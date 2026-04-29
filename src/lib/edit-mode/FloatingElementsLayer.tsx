"use client";

/**
 * FloatingElementsLayer — renders a section's decorations as absolute-
 * positioned overlays inside the section's content area.
 *
 * Each section component mounts its own layer:
 *   <FloatingElementsLayer
 *     decorations={c.decorations ?? []}
 *     path="intro.decorations"
 *   />
 *
 * The layer expects to live inside a `position: relative` parent (the
 * section's body). Absolute positioning is relative to that parent so the
 * decorations move/animate WITH the section (sticky reveals, marquee scroll,
 * scrollytell — all participate naturally because the layer is a DOM child
 * of the section's animated container).
 *
 * Coordinates per element:
 *   - top: px from layer's top
 *   - left: % of layer's width
 *   - width: px (height auto)
 *   - rotate: deg
 */

import { useEffect, useRef, useState } from "react";
import { GripVertical, Maximize2, RotateCcw, Trash2, ImagePlus } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import type { FloatingElement, FloatingImage, FloatingTarget } from "@/lib/site-content/types";

type Props = {
    /** The decoration array stored on this section. */
    decorations: FloatingElement[];
    /** Dot-path of the array (e.g. "intro.decorations"). Used to setAt/removeAt. */
    path: string;
    /** If set, only render decorations whose target matches. The full array is
     *  always traversed so child indices passed to setAt/removeAt match the
     *  source-of-truth array regardless of filtering. */
    targetFilter?: FloatingTarget;
    /** Marquee seamless-loop helper — shifts the layer 50% right via CSS so
     *  the second copy of marquee decorations sits over the duplicate member
     *  set. Only set this on the second of two layers inside team-marquee-inner. */
    duplicate?: boolean;
    /** Inline style overrides for the layer wrapper (e.g. zIndex bumps). */
    style?: React.CSSProperties;
};

export function FloatingElementsLayer({
    decorations,
    path,
    targetFilter,
    duplicate,
    style,
}: Props) {
    const { enabled, setAt, removeAt } = useEditMode();
    const layerRef = useRef<HTMLDivElement>(null);

    if (decorations.length === 0 && !enabled) return null;

    const layerStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
        ...(duplicate ? { transform: "translateX(50%)" } : null),
        ...style,
    };

    return (
        <div
            ref={layerRef}
            className="floating-elements-layer"
            style={layerStyle}
            aria-hidden={!enabled}
        >
            {decorations.map((el, idx) => {
                const elTarget = ((el as FloatingImage).target ?? "section") as FloatingTarget;
                if (targetFilter && elTarget !== targetFilter) return null;
                return (
                    <FloatingElementRenderer
                        key={el.id + (duplicate ? "-dup" : "")}
                        element={el}
                        enabled={enabled && !duplicate}
                        layerRef={layerRef}
                        onPatch={(patch) => setAt(`${path}.${idx}`, { ...el, ...patch })}
                        onRemove={() => {
                            if (confirm("Remove this decoration?")) {
                                removeAt(path, idx);
                            }
                        }}
                    />
                );
            })}
        </div>
    );
}

function FloatingElementRenderer({
    element,
    enabled,
    layerRef,
    onPatch,
    onRemove,
}: {
    element: FloatingElement;
    enabled: boolean;
    layerRef: React.RefObject<HTMLDivElement | null>;
    onPatch: (patch: Partial<FloatingImage>) => void;
    onRemove: () => void;
}) {
    if (element.type !== "image") return null;
    return (
        <FloatingImageEl
            element={element}
            enabled={enabled}
            layerRef={layerRef}
            onPatch={onPatch}
            onRemove={onRemove}
        />
    );
}

function FloatingImageEl({
    element,
    enabled,
    layerRef,
    onPatch,
    onRemove,
}: {
    element: FloatingImage;
    enabled: boolean;
    layerRef: React.RefObject<HTMLDivElement | null>;
    onPatch: (patch: Partial<FloatingImage>) => void;
    onRemove: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<"move" | "resize" | "rotate" | null>(null);
    const startRef = useRef<{
        x: number; y: number;
        top: number; left: number;
        width: number; rotate: number;
        layerW: number;
    } | null>(null);

    useEffect(() => {
        if (!drag) return;
        function onMove(e: MouseEvent) {
            const s = startRef.current;
            if (!s) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (drag === "move") {
                const newLeftPct = s.left + (dx / Math.max(1, s.layerW)) * 100;
                onPatch({ top: s.top + dy, left: newLeftPct });
            } else if (drag === "resize") {
                const newWidth = Math.max(40, s.width + dx + dy);
                onPatch({ width: newWidth });
            } else if (drag === "rotate") {
                onPatch({ rotate: s.rotate + dx * 0.5 });
            }
        }
        function onUp() {
            setDrag(null);
            startRef.current = null;
        }
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [drag, onPatch]);

    function start(mode: "move" | "resize" | "rotate", e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDrag(mode);
        const layerW = layerRef.current?.offsetWidth ?? window.innerWidth;
        startRef.current = {
            x: e.clientX,
            y: e.clientY,
            top: element.top,
            left: element.left,
            width: element.width,
            rotate: element.rotate ?? 0,
            layerW,
        };
    }

    const transform = element.rotate ? `rotate(${element.rotate}deg)` : undefined;

    const baseStyle: React.CSSProperties = {
        position: "absolute",
        top: `${element.top}px`,
        left: `${element.left}%`,
        width: `${element.width}px`,
        transform,
        transformOrigin: "center",
        zIndex: element.zIndex ?? 1,
        pointerEvents: enabled ? "auto" : "none",
        // CRITICAL: Tailwind's preflight sets `img { max-width: 100% }` which
        // would clamp our explicit pixel width to the parent layer's width.
        // That made decorations appear at full size in edit mode (where they
        // are wrapped in a div) but smaller in production (where the img is
        // direct). Force max-width: none so the inline width wins everywhere.
        maxWidth: "none",
        height: "auto",
    };

    if (!enabled) {
        return <img src={element.src} alt="" style={baseStyle} aria-hidden="true" />;
    }

    return (
        <div
            ref={ref}
            className="floating-element-wrap"
            style={baseStyle}
            data-mode={drag}
        >
            <img src={element.src} alt="" style={{ width: "100%", display: "block" }} />

            <div
                className="floating-element-move"
                onMouseDown={(e) => start("move", e)}
                title="Drag to move"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Persistent delete badge — always visible in edit mode so admins
                can remove a decoration without hunting for a hover-only toolbar.
                Top-right corner of the decoration itself (not floating above). */}
            <button
                type="button"
                className="floating-element-delete-badge"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                title="Delete this decoration"
                aria-label="Delete decoration"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div className="floating-element-toolbar">
                <button
                    type="button"
                    className="edit-mode-image-edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        const newSrc = prompt("New image URL", element.src);
                        if (newSrc && newSrc.trim()) onPatch({ src: newSrc.trim() });
                    }}
                    title="Change image (paste URL)"
                >
                    <ImagePlus className="w-3.5 h-3.5" />
                </button>
                {/* Target cycler — flips the decoration's motion mode.
                    section: pinned with the sticky <section>
                    marquee: scrolls horizontally with team coins
                    scrollytell: pins/cross-fades with scrollytell steps */}
                <button
                    type="button"
                    className="edit-mode-image-edit-btn floating-element-target-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        const current = (element.target ?? "section") as FloatingTarget;
                        const next: FloatingTarget =
                            current === "section"
                                ? "marquee"
                                : current === "marquee"
                                ? "scrollytell"
                                : "section";
                        onPatch({ target: next });
                    }}
                    title="Cycle motion target: section → marquee → scrollytell"
                >
                    {(element.target ?? "section") === "section"
                        ? "📌 section"
                        : (element.target ?? "section") === "marquee"
                        ? "↔ marquee"
                        : "📜 scrollytell"}
                </button>
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
