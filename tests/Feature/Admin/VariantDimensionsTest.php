<?php

use App\Http\Requests\Admin\ProductRequest;
use App\Http\Requests\Admin\ProductVariantRequest;
use App\Models\Product;
use App\Models\User;
use App\Services\Admin\ProductManagementService;
use App\Services\Customer\ProductBrowsingService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

it('requires positive precise package dimensions even for inactive variants', function ($dimension) {
    $standalone = (new ProductVariantRequest)->rules();
    $nested = (new ProductRequest)->rules();
    foreach (['length', 'width', 'height'] as $field) {
        expect(Validator::make([$field => $dimension], [$field => $standalone[$field]])->fails())->toBeTrue();
        expect(Validator::make(['variants' => [[$field => $dimension]]], ['variants.*.'.$field => $nested['variants.*.'.$field]])->fails())->toBeTrue();
    }
})->with([null, '', 0, -1, 1.234, 1000000]);

it('accepts unit dimensions and optional variant grind separately from producer', function () {
    $rules = (new ProductVariantRequest)->rules();
    foreach (['whole_bean', 'fine', 'medium', 'coarse', null] as $grind) {
        $data = ['length' => 4, 'width' => 5, 'height' => 2, 'grind_type' => $grind];
        expect(Validator::make($data, array_intersect_key($rules, $data))->passes())->toBeTrue();
    }
    expect(Validator::make(['grind_type' => 'producer'], ['grind_type' => $rules['grind_type']])->fails())->toBeTrue();
});

it('persists variant dimensions and grind through both admin forms and duplication', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $variantData = ['net_weight' => '250g', 'grind_type' => 'coarse', 'length' => 4.25, 'width' => 5, 'height' => 2,
        'regular_price' => 50000, 'shipping_weight_gram' => 300, 'is_active' => false, 'stock_quantity' => 0, 'low_stock_threshold' => 5];
    $this->actingAs($admin)->post(route('admin.products.store'), ['name' => 'Gayo Package', 'slug' => 'gayo-package',
        'grind_type' => 'Gayo Cooperative', 'status' => 'draft', 'images' => [['image' => UploadedFile::fake()->image('gayo.jpg')]], 'variants' => [$variantData]])->assertSessionHasNoErrors();
    $product = Product::query()->where('slug', 'gayo-package')->firstOrFail();
    $variant = $product->variants()->firstOrFail();
    expect($product->grind_type)->toBe('Gayo Cooperative')->and($variant->grind_type)->toBe('coarse')->and($variant->length)->toBe('4.25');
    $this->get(route('admin.products.edit', $product))->assertInertia(fn ($page) => $page->where('product.variants.0.length', '4.25')->where('product.variants.0.grind_type', 'coarse'));
    $this->put(route('admin.product-variants.update', $variant), [...$variantData, 'product_id' => $product->id, 'length' => 8.5, 'grind_type' => null])->assertSessionHasNoErrors();
    expect($variant->refresh()->length)->toBe('8.50')->and($variant->grind_type)->toBeNull();
    $this->get(route('admin.product-variants.edit', $variant))->assertInertia(fn ($page) => $page->where('variant.length', '8.50')->where('variant.width', '5.00')->where('variant.height', '2.00'));
    $copy = app(ProductManagementService::class)->duplicate($product);
    expect($copy->grind_type)->toBe('Gayo Cooperative')->and($copy->variants()->firstOrFail()->length)->toBe('8.50');
});

it('filters catalog grind using active variants not producer metadata', function () {
    $producerOnly = Product::query()->create(['name' => 'Producer only', 'slug' => 'producer-only', 'status' => 'active', 'grind_type' => 'fine']);
    $producerOnly->variants()->create(['regular_price' => 50000, 'length' => 4, 'width' => 5, 'height' => 2, 'grind_type' => 'whole_bean', 'is_active' => true]);
    $matches = Product::query()->create(['name' => 'Fine variant', 'slug' => 'fine-variant', 'status' => 'active', 'grind_type' => 'Koperasi Gayo']);
    $matches->variants()->create(['regular_price' => 50000, 'length' => 4, 'width' => 5, 'height' => 2, 'grind_type' => 'fine', 'is_active' => true]);
    $data = app(ProductBrowsingService::class)->productListData(Request::create('/products', 'GET', ['grind_type' => 'fine']));
    expect($data['products']->total())->toBe(1)->and($data['products']->items()[0]['id'])->toBe($matches->id);
    expect($data['options']['grindTypes']->all())->toBe(['fine', 'whole_bean']);
});
