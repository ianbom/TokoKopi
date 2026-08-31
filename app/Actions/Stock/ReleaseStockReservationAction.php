<?php

namespace App\Actions\Stock;

use App\Models\Order;
use App\Models\Stock;

class ReleaseStockReservationAction
{
    public function execute(Order $order): void
    {
        $order = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);

        if ($order->stock_released_at || $order->stock_finalized_at) {
            return;
        }

        foreach ($order->items as $item) {
            if (! $item->product_variant_id) {
                continue;
            }

            $stock = Stock::query()->where('product_variant_id', $item->product_variant_id)->lockForUpdate()->first();

            if (! $stock) {
                continue;
            }

            $stock->increment('quantity', $item->quantity);
        }

        $order->forceFill(['stock_released_at' => now()])->save();
    }
}
