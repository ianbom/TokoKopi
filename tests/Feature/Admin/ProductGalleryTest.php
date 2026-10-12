<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('requires a product photo for every status', function (string $status) {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'status' => $status,
    ])->assertSessionHasErrors(['images' => 'Galeri produk wajib memiliki minimal 1 foto.']);

    expect(Product::query()->count())->toBe(0);
})->with(['draft', 'active', 'inactive', 'archived']);

it('rejects an empty gallery or a row without a photo', function (array $images) {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'status' => 'draft', 'images' => $images,
    ])->assertSessionHasErrors(['images' => 'Galeri produk wajib memiliki minimal 1 foto.']);

    expect(Product::query()->count())->toBe(0);
})->with([
    'empty gallery' => [[]],
    'empty row' => [[['image_url' => '', 'is_primary' => true]]],
    'URL without upload' => [[['image_url' => '/storage/product/not-uploaded.jpg']]],
]);

it('creates a draft with one uploaded photo', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'status' => 'draft',
        'images' => [['image' => UploadedFile::fake()->image('gayo.jpg')]],
    ])->assertSessionHasNoErrors()->assertRedirect();

    $image = Product::query()->firstOrFail()->images()->firstOrFail();
    Storage::disk('public')->assertExists(str($image->image_url)->after('/storage/')->toString());
});

it('retains an existing photo and rejects deleting the last photo', function () {
    Storage::fake('public');
    Storage::disk('public')->put('product/gayo.jpg', 'existing photo');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Gayo', 'slug' => 'gayo', 'status' => 'draft']);
    $image = $product->images()->create(['image_url' => '/storage/product/gayo.jpg', 'is_primary' => true]);
    $payload = ['name' => 'Gayo Natural', 'slug' => 'gayo', 'status' => 'draft',
        'images' => [['id' => $image->id, 'image_url' => $image->image_url, 'is_primary' => true]]];

    $this->actingAs($admin)->put(route('admin.products.update', $product), $payload)
        ->assertSessionHasNoErrors()->assertRedirect();
    expect($product->refresh()->name)->toBe('Gayo Natural')
        ->and($product->images()->count())->toBe(1);

    $payload['name'] = 'Must not save';
    $payload['images'] = [];
    $this->put(route('admin.products.update', $product), $payload)
        ->assertSessionHasErrors(['images' => 'Galeri produk wajib memiliki minimal 1 foto.']);

    $payload['images'] = [['id' => $image->id, 'image_url' => '/storage/product/not-uploaded.jpg']];
    $this->put(route('admin.products.update', $product), $payload)
        ->assertSessionHasErrors(['images' => 'Galeri produk wajib memiliki minimal 1 foto.']);

    expect($product->refresh()->name)->toBe('Gayo Natural')
        ->and($image->fresh()->deleted_at)->toBeNull()
        ->and($image->fresh()->image_url)->toBe('/storage/product/gayo.jpg');
    Storage::disk('public')->assertExists('product/gayo.jpg');
});

it('rejects invalid or oversized gallery files', function (string $kind) {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $file = $kind === 'oversized'
        ? UploadedFile::fake()->image('gayo.jpg')->size(4097)
        : UploadedFile::fake()->create('gayo.txt', 1, 'text/plain');

    $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Gayo Natural', 'slug' => 'gayo-natural', 'status' => 'draft', 'images' => [['image' => $file]],
    ])->assertSessionHasErrors(['images.0.image' => $kind === 'oversized'
        ? 'Ukuran gambar produk maksimal 4 MB.'
        : 'File gambar produk harus berupa gambar yang valid.']);
    expect(Product::query()->count())->toBe(0);
})->with(['invalid', 'oversized']);

it('rejects photo references that image synchronization would skip', function (string $mode) {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $product = Product::query()->create(['name' => 'Gayo', 'slug' => 'gayo', 'status' => 'draft']);
    $image = $product->images()->create(['image_url' => '/storage/product/gayo.jpg', 'is_primary' => true]);
    $payload = ['name' => 'Gayo Renamed', 'slug' => 'gayo-renamed', 'status' => 'draft',
        'images' => [['id' => $image->id, 'image' => UploadedFile::fake()->image('gayo.jpg')]]];
    $this->actingAs($admin);

    if ($mode === 'create') {
        $this->post(route('admin.products.store'), $payload)->assertSessionHasErrors([
            'images.0.id' => 'Gambar produk baru harus diunggah sebagai file.',
        ]);
    } else {
        $image->delete();
        $this->put(route('admin.products.update', $product), $payload)->assertSessionHasErrors([
            'images.0.id' => 'Gambar produk tidak ditemukan.',
        ]);
    }

    expect(Product::query()->count())->toBe(1)
        ->and($product->refresh()->name)->toBe('Gayo')
        ->and(Storage::disk('public')->allFiles())->toBe([]);
})->with(['create', 'edit']);
