<?php

namespace App\Services\Admin;

use App\Actions\Payments\CancelMidtransPaymentAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ShippingStatus;
use App\Models\Order;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderManagementService
{
    use ResolvesAdminPagination;

    public function __construct(private readonly NotificationService $notifications) {}

    public function indexData(Request $request): array
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'payment_status' => $request->string('payment_status')->toString(),
            'order_status' => $request->string('order_status')->toString(),
            'shipping_status' => $request->string('shipping_status')->toString(),
            'courier' => $request->string('courier')->toString(),
            'voucher_code' => $request->string('voucher_code')->toString(),
            'date_from' => $request->string('date_from')->toString(),
            'date_to' => $request->string('date_to')->toString(),
            'sort' => $request->string('sort')->toString(),
            'direction' => $request->string('direction')->toString(),
        ];
        $sort = in_array($filters['sort'], ['date', 'customer'], true) ? $filters['sort'] : 'date';
        $direction = $filters['direction'] === 'asc' ? 'asc' : 'desc';
        $filters['sort'] = $sort;
        $filters['direction'] = $direction;

        return [
            'orders' => Order::query()
                ->with('shipment:id,order_id,courier_company,courier_type,waybill_id')
                ->when($filters['search'] !== '', fn ($query) => $query->where(fn ($query) => $query
                    ->where('order_number', 'like', "%{$filters['search']}%")
                    ->orWhere('customer_name', 'like', "%{$filters['search']}%")
                    ->orWhere('customer_email', 'like', "%{$filters['search']}%")
                    ->orWhere('customer_phone', 'like', "%{$filters['search']}%")))
                ->when($filters['payment_status'] !== '', fn ($query) => $query->where('payment_status', $filters['payment_status']))
                ->when($filters['order_status'] !== '', fn ($query) => $query->where('order_status', $filters['order_status']))
                ->when($filters['shipping_status'] !== '', fn ($query) => $query->where('shipping_status', $filters['shipping_status']))
                ->when($filters['voucher_code'] !== '', fn ($query) => $query->where('voucher_code', $filters['voucher_code']))
                ->when($filters['date_from'] !== '', fn ($query) => $query->whereDate('created_at', '>=', $filters['date_from']))
                ->when($filters['date_to'] !== '', fn ($query) => $query->whereDate('created_at', '<=', $filters['date_to']))
                ->when($filters['courier'] !== '', fn ($query) => $query->whereHas('shipment', fn ($query) => $query->where('courier_company', $filters['courier'])))
                ->when($sort === 'date', fn ($query) => $query->orderBy('created_at', $direction))
                ->when($sort === 'customer', fn ($query) => $query->orderBy('customer_name', $direction))
                ->orderByDesc('id')
                ->paginate($this->perPage($request))
                ->withQueryString()
                ->through(fn (Order $order): array => $this->row($order)),
            'filters' => $filters,
            'options' => $this->options(),
            'stats' => [
                'total' => Order::query()->count(),
                'new_orders' => Order::query()->where('order_status', 'pending_payment')->count(),
                'processing' => Order::query()->where('order_status', 'processing')->count(),
                'shipped' => Order::query()->where('shipping_status', ShippingStatus::InTransit->value)->count(),
                'completed' => Order::query()->where('order_status', OrderStatus::Completed->value)->count(),
                'cancelled' => Order::query()->where('order_status', OrderStatus::Cancelled->value)->count(),
            ],
        ];
    }

    public function detailData(Order $order): array
    {
        $order->load([
            'items.variant:id,sku,net_weight',
            'items.stockMovements',
            'statusHistory' => fn ($query) => $query->latest('id'),
            'address',
            'payment.logs' => fn ($query) => $query->latest(),
            'shipment.trackings' => fn ($query) => $query->latest('happened_at'),
        ]);

        return [
            'order' => $this->detail($order),
            'options' => $this->options(),
        ];
    }

    public function updateStatus(Order $order, string $target, ?string $reason = null): void
    {
        if ($target === OrderStatus::Cancelled->value) {
            if (! in_array($order->payment_status, ['pending', 'manual_review'], true)) {
                throw ValidationException::withMessages(['status' => 'Pesanan paid tidak dapat dibatalkan melalui perubahan status.']);
            }
            try {
                app(CancelMidtransPaymentAction::class)->execute($order, 'admin_cancel');
            } catch (ValidationException $exception) {
                throw ValidationException::withMessages(['status' => $exception->errors()['payment'] ?? [$exception->getMessage()]]);
            }

            return;
        }
        DB::transaction(function () use ($order, $target, $reason): void {
            $order = Order::query()->with('shipment')->whereKey($order->id)->lockForUpdate()->firstOrFail();
            if ($target === OrderStatus::ShipmentFailed->value) {
                if (! in_array($target, $this->allowedStatuses($order), true) || blank($reason)) {
                    throw ValidationException::withMessages(['status' => 'Alasan gagal kirim hanya dapat dicatat untuk kendala final kurir.']);
                }
                $order->recordStatusHistory($order->order_status, trim($reason), 'failure_note');

                return;
            }
            if ($order->order_status === $target && in_array($target, [OrderStatus::Processing->value, OrderStatus::ReadyToShip->value, OrderStatus::Completed->value], true)) {
                return;
            }
            if (! in_array($target, $this->allowedStatuses($order), true)) {
                throw ValidationException::withMessages(['status' => 'Perubahan status tidak sesuai flow order.']);
            }
            $payload = ['order_status' => $target];
            if ($target === OrderStatus::Completed->value) {
                $payload['completed_at'] = $order->completed_at ?? now();
            }
            $order->update($payload);
            $this->notifications->forOrder($order, 'Order status updated', "Order {$order->order_number} sekarang berstatus {$target}.", 'order');
        });
    }

    public function allowedStatuses(Order $order): array
    {
        if ($order->payment_status !== PaymentStatus::Paid->value) {
            return [];
        }

        return match ($order->order_status) {
            OrderStatus::Paid->value => [OrderStatus::Processing->value],
            OrderStatus::Processing->value => [OrderStatus::ReadyToShip->value],
            OrderStatus::Delivered->value => $order->shipping_status === 'delivered' && $order->shipment?->shipping_status === 'delivered' ? [OrderStatus::Completed->value] : [],
            OrderStatus::ShipmentFailed->value => $order->shipment?->biteship_order_id
                && in_array($order->shipment->shipping_status, ['failed', 'cancelled', 'lost', 'returned', 'disposed'], true)
                    ? [OrderStatus::ShipmentFailed->value] : [],
            default => [],
        };
    }

    private function canCreateShipment(Order $order): bool
    {
        return $order->payment_status === PaymentStatus::Paid->value
            && $order->order_status === OrderStatus::ReadyToShip->value
            && $order->shipment && ! $order->shipment->booking_uncertain
            && blank($order->shipment->biteship_order_id)
            && in_array($order->shipment->shipping_status, ['not_created', 'failed'], true)
            && filled($order->shipment->courier_company) && filled($order->shipment->courier_type)
            && $order->address && filled($order->address->full_address)
            && (filled($order->address->postal_code) || filled($order->address->biteship_area_id))
            && is_numeric($order->address->latitude) && is_numeric($order->address->longitude)
            && abs((float) $order->address->latitude) <= 90 && abs((float) $order->address->longitude) <= 180
            && $order->items->isNotEmpty();
    }

    private function shippingIssue(Order $order): ?array
    {
        $shipment = $order->shipment;
        if (! $shipment?->biteship_order_id || ! in_array($shipment->shipping_status, ShippingStatus::issueValues(), true)) {
            return null;
        }
        $status = $shipment->shipping_status;

        return [
            'status' => $status,
            'label' => match ($status) {
                'cancelled' => 'Pengiriman dibatalkan kurir',
                'lost' => 'Paket dinyatakan hilang',
                'returned' => 'Paket dikembalikan kurir',
                'problem' => 'Pengiriman memerlukan pemeriksaan',
                'on_hold' => 'Pengiriman ditahan sementara',
                'return_in_transit' => 'Paket dalam perjalanan kembali',
                'disposed' => 'Paket dimusnahkan kurir',
                default => 'Pengiriman gagal',
            },
            'description' => in_array($status, ['problem', 'on_hold', 'return_in_transit'], true)
                ? 'Kurir masih memeriksa kendala pengiriman.'
                : 'Kurir melaporkan kendala final. Pembayaran dan riwayat pengiriman tetap dipertahankan.',
            'reason' => $shipment->trackings->firstWhere('status', $status)?->description ?? $shipment->failed_reason,
        ];
    }

    public function updateNotes(Order $order, ?string $notes): void
    {
        $order->update(['notes' => $notes]);
    }

    public function options(): array
    {
        return [
            'paymentStatuses' => PaymentStatus::values(),
            'orderStatuses' => OrderStatus::values(),
            'shippingStatuses' => ShippingStatus::values(),
        ];
    }

    public function row(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_phone' => $order->customer_phone,
            'grand_total' => $order->grand_total,
            'payment_status' => $order->payment_status,
            'order_status' => $order->order_status,
            'shipping_status' => $order->shipping_status,
            'courier' => $order->shipment?->courier_company,
            'waybill_id' => $order->shipment?->waybill_id,
            'created_at' => $order->created_at?->toFormattedDateString(),
        ];
    }

    private function detail(Order $order): array
    {
        return [
            ...$this->row($order),
            'created_at' => $order->created_at?->toIso8601String(),
            'allowedStatuses' => $this->allowedStatuses($order),
            'can_create_shipment' => $this->canCreateShipment($order),
            'booking_uncertain' => (bool) $order->shipment?->booking_uncertain,
            'shipping_issue' => $this->shippingIssue($order),
            'status_history' => $order->statusHistory->map(fn ($history): array => [
                'id' => $history->id, 'status' => $history->status,
                'previous_status' => $history->previous_status,
                'reason' => $history->reason, 'actor' => $history->actor,
                'source' => $history->source, 'event_type' => $history->event_type,
                'created_at' => $history->created_at?->toIso8601String(),
            ])->values(),
            'subtotal' => $order->subtotal,
            'discount_amount' => $order->discount_amount,
            'shipping_cost' => $order->shipping_cost,
            'service_fee' => $order->service_fee,
            'rounding_adjustment' => round((float) $order->grand_total - max(0, (float) $order->subtotal + (float) $order->shipping_cost + (float) $order->service_fee - (float) $order->discount_amount), 2),
            'insurance_cost' => $order->insurance_cost,
            'voucher_code' => $order->voucher_code,
            'notes' => $order->notes,
            'paid_at' => $order->paid_at?->toIso8601String(),
            'cancelled_at' => $order->cancelled_at?->toIso8601String(),
            'expired_at' => $order->expired_at?->toIso8601String(),
            'completed_at' => $order->completed_at?->toIso8601String(),
            'no_return_refund_agreed' => $order->no_return_refund_agreed,
            'no_return_refund_agreed_at' => $order->no_return_refund_agreed_at?->toIso8601String(),
            'items' => $order->items->map(fn ($item): array => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'product_name' => $item->product_name,
                'product_sku' => $item->product_sku,
                'variant_sku' => $item->variant_sku,
                'net_weight' => $item->net_weight,
                'grind_type' => $item->grind_type,
                'shipping_weight_gram' => $item->shipping_weight_gram,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
                'weight' => $item->shipping_weight_gram,
                'product_image_url' => $item->product_image_url,
                'stock_movements' => $item->stockMovements->map(fn ($movement): array => [
                    'id' => $movement->id, 'quantity' => $movement->quantity,
                    'stock_before' => $movement->stock_before, 'stock_after' => $movement->stock_after,
                    'created_at' => $movement->created_at?->toIso8601String(),
                ])->values(),
            ])->values(),
            'address' => $order->address,
            'payment' => $order->payment,
            'payment_logs' => $order->payment?->logs?->map(fn ($log): array => [
                'id' => $log->id,
                'event_type' => $log->event_type,
                'transaction_status' => $log->transaction_status,
                'processed_at' => $log->processed_at?->toIso8601String(),
                'created_at' => $log->created_at?->toIso8601String(),
            ])->values() ?? [],
            'shipment' => $order->shipment,
            'trackings' => $order->shipment?->trackings?->map(fn ($tracking): array => [
                'id' => $tracking->id,
                'status' => $tracking->status,
                'description' => $tracking->description,
                'location' => $tracking->location,
                'happened_at' => $tracking->happened_at?->toIso8601String(),
            ])->values() ?? [],
        ];
    }
}
