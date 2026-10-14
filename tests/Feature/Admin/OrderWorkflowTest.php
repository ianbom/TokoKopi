<?php

use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\Admin\ShipmentManagementService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Mail::fake();
    Http::preventStrayRequests();
    config(['services.biteship.api_key' => 'test-key', 'inertia.ssr.enabled' => false]);
    $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $customer = User::factory()->create();
    $this->order = Order::query()->create([
        'user_id' => $customer->id,
        'order_number' => 'ORD-WORKFLOW',
        'customer_name' => $customer->name,
        'customer_email' => $customer->email,
        'customer_phone' => '081234567890',
        'subtotal' => 100000,
        'shipping_cost' => 16000,
        'grand_total' => 116000,
        'payment_status' => 'paid',
        'order_status' => 'paid',
        'shipping_status' => 'not_created',
        'paid_at' => now(),
    ]);
    OrderAddress::query()->create([
        'order_id' => $this->order->id,
        'recipient_name' => $customer->name,
        'recipient_phone' => '081234567890',
        'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong',
        'full_address' => 'Jl. Dago No. 10', 'postal_code' => '40135',
        'latitude' => -6.894, 'longitude' => 107.61,
    ]);
    OrderItem::query()->create([
        'order_id' => $this->order->id, 'product_name' => 'Gayo Natural',
        'net_weight' => '250g', 'grind_type' => 'whole_bean',
        'price' => 100000, 'quantity' => 1, 'subtotal' => 100000, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 300,
    ]);
    $this->shipment = Shipment::query()->create([
        'order_id' => $this->order->id, 'shipping_provider' => 'biteship',
        'courier_company' => 'jne', 'courier_type' => 'reg',
        'courier_service_name' => 'JNE Reguler', 'shipping_cost' => 16000,
        'shipping_status' => 'not_created',
    ]);
    foreach ([
        'store_name' => 'Deklase', 'store_phone' => '081234567890',
        'store_address' => 'Jl. Toko No. 1', 'store_postal_code' => '60111',
        'store_latitude' => '-6.2', 'store_longitude' => '106.8',
    ] as $key => $value) {
        SiteSetting::query()->create(['key' => $key, 'value' => $value, 'type' => 'string']);
    }
});

test('order detail supplies authoritative workflow and coffee snapshots', function () {
    $this->actingAs($this->admin)->get(route('admin.orders.show', $this->order))
        ->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('order.allowedStatuses', ['processing'])
        ->where('order.can_create_shipment', false)
        ->where('order.booking_uncertain', false)
        ->where('order.shipping_issue', null)
        ->has('order.status_history')
        ->where('order.items.0.net_weight', '250g')
        ->where('order.items.0.grind_type', 'whole_bean')
        ->has('order.items.0.stock_movements', 0));
});

test('admin status transitions are validated and recorded once', function () {
    $this->actingAs($this->admin)->post(route('admin.orders.status', $this->order), ['status' => 'ready_to_ship'])
        ->assertSessionHasErrors('status');
    $this->post(route('admin.orders.status', $this->order), ['status' => 'processing'])->assertSessionHasNoErrors();
    $this->post(route('admin.orders.status', $this->order), ['status' => 'processing'])->assertSessionHasNoErrors();
    $this->assertDatabaseCount('order_status_histories', 2);
    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $this->order->id, 'previous_status' => 'paid', 'status' => 'processing', 'actor_id' => $this->admin->id,
    ]);
});

test('booking requires packing and uses the saved courier rather than client overrides', function () {
    Http::fake(['api.biteship.com/v1/orders' => Http::response(['id' => 'biteship-1', 'status' => 'confirmed', 'price' => 20000])]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors('shipment');
    Http::assertNothingSent();
    $this->order->update(['order_status' => 'ready_to_ship']);
    $this->post(route('admin.orders.shipments.store', $this->order), [
        'source' => 'order_detail', 'courier_company' => 'jnt', 'courier_type' => 'ez',
    ])->assertRedirect(route('admin.orders.show', $this->order))->assertSessionHasNoErrors();
    Http::assertSent(fn ($request) => $request['courier_company'] === 'jne' && $request['courier_type'] === 'reg'
        && $request['origin_coordinate']['latitude'] === -6.2 && $request['destination_coordinate']['longitude'] === 107.61
        && ! isset($request['origin_latitude']) && $request['items'][0]['category'] === 'food_and_drink');
    $this->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasErrors('shipment');
    Http::assertSentCount(1);
    expect($this->order->refresh()->order_status)->toBe('shipment_created')
        ->and((float) $this->order->shipping_cost)->toBe(16000.0)
        ->and((float) $this->order->grand_total)->toBe(116000.0)
        ->and((float) $this->shipment->refresh()->shipping_cost)->toBe(20000.0);
});

test('terminal courier issues fail the order without changing payment or totals', function (string $status) {
    $this->order->update(['order_status' => 'shipped']);
    $this->shipment->update(['shipping_status' => 'in_transit', 'biteship_order_id' => 'biteship-1']);
    $payload = ['id' => 'biteship-1', 'status' => $status, 'message' => 'Kendala kurir'];
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, $payload);
    $service->applyBiteshipPayload($this->shipment, $payload);
    expect($this->order->refresh()->order_status)->toBe('shipment_failed')
        ->and($this->order->payment_status)->toBe('paid')
        ->and($this->order->shipping_status)->toBe($status)
        ->and($this->order->grand_total)->toBe('116000.00');
    $this->assertDatabaseCount('shipment_trackings', 1);
    $this->assertDatabaseCount('order_status_histories', 3);
    $this->actingAs($this->admin)->get(route('admin.orders.show', $this->order))
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.allowedStatuses', ['shipment_failed'])
            ->where('order.shipping_issue.status', $status)
            ->where('order.shipping_issue.reason', 'Kendala kurir'));
})->with(['failed', 'cancelled', 'lost', 'returned']);

test('failure reasons are additional notes rather than fake status transitions', function () {
    $this->order->update(['order_status' => 'shipment_failed', 'shipping_status' => 'failed']);
    $this->shipment->update(['shipping_status' => 'failed', 'biteship_order_id' => 'biteship-1']);
    $this->actingAs($this->admin)->post(route('admin.orders.status', $this->order), ['status' => 'shipment_failed'])
        ->assertSessionHasErrors('reason');
    $this->post(route('admin.orders.status', $this->order), ['status' => 'shipment_failed', 'reason' => str_repeat('a', 1001)])
        ->assertSessionHasErrors('reason');
    $this->post(route('admin.orders.status', $this->order), ['status' => 'shipment_failed', 'reason' => '  Kurir memastikan paket hilang.  '])
        ->assertSessionHasNoErrors();
    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $this->order->id, 'event_type' => 'failure_note', 'reason' => 'Kurir memastikan paket hilang.',
    ]);
    expect($this->order->refresh()->payment_status)->toBe('paid');
});

test('temporary courier problems do not allow failure notes', function () {
    $this->order->update(['order_status' => 'shipment_problem', 'shipping_status' => 'problem']);
    $this->shipment->update(['shipping_status' => 'problem', 'biteship_order_id' => 'biteship-1']);
    $this->actingAs($this->admin)->post(route('admin.orders.status', $this->order), ['status' => 'shipment_failed', 'reason' => 'Masih diperiksa'])
        ->assertSessionHasErrors('status');
});

test('uncertain bookings block duplicate requests', function () {
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake(fn () => throw new ConnectionException('Timed out.'));
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors('shipment');
    expect($this->shipment->refresh()->booking_uncertain)->toBeTrue();
    Http::fake(['api.biteship.com/v1/orders' => Http::response(['id' => 'duplicate', 'status' => 'confirmed'])]);
    $this->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasErrors('shipment');
    Http::assertNothingSent();
});

test('definitive booking rejections remain safely retryable', function () {
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake(['api.biteship.com/v1/orders' => Http::sequence()
        ->push(['error' => 'Invalid courier'], 422)
        ->push(['id' => 'retry-1', 'status' => 'confirmed'])]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors('shipment');
    expect($this->shipment->refresh()->booking_uncertain)->toBeFalse();
    $this->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasNoErrors();
});

test('legacy orders do not fabricate histories or movements', function () {
    $this->order->statusHistory()->delete();
    $this->actingAs($this->admin)->get(route('admin.orders.show', $this->order))
        ->assertInertia(fn (Assert $page) => $page
            ->has('order.status_history', 0)
            ->has('order.items.0.stock_movements', 0)
            ->where('order.paid_at', $this->order->paid_at->toIso8601String()));
});

test('ambiguous provider responses never automatically retry bookings', function (array $body, int $status) {
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake(['api.biteship.com/v1/orders' => Http::response($body, $status)]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors('shipment');
    expect($this->shipment->refresh()->booking_uncertain)->toBeTrue();
    $this->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors('shipment');
    Http::assertSentCount(1);
})->with([
    'missing booking ID' => [['status' => 'confirmed'], 200],
    'server failure' => [['error' => 'Unavailable'], 500],
    'request timeout' => [['error' => 'Timeout'], 408],
]);

test('missing destination coordinates prevent provider dispatch', function () {
    $this->order->update(['order_status' => 'ready_to_ship']);
    $this->order->address()->update(['latitude' => null]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasErrors();
    Http::assertNothingSent();
    expect($this->shipment->refresh()->booking_uncertain)->toBeFalse();
});

test('initial terminal booking response fails the order immediately', function () {
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake(['api.biteship.com/v1/orders' => Http::response(['id' => 'failed-booking', 'status' => 'cancelled'])]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])
        ->assertSessionHasNoErrors();
    expect($this->order->refresh()->order_status)->toBe('shipment_failed')
        ->and($this->order->payment_status)->toBe('paid');
});

test('tracking preserves final orders and treats problems as temporary', function () {
    $this->shipment->update(['biteship_order_id' => 'tracking-1']);
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, ['id' => 'tracking-1', 'status' => 'problem']);
    expect($this->order->refresh()->order_status)->toBe('shipment_problem')
        ->and($this->order->payment_status)->toBe('paid');
    $this->order->update(['order_status' => 'completed']);
    $service->applyBiteshipPayload($this->shipment, ['id' => 'tracking-1', 'status' => 'in_transit']);
    expect($this->order->refresh()->order_status)->toBe('completed');
});

test('courier transit statuses advance the real workflow', function (string $providerStatus, string $shippingStatus, string $orderStatus) {
    $this->shipment->update(['biteship_order_id' => 'transit-1']);
    app(ShipmentManagementService::class)->applyBiteshipPayload($this->shipment, ['id' => 'transit-1', 'status' => $providerStatus]);
    expect($this->shipment->refresh()->shipping_status)->toBe($shippingStatus)
        ->and($this->order->refresh()->order_status)->toBe($orderStatus);
})->with([
    'allocated' => ['allocated', 'allocated', 'paid'],
    'picked up' => ['picked_up', 'picked', 'shipped'],
    'in transit' => ['in_transit', 'in_transit', 'shipped'],
]);

test('late temporary events do not regress delivered shipments', function () {
    $this->shipment->update(['biteship_order_id' => 'delivered-1']);
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($this->shipment, ['id' => 'delivered-1', 'status' => 'delivered']);
    $service->applyBiteshipPayload($this->shipment, ['id' => 'delivered-1', 'status' => 'problem']);
    expect($this->shipment->refresh()->shipping_status)->toBe('delivered')
        ->and($this->order->refresh()->order_status)->toBe('delivered');
    $this->assertDatabaseCount('shipment_trackings', 1);
});

test('paid orders cannot be cancelled or completed before delivery', function () {
    $this->actingAs($this->admin)->post(route('admin.orders.status', $this->order), ['status' => 'cancelled'])
        ->assertSessionHasErrors('status');
    $this->post(route('admin.orders.status', $this->order), ['status' => 'completed'])
        ->assertSessionHasErrors('status');
    $this->order->update(['order_status' => 'delivered']);
    $this->post(route('admin.orders.status', $this->order), ['status' => 'completed'])->assertSessionHasErrors('status');
    $this->order->update(['shipping_status' => 'delivered']);
    $this->shipment->update(['shipping_status' => 'delivered']);
    $this->post(route('admin.orders.status', $this->order), ['status' => 'completed'])->assertSessionHasNoErrors();
    expect($this->order->refresh()->completed_at)->not->toBeNull();
});

test('non admins cannot mutate orders', function () {
    $this->actingAs(User::factory()->create(['role' => 'customer']))
        ->post(route('admin.orders.status', $this->order), ['status' => 'processing'])->assertForbidden();
});

test('booking uses stored unit dimensions rather than edited catalog dimensions', function () {
    $product = Product::query()->create(['name' => 'Gayo', 'slug' => 'gayo-snapshot', 'status' => 'active']);
    $variant = $product->variants()->create(['regular_price' => 50000, 'length' => 99, 'width' => 98, 'height' => 97]);
    $this->order->items()->firstOrFail()->update(['product_id' => $product->id, 'product_variant_id' => $variant->id, 'quantity' => 2, 'shipping_weight_gram' => 600]);
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake(['api.biteship.com/v1/orders' => Http::response(['id' => 'snapshot-order', 'status' => 'confirmed'])]);
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasNoErrors();
    Http::assertSent(fn ($request) => (float) $request['items'][0]['length'] === 4.0
        && (float) $request['items'][0]['width'] === 5.0 && (float) $request['items'][0]['height'] === 2.0
        && $request['items'][0]['quantity'] === 2 && $request['items'][0]['weight'] === 300);
});

test('incomplete or invalid snapshot dimensions prevent booking', function ($size) {
    $this->order->items()->firstOrFail()->update(['height' => $size]);
    $this->order->update(['order_status' => 'ready_to_ship']);
    Http::fake();
    $this->actingAs($this->admin)->post(route('admin.orders.shipments.store', $this->order), ['source' => 'order_detail'])->assertSessionHasErrors('shipment');
    Http::assertNothingSent();
    expect($this->shipment->refresh()->booking_uncertain)->toBeFalse();
})->with([null, 0, -1]);
