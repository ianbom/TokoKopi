<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductManagementService
{
    use ResolvesAdminPagination;

    public function __construct(private readonly ProductImageService $images) {}

    public function indexData(Request $request): array
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'category_id' => $request->string('category_id')->toString(),
            'status' => $request->string('status')->toString(),
            'availability' => $request->string('availability')->toString(),
            'is_featured' => $request->string('is_featured')->toString(),
            'is_new_arrival' => $request->string('is_new_arrival')->toString(),
            'is_best_seller' => $request->string('is_best_seller')->toString(),
            'sort' => $request->string('sort')->toString(),
            'direction' => $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc',
        ];
        $filters['sort'] = in_array($filters['sort'], ['product', 'price', 'created'], true) ? $filters['sort'] : 'created';

        $query = Product::query()
            ->with(['categories:id,name', 'primaryImage:id,product_id,image_url,alt_text', 'variants.stock'])
            ->withCount('variants')
            ->when($filters['search'] !== '', fn (Builder $query) => $query->where(fn (Builder $query) => $query
                ->where('name', 'like', "%{$filters['search']}%")
                ->orWhere('sku', 'like', "%{$filters['search']}%")))
            ->when($filters['category_id'] !== '', fn (Builder $query) => $query->whereHas('categories', fn (Builder $query) => $query->whereKey($filters['category_id'])))
            ->when($filters['status'] !== '', fn (Builder $query) => $query->where('status', $filters['status']))
            ->when($filters['is_featured'] !== '', fn (Builder $query) => $query->where('is_featured', $filters['is_featured'] === '1'))
            ->when($filters['is_new_arrival'] !== '', fn (Builder $query) => $query->where('is_new_arrival', $filters['is_new_arrival'] === '1'))
            ->when($filters['is_best_seller'] !== '', fn (Builder $query) => $query->where('is_best_seller', $filters['is_best_seller'] === '1'))
            ->when($filters['availability'] === 'in_stock', fn (Builder $query) => $query->whereHas('variants.stock', fn (Builder $query) => $query->whereColumn('quantity', '>', 'low_stock_threshold')))
            ->when($filters['availability'] === 'low_stock', fn (Builder $query) => $query->whereHas('variants.stock', fn (Builder $query) => $query->where('quantity', '>', 0)->whereColumn('quantity', '<=', 'low_stock_threshold')))
            ->when($filters['availability'] === 'sold_out', fn (Builder $query) => $query->whereDoesntHave('variants.stock', fn (Builder $query) => $query->where('quantity', '>', 0)))
            ->when($filters['sort'] === 'product', fn (Builder $query) => $query->orderBy('name', $filters['direction']))
            ->when($filters['sort'] === 'price', fn (Builder $query) => $query->orderBy(
                ProductVariant::query()->selectRaw('min(coalesce(sale_price, regular_price))')->whereColumn('product_id', 'products.id'),
                $filters['direction'],
            ))
            ->when($filters['sort'] === 'created', fn (Builder $query) => $query->orderBy('created_at', $filters['direction']))
            ->orderByDesc('id');

        return [
            'products' => $query->paginate($this->perPage($request))->withQueryString()->through(fn (Product $product): array => $this->row($product)),
            'filters' => $filters,
            'options' => $this->options(),
            'stats' => [
                'total' => Product::query()->count(),
                'active' => Product::query()->where('status', 'active')->count(),
                'draft' => Product::query()->where('status', 'draft')->count(),
                'archived' => Product::query()->where('status', 'archived')->count(),
                'low_stock' => Product::query()->whereHas('variants.stock', fn (Builder $query) => $query->where('quantity', '>', 0)->whereColumn('quantity', '<=', 'low_stock_threshold'))->count(),
                'out_of_stock' => Product::query()->whereDoesntHave('variants.stock', fn (Builder $query) => $query->where('quantity', '>', 0))->count(),
            ],
        ];
    }

    public function create(ProductRequest $request): Product
    {
        return DB::transaction(function () use ($request): Product {
            $product = Product::query()->create($this->productPayload($request));
            $product->categories()->sync($request->validated('category_ids', []));
            $this->images->sync($request, $product, $request->validated('images', []));
            $this->syncVariants($request, $product, $request->validated('variants', []));

            return $product;
        });
    }

    public function update(Product $product, ProductRequest $request): void
    {
        DB::transaction(function () use ($product, $request): void {
            $product->update($this->productPayload($request));
            $product->categories()->sync($request->validated('category_ids', []));
            $this->images->sync($request, $product, $request->validated('images', []));
            $this->syncVariants($request, $product, $request->validated('variants', []));
        });
    }

    public function publish(Product $product): void
    {
        $product->loadMissing(['primaryImage', 'variants.stock']);
        $hasStock = $product->variants->contains(fn (ProductVariant $variant): bool => $variant->is_active && ($variant->stock?->quantity ?? 0) > 0);

        if (! $product->primaryImage || ! $hasStock) {
            throw ValidationException::withMessages(['product' => 'Produk aktif membutuhkan gambar utama dan varian aktif dengan stok.']);
        }

        $product->update(['status' => 'active']);
    }

    public function archive(Product $product): void
    {
        $product->update(['status' => 'archived']);
    }

    public function duplicate(Product $product): Product
    {
        return DB::transaction(function () use ($product): Product {
            $product->load(['categories', 'images', 'variants.stock']);
            $copy = $product->replicate();
            $copy->name .= ' Copy';
            $copy->slug = Str::slug($copy->name).'-'.Str::lower(Str::random(5));
            $copy->sku = filled($copy->sku) ? $copy->sku.'-COPY-'.Str::upper(Str::random(4)) : null;
            $copy->status = 'draft';
            $copy->save();
            $copy->categories()->sync($product->categories->modelKeys());

            foreach ($product->images as $image) {
                $copy->images()->create($image->only(['image_url', 'alt_text', 'sort_order', 'is_primary']));
            }
            foreach ($product->variants as $variant) {
                $variantCopy = $copy->variants()->create([
                    ...$variant->only(['net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram', 'image_url', 'is_active']),
                    'sku' => $variant->sku.'-COPY-'.Str::upper(Str::random(4)),
                ]);
                $variantCopy->stock()->create([
                    'quantity' => $variant->stock?->quantity ?? 0,
                    'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
                ]);
            }

            return $copy;
        });
    }

    public function delete(Product $product): array
    {
        if ($product->orderItems()->exists()) {
            $product->update(['status' => 'archived']);

            return ['archived' => true, 'message' => 'Produk pernah dibeli dan telah diarsipkan.'];
        }

        foreach ($product->images as $image) {
            $this->images->deleteStoredImage($image->image_url);
        }
        $product->delete();

        return ['archived' => false, 'message' => 'Produk berhasil dihapus.'];
    }

    public function options(): array
    {
        return [
            'categories' => Category::query()->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
            'statuses' => ['draft', 'active', 'inactive', 'archived'],
            'grindTypes' => ['whole_bean', 'fine', 'medium', 'coarse'],
        ];
    }

    public function formData(Product $product): array
    {
        $product->load(['categories:id,name', 'images', 'variants.stock']);

        return [
            ...$product->only(['id', 'name', 'slug', 'sku', 'origin', 'process', 'description', 'status', 'is_featured', 'is_new_arrival', 'is_best_seller']),
            'category_ids' => $product->categories->modelKeys(),
            'images' => $product->images->map->only(['id', 'image_url', 'alt_text', 'sort_order', 'is_primary'])->values(),
            'variants' => $product->variants->map(fn (ProductVariant $variant): array => [
                ...$variant->only(['id', 'sku', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram', 'image_url', 'is_active']),
                'stock_quantity' => $variant->stock?->quantity ?? 0,
                'low_stock_threshold' => $variant->stock?->low_stock_threshold ?? 5,
            ])->values(),
        ];
    }

    public function showData(Product $product): array
    {
        $product->load(['categories:id,name', 'images', 'variants.stock', 'orderItems']);

        return [
            ...$this->formData($product),
            'categories' => $product->categories->pluck('name')->values(),
            'total_stock' => $product->variants->sum(fn (ProductVariant $variant): int => $variant->stock?->quantity ?? 0),
            'order_items_count' => $product->orderItems->count(),
            'created_at' => $product->created_at?->toDateTimeString(),
            'updated_at' => $product->updated_at?->toDateTimeString(),
        ];
    }

    private function productPayload(ProductRequest $request): array
    {
        return [
            ...collect($request->validated())->only(['name', 'slug', 'sku', 'origin', 'process', 'description', 'status'])->all(),
            'is_featured' => $request->boolean('is_featured'),
            'is_new_arrival' => $request->boolean('is_new_arrival'),
            'is_best_seller' => $request->boolean('is_best_seller'),
        ];
    }

    private function syncVariants(ProductRequest $request, Product $product, array $variants): void
    {
        $kept = [];
        foreach ($variants as $index => $data) {
            $variant = isset($data['id']) ? $product->variants()->whereKey($data['id'])->firstOrFail() : new ProductVariant(['product_id' => $product->id]);
            $payload = collect($data)->only(['sku', 'net_weight', 'grind_type', 'regular_price', 'sale_price', 'shipping_weight_gram', 'image_url'])->all();
            $payload['is_active'] = (bool) ($data['is_active'] ?? false);

            if ($request->hasFile("variants.{$index}.image")) {
                $payload['image_url'] = Storage::url($request->file("variants.{$index}.image")->store('product-variants', 'public'));
            }

            $variant->fill($payload);
            $variant->product()->associate($product);
            $variant->save();
            $variant->stock()->updateOrCreate([], [
                'quantity' => (int) $data['stock_quantity'],
                'low_stock_threshold' => (int) $data['low_stock_threshold'],
            ]);
            $kept[] = $variant->id;
        }

        $product->variants()->whereNotIn('id', $kept)->get()->each(function (ProductVariant $variant): void {
            $variant->orderItems()->exists() ? $variant->update(['is_active' => false]) : $variant->delete();
        });
    }

    private function row(Product $product): array
    {
        $prices = $product->variants->map(fn (ProductVariant $variant): float => (float) ($variant->sale_price ?? $variant->regular_price));

        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'categories' => $product->categories->pluck('name')->values(),
            'thumbnail' => $product->primaryImage?->image_url,
            'minimum_price' => $prices->min() ?? 0,
            'total_stock' => $product->variants->sum(fn (ProductVariant $variant): int => $variant->stock?->quantity ?? 0),
            'variants_count' => $product->variants_count,
            'status' => $product->status,
            'is_featured' => $product->is_featured,
            'is_new_arrival' => $product->is_new_arrival,
            'is_best_seller' => $product->is_best_seller,
            'created_at' => $product->created_at?->toFormattedDateString(),
        ];
    }
}
