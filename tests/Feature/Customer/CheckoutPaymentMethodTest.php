<?php

use App\Actions\Payments\SyncMidtransPaymentAction;
use App\Enums\CheckoutPaymentMethod;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\SiteSetting;
use App\Models\Stock;
use App\Models\User;
use App\Models\Voucher;
use App\Services\Customer\CheckoutService;
use App\Services\Integrations\MidtransService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;

function paymentMethodFake(array $responses = []): void
{
    Http::swap(new Factory);
    Http::preventStrayRequests();
    Http::fake([
        '*/v1/rates/couriers' => Http::response(['pricing' => [['company' => 'jne', 'type' => 'reg', 'price' => 16000]]]),
        ...$responses,
    ]);
}

function paymentMethodCheckout(): array
{
    $user = User::factory()->create();
    $product = Product::query()->create(['name' => 'Coffee', 'slug' => Str::uuid(), 'sku' => Str::uuid(), 'status' => 'active']);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id, 'sku' => Str::uuid(), 'net_weight' => '250g', 'grind_type' => 'whole_bean',
        'regular_price' => 90000, 'shipping_weight_gram' => 300, 'length' => 10, 'width' => 8, 'height' => 4, 'is_active' => true,
    ]);
    $stock = Stock::query()->create(['product_variant_id' => $variant->id, 'quantity' => 10]);
    $cart = Cart::query()->create(['user_id' => $user->id]);
    CartItem::query()->create(['cart_id' => $cart->id, 'product_id' => $product->id, 'product_variant_id' => $variant->id, 'quantity' => 1, 'price_snapshot' => 90000]);
    $address = CustomerAddress::query()->create([
        'user_id' => $user->id, 'recipient_name' => 'Test Customer', 'recipient_phone' => '081234567890',
        'province' => 'Jawa Timur', 'city' => 'Blitar', 'district' => 'Test', 'postal_code' => '66111',
        'full_address' => 'Test Address', 'latitude' => -8, 'longitude' => 112, 'is_default' => true,
    ]);
    foreach (['store_postal_code' => '66111', 'store_latitude' => '-8', 'store_longitude' => '112'] as $key => $value) {
        SiteSetting::query()->create(compact('key', 'value'));
    }
    paymentMethodFake();

    return [$user, $address, $stock, $cart];
}

function paymentMethodPayload($test, User $user, CustomerAddress $address, string $method = 'bca_va'): array
{
    $test->actingAs($user);
    $rate = $test->postJson(route('checkout.shipping-rates'), ['customer_address_id' => $address->id])->assertSuccessful()->json('rates.0.id');
    $test->postJson(route('checkout.shipping-rate'), ['shipping_rate_id' => $rate])->assertSuccessful();

    return ['customer_address_id' => $address->id, 'shipping_rate_id' => $rate, 'idempotency_key' => (string) Str::uuid(), 'no_return_refund_agreed' => true, 'payment_method' => $method];
}

beforeEach(function () {
    expect(config('database.default'))->toBe('sqlite');
    expect(config('database.connections.sqlite.database'))->toBe(':memory:');
    config(['services.midtrans.server_key' => 'synthetic-key', 'services.biteship.api_key' => 'synthetic-key', 'inertia.ssr.enabled' => false]);
    Http::preventStrayRequests();
});

test('invalid payment selection has no checkout side effects', function (mixed $method) {
    [$user, $address, $stock, $cart] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    $payload['payment_method'] = $method;
    if ($method === null) {
        unset($payload['payment_method']);
    }
    $voucher = Voucher::query()->create(['code' => 'COFFEE10', 'name' => 'Test', 'discount_type' => 'fixed', 'discount_value' => 10000, 'is_active' => true]);
    $this->postJson(route('checkout.voucher.apply'), ['voucher_code' => $voucher->code])->assertSuccessful();
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('payment_method');
    expect(Order::query()->count())->toBe(0)->and(Payment::query()->count())->toBe(0)
        ->and($stock->fresh()->quantity)->toBe(10)->and($cart->items()->count())->toBe(1)
        ->and($voucher->fresh()->used_count)->toBe(0);
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBe(0);
    expect(fn () => app(CheckoutService::class)->placeOrder($user, $payload))->toThrow(ValidationException::class);
})->with([null, '', [['bca_va']], 'unknown', 'credit_card']);

test('each allowed method is persisted before snap and scopes its payload', function (string $method) {
    [$user, $address] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address, $method);
    $transactionLevel = DB::transactionLevel();
    paymentMethodFake(['*/snap/v1/transactions' => function ($request) use ($method, $transactionLevel) {
        $payment = Payment::query()->sole();
        expect(DB::transactionLevel())->toBe($transactionLevel)
            ->and($payment->requested_payment_method)->toBe($method)->and($payment->payment_method)->toBeNull()
            ->and($request['enabled_payments'])->toBe([$method])
            ->and($request['transaction_details']['gross_amount'])->toBe(106000)
            ->and(collect($request['item_details'])->sum(fn ($item) => $item['price'] * $item['quantity']))->toBe(106000);

        return Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v4/redirection/test-token'], 201);
    }]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $this->postJson(route('checkout.place-order'), [...$payload, 'payment_method' => $method === 'bca_va' ? 'bni_va' : 'bca_va'])
        ->assertUnprocessable()->assertJsonValidationErrors(['payment_method', 'order_id']);
    expect(Order::query()->count())->toBe(1)->and(Payment::query()->count())->toBe(1);
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBe(1);
})->with(['bca_va', 'bni_va', 'bri_va', 'echannel', 'permata_va', 'other_qris', 'gopay', 'shopeepay']);

test('configured allowlist rejects a known but disabled method', function () {
    [$user, $address, $stock] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address, 'bni_va');
    config(['services.midtrans.enabled_payments' => ['bca_va']]);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('payment_method');
    expect(fn () => app(CheckoutService::class)->placeOrder($user, $payload))->toThrow(ValidationException::class);
    expect(Order::query()->count())->toBe(0)->and($stock->fresh()->quantity)->toBe(10);
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBe(0);
});

test('snapshot survives uncertain creation and validated duplicate notifications', function (string $failure) {
    [$user, $address, $stock, $cart] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address, 'other_qris');
    paymentMethodFake(['*/snap/v1/transactions' => function () use ($failure) {
        return match ($failure) {
            'timeout' => throw new ConnectionException('Synthetic timeout'),
            'duplicate' => Http::response(['error_messages' => ['Order ID already used']], 409),
            'server' => Http::response([], 503),
            default => Http::response(['token' => 'test-token', 'redirect_url' => 'https://foreign.example/snap/test'], 201),
        };
    }]);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable();
    $payment = Payment::query()->sole();
    expect($payment->requested_payment_method)->toBe('other_qris')->and($payment->payment_method)->toBeNull()
        ->and($payment->order->payment_status)->toBe('manual_review')->and($stock->fresh()->quantity)->toBe(9)
        ->and($cart->items()->count())->toBe(1);
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable();
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBeLessThanOrEqual(1);
    $notification = ['order_id' => $payment->midtrans_order_id, 'status_code' => '200', 'gross_amount' => '106000.00', 'currency' => 'IDR', 'transaction_status' => 'settlement', 'payment_type' => 'qris', 'transaction_id' => 'synthetic-transaction'];
    $notification['signature_key'] = hash('sha512', $notification['order_id'].'200106000.00synthetic-key');
    $this->postJson(route('payments.midtrans.notification'), $notification)->assertSuccessful();
    $this->postJson(route('payments.midtrans.notification'), $notification)->assertSuccessful();
    expect($payment->fresh()->requested_payment_method)->toBe('other_qris')->and($payment->fresh()->payment_method)->toBe('qris')
        ->and($payment->order->fresh()->payment_status)->toBe('paid')->and($stock->fresh()->quantity)->toBe(9)
        ->and($payment->logs()->count())->toBe(1);
    app(SyncMidtransPaymentAction::class)->applyPayload($payment, [...$notification, 'transaction_status' => 'pending'], 'stale_sync');
    expect($payment->order->fresh()->payment_status)->toBe('paid')->and($payment->fresh()->requested_payment_method)->toBe('other_qris');
})->with(['timeout', 'duplicate', 'server', 'foreign redirect']);

test('snap redirect validates environment authority and token response', function (string $url, bool $valid) {
    expect(app(MidtransService::class)->isValidSnapRedirect($url))->toBe($valid);
})->with([
    ['https://app.sandbox.midtrans.com/snap/test', true],
    ['https://app.sandbox.midtrans.com:443/snap/test', true],
    ['https://app.midtrans.com/snap/test', false],
    ['http://app.sandbox.midtrans.com/snap/test', false],
    ['https://app.sandbox.midtrans.com.evil.example/snap/test', false],
    ['https://user@app.sandbox.midtrans.com/snap/test', false],
    ['https://app.sandbox.midtrans.com:444/snap/test', false],
    ['https://evil.example/snap/test', false],
]);

test('an in-flight retry cannot post snap or reserve stock twice', function () {
    [$user, $address, $stock] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    $attempts = 0;
    paymentMethodFake(['*/snap/v1/transactions' => function () use ($user, $payload, &$attempts) {
        $attempts++;
        expect(fn () => app(CheckoutService::class)->placeOrder($user, $payload))->toThrow(ValidationException::class);
        try {
            app(CheckoutService::class)->placeOrder($user, [...$payload, 'payment_method' => 'bni_va']);
            test()->fail('Conflicting retry was accepted.');
        } catch (ValidationException $exception) {
            expect($exception->errors())->toHaveKey('payment_method');
        }

        return Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201);
    }]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    expect($attempts)->toBe(1)->and(Order::query()->count())->toBe(1)->and($stock->fresh()->quantity)->toBe(9);
});

test('locked recheck enforces method when another request wins after initial lookup', function (bool $sameMethod) {
    [$user, $address, $stock, $cart] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    paymentMethodFake(['*/v1/rates/couriers' => function () use ($user, $payload, $sameMethod) {
        $order = Order::query()->create([
            'user_id' => $user->id, 'order_number' => 'RACE-ORDER', 'checkout_idempotency_key' => $payload['idempotency_key'],
            'customer_name' => $user->name, 'customer_email' => $user->email, 'customer_phone' => '081234567890', 'subtotal' => 90000, 'grand_total' => 106000,
        ]);
        $order->payment()->create(['requested_payment_method' => $sameMethod ? 'bca_va' : 'bni_va', 'gross_amount' => 106000, 'midtrans_redirect_url' => 'https://app.sandbox.midtrans.com/snap/test']);

        return Http::response(['pricing' => [['company' => 'jne', 'type' => 'reg', 'price' => 16000]]]);
    }]);
    $response = $this->postJson(route('checkout.place-order'), $payload);
    if ($sameMethod) {
        $response->assertSuccessful()->assertJsonPath('order_id', Order::query()->sole()->id);
    } else {
        $response->assertUnprocessable()->assertJsonValidationErrors('payment_method');
    }
    expect(Order::query()->count())->toBe(1)->and(Payment::query()->count())->toBe(1)
        ->and($stock->fresh()->quantity)->toBe(10)->and($cart->items()->count())->toBe(1);
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBe(0);
})->with([true, false]);

test('historical null snapshots and manual payments are not inferred or rewritten', function (string $provider) {
    [$user, $address] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    paymentMethodFake(['*/snap/v1/transactions' => Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201)]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $payment = Payment::query()->sole();
    DB::table('payments')->where('id', $payment->id)->update(['requested_payment_method' => null, 'payment_provider' => $provider, 'payment_method' => $provider === 'manual' ? 'bank_transfer' : null]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    expect($payment->fresh()->requested_payment_method)->toBeNull()->and($payment->fresh()->payment_provider)->toBe($provider);
    if ($provider === 'midtrans') {
        paymentMethodFake(['*/snap/v1/transactions' => function ($request) {
            expect($request->data())->not->toHaveKey('enabled_payments');

            return Http::response(['token' => 'historical-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201);
        }]);
        app(MidtransService::class)->createSnapTransaction($payment->order);
        expect($payment->fresh()->requested_payment_method)->toBeNull();
    } else {
        paymentMethodFake();
        expect(fn () => app(MidtransService::class)->createSnapTransaction($payment->order))->toThrow(ValidationException::class);
        Http::assertNothingSent();
    }
})->with(['midtrans', 'manual']);

test('snapshot is immutable and rejected notifications cannot change payment', function (string $invalidField) {
    [$user, $address, $stock] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    paymentMethodFake(['*/snap/v1/transactions' => Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201)]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $payment = Payment::query()->sole();
    expect(fn () => $payment->update(['requested_payment_method' => 'bni_va']))->toThrow(LogicException::class);
    $payment->refresh();
    $notification = ['order_id' => $payment->midtrans_order_id, 'status_code' => '200', 'gross_amount' => '106000.00', 'currency' => 'IDR', 'transaction_status' => 'settlement', 'payment_type' => 'bank_transfer'];
    $notification[$invalidField] = match ($invalidField) {
        'currency' => 'USD', 'gross_amount' => '1.00', 'order_id' => 'foreign-order', default => 'invalid-signature',
    };
    $notification['signature_key'] ??= hash('sha512', $notification['order_id'].'200'.$notification['gross_amount'].'synthetic-key');
    $response = $this->postJson(route('payments.midtrans.notification'), $notification);
    if ($invalidField === 'signature_key') {
        $response->assertForbidden();
    } elseif ($invalidField === 'order_id') {
        $response->assertNotFound();
    } else {
        $response->assertSuccessful();
    }
    expect($payment->fresh()->requested_payment_method)->toBe('bca_va')->and($payment->fresh()->payment_method)->toBeNull()
        ->and($payment->order->fresh()->payment_status)->toBe('pending')->and($stock->fresh()->quantity)->toBe(9);
})->with(['signature_key', 'currency', 'gross_amount', 'order_id']);

test('missing snapshot schema fails closed before any checkout mutations', function () {
    [$user, $address, $stock, $cart] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    Schema::table('payments', fn (Blueprint $table) => $table->dropColumn('requested_payment_method'));
    $this->postJson(route('checkout.place-order'), $payload)->assertUnprocessable()->assertJsonValidationErrors('checkout');
    expect(Order::query()->count())->toBe(0)->and($stock->fresh()->quantity)->toBe(10)->and($cart->items()->count())->toBe(1);
    expect(Http::recorded(fn ($request) => str_contains($request->url(), '/snap/'))->count())->toBe(0);
});

test('production snap accepts only the production authority', function () {
    SiteSetting::query()->create(['key' => 'midtrans_environment', 'value' => 'production']);
    $service = app(MidtransService::class);
    expect($service->isValidSnapRedirect('https://app.midtrans.com/snap/test'))->toBeTrue()
        ->and($service->isValidSnapRedirect('https://app.sandbox.midtrans.com/snap/test'))->toBeFalse();
});

test('checkout options follow the backend merchant catalog and local logos', function () {
    [$user] = paymentMethodCheckout();
    config(['services.midtrans.enabled_payments' => ['bca_va', 'other_qris', 'unknown']]);
    $this->actingAs($user)->get(route('checkout'))->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('customer/checkout/checkout')->has('paymentMethods', 2)
        ->where('paymentMethods.0.id', 'bca_va')->where('paymentMethods.1.id', 'other_qris'));
    foreach (CheckoutPaymentMethod::options() as $method) {
        expect(is_file(public_path($method['logo'])))->toBeTrue();
    }
});

test('server reconciliation keeps the requested method separate from the provider method', function (string $requested, string $confirmed) {
    [$user, $address, $stock] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address, $requested);
    paymentMethodFake(['*/snap/v1/transactions' => Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201)]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $payment = Payment::query()->sole();
    paymentMethodFake(['*/v2/*/status' => Http::response([
        'order_id' => $payment->midtrans_order_id, 'gross_amount' => '106000.00', 'currency' => 'IDR',
        'status_code' => '200', 'transaction_status' => 'settlement', 'payment_type' => $confirmed, 'transaction_id' => 'synthetic-transaction',
    ])]);
    app(SyncMidtransPaymentAction::class)->execute($payment);
    $this->actingAs($user)->get(route('payments.midtrans.finish', ['order_id' => $payment->midtrans_order_id, 'transaction_status' => 'failure']))->assertRedirect(route('my-order'));
    expect($payment->fresh()->requested_payment_method)->toBe($requested)->and($payment->fresh()->payment_method)->toBe($confirmed)
        ->and($payment->order->fresh()->payment_status)->toBe('paid')->and($stock->fresh()->quantity)->toBe(9);
})->with([['bca_va', 'bank_transfer'], ['gopay', 'qris']]);

test('browser settlement parameters cannot mark an unpaid order paid', function () {
    [$user, $address] = paymentMethodCheckout();
    $payload = paymentMethodPayload($this, $user, $address);
    paymentMethodFake(['*/snap/v1/transactions' => Http::response(['token' => 'test-token', 'redirect_url' => 'https://app.sandbox.midtrans.com/snap/test'], 201)]);
    $this->postJson(route('checkout.place-order'), $payload)->assertSuccessful();
    $payment = Payment::query()->sole();
    $this->get(route('payments.midtrans.finish', ['order_id' => $payment->midtrans_order_id, 'transaction_status' => 'settlement', 'status_code' => '200']))->assertRedirect(route('my-order'));
    expect($payment->order->fresh()->payment_status)->toBe('pending')->and($payment->fresh()->payment_method)->toBeNull();
});

test('historical token links use the server environment and never mask an unsafe stored redirect', function () {
    $payment = new Payment(['midtrans_snap_token' => 'historical-token']);
    $service = app(MidtransService::class);
    expect($service->paymentRedirectUrl($payment))->toBe('https://app.sandbox.midtrans.com/snap/v2/vtweb/historical-token');
    $payment->midtrans_redirect_url = 'https://foreign.example/snap/test';
    expect($service->paymentRedirectUrl($payment))->toBeNull();
    $payment->midtrans_redirect_url = null;
    $payment->midtrans_snap_token = 'invalid/token';
    expect($service->paymentRedirectUrl($payment))->toBeNull();
});
