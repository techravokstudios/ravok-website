<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DataRoomController extends Controller
{
    public function index()
    {
        $rooms = DataRoom::withCount(['visitors', 'documents', 'views'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passcode' => ['nullable', 'string', 'min:4'],
            'expires_at' => ['nullable', 'date'],
            'allow_download' => ['boolean'],
            'notify_on_visit' => ['boolean'],
            'document_ids' => ['array'],
            'document_ids.*' => ['integer', 'exists:investor_documents,id'],
        ]);

        $room = DataRoom::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => $request->user()->id,
            'passcode' => isset($validated['passcode']) ? Hash::make($validated['passcode']) : null,
            'expires_at' => $validated['expires_at'] ?? null,
            'allow_download' => $validated['allow_download'] ?? false,
            'notify_on_visit' => $validated['notify_on_visit'] ?? true,
        ]);

        if (!empty($validated['document_ids'])) {
            $docs = collect($validated['document_ids'])->mapWithKeys(fn ($id, $i) => [
                $id => ['sort_order' => $i],
            ]);
            $room->documents()->attach($docs);
        }

        $room->load('documents');

        return response()->json($room, 201);
    }

    public function show(DataRoom $room)
    {
        $room->load(['documents', 'visitors']);
        $room->loadCount(['views']);

        return response()->json($room);
    }

    public function update(Request $request, DataRoom $room)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passcode' => ['nullable', 'string', 'min:4'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'allow_download' => ['boolean'],
            'notify_on_visit' => ['boolean'],
        ]);

        if (array_key_exists('passcode', $validated)) {
            $validated['passcode'] = $validated['passcode']
                ? Hash::make($validated['passcode'])
                : null;
        }

        $room->update($validated);

        return response()->json($room);
    }

    public function destroy(DataRoom $room)
    {
        $room->delete();

        return response()->json(['status' => 'ok']);
    }

    public function addDocuments(Request $request, DataRoom $room)
    {
        $validated = $request->validate([
            'document_ids' => ['required', 'array'],
            'document_ids.*' => ['integer', 'exists:investor_documents,id'],
        ]);

        $maxOrder = $room->documents()->max('sort_order') ?? -1;
        $docs = collect($validated['document_ids'])->mapWithKeys(fn ($id, $i) => [
            $id => ['sort_order' => $maxOrder + $i + 1],
        ]);

        $room->documents()->syncWithoutDetaching($docs);
        $room->load('documents');

        return response()->json($room);
    }

    public function removeDocument(DataRoom $room, int $document)
    {
        $room->documents()->detach($document);

        return response()->json(['status' => 'ok']);
    }

    public function reorderDocuments(Request $request, DataRoom $room)
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($validated['order'] as $i => $docId) {
            $room->documents()->updateExistingPivot($docId, ['sort_order' => $i]);
        }

        return response()->json(['status' => 'ok']);
    }
}
