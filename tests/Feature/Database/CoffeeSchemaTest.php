<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('database matches the Deklase Coffee catalog contract', function () {
    expect(Schema::hasTable('product_categories'))->toBeTrue()
        ->and(Schema::hasTable('stocks'))->toBeTrue()
        ->and(Schema::hasTable('collections'))->toBeFalse()
        ->and(Schema::hasTable('product_collections'))->toBeFalse()
        ->and(Schema::hasTable('product_reviews'))->toBeFalse()
        ->and(Schema::hasTable('stock_logs'))->toBeFalse();

    expect(Schema::hasColumns('products', ['origin', 'process', 'grind_type', 'tasting_notes', 'description', 'status']))->toBeTrue()
        ->and(Schema::hasColumn('products', 'regular_price'))->toBeFalse()
        ->and(Schema::hasColumn('products', 'category_id'))->toBeFalse()
        ->and(Schema::hasColumns('product_variants', ['net_weight', 'regular_price', 'sale_price', 'shipping_weight_gram']))->toBeTrue()
        ->and(Schema::hasColumn('product_variants', 'grind_type'))->toBeFalse()
        ->and(Schema::hasColumn('product_variants', 'tasting_notes'))->toBeFalse()
        ->and(Schema::hasColumn('product_variants', 'reserved_stock'))->toBeFalse();
});
