<?php

use App\Models\CustomerAddress;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user seeder creates complete customer accounts with default addresses', function () {
    $this->seed(UserSeeder::class);
    $this->seed(UserSeeder::class);

    expect(User::query()->count())->toBe(3)
        ->and(User::query()->where('role', 'customer')->count())->toBe(2)
        ->and(CustomerAddress::query()->count())->toBe(2)
        ->and(CustomerAddress::query()->where('is_default', true)->count())->toBe(2)
        ->and(CustomerAddress::query()->whereNotNull('latitude')->count())->toBe(2)
        ->and(CustomerAddress::query()->whereNotNull('longitude')->count())->toBe(2)
        ->and(CustomerAddress::query()->whereNotNull('full_address')->count())->toBe(2);
});
