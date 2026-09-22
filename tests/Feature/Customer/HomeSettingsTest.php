<?php

use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shares configured home text and active carousel slides', function () {
    SiteSetting::query()->create(['key' => 'welcome_text', 'value' => "Coffee\nmade simple.", 'type' => 'text']);
    SiteSetting::query()->create(['key' => 'welcome_carousel', 'value' => json_encode([
        ['image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'alt_text' => 'Active slide', 'sort_order' => 2, 'is_active' => true],
        ['image_url' => 'https://images.unsplash.com/photo-1498804103079-a6351b050096', 'alt_text' => 'Hidden slide', 'sort_order' => 1, 'is_active' => false],
    ]), 'type' => 'json']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('welcomeText', "Coffee\nmade simple.")
            ->has('welcomeCarousel', 1)
            ->where('welcomeCarousel.0.alt_text', 'Active slide'));
});
