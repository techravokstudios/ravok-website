<?php

namespace Tests\Feature;

use App\Models\DataRoom;
use App\Models\DocumentCategory;
use App\Models\InvestorDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataRoomTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $investor;
    private InvestorDocument $doc1;
    private InvestorDocument $doc2;

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
        $this->doc1 = InvestorDocument::create([
            'document_category_id' => $cat->id, 'name' => 'Doc 1',
            'description' => 'First', 'file_path' => 'test/doc1.pdf',
            'mime_type' => 'application/pdf', 'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);
        $this->doc2 = InvestorDocument::create([
            'document_category_id' => $cat->id, 'name' => 'Doc 2',
            'description' => 'Second', 'file_path' => 'test/doc2.pdf',
            'mime_type' => 'application/pdf', 'size_bytes' => 2000,
            'uploaded_by' => $this->admin->id,
        ]);
    }

    public function test_admin_can_create_room(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/rooms', [
                'name' => 'Series A',
                'description' => 'Due diligence room',
                'document_ids' => [$this->doc1->id, $this->doc2->id],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'Series A');

        $this->assertDatabaseHas('data_rooms', ['name' => 'Series A']);
        $this->assertDatabaseCount('data_room_documents', 2);
    }

    public function test_room_gets_auto_generated_slug(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/rooms', ['name' => 'Test Room']);

        $slug = $response->json('slug');
        $this->assertNotEmpty($slug);
        $this->assertEquals(12, strlen($slug));
    }

    public function test_admin_can_list_rooms(): void
    {
        DataRoom::create(['name' => 'Room 1', 'created_by' => $this->admin->id]);
        DataRoom::create(['name' => 'Room 2', 'created_by' => $this->admin->id]);

        $this->actingAs($this->admin)
            ->getJson('/api/rooms')
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_admin_can_update_room(): void
    {
        $room = DataRoom::create(['name' => 'Old Name', 'created_by' => $this->admin->id]);

        $this->actingAs($this->admin)
            ->putJson("/api/rooms/{$room->id}", ['name' => 'New Name', 'is_active' => false])
            ->assertStatus(200)
            ->assertJsonPath('name', 'New Name');

        $this->assertDatabaseHas('data_rooms', ['id' => $room->id, 'name' => 'New Name', 'is_active' => false]);
    }

    public function test_admin_can_delete_room(): void
    {
        $room = DataRoom::create(['name' => 'To Delete', 'created_by' => $this->admin->id]);

        $this->actingAs($this->admin)
            ->deleteJson("/api/rooms/{$room->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('data_rooms', ['id' => $room->id]);
    }

    public function test_admin_can_add_documents_to_room(): void
    {
        $room = DataRoom::create(['name' => 'Room', 'created_by' => $this->admin->id]);

        $this->actingAs($this->admin)
            ->postJson("/api/rooms/{$room->id}/documents", [
                'document_ids' => [$this->doc1->id],
            ])
            ->assertStatus(200);

        $this->assertDatabaseHas('data_room_documents', [
            'data_room_id' => $room->id,
            'investor_document_id' => $this->doc1->id,
        ]);
    }

    public function test_admin_can_remove_document_from_room(): void
    {
        $room = DataRoom::create(['name' => 'Room', 'created_by' => $this->admin->id]);
        $room->documents()->attach($this->doc1->id, ['sort_order' => 0]);

        $this->actingAs($this->admin)
            ->deleteJson("/api/rooms/{$room->id}/documents/{$this->doc1->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('data_room_documents', [
            'data_room_id' => $room->id,
            'investor_document_id' => $this->doc1->id,
        ]);
    }

    public function test_room_with_passcode(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/rooms', [
                'name' => 'Protected Room',
                'passcode' => 'secret123',
            ])
            ->assertStatus(201);

        $room = DataRoom::where('name', 'Protected Room')->first();
        $this->assertNotNull($room->passcode);
        $this->assertNotEquals('secret123', $room->passcode); // bcrypt hashed
    }

    public function test_room_with_nda(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/rooms', [
                'name' => 'NDA Room',
                'nda_text' => 'You agree to keep this confidential.',
            ])
            ->assertStatus(201);

        $this->assertDatabaseHas('data_rooms', [
            'name' => 'NDA Room',
            'nda_text' => 'You agree to keep this confidential.',
        ]);
    }

    public function test_investor_cannot_create_room(): void
    {
        $this->actingAs($this->investor)
            ->postJson('/api/rooms', ['name' => 'Nope'])
            ->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_rooms(): void
    {
        $this->getJson('/api/rooms')->assertStatus(401);
    }

    public function test_quick_share_creates_single_doc_room(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson("/api/documents/{$this->doc1->id}/quick-share");

        $response->assertStatus(201);
        $roomId = $response->json('id');

        $this->assertDatabaseHas('data_room_documents', [
            'data_room_id' => $roomId,
            'investor_document_id' => $this->doc1->id,
        ]);
    }

    public function test_quick_share_reuses_existing_room(): void
    {
        $r1 = $this->actingAs($this->admin)
            ->postJson("/api/documents/{$this->doc1->id}/quick-share");
        $r2 = $this->actingAs($this->admin)
            ->postJson("/api/documents/{$this->doc1->id}/quick-share");

        $this->assertEquals($r1->json('id'), $r2->json('id'));
    }
}
