<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product?->id;
        $imageId = Rule::exists('product_images', 'id');
        $variantId = Rule::exists('product_variants', 'id');

        if ($productId) {
            $imageId->where('product_id', $productId);
            $variantId->where('product_id', $productId);
        }

        return [
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', Rule::unique('products', 'slug')->ignore($product)],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product)],
            'origin' => ['nullable', 'string', 'max:180'],
            'process' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'active', 'inactive', 'archived'])],
            'is_featured' => ['sometimes', 'boolean'],
            'is_new_arrival' => ['sometimes', 'boolean'],
            'is_best_seller' => ['sometimes', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'distinct', 'exists:categories,id'],
            'images' => ['nullable', 'array'],
            'images.*.id' => ['nullable', 'integer', $imageId],
            'images.*.image_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^blob:/i'],
            'images.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'images.*.is_primary' => ['sometimes', 'boolean'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer', $variantId],
            'variants.*.sku' => ['required', 'string', 'max:100'],
            'variants.*.net_weight' => ['nullable', 'string', 'max:100'],
            'variants.*.grind_type' => ['nullable', Rule::in(['whole_bean', 'fine', 'medium', 'coarse'])],
            'variants.*.regular_price' => ['required', 'numeric', 'min:0'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0', 'lte:variants.*.regular_price'],
            'variants.*.shipping_weight_gram' => ['required', 'integer', 'min:0'],
            'variants.*.image_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^blob:/i'],
            'variants.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'variants.*.is_active' => ['sometimes', 'boolean'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
            'variants.*.low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];
    }

    public function after(): array
    {
        return [function ($validator): void {
            if ($this->input('status') !== 'active') {
                return;
            }

            $images = collect($this->input('images', []))->filter(
                fn (array $image, int $index): bool => filled($image['image_url'] ?? null) || $this->hasFile("images.{$index}.image")
            );
            $variants = collect($this->input('variants', []));

            if ($images->isEmpty()) {
                $validator->errors()->add('images', 'Produk aktif membutuhkan minimal satu gambar.');
            }

            if (! $images->contains(fn (array $image): bool => (bool) ($image['is_primary'] ?? false))) {
                $validator->errors()->add('images', 'Produk aktif membutuhkan satu gambar utama.');
            }

            if (! $variants->contains(fn (array $variant): bool => (bool) ($variant['is_active'] ?? false) && (int) ($variant['stock_quantity'] ?? 0) > 0)) {
                $validator->errors()->add('variants', 'Produk aktif membutuhkan varian aktif dengan stok tersedia.');
            }
        }];
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('slug')) {
            $this->merge(['slug' => Str::slug($this->string('slug')->toString())]);
        }
    }
}
