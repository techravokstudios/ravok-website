"use client";

/**
 * FloatingElementsLayer — Canva-style free-floating image overlay.
 *
 * Renders an absolutely-positioned layer over <main>. Each element in
 * content.floatingElements is positioned by px-from-top + %-from-left so
 * placements stay roughly stable across viewports.
 *
 * In edit mode every floating element gets:
 *   - Drag center → move (updates top/left)
 *   - Bottom-right corner handle → resize (updates width)
 *   - Bottom-left handle → rotate (updates rotate)
 *   - Top-right toolbar → Change image / Remove
 *
 * Out of edit mode the layer renders the elements as plain images (no
 * controls, pointer-events disabled on the layer so it doesn't block
 * clicks on the underlying page).
 */

import { useEffect, useRef, useState } from "react";
import { GripVertical, Maximize2, RotateCcw, Trash2, ImagePlus } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import type { FloatingElement, FloatingImage } from "@/lib/site-content/types";

export function FloatingElementsLayer() {
    const { content, enabled, setAt, removeAt } = useEditMode();
    const elements = content.floatingElements ?? [];

    if (elements.length === 0 && !enabled) return null;

    return (
        <div
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
            {elements.map((el, idx) => (
                <FloatingElementRenderer
                    key={el.id}
                    element={el}
                    index={idx}
                    enabled={enabled}
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

function FloatingElementRenderer({
    element,
    enabled,
    onPatch,
    onRemove,
}: {
    element: FloatingElement;
    index: number;
    enabled: boolean;
    onPatch: (patch: Partial<FloatingImage>) => void;
    onRemove: () => void;
}) {
    if (element.type !== "image") return null;
    return (
        <FloatingImageEl
            element={element}
            enabled={enabled}
            onPatch={onPatch}
            onRemove={onRemove}
        />
    );
}

function FloatingImageEl({
    element,
    enabled,
    onPatch,
    onRemove,
}: {
    element: FloatingImage;
    enabled: boolean;
    onPatch: (patch: Partial<FloatingImage>) => void;
    onRemove: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<"move" | "resize" | "rotate" | null>(null);
    const startRef = useRef<{
        x: number; y: number;
        top: number; left: number;
        width: number; rotate: number;
        viewportW: number;
    } | null>(null);

    useEffect(() => {
        if (!drag) return;
        function onMove(e: MouseEvent) {
            const s = startRef.current;
            if (!s) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (drag === "move") {
                // top is px, left is %
                const newLeftPct = s.left + (dx / s.viewportW) * 100;
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
        startRef.current = {
            x: e.clientX,
            y: e.clientY,
            top: element.top,
            left: element.left,
            width: element.width,
            rotate: element.rotate ?? 0,
            viewportW: window.innerWidth,
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

            {/* Move (drag anywhere on the image) */}
            <div
                className="floating-element-move"
                onMouseDown={(e) => start("move", e)}
                title="Drag to move"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Top-right toolbar */}
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

            {/* Resize (bottom-right) */}
            <button
                type="button"
                className="edit-mode-transform-handle edit-mode-transform-handle--corner"
                onMouseDown={(e) => start("resize", e)}
                title="Drag to resize"
                aria-label="Resize"
            >
                <Maximize2 className="w-3 h-3" />
            </button>

            {/* Rotate (bottom-left) */}
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
