<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows an active admin to save the store location coordinates', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'store_latitude' => '-8.0924970',
            'store_longitude' => '112.1801619',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('site_settings', [
        'key' => 'store_latitude',
        'value' => '-8.0924970',
        'type' => 'number',
    ]);
    $this->assertDatabaseHas('site_settings', [
        'key' => 'store_longitude',
        'value' => '112.1801619',
        'type' => 'number',
    ]);
});

it('rejects store coordinates outside valid geographic ranges', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)
        ->from(route('admin.settings.store'))
        ->put(route('admin.settings.update'), [
            'store_latitude' => '91',
            'store_longitude' => '181',
        ])
        ->assertRedirect(route('admin.settings.store'))
        ->assertSessionHasErrors(['store_latitude', 'store_longitude']);
});
