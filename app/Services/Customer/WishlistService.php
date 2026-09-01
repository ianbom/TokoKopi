<?php

namespace App\Services\Customer;

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class WishlistService
{
    public function wishlistPageData(User $user): array
    {
        $wishlistItems = Wishlist::query()
            ->with([
                'product:id,name,slug,sku,status,is_new_arrival,is_best_seller,is_featured',
                'product.categories:id,name,slug',
                'product.primaryImage:id,product_id,image_url,alt_text',
                'product.images:id,product_id,image_url,alt_text,sort_order',
                'product.variants' => fn ($query) => $query
                    ->select('id', 'product_id', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'image_url', 'is_active')
                    ->with('stock:id,product_variant_id,quantity')
                    ->where('is_active', true)
                    ->orderBy('regular_price'),
            ])
            ->where('user_id', $user->id)
            ->whereHas('product', fn ($query) => $query->whereIn('status', ['active', 'published']))
            ->latest('id')
            ->get()
            ->map(fn (Wishlist $wishlist) => $this->wishlistCard($wishlist))
            ->filter()
            ->values()
            ->all();

        return [
            'wishlistItems' => $wishlistItems,
            'summary' => [
                'item_count' => count($wishlistItems),
            ],
        ];
    }

    public function removeWishlistItem(Wishlist $wishlist, User $user): void
    {
        $this->ownedWishlist($wishlist, $user)->delete();
    }

    public function addProduct(Product $product, User $user): Wishlist
    {
        return Wishlist::query()->firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function removeProduct(Product $product, User $user): void
    {
        Wishlist::query()
            ->where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->delete();
    }

    private function wishlistCard(Wishlist $wishlist): ?array
    {
        $product = $wishlist->product;

        if (! $product) {
            return null;
        }

        $variants = $product->variants;
        $image = $product->primaryImage?->image_url
            ?? $product->images->first()?->image_url
            ?? $variants->firstWhere('image_url', '!=', null)?->image_url;
        $prices = $variants->map(fn ($variant): float => (float) ($variant->sale_price ?? $variant->regular_price));
        $regularPrices = $variants->map(fn ($variant): float => (float) $variant->regular_price);
        $availableStock = $variants->sum(fn ($variant): int => $variant->stock?->quantity ?? 0);

        return [
            'id' => $wishlist->id,
            'product_id' => $product->id,
            'slug' => $product->slug,
            'title' => $product->name,
            'category' => $product->categories->first()?->name,
            'price' => $regularPrices->min() ?? 0,
            'sale_price' => $prices->min() !== $regularPrices->min() ? $prices->min() : null,
            'image' => $image,
            'badge' => $this->badge($product),
            'colors' => [],
            'available_stock' => $availableStock,
            'is_available' => $product->status === 'active' && $availableStock > 0,
        ];
    }

    private function badge($product): ?string
    {
        return match (true) {
            $product->variants->contains(fn ($variant): bool => $variant->sale_price !== null) => 'Sale',
            (bool) $product->is_new_arrival => 'New',
            (bool) $product->is_best_seller => 'Best',
            (bool) $product->is_featured => 'Featured',
            default => null,
        };
    }

    private function ownedWishlist(Wishlist $wishlist, User $user): Wishlist
    {
        $item = Wishlist::query()
            ->whereKey($wishlist->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $item) {
            $exception = new ModelNotFoundException;
            $exception->setModel(Wishlist::class, [$wishlist->id]);

            throw $exception;
        }

        return $item;
    }
}
