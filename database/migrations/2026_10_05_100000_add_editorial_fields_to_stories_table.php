<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->text('pull_quote')->nullable();
            $table->string('quote_attribution', 120)->nullable();
            $table->string('cover_caption', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn(['pull_quote', 'quote_attribution', 'cover_caption']);
        });
    }
};
