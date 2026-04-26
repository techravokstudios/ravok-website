<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_rooms', function (Blueprint $table) {
            $table->text('nda_text')->nullable()->after('description');
        });

        Schema::table('room_visitors', function (Blueprint $table) {
            $table->timestamp('nda_accepted_at')->nullable()->after('verified_at');
        });
    }

    public function down(): void
    {
        Schema::table('data_rooms', function (Blueprint $table) {
            $table->dropColumn('nda_text');
        });

        Schema::table('room_visitors', function (Blueprint $table) {
            $table->dropColumn('nda_accepted_at');
        });
    }
};
