<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PublicProductsSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $categories = collect([
                ['name' => 'Coffee Beans', 'slug' => 'coffee-beans', 'description' => 'Biji kopi pilihan untuk seduhan harian.', 'sort_order' => 10, 'is_active' => true],
                ['name' => 'Espresso', 'slug' => 'espresso', 'description' => 'Kopi dengan karakter manis dan bold untuk espresso.', 'sort_order' => 20, 'is_active' => true],
                ['name' => 'Filter Coffee', 'slug' => 'filter-coffee', 'description' => 'Kopi dengan karakter bersih dan ekspresif untuk filter.', 'sort_order' => 30, 'is_active' => true],
                ['name' => 'Ready to Drink', 'slug' => 'ready-to-drink', 'description' => 'Kopi siap minum untuk ritual harian.', 'sort_order' => 40, 'is_active' => true],
            ])->mapWithKeys(function (array $category): array {
                $record = Category::query()->withTrashed()->updateOrCreate(
                    ['slug' => $category['slug']],
                    $category,
                );

                if ($record->trashed()) {
                    $record->restore();
                }

                return [$record->slug => $record];
            });

            foreach (self::products() as $data) {
                $product = Product::query()->withTrashed()->updateOrCreate(
                    ['slug' => $data['slug']],
                    [
                        'name' => $data['name'],
                        'sku' => $data['sku'],
                        'origin' => $data['origin'],
                        'process' => $data['process'],
                        'description' => "<p>{$data['name']} adalah kopi pilihan Declasse dengan karakter {$data['description']}.</p>",
                        'status' => 'active',
                        'is_featured' => $data['is_featured'],
                        'is_new_arrival' => $data['is_new_arrival'],
                        'is_best_seller' => $data['is_best_seller'],
                    ],
                );

                if ($product->trashed()) {
                    $product->restore();
                }

                $product->categories()->sync($categories->only($data['categories'])->pluck('id')->all());

                $imageUrl = '/products/'.rawurlencode($data['image']);
                $image = $product->images()->withTrashed()->updateOrCreate(
                    ['image_url' => $imageUrl],
                    [
                        'alt_text' => $data['name'],
                        'sort_order' => 0,
                        'is_primary' => true,
                    ],
                );

                if ($image->trashed()) {
                    $image->restore();
                }

                $variant = $product->variants()->withTrashed()->updateOrCreate(
                    ['sku' => $data['sku'].'-200-WB'],
                    [
                        'net_weight' => '200gram',
                        'grind_type' => 'whole_bean',
                        'regular_price' => $data['price'],
                        'sale_price' => null,
                        'shipping_weight_gram' => 250,
                        'image_url' => $imageUrl,
                        'is_active' => true,
                    ],
                );

                if ($variant->trashed()) {
                    $variant->restore();
                }

                Stock::query()->updateOrCreate(
                    ['product_variant_id' => $variant->id],
                    ['quantity' => $data['stock'], 'low_stock_threshold' => 5],
                );
            }
        });
    }

    /** @return array<int, array<string, mixed>> */
    public static function products(): array
    {
        return [
            self::product('fine-robusta-kopi-susu-blend', 'Fine Robusta Kopi Susu Blend', 'FRKSB', 'Jawa Timur', 'blend', 'Salinan mockup-fine-robusta.jpg', 'coffee-beans espresso', 68000),
            self::product('espresso-kopi-susu-blend', 'Espresso Kopi Susu Blend', 'EKSB', 'Indonesia', 'blend', 'esk.jpg', 'coffee-beans espresso', 72000),
            self::product('gayo-wine', 'Gayo Wine', 'GAYO-WINE', 'Gayo, Aceh', 'wine', 'gayowine.jpg', 'coffee-beans filter-coffee', 125000, true, true, true),
            self::product('robusta-gunung-kawi', 'Robusta Gunung Kawi', 'RGK', 'Gunung Kawi, Malang', 'natural', 'gunung-kawi.jpg', 'coffee-beans filter-coffee', 68000),
            self::product('robusta-kelud-fully-washed', 'Robusta Kelud Fully Washed', 'RKFW', 'Gunung Kelud, Jawa Timur', 'fully_washed', 'gunung-kelud.jpg', 'coffee-beans filter-coffee', 72000),
            self::product('robusta-gunung-kerinci', 'Robusta Gunung Kerinci', 'RGKRI', 'Gunung Kerinci, Jambi', 'natural', 'gunung-kerinci.jpg', 'coffee-beans filter-coffee', 74000),
            self::product('robusta-komersil', 'Robusta Komersil', 'RKM', 'Indonesia', 'natural', 'komersil.jpg', 'coffee-beans espresso', 58000),
            self::product('requiem-karo-blueberry', 'Requiem Karo Blueberry', 'RKB', 'Karo, Sumatera Utara', 'infused', 'mockup-REQIUEM-Blueberry.jpg', 'coffee-beans filter-coffee', 115000, true, true, true),
            self::product('requiem-toraja-natural', 'Requiem Toraja Natural', 'RTN', 'Toraja, Sulawesi Selatan', 'natural', 'mockup-REQIUEM-TORAJA.jpg', 'coffee-beans filter-coffee', 120000, true, true, true),
            self::product('espresso-amore-blend', 'Espresso Amore Blend', 'EAB', 'Indonesia', 'blend', 'mockup-REQUIEM-AMORE.jpg', 'coffee-beans espresso', 85000, true, false, true),
            self::product('requiem-bali-kala-patra', 'Requiem Bali Kala Patra', 'RBKP', 'Bali', 'natural', 'mockup-REQUIEM-BALI-KALA-PATRA.jpg', 'coffee-beans filter-coffee', 110000, true, true, false),
            self::product('espresso-elegante-blend', 'Espresso Elegante Blend', 'EEB', 'Indonesia', 'blend', 'mockup-REQUIEM-ELEGANTE.jpg', 'coffee-beans espresso', 88000, true, false, true),
            self::product('luxury-blend-italian-roast-arabika', 'Luxury Blend Italian Roast Arabika', 'LBIRA', 'Indonesia', 'italian_roast', 'mockup-REQUIEM-LUXURY.jpg', 'coffee-beans espresso', 95000, true, false, true),
            self::product('espresso-mano-blend', 'Espresso Mano Blend', 'EMB', 'Indonesia', 'blend', 'mockup-REQUIEM-MANO.jpg', 'coffee-beans espresso', 82000, true, false, true),
            self::product('argopuro-walida', 'Argopuro Walida', 'AW', 'Argopuro, Jawa Timur', 'natural', 'mockup-argopuro.jpg', 'coffee-beans filter-coffee', 105000, true, true, false),
            self::product('bali-kala-patra', 'Bali Kala Patra', 'BKP', 'Bali', 'natural', 'mockup-bali-kala-patra.jpg', 'coffee-beans filter-coffee', 105000, true, false, true),
            self::product('ethiopia-aricha-adori', 'Ethiopia Aricha Adori', 'EAA', 'Yirgacheffe, Ethiopia', 'natural', 'mockup-ethiopia.jpg', 'coffee-beans filter-coffee', 135000, true, true, false),
            self::product('ijen-lestari', 'Ijen Lestari', 'IL', 'Ijen, Jawa Timur', 'natural', 'mockup-ijen-.jpg', 'coffee-beans filter-coffee', 98000, true, false, true),
            self::product('espresso-ladies-blend', 'Espresso Ladies Blend', 'ELB', 'Indonesia', 'blend', 'mockup-ladies.jpg', 'coffee-beans espresso', 82000, false, true, false),
            self::product('malabar-anaerob-natural', 'Malabar Anaerob Natural', 'MAN', 'Malabar, Jawa Barat', 'anaerobic_natural', 'mockup-malabar.jpg', 'coffee-beans filter-coffee', 115000, true, true, true),
            self::product('nusantara-karo-melon', 'Nusantara Karo Melon', 'NKM', 'Karo, Sumatera Utara', 'infused', 'mockup-melon.jpg', 'coffee-beans filter-coffee', 110000, true, true, false),
            self::product('robusta-bali', 'Robusta Bali', 'RB', 'Bali', 'natural', 'robusta-bali.jpg', 'coffee-beans espresso', 70000),
        ];
    }

    /** @return array<string, mixed> */
    private static function product(string $slug, string $name, string $sku, string $origin, string $process, string $image, string $categories, int $price, bool $featured = false, bool $newArrival = false, bool $bestSeller = false): array
    {
        return [
            'slug' => $slug,
            'name' => $name,
            'sku' => 'DCL-'.$sku,
            'origin' => $origin,
            'process' => $process,
            'image' => $image,
            'categories' => explode(' ', $categories),
            'price' => $price,
            'stock' => 24,
            'description' => 'manis, bersih, dan seimbang',
            'is_featured' => $featured,
            'is_new_arrival' => $newArrival,
            'is_best_seller' => $bestSeller,
        ];
    }
}
