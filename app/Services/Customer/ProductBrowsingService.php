<?php

namespace App\Services\Customer;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class ProductBrowsingService
{
    public function homeData(): array
    {
        $banners = $this->activeBanners('homepage')->get();

        return [
            'canRegister' => Features::enabled(Features::registration()),
            'heroBanners' => $banners->map(fn (Banner $banner) => $this->banner($banner))->all(),
            'promoBanner' => $this->banner($banners->skip(1)->first()),
            'ctaBanner' => $this->banner($this->activeBanners('cta')->first()),
            'collectionBanners' => [],
            'collections' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['name', 'slug', 'image_url']),
            'hajjSeries' => $this->section('featured', 3),
            'wePresent' => $this->section('new', 5),
            'recentAdditions' => $this->section('new', 6),
            'mostLoved' => $this->section('best', 4),
            'journalPosts' => [],
        ];
    }

    public function productListData(Request $request): array
    {
        $search = (string) $request->query('search', '');
        $category = (string) $request->query('category', '');
        $availability = (string) $request->query('availability', 'all');
        $price = (string) $request->query('price', '');
        $sort = (string) $request->query('sort', 'featured');
        $order = strtolower((string) $request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';
        $products = Product::query()->with($this->relations())->where('status', 'active')
            ->when($search !== '', fn ($query) => $query->where(fn ($query) => $query->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%")))
            ->when($category !== '', fn ($query) => $query->whereHas('categories', fn ($query) => $query->where('slug', $category)))
            ->when($availability === 'in_stock', fn ($query) => $query->whereHas('variants', fn ($query) => $query->where('is_active', true)->whereHas('stock', fn ($query) => $query->where('quantity', '>', 0))))
            ->when($availability === 'out_of_stock', fn ($query) => $query->whereDoesntHave('variants', fn ($query) => $query->where('is_active', true)->whereHas('stock', fn ($query) => $query->where('quantity', '>', 0))))
            ->when($price === 'under_100000', fn ($query) => $query->whereHas('variants', fn ($query) => $query->whereRaw('coalesce(sale_price, regular_price) < ?', [100000])))
            ->when($price === '100000_250000', fn ($query) => $query->whereHas('variants', fn ($query) => $query->whereRaw('coalesce(sale_price, regular_price) between ? and ?', [100000, 250000])))
            ->when($price === 'above_250000', fn ($query) => $query->whereHas('variants', fn ($query) => $query->whereRaw('coalesce(sale_price, regular_price) > ?', [250000])))
            ->when($sort === 'latest', fn ($query) => $query->orderBy('created_at', $order))
            ->when($sort === 'name', fn ($query) => $query->orderBy('name', $order))
            ->when($sort === 'best_seller', fn ($query) => $query->orderByDesc('is_best_seller')->orderByDesc('created_at'))
            ->when(! in_array($sort, ['latest', 'name', 'best_seller'], true), fn ($query) => $query->orderByDesc('is_featured')->orderByDesc('is_new_arrival')->orderByDesc('created_at'))
            ->latest();

        return [
            'products' => Inertia::scroll($products->paginate(12)->withQueryString()->through(fn (Product $product) => $this->card($product))),
            'filters' => ['search' => $search, 'category' => $category, 'collection' => '', 'type' => 'all', 'availability' => $availability, 'price' => $price, 'color' => '', 'size' => '', 'sort' => $sort, 'order' => $order, 'per_page' => 12],
            'options' => [
                'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
                'collections' => [],
                'colors' => [],
                'sizes' => [],
                'priceRanges' => [
                    ['value' => 'under_100000', 'label' => 'Under Rp 100.000'],
                    ['value' => '100000_250000', 'label' => 'Rp 100.000 - Rp 250.000'],
                    ['value' => 'above_250000', 'label' => 'Above Rp 250.000'],
                ],
                'sorts' => [
                    ['value' => 'featured', 'label' => 'Featured'],
                    ['value' => 'latest', 'label' => 'Newest'],
                    ['value' => 'name', 'label' => 'Name'],
                    ['value' => 'best_seller', 'label' => 'Best Seller'],
                ],
            ],
        ];
    }

    public function productDetailData(Request $request): array
    {
        $product = Product::query()->with($this->relations())->where('status', 'active')->when($request->query('product'), fn ($query, $slug) => $query->where('slug', $slug))->firstOrFail();
        $data = $this->card($product);
        $data['origin'] = $product->origin;
        $data['process'] = $product->process;
        $data['images'] = $product->images->map(fn ($image) => ['url' => $image->image_url, 'image_url' => $image->image_url, 'alt_text' => $image->alt_text])->all();

        return ['product' => $data];
    }

    private function section(string $section, int $limit): array
    {
        return Product::query()->with($this->relations())->where('status', 'active')
            ->when($section === 'featured', fn ($query) => $query->where('is_featured', true))
            ->when($section === 'new', fn ($query) => $query->where('is_new_arrival', true))
            ->when($section === 'best', fn ($query) => $query->where('is_best_seller', true))
            ->limit($limit)->get()->map(fn (Product $product) => $this->card($product))->all();
    }

    private function relations(): array
    {
        return ['categories:id,name,slug', 'images', 'variants.stock'];
    }

    private function card(Product $product): array
    {
        $variant = $product->variants->first();
        $price = $variant?->sale_price ?? $variant?->regular_price ?? 0;

        return [
            'id' => $product->id, 'name' => $product->name, 'title' => $product->name, 'slug' => $product->slug, 'sku' => $product->sku,
            'description' => (string) $product->description, 'short_description' => strip_tags((string) $product->description),
            'image_url' => $product->images->firstWhere('is_primary', true)?->image_url ?? $variant?->image_url,
            'price' => (float) $price, 'regular_price' => (float) ($variant?->regular_price ?? 0), 'sale_price' => $variant?->sale_price !== null ? (float) $variant->sale_price : null,
            'category' => $product->categories->first()?->name, 'category_slug' => $product->categories->first()?->slug, 'collection' => null, 'collection_slug' => null,
            'hover_image_url' => $product->images->skip(1)->first()?->image_url,
            'badge' => $product->is_new_arrival ? 'NEW' : ($product->is_best_seller ? 'BEST SELLER' : null), 'label' => null, 'is_wishlisted' => false,
            'available_stock' => (int) $product->variants->sum(fn ($item) => $item->stock?->quantity ?? 0),
            'variants' => $product->variants->map(fn ($item) => ['id' => $item->id, 'sku' => $item->sku, 'variant_name' => trim(($item->net_weight ?? '').' '.str_replace('_', ' ', $item->grind_type ?? '')), 'net_weight' => $item->net_weight, 'grind_type' => $item->grind_type, 'regular_price' => (float) $item->regular_price, 'sale_price' => $item->sale_price !== null ? (float) $item->sale_price : null, 'stock' => (int) ($item->stock?->quantity ?? 0), 'available_stock' => (int) ($item->stock?->quantity ?? 0), 'is_active' => $item->is_active])->all(),
        ];
    }

    private function activeBanners(string $placement)
    {
        return Banner::query()->where('placement', $placement)->where('is_active', true)->orderBy('sort_order');
    }

    private function banner(?Banner $banner): ?array
    {
        return $banner ? ['id' => $banner->id, 'title' => $banner->title, 'subtitle' => $banner->subtitle, 'image_desktop_url' => $banner->image_desktop_url, 'image_mobile_url' => $banner->image_mobile_url, 'button_text' => $banner->button_text, 'button_url' => $banner->button_url] : null;
    }
}
