<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add deleted_at column to incidents table
        Schema::table('incidents', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to announcements table
        Schema::table('announcements', function (Blueprint $table) {
            $table->softDeletes();
        });

        // Add deleted_at column to awareness_materials table
        Schema::table('awareness_materials', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('awareness_materials', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
