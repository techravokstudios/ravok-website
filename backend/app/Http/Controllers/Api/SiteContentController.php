<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Site content editor (MVP).
 *
 * One JSON blob per page slug. Public route returns the content for a page;
 * admin route replaces the blob (full upsert) on save.
 *
 * The frontend owns the JSON shape — backend stores arbitrary structures.
 * Validation is deliberately minimal so the editable surface can grow without
 * backend changes during the MVP iteration phase.
 */
class SiteContentController extends Controller
{
    /** GET /api/v1/site/content/{slug} — public, used by the frontend at request time.
     *  Returns published content only (`content`, never `draft_content`).
     */
    public function show(string $slug): JsonResponse
    {
        $row = SiteContent::where('slug', $slug)->first();

        if (! $row) {
            return response()->json(['slug' => $slug, 'content' => null], 404);
        }

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->content,
            'published_at' => $row->published_at,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** GET /api/v1/admin/site/content/{slug} - admin only.
     *  Returns draft content when present so the editor can resume unpublished
     *  work without exposing drafts through the public endpoint. */
    public function showAdmin(string $slug): JsonResponse
    {
        $row = SiteContent::where('slug', $slug)->first();

        if (! $row) {
            return response()->json(['slug' => $slug, 'content' => null], 404);
        }

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->draft_content ?? $row->content,
            'has_draft' => $row->draft_content !== null,
            'published_at' => $row->published_at,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** PUT /api/v1/admin/site/content/{slug} - admin only.
     *  Writes to `draft_content` (not the live `content`). Use POST .../publish
     *  to promote the draft to live. Creates the row with the draft as the
     *  initial published content if it doesn't exist yet. */
    public function update(Request $request, string $slug): JsonResponse
    {
        $data = $request->validate([
            'content' => 'required|array',
        ]);

        $row = SiteContent::where('slug', $slug)->first();
        if ($row) {
            $row->draft_content = $data['content'];
            $row->save();
        } else {
            // First write: persist as published immediately so the public site
            // has SOMETHING to render. Subsequent writes go to draft_content.
            $row = SiteContent::create([
                'slug' => $slug,
                'content' => $data['content'],
                'published_at' => now(),
            ]);
        }

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->draft_content ?? $row->content,
            'has_draft' => $row->draft_content !== null,
            'published_at' => $row->published_at,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** POST /api/v1/admin/site/content/{slug}/publish — admin only.
     *  Promotes draft_content -> content, sets published_at, clears draft. */
    public function publish(string $slug): JsonResponse
    {
        $row = SiteContent::where('slug', $slug)->first();
        if (! $row) {
            return response()->json(['error' => "page '$slug' not found"], 404);
        }

        if ($row->draft_content === null) {
            // Nothing to publish — already in sync
            return response()->json([
                'slug' => $row->slug,
                'content' => $row->content,
                'has_draft' => false,
                'published_at' => $row->published_at,
                'updated_at' => $row->updated_at,
                'note' => 'no draft to publish',
            ]);
        }

        $row->content = $row->draft_content;
        $row->draft_content = null;
        $row->published_at = now();
        $row->save();

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->content,
            'has_draft' => false,
            'published_at' => $row->published_at,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** POST /api/v1/admin/site/content/{slug}/discard-draft — admin only.
     *  Throws away the draft, keeping the live content untouched. */
    public function discardDraft(string $slug): JsonResponse
    {
        $row = SiteContent::where('slug', $slug)->first();
        if (! $row) {
            return response()->json(['error' => "page '$slug' not found"], 404);
        }

        $row->draft_content = null;
        $row->save();

        return response()->json([
            'slug' => $row->slug,
            'content' => $row->content,
            'has_draft' => false,
            'published_at' => $row->published_at,
            'updated_at' => $row->updated_at,
        ]);
    }

    /** GET /api/v1/admin/site/content — admin only, lists all pages */
    public function index(): JsonResponse
    {
        $rows = SiteContent::select(['slug', 'updated_at'])
            ->orderBy('slug')
            ->get();

        return response()->json(['data' => $rows]);
    }

    /** DELETE /api/v1/admin/site/content/{slug} — admin only, hard-deletes a page row.
     *  Refuses to delete the homepage to prevent accidental loss. */
    public function destroy(string $slug): JsonResponse
    {
        if ($slug === 'home') {
            return response()->json(['error' => "'home' cannot be deleted"], 422);
        }

        $row = SiteContent::where('slug', $slug)->first();
        if (! $row) {
            return response()->json(['error' => "page '$slug' not found"], 404);
        }

        $row->delete();
        return response()->json(['status' => 'deleted', 'slug' => $slug]);
    }

    /** POST /api/v1/admin/site/content/{slug}/rename — admin only.
     *  Body: { newSlug: string }. Validates uniqueness + format. */
    public function rename(Request $request, string $slug): JsonResponse
    {
        $data = $request->validate([
            'newSlug' => 'required|string|regex:/^[a-z0-9-]+$/|max:120',
        ]);
        $newSlug = $data['newSlug'];

        if ($slug === 'home' || $newSlug === 'home') {
            return response()->json(['error' => "'home' is reserved"], 422);
        }
        if ($slug === $newSlug) {
            return response()->json(['error' => 'newSlug matches existing slug'], 422);
        }

        $row = SiteContent::where('slug', $slug)->first();
        if (! $row) {
            return response()->json(['error' => "page '$slug' not found"], 404);
        }

        $clash = SiteContent::where('slug', $newSlug)->first();
        if ($clash) {
            return response()->json(['error' => "page '$newSlug' already exists"], 409);
        }

        $row->slug = $newSlug;
        $row->save();

        return response()->json([
            'status' => 'renamed',
            'oldSlug' => $slug,
            'newSlug' => $newSlug,
            'updated_at' => $row->updated_at,
        ]);
    }

    /**
     * POST /api/site/install-laurel-frame — TEMPORARY one-shot repair.
     *
     * Bakes the laurel image in as the team's coin frame, sets the new scale
     * fields (coinFrameScale=130, coinPortraitScale=58 — sized to wrap the
     * photo cleanly), and removes any orphan floating laurel decoration.
     *
     * Idempotent: the `_laurelInstalled` flag in team JSON makes this a no-op
     * after the first successful run, so it can be spammed safely. Remove
     * this route + method once production has been patched.
     */
    public function installLaurelFrame(): JsonResponse
    {
        $row = SiteContent::where('slug', 'home')->first();
        if (! $row) {
            return response()->json(['error' => 'home content not found'], 404);
        }

        $content = $row->content;
        $team = $content['team'] ?? [];

        if (($team['_laurelInstalled'] ?? false) === true) {
            return response()->json(['status' => 'already-installed', 'team' => $team]);
        }

        $laurelUrl = 'https://pub-0c5b0ff2bc9242ffa0b31812b16adf4e.r2.dev/2026/04/i1swh4tzrnnd.svg';

        $team['coinFrame'] = $laurelUrl;
        $team['coinFrameScale'] = 130;
        $team['coinPortraitScale'] = 58;

        if (isset($team['decorations']) && is_array($team['decorations'])) {
            $team['decorations'] = array_values(array_filter(
                $team['decorations'],
                fn ($d) => ($d['src'] ?? '') !== $laurelUrl
            ));
        }

        $team['_laurelInstalled'] = true;
        $content['team'] = $team;

        $row->content = $content;
        $row->save();

        return response()->json(['status' => 'installed', 'team' => $team]);
    }
}
