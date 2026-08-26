<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('sku', 100)->nullable()->unique();
            $table->string('origin', 180)->nullable();
            $table->string('process', 100)->nullable();
            $table->longText('description')->nullable();
            $table->string('status', 30)->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index('sku');
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_new_arrival');
            $table->index('is_best_seller');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
