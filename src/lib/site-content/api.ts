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

import { getApiBase, getAuthHeaders } from "@/lib/api/base";
import { DEFAULT_HOME_CONTENT } from "./defaults";
import type { HomeContent, SiteContentEnvelope } from "./types";

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
