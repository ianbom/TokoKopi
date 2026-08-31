<?php

namespace App\Actions\Stock;

use App\Models\Order;

class FinalizeReservedStockAction
{
    public function execute(Order $order, ?string $reference = null): void
    {
        $order = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);

        if ($order->stock_finalized_at) {
            return;
        }

        $order->forceFill(['stock_finalized_at' => now()])->save();
    }
}
