<?php

namespace App\Services\Integrations;

use App\Exceptions\UncertainSnapCreationException;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Settings\SiteSettingService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class MidtransService
{
    public function __construct(private readonly SiteSettingService $settings) {}

    public function createSnapTransaction(Order $order): array
    {
        $order->load(['items', 'address']);

        $client = $this->snapClient();
        try {
            $response = $client->post('/snap/v1/transactions', [
                'transaction_details' => [
                    'order_id' => $order->order_number,
                    'gross_amount' => (int) round((float) $order->grand_total),
                ],
                'customer_details' => [
                    'first_name' => $order->customer_name,
                    'email' => $order->customer_email,
                    'phone' => $order->customer_phone,
                    'shipping_address' => [
                        'first_name' => $order->address?->recipient_name,
                        'phone' => $order->address?->recipient_phone,
                        'address' => $order->address?->full_address,
                        'city' => $order->address?->city,
                        'postal_code' => $order->address?->postal_code,
                        'country_code' => 'IDN',
                    ],
                ],
                'item_details' => $this->itemDetails($order),
                'expiry' => [
                    'unit' => 'minutes',
                    'duration' => (int) ($this->settings->first(['payment_expiry_duration'], '1440') ?: 1440),
                ],
                'callbacks' => [
                    'finish' => $this->finishRedirectUrl(),
                ],
            ]);

        } catch (ConnectionException $exception) {
            throw new UncertainSnapCreationException('Hasil pembuatan pembayaran belum dapat dipastikan.', 0, $exception);
        }
        $message = $response->json('error_messages.0');
        if (! $response->successful()) {
            if ($response->clientError() && ! in_array($response->status(), [408, 409, 429], true)
                && is_string($message) && trim($message) !== '' && ! preg_match('/duplicate|already|used|taken/i', $message)) {
                throw ValidationException::withMessages(['payment' => 'Midtrans menolak pembuatan pembayaran. Periksa data checkout lalu coba lagi.']);
            }
            throw new UncertainSnapCreationException('Hasil pembuatan pembayaran belum dapat dipastikan.');
        }
        $payload = $response->json();
        $token = $payload['token'] ?? null;
        $redirect = $payload['redirect_url'] ?? null;
        if (! is_string($token) || trim($token) === '' || ! is_string($redirect)
            || ! filter_var($redirect, FILTER_VALIDATE_URL) || parse_url($redirect, PHP_URL_SCHEME) !== 'https') {
            throw new UncertainSnapCreationException('Midtrans belum memberikan sesi pembayaran yang valid.');
        }

        return $payload;
    }

    public function transactionStatus(string $midtransOrderId): array
    {
        return $this->findTransactionStatus($midtransOrderId)
            ?? throw ValidationException::withMessages(['payment' => 'Transaksi belum ditemukan di Midtrans.']);
    }

    public function findTransactionStatus(string $midtransOrderId): ?array
    {
        try {
            $response = $this->apiClient()->get('/v2/'.rawurlencode($midtransOrderId).'/status');
        } catch (ConnectionException) {
            throw ValidationException::withMessages(['payment' => 'Status Midtrans belum dapat dipastikan karena koneksi gagal. Pesanan tidak diubah.']);
        }

        if (in_array($response->status(), [200, 404], true) && (string) $response->json('status_code') === '404') {
            return null;
        }

        if (! $response->successful()) {
            throw ValidationException::withMessages(['payment' => 'Status pembayaran belum dapat dipastikan. Coba sinkronisasi kembali.']);
        }
        $payload = $response->json();
        if (! is_array($payload)) {
            throw ValidationException::withMessages(['payment' => 'Respons status Midtrans tidak valid.']);
        }

        return $payload;
    }

    public function cancelTransaction(string $midtransOrderId): array
    {
        try {
            $response = $this->apiClient()->post('/v2/'.rawurlencode($midtransOrderId).'/cancel');
        } catch (ConnectionException) {
            throw ValidationException::withMessages(['payment' => 'Pembatalan belum terkonfirmasi karena koneksi gagal. Pesanan tidak diubah.']);
        }

        if (! $response->successful()) {
            throw ValidationException::withMessages([
                'payment' => 'Pembatalan Midtrans belum terkonfirmasi. Pesanan belum dibatalkan.',
            ]);
        }

        $payload = $response->json();
        if (! is_array($payload) || (string) ($payload['status_code'] ?? '') !== '200'
            || ($payload['transaction_status'] ?? null) !== 'cancel' || ($payload['order_id'] ?? null) !== $midtransOrderId) {
            throw ValidationException::withMessages(['payment' => 'Respons pembatalan Midtrans tidak valid.']);
        }

        return $payload;
    }

    public function cancelSnapSession(string $token): void
    {
        try {
            $response = $this->snapClient()->post('/snap/v1/transactions/'.rawurlencode($token).'/cancel');
        } catch (ConnectionException) {
            throw ValidationException::withMessages(['payment' => 'Pembatalan sesi belum terkonfirmasi karena koneksi gagal.']);
        }
        if (! $response->successful() || ! is_string($response->json('canceled_at')) || blank($response->json('canceled_at'))) {
            throw ValidationException::withMessages(['payment' => 'Pembatalan sesi pembayaran belum terkonfirmasi.']);
        }
    }

    public function notificationIsValid(array $payload): bool
    {
        return $this->validateNotificationSignature($payload);
    }

    public function validateNotificationSignature(array $payload): bool
    {
        $signature = $payload['signature_key'] ?? null;
        $orderId = $payload['order_id'] ?? '';
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';

        return filled($signature)
            && hash_equals((string) $signature, hash('sha512', $orderId.$statusCode.$grossAmount.$this->serverKey()));
    }

    public function amountMatches(mixed $payloadAmount, Payment $payment): bool
    {
        if ((! is_string($payloadAmount) && ! is_int($payloadAmount) && ! is_float($payloadAmount))
            || ! is_numeric($payloadAmount) || ! is_finite((float) $payloadAmount) || (float) $payloadAmount < 0
            || floor((float) $payloadAmount) !== (float) $payloadAmount) {
            return false;
        }

        return (float) $payloadAmount === (float) $payment->gross_amount;
    }

    private function itemDetails(Order $order): array
    {
        $items = $order->items->map(fn ($item): array => [
            'id' => (string) ($item->variant_sku ?? $item->product_sku ?? $item->id),
            'price' => (int) round((float) $item->price),
            'quantity' => $item->quantity,
            'name' => mb_substr($item->product_name, 0, 50),
        ])->values();

        if ((float) $order->shipping_cost > 0) {
            $items->push(['id' => 'shipping', 'price' => (int) round((float) $order->shipping_cost), 'quantity' => 1, 'name' => 'Shipping']);
        }

        if ((float) $order->service_fee > 0) {
            $items->push(['id' => 'service_fee', 'price' => (int) round((float) $order->service_fee), 'quantity' => 1, 'name' => 'Service fee']);
        }

        if ((float) $order->discount_amount > 0) {
            $items->push(['id' => 'discount', 'price' => -1 * (int) round((float) $order->discount_amount), 'quantity' => 1, 'name' => 'Discount']);
        }

        $adjustment = (int) round((float) $order->grand_total, 0, PHP_ROUND_HALF_UP)
            - $items->sum(fn (array $item): int => $item['price'] * $item['quantity']);
        if ($adjustment !== 0) {
            $items->push(['id' => 'rounding', 'price' => $adjustment, 'quantity' => 1, 'name' => 'Pembulatan']);
        }

        return $items->all();
    }

    private function snapClient(): PendingRequest
    {
        return $this->client($this->snapBaseUrl());
    }

    private function apiClient(): PendingRequest
    {
        return $this->client($this->apiBaseUrl());
    }

    private function client(string $baseUrl): PendingRequest
    {
        return Http::baseUrl($baseUrl)
            ->timeout(20)
            ->acceptJson()
            ->withBasicAuth($this->serverKey(), '');
    }

    private function snapBaseUrl(): string
    {
        $environment = $this->settings->first(['midtrans_environment', 'payment_midtrans_env'], 'sandbox');

        return $environment === 'production'
            ? 'https://app.midtrans.com'
            : 'https://app.sandbox.midtrans.com';
    }

    private function apiBaseUrl(): string
    {
        $environment = $this->settings->first(['midtrans_environment', 'payment_midtrans_env'], 'sandbox');

        return $environment === 'production'
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';
    }

    private function finishRedirectUrl(): string
    {
        return route('payments.midtrans.finish');
    }

    private function serverKey(): string
    {
        $serverKey = config('services.midtrans.server_key') ?: env('MIDTRANS_SERVER_KEY');

        if (! filled($serverKey)) {
            throw ValidationException::withMessages(['midtrans' => 'MIDTRANS_SERVER_KEY belum dikonfigurasi.']);
        }

        return $serverKey;
    }
}
