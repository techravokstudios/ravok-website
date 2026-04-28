"use client";

/**
 * FloatingElementsLayer — Canva-style free-floating image overlay,
 * ANCHORED to a specific section so elements move/scroll with their host.
 *
 * Mounting:
 *   <FloatingElementsLayer anchor="intro" />   inside the intro section
 *   <FloatingElementsLayer anchor="hero" />    inside the hero
 *   <FloatingElementsLayer anchor="document" />in <main> for legacy elements
 *
 * The layer reads content.floatingElements, filters by its `anchor` prop,
 * and absolute-positions each match relative to the anchor (its parent
 * positioned ancestor). The layer itself is `position: absolute; inset: 0;
 * pointer-events: none` so the section's normal content stays clickable.
 *
 * Coordinate system per element:
 *   - `top`: px from anchor's top
 *   - `left`: % of anchor's width
 *   - `width`: px
 *   - `rotate`: deg
 */

import { useEffect, useRef, useState } from "react";
import { GripVertical, Maximize2, RotateCcw, Trash2, ImagePlus } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import type {
    FloatingAnchor,
    FloatingElement,
    FloatingImage,
} from "@/lib/site-content/types";

export function FloatingElementsLayer({ anchor }: { anchor: FloatingAnchor }) {
    const { content, enabled, setAt, removeAt } = useEditMode();
    const layerRef = useRef<HTMLDivElement>(null);
    const all = content.floatingElements ?? [];
    const elements = all
        .map((el, i) => ({ el, idx: i }))
        .filter(({ el }) => normalizeAnchor(el.anchor) === anchor);

    if (elements.length === 0 && !enabled) return null;

    return (
        <div
            ref={layerRef}
            className="floating-elements-layer"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 50,
            }}
            aria-hidden={!enabled}
        >
            {elements.map(({ el, idx }) => (
                <FloatingElementRenderer
                    key={el.id}
                    element={el}
                    enabled={enabled}
                    layerRef={layerRef}
                    onPatch={(patch) => setAt(`floatingElements.${idx}`, { ...el, ...patch })}
                    onRemove={() => {
                        if (confirm("Remove this floating element?")) {
                            removeAt("floatingElements", idx);
                        }
                    }}
                />
            ))}
        </div>
    );
}

/** Treat undefined/legacy as document-anchored. */
function normalizeAnchor(a: FloatingAnchor | undefined): FloatingAnchor {
    return a ?? "document";
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
                <button
                    type="button"
                    className="edit-mode-image-edit-btn edit-mode-image-edit-btn--danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    title="Remove element"
                >
                    <Trash2 className="w-3.5 h-3.5" />
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
