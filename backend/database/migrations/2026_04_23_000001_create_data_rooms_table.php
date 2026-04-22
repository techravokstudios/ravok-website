<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug', 64)->unique();
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->string('passcode')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('allow_download')->default(false);
            $table->boolean('notify_on_visit')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_rooms');
    }
};
