<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'product_id',
    'sku',
    'net_weight',
    'grind_type',
    'regular_price',
    'sale_price',
    'shipping_weight_gram',
    'image_url',
    'is_active',
])]
class ProductVariant extends Model
{
    use SoftDeletes;

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'regular_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'shipping_weight_gram' => 'integer',
        ];
    }
}
