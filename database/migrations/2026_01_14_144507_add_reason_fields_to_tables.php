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
        // Add decline_reason to incidents table
        Schema::table('incidents', function (Blueprint $table) {
            if (!Schema::hasColumn('incidents', 'decline_reason')) {
                $table->text('decline_reason')->nullable()->after('status');
            }
        });

        // Add deletion_reason to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'deletion_reason')) {
                $table->text('deletion_reason')->nullable();
            }
        });

        // Add decline_reason to announcements table
        Schema::table('announcements', function (Blueprint $table) {
            if (!Schema::hasColumn('announcements', 'decline_reason')) {
                $table->text('decline_reason')->nullable()->after('status');
            }
        });

        // Add decline_reason to awareness_materials table
        Schema::table('awareness_materials', function (Blueprint $table) {
            if (!Schema::hasColumn('awareness_materials', 'decline_reason')) {
                $table->text('decline_reason')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            if (Schema::hasColumn('incidents', 'decline_reason')) {
                $table->dropColumn('decline_reason');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'deletion_reason')) {
                $table->dropColumn('deletion_reason');
            }
        });

        Schema::table('announcements', function (Blueprint $table) {
            if (Schema::hasColumn('announcements', 'decline_reason')) {
                $table->dropColumn('decline_reason');
            }
        });

        Schema::table('awareness_materials', function (Blueprint $table) {
            if (Schema::hasColumn('awareness_materials', 'decline_reason')) {
                $table->dropColumn('decline_reason');
            }
        });
    }
};
