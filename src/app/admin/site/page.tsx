"use client";

/**
 * /admin/site — homepage content editor with split-pane live preview.
 *
 * Left pane: SiteEditorClient (form-based editor)
 * Right pane: <iframe src="/"> showing the saved homepage. Re-keys after
 *             every save so it refreshes to reflect the latest persist.
 *
 * The split-pane is responsive: stacked on small screens, side-by-side
 * on lg+. Preview can be collapsed via a toggle.
 */

import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";
import {
    DEFAULT_HOME_CONTENT,
    fetchHomeContentForAdmin,
    type HomeContent,
} from "@/lib/site-content";
import { SiteEditorClient } from "./_components/SiteEditorClient";

export default function AdminSitePage() {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(true);
    const [previewKey, setPreviewKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetchHomeContentForAdmin()
            .then((c) => {
                if (!cancelled) setContent(c);
            })
            .catch((err) => {
                if (cancelled) return;
                console.warn("Failed to fetch site content; falling back to defaults", err);
                setContent(DEFAULT_HOME_CONTENT);
                setError(err instanceof Error ? err.message : "unknown error");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    function bumpPreview() {
        setRefreshing(true);
        setPreviewKey((k) => k + 1);
        // Visual flicker — clear after a short delay
        setTimeout(() => setRefreshing(false), 800);
    }

    if (!content) {
        return (
            <div className="flex items-center gap-3 text-white/60 py-12">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-sans text-sm">Loading site content…</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <header className="space-y-1 flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-heading text-2xl text-white">Site Editor</h1>
                    <p className="font-sans text-sm text-white/60">
                        Edit the homepage. Live preview on the right refreshes after each save.
                    </p>
                    {error && (
                        <p className="font-sans text-[0.75rem] text-amber-400">
                            Backend unreachable; showing defaults. Saving will create a fresh content row. ({error})
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={bumpPreview}
                        disabled={refreshing || !previewOpen}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] tracking-[0.15em] uppercase text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-colors disabled:opacity-40"
                        title="Reload preview iframe"
                    >
                        {refreshing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Refresh preview
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewOpen((v) => !v)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.7rem] tracking-[0.15em] uppercase text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-colors"
                    >
                        {previewOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {previewOpen ? "Hide preview" : "Show preview"}
                    </button>
                </div>
            </header>

            <div
                className={`grid gap-4 ${
                    previewOpen ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}
            >
                <div className={previewOpen ? "min-w-0" : ""}>
                    <SiteEditorClient initialContent={content} onSaved={bumpPreview} />
                </div>
                {previewOpen && (
                    <div className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] border border-white/10 rounded-lg overflow-hidden bg-[#0d0d0b]">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/40 text-[0.6rem] tracking-[0.18em] uppercase text-white/50">
                            <span>Preview · /</span>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ravok-gold hover:text-ravok-gold-hover"
                            >
                                Open in tab ↗
                            </a>
                        </div>
                        <iframe
                            key={previewKey}
                            src="/"
                            className="w-full h-full border-0"
                            title="Homepage preview"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
