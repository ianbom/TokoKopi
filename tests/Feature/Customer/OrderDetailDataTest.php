<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows the latest coffee product snapshot on the order detail page', function () {
    $user = User::factory()->create();
    $order = Order::query()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-'.Str::upper(Str::random(10)),
        'checkout_idempotency_key' => (string) Str::uuid(),
        'customer_name' => $user->name,
        'customer_email' => $user->email,
        'customer_phone' => '081234567890',
        'subtotal' => 170000,
        'grand_total' => 170000,
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_name' => 'Aceh Gayo',
        'product_sku' => 'ACEH-GAYO',
        'variant_sku' => 'ACEH-GAYO-250-WB',
        'net_weight' => '250 gram',
        'grind_type' => 'whole_bean',
        'price' => 85000,
        'quantity' => 2,
        'subtotal' => 170000,
        'shipping_weight_gram' => 300,
        'product_image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    ]);

    $this->actingAs($user)
        ->get(route('order.detail', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/order/detail-order')
            ->where('order.items.0.product_name', 'Aceh Gayo')
            ->where('order.items.0.product_sku', 'ACEH-GAYO')
            ->where('order.items.0.variant_sku', 'ACEH-GAYO-250-WB')
            ->where('order.items.0.net_weight', '250 gram')
            ->where('order.items.0.grind_type', 'whole_bean')
            ->where('order.items.0.shipping_weight_gram', 300)
            ->where('order.items.0.price', 85000)
            ->where('order.items.0.quantity', 2)
            ->where('order.items.0.subtotal', 170000)
            ->missing('order.items.0.color_name')
            ->missing('order.items.0.size')
            ->missing('order.items.0.weight'));
});
