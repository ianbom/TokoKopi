<?php

namespace App\Actions\Stock;

use App\Models\Order;
use App\Models\Stock;
use DomainException;
use Illuminate\Support\Facades\DB;

class FinalizeOrderStockAction
{
    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $order = Order::query()->with('items.stockMovements')->lockForUpdate()->findOrFail($order->id);
            if ($order->items->isEmpty() || $order->items->contains(fn ($item) => ! $item->product_variant_id || $item->quantity < 1)) {
                throw new DomainException('Varian dan jumlah produk pada pesanan tidak valid.');
            }
            if ($order->items->contains(fn ($item) => $item->stockMovements->contains('movement_type', 'release'))) {
                throw new DomainException('Stok pesanan sudah dikembalikan. Pesanan memerlukan rekonsiliasi admin.');
            }
            $recorded = $order->items->sum(fn ($item) => $item->stockMovements->where('movement_type', 'deduction')->count());
            if ($recorded === $order->items->count()) {
                return;
            }
            if ($recorded > 0) {
                throw new DomainException('Riwayat finalisasi stok pesanan belum konsisten.');
            }
            $quantitiesByVariant = $order->items->groupBy('product_variant_id')->map(fn ($items): int => $items->sum('quantity'));
            $stocks = Stock::query()->whereIn('product_variant_id', $quantitiesByVariant->keys()->sort()->values())
                ->orderBy('product_variant_id')->lockForUpdate()->get()->keyBy('product_variant_id');
            foreach ($quantitiesByVariant as $variantId => $quantity) {
                $stock = $stocks->get($variantId);
                if (! $stock || $stock->quantity < $quantity) {
                    throw new DomainException('Stok tidak cukup untuk membuat pesanan ini. Perbarui keranjang sebelum checkout.');
                }
            }
            foreach ($order->items->sortBy('id') as $item) {
                $stock = $stocks->get($item->product_variant_id);
                $before = $stock->quantity;
                $stock->decrement('quantity', $item->quantity);
                $item->stockMovements()->create([
                    'product_variant_id' => $item->product_variant_id,
                    'movement_type' => 'deduction',
                    'quantity' => -$item->quantity,
                    'stock_before' => $before,
                    'stock_after' => $before - $item->quantity,
                ]);
            }
        });
    }
}
