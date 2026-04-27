/**
 * Design system primitives.
 *
 * Composing rules: see WEBSITE-TECHNICAL-RULES.md.
 *
 * Pattern map (rules §12):
 *   Manifesto / brand statement      → CRevealSection
 *   Multi-step thesis                → ScrollytellSection (TODO)
 *   Process / how-it-works (3–6)     → CRevealSection w/ StoneCards
 *   Comparison (us vs them)          → CRevealSection w/ split layout
 *   Portfolio / projects             → CRevealSection w/ StoneCards
 *   Metrics / proof points           → CRevealSection w/ StoneCards
 *   Team / people                    → CRevealSection w/ StoneCards
 *   FAQ / list                       → CRevealSection w/ list layout
 *   CTA / closing                    → CRevealSection (centered)
 */

export { Button } from "./Button";
export type { ButtonProps } from "./Button";
export { SectionLabel } from "./SectionLabel";
export { StoneCard } from "./StoneCard";
export { CRevealSection } from "./CRevealSection";
export { ScrollytellSection } from "./ScrollytellSection";
export type { ScrollytellStep } from "./ScrollytellSection";
