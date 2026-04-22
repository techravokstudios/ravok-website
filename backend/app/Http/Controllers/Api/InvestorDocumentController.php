<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestorDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvestorDocumentController extends Controller
{
    private function useR2(): bool
    {
        return ! empty(config('services.r2.token'));
    }

    private function r2Url(string $key): string
    {
        $account = config('services.r2.account_id');
        $bucket = config('services.r2.bucket');

        return "https://api.cloudflare.com/client/v4/accounts/{$account}/r2/buckets/{$bucket}/objects/{$key}";
    }

    private function r2Put(string $key, string $content, string $contentType): bool
    {
        $response = Http::withToken(config('services.r2.token'))
            ->withHeaders(['Content-Type' => $contentType])
            ->withBody($content, $contentType)
            ->put($this->r2Url($key));

        return $response->successful();
    }

    private function r2Get(string $key): ?string
    {
        $response = Http::withToken(config('services.r2.token'))
            ->get($this->r2Url($key));

        return $response->successful() ? $response->body() : null;
    }

    private function r2Delete(string $key): void
    {
        Http::withToken(config('services.r2.token'))
            ->delete($this->r2Url($key));
    }

    public function index(Request $request)
    {
        $query = InvestorDocument::with('category')->orderByDesc('created_at');
        if ($request->filled('document_category_id')) {
            $query->where('document_category_id', (int) $request->input('document_category_id'));
        }
        $perPage = max(1, (int) $request->input('per_page', 15));
        $docs = $query->paginate($perPage);

        return response()->json($docs);
    }

    public function show(InvestorDocument $document)
    {
        return response()->json($document->load('category'));
    }

    public function streamFile(InvestorDocument $document)
    {
        if (! $document->file_path) {
            abort(404);
        }

        if ($this->useR2()) {
            $body = $this->r2Get($document->file_path);
            if (! $body) {
                abort(404);
            }

            return response($body, 200, [
                'Content-Type' => $document->mime_type ?? 'application/octet-stream',
                'Content-Disposition' => 'inline; filename="'.($document->original_name ?? $document->name).'"',
                'Cache-Control' => 'private, no-store, no-cache, must-revalidate, max-age=0',
                'X-Content-Type-Options' => 'nosniff',
            ]);
        }

        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404);
        }

        return Storage::disk('public')->response(
            $document->file_path,
            $document->original_name ?? $document->name,
            [
                'Content-Type' => $document->mime_type ?? 'application/octet-stream',
                'Content-Disposition' => 'inline; filename="'.($document->original_name ?? $document->name).'"',
                'Cache-Control' => 'private, no-store, no-cache, must-revalidate, max-age=0',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'document_category_id' => ['required', 'exists:document_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'files' => ['required', 'array', 'min:1'],
            'files.*' => [
                'file',
                'max:20480',
                'mimetypes:image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,application/rtf,application/zip',
            ],
        ]);

        $saved = [];
        $groupKey = (string) Str::uuid();
        foreach ($request->file('files') as $file) {
            $key = 'investor-docs/'.Str::random(40).'.'.$file->getClientOriginalExtension();

            if ($this->useR2()) {
                $ok = $this->r2Put($key, $file->getContent(), $file->getMimeType());
                $path = $ok ? $key : false;
            } else {
                $path = $file->store('investor-docs', 'public');
            }

            if (! $path) {
                continue;
            }

            $doc = InvestorDocument::create([
                'document_category_id' => $request->integer('document_category_id'),
                'name' => (string) $request->string('name'),
                'original_name' => $file->getClientOriginalName(),
                'description' => $request->string('description'),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'size_bytes' => $file->getSize(),
                'uploaded_by' => optional($request->user())->id,
                'group_key' => $groupKey,
            ]);
            $saved[] = $doc;
        }

        return response()->json(['status' => 'ok', 'items' => $saved], 201);
    }

    public function update(Request $request, InvestorDocument $document)
    {
        $data = $request->validate([
            'document_category_id' => ['sometimes', 'required', 'exists:document_categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
        ]);
        $document->update($data);

        return response()->json($document);
    }

    public function destroy(InvestorDocument $document)
    {
        if ($document->file_path) {
            if ($this->useR2()) {
                $this->r2Delete($document->file_path);
            } else {
                Storage::disk('public')->delete($document->file_path);
            }
        }
        $document->delete();

        return response()->json(['status' => 'ok']);
    }
}
