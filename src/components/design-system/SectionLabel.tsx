/**
 * SectionLabel — gold eyebrow with em-dash prefix.
 * Per WEBSITE-TECHNICAL-RULES.md §5 type scale: sans 0.62rem, 0.30em tracking, gold.
 *
 * Usage: <SectionLabel>What's Next</SectionLabel>
 */

import { ReactNode } from "react";

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <span
            className={`inline-block font-sans text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-ravok-gold mb-6 before:content-['—'] before:mr-4 ${className}`.trim()}
        >
            {children}
        </span>
    );
}
