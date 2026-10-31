<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CustomerAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'recipient_name' => ['required', 'string', 'max:150'],
            'recipient_phone' => ['required', 'string', 'max:30'],
            'label' => ['nullable', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'subdistrict' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'biteship_area_id' => ['nullable', 'string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'full_address' => ['required', 'string', 'max:5000'],
            'note' => ['nullable', 'string', 'max:2000'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'recipient_name.required' => 'Nama penerima wajib diisi.',
            'recipient_name.string' => 'Nama penerima harus berupa teks.',
            'recipient_name.max' => 'Nama penerima maksimal 150 karakter.',
            'recipient_phone.required' => 'Nomor telepon wajib diisi.',
            'recipient_phone.string' => 'Nomor telepon harus berupa teks.',
            'recipient_phone.max' => 'Nomor telepon maksimal 30 karakter.',
            'label.string' => 'Label alamat harus berupa teks.',
            'label.max' => 'Label alamat maksimal 100 karakter.',
            'province.required' => 'Provinsi wajib diisi.',
            'province.string' => 'Provinsi harus berupa teks.',
            'province.max' => 'Provinsi maksimal 100 karakter.',
            'city.required' => 'Kota wajib diisi.',
            'city.string' => 'Kota harus berupa teks.',
            'city.max' => 'Kota maksimal 100 karakter.',
            'district.required' => 'Kecamatan wajib diisi.',
            'district.string' => 'Kecamatan harus berupa teks.',
            'district.max' => 'Kecamatan maksimal 100 karakter.',
            'subdistrict.string' => 'Kelurahan harus berupa teks.',
            'subdistrict.max' => 'Kelurahan maksimal 100 karakter.',
            'postal_code.required' => 'Kode pos wajib diisi.',
            'postal_code.string' => 'Kode pos harus berupa teks.',
            'postal_code.max' => 'Kode pos maksimal 20 karakter.',
            'biteship_area_id.string' => 'ID area pengiriman tidak valid.',
            'biteship_area_id.max' => 'ID area pengiriman terlalu panjang.',
            'latitude.numeric' => 'Titik koordinat latitude harus berupa angka.',
            'latitude.between' => 'Titik koordinat latitude harus di antara -90 dan 90.',
            'longitude.numeric' => 'Titik koordinat longitude harus di antara -180 dan 180.',
            'longitude.between' => 'Titik koordinat longitude harus di antara -180 dan 180.',
            'full_address.required' => 'Alamat lengkap wajib diisi.',
            'full_address.string' => 'Alamat lengkap harus berupa teks.',
            'full_address.max' => 'Alamat lengkap maksimal 5000 karakter.',
            'note.string' => 'Catatan alamat harus berupa teks.',
            'note.max' => 'Catatan alamat maksimal 2000 karakter.',
            'is_default.boolean' => 'Pilihan alamat utama tidak valid.',
        ];
    }
}
