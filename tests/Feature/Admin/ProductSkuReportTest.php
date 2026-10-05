<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Admin\ReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

it('reports products and variants without skus separately', function () {
    $user = User::factory()->create();
    $order = Order::query()->create([
        'user_id' => $user->id,
        'order_number' => 'ORDER-WITHOUT-SKUS',
        'customer_name' => $user->name,
        'customer_email' => $user->email,
        'customer_phone' => '081234567890',
        'payment_status' => 'paid',
        'paid_at' => now(),
    ]);

    foreach (['gayo-natural', 'gayo-washed'] as $slug) {
        $product = Product::query()->create(['name' => 'Gayo', 'slug' => $slug, 'grind_type' => 'whole_bean']);

        foreach (range(1, 2) as $number) {
            $variant = $product->variants()->create(['net_weight' => '200gram', 'regular_price' => 80000]);
            $order->items()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'variant_sku' => $variant->sku,
                'net_weight' => $variant->net_weight,
                'grind_type' => $product->grind_type,
                'price' => 80000,
                'quantity' => $number,
                'subtotal' => 80000 * $number,
                'shipping_weight_gram' => 250,
            ]);
        }
    }

    $report = app(ReportService::class)->data(Request::create('/admin/reports/products'), 'products')['report'];

    expect($report['tables'][0]['rows'])->toHaveCount(2)
        ->and($report['tables'][1]['rows'])->toHaveCount(4)
        ->and(array_column($report['tables'][0]['rows'], 'product_sku'))->toBe(['-', '-'])
        ->and(array_sum(array_column($report['tables'][1]['rows'], 'quantity')))->toBe(6);
});
