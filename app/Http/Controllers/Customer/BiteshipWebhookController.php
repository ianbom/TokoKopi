<?php

namespace App\Http\Controllers\Customer;

use App\Actions\Shipments\ProcessBiteshipWebhookAction;
use App\Http\Controllers\Controller;
use App\Models\BiteshipWebhookLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class BiteshipWebhookController extends Controller
{
    public function __invoke(Request $request, ProcessBiteshipWebhookAction $processor): JsonResponse
    {
        if (! $this->hasValidSecret($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $request->validate([
            'event' => ['nullable', 'string', 'max:255'],
            'id' => ['nullable', 'string', 'max:255'],
            'order_id' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:100'],
            'courier' => ['nullable', 'array'],
            'courier.status' => ['nullable', 'string', 'max:100'],
            'courier_tracking_id' => ['nullable', 'string', 'max:255'],
            'courier_waybill_id' => ['nullable', 'string', 'max:255'],
            'courier.tracking_id' => ['nullable', 'string', 'max:255'],
            'courier.waybill_id' => ['nullable', 'string', 'max:255'],
            'tracking' => ['nullable', 'array'],
            'tracking.status' => ['nullable', 'string', 'max:100'],
            'message' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'courier.routing_code' => ['nullable', 'string', 'max:255'],
        ]);

        $payload = $request->json()->all() ?: $request->all();
        $payloadHash = hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR));

        if (BiteshipWebhookLog::query()->where('payload_hash', $payloadHash)->whereNotNull('processed_at')->exists()) {
            Log::info('duplicate_webhook_ignored', ['provider' => 'biteship']);

            return response()->json(['success' => true, 'duplicate' => true]);
        }

        $event = Arr::get($payload, 'event');
        $orderId = Arr::get($payload, 'order_id') ?? Arr::get($payload, 'id');
        $trackingId = Arr::get($payload, 'courier_tracking_id') ?? Arr::get($payload, 'courier.tracking_id');
        $waybillId = Arr::get($payload, 'courier_waybill_id') ?? Arr::get($payload, 'courier.waybill_id');

        $log = BiteshipWebhookLog::query()->firstOrCreate(['payload_hash' => $payloadHash], [
            'event_type' => $event,
            'biteship_order_id' => $orderId,
            'biteship_tracking_id' => $trackingId,
            'waybill_id' => $waybillId,
            'payload_hash' => $payloadHash,
            'payload' => $payload,
        ]);

        $processor->execute($log);

        return response()->json(['success' => true]);
    }

    private function hasValidSecret(Request $request): bool
    {
        $secret = config('services.biteship.webhook_secret');

        if (! filled($secret)) {
            if (app()->environment(['local', 'testing']) && config('services.biteship.webhook_allow_test_bypass')) {
                return true;
            }

            Log::warning('biteship_webhook_secret_missing');

            return false;
        }

        $given = $request->header('X-Biteship-Webhook-Secret')
            ?: $request->header('X-Webhook-Secret')
            ?: $request->bearerToken();

        return is_string($given) && hash_equals($secret, $given);
    }
}
