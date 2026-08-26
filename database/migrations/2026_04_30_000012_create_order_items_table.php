<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name', 200);
            $table->string('product_sku', 100)->nullable();
            $table->string('variant_sku', 100)->nullable();
            $table->string('net_weight', 100)->nullable();
            $table->string('grind_type', 50)->nullable();
            $table->decimal('price', 15, 2);
            $table->integer('quantity');
            $table->decimal('subtotal', 15, 2);
            $table->integer('shipping_weight_gram')->default(0);
            $table->string('product_image_url')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('product_id');
            $table->index('product_variant_id');
            $table->index('variant_sku');
            $table->index('grind_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
