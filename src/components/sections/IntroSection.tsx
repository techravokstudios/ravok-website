"use client";

/**
 * IntroSection — "About" / hook section.
 * Per WEBSITE-TECHNICAL-RULES.md §12: manifesto/brand statement → CRevealSection.
 * Layout: 2-column grid (text left, statue right). Content CMS-driven, in-page editable.
 */

import { Eye } from "lucide-react";
import { CRevealSection, Button } from "@/components/design-system";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/lib/site-content";
import { EditableText, EditableImage, EditableList, FloatingElementsLayer } from "@/lib/edit-mode";

type IntroSectionProps = {
    content?: HomeContent["intro"];
};

export default function IntroSection({ content }: IntroSectionProps = {}) {
    const c = content ?? DEFAULT_HOME_CONTENT.intro;

    return (
        <CRevealSection
            zIndex={10}
            id="about"
            centerHeader={false}
            contentMaxWidth="1300px"
        >
            <FloatingElementsLayer
                decorations={c.decorations ?? []}
                path="intro.decorations"
            />
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <EditableText
                        path="intro.eyebrow"
                        value={c.eyebrow}
                        as="p"
                        className="font-sans text-[0.62rem] font-semibold tracking-[0.32em] text-ravok-gold uppercase mb-3"
                    />

                    <EditableText
                        path="intro.headline"
                        value={c.headline}
                        as="h2"
                        className="font-heading font-normal text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1] tracking-[-0.015em] text-[var(--ds-ink)] mb-4"
                    />

                    <EditableText
                        path="intro.body1"
                        value={c.body1}
                        as="p"
                        multiline
                        className="font-sans text-[0.95rem] leading-[1.55] text-[var(--ds-ink-dim)] mb-3 max-w-[540px]"
                    />

                    <EditableText
                        path="intro.body2"
                        value={c.body2}
                        as="p"
                        multiline
                        className="font-sans text-[0.95rem] leading-[1.55] text-[var(--ds-ink-dim)] mb-5 max-w-[540px]"
                    />

                    <EditableList
                        arrayPath="intro.facts"
                        items={c.facts}
                        defaultNewItem="New fact"
                        addLabel="Add fact"
                        as="ul"
                        className="intro-facts list-none p-0 mb-5 max-w-[540px] grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5"
                        renderItem={(fact, i) => (
                            <li className="relative pl-4 font-sans text-[0.74rem] font-medium tracking-[0.02em] text-[var(--ds-ink)]">
                                <span className="absolute left-0 text-ravok-gold font-semibold">✓</span>
                                <EditableText path={`intro.facts.${i}`} value={fact} inline={false} />
                            </li>
                        )}
                    />

                    <EditableList
                        arrayPath="intro.ctas"
                        items={c.ctas}
                        defaultNewItem={{ label: "Learn more", href: "#", variant: "secondary" } as HomeContent["intro"]["ctas"][number]}
                        addLabel="Add CTA"
                        as="div"
                        className="flex flex-wrap items-center gap-3"
                        renderItem={(cta, i) => (
                            <Button href={cta.href} variant={cta.variant}>
                                <EditableText path={`intro.ctas.${i}.label`} value={cta.label} inline={false} />
                            </Button>
                        )}
                    />
                    <div className="mt-3">
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,228,218,0.15)] bg-transparent transition-all duration-[250ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:border-ravok-gold hover:-translate-y-px"
                            aria-label="Watch"
                        >
                            <Eye className="h-4 w-4 text-ravok-gold" />
                        </button>
                    </div>
                </div>

                <div className="order-1 lg:order-2 relative flex items-center justify-center">
                    <EditableImage
                        path="intro.statueImage"
                        value={c.statueImage}
                        transformPath="intro.statueImageTransform"
                        transform={c.statueImageTransform}
                    >
                        {(src, transformStyle) => (
                            <img
                                src={src}
                                alt=""
                                className="w-full h-auto max-h-[68vh] object-contain"
                                style={transformStyle}
                                aria-hidden="true"
                            />
                        )}
                    </EditableImage>
                </div>
            </div>
        </CRevealSection>
    );
}
