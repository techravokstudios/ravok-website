<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_visitors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_room_id')->constrained('data_rooms')->cascadeOnDelete();
            $table->string('email');
            $table->string('name');
            $table->string('access_token', 64)->unique();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_accessed_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamps();

            $table->unique(['data_room_id', 'email']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_visitors');
    }
};
