<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Kopi untuk pagi yang lebih bermakna',
                'subtitle' => 'Biji kopi pilihan Deklase, dipanggang segar untuk ritual harianmu.',
                'image_desktop_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1920&q=85',
                'image_mobile_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=768&q=85',
                'button_text' => 'Belanja Kopi',
                'button_url' => '/list',
                'placement' => 'homepage',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Temukan kopi favoritmu',
                'subtitle' => 'Pilih profil rasa yang cocok untuk seduhan di rumah atau di perjalanan.',
                'image_desktop_url' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1400&q=85',
                'image_mobile_url' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=768&q=85',
                'button_text' => 'Lihat Katalog',
                'button_url' => '/list',
                'placement' => 'collection',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Seduh, nikmati, ulangi',
                'subtitle' => 'Koleksi kopi Deklase untuk menemani setiap jeda.',
                'image_desktop_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=85',
                'image_mobile_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=768&q=85',
                'button_text' => 'Shop Sekarang',
                'button_url' => '/list',
                'placement' => 'cta',
                'sort_order' => 0,
                'is_active' => true,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::query()->updateOrCreate(
                ['placement' => $banner['placement'], 'sort_order' => $banner['sort_order']],
                $banner,
            );
        }
    }
}
