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

        $rules = [
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['required', 'string', 'max:220', Rule::unique('products', 'slug')->ignore($product)],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product)],
            'origin' => ['nullable', 'string', 'max:180'],
            'process' => ['nullable', 'string', 'max:100'],
            'grind_type' => ['nullable', 'string', 'max:50'],
            'tasting_notes' => ['nullable', 'string', 'max:255'],
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
            'variants.*.sku' => ['nullable', 'string', 'max:100'],
            'variants.*.net_weight' => ['nullable', 'string', 'max:100'],
            'variants.*.regular_price' => ['required', 'numeric', 'min:0'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0', 'lte:variants.*.regular_price'],
            'variants.*.shipping_weight_gram' => ['required', 'integer', 'min:0'],
            'variants.*.image_url' => ['nullable', 'string', 'max:2048', 'not_regex:/^blob:/i'],
            'variants.*.image' => ['nullable', 'file', 'image', 'max:4096'],
            'variants.*.is_active' => ['sometimes', 'boolean'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
            'variants.*.low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];

        foreach ((array) $this->input('variants', []) as $index => $data) {
            if (! is_array($data) || ! filled($data['sku'] ?? null)) {
                continue;
            }

            $variant = $product?->variants()->whereKey($data['id'] ?? null)->first();
            $rules["variants.{$index}.sku"] = ['nullable', 'string', 'max:100', 'distinct', Rule::unique('product_variants', 'sku')->ignore($variant)];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.string' => 'Nama produk harus berupa teks.',
            'name.max' => 'Nama produk maksimal 200 karakter.',
            'slug.required' => 'Slug wajib diisi.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.unique' => 'Slug sudah digunakan produk lain.',
            'slug.max' => 'Slug maksimal 220 karakter.',
            'sku.string' => 'SKU produk harus berupa teks.',
            'sku.unique' => 'SKU produk sudah digunakan produk lain.',
            'sku.max' => 'SKU produk maksimal 100 karakter.',
            'origin.string' => 'Origin harus berupa teks.',
            'origin.max' => 'Origin maksimal 180 karakter.',
            'process.string' => 'Process harus berupa teks.',
            'process.max' => 'Process maksimal 100 karakter.',
            'grind_type.string' => 'Producer harus berupa teks.',
            'grind_type.max' => 'Producer maksimal 50 karakter.',
            'tasting_notes.string' => 'Tasting notes harus berupa teks.',
            'tasting_notes.max' => 'Tasting notes maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'status.required' => 'Status produk wajib dipilih.',
            'status.in' => 'Status produk yang dipilih tidak valid.',
            'category_ids.array' => 'Kategori harus berupa daftar pilihan.',
            'category_ids.*.integer' => 'Kategori yang dipilih tidak valid.',
            'category_ids.*.distinct' => 'Kategori yang sama tidak boleh dipilih lebih dari sekali.',
            'category_ids.*.exists' => 'Kategori yang dipilih tidak ditemukan.',
            'images.array' => 'Data gambar produk tidak valid.',
            'images.*.id.integer' => 'Data gambar produk tidak valid.',
            'images.*.id.exists' => 'Gambar produk tidak ditemukan.',
            'images.*.image_url.string' => 'Alamat gambar produk harus berupa teks.',
            'images.*.image_url.max' => 'Alamat gambar produk terlalu panjang.',
            'images.*.image_url.not_regex' => 'Gunakan unggah file untuk gambar produk.',
            'images.*.image.file' => 'Gambar produk gagal diunggah. Silakan pilih ulang.',
            'images.*.image.image' => 'File gambar produk harus berupa gambar yang valid.',
            'images.*.image.max' => 'Ukuran gambar produk maksimal 4 MB.',
            'images.*.sort_order.integer' => 'Urutan gambar harus berupa angka bulat.',
            'images.*.sort_order.min' => 'Urutan gambar tidak boleh kurang dari 0.',
            'images.*.is_primary.boolean' => 'Pilihan gambar utama tidak valid.',
            'variants.array' => 'Data varian produk tidak valid.',
            'variants.*.id.integer' => 'Data varian produk tidak valid.',
            'variants.*.id.exists' => 'Varian produk tidak ditemukan.',
            'variants.*.sku.string' => 'SKU varian harus berupa teks.',
            'variants.*.sku.unique' => 'SKU varian sudah digunakan varian lain.',
            'variants.*.sku.distinct' => 'SKU varian tidak boleh sama dalam satu produk.',
            'variants.*.sku.max' => 'SKU varian maksimal 100 karakter.',
            'variants.*.net_weight.string' => 'Berat bersih harus berupa teks.',
            'variants.*.net_weight.max' => 'Berat bersih maksimal 100 karakter.',
            'variants.*.regular_price.required' => 'Harga normal varian wajib diisi.',
            'variants.*.regular_price.numeric' => 'Harga normal varian harus berupa angka.',
            'variants.*.regular_price.min' => 'Harga normal varian tidak boleh kurang dari 0.',
            'variants.*.sale_price.numeric' => 'Harga promo varian harus berupa angka.',
            'variants.*.sale_price.min' => 'Harga promo varian tidak boleh kurang dari 0.',
            'variants.*.sale_price.lte' => 'Harga promo tidak boleh melebihi harga normal.',
            'variants.*.shipping_weight_gram.required' => 'Berat kirim varian wajib diisi.',
            'variants.*.shipping_weight_gram.integer' => 'Berat kirim harus berupa angka bulat.',
            'variants.*.shipping_weight_gram.min' => 'Berat kirim tidak boleh kurang dari 0 gram.',
            'variants.*.image_url.string' => 'Alamat gambar varian harus berupa teks.',
            'variants.*.image_url.max' => 'Alamat gambar varian terlalu panjang.',
            'variants.*.image_url.not_regex' => 'Gunakan unggah file untuk gambar varian.',
            'variants.*.image.file' => 'Gambar varian gagal diunggah. Silakan pilih ulang.',
            'variants.*.image.image' => 'File gambar varian harus berupa gambar yang valid.',
            'variants.*.image.max' => 'Ukuran gambar varian maksimal 4 MB.',
            'variants.*.is_active.boolean' => 'Status aktif varian tidak valid.',
            'variants.*.stock_quantity.required' => 'Jumlah stok varian wajib diisi.',
            'variants.*.stock_quantity.integer' => 'Jumlah stok harus berupa angka bulat.',
            'variants.*.stock_quantity.min' => 'Jumlah stok tidak boleh kurang dari 0.',
            'variants.*.low_stock_threshold.required' => 'Batas stok rendah wajib diisi.',
            'variants.*.low_stock_threshold.integer' => 'Batas stok rendah harus berupa angka bulat.',
            'variants.*.low_stock_threshold.min' => 'Batas stok rendah tidak boleh kurang dari 0.',
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
