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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id('incident_id');
            $table->foreignId('reported_by')->constrained('users', 'user_id')->onDelete('cascade');
            $table->enum('type', ['fire', 'flood', 'earthquake', 'landslide']);
            $table->string('barangay');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->text('description')->nullable();
            $table->enum('severity', ['low', 'medium', 'high']);
            $table->enum('status', ['active', 'verified', 'resolved'])->default('active');
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
