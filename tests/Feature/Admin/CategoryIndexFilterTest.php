<?php

use App\Models\Category;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('filters categories by search and status', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    Category::query()->create([
        'name' => 'Coffee Beans',
        'slug' => 'coffee-beans',
        'is_active' => true,
    ]);
    $inactive = Category::query()->create([
        'name' => 'Ready To Drink',
        'slug' => 'ready-to-drink',
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.categories.index', [
            'search' => 'ready-to-drink',
            'status' => 'inactive',
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->where('filters.search', 'ready-to-drink')
            ->where('filters.status', 'inactive')
            ->has('categories.data', 1)
            ->where('categories.data.0.id', $inactive->id));
});

it('applies the requested category page size', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    foreach (range(1, 11) as $number) {
        Category::query()->create([
            'name' => "Coffee {$number}",
            'slug' => "coffee-{$number}",
            'is_active' => true,
        ]);
    }

    $this->actingAs($admin)
        ->get(route('admin.categories.index', [
            'status' => 'active',
            'per_page' => 10,
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.status', 'active')
            ->where('categories.per_page', 10)
            ->where('categories.total', 11)
            ->has('categories.data', 10));
});
