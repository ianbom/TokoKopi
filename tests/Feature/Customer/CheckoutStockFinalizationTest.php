<?php

use App\Actions\Payments\ApplyMidtransPaymentStatusAction;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Support\Str;

test('settlement deducts order stock exactly once without reservation columns', function () {
    $user = User::factory()->create();
    $product = Product::query()->create([
        'name' => 'Espresso No. 01',
        'slug' => 'espresso-'.Str::lower(Str::random(8)),
        'sku' => 'COFFEE-'.Str::upper(Str::random(8)),
        'origin' => 'Gayo',
        'process' => 'washed',
        'description' => 'Balanced coffee.',
        'status' => 'active',
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'VARIANT-'.Str::upper(Str::random(8)),
        'net_weight' => '250gram',
        'regular_price' => 90000,
        'shipping_weight_gram' => 300,
        'is_active' => true,
    ]);
    $stock = Stock::query()->create([
        'product_variant_id' => $variant->id,
        'quantity' => 2,
        'low_stock_threshold' => 1,
    ]);
    $order = Order::query()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-'.Str::upper(Str::random(10)),
        'checkout_idempotency_key' => (string) Str::uuid(),
        'customer_name' => $user->name,
        'customer_email' => $user->email,
        'customer_phone' => '081234567890',
        'subtotal' => 90000,
        'grand_total' => 90000,
    ]);
    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'product_name' => $product->name,
        'product_sku' => $product->sku,
        'variant_sku' => $variant->sku,
        'net_weight' => $variant->net_weight,
        'price' => 90000,
        'quantity' => 1,
        'subtotal' => 90000,
        'shipping_weight_gram' => 300,
    ]);
    $payment = Payment::query()->create([
        'order_id' => $order->id,
        'midtrans_order_id' => $order->order_number,
        'gross_amount' => 90000,
        'transaction_status' => 'pending',
    ]);

    app(ApplyMidtransPaymentStatusAction::class)->execute($payment, 'settlement');

    expect($stock->refresh()->quantity)->toBe(1)
        ->and($order->refresh()->payment_status)->toBe('paid');

    app(ApplyMidtransPaymentStatusAction::class)->execute($payment->refresh(), 'settlement');

    expect($stock->refresh()->quantity)->toBe(1);
});

test('settlement rejects combined quantities for the same variant when stock is insufficient', function () {
    $user = User::factory()->create();
    $product = Product::query()->create([
        'name' => 'Filter Coffee',
        'slug' => 'filter-'.Str::lower(Str::random(8)),
        'sku' => 'COFFEE-'.Str::upper(Str::random(8)),
        'origin' => 'Flores',
        'process' => 'natural',
        'description' => 'Fruit-forward coffee.',
        'status' => 'active',
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'VARIANT-'.Str::upper(Str::random(8)),
        'net_weight' => '250gram',
        'regular_price' => 90000,
        'shipping_weight_gram' => 300,
        'is_active' => true,
    ]);
    $stock = Stock::query()->create([
        'product_variant_id' => $variant->id,
        'quantity' => 3,
        'low_stock_threshold' => 1,
    ]);
    $order = Order::query()->create([
        'user_id' => $user->id,
        'order_number' => 'ORD-'.Str::upper(Str::random(10)),
        'checkout_idempotency_key' => (string) Str::uuid(),
        'customer_name' => $user->name,
        'customer_email' => $user->email,
        'customer_phone' => '081234567890',
        'subtotal' => 360000,
        'grand_total' => 360000,
    ]);

    foreach ([2, 2] as $quantity) {
        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant->id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'variant_sku' => $variant->sku,
            'net_weight' => $variant->net_weight,
            'price' => 90000,
            'quantity' => $quantity,
            'subtotal' => 90000 * $quantity,
            'shipping_weight_gram' => 300,
        ]);
    }

    $payment = Payment::query()->create([
        'order_id' => $order->id,
        'midtrans_order_id' => $order->order_number,
        'gross_amount' => 360000,
        'transaction_status' => 'pending',
    ]);

    app(ApplyMidtransPaymentStatusAction::class)->execute($payment, 'settlement');

    expect($stock->refresh()->quantity)->toBe(3)
        ->and($order->refresh()->payment_status)->toBe('manual_review')
        ->and($payment->refresh()->transaction_status)->toBe('manual_review');
});
