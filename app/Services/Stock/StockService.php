<?php

namespace App\Services\Stock;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockService
{
    public function variantsIndex(Request $request): array
    {
        $search = $request->string('search')->toString();
        $availability = $request->string('availability')->toString();
        $query = ProductVariant::query()->with(['product:id,name', 'stock'])
            ->when($search !== '', fn ($query) => $query->where(fn ($query) => $query
                ->where('sku', 'like', "%{$search}%")
                ->orWhereHas('product', fn ($productQuery) => $productQuery->where('name', 'like', "%{$search}%"))))
            ->when($availability === 'in_stock', fn ($query) => $query->whereHas('stock', fn ($stockQuery) => $stockQuery->whereColumn('quantity', '>', 'low_stock_threshold')))
            ->when($availability === 'low_stock', fn ($query) => $query->whereHas('stock', fn ($stockQuery) => $stockQuery->where('quantity', '>', 0)->whereColumn('quantity', '<=', 'low_stock_threshold')))
            ->when($availability === 'sold_out', fn ($query) => $query->whereDoesntHave('stock', fn ($stockQuery) => $stockQuery->where('quantity', '>', 0)))
            ->latest();

        return [
            'variants' => $query->paginate($this->perPage($request))->withQueryString()->through(fn (ProductVariant $variant): array => $this->row($variant)),
            'filters' => ['search' => $search, 'availability' => $availability],
            'stats' => [
                'total' => ProductVariant::query()->count(),
                'in_stock' => ProductVariant::query()->whereHas('stock', fn ($query) => $query->whereColumn('quantity', '>', 'low_stock_threshold'))->count(),
                'low_stock' => ProductVariant::query()->whereHas('stock', fn ($query) => $query->where('quantity', '>', 0)->whereColumn('quantity', '<=', 'low_stock_threshold'))->count(),
                'sold_out' => ProductVariant::query()->whereDoesntHave('stock', fn ($query) => $query->where('quantity', '>', 0))->count(),
            ],
        ];
    }

    public function adjustmentForm(ProductVariant $variant): array
    {
        $variant->load(['product:id,name', 'stock']);

        return [
            'id' => $variant->id,
            'product_id' => $variant->product_id,
            'product' => $variant->product?->name,
            'sku' => $variant->sku,
            'quantity' => $variant->stock?->quantity ?? 0,
            'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
        ];
    }

    public function adjust(ProductVariant $productVariant, Request $request): void
    {
        DB::transaction(function () use ($request, $productVariant): void {
            $stock = $productVariant->stock()->lockForUpdate()->firstOrCreate([], ['quantity' => 0, 'low_stock_threshold' => 5]);
            $quantity = $request->integer('quantity');
            $next = match ($request->input('type')) {
                'out' => $stock->quantity - abs($quantity),
                'in' => $stock->quantity + abs($quantity),
                default => $quantity,
            };

            if ($next < 0) {
                throw ValidationException::withMessages(['quantity' => 'Stok tidak boleh negatif.']);
            }

            $stock->update(['quantity' => $next]);
        });
    }

    private function row(ProductVariant $variant): array
    {
        return [
            'id' => $variant->id,
            'product_id' => $variant->product_id,
            'product' => $variant->product?->name,
            'sku' => $variant->sku,
            'net_weight' => $variant->net_weight,
            'grind_type' => $variant->grind_type,
            'quantity' => $variant->stock?->quantity ?? 0,
            'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
            'is_active' => $variant->is_active,
        ];
    }

    private function perPage(Request $request): int
    {
        return min(max($request->integer('per_page', 15), 1), 100);
    }
}
