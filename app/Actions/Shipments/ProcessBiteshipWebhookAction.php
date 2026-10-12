<?php

namespace App\Actions\Shipments;

use App\Models\BiteshipWebhookLog;
use App\Models\Shipment;
use App\Services\Admin\ShipmentManagementService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessBiteshipWebhookAction
{
    public function __construct(private readonly ShipmentManagementService $shipments) {}

    public function execute(BiteshipWebhookLog $receipt): void
    {
        DB::transaction(function () use ($receipt): void {
            $receipt = BiteshipWebhookLog::query()->whereKey($receipt->id)->lockForUpdate()->firstOrFail();
            if ($receipt->processed_at) {
                return;
            }
            if (! $receipt->biteship_order_id && ! $receipt->biteship_tracking_id && ! $receipt->waybill_id) {
                return;
            }
            $shipment = Shipment::query()->where(function ($query) use ($receipt): void {
                $query->when($receipt->biteship_order_id, fn ($query) => $query->orWhere('biteship_order_id', $receipt->biteship_order_id))
                    ->when($receipt->biteship_tracking_id, fn ($query) => $query->orWhere('biteship_tracking_id', $receipt->biteship_tracking_id))
                    ->when($receipt->waybill_id, fn ($query) => $query->orWhere('waybill_id', $receipt->waybill_id));
            })->first();
            if (! $shipment) {
                return;
            }
            foreach (['biteship_order_id', 'biteship_tracking_id', 'waybill_id'] as $field) {
                if (filled($receipt->$field) && filled($shipment->$field) && $receipt->$field !== $shipment->$field) {
                    return;
                }
            }
            $payload = $receipt->payload;
            $courier = is_array($payload['courier'] ?? null) ? $payload['courier'] : [];
            $this->shipments->applyBiteshipPayload($shipment, [
                ...$payload,
                'id' => $receipt->biteship_order_id,
                'courier' => [
                    ...$courier,
                    'tracking_id' => $receipt->biteship_tracking_id,
                    'waybill_id' => $receipt->waybill_id,
                    'company' => Arr::get($payload, 'courier_company') ?? ($courier['company'] ?? null),
                    'type' => Arr::get($payload, 'courier_type') ?? ($courier['type'] ?? null),
                    'link' => Arr::get($payload, 'courier_tracking_link') ?? ($courier['link'] ?? null),
                ],
            ], 'biteship_webhook');
            $receipt->update(['processed_at' => now()]);
        });
    }

    public function replay(?Shipment $shipment = null): array
    {
        $stats = ['checked' => 0, 'processed' => 0, 'failed' => 0];
        BiteshipWebhookLog::query()->whereNull('processed_at')
            ->when($shipment, fn ($query) => $query->where(fn ($query) => $query
                ->where('biteship_order_id', $shipment->biteship_order_id)
                ->when($shipment->biteship_tracking_id, fn ($query) => $query->orWhere('biteship_tracking_id', $shipment->biteship_tracking_id))
                ->when($shipment->waybill_id, fn ($query) => $query->orWhere('waybill_id', $shipment->waybill_id))))
            ->chunkById(50, function ($receipts) use (&$stats): void {
                foreach ($receipts as $receipt) {
                    $stats['checked']++;
                    try {
                        $this->execute($receipt);
                        $stats['processed'] += $receipt->refresh()->processed_at ? 1 : 0;
                    } catch (\Throwable $exception) {
                        $stats['failed']++;
                        Log::warning('biteship_replay_failed', ['receipt_id' => $receipt->id, 'exception_type' => $exception::class]);
                    }
                }
            });

        return $stats;
    }
}
