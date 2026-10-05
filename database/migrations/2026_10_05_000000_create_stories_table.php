<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('slug', 180)->unique();
            $table->string('category', 100);
            $table->string('author_name', 100)->default('Deklase');
            $table->text('excerpt');
            $table->longText('body_html');
            $table->string('cover_image_url');
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
