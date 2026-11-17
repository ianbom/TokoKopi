<?php

use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shares default social links when site settings are not configured', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('shop.social_links.instagram_url', 'https://instagram.com/Deklaseid')
            ->where('shop.social_links.tiktok_url', 'https://www.tiktok.com/@deklaseroastery')
            ->where('shop.social_links.whatsapp_url', null));
});

it('shares configured social links from site settings and normalizes handles', function () {
    SiteSetting::query()->create(['key' => 'instagram_handle', 'value' => '@my_deklase', 'type' => 'string']);
    SiteSetting::query()->create(['key' => 'tiktok_handle', 'value' => 'my_tiktok_handle', 'type' => 'string']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('shop.social_links.instagram_url', 'https://instagram.com/my_deklase')
            ->where('shop.social_links.tiktok_url', 'https://www.tiktok.com/@my_tiktok_handle'));
});

it('shares the configured store phone as a WhatsApp link', function (string $phone, ?string $url) {
    SiteSetting::query()->create(['key' => 'store_phone', 'value' => $phone, 'type' => 'string']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('shop.social_links.whatsapp_url', $url));
})->with([
    'local number' => ['085649529166', 'https://wa.me/6285649529166'],
    'without leading zero' => ['85649529166', 'https://wa.me/6285649529166'],
    'international number' => ['+62 856-4952-9166', 'https://wa.me/6285649529166'],
    'empty number' => ['', null],
    'invalid number' => ['not-a-phone', null],
    'too short' => ['123', null],
]);

it('preserves full urls when configured in site settings', function () {
    SiteSetting::query()->create(['key' => 'instagram_handle', 'value' => 'https://instagram.com/custom_url', 'type' => 'string']);
    SiteSetting::query()->create(['key' => 'tiktok_handle', 'value' => 'https://www.tiktok.com/@custom_tiktok', 'type' => 'string']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('shop.social_links.instagram_url', 'https://instagram.com/custom_url')
            ->where('shop.social_links.tiktok_url', 'https://www.tiktok.com/@custom_tiktok'));
});
