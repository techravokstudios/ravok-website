<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentPageView;
use App\Models\DocumentView;
use App\Services\GeolocateIp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicRoomViewController extends Controller
{
    public function startSession(Request $request, string $slug, int $documentId)
    {
        $visitor = $request->attributes->get('room_visitor');
        $room = $request->attributes->get('data_room');

        $doc = $room->documents()->where('investor_documents.id', $documentId)->firstOrFail();

        $geo = GeolocateIp::resolve($request->ip());

        $view = DocumentView::create([
            'investor_document_id' => $doc->id,
            'room_visitor_id' => $visitor->id,
            'data_room_id' => $room->id,
            'session_token' => (string) Str::uuid(),
            'started_at' => now(),
            'user_agent' => $request->userAgent(),
            'ip_address' => $request->ip(),
            'city' => $geo['city'],
            'region' => $geo['region'],
            'country' => $geo['country'],
        ]);

        return response()->json([
            'session_id' => $view->session_token,
            'started_at' => $view->started_at->toIso8601String(),
        ], 201);
    }

    public function logPages(Request $request, string $sessionToken)
    {
        $visitor = $request->attributes->get('room_visitor');

        $view = DocumentView::where('session_token', $sessionToken)
            ->where('room_visitor_id', $visitor->id)
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
        $visitor = $request->attributes->get('room_visitor');

        $view = DocumentView::where('session_token', $sessionToken)
            ->where('room_visitor_id', $visitor->id)
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
