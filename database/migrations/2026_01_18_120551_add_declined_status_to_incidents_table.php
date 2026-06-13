<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the enum to include 'declined'
        DB::statement("ALTER TABLE `incidents` MODIFY COLUMN `status` ENUM('active', 'verified', 'resolved', 'declined') NOT NULL DEFAULT 'active'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'declined' from enum
        DB::statement("ALTER TABLE `incidents` MODIFY COLUMN `status` ENUM('active', 'verified', 'resolved') NOT NULL DEFAULT 'active'");
    }
};
