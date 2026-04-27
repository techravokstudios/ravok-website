<?php

namespace Tests\Feature;

use App\Models\DataRoom;
use App\Models\DocumentCategory;
use App\Models\InvestorDocument;
use App\Models\RoomVisitor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PublicRoomTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private DataRoom $room;
    private InvestorDocument $doc;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin', 'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN, 'status' => User::STATUS_APPROVED,
        ]);

        $cat = DocumentCategory::create(['name' => 'Test', 'slug' => 'test']);
        $this->doc = InvestorDocument::create([
            'document_category_id' => $cat->id, 'name' => 'Pitch Deck',
            'description' => 'Test', 'file_path' => 'test/pitch.pdf',
            'mime_type' => 'application/pdf', 'size_bytes' => 5000,
            'uploaded_by' => $this->admin->id,
        ]);

        $this->room = DataRoom::create([
            'name' => 'Test Room', 'created_by' => $this->admin->id,
            'notify_on_visit' => false,
        ]);
        $this->room->documents()->attach($this->doc->id, ['sort_order' => 0]);
    }

    public function test_public_can_view_room_info(): void
    {
        $this->getJson("/api/public/rooms/{$this->room->slug}")
            ->assertStatus(200)
            ->assertJsonPath('name', 'Test Room')
            ->assertJsonPath('document_count', 1)
            ->assertJsonPath('requires_passcode', false)
            ->assertJsonPath('requires_nda', false);
    }

    public function test_nonexistent_slug_returns_404(): void
    {
        $this->getJson('/api/public/rooms/nonexistent123')
            ->assertStatus(404);
    }

    public function test_visitor_can_enter_room(): void
    {
        $response = $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'jane@investor.com',
            'name' => 'Jane Doe',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'visitor']);

        $this->assertDatabaseHas('room_visitors', [
            'data_room_id' => $this->room->id,
            'email' => 'jane@investor.com',
            'name' => 'Jane Doe',
        ]);
    }

    public function test_repeat_entry_returns_same_visitor(): void
    {
        $r1 = $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'repeat@test.com', 'name' => 'Repeat',
        ]);
        $r2 = $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'repeat@test.com', 'name' => 'Repeat',
        ]);

        $this->assertEquals($r1->json('visitor.id'), $r2->json('visitor.id'));
        $this->assertDatabaseCount('room_visitors', 1);
    }

    public function test_cannot_enter_inactive_room(): void
    {
        $this->room->update(['is_active' => false]);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test',
        ])->assertStatus(403);
    }

    public function test_cannot_enter_expired_room(): void
    {
        $this->room->update(['expires_at' => now()->subDay()]);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test',
        ])->assertStatus(403);
    }

    public function test_passcode_required_when_set(): void
    {
        $this->room->update(['passcode' => Hash::make('secret')]);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test',
        ])->assertStatus(403);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test', 'passcode' => 'wrong',
        ])->assertStatus(403);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test', 'passcode' => 'secret',
        ])->assertStatus(200);
    }

    public function test_nda_required_when_set(): void
    {
        $this->room->update(['nda_text' => 'You must agree.']);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test',
        ])->assertStatus(403);

        $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'test@test.com', 'name' => 'Test', 'accept_nda' => true,
        ])->assertStatus(200);

        $visitor = RoomVisitor::where('email', 'test@test.com')->first();
        $this->assertNotNull($visitor->nda_accepted_at);
    }

    public function test_visitor_can_list_documents(): void
    {
        $token = $this->enterRoom();

        $this->getJson("/api/public/rooms/{$this->room->slug}/documents", [
            'X-Room-Token' => $token,
        ])->assertStatus(200)
            ->assertJsonCount(1, 'documents')
            ->assertJsonPath('documents.0.name', 'Pitch Deck');
    }

    public function test_documents_require_token(): void
    {
        $this->getJson("/api/public/rooms/{$this->room->slug}/documents")
            ->assertStatus(401);
    }

    public function test_invalid_token_rejected(): void
    {
        $this->getJson("/api/public/rooms/{$this->room->slug}/documents", [
            'X-Room-Token' => 'bogus',
        ])->assertStatus(401);
    }

    public function test_visitor_can_start_tracking_session(): void
    {
        $token = $this->enterRoom();

        $response = $this->postJson(
            "/api/public/rooms/{$this->room->slug}/documents/{$this->doc->id}/views",
            [],
            ['X-Room-Token' => $token]
        );

        $response->assertStatus(201)
            ->assertJsonStructure(['session_id', 'started_at']);

        $this->assertDatabaseHas('document_views', [
            'investor_document_id' => $this->doc->id,
            'data_room_id' => $this->room->id,
        ]);
    }

    public function test_visitor_can_log_page_events(): void
    {
        $token = $this->enterRoom();

        $session = $this->postJson(
            "/api/public/rooms/{$this->room->slug}/documents/{$this->doc->id}/views",
            [], ['X-Room-Token' => $token]
        );
        $sessionToken = $session->json('session_id');

        $this->postJson("/api/public/room-views/{$sessionToken}/pages", [
            'events' => [
                ['page_number' => 1, 'entered_at' => 1000, 'exited_at' => 5000, 'duration_ms' => 4000],
                ['page_number' => 2, 'entered_at' => 5000, 'exited_at' => 8000, 'duration_ms' => 3000],
            ],
        ], ['X-Room-Token' => $token])
            ->assertStatus(200)
            ->assertJsonPath('count', 2);

        $this->assertDatabaseCount('document_page_views', 2);
    }

    public function test_visitor_can_end_session(): void
    {
        $token = $this->enterRoom();

        $session = $this->postJson(
            "/api/public/rooms/{$this->room->slug}/documents/{$this->doc->id}/views",
            [], ['X-Room-Token' => $token]
        );
        $sessionToken = $session->json('session_id');

        $this->postJson("/api/public/room-views/{$sessionToken}/pages", [
            'events' => [
                ['page_number' => 1, 'entered_at' => 1000, 'exited_at' => 4000, 'duration_ms' => 3000],
            ],
        ], ['X-Room-Token' => $token]);

        $this->postJson("/api/public/room-views/{$sessionToken}/end", [], ['X-Room-Token' => $token])
            ->assertStatus(200)
            ->assertJsonPath('total_duration_seconds', 3)
            ->assertJsonPath('total_pages_viewed', 1);
    }

    public function test_download_blocked_when_disabled(): void
    {
        $token = $this->enterRoom();

        $this->getJson(
            "/api/public/rooms/{$this->room->slug}/documents/{$this->doc->id}/file?download=1",
            ['X-Room-Token' => $token]
        )->assertStatus(403);
    }

    public function test_download_allowed_when_enabled(): void
    {
        $this->room->update(['allow_download' => true]);
        $token = $this->enterRoom();

        $this->getJson(
            "/api/public/rooms/{$this->room->slug}/documents/{$this->doc->id}/file?download=1",
            ['X-Room-Token' => $token]
        )->assertStatus(404); // 404 because test file doesn't exist on disk, but proves it passed the permission check
    }

    private function enterRoom(): string
    {
        $response = $this->postJson("/api/public/rooms/{$this->room->slug}/enter", [
            'email' => 'visitor@test.com', 'name' => 'Visitor',
        ]);
        return $response->json('access_token');
    }
}
