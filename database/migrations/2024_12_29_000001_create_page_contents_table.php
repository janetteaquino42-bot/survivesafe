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
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page_key'); // e.g., 'home', 'about', 'contact'
            $table->string('section_key')->nullable(); // e.g., 'hero', 'mission', 'services'
            $table->text('title')->nullable();
            $table->longText('content')->nullable();
            $table->json('meta')->nullable(); // For flexible data storage
            $table->json('images')->nullable(); // Array of image paths
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['page_key', 'section_key']);
            $table->index(['page_key', 'section_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_contents');
    }
};
