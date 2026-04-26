<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_views', function (Blueprint $table) {
            $table->string('city', 100)->nullable()->after('ip_address');
            $table->string('region', 100)->nullable()->after('city');
            $table->string('country', 100)->nullable()->after('region');
        });

        Schema::table('room_visitors', function (Blueprint $table) {
            $table->string('city', 100)->nullable()->after('ip_address');
            $table->string('region', 100)->nullable()->after('city');
            $table->string('country', 100)->nullable()->after('region');
        });
    }

    public function down(): void
    {
        Schema::table('document_views', function (Blueprint $table) {
            $table->dropColumn(['city', 'region', 'country']);
        });

        Schema::table('room_visitors', function (Blueprint $table) {
            $table->dropColumn(['city', 'region', 'country']);
        });
    }
};
