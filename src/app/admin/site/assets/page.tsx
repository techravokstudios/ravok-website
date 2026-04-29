"use client";

/**
 * /admin/site/assets — Asset library + R2 cleanup.
 *
 * Lists every object in the public R2 bucket via GET /api/admin/site/assets.
 * For each asset shows: thumbnail, filename, size, and an "in use" indicator
 * (the asset URL appears anywhere in the live homepage content JSON).
 *
 * Admins can:
 *  - Upload new files (drops them to R2 immediately)
 *  - Delete unused assets one at a time
 *  - Bulk-delete all "unused" assets in one click (with confirm)
 *  - Copy asset URL
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    fetchHomeContentForAdmin,
    listAssets,
    uploadAsset,
    type AssetRecord,
    type HomeContent,
} from "@/lib/site-content";
import { getApiBase, getToken } from "@/lib/api/base";

export default function AdminSiteAssetsPage() {
    const [assets, setAssets] = useState<AssetRecord[] | null>(null);
    const [content, setContent] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    async function reload() {
        setLoading(true);
        setError(null);
        try {
            const [a, c] = await Promise.all([
                listAssets(),
                fetchHomeContentForAdmin().catch(() => null),
            ]);
            setAssets(a);
            setContent(c);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load assets");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void reload();
    }, []);

    /** Serialize current homepage content + scan for each asset URL. */
    const usageMap = useMemo(() => {
        const map = new Map<string, boolean>();
        if (!content || !assets) return map;
        const blob = JSON.stringify(content);
        for (const a of assets) {
            map.set(a.key, a.url ? blob.includes(a.url) : false);
        }
        return map;
    }, [content, assets]);

    const filteredAssets = useMemo(() => {
        if (!assets) return [];
        const q = search.trim().toLowerCase();
        if (!q) return assets;
        return assets.filter((a) => a.key.toLowerCase().includes(q));
    }, [assets, search]);

    const unusedCount = useMemo(() => {
        if (!assets) return 0;
        return assets.filter((a) => !usageMap.get(a.key)).length;
    }, [assets, usageMap]);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;
        setUploading(true);
        try {
            for (const f of files) {
                await uploadAsset(f);
            }
            toast.success(`Uploaded ${files.length} file${files.length === 1 ? "" : "s"}`);
            await reload();
        } catch (err) {
            toast.error("Upload failed: " + (err instanceof Error ? err.message : "unknown"));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function deleteAsset(key: string) {
        const token = getToken();
        if (!token) {
            toast.error("Not authenticated");
            return;
        }
        const url = `${getApiBase()}/api/admin/site/assets/${encodeURIComponent(key)}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Delete failed (${res.status}): ${body.slice(0, 200)}`);
        }
    }

    async function handleDelete(key: string) {
        if (!confirm(`Delete ${key.split("/").pop()}? This cannot be undone.`)) return;
        try {
            await deleteAsset(key);
            toast.success("Deleted");
            await reload();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
        }
    }

    async function handleBulkDeleteUnused() {
        const unused = (assets ?? []).filter((a) => !usageMap.get(a.key));
        if (unused.length === 0) {
            toast.info("No unused assets to delete");
            return;
        }
        if (!confirm(`Delete ${unused.length} unused asset${unused.length === 1 ? "" : "s"}? This cannot be undone.`)) return;

        setBulkDeleting(true);
        let deleted = 0;
        let failed = 0;
        for (const a of unused) {
            try {
                await deleteAsset(a.key);
                deleted++;
            } catch {
                failed++;
            }
        }
        setBulkDeleting(false);
        if (failed === 0) {
            toast.success(`Deleted ${deleted} asset${deleted === 1 ? "" : "s"}`);
        } else {
            toast.error(`Deleted ${deleted}, failed ${failed}`);
        }
        await reload();
    }

    function copyToClipboard(url: string) {
        navigator.clipboard
            .writeText(url)
            .then(() => toast.success("URL copied"))
            .catch(() => toast.error("Copy failed"));
    }

    return (
        <div className="space-y-5 max-w-6xl">
            <header className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-heading text-2xl text-white">Asset library</h1>
                    <p className="font-sans text-sm text-white/60">
                        Browse, upload, and delete files in the public R2 bucket.
                        {assets && (
                            <>
                                {" "}
                                <strong className="text-white">{assets.length}</strong> total ·{" "}
                                <strong className="text-white">{unusedCount}</strong> unused.
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-ravok-gold/60 w-44"
                    />
                    <Button
                        onClick={reload}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Reload
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        style={{ display: "none" }}
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5"
                    >
                        {uploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Upload className="w-3.5 h-3.5" />
                        )}
                        {uploading ? "Uploading…" : "Upload"}
                    </Button>
                </div>
            </header>

            {unusedCount > 0 && (
                <div className="border border-amber-500/30 bg-amber-500/5 rounded-md p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-amber-300/90">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">
                            <strong>{unusedCount}</strong> asset{unusedCount === 1 ? " is" : "s are"}{" "}
                            not referenced anywhere in the live homepage content.
                        </span>
                    </div>
                    <button
                        onClick={handleBulkDeleteUnused}
                        disabled={bulkDeleting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-red-300 border border-red-500/40 hover:bg-red-500/10 rounded-md disabled:opacity-50"
                    >
                        {bulkDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete all unused
                    </button>
                </div>
            )}

            {error && (
                <div className="border border-red-500/40 bg-red-500/5 rounded-md p-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {!assets ? (
                <div className="flex items-center gap-3 text-white/60 py-8">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-sans text-sm">Loading assets…</span>
                </div>
            ) : assets.length === 0 ? (
                <div className="border border-white/10 rounded-md p-8 text-center text-white/60">
                    No assets yet. Upload some images to get started.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredAssets.map((a) => {
                        const inUse = usageMap.get(a.key);
                        const filename = a.key.split("/").pop() ?? a.key;
                        return (
                            <div
                                key={a.key}
                                className={`border rounded-lg overflow-hidden bg-white/[0.02] flex flex-col ${
                                    inUse
                                        ? "border-white/10"
                                        : "border-amber-500/30 ring-1 ring-amber-500/10"
                                }`}
                            >
                                <div className="aspect-square bg-[#0d0d0b] flex items-center justify-center p-2">
                                    <img
                                        src={a.url}
                                        alt=""
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="p-2 flex flex-col gap-1 text-[0.7rem]">
                                    <div className="text-white/80 truncate" title={a.key}>
                                        {filename}
                                    </div>
                                    <div className="text-white/40 flex items-center justify-between">
                                        <span>
                                            {a.size ? `${Math.round(a.size / 1024)} KB` : "—"}
                                        </span>
                                        <span className={inUse ? "text-emerald-400/80" : "text-amber-400/80"}>
                                            {inUse ? "in use" : "unused"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(a.url)}
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded"
                                            title="Copy URL"
                                        >
                                            <Copy className="w-3 h-3" />
                                            URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(a.key)}
                                            className="flex items-center justify-center px-2 py-1 text-[0.6rem] text-white/50 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
