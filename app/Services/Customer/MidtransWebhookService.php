<?php

namespace App\Services\Customer;

use App\Actions\Payments\SyncMidtransPaymentAction;
use App\Models\Payment;
use App\Services\Integrations\MidtransService;
use Symfony\Component\HttpKernel\Exception\HttpException;

class MidtransWebhookService
{
    public function __construct(
        private readonly MidtransService $midtrans,
        private readonly SyncMidtransPaymentAction $syncPayment,
    ) {}

    public function handle(array $payload): void
    {
        foreach (['order_id', 'status_code', 'gross_amount', 'signature_key', 'transaction_status'] as $field) {
            if (! isset($payload[$field]) || ! is_string($payload[$field]) || blank($payload[$field])) {
                throw new HttpException(422, "Missing or invalid Midtrans field {$field}.");
            }
        }
        if (! $this->midtrans->validateNotificationSignature($payload)) {
            throw new HttpException(403, 'Invalid Midtrans signature.');
        }
        $payment = Payment::query()->where('midtrans_order_id', $payload['order_id'])->firstOrFail();
        $this->syncPayment->applyPayload($payment, $payload, $payload['transaction_status'], hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR)));
    }
}
