<?php

use App\Models\Product;
use Database\Seeders\PublicProductsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds one active coffee product for every local product image', function () {
    $this->seed(PublicProductsSeeder::class);

    $products = collect(PublicProductsSeeder::products());

    expect(Product::query()->count())->toBe($products->count())
        ->and(Product::query()->where('status', 'active')->count())->toBe(22)
        ->and(Product::query()->where('name', 'Bali Kala Patra')->exists())->toBeTrue()
        ->and(Product::query()->where('name', 'Requiem Bali Kala Patra')->exists())->toBeTrue();

    foreach ($products as $data) {
        $product = Product::query()
            ->with(['images', 'variants.stock'])
            ->where('slug', $data['slug'])
            ->firstOrFail();

        $imageUrl = '/products/'.rawurlencode($data['image']);

        expect($product->images)->toHaveCount(1)
            ->and($product->images->sole()->image_url)->toBe($imageUrl)
            ->and($product->images->sole()->is_primary)->toBeTrue()
            ->and(file_exists(public_path(urldecode(ltrim($imageUrl, '/')))))->toBeTrue()
            ->and($product->variants)->toHaveCount(1)
            ->and($product->variants->sole()->is_active)->toBeTrue()
            ->and($product->variants->sole()->stock?->quantity)->toBe(24);
    }
});
