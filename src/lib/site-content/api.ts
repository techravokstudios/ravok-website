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

import { getApiBase } from "@/lib/api/base";
import { DEFAULT_HOME_CONTENT } from "./defaults";
import type { HomeContent, SiteContentEnvelope } from "./types";

/** Server-side fetch — used by RSC at request time. No-store cache so edits show immediately. */
export async function fetchHomeContent(): Promise<HomeContent> {
    const url = `${getApiBase()}/api/site/content/home`;

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

/** Client-side fetch — used by /admin/site to load + edit. Includes cookie credentials. */
export async function fetchHomeContentForAdmin(): Promise<HomeContent> {
    const url = `${getApiBase()}/api/site/content/home`;
    const res = await fetch(url, {
        credentials: "include",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        if (res.status === 404) return DEFAULT_HOME_CONTENT;
        throw new Error(`Failed to load site content (${res.status})`);
    }

    const json = (await res.json()) as SiteContentEnvelope<HomeContent>;
    return json.content ?? DEFAULT_HOME_CONTENT;
}

/** Client-side write — admin save. Sanctum cookie auth required. */
export async function saveHomeContent(content: HomeContent): Promise<HomeContent> {
    const url = `${getApiBase()}/api/admin/site/content/home`;

    // Pull XSRF cookie for Sanctum (matches the pattern in src/lib/api/client.ts).
    const xsrf = getCookie("XSRF-TOKEN");

    const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
        },
        body: JSON.stringify({ content }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Save failed (${res.status}): ${body}`);
    }

    const json = (await res.json()) as SiteContentEnvelope<HomeContent>;
    return json.content;
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (!match) return null;
    return decodeURIComponent(match[2]);
}
