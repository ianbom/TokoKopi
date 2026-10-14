<?php

use App\Enums\ShippingStatus;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\Admin\OrderManagementService;
use App\Services\Admin\ShipmentManagementService;
use App\Services\AdminDashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    Http::preventStrayRequests();
    Mail::fake();
    config(['services.biteship.api_key' => 'test-key', 'services.biteship.webhook_secret' => 'status-test-secret']);
    $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $customer = User::factory()->create();
    $product = Product::query()->create(['name' => 'Gayo Natural', 'slug' => 'gayo-status', 'status' => 'active']);
    $variant = $product->variants()->create(['regular_price' => 100000, 'shipping_weight_gram' => 300, 'length' => 4, 'width' => 5, 'height' => 2]);
    $this->stock = $variant->stock()->create(['quantity' => 5]);
    $this->order = Order::query()->create([
        'user_id' => $customer->id, 'order_number' => 'ORD-BITESHIP-STATUS', 'customer_name' => $customer->name,
        'customer_email' => $customer->email, 'customer_phone' => '081234567890', 'subtotal' => 100000, 'grand_total' => 116000,
        'shipping_cost' => 16000, 'payment_status' => 'paid', 'paid_at' => now(),
        'order_status' => 'shipment_created', 'shipping_status' => 'confirmed',
    ]);
    $this->order->items()->create([
        'product_id' => $product->id, 'product_variant_id' => $variant->id, 'product_name' => $product->name,
        'price' => 100000, 'quantity' => 1, 'subtotal' => 100000, 'shipping_weight_gram' => 300, 'length' => 4, 'width' => 5, 'height' => 2,
    ]);
    $this->shipment = $this->order->shipment()->create([
        'biteship_order_id' => 'biteship-status-order', 'courier_company' => 'jne', 'courier_type' => 'reg',
        'shipping_cost' => 16000, 'shipping_status' => 'confirmed',
    ]);
});

test('all documented biteship order and tracking statuses retain their meaning', function (string $provider, string $status, string $orderStatus) {
    $payload = ['id' => $this->shipment->biteship_order_id, 'status' => $provider];
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, $payload);
    $service->applyBiteshipPayload($this->shipment, $payload);
    expect($this->shipment->refresh()->shipping_status)->toBe($status)
        ->and($this->order->refresh()->shipping_status)->toBe($status)
        ->and($this->order->order_status)->toBe($orderStatus)
        ->and($this->order->payment_status)->toBe('paid')
        ->and($this->stock->refresh()->quantity)->toBe(5);
    $this->assertDatabaseHas('shipment_trackings', ['shipment_id' => $this->shipment->id, 'status' => $status]);
    $this->assertDatabaseCount('shipment_trackings', 1);
})->with([
    ['confirmed', 'confirmed', 'shipment_created'], ['scheduled', 'scheduled', 'shipment_created'],
    ['allocated', 'allocated', 'shipment_created'], ['picking_up', 'picking_up', 'shipment_created'],
    ['picked', 'picked', 'shipped'], ['cancelled', 'cancelled', 'shipment_failed'],
    ['on_hold', 'on_hold', 'shipment_problem'], ['in_transit', 'in_transit', 'shipped'],
    ['dropping_off', 'dropping_off', 'shipped'], ['return_in_transit', 'return_in_transit', 'shipment_problem'],
    ['returned', 'returned', 'shipment_failed'], ['rejected', 'rejected', 'shipment_failed'],
    ['disposed', 'disposed', 'shipment_failed'], ['courier_not_found', 'courier_not_found', 'shipment_failed'],
    ['delivered', 'delivered', 'delivered'],
    ['pickingUp', 'picking_up', 'shipment_created'], ['inTransit', 'in_transit', 'shipped'],
    ['droppingOff', 'dropping_off', 'shipped'], ['returnInTransit', 'return_in_transit', 'shipment_problem'],
    ['onHold', 'on_hold', 'shipment_problem'], ['courierNotFound', 'courier_not_found', 'shipment_failed'],
    ['IN_TRANSIT', 'in_transit', 'shipped'],
]);

test('courier not found webhook is applied once without changing payment or stock', function (string $status) {
    $payload = ['event' => 'order.status', 'order_id' => $this->shipment->biteship_order_id, 'status' => $status];
    $this->withHeader('X-Biteship-Webhook-Secret', 'status-test-secret')
        ->postJson(route('shipments.biteship.webhook'), $payload)->assertSuccessful();
    $this->postJson(route('shipments.biteship.webhook'), $payload)->assertSuccessful()->assertJsonPath('duplicate', true);
    expect($this->shipment->refresh()->shipping_status)->toBe('courier_not_found')
        ->and($this->order->refresh()->order_status)->toBe('shipment_failed')
        ->and($this->order->payment_status)->toBe('paid')
        ->and($this->stock->refresh()->quantity)->toBe(5);
    $this->assertDatabaseCount('shipment_trackings', 1);
})->with(['courier_not_found', 'courierNotFound']);

test('admin refresh can repair a previously unknown status without deleting its audit', function () {
    $payload = ['id' => $this->shipment->biteship_order_id, 'status' => 'courier_not_found'];
    $unknown = $this->shipment->trackings()->create([
        'status' => 'confirmed', 'description' => 'Status provider belum dikenali; state tidak diubah.',
        'payload_hash' => hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR)), 'raw_payload' => $payload,
    ]);
    Http::fake(['api.biteship.com/v1/orders/*' => Http::response($payload)]);
    $service = app(ShipmentManagementService::class);
    $service->refreshTracking($this->shipment);
    $service->refreshTracking($this->shipment);
    expect($this->shipment->refresh()->shipping_status)->toBe('courier_not_found')
        ->and($unknown->refresh()->description)->toBe('Status provider belum dikenali; state tidak diubah.');
    $this->assertDatabaseCount('shipment_trackings', 2);
});

test('unknown statuses and stale events cannot overwrite shipment state', function () {
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'droppingOff', 'updated_at' => now()->toISOString()]);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'delivered', 'updated_at' => now()->subHour()->toISOString()]);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'new_unknown_status']);
    expect($this->shipment->refresh()->shipping_status)->toBe('dropping_off');
    $this->assertDatabaseCount('shipment_trackings', 2);
});

test('expanded progression does not regress or reopen terminal shipments', function () {
    $service = app(ShipmentManagementService::class);
    foreach (['scheduled', 'allocated', 'pickingUp', 'picked', 'inTransit', 'droppingOff', 'pickingUp', 'delivered', 'courierNotFound'] as $status) {
        $service->applyBiteshipPayload($this->shipment, ['status' => $status]);
    }
    expect($this->shipment->refresh()->shipping_status)->toBe('delivered');
    $this->assertDatabaseCount('shipment_trackings', 7);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'returnInTransit']);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'returned']);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'inTransit']);
    expect($this->shipment->refresh()->shipping_status)->toBe('returned');
});

test('new terminal failures cannot be reopened by subsequent provider events', function (string $status) {
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, ['status' => $status]);
    $service->applyBiteshipPayload($this->shipment, ['status' => 'delivered']);
    expect($this->shipment->refresh()->shipping_status)->toBe($status)
        ->and($this->order->refresh()->order_status)->toBe('shipment_failed')
        ->and($this->order->payment_status)->toBe('paid')
        ->and($this->stock->refresh()->quantity)->toBe(5);
    $this->assertDatabaseCount('shipment_trackings', 1);
})->with(['courier_not_found', 'rejected']);

test('manual status options include new stages and require reasons for new failures', function () {
    $this->actingAs($this->admin);
    foreach (['scheduled', 'allocated', 'picking_up', 'picked', 'in_transit', 'dropping_off'] as $status) {
        expect(app(ShipmentManagementService::class)->allowedStatuses($this->shipment->refresh()))->toContain($status);
        $this->post(route('admin.shipments.status', $this->shipment), ['shipping_status' => $status])->assertSessionHasNoErrors();
    }
    $this->post(route('admin.shipments.status', $this->shipment), ['shipping_status' => 'rejected'])->assertSessionHasErrors('description');
    $this->post(route('admin.shipments.status', $this->shipment), ['shipping_status' => 'rejected', 'description' => 'Paket ditolak kurir.'])->assertSessionHasNoErrors();
    expect($this->shipment->refresh()->shipping_status)->toBe('rejected');
});

test('new failures appear as shipping issues in detail and dashboard', function (string $status, string $label) {
    app(ShipmentManagementService::class)->applyBiteshipPayload($this->shipment, ['status' => $status]);
    $detail = app(OrderManagementService::class)->detailData($this->order);
    expect($detail['order']['shipping_issue']['label'])->toBe($label)
        ->and(app(ShipmentManagementService::class)->indexData(Request::create('/'))['stats']['issues'])->toBe(1)
        ->and(ShippingStatus::issueValues())->toContain($status);
    $dashboard = app(AdminDashboardService::class)->overview(Request::create('/'));
    expect(collect($dashboard['shippingSummary'])->firstWhere('label', 'Shipping Issue')['value'])->toBe(1)
        ->and($dashboard['attentionOrders']->first()['action'])->toBe('Check Shipping');
})->with([['courier_not_found', 'Kurir tidak ditemukan'], ['rejected', 'Pengiriman ditolak']]);

test('booking keeps newly supported initial statuses', function (string $status, string $orderStatus) {
    $this->order->update(['order_status' => 'ready_to_ship']);
    $this->shipment->update(['shipping_status' => 'not_created', 'biteship_order_id' => null]);
    OrderAddress::query()->create([
        'order_id' => $this->order->id, 'recipient_name' => 'Pelanggan', 'recipient_phone' => '081234567890',
        'full_address' => 'Jl. Kopi No. 1', 'postal_code' => '40135', 'city' => 'Bandung', 'province' => 'Jawa Barat',
        'district' => 'Coblong', 'latitude' => -6.89, 'longitude' => 107.61,
    ]);
    foreach (['store_name' => 'Deklase', 'store_phone' => '081234567890', 'store_address' => 'Jl. Toko No. 1', 'store_postal_code' => '60111', 'store_latitude' => '-6.2', 'store_longitude' => '106.8'] as $key => $value) {
        SiteSetting::query()->create(compact('key', 'value'));
    }
    Http::fake(['api.biteship.com/v1/orders' => Http::response(['id' => 'created-status', 'status' => $status])]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasNoErrors();
    expect($this->shipment->refresh()->shipping_status)->toBe($status)
        ->and($this->order->refresh()->order_status)->toBe($orderStatus);
})->with([['scheduled', 'shipment_created'], ['courier_not_found', 'shipment_failed']]);
