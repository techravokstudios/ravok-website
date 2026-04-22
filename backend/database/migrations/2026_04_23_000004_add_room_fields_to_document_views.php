<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_views', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

            $table->foreignId('room_visitor_id')->nullable()->after('user_id')
                ->constrained('room_visitors')->nullOnDelete();
            $table->foreignId('data_room_id')->nullable()->after('room_visitor_id')
                ->constrained('data_rooms')->nullOnDelete();

            $table->index(['data_room_id', 'investor_document_id']);
        });
    }

    public function down(): void
    {
        Schema::table('document_views', function (Blueprint $table) {
            $table->dropIndex(['data_room_id', 'investor_document_id']);
            $table->dropForeign(['data_room_id']);
            $table->dropForeign(['room_visitor_id']);
            $table->dropColumn(['data_room_id', 'room_visitor_id']);

            $table->dropForeign(['user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
