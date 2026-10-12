<?php

namespace App\Actions\Payments;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SyncExpiredMidtransPaymentsAction
{
    public function __construct(
        private readonly SyncMidtransPaymentAction $syncPayment,
        private readonly CancelMidtransPaymentAction $cancelPayment,
    ) {}

    public function execute(): array
    {
        $stats = ['checked' => 0, 'synced' => 0, 'failed' => 0];

        Payment::query()
            ->with('order')
            ->where(fn ($query) => $query->where(fn ($query) => $query->whereIn('transaction_status', ['pending', 'authorize', 'manual_review'])->where('expires_at', '<=', now()))
                ->orWhere(fn ($query) => $query->where('transaction_status', 'manual_review')->where('raw_response->snap_creation_uncertain', true)))
            ->whereHas('order', fn ($query) => $query->whereIn('payment_status', [PaymentStatus::Pending->value, PaymentStatus::ManualReview->value]))
            ->orderBy('id')
            ->chunkById(50, function ($payments) use (&$stats): void {
                foreach ($payments as $payment) {
                    $stats['checked']++;

                    try {
                        $this->reconcile($payment);
                        $stats['synced']++;
                    } catch (\Throwable $exception) {
                        $stats['failed']++;
                        Log::warning('midtrans_expiry_sync_failed', [
                            'payment_id' => $payment->id,
                            'exception_type' => $exception::class,
                        ]);
                    }
                }
            });

        return $stats;
    }

    private function reconcile(Payment $payment): void
    {
        if (! $payment->expires_at || $payment->expires_at->isFuture()) {
            $this->syncPayment->execute($payment, 'scheduled_expiry_sync');

            return;
        }

        try {
            $this->cancelPayment->execute($payment->order, 'scheduled_expiry_sync');
        } catch (ValidationException $exception) {
            if (in_array($payment->order->refresh()->payment_status, ['pending', 'manual_review'], true)) {
                throw $exception;
            }
        }
    }
}
