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
        Schema::create('awareness_materials', function (Blueprint $table) {
            $table->id('material_id');
            $table->string('title');
            $table->text('description');
            $table->string('file_path')->nullable(); // For uploaded files (PDF, Word, PPT, images)
            $table->enum('file_type', ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'image', 'video_link'])->nullable();
            $table->string('video_link')->nullable(); // For YouTube or other video links
            $table->enum('status', ['pending', 'approved', 'declined'])->default('pending');
            $table->text('decline_reason')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('created_by')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('awareness_materials');
    }
};
