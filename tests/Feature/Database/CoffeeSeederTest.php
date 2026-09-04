<?php

use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('database seeder creates a coffee catalog with Unsplash images', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Product::query()->count())->toBeGreaterThanOrEqual(4)
        ->and(Product::query()->where('status', 'active')->count())->toBe(Product::query()->count())
        ->and(Stock::query()->count())->toBeGreaterThanOrEqual(Product::query()->count())
        ->and(User::query()->where('role', 'admin')->exists())->toBeTrue()
        ->and(User::query()->where('email', 'customer@Deklasecoffee.test')->exists())->toBeTrue()
        ->and(Product::query()->whereHas('images', fn ($query) => $query->where('image_url', 'like', 'https://images.unsplash.com/%'))->count())->toBe(Product::query()->count());
});
