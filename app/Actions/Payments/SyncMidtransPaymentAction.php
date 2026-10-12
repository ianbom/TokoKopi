<?php

namespace App\Actions\Payments;

use App\Models\Order;
use App\Models\Payment;
use App\Services\Integrations\MidtransService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SyncMidtransPaymentAction
{
    public function __construct(
        private readonly MidtransService $midtrans,
        private readonly ApplyMidtransPaymentStatusAction $applyStatus,
    ) {}

    public function execute(Payment $payment, string $eventType = 'admin_sync'): void
    {
        $payload = $this->midtrans->transactionStatus((string) $payment->midtrans_order_id);
        $error = $this->applyPayload($payment, $payload, $eventType);
        if ($error) {
            throw ValidationException::withMessages(['payment' => $error]);
        }
    }

    public function applyPayload(Payment $payment, array $payload, string $eventType, ?string $payloadHash = null): ?string
    {
        return DB::transaction(function () use ($payment, $payload, $eventType, $payloadHash): ?string {
            Order::query()->whereKey($payment->order_id)->lockForUpdate()->firstOrFail();
            $payment = Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
            $payloadHash ??= hash('sha256', json_encode([$eventType, $payment->id, now()->toISOString(), $payload], JSON_THROW_ON_ERROR));
            if ($payment->logs()->where('payload_hash', $payloadHash)->exists()) {
                return null;
            }
            $error = null;
            foreach (['order_id', 'transaction_status', 'gross_amount', 'status_code'] as $field) {
                if (! isset($payload[$field]) || ! (is_string($payload[$field]) || is_int($payload[$field]) || is_float($payload[$field])) || blank($payload[$field])) {
                    $error = 'Respons Midtrans tidak lengkap atau tidak valid.';
                    $eventType = 'rejected_invalid_payload';
                    break;
                }
            }
            foreach (['transaction_status', 'fraud_status', 'transaction_id', 'payment_type'] as $field) {
                if (isset($payload[$field]) && ! is_string($payload[$field])) {
                    $error = 'Respons Midtrans tidak lengkap atau tidak valid.';
                    $eventType = 'rejected_invalid_payload';
                }
            }
            if (! $error && (string) $payload['order_id'] !== (string) $payment->midtrans_order_id) {
                $error = 'Order ID Midtrans tidak cocok dengan payment lokal.';
                $eventType = 'rejected_reference_mismatch';
            }
            if (! $error && ! $this->midtrans->amountMatches($payload['gross_amount'], $payment)) {
                $error = 'Nominal Midtrans tidak cocok dengan payment lokal.';
                $eventType = 'rejected_amount_mismatch';
            }
            $payment->logs()->create([
                'order_id' => $payment->order_id, 'provider' => $payment->payment_provider,
                'event_type' => $eventType, 'transaction_status' => is_string($payload['transaction_status'] ?? null) ? $payload['transaction_status'] : null,
                'payload_hash' => $payloadHash, 'payload' => $payload, 'processed_at' => now(),
            ]);
            if (! $error) {
                $this->applyStatus->execute($payment, (string) $payload['transaction_status'], $payload['fraud_status'] ?? null, $payload);
            }

            return $error;
        });
    }
}
