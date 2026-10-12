<?php

namespace App\Actions\Payments;

use App\Actions\Stock\FinalizeOrderStockAction;
use App\Actions\Stock\ReleaseOrderStockAction;
use App\Actions\Vouchers\ReleaseVoucherReservationAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Notifications\NotificationService;
use DomainException;
use Illuminate\Support\Facades\DB;

class ApplyMidtransPaymentStatusAction
{
    public function __construct(
        private readonly FinalizeOrderStockAction $finalizeStock,
        private readonly ReleaseVoucherReservationAction $releaseVoucher,
        private readonly ReleaseOrderStockAction $releaseStock,
        private readonly NotificationService $notifications,
    ) {}

    public function execute(Payment $payment, string $transactionStatus, ?string $fraudStatus = null, array $payload = []): void
    {
        DB::transaction(function () use ($payment, $transactionStatus, $fraudStatus, $payload): void {
            $order = Order::query()->whereKey($payment->order_id)->lockForUpdate()->firstOrFail();
            $payment = Payment::query()
                ->lockForUpdate()
                ->findOrFail($payment->id);
            $payment->setRelation('order', $order);
            $paidEvent = $transactionStatus === 'settlement' || ($transactionStatus === 'capture' && $fraudStatus === 'accept');
            $current = $order->payment_status;
            $uncertainSnap = (bool) ($payment->raw_response['snap_creation_uncertain'] ?? false);
            if (! in_array($transactionStatus, ['settlement', 'capture', 'pending', 'authorize', 'expire', 'cancel', 'deny', 'failure', 'refund', 'partial_refund'], true)
                || $current === PaymentStatus::Refunded->value
                || ($current === PaymentStatus::PartiallyRefunded->value && $transactionStatus !== 'refund')
                || ($current === PaymentStatus::Paid->value && ! $paidEvent && ! in_array($transactionStatus, ['refund', 'partial_refund'], true))
                || ($current === PaymentStatus::ManualReview->value && ! $uncertainSnap && filled($payment->failure_reason) && in_array($transactionStatus, ['pending', 'authorize'], true))
                || (in_array($current, ['cancelled', 'expired', 'failed'], true) && ! $paidEvent)) {
                return;
            }
            $payment->update([
                'midtrans_transaction_id' => $payload['transaction_id'] ?? $payment->midtrans_transaction_id,
                'payment_method' => $payload['payment_type'] ?? $payment->payment_method,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus ?? $payment->fraud_status,
                'last_synced_at' => now(),
                'raw_response' => $payload ?: $payment->raw_response,
                'failure_reason' => $uncertainSnap && in_array($transactionStatus, ['pending', 'authorize'], true) ? null : $payment->failure_reason,
            ]);
            if ($paidEvent && (in_array($current, ['cancelled', 'expired', 'failed'], true)
                || in_array($order->order_status, ['cancelled', 'payment_expired', 'payment_failed'], true))) {
                $order->update(['payment_status' => PaymentStatus::ManualReview->value]);
                $payment->update(['transaction_status' => 'manual_review', 'failure_reason' => 'Pembayaran diterima setelah pesanan ditutup. Perlu rekonsiliasi admin.']);

                return;
            }

            match ($transactionStatus) {
                'settlement' => $this->markPaid($payment),
                'capture' => match ($fraudStatus) {
                    'accept' => $this->markPaid($payment),
                    'challenge' => $this->markManualReview($payment),
                    'deny' => $this->markFailed($payment, PaymentStatus::Failed, OrderStatus::Cancelled),
                    default => $this->markManualReview($payment),
                },
                'pending', 'authorize' => $this->markPending($payment),
                'expire' => $this->markFailed($payment, PaymentStatus::Expired, OrderStatus::PaymentExpired),
                'cancel' => $this->markFailed($payment, PaymentStatus::Cancelled, OrderStatus::Cancelled),
                'deny', 'failure' => $this->markFailed($payment, PaymentStatus::Failed, OrderStatus::PaymentFailed),
                'refund' => $this->markRefunded($payment, PaymentStatus::Refunded, OrderStatus::Refunded),
                'partial_refund' => $this->markRefunded($payment, PaymentStatus::PartiallyRefunded, null),
                default => null,
            };
        });
    }

    private function markPaid(Payment $payment): void
    {
        $order = $payment->order;

        if ($order->payment_status === PaymentStatus::Paid->value) {
            return;
        }

        try {
            $this->finalizeStock->execute($order);
        } catch (DomainException $exception) {
            $order->update(['payment_status' => PaymentStatus::ManualReview->value, 'order_status' => OrderStatus::PendingPayment->value]);
            $payment->update(['transaction_status' => 'manual_review', 'failure_reason' => $exception->getMessage()]);
            $this->notifications->forOrder($order, 'Payment requires review', "Payment untuk order {$order->order_number} diterima, tetapi stok tidak cukup untuk difinalisasi.", 'payment');

            return;
        }

        $order->update([
            'payment_status' => PaymentStatus::Paid->value,
            'order_status' => in_array($order->order_status, OrderStatus::fulfillmentValues(), true) ? $order->order_status : OrderStatus::Paid->value,
            'paid_at' => $order->paid_at ?? now(),
        ]);
        $payment->update(['paid_at' => $payment->paid_at ?? now(), 'failure_reason' => null]);
        $this->notifications->forOrder($order, 'Payment received', "Payment untuk order {$order->order_number} berhasil diterima.", 'payment');
    }

    private function markManualReview(Payment $payment): void
    {
        if ($payment->order->payment_status === PaymentStatus::Paid->value) {
            return;
        }

        $payment->order->update(['payment_status' => PaymentStatus::ManualReview->value, 'order_status' => OrderStatus::PendingPayment->value]);
        $payment->update(['transaction_status' => 'manual_review', 'failure_reason' => 'Pembayaran memerlukan pemeriksaan fraud Midtrans.']);
    }

    private function markPending(Payment $payment): void
    {
        if ($payment->order->payment_status !== PaymentStatus::Paid->value) {
            $payment->order->update(['payment_status' => PaymentStatus::Pending->value, 'order_status' => OrderStatus::PendingPayment->value]);
        }
    }

    private function markFailed(Payment $payment, PaymentStatus $paymentStatus, OrderStatus $orderStatus): void
    {
        $order = $payment->order;

        if ($order->payment_status === PaymentStatus::Paid->value) {
            return;
        }

        $this->releaseStock->execute($order);
        $this->releaseVoucher->execute($order);
        $order->update([
            'payment_status' => $paymentStatus->value,
            'order_status' => $orderStatus->value,
            'expired_at' => $paymentStatus === PaymentStatus::Expired ? now() : $order->expired_at,
            'cancelled_at' => $paymentStatus !== PaymentStatus::Expired ? now() : $order->cancelled_at,
        ]);
        $this->notifications->forOrder($order, 'Payment updated', "Payment untuk order {$order->order_number} berstatus {$paymentStatus->value}.", 'payment');
    }

    private function markRefunded(Payment $payment, PaymentStatus $paymentStatus, ?OrderStatus $orderStatus): void
    {
        $payload = ['payment_status' => $paymentStatus->value];

        if ($orderStatus) {
            $payload['order_status'] = $orderStatus->value;
        }

        $payment->order->update($payload);
    }
}
