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

it('filters the coffee catalog only by database categories', function () {
    $this->seed(CoffeeCatalogSeeder::class);

    $this->get(route('list', ['category' => 'ready-to-drink']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters', ['category' => 'ready-to-drink'])
            ->has('products.data', 3)
            ->missing('options.grindTypes')
            ->missing('options.processes')
            ->missing('options.priceRanges')
            ->missing('options.sortOptions'));
});

it('ignores retired catalog filters and keeps the default order', function (array $query) {
    $this->seed(CoffeeCatalogSeeder::class);
    $ids = Product::query()->where('status', 'active')
        ->orderByDesc('is_featured')->orderByDesc('is_new_arrival')
        ->latest()->orderBy('products.id')->pluck('id')->all();

    $this->get(route('list', $query))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters', ['category' => ''])
            ->where('products.data', fn ($products) => collect($products)->pluck('id')->all() === $ids));
})->with([
    'grind' => [['grind_type' => 'missing']],
    'process' => [['process' => 'missing']],
    'price' => [['price' => 'under_100000']],
    'type' => [['type' => 'best_seller']],
    'sort' => [['sort' => 'name']],
]);

it('provides active database categories alphabetically and excludes deleted categories', function () {
    Category::query()->create(['name' => 'Zebra Coffee', 'slug' => 'zebra', 'is_active' => true]);
    Category::query()->create(['name' => 'Artisan Coffee', 'slug' => 'artisan', 'is_active' => true]);
    Category::query()->create(['name' => 'Hidden Coffee', 'slug' => 'hidden', 'is_active' => false]);
    Category::query()->create(['name' => 'Deleted Coffee', 'slug' => 'deleted', 'is_active' => true])->delete();

    $this->get(route('list'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('options.categories', 2)
            ->where('options.categories.0.name', 'Artisan Coffee')
            ->where('options.categories.0.slug', 'artisan')
            ->where('options.categories.1.name', 'Zebra Coffee'));
});

it('returns an empty catalog for categories without products', function () {
    Category::query()->create(['name' => 'Empty Coffee', 'slug' => 'empty', 'is_active' => true]);

    $this->get(route('list', ['category' => 'empty']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.category', 'empty')
            ->has('products.data', 0));
});

it('paginates the coffee catalog by twenty products', function () {
    $this->seed(CoffeeCatalogSeeder::class);
    $category = Category::query()->create(['name' => 'Extra Coffee', 'slug' => 'extra', 'is_active' => true]);

    for ($index = 1; $index <= 21; $index++) {
        $product = Product::query()->create([
            'name' => "Extra Coffee {$index}",
            'slug' => "extra-coffee-{$index}",
            'sku' => "EXTRA-{$index}",
            'grind_type' => 'whole_bean',
            'status' => 'active',
        ]);
        $product->categories()->attach($category);
        $variant = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => "EXTRA-{$index}-250",
            'net_weight' => '250g',
            'length' => 4, 'width' => 5, 'height' => 2,
            'regular_price' => 90000,
        ]);
        Stock::query()->create([
            'product_variant_id' => $variant->id,
            'quantity' => 12,
        ]);
    }

    $this->get(route('list', ['page' => 2, 'category' => 'extra', 'search' => 'Extra', 'process' => 'missing']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.per_page', 20)
            ->where('products.current_page', 2)
            ->where('products.last_page', 2)
            ->where('products.total', 21)
            ->where('products.prev_page_url', function ($url) {
                parse_str(parse_url($url, PHP_URL_QUERY), $query);

                return $query['category'] === 'extra' && $query['search'] === 'Extra'
                    && $query['page'] === '1' && ! array_key_exists('process', $query);
            })
            ->has('products.data', 1));
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
        'grind_type' => 'whole_bean',
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
        'length' => 4, 'width' => 5, 'height' => 2,
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
