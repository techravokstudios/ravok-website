"use client";

/**
 * Bridge — REITs analogy + Hollywood-vs-RAVOK comparison table.
 * Per WEBSITE-TECHNICAL-RULES.md §12: comparison → CRevealSection w/ split layout.
 *
 * Layout: 2-column (statue left, text + table right). Content CMS-driven and
 * in-page editable. Each comparison row's dim/old/next cell is its own
 * EditableText. In edit mode rows get a leading control column (drag handle +
 * remove) and an "+ Add row" button below the table; out of edit mode the
 * table renders normally (no extra column).
 */

import { GripVertical, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { CRevealSection } from "@/components/design-system";
import { DEFAULT_HOME_CONTENT, renderInline, type HomeContent, type Cta } from "@/lib/site-content";
import { EditableText, EditableImage, EditableList, FloatingElementsLayer, useEditMode } from "@/lib/edit-mode";

type BridgeProps = {
    content?: HomeContent["bridge"];
};

const NEW_ROW_DEFAULT = { dim: "New dimension", old: "Old way…", next: "RAVOK way…" };
const NEW_CTA_DEFAULT: Cta = { label: "New CTA", href: "/", variant: "primary" };

export default function Bridge({ content }: BridgeProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.bridge;
    const { enabled, pushAt, removeAt, moveAt } = useEditMode();
    const [dragFrom, setDragFrom] = useState<number | null>(null);

    return (
        <CRevealSection
            zIndex={11}
            id="bridge"
            centerHeader={false}
            contentMaxWidth="1400px"
            nonSticky
        >
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="bridge.decorations"
            />
            <div className="grid lg:grid-cols-[1fr_1.55fr] gap-10 lg:gap-16 items-center">
                <div className="order-1 relative flex items-center justify-center">
                    <EditableImage
                        path="bridge.statueImage"
                        value={c.statueImage}
                        transformPath="bridge.statueImageTransform"
                        transform={c.statueImageTransform}
                    >
                        {(src, transformStyle) => (
                            <img
                                src={src}
                                alt=""
                                className="w-full h-auto max-h-[600px] object-contain"
                                style={transformStyle}
                                aria-hidden="true"
                            />
                        )}
                    </EditableImage>
                </div>

                <div className="order-2 min-w-0">
                    <EditableText
                        path="bridge.eyebrow"
                        value={c.eyebrow}
                        as="p"
                        className="font-sans text-[0.6rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3"
                    />

                    <EditableText
                        path="bridge.headline"
                        value={c.headline}
                        as="h2"
                        multiline
                        className="font-heading font-normal text-[clamp(1.5rem,2.8vw,2.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-3"
                    />

                    <EditableText
                        path="bridge.lead"
                        value={c.lead}
                        as="p"
                        multiline
                        className="font-heading italic text-[0.88rem] leading-[1.5] text-[var(--ds-ink-dim)] max-w-[600px] mb-5"
                    />

                    <table className="comparison-table w-full text-left border-collapse border-t border-[var(--ds-border-strong,rgba(232,228,218,0.15))]">
                        <thead>
                            <tr>
                                {enabled && <th className="w-[36px]"></th>}
                                <th className="dim-head font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-muted)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[22%]"></th>
                                <th className="col-old font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-[var(--ds-ink-dim)] py-2 px-2.5 align-bottom border-b border-[rgba(232,228,218,0.15)] w-[39%]">
                                    <EditableText
                                        path="bridge.columnOldLabel"
                                        value={c.columnOldLabel}
                                        inline={false}
                                    />
                                </th>
                                <th className="col-new font-sans text-[0.52rem] font-semibold tracking-[0.28em] uppercase text-ravok-gold py-2 px-2.5 align-bottom w-[39%]">
                                    <EditableText
                                        path="bridge.columnNewLabel"
                                        value={c.columnNewLabel}
                                        inline={false}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {c.rows.map((r, i) => (
                                <tr
                                    key={i}
                                    onDragOver={(e) => {
                                        if (enabled && dragFrom !== null && dragFrom !== i) e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        if (!enabled) return;
                                        e.preventDefault();
                                        if (dragFrom === null || dragFrom === i) return;
                                        moveAt("bridge.rows", dragFrom, i);
                                        setDragFrom(null);
                                    }}
                                >
                                    {enabled && (
                                        <td className="py-2 pr-1 align-top">
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    className="edit-mode-list-handle"
                                                    draggable
                                                    onDragStart={(e) => {
                                                        setDragFrom(i);
                                                        e.dataTransfer.effectAllowed = "move";
                                                    }}
                                                    onDragEnd={() => setDragFrom(null)}
                                                    title="Drag to reorder"
                                                    aria-label={`Reorder row ${i + 1}`}
                                                >
                                                    <GripVertical className="w-3 h-3" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="edit-mode-list-remove"
                                                    onClick={() => {
                                                        if (confirm("Remove this row?")) removeAt("bridge.rows", i);
                                                    }}
                                                    title="Remove"
                                                    aria-label={`Remove row ${i + 1}`}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    <td className="dim font-heading italic text-[0.82rem] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <EditableText path={`bridge.rows.${i}.dim`} value={r.dim} inline={false} />
                                    </td>
                                    <td className="cell-old font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink-dim)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <span className="flex items-start">
                                            <span className="icon-x inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✗
                                            </span>
                                            <EditableText
                                                path={`bridge.rows.${i}.old`}
                                                value={r.old}
                                                multiline
                                            />
                                        </span>
                                    </td>
                                    <td className="cell-new font-sans text-[0.7rem] leading-[1.4] text-[var(--ds-ink)] py-2 px-2.5 align-top border-b border-[var(--ds-border,rgba(232,228,218,0.08))]">
                                        <span className="flex items-start">
                                            <span className="icon-check inline-flex items-center justify-center w-[16px] h-[16px] rounded-full mr-1.5 flex-shrink-0 font-sans font-bold text-[0.56rem]">
                                                ✓
                                            </span>
                                            <EditableText
                                                path={`bridge.rows.${i}.next`}
                                                value={r.next}
                                                multiline
                                            />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {enabled && (
                        <button
                            type="button"
                            className="edit-mode-list-add mt-3"
                            onClick={() => pushAt("bridge.rows", NEW_ROW_DEFAULT)}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add comparison row</span>
                        </button>
                    )}

                    {/* CTA buttons */}
                    {(c.ctas?.length ?? 0) > 0 && (
                        <div className="mt-6 lg:mt-8">
                            <EditableList
                                arrayPath="bridge.ctas"
                                items={c.ctas ?? []}
                                defaultNewItem={NEW_CTA_DEFAULT}
                                addLabel="Add CTA"
                                as="div"
                                className="flex flex-wrap gap-3"
                                renderItem={(cta, i) => {
                                    const isPrimary = cta.variant === "primary";
                                    const cls = isPrimary
                                        ? "inline-flex items-center gap-2 px-7 py-3 rounded-full border border-ravok-gold/40 text-ravok-gold font-sans text-[0.6rem] tracking-[0.25em] uppercase hover:border-ravok-gold hover:bg-[rgba(196,149,58,0.06)] transition-colors duration-200"
                                        : "inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--ds-border-strong)] text-[var(--ds-ink-dim)] font-sans text-[0.6rem] tracking-[0.25em] uppercase hover:border-ravok-gold/40 hover:text-ravok-gold transition-colors duration-200";
                                    if (enabled) {
                                        return (
                                            <div className="flex flex-col items-start gap-1">
                                                <div className={cls}>
                                                    <EditableText path={`bridge.ctas.${i}.label`} value={cta.label} as="span" inline className="" />
                                                </div>
                                                <EditableText path={`bridge.ctas.${i}.href`} value={cta.href} as="div" inline={false} className="font-mono text-[0.6rem] text-[var(--ds-ink-muted)]" />
                                            </div>
                                        );
                                    }
                                    return (
                                        <a href={cta.href} className={cls}>
                                            {renderInline(cta.label)}
                                        </a>
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </CRevealSection>
    );
}
