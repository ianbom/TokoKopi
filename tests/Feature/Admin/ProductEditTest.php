<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates coffee product categories and variant stock', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $oldCategory = Category::query()->create(['name' => 'Old', 'slug' => 'old']);
    $newCategory = Category::query()->create(['name' => 'Espresso', 'slug' => 'espresso']);
    $product = Product::query()->create(['name' => 'Java', 'slug' => 'java', 'status' => 'draft']);
    $product->categories()->sync([$oldCategory->id]);
    $variant = ProductVariant::query()->create(['product_id' => $product->id, 'sku' => 'JAVA-250', 'regular_price' => 70000, 'shipping_weight_gram' => 300, 'is_active' => true]);
    $variant->stock()->create(['quantity' => 2, 'low_stock_threshold' => 5]);

    $this->actingAs($admin)->put(route('admin.products.update', $product), [
        'name' => 'Java Espresso', 'slug' => 'java-espresso', 'sku' => 'JAVA', 'origin' => 'Java', 'process' => 'Washed', 'description' => '', 'status' => 'draft', 'category_ids' => [$newCategory->id], 'images' => [],
        'variants' => [['id' => $variant->id, 'sku' => 'JAVA-250', 'net_weight' => '250g', 'grind_type' => 'fine', 'regular_price' => 70000, 'sale_price' => null, 'shipping_weight_gram' => 300, 'image_url' => '', 'is_active' => true, 'stock_quantity' => 11, 'low_stock_threshold' => 3]],
    ])->assertRedirect();

    expect($product->fresh()->name)->toBe('Java Espresso');
    expect($product->fresh()->categories->modelKeys())->toBe([$newCategory->id]);
    expect($variant->fresh()->stock->quantity)->toBe(11)->and($variant->fresh()->stock->low_stock_threshold)->toBe(3);
});
