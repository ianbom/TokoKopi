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
        ->and($product->grind_type)->toBe('Kopi Klasik Roastery')
        ->and($product->tasting_notes)->toBe('Cokelat, jeruk, gula aren')
        ->and($product->status)->toBe('active')
        ->and($product->description)->toBe('<h2>Gayo Natural</h2><p>Kopi arabika dengan rasa buah tropis.</p>')
        ->and($product->categories->modelKeys())->toBe($categoryIds);

    $image = $product->images()->firstOrFail();
    expect($image->alt_text)->toBe('Gayo Natural');
    Storage::disk('public')->assertExists(str($image->image_url)->after('/storage/')->toString());
    $this->assertDatabaseHas('product_variants', ['product_id' => $product->id, 'sku' => 'GAYO-250-WB', 'net_weight' => '250g']);
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
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'sku' => 'GAYO', 'origin' => 'Aceh Gayo', 'process' => 'Natural', 'grind_type' => 'Kopi Klasik Roastery', 'tasting_notes' => 'Cokelat, jeruk, gula aren', 'description' => '<h2>Gayo Natural</h2><p>Kopi arabika dengan rasa buah tropis.</p>', 'status' => 'active', 'category_ids' => $categoryIds,
        'images' => [['image' => UploadedFile::fake()->image('gayo-natural.jpg'), 'sort_order' => 0, 'is_primary' => true]],
        'variants' => [['sku' => 'GAYO-250-WB', 'net_weight' => '250g', 'regular_price' => 95000, 'sale_price' => 85000, 'shipping_weight_gram' => 300, 'image_url' => '', 'is_active' => true, 'stock_quantity' => 20, 'low_stock_threshold' => 5]],
    ];
}

it('creates and duplicates a product with multiple variants without skus', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $payload = productPayload([]);
    $payload['sku'] = '';
    $payload['variants'][0]['sku'] = '';
    $payload['variants'][] = $payload['variants'][0];
    unset($payload['variants'][1]['sku']);

    $this->actingAs($admin)->post(route('admin.products.store'), $payload)->assertSessionHasNoErrors()->assertRedirect();

    $product = Product::query()->where('slug', 'gayo-natural')->firstOrFail();
    expect($product->sku)->toBeNull()
        ->and($product->variants)->toHaveCount(2)
        ->and($product->variants->pluck('sku')->all())->toBe([null, null]);

    $this->post(route('admin.products.duplicate', $product))->assertRedirect();
    $copy = Product::query()->where('name', 'Gayo Natural Copy')->firstOrFail();
    expect($copy->sku)->toBeNull()
        ->and($copy->grind_type)->toBe('Kopi Klasik Roastery')
        ->and($copy->tasting_notes)->toBe('Cokelat, jeruk, gula aren')
        ->and($copy->variants->pluck('sku')->all())->toBe([null, null]);
});

it('rejects duplicate variant skus in the product form', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $payload = productPayload([]);
    $payload['variants'][] = $payload['variants'][0];

    $this->actingAs($admin)->post(route('admin.products.store'), $payload)->assertSessionHasErrors('variants.0.sku');
    expect(Product::query()->count())->toBe(0);
});

it('returns clear product validation messages', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    Product::query()->create(['name' => 'Existing Coffee', 'slug' => 'existing-coffee', 'sku' => 'EXISTING-SKU', 'status' => 'draft']);
    $payload = productPayload([]);
    $payload['name'] = '';
    $payload['slug'] = 'existing-coffee';
    $payload['sku'] = 'EXISTING-SKU';
    $payload['status'] = 'draft';
    $payload['images'][0]['image'] = UploadedFile::fake()->image('oversized.jpg')->size(4097);

    $this->actingAs($admin)->post(route('admin.products.store'), $payload)->assertSessionHasErrors([
        'name' => 'Nama produk wajib diisi.',
        'slug' => 'Slug sudah digunakan produk lain.',
        'sku' => 'SKU produk sudah digunakan produk lain.',
        'images.0.image' => 'Ukuran gambar produk maksimal 4 MB.',
    ]);
});
