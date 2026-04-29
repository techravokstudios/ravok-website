"use client";

/**
 * SectionFocusOverlay — wraps a section with the "Edit this section" UX.
 *
 * Renders:
 *  - A hover-revealed "Edit this section" button (visible only when in edit
 *    mode AND no other section is focused).
 *  - A "Done" / "Exit section" badge inside the focused section.
 *
 * The overlay itself is absolutely positioned and pointer-events:none on the
 * outer wrapper so it doesn't block normal page interactions; the inner
 * button gets pointer-events:auto.
 */

import { Pencil, Check, X } from "lucide-react";
import { useEditMode } from "./EditModeProvider";

export function SectionFocusOverlay({ sectionKey }: { sectionKey: string }) {
    const { enabled, focusedSection, setFocusedSection } = useEditMode();
    if (!enabled) return null;

    const isFocused = focusedSection === sectionKey;
    const someoneElseFocused = focusedSection !== null && focusedSection !== sectionKey;

    if (someoneElseFocused) {
        // Section is dimmed; no button shown
        return null;
    }

    if (isFocused) {
        return (
            <div className="section-focus-active-banner">
                <span className="section-focus-active-label">
                    <Pencil className="w-3 h-3" />
                    Editing {sectionKey}
                </span>
                <button
                    type="button"
                    className="section-focus-exit-btn"
                    onClick={() => setFocusedSection(null)}
                    title="Exit section focus (back to global edit)"
                >
                    <Check className="w-3 h-3" />
                    Done
                </button>
            </div>
        );
    }

    // Idle in edit mode: hover this section to reveal the button
    return (
        <button
            type="button"
            className="section-focus-edit-btn"
            onClick={() => setFocusedSection(sectionKey)}
            title={`Edit only this section (${sectionKey})`}
        >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit this section</span>
        </button>
    );
}

/** Toolbar variant — appears in the top toolbar when focused. */
export function FocusedSectionExitButton() {
    const { focusedSection, setFocusedSection } = useEditMode();
    if (!focusedSection) return null;
    return (
        <button
            type="button"
            onClick={() => setFocusedSection(null)}
            className="edit-mode-btn edit-mode-btn--ghost"
            title="Exit section focus"
        >
            <X className="w-3.5 h-3.5" />
            <span>Exit {focusedSection}</span>
        </button>
    );
}
