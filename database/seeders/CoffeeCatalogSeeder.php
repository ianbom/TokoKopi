<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Voucher;
use Illuminate\Database\Seeder;

class CoffeeCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Coffee Beans', 'slug' => 'coffee-beans', 'description' => 'Whole bean coffee for fresh brewing.', 'image_url' => $this->image('photo-1495474472287-4d71bcdd2085'), 'sort_order' => 10, 'is_active' => true],
            ['name' => 'Espresso', 'slug' => 'espresso', 'description' => 'Coffee for balanced, sweet espresso.', 'image_url' => $this->image('photo-1514432324607-a09f9b9f1f4a'), 'sort_order' => 20, 'is_active' => true],
            ['name' => 'Filter Coffee', 'slug' => 'filter-coffee', 'description' => 'Bright and expressive filter coffee.', 'image_url' => $this->image('photo-1498804103079-a6351b050096'), 'sort_order' => 30, 'is_active' => true],
            ['name' => 'Ready to Drink', 'slug' => 'ready-to-drink', 'description' => 'Convenient coffee for everyday rituals.', 'image_url' => $this->image('photo-1442512595331-e89e73853f31'), 'sort_order' => 40, 'is_active' => true],
        ])->mapWithKeys(function (array $category): array {
            $record = Category::query()->withTrashed()->updateOrCreate(['slug' => $category['slug']], $category);
            $record->restore();

            return [$record->slug => $record];
        });

        foreach ($this->products() as $data) {
            $product = Product::query()->withTrashed()->updateOrCreate(
                ['slug' => $data['slug']],
                collect($data)->except(['categories', 'variants', 'images'])->all(),
            );
            $product->restore();
            $product->categories()->sync($categories->only($data['categories'])->pluck('id')->all());

            foreach ($data['images'] as $index => $image) {
                $product->images()->withTrashed()->updateOrCreate(['image_url' => $image], [
                    'alt_text' => $product->name,
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }

            foreach ($data['variants'] as $variant) {
                $stockQuantity = $variant['stock'];
                unset($variant['stock']);
                $record = $product->variants()->withTrashed()->updateOrCreate(['sku' => $variant['sku']], $variant);
                $record->restore();
                Stock::query()->updateOrCreate(['product_variant_id' => $record->id], ['quantity' => $stockQuantity, 'low_stock_threshold' => 5]);
            }
        }

        Voucher::query()->updateOrCreate(['code' => 'WELCOME10'], [
            'name' => 'Welcome to Deklase', 'description' => '10% untuk pesanan kopi pertama.', 'discount_type' => 'percentage', 'discount_value' => 10,
            'max_discount' => 25000, 'min_order_amount' => 100000, 'usage_limit' => null, 'used_count' => 0,
            'starts_at' => now()->subDay(), 'ends_at' => now()->addYear(), 'is_active' => true,
        ]);
    }

    private function products(): array
    {
        return [
            $this->coffee('espresso-no-01', 'Espresso No. 01', 'Dataran Tinggi Gayo', 'washed', ['coffee-beans', 'espresso'], 'photo-1495474472287-4d71bcdd2085', 85000),
            $this->coffee('kintamani-bloom', 'Kintamani Bloom', 'Kintamani, Bali', 'natural', ['coffee-beans', 'filter-coffee'], 'photo-1498804103079-a6351b050096', 90000),
            $this->coffee('flores-senja', 'Flores Senja', 'Bajawa, Flores', 'washed', ['coffee-beans', 'filter-coffee'], 'photo-1514432324607-a09f9b9f1f4a', 95000),
            $this->coffee('cold-brew-concentrate', 'Cold Brew Concentrate', 'Indonesia Blend', 'cold brew', ['ready-to-drink'], 'photo-1442512595331-e89e73853f31', 65000, false),
            $this->coffee('toraja-midnight', 'Toraja Midnight', 'Toraja, Sulawesi', 'anaerobic', ['coffee-beans', 'espresso'], 'photo-1509042239860-f550ce710b93', 110000),
            $this->coffee('kerinci-honey', 'Kerinci Honey', 'Kerinci, Jambi', 'honey', ['coffee-beans', 'filter-coffee'], 'photo-1512568400610-62da28bc8f6c', 98000),
            $this->coffee('bali-natural-gold', 'Bali Natural Gold', 'Kintamani, Bali', 'natural', ['coffee-beans'], 'photo-1442512595331-e89e73853f31', 105000),
            $this->coffee('papua-valley', 'Papua Valley', 'Baliem Valley, Papua', 'washed', ['filter-coffee'], 'photo-1459755486867-b55449bb39ff', 115000),
            $this->coffee('javanese-cocoa', 'Javanese Cocoa', 'Ijen, Jawa Timur', 'honey', ['espresso', 'filter-coffee'], 'photo-1461023058943-07fcbe16d735', 102000),
            $this->coffee('sumatra-dark-fuse', 'Sumatra Dark Fuse', 'Lintong, Sumatera Utara', 'natural', ['espresso'], 'photo-1497515114629-f71d768fd07c', 108000),
            $this->coffee('cold-brew-black', 'Cold Brew Black', 'Indonesia Blend', 'cold brew', ['ready-to-drink'], 'photo-1544787219-7f47ccb76574', 72000, false),
            $this->coffee('cold-brew-latte', 'Cold Brew Latte', 'Indonesia Blend', 'cold brew', ['ready-to-drink'], 'photo-1517701550927-30cf4ba1dba5', 78000, false),
        ];
    }

    private function coffee(string $slug, string $name, string $origin, string $process, array $categories, string $photo, int $price, bool $ground = true): array
    {
        $images = $this->images($photo);
        $variants = $ground
            ? [
                ['sku' => strtoupper($slug).'-200-WB', 'net_weight' => '200gram', 'grind_type' => 'whole_bean', 'regular_price' => $price, 'sale_price' => null, 'shipping_weight_gram' => 250, 'image_url' => $images[0], 'is_active' => true, 'stock' => 24],
                ['sku' => strtoupper($slug).'-200-MF', 'net_weight' => '200gram', 'grind_type' => 'medium_fine', 'regular_price' => $price, 'sale_price' => null, 'shipping_weight_gram' => 250, 'image_url' => $images[0], 'is_active' => true, 'stock' => 16],
            ]
            : [['sku' => strtoupper($slug).'-500ML', 'net_weight' => '500ml', 'grind_type' => null, 'regular_price' => $price, 'sale_price' => null, 'shipping_weight_gram' => 650, 'image_url' => $images[0], 'is_active' => true, 'stock' => 12]];

        return ['name' => $name, 'slug' => $slug, 'sku' => strtoupper($slug), 'origin' => $origin, 'process' => $process, 'description' => "<p>{$name} dengan karakter manis, bersih, dan seimbang.</p>", 'status' => 'active', 'is_featured' => true, 'is_new_arrival' => true, 'is_best_seller' => true, 'categories' => $categories, 'images' => $images, 'variants' => $variants];
    }

    private function images(string $primary): array
    {
        $gallery = [
            'photo-1495474472287-4d71bcdd2085',
            'photo-1514432324607-a09f9b9f1f4a',
            'photo-1509042239860-f550ce710b93',
            'photo-1498804103079-a6351b050096',
            'photo-1512568400610-62da28bc8f6c',
            'photo-1442512595331-e89e73853f31',
            'photo-1459755486867-b55449bb39ff',
            'photo-1461023058943-07fcbe16d735',
        ];
        $start = array_search($primary, $gallery, true);

        if ($start === false) {
            array_unshift($gallery, $primary);
            $start = 0;
        }

        return collect(range(0, 2))
            ->map(fn (int $offset) => $this->image($gallery[($start + $offset) % count($gallery)]))
            ->all();
    }

    private function image(string $id): string
    {
        return "https://images.unsplash.com/{$id}?auto=format&fit=crop&w=1200&q=85";
    }
}
