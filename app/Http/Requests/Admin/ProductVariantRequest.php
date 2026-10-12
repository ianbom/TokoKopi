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
            'grind_type' => ['nullable', Rule::in(['whole_bean', 'fine', 'medium', 'coarse'])],
            'length' => ['required', 'numeric', 'gt:0', 'max:999999.99', 'decimal:0,2'],
            'width' => ['required', 'numeric', 'gt:0', 'max:999999.99', 'decimal:0,2'],
            'height' => ['required', 'numeric', 'gt:0', 'max:999999.99', 'decimal:0,2'],
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
            'length.required' => 'Panjang kemasan wajib diisi dalam cm.',
            'length.numeric' => 'Panjang kemasan harus berupa angka.',
            'length.gt' => 'Panjang kemasan harus lebih dari 0 cm.',
            'length.max' => 'Panjang kemasan maksimal 999999.99 cm.',
            'length.decimal' => 'Panjang kemasan maksimal 2 angka desimal.',
            'width.required' => 'Lebar kemasan wajib diisi dalam cm.',
            'width.numeric' => 'Lebar kemasan harus berupa angka.',
            'width.gt' => 'Lebar kemasan harus lebih dari 0 cm.',
            'width.max' => 'Lebar kemasan maksimal 999999.99 cm.',
            'width.decimal' => 'Lebar kemasan maksimal 2 angka desimal.',
            'height.required' => 'Tinggi kemasan wajib diisi dalam cm.',
            'height.numeric' => 'Tinggi kemasan harus berupa angka.',
            'height.gt' => 'Tinggi kemasan harus lebih dari 0 cm.',
            'height.max' => 'Tinggi kemasan maksimal 999999.99 cm.',
            'height.decimal' => 'Tinggi kemasan maksimal 2 angka desimal.',
            'grind_type.in' => 'Pilih grind type yang tersedia.',
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
