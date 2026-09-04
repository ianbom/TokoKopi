<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Stock;
use Database\Seeders\TokopediaCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('imports a coffee catalog idempotently', function () {
    $path = tempnam(sys_get_temp_dir(), 'tokopedia-catalog-');
    file_put_contents($path, json_encode([
        'schema_version' => '2.0',
        'source' => ['marketplace' => 'tokopedia', 'store_url' => 'https://www.tokopedia.com/deklase-roastery/product', 'scraped_at' => now()->toIso8601String(), 'product_count' => 1],
        'products' => [[
            'source_id' => '1736029086044161055',
            'title' => 'Kopi Arabika Ijen Lestari Natural',
            'slug' => 'kopi-arabika-ijen-lestari-natural',
            'regular_price' => 80000,
            'sale_price' => 40000,
            'origin' => 'Ijen Bondowoso',
            'process' => 'Natural Classic',
            'description' => 'Specialty coffee beans.',
            'net_weight' => '200 gram',
            'grind_type' => 'whole_beans',
            'category_slugs' => ['coffee-beans', 'espresso'],
            'images' => [['url' => '/products/tokopedia/ijen.webp', 'alt' => 'Kopi Arabika Ijen Lestari Natural']],
        ]],
    ], JSON_THROW_ON_ERROR));
    config()->set('tokopedia.catalog_json', $path);

    try {
        $this->seed(TokopediaCatalogSeeder::class);
        $this->seed(TokopediaCatalogSeeder::class);
    } finally {
        unlink($path);
    }

    $product = Product::query()->firstOrFail();
    $variant = ProductVariant::query()->firstOrFail();

    expect(Category::query()->whereIn('slug', ['coffee-beans', 'espresso'])->count())->toBe(2)
        ->and(Product::query()->count())->toBe(1)
        ->and(ProductImage::query()->count())->toBe(1)
        ->and(ProductVariant::query()->count())->toBe(1)
        ->and($product->categories->pluck('slug')->sort()->values()->all())->toBe(['coffee-beans', 'espresso'])
        ->and($product->sku)->toBe('TKP-1736029086044161055')
        ->and($variant->regular_price)->toBe('80000.00')
        ->and($variant->sale_price)->toBe('40000.00')
        ->and($variant->shipping_weight_gram)->toBe(200)
        ->and(Stock::query()->where('product_variant_id', $variant->id)->value('quantity'))->toBe(0);
});
