<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Stock;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class TokopediaCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $payload = $this->readPayload();

        DB::transaction(function () use ($payload): void {
            $categories = $this->syncCategories($payload['products'] ?? []);

            foreach ($payload['products'] ?? [] as $productData) {
                $product = $this->syncProduct($productData, $categories);
                $this->syncImages($product, $productData['images'] ?? []);
                $this->syncVariant($product, $productData);
            }
        });
    }

    /** @return array<string, mixed> */
    private function readPayload(): array
    {
        $path = (string) config('tokopedia.catalog_json');
        if (! is_file($path)) {
            throw new RuntimeException("Tokopedia catalog JSON tidak ditemukan: {$path}");
        }

        $payload = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($payload) || ! in_array((string) ($payload['schema_version'] ?? ''), ['2.0', '2.1'], true)) {
            throw new RuntimeException('Format Tokopedia catalog JSON tidak didukung.');
        }

        return $payload;
    }

    /** @param array<int, array<string, mixed>> $products @return array<string, int> */
    private function syncCategories(array $products): array
    {
        $names = [
            'coffee-beans' => 'Coffee Beans',
            'espresso' => 'Espresso',
            'filter-coffee' => 'Filter Coffee',
            'ready-to-drink' => 'Ready to Drink',
            'tea' => 'Tea',
            'powder-siap-seduh' => 'Powder Siap Seduh',
        ];
        $slugs = collect($products)
            ->flatMap(fn (array $product): array => $product['category_slugs'] ?? ['coffee-beans'])
            ->concat(array_keys($names))
            ->unique()
            ->values();

        return $slugs->mapWithKeys(function (string $slug) use ($names): array {
            $name = $names[$slug] ?? Str::headline($slug);
            $category = Category::query()->withTrashed()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => "Produk {$name} dari Deklase Roastery.",
                    'sort_order' => (array_search($slug, array_keys($names), true) + 1) * 10,
                    'is_active' => true,
                ],
            );
            $category->restore();

            return [$slug => $category->id];
        })->all();
    }

    /** @param array<string, mixed> $data @param array<string, int> $categories */
    private function syncProduct(array $data, array $categories): Product
    {
        $slug = (string) ($data['slug'] ?? Str::slug((string) ($data['title'] ?? 'tokopedia-product')));
        $sku = $this->sku($data, $slug);
        $product = Product::query()->withTrashed()->updateOrCreate(
            ['slug' => $slug],
            [
                'name' => (string) ($data['title'] ?? $slug),
                'sku' => $sku,
                'origin' => $data['origin'] ?? null,
                'process' => $data['process'] ?? null,
                'description' => (string) ($data['description'] ?? $data['title'] ?? ''),
                'status' => 'active',
                'is_featured' => false,
                'is_new_arrival' => false,
                'is_best_seller' => false,
            ],
        );
        $product->restore();
        $product->categories()->sync(collect($data['category_slugs'] ?? ['coffee-beans'])
            ->map(fn (string $slug): ?int => $categories[$slug] ?? null)
            ->filter()
            ->all());

        return $product;
    }

    /** @param array<int, array<string, mixed>> $images */
    private function syncImages(Product $product, array $images): void
    {
        $urls = [];
        foreach ($images as $index => $imageData) {
            $url = (string) ($imageData['url'] ?? $imageData['image_url'] ?? '');
            if ($url === '') {
                continue;
            }
            $urls[] = $url;
            $image = ProductImage::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'image_url' => $url],
                ['alt_text' => $imageData['alt'] ?? $product->name, 'sort_order' => $index, 'is_primary' => $index === 0],
            );
            $image->restore();
        }

        $query = ProductImage::query()->where('product_id', $product->id);
        $urls === [] ? $query->delete() : $query->whereNotIn('image_url', $urls)->delete();
    }

    /** @param array<string, mixed> $data */
    private function syncVariant(Product $product, array $data): void
    {
        $regularPrice = (int) ($data['regular_price'] ?? $data['sale_price'] ?? 0);
        $salePrice = isset($data['sale_price']) && (int) $data['sale_price'] < $regularPrice ? (int) $data['sale_price'] : null;
        $variant = ProductVariant::query()->withTrashed()->updateOrCreate(
            ['sku' => $this->sku($data, (string) $product->slug)],
            [
                'product_id' => $product->id,
                'net_weight' => $data['net_weight'] ?? null,
                'grind_type' => $data['grind_type'] ?? null,
                'regular_price' => $regularPrice,
                'sale_price' => $salePrice,
                'shipping_weight_gram' => $this->grams($data['net_weight'] ?? null),
                'image_url' => $data['images'][0]['url'] ?? null,
                'is_active' => true,
            ],
        );
        $variant->restore();
        Stock::query()->updateOrCreate(['product_variant_id' => $variant->id], ['quantity' => 0, 'low_stock_threshold' => 5]);
    }

    /** @param array<string, mixed> $data */
    private function sku(array $data, string $fallback): string
    {
        $sourceId = preg_replace('/[^A-Za-z0-9]/', '', (string) ($data['source_id'] ?? '')) ?: md5($fallback);

        return 'TKP-'.Str::upper(Str::substr($sourceId, 0, 24));
    }

    private function grams(?string $weight): int
    {
        if (! $weight || ! preg_match('/([0-9]+(?:[.,][0-9]+)?)\s*(kg|g|gram)/i', $weight, $match)) {
            return 0;
        }

        $value = (float) str_replace(',', '.', $match[1]);

        return strtolower($match[2]) === 'kg' ? (int) ($value * 1000) : (int) $value;
    }
}
