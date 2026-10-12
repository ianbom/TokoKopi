<?php

namespace App\Actions\Stock;

use App\Models\Order;
use App\Models\Stock;
use DomainException;
use Illuminate\Support\Facades\DB;

class ReleaseOrderStockAction
{
    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $order = Order::query()->with('items.stockMovements')->lockForUpdate()->findOrFail($order->id);
            if ($order->paid_at || in_array($order->payment_status, ['paid', 'refunded', 'partially_refunded'], true)) {
                return;
            }
            $items = $order->items->filter(fn ($item) => $item->stockMovements->contains('movement_type', 'deduction')
                && ! $item->stockMovements->contains('movement_type', 'release'))->sortBy('id');
            $deductions = $items->map(fn ($item) => $item->stockMovements->firstWhere('movement_type', 'deduction'));
            $stocks = Stock::query()->whereIn('product_variant_id', $deductions->pluck('product_variant_id')->unique()->sort()->values())
                ->orderBy('product_variant_id')->lockForUpdate()->get()->keyBy('product_variant_id');
            foreach ($items as $item) {
                $deduction = $item->stockMovements->firstWhere('movement_type', 'deduction');
                $stock = $stocks->get($deduction->product_variant_id);
                if (! $stock || $deduction->quantity >= 0) {
                    throw new DomainException('Stok pesanan tidak dapat dikembalikan. Riwayat stok perlu diperiksa admin.');
                }
                $quantity = -$deduction->quantity;
                $before = $stock->quantity;
                $stock->increment('quantity', $quantity);
                $item->stockMovements()->create([
                    'product_variant_id' => $deduction->product_variant_id,
                    'movement_type' => 'release',
                    'quantity' => $quantity,
                    'stock_before' => $before,
                    'stock_after' => $before + $quantity,
                ]);
            }
        });
    }
}
