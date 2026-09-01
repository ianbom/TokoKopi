<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('provides coffee product options to the variant form', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Hydro Pack', 'slug' => 'hydro-pack', 'sku' => 'HYDRO', 'status' => 'draft']);

    $this->actingAs($admin)->get(route('admin.product-variants.create', ['product_id' => $product->id]))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('admin/product-variants/form')->where('selectedProductId', $product->id)->has('products', 1)->where('products.0.id', $product->id)->where('products.0.name', $product->name));
});

it('adjusts variant stock without a stock log table', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Toraja', 'slug' => 'toraja', 'status' => 'draft']);
    $variant = ProductVariant::query()->create(['product_id' => $product->id, 'sku' => 'TOR-250', 'regular_price' => 80000, 'shipping_weight_gram' => 300]);
    $variant->stock()->create(['quantity' => 4, 'low_stock_threshold' => 2]);

    $this->actingAs($admin)->post(route('admin.product-variants.stock-adjustment.update', $variant), ['type' => 'in', 'quantity' => 6])->assertRedirect(route('admin.stock.index'));

    expect($variant->fresh()->stock->quantity)->toBe(10);
});

it('creates a product variant from an uploaded image', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Toraja Sapan', 'slug' => 'toraja-sapan', 'status' => 'draft']);

    $this->actingAs($admin)->post(route('admin.product-variants.store'), [
        'product_id' => $product->id,
        'sku' => 'TORAJA-250-WB',
        'net_weight' => '250gram',
        'grind_type' => 'whole_bean',
        'regular_price' => 95000,
        'sale_price' => null,
        'shipping_weight_gram' => 300,
        'image' => UploadedFile::fake()->image('toraja-250.jpg'),
        'is_active' => true,
        'stock_quantity' => 12,
        'low_stock_threshold' => 3,
    ])->assertRedirect();

    $variant = ProductVariant::query()->where('sku', 'TORAJA-250-WB')->firstOrFail();
    Storage::disk('public')->assertExists(str($variant->image_url)->after('/storage/')->toString());
});
