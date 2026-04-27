<?php

namespace Tests\Feature;

use App\Models\DataRoom;
use App\Models\DocumentCategory;
use App\Models\DocumentView;
use App\Models\InvestorDocument;
use App\Models\RoomVisitor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $investor;
    private InvestorDocument $doc;
    private DataRoom $room;

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

        $cat = DocumentCategory::create(['name' => 'Test', 'slug' => 'test']);
        $this->doc = InvestorDocument::create([
            'document_category_id' => $cat->id, 'name' => 'Pitch Deck',
            'description' => 'Test', 'file_path' => 'test/pitch.pdf',
            'mime_type' => 'application/pdf', 'size_bytes' => 5000,
            'uploaded_by' => $this->admin->id,
        ]);

        $this->room = DataRoom::create([
            'name' => 'Test Room', 'created_by' => $this->admin->id,
        ]);
        $this->room->documents()->attach($this->doc->id, ['sort_order' => 0]);
    }

    // --- Overview ---

    public function test_overview_returns_totals(): void
    {
        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'user_id' => $this->investor->id,
            'session_token' => 'tok1',
            'started_at' => now(),
            'total_duration_seconds' => 120,
            'total_pages_viewed' => 3,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/analytics/overview');

        $response->assertStatus(200)
            ->assertJsonPath('totals.views', 1)
            ->assertJsonPath('totals.unique_viewers', 1)
            ->assertJsonPath('totals.total_duration_seconds', 120);
    }

    public function test_overview_includes_top_documents(): void
    {
        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'user_id' => $this->investor->id,
            'session_token' => 'tok2',
            'started_at' => now(),
            'total_duration_seconds' => 60,
        ]);

        $this->actingAs($this->admin)
            ->getJson('/api/analytics/overview')
            ->assertJsonPath('top_documents.0.name', 'Pitch Deck');
    }

    public function test_overview_requires_admin(): void
    {
        $this->actingAs($this->investor)
            ->getJson('/api/analytics/overview')
            ->assertStatus(403);
    }

    // --- Document analytics ---

    public function test_document_analytics_list(): void
    {
        $this->actingAs($this->admin)
            ->getJson('/api/analytics/documents')
            ->assertStatus(200);
    }

    public function test_document_analytics_detail(): void
    {
        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'user_id' => $this->investor->id,
            'session_token' => 'tok3',
            'started_at' => now(),
            'total_duration_seconds' => 90,
            'total_pages_viewed' => 5,
        ]);

        $this->actingAs($this->admin)
            ->getJson("/api/analytics/documents/{$this->doc->id}")
            ->assertStatus(200)
            ->assertJsonPath('summary.total_views', 1)
            ->assertJsonPath('summary.unique_viewers', 1);
    }

    public function test_document_analytics_csv_export(): void
    {
        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'user_id' => $this->investor->id,
            'session_token' => 'tok4',
            'started_at' => now(),
            'total_duration_seconds' => 30,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/api/analytics/documents/{$this->doc->id}/export");

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('Investor', $content);
        $this->assertStringContainsString('investor@test.com', $content);
    }

    // --- Room analytics ---

    public function test_room_analytics_list(): void
    {
        $this->actingAs($this->admin)
            ->getJson('/api/analytics/rooms')
            ->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_room_analytics_detail(): void
    {
        $this->actingAs($this->admin)
            ->getJson("/api/analytics/rooms/{$this->room->id}")
            ->assertStatus(200)
            ->assertJsonPath('room.name', 'Test Room');
    }

    public function test_room_visitors_list(): void
    {
        $visitor = RoomVisitor::create([
            'data_room_id' => $this->room->id,
            'email' => 'v@test.com', 'name' => 'V',
        ]);

        $this->actingAs($this->admin)
            ->getJson("/api/analytics/rooms/{$this->room->id}/visitors")
            ->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_room_visitor_detail(): void
    {
        $visitor = RoomVisitor::create([
            'data_room_id' => $this->room->id,
            'email' => 'v@test.com', 'name' => 'V',
        ]);

        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'room_visitor_id' => $visitor->id,
            'data_room_id' => $this->room->id,
            'session_token' => 'tok5',
            'started_at' => now(),
            'total_duration_seconds' => 45,
            'total_pages_viewed' => 2,
        ]);

        $this->actingAs($this->admin)
            ->getJson("/api/analytics/rooms/{$this->room->id}/visitors/{$visitor->id}")
            ->assertStatus(200)
            ->assertJsonPath('visitor.name', 'V')
            ->assertJsonCount(1, 'views');
    }

    public function test_room_analytics_csv_export(): void
    {
        $visitor = RoomVisitor::create([
            'data_room_id' => $this->room->id,
            'email' => 'export@test.com', 'name' => 'Exporter',
        ]);

        DocumentView::create([
            'investor_document_id' => $this->doc->id,
            'room_visitor_id' => $visitor->id,
            'data_room_id' => $this->room->id,
            'session_token' => 'tok6',
            'started_at' => now(),
            'total_duration_seconds' => 60,
        ]);

        $response = $this->actingAs($this->admin)
            ->get("/api/analytics/rooms/{$this->room->id}/export");

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('Exporter', $content);
        $this->assertStringContainsString('export@test.com', $content);
    }

    public function test_analytics_requires_admin(): void
    {
        $this->actingAs($this->investor)
            ->getJson('/api/analytics/documents')
            ->assertStatus(403);

        $this->actingAs($this->investor)
            ->getJson('/api/analytics/rooms')
            ->assertStatus(403);
    }
}
