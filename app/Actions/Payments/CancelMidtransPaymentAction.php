<?php

namespace App\Actions\Payments;

use App\Models\Order;
use App\Models\Payment;
use App\Services\Integrations\MidtransService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelMidtransPaymentAction
{
    public function __construct(
        private readonly MidtransService $midtrans,
        private readonly SyncMidtransPaymentAction $syncPayment,
    ) {}

    public function execute(Order $order, string $source = 'customer_cancel'): void
    {
        $order->refresh()->load('payment');
        $payment = $order->payment;
        if (! $payment || ! in_array($order->payment_status, ['pending', 'manual_review'], true) || blank($payment->midtrans_order_id)) {
            throw ValidationException::withMessages(['payment' => 'Pesanan belum dapat dibatalkan. Status pembayaran harus dipastikan terlebih dahulu.']);
        }
        $payload = $this->midtrans->findTransactionStatus($payment->midtrans_order_id);
        if ($payload === null) {
            if (blank($payment->midtrans_snap_token)) {
                throw ValidationException::withMessages(['payment' => 'Sesi pembayaran belum diketahui. Lakukan rekonsiliasi sebelum membatalkan.']);
            }
            $this->midtrans->cancelSnapSession($payment->midtrans_snap_token);
            $payload = ['order_id' => $payment->midtrans_order_id, 'status_code' => '200', 'transaction_status' => 'cancel', 'gross_amount' => $payment->gross_amount, 'snap_session_cancelled' => true];
        } else {
            if (! in_array((string) ($payload['status_code'] ?? ''), ['200', '201', '202', '407'], true)) {
                throw ValidationException::withMessages(['payment' => 'Respons status Midtrans tidak valid. Pesanan tidak diubah.']);
            }
            if (($payload['order_id'] ?? null) !== $payment->midtrans_order_id || ! is_scalar($payload['gross_amount'] ?? null)
                || ! $this->midtrans->amountMatches($payload['gross_amount'], $payment)) {
                throw ValidationException::withMessages(['payment' => 'Referensi atau nominal status Midtrans tidak cocok.']);
            }
            if (! in_array($payload['transaction_status'] ?? null, ['pending', 'authorize'], true)) {
                $error = $this->syncPayment->applyPayload($payment, $payload, 'cancel_status_check');
                throw ValidationException::withMessages(['payment' => $error ?? 'Status pembayaran sudah final. Pembatalan tidak dapat dilanjutkan.']);
            }
            $payload = $this->midtrans->cancelTransaction($payment->midtrans_order_id);
            if (! is_scalar($payload['gross_amount'] ?? null) || ! $this->midtrans->amountMatches($payload['gross_amount'], $payment)) {
                throw ValidationException::withMessages(['payment' => 'Nominal pembatalan Midtrans tidak cocok.']);
            }
        }
        $error = DB::transaction(function () use ($order, $payment, $payload, $source): ?string {
            $order = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            $payment = Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
            if (! in_array($order->payment_status, ['pending', 'manual_review'], true)
                || in_array($payment->raw_response['transaction_status'] ?? null, ['settlement', 'capture', 'refund', 'partial_refund'], true)) {
                return 'Status pembayaran berubah selama pembatalan. Lakukan sinkronisasi ulang.';
            }
            $error = $this->syncPayment->applyPayload($payment, $payload, $source);
            if (! $error) {
                $payment->update(['midtrans_snap_token' => null, 'midtrans_redirect_url' => null, 'failure_reason' => null]);
            }

            return $error;
        });
        if ($error) {
            throw ValidationException::withMessages(['payment' => $error]);
        }
    }
}
