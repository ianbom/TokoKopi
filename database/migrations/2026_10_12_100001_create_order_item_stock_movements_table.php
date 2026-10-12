<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_item_stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('quantity');
            $table->unsignedInteger('stock_before');
            $table->unsignedInteger('stock_after');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_item_stock_movements');
    }
};
