<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'idempotency_key', 'midtrans_order_id', 'environment', 'payment_method', 'request_hash', 'snap_request_hash', 'status', 'snap_response', 'expires_at', 'order_id'])]
#[Hidden(['snap_response'])]
class CheckoutAttempt extends Model
{
    protected function casts(): array
    {
        return ['snap_response' => 'encrypted:array', 'expires_at' => 'datetime'];
    }
}
