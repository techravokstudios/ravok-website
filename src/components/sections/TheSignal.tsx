"use client";

/**
 * TheSignal — Section 6: final closing CTA (design-cms-v2 / #89).
 *
 * Eyebrow + big headline + body + CTA buttons.
 * Subtle radial gold glow at top. All fields editable in-place.
 */

import { DEFAULT_HOME_CONTENT, type HomeContent, type Cta } from "@/lib/site-content";
import { EditableText, EditableList, FloatingElementsLayer, useEditMode } from "@/lib/edit-mode";

type TheSignalProps = {
    content?: HomeContent["signal"];
};

const NEW_CTA_DEFAULT: Cta = { label: "New CTA", href: "/", variant: "secondary" };

function SignalCta({
    cta,
    index,
    enabled,
}: {
    cta: Cta;
    index: number;
    enabled: boolean;
}) {
    const isPrimary = cta.variant === "primary";
    const base =
        "inline-flex items-center gap-2 px-8 py-4 font-sans text-[0.65rem] font-semibold tracking-[0.25em] uppercase transition-colors duration-200";
    const variant = isPrimary
        ? "bg-ravok-gold text-[var(--ds-bg)] hover:bg-ravok-gold/90"
        : "border border-ravok-gold/50 text-ravok-gold hover:border-ravok-gold hover:bg-[rgba(196,149,58,0.06)]";

    if (enabled) {
        return (
            <div className="flex flex-col items-center gap-1">
                <div className={`${base} ${variant}`}>
                    <EditableText
                        path={`signal.ctas.${index}.label`}
                        value={cta.label}
                        as="span"
                        inline
                        className=""
                    />
                </div>
                <EditableText
                    path={`signal.ctas.${index}.href`}
                    value={cta.href}
                    as="div"
                    inline={false}
                    className="font-mono text-[0.6rem] text-[var(--ds-ink-muted)]"
                />
            </div>
        );
    }

    return (
        <a href={cta.href} className={`${base} ${variant}`}>
            {cta.label}
        </a>
    );
}

export default function TheSignal({ content }: TheSignalProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.signal!;
    const { enabled } = useEditMode();

    return (
        <section
            id="signal"
            className="relative w-full px-6 lg:px-[6vw] py-32 lg:py-40 border-t border-[var(--ds-border)] text-center"
            style={{
                zIndex: 14,
                backgroundColor: "var(--ds-bg)",
                backgroundImage:
                    "radial-gradient(ellipse at 50% 0%, rgba(196,149,58,0.08) 0, transparent 55%)",
            }}
        >
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="signal.decorations"
            />

            <div className="max-w-[860px] mx-auto">
                <EditableText
                    path="signal.eyebrow"
                    value={c.eyebrow}
                    as="p"
                    className="font-sans text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-ravok-gold mb-8"
                />

                <EditableText
                    path="signal.headline"
                    value={c.headline}
                    as="h2"
                    multiline
                    inline={false}
                    className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.06] mb-8"
                />

                <EditableText
                    path="signal.body"
                    value={c.body}
                    as="p"
                    multiline
                    inline={false}
                    className="font-sans text-base lg:text-[1.05rem] leading-relaxed text-[var(--ds-ink-dim)] max-w-[620px] mx-auto mb-12"
                />

                <EditableList
                    arrayPath="signal.ctas"
                    items={c.ctas}
                    defaultNewItem={NEW_CTA_DEFAULT}
                    addLabel="Add CTA"
                    as="div"
                    className="flex flex-wrap gap-4 justify-center"
                    renderItem={(cta, i) => (
                        <SignalCta cta={cta} index={i} enabled={enabled} />
                    )}
                />
            </div>
        </section>
    );
}
