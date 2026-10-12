<?php

use App\Actions\Payments\ApplyMidtransPaymentStatusAction;
use App\Actions\Payments\CancelMidtransPaymentAction;
use App\Actions\Payments\SyncExpiredMidtransPaymentsAction;
use App\Actions\Payments\SyncMidtransPaymentAction;
use App\Actions\Shipments\ProcessBiteshipWebhookAction;
use App\Enums\ShippingStatus;
use App\Exceptions\UncertainSnapCreationException;
use App\Http\Requests\Admin\ProductVariantRequest;
use App\Models\BiteshipWebhookLog;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shipment;
use App\Models\SiteSetting;
use App\Models\Stock;
use App\Models\User;
use App\Models\Voucher;
use App\Services\Admin\OrderManagementService;
use App\Services\Admin\ShipmentManagementService;
use App\Services\Customer\ProductBrowsingService;
use App\Services\Integrations\BiteshipService;
use App\Services\Integrations\MidtransService;
use App\Services\Settings\SiteSettingService;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

function recoveryCheckout(array $snapResponse = ['token' => 'checkout-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], int $snapStatus = 201): array
{
    $payment = recoveryPayment();
    $user = $payment->order->user;
    $item = $payment->order->items->first();
    $cart = Cart::query()->create(['user_id' => $user->id]);
    CartItem::query()->create(['cart_id' => $cart->id, 'product_id' => $item->product_id, 'product_variant_id' => $item->product_variant_id, 'quantity' => 2, 'price_snapshot' => 1.49]);
    $address = CustomerAddress::query()->create([
        'user_id' => $user->id, 'recipient_name' => $user->name, 'recipient_phone' => '081234567890',
        'province' => 'Jawa Barat', 'city' => 'Bandung', 'district' => 'Coblong', 'postal_code' => '40123',
        'full_address' => 'Jl. Kopi No. 1', 'latitude' => 0, 'longitude' => 0, 'is_default' => true,
    ]);
    $voucher = Voucher::query()->create(['code' => 'KOPI', 'name' => 'Kopi', 'discount_type' => 'fixed', 'discount_value' => 0.01, 'is_active' => true]);
    foreach (['store_postal_code' => '60111', 'store_latitude' => '0', 'store_longitude' => '0'] as $key => $value) {
        SiteSetting::query()->create(compact('key', 'value'));
    }
    config(['services.biteship.api_key' => 'test-key']);
    Http::fake([
        '*/v1/rates/couriers' => Http::response(['pricing' => [['company' => 'jne', 'type' => 'reg', 'price' => 0]]]),
        '*/snap/v1/transactions' => Http::response($snapResponse, $snapStatus),
    ]);

    return [$user, $address, $voucher, ProductVariant::query()->findOrFail($item->product_variant_id)];
}

function recoveryCheckoutPayload($test, User $user, CustomerAddress $address): array
{
    $test->actingAs($user);
    $test->postJson(route('checkout.voucher.apply'), ['voucher_code' => 'KOPI'])->assertSuccessful();
    $rateId = $test->postJson(route('checkout.shipping-rates'), ['customer_address_id' => $address->id])->assertSuccessful()->json('rates.0.id');
    $test->postJson(route('checkout.shipping-rate'), ['shipping_rate_id' => $rateId])->assertSuccessful()->assertJsonPath('summary.total', 3);

    return ['customer_address_id' => $address->id, 'shipping_rate_id' => $rateId, 'idempotency_key' => (string) Str::uuid(), 'no_return_refund_agreed' => true];
}

function recoveryPayment(array $attributes = []): Payment
{
    $user = User::factory()->create();
    $product = Product::query()->create(['name' => 'Kopi Gayo', 'slug' => 'gayo-'.Str::uuid(), 'status' => 'active']);
    $variant = ProductVariant::query()->create(['product_id' => $product->id, 'regular_price' => 1.49, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 300, 'is_active' => true]);
    Stock::query()->create(['product_variant_id' => $variant->id, 'quantity' => 10]);
    $order = Order::query()->create([
        'user_id' => $user->id, 'order_number' => 'REC-'.Str::uuid(), 'customer_name' => $user->name,
        'customer_email' => $user->email, 'customer_phone' => '081234567890', 'subtotal' => 2.98, 'grand_total' => 3,
        ...$attributes,
    ]);
    $order->items()->create(['product_id' => $product->id, 'product_variant_id' => $variant->id, 'product_name' => $product->name, 'price' => 1.49, 'quantity' => 2, 'subtotal' => 2.98, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 600]);

    return Payment::query()->create(['order_id' => $order->id, 'midtrans_order_id' => $order->order_number, 'gross_amount' => $order->grand_total, 'transaction_status' => 'pending']);
}

beforeEach(function () {
    config(['services.midtrans.server_key' => 'test-server-key']);
    Http::preventStrayRequests();
});

test('snap item sum equals integer gross for fractional catalog prices', function () {
    $payment = recoveryPayment();
    Http::fake(['*' => Http::response(['token' => 'snap-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'])]);
    app(MidtransService::class)->createSnapTransaction($payment->order);
    Http::assertSent(fn ($request) => collect($request['item_details'])->sum(fn ($item) => $item['price'] * $item['quantity']) === $request['transaction_details']['gross_amount']);
});

test('amount matcher rejects malformed or fractional provider amounts', function () {
    $payment = recoveryPayment();
    $service = app(MidtransService::class);
    expect($service->amountMatches('3.00', $payment))->toBeTrue()
        ->and($service->amountMatches('3garbage', $payment))->toBeFalse()
        ->and($service->amountMatches('3.001', $payment))->toBeFalse()
        ->and($service->amountMatches(INF, $payment))->toBeFalse();
});

test('sync rejection survives rollback and leaves payment unchanged', function () {
    $payment = recoveryPayment();
    Http::fake(['*' => Http::response(['order_id' => $payment->midtrans_order_id, 'transaction_status' => 'settlement', 'gross_amount' => '4.00', 'status_code' => '200'])]);
    expect(fn () => app(SyncMidtransPaymentAction::class)->execute($payment))->toThrow(ValidationException::class);
    expect($payment->refresh()->transaction_status)->toBe('pending');
    $this->assertDatabaseHas('payment_logs', ['payment_id' => $payment->id, 'event_type' => 'rejected_amount_mismatch']);
});

test('refund cannot regress to settlement or pending', function () {
    $payment = recoveryPayment();
    $action = app(ApplyMidtransPaymentStatusAction::class);
    $action->execute($payment, 'settlement');
    $action->execute($payment, 'refund');
    $action->execute($payment, 'pending');
    $action->execute($payment, 'settlement');
    expect($payment->order->refresh()->payment_status)->toBe('refunded');
    $this->assertDatabaseCount('order_item_stock_movements', 1);
});

test('explicit null canonical setting does not resurrect a legacy alias', function () {
    SiteSetting::query()->create(['key' => 'store_phone', 'value' => null]);
    SiteSetting::query()->create(['key' => 'shipper_phone', 'value' => '0811111111']);
    expect(app(SiteSettingService::class)->first(['store_phone', 'shipper_phone'], 'fallback'))->toBeNull();
});

test('malformed snap success is uncertain', function (array $response) {
    Http::fake(['*' => Http::response($response)]);
    expect(fn () => app(MidtransService::class)->createSnapTransaction(recoveryPayment()->order))->toThrow(UncertainSnapCreationException::class);
})->with([['response' => []], ['response' => ['token' => '', 'redirect_url' => 'https://example.test']], ['response' => ['token' => 'token', 'redirect_url' => 'http://example.test']]]);

test('unselected payment method requires verified snap cancellation', function () {
    $payment = recoveryPayment();
    $payment->update(['midtrans_snap_token' => 'known-token']);
    Http::fake([
        '*/status' => Http::response(['status_code' => '404'], 404),
        '*/known-token/cancel' => Http::response(['canceled_at' => now()->toISOString()]),
    ]);
    app(CancelMidtransPaymentAction::class)->execute($payment->order);
    expect($payment->order->refresh()->payment_status)->toBe('cancelled');
    Http::assertSentCount(2);
});

test('unknown snap or failed status lookup cannot cancel locally', function (array $response, int $status) {
    $payment = recoveryPayment();
    Http::fake(['*' => Http::response($response, $status)]);
    expect(fn () => app(CancelMidtransPaymentAction::class)->execute($payment->order))->toThrow(ValidationException::class);
    expect($payment->order->refresh()->payment_status)->toBe('pending');
})->with([
    'no known token' => [['status_code' => '404'], 404],
    'unconfirmed http not found' => [[], 404],
    'server failure' => [[], 500],
]);

test('final payment event is reconciled before cancel is rejected', function () {
    $payment = recoveryPayment();
    Http::fake(['*' => Http::response(['order_id' => $payment->midtrans_order_id, 'status_code' => '200', 'transaction_status' => 'settlement', 'gross_amount' => '3.00'])]);
    expect(fn () => app(CancelMidtransPaymentAction::class)->execute($payment->order))->toThrow(ValidationException::class);
    expect($payment->order->refresh()->payment_status)->toBe('paid');
    Http::assertSentCount(1);
});

test('late paid closed order requires review without deducting stock', function () {
    $payment = recoveryPayment(['payment_status' => 'cancelled', 'order_status' => 'cancelled']);
    app(ApplyMidtransPaymentStatusAction::class)->execute($payment, 'settlement');
    expect($payment->refresh()->failure_reason)->not->toBeNull()
        ->and($payment->order->payment_status)->toBe('manual_review');
    $this->assertDatabaseCount('order_item_stock_movements', 0);
});

test('rate prices preserve explicit zero and reject invalid values', function () {
    config(['services.biteship.api_key' => 'test-key']);
    foreach (['store_postal_code' => '60111', 'store_latitude' => '0', 'store_longitude' => '0'] as $key => $value) {
        SiteSetting::query()->create(compact('key', 'value'));
    }
    Http::fake(['*' => Http::response(['pricing' => array_map(fn ($price) => ['company' => 'jne', 'type' => 'reg', ...$price], [[], ['price' => 'invalid'], ['price' => -1], ['price' => 0], ['shipping_fee' => 16000]])])]);
    $rates = app(BiteshipService::class)->shippingRates(['postal_code' => '40123', 'latitude' => 0, 'longitude' => 0], []);
    expect(array_column($rates, 'price'))->toBe([0.0, 16000.0]);
    Http::assertSent(fn ($request) => isset($request['origin_latitude']) && ! isset($request['origin_coordinate']));
});

test('pending biteship receipts replay once after shipment becomes available', function () {
    $payment = recoveryPayment(['payment_status' => 'paid']);
    $payload = ['order_id' => 'booking-later', 'status' => 'delivered', 'courier' => ['link' => 'https://tracking.example.test/order']];
    $receipt = BiteshipWebhookLog::query()->create(['biteship_order_id' => 'booking-later', 'payload_hash' => hash('sha256', json_encode($payload)), 'payload' => $payload]);
    $processor = app(ProcessBiteshipWebhookAction::class);
    $processor->execute($receipt);
    expect($receipt->refresh()->processed_at)->toBeNull();
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'biteship_order_id' => 'booking-later', 'shipping_status' => 'confirmed', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    $processor->replay($shipment);
    $processor->execute($receipt);
    expect($receipt->refresh()->processed_at)->not->toBeNull()
        ->and($shipment->refresh()->shipping_status)->toBe('delivered');
    $this->assertDatabaseCount('shipment_trackings', 1);
});

test('tracking retains valid link and first delivery timestamp', function () {
    $payment = recoveryPayment(['payment_status' => 'paid']);
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'biteship_order_id' => 'tracking-safe', 'shipping_status' => 'in_transit', 'courier_company' => 'jne', 'courier_type' => 'reg', 'raw_order_response' => ['courier' => ['link' => 'https://tracking.example.test/order']]]);
    $service = app(ShipmentManagementService::class);
    $service->applyBiteshipPayload($shipment, ['id' => 'tracking-safe', 'status' => 'delivered']);
    $delivered = $shipment->refresh()->delivered_at->toISOString();
    $this->travel(2)->minutes();
    $service->applyBiteshipPayload($shipment, ['id' => 'tracking-safe', 'status' => 'delivered', 'courier' => ['link' => 'javascript:alert(1)']]);
    expect($shipment->refresh()->raw_order_response['courier']['link'])->toBe('https://tracking.example.test/order')
        ->and($shipment->delivered_at->toISOString())->toBe($delivered);
});

test('all variant weights must be positive including inactive variants', function () {
    $payment = recoveryPayment();
    $data = ['product_id' => $payment->order->items->first()->product_id, 'regular_price' => 90000, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 0, 'stock_quantity' => 0, 'is_active' => false];
    expect(Validator::make($data, (new ProductVariantRequest)->rules())->errors()->has('shipping_weight_gram'))->toBeTrue();
});

test('checkout persists rounded total and consistent weight after voucher requotation', function () {
    [$user, $address, $voucher, $variant] = recoveryCheckout();
    $payload = recoveryCheckoutPayload($this, $user, $address);
    $response = $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $order = Order::query()->findOrFail($response->json('order_id'));
    expect((float) $order->grand_total)->toBe(3.0)
        ->and((float) $order->payment->gross_amount)->toBe(3.0)
        ->and($order->items->first()->shipping_weight_gram)->toBe(600)
        ->and($voucher->refresh()->used_count)->toBe(1);
    $this->assertDatabaseCount('cart_items', 0);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful()->assertJsonPath('order_id', $order->id);
    expect($variant->stock->refresh()->quantity)->toBe(8)
        ->and($order->payment_status)->toBe('pending');
    $this->assertDatabaseHas('order_item_stock_movements', ['order_item_id' => $order->items->first()->id, 'quantity' => -2]);
    app(ApplyMidtransPaymentStatusAction::class)->execute($order->payment, 'settlement');
    app(ApplyMidtransPaymentStatusAction::class)->execute($order->payment, 'settlement');
    expect($variant->stock->refresh()->quantity)->toBe(8);
    Http::assertSent(fn ($request) => ! str_contains($request->url(), '/rates/') || ($request['items'][0]['weight'] === 300 && $request['items'][0]['quantity'] === 2));
});

test('uncertain checkout keeps cart voucher and idempotency without creating another snap', function (array $snap, int $status) {
    [$user, $address, $voucher, $variant] = recoveryCheckout($snap, $status);
    $payload = recoveryCheckoutPayload($this, $user, $address);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('payment');
    $order = Order::query()->where('checkout_idempotency_key', $payload['idempotency_key'])->firstOrFail();
    expect($order->payment_status)->toBe('manual_review')
        ->and($order->payment->raw_response['snap_creation_uncertain'])->toBeTrue()
        ->and($voucher->refresh()->used_count)->toBe(1);
    $this->assertDatabaseCount('cart_items', 1);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable();
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/v1/transactions'))->count())->toBe(1);
    expect($variant->stock->refresh()->quantity)->toBe(8);
})->with([
    'malformed success' => [[], 201],
    'server error' => [['error_messages' => ['Unavailable']], 500],
    'duplicate' => [['error_messages' => ['Order ID already used']], 409],
]);

test('confirmed snap rejection releases voucher but preserves cart', function () {
    [$user, $address, $voucher, $variant] = recoveryCheckout(['error_messages' => ['Invalid data']], 422);
    $payload = recoveryCheckoutPayload($this, $user, $address);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('payment');
    expect(Order::query()->where('checkout_idempotency_key', $payload['idempotency_key'])->firstOrFail()->payment_status)->toBe('failed')
        ->and($voucher->refresh()->used_count)->toBe(0);
    $this->assertDatabaseCount('cart_items', 1);
    expect($variant->stock->refresh()->quantity)->toBe(10);
    $this->assertDatabaseHas('order_item_stock_movements', ['movement_type' => 'release', 'quantity' => 2]);
});

test('closed unpaid checkout restores only its deducted stock once', function (string $status) {
    [$user, $address, , $variant] = recoveryCheckout();
    $response = $this->postJson(route('checkout.place-order'), recoveryCheckoutPayload($this, $user, $address))->assertSuccessful();
    $order = Order::query()->findOrFail($response->json('order_id'));
    expect($variant->stock->refresh()->quantity)->toBe(8);
    $variant->stock->increment('quantity', 3);
    app(ApplyMidtransPaymentStatusAction::class)->execute($order->payment, $status);
    app(ApplyMidtransPaymentStatusAction::class)->execute($order->payment, $status);
    expect($variant->stock->refresh()->quantity)->toBe(13);
    $this->assertDatabaseHas('order_item_stock_movements', [
        'order_item_id' => $order->items->first()->id, 'movement_type' => 'release',
        'quantity' => 2, 'stock_before' => 11, 'stock_after' => 13,
    ]);
    $this->assertDatabaseCount('order_item_stock_movements', 2);
    app(ApplyMidtransPaymentStatusAction::class)->execute($order->payment, 'settlement');
    expect($order->refresh()->payment_status)->toBe('manual_review')
        ->and($variant->stock->refresh()->quantity)->toBe(13);
})->with(['cancel', 'expire', 'deny', 'failure']);

test('another checkout cannot buy stock held by an unpaid order', function () {
    [$user, $address, , $variant] = recoveryCheckout();
    $variant->stock->update(['quantity' => 2]);
    $this->postJson(route('checkout.place-order'), recoveryCheckoutPayload($this, $user, $address))->assertSuccessful();
    expect($variant->stock->refresh()->quantity)->toBe(0);
    $other = User::factory()->create();
    $otherAddress = $address->replicate();
    $otherAddress->user_id = $other->id;
    $otherAddress->save();
    $cart = Cart::query()->create(['user_id' => $other->id]);
    CartItem::query()->create(['cart_id' => $cart->id, 'product_id' => $variant->product_id, 'product_variant_id' => $variant->id, 'quantity' => 2, 'price_snapshot' => 1.49]);
    $payload = recoveryCheckoutPayload($this, $other, $otherAddress);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('cart');
    expect(Order::query()->where('user_id', $other->id)->count())->toBe(0);
});

test('expiry scheduler closes unpaid snap or pending transaction before restoring stock', function (bool $selectedMethod) {
    [$user, $address, , $variant] = recoveryCheckout();
    SiteSetting::query()->create(['key' => 'payment_expiry_duration', 'value' => '30']);
    $response = $this->postJson(route('checkout.place-order'), recoveryCheckoutPayload($this, $user, $address))->assertSuccessful();
    $order = Order::query()->findOrFail($response->json('order_id'));
    $payment = $order->payment;
    expect($payment->expires_at->diffInMinutes($payment->created_at, true))->toBe(30.0);
    Http::fake([
        '*/status' => $selectedMethod
            ? Http::response(['order_id' => $payment->midtrans_order_id, 'gross_amount' => '3.00', 'status_code' => '201', 'transaction_status' => 'pending'])
            : Http::response(['status_code' => '404'], 404),
        '*/cancel' => $selectedMethod
            ? Http::response(['order_id' => $payment->midtrans_order_id, 'gross_amount' => '3.00', 'status_code' => '200', 'transaction_status' => 'cancel'])
            : Http::response(['canceled_at' => now()->toISOString()]),
    ]);
    $this->travel(31)->minutes();
    expect(app(SyncExpiredMidtransPaymentsAction::class)->execute())->toBe(['checked' => 1, 'synced' => 1, 'failed' => 0]);
    expect($variant->stock->refresh()->quantity)->toBe(10)
        ->and($order->refresh()->payment_status)->toBe('cancelled');
    expect(app(SyncExpiredMidtransPaymentsAction::class)->execute()['checked'])->toBe(0);
    $this->assertDatabaseCount('order_item_stock_movements', 2);
})->with([true, false]);

test('expiry cancellation failure holds stock until a successful retry', function () {
    [$user, $address, , $variant] = recoveryCheckout();
    $response = $this->postJson(route('checkout.place-order'), recoveryCheckoutPayload($this, $user, $address))->assertSuccessful();
    $order = Order::query()->findOrFail($response->json('order_id'));
    $order->payment->update(['expires_at' => now()->subMinute()]);
    Http::fake(['*/status' => Http::response(['status_code' => '404'], 404), '*/cancel' => Http::response([], 500)]);
    expect(app(SyncExpiredMidtransPaymentsAction::class)->execute()['failed'])->toBe(1);
    expect($variant->stock->refresh()->quantity)->toBe(8)
        ->and($order->refresh()->payment_status)->toBe('pending');
    Http::fake(['*/status' => Http::response(['status_code' => '404'], 404), '*/cancel' => Http::response(['canceled_at' => now()->toISOString()])]);
    expect(app(SyncExpiredMidtransPaymentsAction::class)->execute()['synced'])->toBe(1);
    expect($variant->stock->refresh()->quantity)->toBe(10);
});

test('weight changes invalidate an existing shipping binding', function () {
    [$user, $address, , $variant] = recoveryCheckout();
    $payload = recoveryCheckoutPayload($this, $user, $address);
    $variant->update(['length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 400]);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('shipping_rate_id');
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/v1/transactions'))->count())->toBe(0);
});

test('invalid cart shipping weight prevents rate requests', function () {
    [$user, $address, , $variant] = recoveryCheckout();
    $variant->update(['length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 0]);
    $this->actingAs($user)->postJson(route('checkout.shipping-rates'), ['customer_address_id' => $address->id])
        ->assertUnprocessable()->assertJsonValidationErrors('cart');
    Http::assertNothingSent();
});

test('webhook before booking retries pending receipt rather than treating it as complete', function () {
    $payment = recoveryPayment(['payment_status' => 'paid']);
    config(['services.biteship.webhook_secret' => 'test-secret']);
    $payload = ['order_id' => 'later-webhook', 'status' => 'delivered'];
    $this->withHeader('X-Biteship-Webhook-Secret', 'test-secret')->postJson(route('shipments.biteship.webhook'), $payload)->assertSuccessful();
    $this->assertDatabaseHas('biteship_webhook_logs', ['biteship_order_id' => 'later-webhook', 'processed_at' => null]);
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'biteship_order_id' => 'later-webhook', 'shipping_status' => 'confirmed', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    $this->postJson(route('shipments.biteship.webhook'), $payload)->assertSuccessful();
    $this->postJson(route('shipments.biteship.webhook'), $payload)->assertJsonPath('duplicate', true);
    expect($shipment->refresh()->shipping_status)->toBe('delivered');
    $this->assertDatabaseCount('biteship_webhook_logs', 1);
    $this->assertDatabaseCount('shipment_trackings', 1);
});

test('uncertain nonexpired payments are reconciled by the scheduled action', function () {
    $payment = recoveryPayment(['payment_status' => 'manual_review']);
    $payment->update(['transaction_status' => 'manual_review', 'expires_at' => now()->addDay(), 'failure_reason' => 'Snap uncertain', 'raw_response' => ['snap_creation_uncertain' => true]]);
    Http::fake(['*' => Http::response(['order_id' => $payment->midtrans_order_id, 'transaction_status' => 'pending', 'status_code' => '201', 'gross_amount' => '3.00'])]);
    expect(app(SyncExpiredMidtransPaymentsAction::class)->execute()['synced'])->toBe(1)
        ->and($payment->refresh()->transaction_status)->toBe('pending')
        ->and($payment->failure_reason)->toBeNull();
});

test('stale sync cannot overwrite refunded payment metadata', function () {
    $payment = recoveryPayment(['payment_status' => 'refunded']);
    $payment->update(['transaction_status' => 'refund', 'fraud_status' => 'accept', 'raw_response' => ['transaction_status' => 'refund']]);
    Http::fake(['*' => Http::response(['order_id' => $payment->midtrans_order_id, 'transaction_status' => 'pending', 'status_code' => '201', 'gross_amount' => '3.00', 'fraud_status' => 'challenge'])]);
    app(SyncMidtransPaymentAction::class)->execute($payment);
    expect($payment->refresh()->transaction_status)->toBe('refund')
        ->and($payment->fraud_status)->toBe('accept')
        ->and($payment->raw_response['transaction_status'])->toBe('refund');
});

test('receipt and shipment processing roll back together on failure', function () {
    $payment = recoveryPayment(['payment_status' => 'paid']);
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'biteship_order_id' => 'atomic', 'shipping_status' => 'confirmed', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    $receipt = BiteshipWebhookLog::query()->create(['biteship_order_id' => 'atomic', 'payload_hash' => 'atomic-hash', 'payload' => ['id' => 'atomic', 'status' => 'delivered']]);
    $service = Mockery::mock(ShipmentManagementService::class);
    $service->shouldReceive('applyBiteshipPayload')->once()->andReturnUsing(function ($shipment) {
        $shipment->update(['shipping_status' => 'delivered']);
        throw new RuntimeException('Simulated processing failure');
    });
    expect(fn () => (new ProcessBiteshipWebhookAction($service))->execute($receipt))->toThrow(RuntimeException::class);
    expect($receipt->refresh()->processed_at)->toBeNull()->and($shipment->refresh()->shipping_status)->toBe('confirmed');
});

test('manual shipment status cannot skip unbooked or unpaid prerequisites', function () {
    $payment = recoveryPayment();
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'shipping_status' => 'not_created', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    expect(fn () => app(ShipmentManagementService::class)->updateStatus($shipment, Request::create('/', 'POST', ['shipping_status' => 'delivered'])))->toThrow(ValidationException::class);
    expect($shipment->refresh()->shipping_status)->toBe('not_created');
});

test('return transit and temporary hold retain lifecycle without automatic refund', function () {
    $payment = recoveryPayment(['payment_status' => 'paid']);
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'shipping_status' => 'in_transit', 'biteship_order_id' => 'return-test', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    $service = app(ShipmentManagementService::class);
    foreach (['on_hold', 'in_transit', 'delivered', 'return_in_transit', 'disposed'] as $status) {
        $service->applyBiteshipPayload($shipment, ['id' => 'return-test', 'status' => $status]);
        expect($shipment->refresh()->shipping_status)->toBe($status);
    }
    $service->applyBiteshipPayload($shipment, ['id' => 'return-test', 'status' => 'in_transit']);
    expect($shipment->refresh()->shipping_status)->toBe('disposed')->and($payment->order->refresh()->payment_status)->toBe('paid');
});

test('catalog cards use the cheapest active variant while retired price filters are ignored', function () {
    $first = Product::query()->create(['name' => 'Kopi A', 'slug' => 'kopi-a', 'status' => 'active']);
    foreach ([[200000, true], [80000, true], [1, false]] as [$price, $active]) {
        ProductVariant::query()->create(['product_id' => $first->id, 'regular_price' => $price, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 300, 'is_active' => $active]);
    }
    $second = Product::query()->create(['name' => 'Kopi B', 'slug' => 'kopi-b', 'status' => 'active']);
    ProductVariant::query()->create(['product_id' => $second->id, 'regular_price' => 90000, 'length' => 4, 'width' => 5, 'height' => 2, 'shipping_weight_gram' => 300, 'is_active' => true]);
    $service = app(ProductBrowsingService::class);
    $cards = $service->productListData(Request::create('/list'))['products']->items();
    expect(array_column($cards, 'id'))->toBe([$first->id, $second->id])
        ->and($cards[0]['price'])->toBe(80000.0)->and($cards[0]['price_from'])->toBeTrue();
    expect($service->productListData(Request::create('/list', 'GET', ['price' => '100000_250000']))['products']->total())->toBe(2);
});

test('valid signed webhook logs only safe acknowledgement metadata', function () {
    $payment = recoveryPayment();
    $payload = ['order_id' => $payment->midtrans_order_id, 'status_code' => '201', 'gross_amount' => '3.00', 'transaction_status' => 'pending'];
    $payload['signature_key'] = hash('sha512', $payload['order_id'].'201'.'3.00'.'test-server-key');
    Log::spy();
    $this->postJson(route('payments.midtrans.notification'), $payload)->assertSuccessful();
    Log::shouldHaveReceived('info')->once()->with('midtrans_webhook_acknowledged', ['provider' => 'midtrans']);
    $payload['signature_key'] = 'invalid';
    $this->postJson(route('payments.midtrans.notification'), $payload)->assertForbidden();
});

test('snap completion cannot overwrite concurrent final payment metadata', function (int $responseStatus) {
    [$user, $address] = recoveryCheckout();
    $payload = recoveryCheckoutPayload($this, $user, $address);
    Http::swap(new Factory);
    Http::fake([
        '*/v1/rates/couriers' => Http::response(['pricing' => [['company' => 'jne', 'type' => 'reg', 'price' => 0]]]),
        '*/snap/v1/transactions' => function () use ($payload, $responseStatus) {
            $order = Order::query()->where('checkout_idempotency_key', $payload['idempotency_key'])->firstOrFail();
            $order->update(['payment_status' => 'refunded', 'order_status' => 'refunded']);
            $order->payment->update(['transaction_status' => 'refund', 'raw_response' => ['transaction_status' => 'refund']]);

            return Http::response(['token' => 'late-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/late', 'error_messages' => ['Invalid transaction']], $responseStatus);
        }]);
    $this->postJson(route('checkout.place-order'), $payload)->assertStatus($responseStatus === 201 ? 200 : 422);
    $order = Order::query()->where('checkout_idempotency_key', $payload['idempotency_key'])->firstOrFail();
    expect($order->payment_status)->toBe('refunded')
        ->and($order->payment->transaction_status)->toBe('refund')
        ->and($order->payment->raw_response['transaction_status'])->toBe('refund');
})->with([201, 400, 503]);

test('malformed optional provider metadata is rejected and logged before applying status', function () {
    $payment = recoveryPayment();
    $error = app(SyncMidtransPaymentAction::class)->applyPayload($payment, [
        'order_id' => $payment->midtrans_order_id, 'transaction_status' => 'settlement',
        'status_code' => '200', 'gross_amount' => '3.00', 'fraud_status' => ['accept'],
    ], 'admin_sync');
    expect($error)->not->toBeNull()->and($payment->order->refresh()->payment_status)->toBe('pending');
    $this->assertDatabaseHas('payment_logs', ['payment_id' => $payment->id, 'event_type' => 'rejected_invalid_payload']);
});

test('admin cancellation surfaces unresolved provider status on the status field', function () {
    $payment = recoveryPayment();
    Http::fake(['*' => Http::response(['status_code' => '500'], 500)]);
    try {
        app(OrderManagementService::class)->updateStatus($payment->order, 'cancelled');
        $this->fail('Cancellation must remain unresolved.');
    } catch (ValidationException $exception) {
        expect($exception->errors())->toHaveKey('status');
    }
    expect($payment->order->refresh()->payment_status)->toBe('pending');
});

test('shipment index filters retain all statuses while detail exposes legal transitions only', function () {
    $payment = recoveryPayment();
    $shipment = Shipment::query()->create(['order_id' => $payment->order_id, 'shipping_status' => 'not_created', 'courier_company' => 'jne', 'courier_type' => 'reg']);
    $service = app(ShipmentManagementService::class);
    expect($service->indexData(Request::create('/'))['shippingStatuses'])->toBe(ShippingStatus::values())
        ->and($service->detailData($shipment)['shippingStatuses'])->toBe([]);
});

test('package dimension changes invalidate selected rates before payment', function ($dimension) {
    [$user, $address, , $variant] = recoveryCheckout();
    $payload = recoveryCheckoutPayload($this, $user, $address);
    $variant->update([$dimension => 12.5]);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('shipping_rate_id');
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/v1/transactions'))->count())->toBe(0);
})->with(['length', 'width', 'height']);

test('invalid package dimensions prevent rate requests', function ($size) {
    [$user, $address, , $variant] = recoveryCheckout();
    $variant->update(['height' => $size]);
    $this->actingAs($user)->postJson(route('checkout.shipping-rates'), ['customer_address_id' => $address->id])
        ->assertUnprocessable()->assertJsonValidationErrors('cart');
    Http::assertNothingSent();
})->with([0, -1]);

test('checkout sends per unit dimensions and snapshots variant grind not producer', function () {
    [$user, $address, , $variant] = recoveryCheckout();
    $variant->product->update(['grind_type' => 'Koperasi Gayo']);
    $variant->update(['grind_type' => 'fine']);
    $payload = recoveryCheckoutPayload($this, $user, $address);
    Http::assertSent(fn ($request) => str_contains($request->url(), '/rates/')
        && (float) $request['items'][0]['length'] === 4.0
        && (float) $request['items'][0]['width'] === 5.0
        && (float) $request['items'][0]['height'] === 2.0
        && $request['items'][0]['quantity'] === 2
        && $request['items'][0]['weight'] === 300);
    $response = $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $item = Order::query()->findOrFail($response->json('order_id'))->items()->firstOrFail();
    expect($item->length)->toBe('4.00')->and($item->width)->toBe('5.00')->and($item->height)->toBe('2.00')
        ->and($item->grind_type)->toBe('fine')->and($item->shipping_weight_gram)->toBe(600);
});
