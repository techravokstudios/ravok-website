"use client";

/**
 * EditModeOverlay — admin-only floating UI:
 *   - When NOT in edit mode: a small "Edit page" pill bottom-right.
 *   - When IN edit mode: a top toolbar with Save / Discard / Exit and a
 *     dirty-state indicator.
 *
 * Renders nothing when the current user isn't an admin.
 */

import { useState } from "react";
import { Pencil, Save, RotateCcw, X, Loader2, ExternalLink, PanelLeft, Zap, Undo2, Redo2 } from "lucide-react";
import { useEditMode } from "./EditModeProvider";
import { EditModeSidebar } from "./EditModeSidebar";
import { FocusedSectionExitButton } from "./SectionFocusOverlay";

function formatTime(d: Date): string {
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
}

export function EditModeOverlay() {
    const {
        isAdmin, enabled, setEnabled, dirty, saving, save, discard,
        autoSaveEnabled, setAutoSaveEnabled, lastSavedAt,
        canUndo, canRedo, undo, redo,
    } = useEditMode();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!isAdmin) return null;

    if (!enabled) {
        return (
            <button
                type="button"
                onClick={() => setEnabled(true)}
                className="edit-mode-pill"
                aria-label="Edit page"
            >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit page</span>
            </button>
        );
    }

    async function handleSave() {
        try {
            await save();
        } catch {
            // toast already shown by provider
        }
    }

    function handleExit() {
        if (dirty && !confirm("Exit without saving? Unsaved changes will be lost.")) return;
        if (dirty) discard();
        setEnabled(false);
    }

    return (
        <>
        <div className="edit-mode-toolbar">
            <div className="edit-mode-toolbar-inner">
                <div className="edit-mode-toolbar-left">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((o) => !o)}
                        className={`edit-mode-btn edit-mode-btn--ghost ${sidebarOpen ? "is-active" : ""}`}
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        title="Toggle layers + add panel"
                    >
                        <PanelLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="edit-mode-badge">EDITING</span>
                    {saving ? (
                        <span className="edit-mode-clean">
                            <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
                            Saving…
                        </span>
                    ) : dirty ? (
                        <span className="edit-mode-dirty">
                            ● Unsaved
                            {autoSaveEnabled && " · auto-saving in 4s"}
                        </span>
                    ) : (
                        <span className="edit-mode-clean">
                            ✓ Saved{lastSavedAt && ` · ${formatTime(lastSavedAt)}`}
                        </span>
                    )}
                </div>
                <div className="edit-mode-toolbar-right">
                    <FocusedSectionExitButton />
                    <button
                        type="button"
                        onClick={undo}
                        disabled={!canUndo}
                        className="edit-mode-btn edit-mode-btn--ghost"
                        title="Undo (⌘Z / Ctrl-Z)"
                        aria-label="Undo"
                    >
                        <Undo2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={redo}
                        disabled={!canRedo}
                        className="edit-mode-btn edit-mode-btn--ghost"
                        title="Redo (⌘⇧Z / Ctrl-Y)"
                        aria-label="Redo"
                    >
                        <Redo2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                        className={`edit-mode-btn edit-mode-btn--ghost ${autoSaveEnabled ? "is-active" : ""}`}
                        title={autoSaveEnabled ? "Auto-save ON (click to turn off)" : "Auto-save OFF (click to turn on)"}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Auto-save {autoSaveEnabled ? "on" : "off"}</span>
                    </button>
                    <a
                        href="/admin/site"
                        className="edit-mode-btn edit-mode-btn--ghost"
                        title="Open structural editor (add/remove rows etc)"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Form editor</span>
                    </a>
                    <button
                        type="button"
                        onClick={discard}
                        disabled={!dirty || saving}
                        className="edit-mode-btn edit-mode-btn--ghost"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Discard</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!dirty || saving}
                        className="edit-mode-btn edit-mode-btn--primary"
                    >
                        {saving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{saving ? "Saving…" : "Save"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleExit}
                        className="edit-mode-btn edit-mode-btn--ghost"
                        aria-label="Exit edit mode"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>Exit</span>
                    </button>
                </div>
            </div>
        </div>
        <EditModeSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
}
