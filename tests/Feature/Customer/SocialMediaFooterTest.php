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
            ->where('shop.social_links.tiktok_url', 'https://www.tiktok.com/@deklaseroastery'));
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

it('preserves full urls when configured in site settings', function () {
    SiteSetting::query()->create(['key' => 'instagram_handle', 'value' => 'https://instagram.com/custom_url', 'type' => 'string']);
    SiteSetting::query()->create(['key' => 'tiktok_handle', 'value' => 'https://www.tiktok.com/@custom_tiktok', 'type' => 'string']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('shop.social_links.instagram_url', 'https://instagram.com/custom_url')
            ->where('shop.social_links.tiktok_url', 'https://www.tiktok.com/@custom_tiktok'));
});
