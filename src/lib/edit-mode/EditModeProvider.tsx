"use client";

/**
 * EditModeProvider — context for the in-page Canva-style editor.
 *
 * Holds:
 *   - enabled:     is the page currently in edit mode?
 *   - content:     the live (mutable) HomeContent
 *   - setAt(path): patch any field by dot-path
 *   - save / discard / dirty
 *   - isAdmin:     whether the current user is an admin (drives the toggle pill)
 *
 * Strategy:
 *   - Server renders the homepage with `initialContent`.
 *   - Provider hydrates with that as both `content` and `savedContent`.
 *   - Edit mode swaps text to contentEditable and shows image-swap overlays.
 *   - Save POSTs to /api/admin/site/content/home (existing endpoint).
 *   - On success, savedContent updates → dirty becomes false.
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { toast } from "sonner";
import {
    saveHomeContent,
    type HomeContent,
} from "@/lib/site-content";
import { getStoredUser } from "@/lib/api/base";
import {
    setAtPath,
    pushAtPath,
    removeFromArrayAtPath,
    moveInArrayAtPath,
    type Path,
} from "./path-utils";

type EditModeContextValue = {
    enabled: boolean;
    setEnabled: (v: boolean) => void;

    content: HomeContent;
    setAt: (path: Path, value: unknown) => void;
    pushAt: (arrayPath: Path, item: unknown) => void;
    removeAt: (arrayPath: Path, index: number) => void;
    moveAt: (arrayPath: Path, from: number, to: number) => void;

    isAdmin: boolean;
    dirty: boolean;
    saving: boolean;
    autoSaveEnabled: boolean;
    setAutoSaveEnabled: (v: boolean) => void;
    lastSavedAt: Date | null;

    /** Undo / redo */
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;

    /** Section focus — when set, editable affordances are narrowed to this
     *  section only; other sections render dimmed + locked. null means
     *  global edit (everything editable). */
    focusedSection: string | null;
    setFocusedSection: (s: string | null) => void;

    save: () => Promise<void>;
    discard: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

export function useEditMode(): EditModeContextValue {
    const ctx = useContext(EditModeContext);
    if (!ctx) {
        // Allow components to render outside an EditModeProvider — they just
        // get a no-op view. This way EditableText/Image work on /admin/site
        // form preview too if we want, without crashing.
        return {
            enabled: false,
            setEnabled: () => {},
            content: {} as HomeContent,
            setAt: () => {},
            pushAt: () => {},
            removeAt: () => {},
            moveAt: () => {},
            isAdmin: false,
            dirty: false,
            saving: false,
            autoSaveEnabled: false,
            setAutoSaveEnabled: () => {},
            lastSavedAt: null,
            canUndo: false,
            canRedo: false,
            undo: () => {},
            redo: () => {},
            focusedSection: null,
            setFocusedSection: () => {},
            save: async () => {},
            discard: () => {},
        };
    }
    return ctx;
}

export function EditModeProvider({
    initialContent,
    children,
    saveFn,
}: {
    initialContent: HomeContent;
    children: ReactNode;
    /** Override the default save (which targets /api/admin/site/content/home).
     *  Per-page providers (contact-us, about-us, our-model) pass a slug-
     *  specific save fn here. */
    saveFn?: (content: HomeContent) => Promise<HomeContent>;
}) {
    const [enabled, setEnabled] = useState(false);
    const [content, setContent] = useState<HomeContent>(initialContent);
    const [savedContent, setSavedContent] = useState<HomeContent>(initialContent);
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabledRaw] = useState<boolean>(true);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [focusedSection, setFocusedSectionRaw] = useState<string | null>(null);

    /** Toggling focus also writes to a body data attribute so CSS can dim
     *  non-focused sections + scope edit affordances by selector. */
    const setFocusedSection = useCallback((s: string | null) => {
        setFocusedSectionRaw(s);
        if (typeof document !== "undefined") {
            if (s) document.body.setAttribute("data-focused-section", s);
            else document.body.removeAttribute("data-focused-section");
        }
    }, []);

    /** Clear focus when exiting edit mode */
    useEffect(() => {
        if (!enabled && focusedSection) {
            setFocusedSection(null);
        }
    }, [enabled, focusedSection, setFocusedSection]);

    /* History (undo/redo) — debounced snapshots, capped at 50.
       Each "burst" of edits within 600ms collapses into one history entry. */
    const HISTORY_LIMIT = 50;
    const historyRef = useRef<HomeContent[]>([initialContent]);
    const historyIndexRef = useRef<number>(0);
    const [, bumpHistoryView] = useState(0); // forces canUndo/canRedo recompute
    const undoingRef = useRef(false); // suppress auto-pushes while applying undo/redo
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Persist auto-save preference per-browser
    useEffect(() => {
        const v = localStorage.getItem("ravok_cms_autosave");
        if (v !== null) setAutoSaveEnabledRaw(v === "1");
    }, []);
    const setAutoSaveEnabled = useCallback((v: boolean) => {
        setAutoSaveEnabledRaw(v);
        try { localStorage.setItem("ravok_cms_autosave", v ? "1" : "0"); } catch { /* no-op */ }
    }, []);

    // Detect admin status client-side (localStorage). Run once on mount.
    useEffect(() => {
        const u = getStoredUser();
        setIsAdmin(u?.role === "admin");
    }, []);

    const dirty = useMemo(
        () => JSON.stringify(content) !== JSON.stringify(savedContent),
        [content, savedContent]
    );

    const setAt = useCallback((path: Path, value: unknown) => {
        setContent((prev) => setAtPath(prev, path, value));
    }, []);

    const pushAt = useCallback((arrayPath: Path, item: unknown) => {
        setContent((prev) => pushAtPath(prev, arrayPath, item));
    }, []);

    const removeAt = useCallback((arrayPath: Path, index: number) => {
        setContent((prev) => removeFromArrayAtPath(prev, arrayPath, index));
    }, []);

    const moveAt = useCallback((arrayPath: Path, from: number, to: number) => {
        setContent((prev) => moveInArrayAtPath(prev, arrayPath, from, to));
    }, []);

    const save = useCallback(async () => {
        setSaving(true);
        try {
            const fn = saveFn ?? saveHomeContent;
            const persisted = await fn(content);
            setContent(persisted);
            setSavedContent(persisted);
            setLastSavedAt(new Date());
            toast.success("Saved.");
        } catch (err) {
            toast.error("Save failed: " + (err instanceof Error ? err.message : "unknown"));
            throw err;
        } finally {
            setSaving(false);
        }
    }, [content, saveFn]);

    /**
     * Auto-save: when content is dirty + autoSave is on + admin is editing,
     * schedule a save after 4 seconds of inactivity. Each new edit resets
     * the timer, so we don't hammer the API on every keystroke.
     */
    useEffect(() => {
        if (!enabled || !isAdmin || !autoSaveEnabled || !dirty || saving) return;
        const timer = setTimeout(() => {
            void save().catch(() => { /* error toast handled inside save() */ });
        }, 4000);
        return () => clearTimeout(timer);
    }, [enabled, isAdmin, autoSaveEnabled, dirty, saving, content, save]);

    /**
     * History push (debounced). Whenever `content` changes during normal
     * edits, schedule a history snapshot 600ms later. Subsequent changes
     * within that window cancel the timer — so a burst of typing collapses
     * into one entry. Skipped during undo/redo to avoid re-recording.
     */
    useEffect(() => {
        if (undoingRef.current) {
            undoingRef.current = false;
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const idx = historyIndexRef.current;
            const last = historyRef.current[idx];
            if (last && JSON.stringify(last) === JSON.stringify(content)) return;
            // Drop any redo entries beyond current index
            const truncated = historyRef.current.slice(0, idx + 1);
            truncated.push(content);
            // Cap history
            while (truncated.length > HISTORY_LIMIT) truncated.shift();
            historyRef.current = truncated;
            historyIndexRef.current = truncated.length - 1;
            bumpHistoryView((n) => n + 1);
        }, 600);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [content]);

    const canUndo = historyIndexRef.current > 0;
    const canRedo = historyIndexRef.current < historyRef.current.length - 1;

    const undo = useCallback(() => {
        if (historyIndexRef.current <= 0) return;
        // Cancel pending debounce so this snapshot doesn't get overwritten
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        historyIndexRef.current -= 1;
        undoingRef.current = true;
        setContent(historyRef.current[historyIndexRef.current]);
        bumpHistoryView((n) => n + 1);
    }, []);

    const redo = useCallback(() => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
        historyIndexRef.current += 1;
        undoingRef.current = true;
        setContent(historyRef.current[historyIndexRef.current]);
        bumpHistoryView((n) => n + 1);
    }, []);

    /** Cmd-Z / Ctrl-Z + Cmd-Shift-Z / Ctrl-Y keyboard shortcuts. */
    useEffect(() => {
        if (!enabled || !isAdmin) return;
        function onKey(e: KeyboardEvent) {
            const mod = e.metaKey || e.ctrlKey;
            if (!mod) return;
            // Ignore when typing inside an input/textarea (browser undo handles those natively)
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                // For contentEditable we DO want our undo because individual edits
                // commit on blur — but only when user is NOT actively editing
                // (focused). Skip if currently focused.
                if (target.isContentEditable && document.activeElement === target) return;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
            }
            if (e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
                e.preventDefault();
                redo();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [enabled, isAdmin, undo, redo]);

    const discard = useCallback(() => {
        if (dirty && !confirm("Discard unsaved changes?")) return;
        setContent(savedContent);
    }, [dirty, savedContent]);

    // Warn before navigating away with unsaved changes
    useEffect(() => {
        if (!dirty) return;
        function beforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
            e.returnValue = "";
        }
        window.addEventListener("beforeunload", beforeUnload);
        return () => window.removeEventListener("beforeunload", beforeUnload);
    }, [dirty]);

    const value: EditModeContextValue = useMemo(
        () => ({
            enabled,
            setEnabled,
            content,
            setAt,
            pushAt,
            removeAt,
            moveAt,
            isAdmin,
            dirty,
            saving,
            autoSaveEnabled,
            setAutoSaveEnabled,
            lastSavedAt,
            canUndo,
            canRedo,
            undo,
            redo,
            focusedSection,
            setFocusedSection,
            save,
            discard,
        }),
        [
            enabled, content, setAt, pushAt, removeAt, moveAt, isAdmin,
            dirty, saving, autoSaveEnabled, setAutoSaveEnabled, lastSavedAt,
            canUndo, canRedo, undo, redo,
            focusedSection, setFocusedSection,
            save, discard,
        ]
    );

    return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
