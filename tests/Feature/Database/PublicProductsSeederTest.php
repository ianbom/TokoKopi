<?php

use App\Models\Product;
use App\Models\User;
use Database\Seeders\CoffeeCatalogSeeder;
use Database\Seeders\PublicProductsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('seeds one active coffee product for every local product image', function () {
    $this->seed(PublicProductsSeeder::class);
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
            ->and($product->grind_type)->toBe('Deklase Roastery')
            ->and($product->variants->sole()->grind_type)->toBe('whole_bean')
            ->and($product->variants->sole()->length)->toBe('4.00')
            ->and($product->variants->sole()->width)->toBe('5.00')
            ->and($product->variants->sole()->height)->toBe('2.00')
            ->and($product->tasting_notes)->toBe('Manis dan seimbang')
            ->and($product->variants->sole()->stock?->quantity)->toBe(24);
    }
});

it('seeds coffee catalog producers and exposes them in the admin product list', function () {
    $this->seed(CoffeeCatalogSeeder::class);
    $this->seed(CoffeeCatalogSeeder::class);

    expect(Product::query()->pluck('grind_type')->unique()->values()->all())->toBe(['Deklase Roastery']);

    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $this->actingAs($admin)->get(route('admin.products.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.data.0.grind_type', 'Deklase Roastery'));
});
