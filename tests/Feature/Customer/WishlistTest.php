<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Stock;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests to login before storing wishlist products', function () {
    $product = createWishlistProduct(['status' => 'published']);

    $this->post(route('wishlist.store', $product))
        ->assertRedirect(route('login'));

    $this->assertDatabaseMissing('wishlists', [
        'product_id' => $product->id,
    ]);
});

it('adds a wishlist product through json without redirecting the product list', function () {
    $user = User::factory()->create();
    $product = createWishlistProduct(['status' => 'published']);

    $this->actingAs($user)
        ->postJson(route('wishlist.store', $product))
        ->assertSuccessful();

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

it('removes a wishlist product through json without redirecting the product list', function () {
    $user = User::factory()->create();
    $product = createWishlistProduct(['status' => 'published']);
    Wishlist::query()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $this->actingAs($user)
        ->deleteJson(route('wishlist.products.destroy', $product))
        ->assertSuccessful();

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

it('does not show archived products on the customer wishlist page', function () {
    $user = User::factory()->create();
    $published = createWishlistProduct([
        'name' => 'Published Product',
        'status' => 'published',
    ]);
    $archived = createWishlistProduct([
        'name' => 'Archived Product',
        'status' => 'archived',
    ]);

    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $published->id]);
    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $archived->id]);

    $this->actingAs($user)
        ->get(route('my-wishlist'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/wishlist/my-wishlist')
            ->has('wishlistItems', 1)
            ->where('wishlistItems.0.title', 'Published Product')
            ->where('summary.item_count', 1));
});

it('retains sold out products in customer wishlist with is_available false', function () {
    $user = User::factory()->create();
    $inStock = createWishlistProduct(['status' => 'active', 'name' => 'In Stock Coffee']);
    $variantInStock = ProductVariant::query()->create([
        'product_id' => $inStock->id,
        'sku' => 'SKU-IN-STOCK',
        'net_weight' => '200g',
        'regular_price' => 100000,
        'length' => 10,
        'width' => 10,
        'height' => 10,
        'shipping_weight_gram' => 200,
        'is_active' => true,
    ]);
    Stock::query()->create([
        'product_variant_id' => $variantInStock->id,
        'quantity' => 5,
    ]);

    $soldOut = createWishlistProduct(['status' => 'active', 'name' => 'Sold Out Coffee']);
    $variantSoldOut = ProductVariant::query()->create([
        'product_id' => $soldOut->id,
        'sku' => 'SKU-SOLD-OUT',
        'net_weight' => '200g',
        'regular_price' => 100000,
        'length' => 10,
        'width' => 10,
        'height' => 10,
        'shipping_weight_gram' => 200,
        'is_active' => true,
    ]);
    Stock::query()->create([
        'product_variant_id' => $variantSoldOut->id,
        'quantity' => 0,
    ]);

    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $inStock->id]);
    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $soldOut->id]);

    $this->actingAs($user)
        ->get(route('my-wishlist'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/wishlist/my-wishlist')
            ->has('wishlistItems', 2)
            ->where('wishlistItems.0.title', 'Sold Out Coffee')
            ->where('wishlistItems.0.is_available', false)
            ->where('wishlistItems.0.available_stock', 0)
            ->where('wishlistItems.1.title', 'In Stock Coffee')
            ->where('wishlistItems.1.is_available', true)
            ->where('wishlistItems.1.available_stock', 5));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createWishlistProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Product '.Str::random(8));

    return Product::query()->create([
        ...[
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'regular_price' => 100000,
            'status' => 'published',
        ],
        ...$overrides,
    ]);
}
