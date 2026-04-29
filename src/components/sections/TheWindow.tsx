"use client";

/**
 * TheWindow — Section 5: submissions / email capture (design-cms-v2 / #89).
 *
 * Eyebrow + headline + lead + email capture form.
 * Countdown timer added later (#90) once Amanda sets the deadline date.
 * Newsletter endpoint: POST /api/v1/newsletter (built with #91).
 */

import { useState } from "react";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/lib/site-content";
import { EditableText, FloatingElementsLayer, useEditMode } from "@/lib/edit-mode";

type TheWindowProps = {
    content?: HomeContent["window"];
};

export default function TheWindow({ content }: TheWindowProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.window!;
    const { enabled } = useEditMode();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            const res = await fetch("/api/v1/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setStatus(res.ok ? "done" : "error");
        } catch {
            setStatus("error");
        }
    }

    return (
        <section
            id="window"
            className="relative w-full px-6 lg:px-[6vw] py-24 lg:py-32 border-t border-[var(--ds-border)]"
            style={{ zIndex: 13, backgroundColor: "var(--ds-bg)" }}
        >
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="window.decorations"
            />

            <div className="max-w-[860px] mx-auto text-center">
                <EditableText
                    path="window.eyebrow"
                    value={c.eyebrow}
                    as="p"
                    className="font-sans text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-ravok-gold mb-6"
                />

                <EditableText
                    path="window.headline"
                    value={c.headline}
                    as="h2"
                    multiline
                    inline={false}
                    className="text-[clamp(2.5rem,5vw,4rem)] font-heading font-normal text-[var(--ds-ink)] leading-[1.08] mb-6"
                />

                <EditableText
                    path="window.lead"
                    value={c.lead}
                    as="p"
                    multiline
                    inline={false}
                    className="font-sans text-base lg:text-[1.05rem] leading-relaxed text-[var(--ds-ink-dim)] max-w-[580px] mx-auto mb-12"
                />

                {/* Email capture — hidden in edit mode (show editable placeholders instead) */}
                {enabled ? (
                    <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto opacity-60 pointer-events-none select-none">
                        <div className="flex-1 border border-[var(--ds-border-strong)] px-5 py-3.5 text-left font-sans text-sm text-[var(--ds-ink-muted)]">
                            <EditableText
                                path="window.emailPlaceholder"
                                value={c.emailPlaceholder}
                                as="span"
                                inline
                                className="pointer-events-auto"
                            />
                        </div>
                        <div className="shrink-0 px-6 py-3.5 bg-ravok-gold/20 font-sans text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-[var(--ds-ink-muted)]">
                            <EditableText
                                path="window.emailCta"
                                value={c.emailCta}
                                as="span"
                                inline
                                className="pointer-events-auto"
                            />
                        </div>
                    </div>
                ) : status === "done" ? (
                    <p className="font-sans text-ravok-gold text-sm tracking-widest uppercase">
                        ✓ Check your inbox.
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={c.emailPlaceholder}
                            className="flex-1 bg-transparent border border-[var(--ds-border-strong)] px-5 py-3.5 font-sans text-sm text-[var(--ds-ink)] placeholder:text-[var(--ds-ink-muted)] focus:outline-none focus:border-ravok-gold/60 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="shrink-0 px-6 py-3.5 bg-ravok-gold text-[var(--ds-bg)] font-sans text-[0.65rem] font-semibold tracking-[0.22em] uppercase hover:bg-ravok-gold/90 transition-colors disabled:opacity-50"
                        >
                            {status === "loading" ? "..." : c.emailCta}
                        </button>
                    </form>
                )}

                {status === "error" && (
                    <p className="mt-3 font-sans text-[0.65rem] text-red-400 tracking-widest uppercase">
                        Something went wrong — email us: contact@ravokstudios.com
                    </p>
                )}
            </div>
        </section>
    );
}
