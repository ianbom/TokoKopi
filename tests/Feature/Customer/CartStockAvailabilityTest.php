<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Stock;
use App\Models\User;
use App\Models\Voucher;
use App\Services\Integrations\BiteshipService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

it('returns coffee cart metadata and marks excessive quantity unavailable', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCoffeeCartProduct(stock: 2);

    createCoffeeCartItem($user, $product, $variant, quantity: 3);

    $this->actingAs($user)
        ->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/cart/my-cart')
            ->where('cartItems.0.quantity', 3)
            ->where('cartItems.0.available_stock', 2)
            ->where('cartItems.0.is_available', false)
            ->where('cartItems.0.net_weight', '200gram')
            ->where('cartItems.0.grind_type', 'whole_bean')
            ->where('cartItems.0.image', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')
            ->where('cartItems.0.variant.sku', $variant->sku));
});

it('returns an available coffee cart item', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCoffeeCartProduct(stock: 4);
    createCoffeeCartItem($user, $product, $variant, quantity: 2);

    $this->actingAs($user)
        ->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/cart/my-cart')
            ->where('cartItems.0.available_stock', 4)
            ->where('cartItems.0.is_available', true)
            ->where('summary.item_count', 2)
            ->where('summary.subtotal', 170000));
});

it('updates coffee cart quantity using stock relation data', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCoffeeCartProduct(stock: 4);
    $item = createCoffeeCartItem($user, $product, $variant, quantity: 1);

    $this->actingAs($user)
        ->patch(route('cart.items.update', $item), ['quantity' => 3])
        ->assertRedirect();

    expect($item->refresh()->quantity)->toBe(3);
});

it('redirects checkout to cart when cart is empty', function () {
    $user = User::factory()->create();
    createCoffeeCartAddress($user);

    $this->actingAs($user)
        ->get(route('checkout'))
        ->assertRedirect(route('cart'))
        ->assertSessionHas('warning');
});

it('renders checkout with coffee variant metadata and stock availability', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCoffeeCartProduct(stock: 2);

    createCoffeeCartAddress($user);
    createCoffeeCartItem($user, $product, $variant, quantity: 1);

    $this->actingAs($user)
        ->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/checkout/checkout')
            ->where('cartItems.0.quantity', 1)
            ->where('cartItems.0.available_stock', 2)
            ->where('cartItems.0.is_available', true)
            ->where('cartItems.0.net_weight', '200gram')
            ->where('cartItems.0.grind_type', 'whole_bean'));
});

it('refreshes shipping bindings and totals after applying and removing a voucher', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCoffeeCartProduct(stock: 2);
    createCoffeeCartItem($user, $product, $variant, quantity: 1);
    $address = createCoffeeCartAddress($user);
    $address->update(['latitude' => '-6.8915000', 'longitude' => '107.6107000']);
    Voucher::query()->create([
        'code' => 'KOPI10',
        'name' => 'Kopi 10%',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'is_active' => true,
    ]);
    $rate = [
        'id' => 'jne-reg',
        'courier_company' => 'jne',
        'courier_type' => 'reg',
        'courier_service_name' => 'Reguler',
        'description' => 'Layanan reguler',
        'duration' => '2 - 3 days',
        'price' => 16000,
    ];
    $this->mock(BiteshipService::class, function (MockInterface $mock) use ($rate): void {
        $mock->shouldReceive('shippingRates')->times(3)->andReturn([$rate]);
    });
    $this->actingAs($user);
    $addressPayload = ['customer_address_id' => $address->id];
    $ratePayload = ['shipping_rate_id' => $rate['id']];

    $this->postJson(route('checkout.shipping-rates'), $addressPayload)->assertSuccessful();
    $this->postJson(route('checkout.shipping-rate'), $ratePayload)->assertSuccessful();
    $originalHash = session('checkout.cart_hash');

    $this->postJson(route('checkout.voucher.apply'), ['voucher_code' => 'KOPI10'])
        ->assertSuccessful()
        ->assertJsonPath('voucher.discount', 8500)
        ->assertSessionMissing('checkout.selected_rate_binding');
    $this->postJson(route('checkout.shipping-rate'), $ratePayload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('shipping_rate_id');
    $this->postJson(route('checkout.shipping-rates'), $addressPayload)->assertSuccessful();
    $voucherHash = session('checkout.cart_hash');
    expect($voucherHash)->not->toBe($originalHash);
    $this->postJson(route('checkout.shipping-rate'), $ratePayload)
        ->assertSuccessful()
        ->assertSessionHas('checkout.selected_rate_binding.cart_hash', $voucherHash);
    $this->get(route('checkout'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.shipping', 16000)
            ->where('summary.discount', 8500)
            ->where('summary.total', 92500));

    $this->deleteJson(route('checkout.voucher.remove'))
        ->assertSuccessful()
        ->assertSessionMissing('checkout.selected_rate_binding');
    $this->postJson(route('checkout.shipping-rates'), $addressPayload)->assertSuccessful();
    $this->postJson(route('checkout.shipping-rate'), $ratePayload)
        ->assertSuccessful()
        ->assertSessionHas('checkout.selected_rate_binding.cart_hash', $originalHash);
    $this->get(route('checkout'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('appliedVoucher', null)
            ->where('summary.shipping', 16000)
            ->where('summary.discount', 0)
            ->where('summary.total', 101000));
});

/**
 * @return array{0: Product, 1: ProductVariant}
 */
function createCoffeeCartProduct(int $stock, string $name = 'Espresso No. 01'): array
{
    $suffix = Str::lower(Str::random(6));
    $product = Product::query()->create([
        'name' => $name,
        'slug' => Str::slug($name).'-'.$suffix,
        'sku' => 'COFFEE-'.Str::upper(Str::random(8)),
        'origin' => 'Dataran Tinggi Gayo',
        'process' => 'washed',
        'description' => '<p>Manis dan seimbang.</p>',
        'status' => 'active',
        'is_featured' => true,
    ]);
    ProductImage::query()->create([
        'product_id' => $product->id,
        'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'alt_text' => $product->name,
        'sort_order' => 0,
        'is_primary' => true,
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'VARIANT-'.Str::upper(Str::random(8)),
        'net_weight' => '200gram',
        'grind_type' => 'whole_bean',
        'regular_price' => 85000,
        'sale_price' => null,
        'shipping_weight_gram' => 250,
        'is_active' => true,
    ]);
    Stock::query()->create([
        'product_variant_id' => $variant->id,
        'quantity' => $stock,
        'low_stock_threshold' => 2,
    ]);

    return [$product, $variant];
}

function createCoffeeCartItem(User $user, Product $product, ProductVariant $variant, int $quantity): CartItem
{
    $cart = Cart::query()->firstOrCreate(['user_id' => $user->id]);

    return CartItem::query()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => $quantity,
        'price_snapshot' => 85000,
        'variant_name_snapshot' => '200gram / whole bean',
    ]);
}

function createCoffeeCartAddress(User $user): CustomerAddress
{
    return CustomerAddress::query()->create([
        'user_id' => $user->id,
        'recipient_name' => 'Siti Aisyah',
        'recipient_phone' => '081234567890',
        'label' => 'Home',
        'province' => 'Jawa Barat',
        'city' => 'Bandung',
        'district' => 'Coblong',
        'subdistrict' => 'Dago',
        'postal_code' => '40135',
        'full_address' => 'Jl. Dipatiukur No. 10',
        'biteship_area_id' => 'IDNP6IDNC148IDND631IDZ40135',
        'is_default' => true,
    ]);
}
