/**
 * StoneCard — inverted light card on dark page.
 * Per WEBSITE-TECHNICAL-RULES.md §4: use for proof metrics, team cards,
 * portfolio detail, anywhere a content block needs to read as a separate
 * "carved" object against the dark page.
 *
 * Hover: lifts via translateY(-4px) — handled in CSS class .stone-card.
 *
 * Standardized slots:
 *   label (eyebrow), title (card title), children (body), footer (optional)
 *
 * Pass `as="article"` to render as semantic article.
 */

import { ReactNode, ElementType } from "react";

type StoneCardProps = {
    label?: string;
    title?: string;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
    as?: ElementType;
};

export function StoneCard({
    label,
    title,
    children,
    footer,
    className = "",
    as: Tag = "div",
}: StoneCardProps) {
    return (
        <Tag className={`stone-card flex flex-col p-12 ${className}`.trim()}>
            {label && (
                <span className="font-sans text-[0.56rem] font-semibold uppercase tracking-[0.3em] text-[var(--ds-stone-gold)] mb-3">
                    {label}
                </span>
            )}
            {title && (
                <h3 className="font-heading text-2xl leading-tight text-[var(--ds-stone-ink)] mb-4">
                    {title}
                </h3>
            )}
            {children && (
                <div className="font-heading text-base leading-relaxed text-[rgba(26,23,19,0.72)] flex-grow">
                    {children}
                </div>
            )}
            {footer && (
                <div className="mt-6 pt-4 border-t border-[rgba(26,23,19,0.12)] font-sans text-[0.56rem] uppercase tracking-[0.3em] text-[var(--ds-stone-gold)]">
                    {footer}
                </div>
            )}
        </Tag>
    );
}
