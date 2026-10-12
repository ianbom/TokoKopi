<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['order_id', 'actor_id', 'actor', 'source', 'event_type', 'previous_status', 'status', 'reason'])]
class OrderStatusHistory extends Model
{
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
