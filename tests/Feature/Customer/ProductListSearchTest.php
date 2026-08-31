<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Stock;
use Database\Seeders\CoffeeCatalogSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('renders an empty coffee catalog without a collection banner', function () {
    $this->get(route('list'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/products/list-product')
            ->has('products.data', 0));
});

it('seeds exactly twelve active coffee products', function () {
    $this->seed(CoffeeCatalogSeeder::class);

    expect(Product::query()->whereIn('slug', [
        'espresso-no-01',
        'kintamani-bloom',
        'flores-senja',
        'cold-brew-concentrate',
        'toraja-midnight',
        'kerinci-honey',
        'bali-natural-gold',
        'papua-valley',
        'javanese-cocoa',
        'sumatra-dark-fuse',
        'cold-brew-black',
        'cold-brew-latte',
    ])->count())->toBe(12);
});

it('filters the coffee catalog through the displayed header controls', function () {
    $this->seed(CoffeeCatalogSeeder::class);

    $this->get(route('list', ['category' => 'ready-to-drink']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.category', 'ready-to-drink')
            ->has('products.data', 3));

    $this->get(route('list', ['grind_type' => 'whole_bean']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.grind_type', 'whole_bean')
            ->has('products.data', 9));

    $this->get(route('list', ['process' => 'honey']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.process', 'honey')
            ->has('products.data', 2));

    $this->get(route('list', ['price' => 'under_100000']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.price', 'under_100000')
            ->has('products.data', 7));

    $this->get(route('list', ['sort' => 'price_high']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'price_high')
            ->where('products.data.0.title', 'Papua Valley')
            ->has('options.grindTypes')
            ->has('options.processes'));
});

it('renders active coffee products from the database for the grid', function () {
    $category = Category::query()->create([
        'name' => 'Single Origin',
        'slug' => 'single-origin',
        'is_active' => true,
    ]);
    $product = Product::query()->create([
        'name' => 'Aceh Gayo',
        'slug' => 'aceh-gayo',
        'sku' => 'ACEH-GAYO-250',
        'status' => 'active',
    ]);
    $product->categories()->attach($category);
    ProductImage::query()->create([
        'product_id' => $product->id,
        'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'alt_text' => 'Aceh Gayo coffee beans',
        'is_primary' => true,
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'ACEH-GAYO-250-WHOLE',
        'net_weight' => '250g',
        'grind_type' => 'whole_bean',
        'regular_price' => 125000,
    ]);
    Stock::query()->create([
        'product_variant_id' => $variant->id,
        'quantity' => 12,
    ]);

    $this->get(route('list', ['search' => 'Aceh']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/products/list-product')
            ->has('products.data', 1)
            ->where('products.data.0.title', 'Aceh Gayo')
            ->where('products.data.0.image_url', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')
            ->where('products.data.0.price', 125000));
});
