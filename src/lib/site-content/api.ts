/**
 * Site content API client (CMS MVP).
 *
 * Public read: server-side fetcher used by `app/page.tsx` to render the
 * homepage with the latest editable content. Falls back to DEFAULT_HOME_CONTENT
 * if the backend is unreachable, so the public site never goes blank.
 *
 * Admin write: client-side `saveSiteContent` used by /admin/site to persist
 * edits via PUT /api/v1/admin/site/content/{slug}.
 */

import { getApiBase, getAuthHeaders, getToken } from "@/lib/api/base";
import { DEFAULT_HOME_CONTENT } from "./defaults";
import type { HomeContent, SiteContentEnvelope, GenericPageContent } from "./types";

/**
 * Server-side fetch — used by RSC at request time. No-store cache so edits show immediately.
 *
 * Resolves the backend URL with explicit fallback to the production Railway host.
 * `getApiBase()` falls back to `localhost:8000` when neither NEXT_PUBLIC_API_URL nor
 * `window` is available — which is exactly the SSR-on-Vercel scenario, and would
 * silently fail to localhost. Same fallback used by next.config.ts rewrites.
 */
function getServerApiBase(): string {
    const env = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");
    if (env && !env.startsWith("http://localhost") && !env.startsWith("http://127.")) {
        return env;
    }
    return "https://ravokbackend-production.up.railway.app";
}

export async function fetchHomeContent(): Promise<HomeContent> {
    const url = `${getServerApiBase()}/api/site/content/home`;

    try {
        const res = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            // 404 = not seeded yet; any non-2xx falls through to defaults.
            return DEFAULT_HOME_CONTENT;
        }

        const json = (await res.json()) as SiteContentEnvelope<HomeContent>;
        if (!json?.content) return DEFAULT_HOME_CONTENT;

        // Shallow-merge with defaults so missing fields get sensible fallbacks.
        // Important: arrays in `content` REPLACE arrays in defaults entirely
        // (otherwise admin can't remove items).
        return {
            ...DEFAULT_HOME_CONTENT,
            ...json.content,
            hero: { ...DEFAULT_HOME_CONTENT.hero, ...(json.content.hero ?? {}) },
            intro: { ...DEFAULT_HOME_CONTENT.intro, ...(json.content.intro ?? {}) },
            bridge: { ...DEFAULT_HOME_CONTENT.bridge, ...(json.content.bridge ?? {}) },
            portfolio: { ...DEFAULT_HOME_CONTENT.portfolio, ...(json.content.portfolio ?? {}) },
            team: { ...DEFAULT_HOME_CONTENT.team, ...(json.content.team ?? {}) },
            footer: { ...DEFAULT_HOME_CONTENT.footer, ...(json.content.footer ?? {}) },
        };
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[site-content] backend unreachable, falling back to defaults", err);
        return DEFAULT_HOME_CONTENT;
    }
}

/** Client-side fetch — used by /admin/site to load + edit. Bearer-token auth. */
export async function fetchHomeContentForAdmin(): Promise<HomeContent> {
    // Public endpoint — no auth needed. Use it from admin UI as well so
    // we get the latest persisted content (admin doesn't see drafts).
    const url = `${getApiBase()}/api/site/content/home`;
    const res = await fetch(url, {
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        if (res.status === 404) return DEFAULT_HOME_CONTENT;
        throw new Error(`Failed to load site content (${res.status})`);
    }

    const json = (await res.json()) as SiteContentEnvelope<HomeContent>;
    return json.content ?? DEFAULT_HOME_CONTENT;
}

/** Client-side write — admin save. Bearer token auth (matches the rest of the admin API). */
export async function saveHomeContent(content: HomeContent): Promise<HomeContent> {
    const url = `${getApiBase()}/api/admin/site/content/home`;

    const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Save failed (${res.status}): ${body}`);
    }

    const json = (await res.json()) as SiteContentEnvelope<HomeContent>;
    return json.content;
}

/* ───────────────── GENERIC PAGES (multi-page) ───────────────── */

/**
 * Server-side fetch for any page slug other than 'home'. Returns null if the
 * page doesn't exist (so the caller can render a 404).
 */
export async function fetchGenericPage(slug: string): Promise<GenericPageContent | null> {
    const url = `${getServerApiBase()}/api/site/content/${encodeURIComponent(slug)}`;
    try {
        const res = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });
        if (!res.ok) return null;
        const json = (await res.json()) as SiteContentEnvelope<GenericPageContent>;
        return json.content ?? null;
    } catch {
        return null;
    }
}

/** Client-side admin fetch — used by /admin/site/pages/[slug]. */
export async function fetchGenericPageForAdmin(slug: string): Promise<GenericPageContent | null> {
    const url = `${getApiBase()}/api/site/content/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to load page (${res.status})`);
    }
    const json = (await res.json()) as SiteContentEnvelope<GenericPageContent>;
    return json.content ?? null;
}

/** Client-side admin write — saves any page slug. */
export async function saveGenericPage(
    slug: string,
    content: GenericPageContent
): Promise<GenericPageContent> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Save failed (${res.status}): ${body}`);
    }
    const json = (await res.json()) as SiteContentEnvelope<GenericPageContent>;
    return json.content;
}

/** List every page row in the site_content table. Admin-only. */
export type PageListEntry = { slug: string; updated_at?: string };
export async function listAllPages(): Promise<PageListEntry[]> {
    const url = `${getApiBase()}/api/admin/site/content`;
    const token = getToken();
    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error(`List pages failed (${res.status})`);
    const json = (await res.json()) as { data: PageListEntry[] };
    return json.data ?? [];
}

/** #80 — Hard-delete a page row from site_content. Backend refuses 'home'. */
export async function deletePage(slug: string): Promise<void> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}`;
    const token = getToken();
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Delete failed (${res.status}): ${body}`);
    }
}

/** #78 — Rename a page's slug. Backend validates format + uniqueness. */
export async function renamePage(slug: string, newSlug: string): Promise<void> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}/rename`;
    const token = getToken();
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ newSlug }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Rename failed (${res.status}): ${body}`);
    }
}

/* ───────────────── ASSET UPLOAD (R2 via backend) ───────────────── */

export type AssetRecord = {
    key: string;
    url: string;
    size?: number;
    mime?: string;
    original_name?: string;
    uploaded?: string;
};

/**
 * POST a file to the admin asset upload endpoint. Backend uploads to the
 * public R2 bucket and returns the public CDN URL. The caller writes that
 * URL into a content path (e.g. via setAt("intro.statueImage", record.url)).
 *
 * Doesn't use getAuthHeaders because that forces Content-Type: application/json
 * which breaks multipart uploads — manual headers + Bearer token instead.
 */
export async function uploadAsset(file: File, folder?: string): Promise<AssetRecord> {
    const url = `${getApiBase()}/api/admin/site/assets`;
    const fd = new FormData();
    fd.append("file", file);
    if (folder) fd.append("folder", folder);

    const token = getToken();
    const headers: HeadersInit = {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(url, { method: "POST", headers, body: fd });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Upload failed (${res.status}): ${body}`);
    }
    return (await res.json()) as AssetRecord;
}

export async function listAssets(): Promise<AssetRecord[]> {
    const url = `${getApiBase()}/api/admin/site/assets`;
    const token = getToken();
    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error(`List assets failed (${res.status})`);
    const json = (await res.json()) as { data: AssetRecord[] };
    return json.data ?? [];
}
