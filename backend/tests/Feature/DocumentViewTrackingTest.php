<?php

namespace Tests\Feature;

use App\Models\DocumentCategory;
use App\Models\DocumentView;
use App\Models\InvestorDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentViewTrackingTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $investor;
    private User $investor2;
    private User $pendingInvestor;
    private InvestorDocument $document;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin', 'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN, 'status' => User::STATUS_APPROVED,
        ]);
        $this->investor = User::create([
            'name' => 'Investor', 'email' => 'investor@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_INVESTOR, 'status' => User::STATUS_APPROVED,
        ]);
        $this->investor2 = User::create([
            'name' => 'Investor 2', 'email' => 'investor2@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_INVESTOR, 'status' => User::STATUS_APPROVED,
        ]);
        $this->pendingInvestor = User::create([
            'name' => 'Pending', 'email' => 'pending@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_INVESTOR, 'status' => User::STATUS_PENDING,
        ]);

        $cat = DocumentCategory::create(['name' => 'Test', 'slug' => 'test']);
        $this->document = InvestorDocument::create([
            'document_category_id' => $cat->id,
            'name' => 'Test Doc', 'description' => 'For tracking tests',
            'file_path' => 'investor-docs/fake.pdf',
            'mime_type' => 'application/pdf', 'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);
    }

    public function test_approved_investor_can_start_session(): void
    {
        $response = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");

        $response->assertStatus(201)
            ->assertJsonStructure(['session_id', 'started_at']);

        $this->assertDatabaseHas('document_views', [
            'investor_document_id' => $this->document->id,
            'user_id' => $this->investor->id,
        ]);
    }

    public function test_start_session_returns_unique_tokens(): void
    {
        $r1 = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $r2 = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");

        $this->assertNotEquals($r1->json('session_id'), $r2->json('session_id'));
    }

    public function test_pending_investor_cannot_start_session(): void
    {
        $this->actingAs($this->pendingInvestor)
            ->postJson("/api/documents/{$this->document->id}/views")
            ->assertStatus(403);
    }

    public function test_unauthenticated_cannot_start_session(): void
    {
        $this->postJson("/api/documents/{$this->document->id}/views")
            ->assertStatus(401);
    }

    public function test_can_log_page_events(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $response = $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/pages", [
                'events' => [
                    ['page_number' => 1, 'entered_at' => 1000, 'exited_at' => 5000, 'duration_ms' => 4000],
                    ['page_number' => 2, 'entered_at' => 5000, 'exited_at' => 8000, 'duration_ms' => 3000],
                ],
            ]);

        $response->assertStatus(200)->assertJsonPath('count', 2);

        $this->assertDatabaseCount('document_page_views', 2);
    }

    public function test_cannot_log_to_another_users_session(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $this->actingAs($this->investor2)
            ->postJson("/api/document-views/{$token}/pages", [
                'events' => [
                    ['page_number' => 1, 'entered_at' => 1000, 'exited_at' => 2000, 'duration_ms' => 1000],
                ],
            ])
            ->assertStatus(404);
    }

    public function test_validates_page_events_format(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/pages", [
                'events' => [['bad' => 'data']],
            ])
            ->assertStatus(422);
    }

    public function test_can_end_session(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/pages", [
                'events' => [
                    ['page_number' => 1, 'entered_at' => 1000, 'exited_at' => 5000, 'duration_ms' => 4000],
                    ['page_number' => 2, 'entered_at' => 5000, 'exited_at' => 8000, 'duration_ms' => 3000],
                    ['page_number' => 1, 'entered_at' => 8000, 'exited_at' => 10000, 'duration_ms' => 2000],
                ],
            ]);

        $response = $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/end");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('total_duration_seconds', 9)
            ->assertJsonPath('total_pages_viewed', 2);
    }

    public function test_end_session_is_idempotent(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/end")
            ->assertStatus(200);

        $this->actingAs($this->investor)
            ->postJson("/api/document-views/{$token}/end")
            ->assertStatus(200);
    }

    public function test_cannot_end_another_users_session(): void
    {
        $session = $this->actingAs($this->investor)
            ->postJson("/api/documents/{$this->document->id}/views");
        $token = $session->json('session_id');

        $this->actingAs($this->investor2)
            ->postJson("/api/document-views/{$token}/end")
            ->assertStatus(404);
    }

    public function test_admin_can_start_session(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/documents/{$this->document->id}/views")
            ->assertStatus(201);
    }
}
