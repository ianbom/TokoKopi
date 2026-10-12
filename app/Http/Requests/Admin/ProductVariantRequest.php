<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    public function rules(): array
    {
        $variant = $this->route('productVariant');

        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('product_variants', 'sku')->ignore($variant)],
            'net_weight' => ['required', 'string', 'max:100'],
            'regular_price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lte:regular_price'],
            'shipping_weight_gram' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'file', 'image', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk kopi wajib dipilih.',
            'product_id.exists' => 'Produk kopi yang dipilih tidak tersedia.',
            'sku.unique' => 'SKU varian sudah digunakan. Gunakan SKU lain atau kosongkan.',
            'sku.max' => 'SKU maksimal 100 karakter.',
            'net_weight.required' => 'Berat bersih wajib diisi.',
            'net_weight.string' => 'Berat bersih harus berupa teks.',
            'net_weight.max' => 'Berat bersih maksimal 100 karakter.',
            'regular_price.required' => 'Harga normal wajib diisi.',
            'regular_price.numeric' => 'Harga normal harus berupa angka.',
            'regular_price.min' => 'Harga normal tidak boleh negatif.',
            'sale_price.numeric' => 'Harga promo harus berupa angka.',
            'sale_price.min' => 'Harga promo tidak boleh negatif.',
            'sale_price.lte' => 'Harga promo tidak boleh melebihi harga normal.',
            'shipping_weight_gram.required' => 'Berat kirim wajib diisi.',
            'shipping_weight_gram.integer' => 'Berat kirim harus berupa angka bulat.',
            'shipping_weight_gram.min' => 'Berat kirim wajib minimal 1 gram, termasuk varian draft atau nonaktif.',
            'image.image' => 'File harus berupa gambar kopi yang valid.',
            'image.max' => 'Gambar terlalu besar. Maksimal 2 MB.',
            'stock_quantity.required' => 'Stok wajib diisi.',
            'stock_quantity.integer' => 'Stok harus berupa angka bulat.',
            'stock_quantity.min' => 'Stok tidak boleh negatif.',
            'low_stock_threshold.required' => 'Batas stok rendah wajib diisi.',
            'low_stock_threshold.integer' => 'Batas stok rendah harus berupa angka bulat.',
            'low_stock_threshold.min' => 'Batas stok rendah tidak boleh negatif.',
        ];
    }
}
