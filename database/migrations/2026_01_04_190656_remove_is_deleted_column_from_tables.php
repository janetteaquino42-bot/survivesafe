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
        // Remove is_deleted column from incidents table
        Schema::table('incidents', function (Blueprint $table) {
            if (Schema::hasColumn('incidents', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });

        // Remove is_deleted column from announcements table
        Schema::table('announcements', function (Blueprint $table) {
            if (Schema::hasColumn('announcements', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });

        // Remove is_deleted column from awareness_materials table
        Schema::table('awareness_materials', function (Blueprint $table) {
            if (Schema::hasColumn('awareness_materials', 'is_deleted')) {
                $table->dropColumn('is_deleted');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false);
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false);
        });

        Schema::table('awareness_materials', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false);
        });
    }
};
