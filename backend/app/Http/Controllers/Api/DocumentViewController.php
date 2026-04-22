<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentPageView;
use App\Models\DocumentView;
use App\Models\InvestorDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentViewController extends Controller
{
    public function startSession(Request $request, InvestorDocument $document)
    {
        $view = DocumentView::create([
            'investor_document_id' => $document->id,
            'user_id' => $request->user()->id,
            'session_token' => (string) Str::uuid(),
            'started_at' => now(),
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'session_id' => $view->session_token,
            'started_at' => $view->started_at->toIso8601String(),
        ], 201);
    }

    public function logPages(Request $request, string $sessionToken)
    {
        $view = DocumentView::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'events' => ['required', 'array'],
            'events.*.page_number' => ['required', 'integer', 'min:1'],
            'events.*.entered_at' => ['required', 'integer'],
            'events.*.exited_at' => ['required', 'integer'],
            'events.*.duration_ms' => ['required', 'integer', 'min:0'],
        ]);

        $rows = array_map(fn ($e) => [
            'document_view_id' => $view->id,
            'page_number' => $e['page_number'],
            'entered_at' => $e['entered_at'],
            'exited_at' => $e['exited_at'],
            'duration_ms' => $e['duration_ms'],
            'created_at' => now(),
        ], $validated['events']);

        DocumentPageView::insert($rows);

        return response()->json(['status' => 'ok', 'count' => count($rows)]);
    }

    public function endSession(Request $request, string $sessionToken)
    {
        $view = DocumentView::where('session_token', $sessionToken)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($view->ended_at) {
            return response()->json([
                'status' => 'ok',
                'total_duration_seconds' => $view->total_duration_seconds,
                'total_pages_viewed' => $view->total_pages_viewed,
            ]);
        }

        $totalMs = $view->pageViews()->sum('duration_ms');
        $totalPages = $view->pageViews()->distinct('page_number')->count('page_number');

        $view->update([
            'ended_at' => now(),
            'total_duration_seconds' => intdiv((int) $totalMs, 1000),
            'total_pages_viewed' => $totalPages,
        ]);

        return response()->json([
            'status' => 'ok',
            'total_duration_seconds' => $view->total_duration_seconds,
            'total_pages_viewed' => $view->total_pages_viewed,
        ]);
    }
}
