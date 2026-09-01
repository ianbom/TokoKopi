<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('creates a coffee product with categories, variants, images, and stock', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $categories = collect([
        Category::query()->create(['name' => 'Coffee Beans', 'slug' => 'coffee-beans']),
        Category::query()->create(['name' => 'Single Origin', 'slug' => 'single-origin']),
    ]);

    $categoryIds = $categories->pluck('id')->all();
    $this->actingAs($admin)->post(route('admin.products.store'), productPayload($categoryIds))->assertRedirect();

    $product = Product::query()->where('slug', 'gayo-natural')->firstOrFail();
    expect($product->origin)->toBe('Aceh Gayo')
        ->and($product->status)->toBe('active')
        ->and($product->description)->toBe('<h2>Gayo Natural</h2><p>Kopi arabika dengan rasa buah tropis.</p>')
        ->and($product->categories->modelKeys())->toBe($categoryIds);

    $image = $product->images()->firstOrFail();
    expect($image->alt_text)->toBe('Gayo Natural');
    Storage::disk('public')->assertExists(str($image->image_url)->after('/storage/')->toString());
    $this->assertDatabaseHas('product_variants', ['product_id' => $product->id, 'sku' => 'GAYO-250-WB', 'net_weight' => '250g', 'grind_type' => 'whole_bean']);
    $this->assertDatabaseHas('stocks', ['quantity' => 20, 'low_stock_threshold' => 5]);
});

it('paginates products with the requested per-page value', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    foreach (range(1, 11) as $number) {
        Product::query()->create([
            'name' => "Coffee {$number}",
            'slug' => "coffee-{$number}",
            'status' => 'draft',
        ]);
    }

    $this->actingAs($admin)
        ->get(route('admin.products.index', ['per_page' => 10]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.per_page', 10)
            ->where('products.total', 11)
            ->has('products.data', 10));
});

function productPayload(array $categoryIds): array
{
    return [
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'sku' => 'GAYO', 'origin' => 'Aceh Gayo', 'process' => 'Natural', 'description' => '<h2>Gayo Natural</h2><p>Kopi arabika dengan rasa buah tropis.</p>', 'status' => 'active', 'category_ids' => $categoryIds,
        'images' => [['image' => UploadedFile::fake()->image('gayo-natural.jpg'), 'sort_order' => 0, 'is_primary' => true]],
        'variants' => [['sku' => 'GAYO-250-WB', 'net_weight' => '250g', 'grind_type' => 'whole_bean', 'regular_price' => 95000, 'sale_price' => 85000, 'shipping_weight_gram' => 300, 'image_url' => '', 'is_active' => true, 'stock_quantity' => 20, 'low_stock_threshold' => 5]],
    ];
}
