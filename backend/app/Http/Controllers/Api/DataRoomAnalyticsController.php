<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataRoom;
use App\Models\DocumentView;
use App\Models\RoomVisitor;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataRoomAnalyticsController extends Controller
{
    public function index()
    {
        $rooms = DataRoom::withCount(['visitors', 'documents', 'views'])
            ->withSum('views', 'total_duration_seconds')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'is_active' => $r->is_active,
                'expires_at' => $r->expires_at,
                'document_count' => $r->documents_count,
                'visitor_count' => $r->visitors_count,
                'total_views' => $r->views_count,
                'total_duration_seconds' => (int) ($r->views_sum_total_duration_seconds ?? 0),
                'created_at' => $r->created_at,
            ]);

        return response()->json($rooms);
    }

    public function show(DataRoom $room)
    {
        $docStats = $room->documents()->get()->map(function ($doc) use ($room) {
            $views = DocumentView::where('data_room_id', $room->id)
                ->where('investor_document_id', $doc->id);

            return [
                'id' => $doc->id,
                'name' => $doc->original_name ?: $doc->name,
                'total_views' => $views->count(),
                'unique_viewers' => (clone $views)->whereNotNull('room_visitor_id')
                    ->distinct('room_visitor_id')->count('room_visitor_id'),
                'total_duration_seconds' => (int) $views->sum('total_duration_seconds'),
            ];
        });

        return response()->json([
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'slug' => $room->slug,
                'is_active' => $room->is_active,
                'created_at' => $room->created_at,
            ],
            'summary' => [
                'total_visitors' => $room->visitors()->count(),
                'total_views' => $room->views()->count(),
                'total_duration_seconds' => (int) $room->views()->sum('total_duration_seconds'),
            ],
            'document_stats' => $docStats,
        ]);
    }

    public function visitors(DataRoom $room)
    {
        $visitors = $room->visitors()
            ->withCount('documentViews')
            ->withSum('documentViews', 'total_duration_seconds')
            ->orderByDesc('last_accessed_at')
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'email' => $v->email,
                'last_accessed_at' => $v->last_accessed_at,
                'total_views' => $v->document_views_count,
                'total_duration_seconds' => (int) ($v->document_views_sum_total_duration_seconds ?? 0),
                'location' => $v->city ? trim("{$v->city}, {$v->region}, {$v->country}", ', ') : null,
            ]);

        return response()->json($visitors);
    }

    public function visitorDetail(DataRoom $room, RoomVisitor $visitor)
    {
        if ($visitor->data_room_id !== $room->id) {
            abort(404);
        }

        $views = $visitor->documentViews()
            ->with('document:id,name,original_name')
            ->orderByDesc('started_at')
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'document' => [
                    'id' => $v->document->id,
                    'name' => $v->document->original_name ?: $v->document->name,
                ],
                'started_at' => $v->started_at,
                'total_duration_seconds' => $v->total_duration_seconds,
                'total_pages_viewed' => $v->total_pages_viewed,
                'page_summary' => $v->pageViews()
                    ->selectRaw('page_number, SUM(duration_ms) as total_ms, COUNT(*) as visits')
                    ->groupBy('page_number')
                    ->orderBy('page_number')
                    ->get(),
            ]);

        return response()->json([
            'visitor' => [
                'id' => $visitor->id,
                'name' => $visitor->name,
                'email' => $visitor->email,
                'last_accessed_at' => $visitor->last_accessed_at,
            ],
            'views' => $views,
        ]);
    }

    public function export(DataRoom $room): StreamedResponse
    {
        $filename = 'room_analytics_'.preg_replace('/[^A-Za-z0-9_-]/', '_', $room->name).'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($room) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Visitor Name', 'Visitor Email', 'Document', 'Location', 'Started At', 'Ended At', 'Duration (sec)', 'Pages Viewed', 'IP Address', 'NDA Accepted At']);

            DocumentView::where('data_room_id', $room->id)
                ->with('roomVisitor:id,name,email,nda_accepted_at', 'document:id,name,original_name')
                ->orderBy('started_at')
                ->chunk(200, function ($rows) use ($out) {
                    foreach ($rows as $v) {
                        $location = trim(implode(', ', array_filter([$v->city, $v->region, $v->country])));
                        fputcsv($out, [
                            $v->roomVisitor?->name ?? '',
                            $v->roomVisitor?->email ?? '',
                            $v->document?->original_name ?? $v->document?->name ?? '',
                            $location,
                            $v->started_at,
                            $v->ended_at,
                            $v->total_duration_seconds,
                            $v->total_pages_viewed,
                            $v->ip_address,
                            $v->roomVisitor?->nda_accepted_at,
                        ]);
                    }
                });
            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}
