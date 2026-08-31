<?php

namespace App\Services\Customer;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function cartPageData(?User $user): array
    {
        $cartItems = $user ? $this->cartItems($user) : collect();
        $summary = $this->cartSummary($cartItems);

        return [
            'cartItems' => $cartItems->values()->all(),
            'summary' => $summary,
            'suggestedProducts' => $this->suggestedProducts(
                $cartItems->pluck('product_id')->filter()->all(),
            ),
        ];
    }

    public function getOrCreateCart(User $user): Cart
    {
        return Cart::query()->firstOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function addProductVariantToCart(ProductVariant $productVariant, User $user, int $quantity = 1): CartItem
    {
        return DB::transaction(function () use ($productVariant, $user, $quantity): CartItem {
            $variant = ProductVariant::query()
                ->with(['product', 'stock'])
                ->whereKey($productVariant->id)
                ->lockForUpdate()
                ->firstOrFail();

            $product = $variant->product;
            $stock = Stock::query()
                ->where('product_variant_id', $variant->id)
                ->lockForUpdate()
                ->first();
            $availableStock = (int) ($stock?->quantity ?? 0);

            if (! $product || $product->status !== 'active' || ! $variant->is_active || $availableStock < 1) {
                throw ValidationException::withMessages([
                    'product_variant_id' => 'Varian produk ini belum tersedia untuk dibeli.',
                ]);
            }

            $cart = $this->getOrCreateCart($user);
            $cartItem = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_variant_id', $variant->id)
                ->lockForUpdate()
                ->first();
            $nextQuantity = ($cartItem?->quantity ?? 0) + $quantity;

            if ($nextQuantity > $availableStock) {
                throw ValidationException::withMessages([
                    'quantity' => "Stok tersedia hanya {$availableStock}.",
                ]);
            }

            $priceSnapshot = $variant->sale_price ?? $variant->regular_price;

            return CartItem::query()->updateOrCreate(
                [
                    'cart_id' => $cart->id,
                    'product_variant_id' => $variant->id,
                ],
                [
                    'product_id' => $product->id,
                    'quantity' => $nextQuantity,
                    'price_snapshot' => $priceSnapshot,
                    'variant_name_snapshot' => $this->variantName($variant),
                ],
            );
        });
    }

    public function updateCartItemQuantity(CartItem $cartItem, User $user, int $quantity): CartItem
    {
        return DB::transaction(function () use ($cartItem, $user, $quantity): CartItem {
            $item = $this->ownedCartItem($cartItem, $user);
            $variant = ProductVariant::query()
                ->with(['product', 'stock'])
                ->whereKey($item->product_variant_id)
                ->lockForUpdate()
                ->firstOrFail();

            $product = $variant->product;
            $stock = Stock::query()
                ->where('product_variant_id', $variant->id)
                ->lockForUpdate()
                ->first();
            $availableStock = (int) ($stock?->quantity ?? 0);

            if (! $product || $product->status !== 'active' || ! $variant->is_active || $availableStock < 1) {
                throw ValidationException::withMessages([
                    'quantity' => 'Produk ini sudah tidak tersedia untuk diperbarui di keranjang.',
                ]);
            }

            if ($quantity > $availableStock) {
                throw ValidationException::withMessages([
                    'quantity' => "Stok tersedia hanya {$availableStock}.",
                ]);
            }

            $item->forceFill([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price_snapshot' => $variant->sale_price ?? $variant->regular_price,
                'variant_name_snapshot' => $this->variantName($variant),
            ])->save();

            return $item->refresh();
        });
    }

    public function removeCartItem(CartItem $cartItem, User $user): void
    {
        $this->ownedCartItem($cartItem, $user)->delete();
    }

    private function cartItems(User $user): Collection
    {
        $cart = Cart::query()
            ->with([
                'items' => fn ($query) => $query
                    ->with([
                        'product:id,name,slug,status',
                        'product.primaryImage:id,product_id,image_url,alt_text',
                        'variant:id,product_id,sku,net_weight,grind_type,regular_price,sale_price,shipping_weight_gram,image_url,is_active',
                        'variant.stock:id,product_variant_id,quantity',
                    ])
                    ->latest('id'),
            ])
            ->firstWhere('user_id', $user->id);

        if (! $cart) {
            return collect();
        }

        return $cart->items->map(function (CartItem $item): array {
            $product = $item->product;
            $variant = $item->variant;
            $availableStock = max(0, (int) ($variant?->stock?->quantity ?? 0));
            $isAvailable = $product?->status === 'active'
                && (bool) $variant?->is_active
                && $availableStock >= $item->quantity;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_slug' => $product?->slug,
                'title' => $product?->name ?? 'Produk tidak tersedia',
                'net_weight' => $variant?->net_weight,
                'grind_type' => $variant?->grind_type,
                'image' => $variant?->image_url ?? $product?->primaryImage?->image_url,
                'price' => (float) $item->price_snapshot,
                'quantity' => $item->quantity,
                'available_stock' => $availableStock,
                'is_available' => $isAvailable,
                'variant' => [
                    'id' => $variant?->id,
                    'sku' => $variant?->sku,
                ],
                'subtotal' => (float) $item->price_snapshot * $item->quantity,
            ];
        });
    }

    private function cartSummary(Collection $cartItems): array
    {
        $subtotal = (float) $cartItems->sum('subtotal');
        $shipping = 0.0;
        $discount = 0.0;

        return [
            'item_count' => (int) $cartItems->sum('quantity'),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'discount' => $discount,
            'total' => $subtotal + $shipping - $discount,
        ];
    }

    private function suggestedProducts(array $excludedProductIds, int $limit = 4): array
    {
        return Product::query()
            ->with([
                'primaryImage:id,product_id,image_url,alt_text',
                'variants' => fn ($query) => $query
                    ->select('id', 'product_id', 'regular_price', 'sale_price', 'is_active')
                    ->with('stock:id,product_variant_id,quantity')
                    ->where('is_active', true),
            ])
            ->where('status', 'active')
            ->when($excludedProductIds !== [], fn ($query) => $query->whereNotIn('id', $excludedProductIds))
            ->orderByDesc('is_featured')
            ->orderByDesc('is_new_arrival')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'slug' => $product->slug,
                'title' => $product->name,
                'price' => (float) ($product->variants->first()?->sale_price ?? $product->variants->first()?->regular_price ?? 0),
                'image' => $product->primaryImage?->image_url,
                'available_stock' => $product->variants->sum(
                    fn (ProductVariant $variant) => max(0, (int) ($variant->stock?->quantity ?? 0)),
                ),
            ])
            ->values()
            ->all();
    }

    private function variantName(ProductVariant $variant): string
    {
        return collect([$variant->net_weight, $variant->grind_type])
            ->filter()
            ->map(fn (string $value): string => str($value)->replace('_', ' ')->title()->toString())
            ->implode(' / ');
    }

    private function ownedCartItem(CartItem $cartItem, User $user): CartItem
    {
        $item = CartItem::query()
            ->whereKey($cartItem->id)
            ->whereHas('cart', fn ($query) => $query->where('user_id', $user->id))
            ->first();

        if (! $item) {
            $exception = new ModelNotFoundException;
            $exception->setModel(CartItem::class, [$cartItem->id]);

            throw $exception;
        }

        return $item;
    }
}
