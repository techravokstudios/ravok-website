"use client";

/**
 * /admin/site/pages — list every page row in site_content.
 *
 * Each row corresponds to a CMS-driven page. `home` is special (the
 * homepage). Any other slug is a generic page rendered at /p/<slug>.
 *
 * Admins can:
 *  - See all pages, last-updated time
 *  - Create a new generic page (prompts for slug + title)
 *  - Open a page (redirects to its public URL — admin can edit there
 *    via the in-page editor)
 *  - Delete a non-home page
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2, ExternalLink, RefreshCw, Home, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    listAllPages,
    saveGenericPage,
    deletePage as deletePageApi,
    renamePage as renamePageApi,
    type PageListEntry,
} from "@/lib/site-content";

export default function AdminPagesIndex() {
    const [pages, setPages] = useState<PageListEntry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    async function reload() {
        setLoading(true);
        setError(null);
        try {
            setPages(await listAllPages());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load pages");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        void reload();
    }, []);

    async function createPage() {
        const slugRaw = prompt("URL slug (e.g. 'thesis', 'about-amanda')");
        if (!slugRaw) return;
        const slug = slugRaw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        if (!slug) {
            toast.error("Invalid slug");
            return;
        }
        if (slug === "home") {
            toast.error("'home' is reserved for the homepage. Pick another slug.");
            return;
        }
        if (pages?.some((p) => p.slug === slug)) {
            toast.error(`Page '${slug}' already exists.`);
            return;
        }
        const title = prompt("Page title", slug.replace(/-/g, " ")) ?? slug;

        setCreating(true);
        try {
            await saveGenericPage(slug, {
                title,
                metaDescription: "",
                customBlocks: [],
                decorations: [],
            });
            toast.success(`Page '${slug}' created — opens at /p/${slug}`);
            await reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Create failed");
        } finally {
            setCreating(false);
        }
    }

    async function deletePage(slug: string) {
        if (slug === "home") {
            toast.error("Can't delete the homepage.");
            return;
        }
        if (!confirm(`HARD-delete page '${slug}'? The row is removed from the database — this cannot be undone.`)) return;
        try {
            await deletePageApi(slug);
            toast.success(`Deleted '${slug}'`);
            await reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
        }
    }

    async function renamePage(slug: string) {
        if (slug === "home") {
            toast.error("Can't rename the homepage.");
            return;
        }
        const raw = prompt(`New slug for '${slug}'? (lowercase, hyphens, no spaces)`, slug);
        if (!raw) return;
        const newSlug = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
        if (!newSlug || newSlug === slug) return;
        if (newSlug === "home") {
            toast.error("'home' is reserved.");
            return;
        }
        if (pages?.some((p) => p.slug === newSlug)) {
            toast.error(`Page '${newSlug}' already exists.`);
            return;
        }
        try {
            await renamePageApi(slug, newSlug);
            toast.success(`Renamed '${slug}' → '${newSlug}'`);
            await reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Rename failed");
        }
    }

    function pageUrl(slug: string): string {
        return slug === "home" ? "/" : `/p/${slug}`;
    }

    return (
        <div className="space-y-5 max-w-4xl">
            <header className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-heading text-2xl text-white">Pages</h1>
                    <p className="font-sans text-sm text-white/60">
                        Every CMS-driven page in the database. Click a page to open it; edit inline.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={reload} disabled={loading} className="inline-flex items-center gap-1.5">
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        Reload
                    </Button>
                    <Button onClick={createPage} disabled={creating} className="inline-flex items-center gap-1.5">
                        {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        New page
                    </Button>
                </div>
            </header>

            {error && (
                <div className="border border-red-500/40 bg-red-500/5 rounded-md p-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {!pages ? (
                <div className="flex items-center gap-3 text-white/60 py-8">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-sans text-sm">Loading pages…</span>
                </div>
            ) : pages.length === 0 ? (
                <div className="border border-white/10 rounded-md p-8 text-center text-white/60">
                    No pages yet. Click "New page" above to create one.
                </div>
            ) : (
                <div className="space-y-2">
                    {pages.map((p) => {
                        const isHome = p.slug === "home";
                        return (
                            <div
                                key={p.slug}
                                className="flex items-center justify-between gap-4 border border-white/10 rounded-md p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {isHome ? (
                                        <Home className="w-4 h-4 text-ravok-gold flex-shrink-0" />
                                    ) : (
                                        <ExternalLink className="w-4 h-4 text-white/40 flex-shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <div className="font-heading text-white">
                                            {isHome ? "Home" : p.slug}
                                        </div>
                                        <div className="font-mono text-[0.7rem] text-white/40 truncate">
                                            {pageUrl(p.slug)}
                                            {p.updated_at && (
                                                <span className="ml-2 text-white/30">
                                                    · updated {new Date(p.updated_at).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Link
                                        href={pageUrl(p.slug)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.7rem] tracking-[0.15em] uppercase text-white/70 hover:text-white border border-white/10 hover:border-white/30 rounded-md"
                                    >
                                        Open
                                    </Link>
                                    {!isHome && (
                                        <>
                                            <button
                                                onClick={() => renamePage(p.slug)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.7rem] text-white/40 hover:text-ravok-gold border border-white/10 hover:border-ravok-gold/40 rounded-md"
                                                title="Rename slug"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => deletePage(p.slug)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.7rem] text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded-md"
                                                title="Hard delete"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
