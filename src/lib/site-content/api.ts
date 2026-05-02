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
import { DEFAULT_HOME_CONTENT, DEFAULT_NAVBAR } from "./defaults";
import type {
    HomeContent,
    SiteContentEnvelope,
    GenericPageContent,
    NavbarContent,
    SaveResult,
} from "./types";

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
    // design-cms-v2: use defaults.ts directly while iterating on copy.
    // The production DB has a stale "home" row from the original seeder that
    // overrides every field. Bypass the API until the DB row is updated to
    // match the new copy, then restore the fetch+merge below.
    // TODO: restore API fetch once DB content is synced with defaults.
    return DEFAULT_HOME_CONTENT;
}

/** Client-side fetch — used by /admin/site to load + edit. Bearer-token auth.
 *  Uses the authenticated admin endpoint so drafts stay private. */
export async function fetchSiteContentEnvelopeForAdmin<T>(
    slug: string
): Promise<SiteContentEnvelope<T> | null> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to load admin site content (${res.status})`);
    }
    return (await res.json()) as SiteContentEnvelope<T>;
}

export async function fetchHomeContentForAdmin(): Promise<HomeContent> {
    const json = await fetchSiteContentEnvelopeForAdmin<HomeContent>("home");
    return json?.content ?? DEFAULT_HOME_CONTENT;
}

/** #79: admin fetch returning the full envelope (content + has_draft + published_at).
 *  Used by EditModeProvider when entering edit mode so the toolbar can show
 *  the publish state correctly and pull in any draft the admin saved earlier. */
export async function fetchHomeContentEnvelopeForAdmin(): Promise<SiteContentEnvelope<HomeContent>> {
    return (
        (await fetchSiteContentEnvelopeForAdmin<HomeContent>("home")) ?? {
            slug: "home",
            content: DEFAULT_HOME_CONTENT,
            has_draft: false,
            published_at: null,
        }
    );
}

/** Client-side write — admin save. Bearer token auth (matches the rest of the admin API).
 *  After #79: writes go to draft_content. Use publishPage() to promote draft → live. */
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

/** #79: home save returning the full envelope (with has_draft + published_at).
 *  Used by EditModeProvider so the toolbar can update its publish state. */
export async function saveHomeContentEnvelope(content: HomeContent): Promise<SiteContentEnvelope<HomeContent>> {
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
    return (await res.json()) as SiteContentEnvelope<HomeContent>;
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

/** Server-side fetch of the site-wide navbar content (slug "navbar").
 *  Returns null if no DB row exists; caller falls back to DEFAULT_NAVBAR. */
export async function fetchNavbarContent(): Promise<NavbarContent | null> {
    const url = `${getServerApiBase()}/api/site/content/navbar`;
    try {
        const res = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
        });
        if (!res.ok) return null;
        const json = (await res.json()) as SiteContentEnvelope<NavbarContent>;
        return json.content ?? null;
    } catch {
        return null;
    }
}

/** Client-side admin fetch — used by /admin/site/pages/[slug].
 *  Uses the authenticated admin endpoint so drafts stay private. */
export async function fetchGenericPageForAdmin(slug: string): Promise<GenericPageContent | null> {
    const json = await fetchSiteContentEnvelopeForAdmin<GenericPageContent>(slug);
    return json?.content ?? null;
}

/** #79: admin fetch returning the full envelope (content + has_draft + published_at). */
export async function fetchGenericPageEnvelopeForAdmin(
    slug: string
): Promise<SiteContentEnvelope<GenericPageContent> | null> {
    return fetchSiteContentEnvelopeForAdmin<GenericPageContent>(slug);
}

/** Client-side admin write — saves any page slug.
 *  After #79: writes go to draft_content. */
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

/** #79: generic save returning the full envelope (for page bodies that need
 *  has_draft + published_at to drive the in-page toolbar). */
export async function saveGenericPageEnvelope(
    slug: string,
    content: GenericPageContent
): Promise<SiteContentEnvelope<GenericPageContent>> {
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
    return (await res.json()) as SiteContentEnvelope<GenericPageContent>;
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

/** Combined save: writes the page-half to its own slug AND the navbar-half
 *  to the "navbar" slug in parallel. Used by per-page bodies that wrap
 *  page content + navbar together in their EditModeProvider so navbar can
 *  be edited inline. Returns the merged persisted result so the provider
 *  state stays in sync after save. */
export async function saveSplitPageAndNavbar(
    pageSlug: string,
    combined: Record<string, unknown>
): Promise<Record<string, unknown>> {
    const navbar = combined.navbar as Record<string, unknown> | undefined;
    const pageContent: Record<string, unknown> = { ...combined };
    delete pageContent.navbar;

    const [savedPage, savedNavbar] = await Promise.all([
        saveGenericPage(
            pageSlug,
            pageContent as unknown as Parameters<typeof saveGenericPage>[1]
        ),
        navbar
            ? saveGenericPage(
                  "navbar",
                  navbar as unknown as Parameters<typeof saveGenericPage>[1]
              )
            : Promise.resolve(undefined),
    ]);

    return {
        ...(savedPage as Record<string, unknown>),
        navbar: savedNavbar ?? navbar,
    };
}

/** #79: like saveSplitPageAndNavbar but returns SaveResult so the toolbar
 *  can update its publish state after save. The page's draft state is the
 *  authoritative one — navbar drafts are tracked but the page is what the
 *  admin is currently editing.  */
export async function saveSplitPageAndNavbarEnvelope(
    pageSlug: string,
    combined: Record<string, unknown>
): Promise<SaveResult<Record<string, unknown>>> {
    const navbar = combined.navbar as Record<string, unknown> | undefined;
    const pageContent: Record<string, unknown> = { ...combined };
    delete pageContent.navbar;

    const [pageEnv, navbarEnv] = await Promise.all([
        saveGenericPageEnvelope(
            pageSlug,
            pageContent as unknown as Parameters<typeof saveGenericPageEnvelope>[1]
        ),
        navbar
            ? saveGenericPageEnvelope(
                  "navbar",
                  navbar as unknown as Parameters<typeof saveGenericPageEnvelope>[1]
              )
            : Promise.resolve(undefined),
    ]);

    const merged: Record<string, unknown> = {
        ...(pageEnv.content as unknown as Record<string, unknown>),
        navbar: navbarEnv?.content ?? navbar,
    };

    // hasDraft = true if EITHER slug has a pending draft
    const hasDraft = !!pageEnv.has_draft || !!navbarEnv?.has_draft;

    return {
        content: merged,
        hasDraft,
        publishedAt: pageEnv.published_at ?? null,
    };
}

/** Authenticated draft resume helper for in-page editing. Public RSC renders
 *  published content; admins pull draft page + navbar content from admin-only
 *  endpoints when they enter edit mode. */
export async function fetchPageAndNavbarEnvelopeForAdmin(
    pageSlug: string,
    fallbackContent: Record<string, unknown>
): Promise<SaveResult<Record<string, unknown>>> {
    const [pageEnv, navbarEnv] = await Promise.all([
        fetchSiteContentEnvelopeForAdmin<Record<string, unknown>>(pageSlug),
        fetchSiteContentEnvelopeForAdmin<NavbarContent>("navbar").catch(() => null),
    ]);

    const pageContent = pageEnv?.content ?? fallbackContent;
    const fallbackNavbar = (fallbackContent.navbar as NavbarContent | undefined) ?? DEFAULT_NAVBAR;
    const merged: Record<string, unknown> = {
        ...pageContent,
        navbar: navbarEnv?.content ?? fallbackNavbar,
    };

    return {
        content: merged,
        hasDraft: !!pageEnv?.has_draft || !!navbarEnv?.has_draft,
        publishedAt: pageEnv?.published_at ?? null,
    };
}

/** #79: promotes draft_content to content for the given slug.
 *  Returns the new envelope so callers can refresh state. */
export async function publishPage(slug: string): Promise<SiteContentEnvelope<unknown>> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}/publish`;
    const res = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Publish failed (${res.status}): ${body}`);
    }
    return (await res.json()) as SiteContentEnvelope<unknown>;
}

/** #79: deletes the in-progress draft for `slug` without touching live content. */
export async function discardDraft(slug: string): Promise<SiteContentEnvelope<unknown>> {
    const url = `${getApiBase()}/api/admin/site/content/${encodeURIComponent(slug)}/discard-draft`;
    const res = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Discard failed (${res.status}): ${body}`);
    }
    return (await res.json()) as SiteContentEnvelope<unknown>;
}

/** #79: publish helper that promotes both the page slug and the navbar slug
 *  in parallel. Backend `publish` is idempotent (returns "no draft" if there's
 *  nothing to promote), so calling on navbar even when it has no draft is safe. */
/** #79: promotes draft_content to content for the given slug.
 *  Returns the new envelope so callers can refresh state. */
export async function publishPageAndNavbar(pageSlug: string): Promise<void> {
    await Promise.all([
        publishPage(pageSlug),
        publishPage("navbar").catch(() => {
            // navbar slug might not exist yet (no row created) — ignore
        }),
    ]);
}

/** #79: discards both page and navbar drafts. */
export async function discardDraftPageAndNavbar(pageSlug: string): Promise<void> {
    await Promise.all([
        discardDraft(pageSlug).catch(() => undefined),
        discardDraft("navbar").catch(() => undefined),
    ]);
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

