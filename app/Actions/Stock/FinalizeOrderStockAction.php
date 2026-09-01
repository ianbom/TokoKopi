<?php

namespace App\Actions\Stock;

use App\Models\Order;
use App\Models\Stock;
use DomainException;

class FinalizeOrderStockAction
{
    public function execute(Order $order): void
    {
        $order = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);
        $quantitiesByVariant = $order->items->groupBy('product_variant_id')->map(
            fn ($items): int => $items->sum('quantity'),
        );

        if ($quantitiesByVariant->has(null)) {
            throw new DomainException('Varian produk pada pesanan tidak tersedia.');
        }

        $variantIds = $quantitiesByVariant->keys()->sort()->values();
        $stocks = Stock::query()
            ->whereIn('product_variant_id', $variantIds)
            ->orderBy('product_variant_id')
            ->lockForUpdate()
            ->get()
            ->keyBy('product_variant_id');

        foreach ($quantitiesByVariant as $variantId => $quantity) {
            $stock = $stocks->get($variantId);

            if (! $stock || $stock->quantity < $quantity) {
                throw new DomainException('Stok tidak cukup untuk menyelesaikan pembayaran pesanan ini.');
            }
        }

        foreach ($quantitiesByVariant as $variantId => $quantity) {
            $stocks->get($variantId)->decrement('quantity', $quantity);
        }
    }
}
