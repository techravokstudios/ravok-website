<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\RoomVisitorNotifyMail;
use App\Models\DataRoom;
use App\Models\RoomVisitor;
use App\Services\GeolocateIp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PublicRoomController extends Controller
{
    public function show(string $slug)
    {
        $room = DataRoom::where('slug', $slug)->firstOrFail();

        return response()->json([
            'name' => $room->name,
            'description' => $room->description,
            'requires_passcode' => !empty($room->passcode),
            'is_expired' => $room->isExpired(),
            'is_active' => $room->is_active,
            'document_count' => $room->documents()->count(),
        ]);
    }

    public function enter(Request $request, string $slug)
    {
        $room = DataRoom::where('slug', $slug)->firstOrFail();

        if (!$room->isAccessible()) {
            return response()->json(['message' => 'This room is no longer available.'], 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'passcode' => ['nullable', 'string'],
        ]);

        if ($room->passcode && !Hash::check($validated['passcode'] ?? '', $room->passcode)) {
            return response()->json(['message' => 'Invalid passcode.'], 403);
        }

        $geo = GeolocateIp::resolve($request->ip());

        $visitor = RoomVisitor::firstOrCreate(
            ['data_room_id' => $room->id, 'email' => $validated['email']],
            [
                'name' => $validated['name'],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'city' => $geo['city'],
                'region' => $geo['region'],
                'country' => $geo['country'],
            ]
        );

        $isNew = $visitor->wasRecentlyCreated;

        $visitor->update([
            'last_accessed_at' => now(),
            'verified_at' => $visitor->verified_at ?? now(),
        ]);

        if ($isNew && $room->notify_on_visit) {
            $this->sendVisitorNotification($room, $visitor);
        }

        return response()->json([
            'access_token' => $visitor->access_token,
            'visitor' => [
                'id' => $visitor->id,
                'name' => $visitor->name,
                'email' => $visitor->email,
            ],
        ]);
    }

    public function documents(Request $request, string $slug)
    {
        $room = $request->attributes->get('data_room');

        $docs = $room->documents()->get()->map(fn ($d) => [
            'id' => $d->id,
            'name' => $d->original_name ?: $d->name,
            'mime_type' => $d->mime_type,
            'size_bytes' => $d->size_bytes,
        ]);

        return response()->json([
            'room' => [
                'name' => $room->name,
                'allow_download' => $room->allow_download,
            ],
            'documents' => $docs,
        ]);
    }

    public function streamFile(Request $request, string $slug, int $documentId)
    {
        $room = $request->attributes->get('data_room');

        $doc = $room->documents()->where('investor_documents.id', $documentId)->firstOrFail();

        $wantsDownload = $request->boolean('download');
        if ($wantsDownload && !$room->allow_download) {
            return response()->json(['message' => 'Download is not allowed for this room.'], 403);
        }
        $disposition = $wantsDownload ? 'attachment' : 'inline';
        $filename = $doc->original_name ?: $doc->name;

        $r2Bucket = env('R2_BUCKET');
        $r2AccountId = env('R2_ACCOUNT_ID');
        $r2Token = env('R2_API_TOKEN');

        if ($r2Bucket && $r2AccountId && $r2Token) {
            $url = "https://{$r2AccountId}.r2.cloudflarestorage.com/{$r2Bucket}/{$doc->file_path}";
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => "Bearer {$r2Token}",
            ])->get($url);

            if ($response->successful()) {
                return response($response->body(), 200, [
                    'Content-Type' => $doc->mime_type,
                    'Content-Disposition' => $disposition . '; filename="' . $filename . '"',
                    'Cache-Control' => 'no-store',
                ]);
            }
        }

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($doc->file_path)) {
            return response()->file(
                storage_path('app/public/' . $doc->file_path),
                [
                    'Content-Type' => $doc->mime_type,
                    'Content-Disposition' => $disposition . '; filename="' . $filename . '"',
                    'Cache-Control' => 'no-store',
                ]
            );
        }

        return response()->json(['message' => 'File not found.'], 404);
    }

    private function sendVisitorNotification(DataRoom $room, RoomVisitor $visitor): void
    {
        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');
        $adminTarget = $fromAddress;

        try {
            $addr = DB::table('settings')->where('key', 'mail_from_address')->value('value');
            $name = DB::table('settings')->where('key', 'mail_from_name')->value('value');
            $admin = DB::table('settings')->where('key', 'mail_admin_to')->value('value');
            if ($addr) {
                $fromAddress = $addr;
            }
            if ($name) {
                $fromName = $name;
            }
            if ($admin) {
                $adminTarget = $admin;
            }
        } catch (\Throwable $e) {
            // settings table may not exist yet; fall back to config
        }

        try {
            Mail::to($adminTarget)->send(new RoomVisitorNotifyMail($room, $visitor, $fromAddress, $fromName));
        } catch (\Throwable $e) {
            Log::error('Mail send (room visitor notify) failed: '.$e->getMessage(), [
                'room_id' => $room->id,
                'visitor_id' => $visitor->id,
            ]);
        }
    }
}
