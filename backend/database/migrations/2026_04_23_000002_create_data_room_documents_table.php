<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_room_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_room_id')->constrained('data_rooms')->cascadeOnDelete();
            $table->foreignId('investor_document_id')->constrained('investor_documents')->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['data_room_id', 'investor_document_id']);
            $table->index('investor_document_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_room_documents');
    }
};
