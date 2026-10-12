<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_item_id', 'product_variant_id', 'quantity', 'stock_before', 'stock_after'])]
class OrderItemStockMovement extends Model
{
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    protected function casts(): array
    {
        return ['quantity' => 'integer', 'stock_before' => 'integer', 'stock_after' => 'integer'];
    }
}
