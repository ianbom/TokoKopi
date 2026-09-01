<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\ProductVariantRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductVariantService
{
    use ResolvesAdminPagination;

    public function indexData(Request $request, ?Product $product = null): array
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $query = ProductVariant::query()->with(['product:id,name', 'stock'])->withCount('orderItems')
            ->when($product, fn ($query) => $query->whereBelongsTo($product))
            ->when($search !== '', fn ($query) => $query->where(fn ($query) => $query
                ->where('sku', 'like', "%{$search}%")
                ->orWhere('net_weight', 'like', "%{$search}%")
                ->orWhere('grind_type', 'like', "%{$search}%")
                ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', "%{$search}%"))))
            ->when($status !== '', fn ($query) => $query->where('is_active', $status === 'active'))
            ->latest();

        return [
            'variants' => $query->paginate($this->perPage($request))->withQueryString()->through(fn (ProductVariant $variant): array => $this->row($variant)),
            'product' => $product?->only(['id', 'name']),
            'filters' => ['search' => $search, 'status' => $status],
            'stats' => [
                'total' => ProductVariant::query()->when($product, fn ($query) => $query->whereBelongsTo($product))->count(),
                'active' => ProductVariant::query()->when($product, fn ($query) => $query->whereBelongsTo($product))->where('is_active', true)->count(),
                'inactive' => ProductVariant::query()->when($product, fn ($query) => $query->whereBelongsTo($product))->where('is_active', false)->count(),
                'low_stock' => ProductVariant::query()->when($product, fn ($query) => $query->whereBelongsTo($product))->whereHas('stock', fn ($query) => $query->where('quantity', '>', 0)->whereColumn('quantity', '<=', 'low_stock_threshold'))->count(),
            ],
        ];
    }

    public function create(ProductVariantRequest $request): ProductVariant
    {
        return DB::transaction(function () use ($request): ProductVariant {
            $variant = new ProductVariant($this->payload($request));
            $variant->save();
            $variant->stock()->create([
                'quantity' => $request->integer('stock_quantity'),
                'low_stock_threshold' => $request->integer('low_stock_threshold'),
            ]);

            return $variant;
        });
    }

    public function update(ProductVariant $variant, ProductVariantRequest $request): void
    {
        DB::transaction(function () use ($variant, $request): void {
            $variant->update($this->payload($request, $variant));
            $variant->stock()->updateOrCreate([], [
                'quantity' => $request->integer('stock_quantity'),
                'low_stock_threshold' => $request->integer('low_stock_threshold'),
            ]);
        });
    }

    public function delete(ProductVariant $variant): string
    {
        if ($variant->orderItems()->exists()) {
            $variant->update(['is_active' => false]);

            return 'Variant pernah dibeli dan dinonaktifkan.';
        }

        Storage::disk('public')->delete(str_replace('/storage/', '', (string) $variant->image_url));
        $variant->delete();

        return 'Variant berhasil dihapus.';
    }

    public function productOptions()
    {
        return Product::query()->orderBy('name')->get(['id', 'name', 'slug', 'sku'])->map(fn (Product $product): array => $product->only(['id', 'name', 'slug', 'sku']));
    }

    public function formData(ProductVariant $variant): array
    {
        $variant->load(['product:id,name', 'stock']);

        return [
            ...$variant->only(['id', 'product_id', 'sku', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram', 'image_url', 'is_active']),
            'product' => $variant->product?->name,
            'stock_quantity' => $variant->stock?->quantity ?? 0,
            'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
        ];
    }

    private function payload(ProductVariantRequest $request, ?ProductVariant $variant = null): array
    {
        $payload = collect($request->validated())->only(['product_id', 'sku', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram'])->all();
        $payload['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            if ($variant?->image_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $variant->image_url));
            }
            $payload['image_url'] = Storage::url($request->file('image')->store('product-variants', 'public'));
        }

        return $payload;
    }

    private function row(ProductVariant $variant): array
    {
        return [
            ...$variant->only(['id', 'product_id', 'sku', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram', 'image_url', 'is_active']),
            'product' => $variant->product?->name,
            'stock_quantity' => $variant->stock?->quantity ?? 0,
            'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
            'order_items_count' => $variant->order_items_count,
            'created_at' => $variant->created_at?->toFormattedDateString(),
        ];
    }
}
