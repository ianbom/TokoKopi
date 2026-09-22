<?php

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows home settings to an active admin', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    SiteSetting::query()->create(['key' => 'welcome_text', 'value' => "Coffee\nwithout\nthe routine.", 'type' => 'text']);
    SiteSetting::query()->create(['key' => 'welcome_carousel', 'value' => json_encode([['image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'alt_text' => 'Coffee', 'sort_order' => 1, 'is_active' => true]]), 'type' => 'json']);

    $this->actingAs($admin)
        ->get(route('admin.home-settings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/home-settings/index')
            ->where('welcomeText', "Coffee\nwithout\nthe routine.")
            ->has('slides', 1));
});

it('stores home text and uploaded carousel slides', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)
        ->post(route('admin.home-settings.update'), [
            '_method' => 'PUT',
            'welcome_text' => "Coffee\nmade simple.",
            'slides' => [[
                'image' => UploadedFile::fake()->image('home.jpg', 1600, 900),
                'alt_text' => 'Deklase coffee',
                'sort_order' => 1,
                'is_active' => true,
            ]],
        ])
        ->assertRedirect();

    expect(SiteSetting::query()->where('key', 'welcome_text')->value('value'))->toBe("Coffee\nmade simple.");
    $slides = json_decode((string) SiteSetting::query()->where('key', 'welcome_carousel')->value('value'), true, 512, JSON_THROW_ON_ERROR);

    expect($slides)->toHaveCount(1)
        ->and($slides[0]['image_url'])->toStartWith('/storage/images/home/')
        ->and($slides[0]['is_active'])->toBeTrue();
    Storage::disk('public')->assertExists(str($slides[0]['image_url'])->after('/storage/')->toString());
});
