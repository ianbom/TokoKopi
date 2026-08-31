<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('returns coffee detail data from the catalog relations', function () {
    $category = Category::query()->create([
        'name' => 'Espresso',
        'slug' => 'espresso',
        'is_active' => true,
    ]);
    $product = Product::query()->create([
        'name' => 'Espresso No. 01',
        'slug' => 'espresso-no-01',
        'sku' => 'ESPRESSO-01',
        'origin' => 'Dataran Tinggi Gayo',
        'process' => 'washed',
        'description' => '<p>Manis, bersih, dan seimbang.</p>',
        'status' => 'active',
    ]);
    $product->categories()->attach($category);

    ProductImage::query()->create([
        'product_id' => $product->id,
        'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'alt_text' => 'Espresso No. 01 packshot',
        'sort_order' => 0,
        'is_primary' => true,
    ]);
    ProductImage::query()->create([
        'product_id' => $product->id,
        'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09f9b9f1f4a',
        'alt_text' => 'Espresso No. 01 brewing',
        'sort_order' => 1,
        'is_primary' => false,
    ]);
    $activeVariant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'ESPRESSO-01-200-WB',
        'net_weight' => '200gram',
        'grind_type' => 'whole_bean',
        'regular_price' => 85000,
        'shipping_weight_gram' => 250,
        'is_active' => true,
    ]);
    Stock::query()->create([
        'product_variant_id' => $activeVariant->id,
        'quantity' => 12,
    ]);
    ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'ESPRESSO-01-INACTIVE',
        'net_weight' => '200gram',
        'grind_type' => 'medium_fine',
        'regular_price' => 85000,
        'shipping_weight_gram' => 250,
        'is_active' => false,
    ]);

    $related = Product::query()->create([
        'name' => 'Toraja Midnight',
        'slug' => 'toraja-midnight',
        'sku' => 'TORAJA-01',
        'status' => 'active',
    ]);
    $related->categories()->attach($category);
    $unrelated = Product::query()->create([
        'name' => 'Cold Brew Black',
        'slug' => 'cold-brew-black',
        'sku' => 'COLD-BREW-01',
        'status' => 'active',
    ]);

    $this->get(route('detail', ['product' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/products/detail-product')
            ->where('product.id', $product->id)
            ->where('product.origin', 'Dataran Tinggi Gayo')
            ->where('product.process', 'washed')
            ->where('product.images.0.url', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')
            ->where('product.images.1.alt', 'Espresso No. 01 brewing')
            ->has('product.variants', 1)
            ->where('product.variants.0.id', $activeVariant->id)
            ->where('product.variants.0.available_stock', 12)
            ->has('relatedProducts', 1)
            ->where('relatedProducts.0.id', $related->id)
            ->missing('relatedProducts.1')
            ->where('recentProducts', []));

    expect($unrelated->id)->not->toBe($related->id);
});

it('adds an active coffee variant to the cart using stock relation data', function () {
    $user = User::factory()->create();
    $product = Product::query()->create([
        'name' => 'Kintamani Bloom',
        'slug' => 'kintamani-bloom',
        'sku' => 'KINTAMANI-01',
        'status' => 'active',
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'KINTAMANI-01-200-WB',
        'net_weight' => '200gram',
        'grind_type' => 'whole_bean',
        'regular_price' => 90000,
        'shipping_weight_gram' => 250,
        'is_active' => true,
    ]);
    Stock::query()->create([
        'product_variant_id' => $variant->id,
        'quantity' => 8,
    ]);

    $this->actingAs($user)
        ->post(route('cart.add-product-variant', $variant), ['quantity' => 2])
        ->assertRedirect();

    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 2,
        'price_snapshot' => 90000,
    ]);
});
