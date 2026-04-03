<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use App\Mail\FormThankYouMail;
use App\Mail\FormAdminNotifyMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FormSubmissionController extends Controller
{
    public function show(FormSubmission $submission): JsonResponse
    {
        return response()->json($submission);
    }

    public function store(Request $request, string $type): JsonResponse
    {
        $type = strtolower($type);
        if (! in_array($type, ['writer', 'director', 'producer'], true)) {
            return response()->json(['message' => 'Invalid form type'], 422);
        }
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'agreed_to_terms'  => ['required', 'accepted'],
        ]);
        $payload = $request->except(['name', 'email', 'agreed_to_terms']);
        $submission = FormSubmission::create([
            'type'      => $type,
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'data'      => $payload ?: null,
            'agreed_at' => now(),
        ]);

        $fromAddress = config('mail.from.address');
        $fromName = config('mail.from.name');
        try {
            $addr = DB::table('settings')->where('key', 'mail_from_address')->value('value');
            $name = DB::table('settings')->where('key', 'mail_from_name')->value('value');
            if ($addr) {
                $fromAddress = $addr;
            }
            if ($name) {
                $fromName = $name;
            }
        } catch (\Throwable $e) {
            // settings table may not exist yet; fall back to config
        }

        try {
            Mail::to($submission->email, $submission->name)->send(new FormThankYouMail($submission, $fromAddress, $fromName));
        } catch (\Throwable $e) {
            Log::error('Mail send (thank you) failed: '.$e->getMessage(), ['submission_id' => $submission->id]);
        }
        try {
            $adminTarget = DB::table('settings')->where('key', 'mail_admin_to')->value('value') ?: $fromAddress;
            Mail::to($adminTarget)->send(new FormAdminNotifyMail($submission, $fromAddress, $fromName));
        } catch (\Throwable $e) {
            Log::error('Mail send (admin notify) failed: '.$e->getMessage(), ['submission_id' => $submission->id]);
        }

        return response()->json(['status' => 'ok', 'id' => $submission->id], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $q = FormSubmission::query()->latest();
        if ($type) {
            $q->where('type', $type);
        }
        $items = $q->paginate(20);
        return response()->json($items);
    }

    public function downloadCsv(Request $request): StreamedResponse
    {
        $type = $request->query('type');
        $q = FormSubmission::query()->orderBy('id');
        if ($type) {
            $q->where('type', $type);
        }
        $filename = 'form_submissions'.($type ? '_'.$type : '').'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];
        $callback = function () use ($q) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['id', 'type', 'name', 'email', 'data', 'created_at']);
            $q->chunk(200, function ($rows) use ($out) {
                foreach ($rows as $row) {
                    fputcsv($out, [
                        $row->id,
                        $row->type,
                        $row->name,
                        $row->email,
                        json_encode($row->data),
                        $row->created_at,
                    ]);
                }
            });
            fclose($out);
        };
        return response()->stream($callback, 200, $headers);
    }
}
