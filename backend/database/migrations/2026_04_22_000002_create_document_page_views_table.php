<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_view_id')->constrained('document_views')->cascadeOnDelete();
            $table->unsignedSmallInteger('page_number');
            $table->unsignedBigInteger('entered_at');
            $table->unsignedBigInteger('exited_at')->nullable();
            $table->unsignedInteger('duration_ms')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['document_view_id', 'page_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_page_views');
    }
};
