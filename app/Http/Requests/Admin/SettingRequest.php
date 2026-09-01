<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
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
            'store_name' => ['nullable', 'string', 'max:150'],
            'store_email' => ['nullable', 'email', 'max:191'],
            'store_phone' => ['nullable', 'string', 'max:30'],
            'store_address' => ['nullable', 'string', 'max:2000'],
            'store_maps_url' => ['nullable', 'url', 'max:255'],
            'instagram_handle' => ['nullable', 'string', 'max:100'],
            'tiktok_handle' => ['nullable', 'string', 'max:100'],
            'store_latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'store_longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'payment_expiry_duration' => ['nullable', 'integer', 'min:1', 'max:10080'],
            'payment_service_fee' => ['nullable', 'numeric', 'min:0'],
            'store_postal_code' => ['nullable', 'string', 'max:20'],
            'shipping_couriers' => ['nullable', 'string', 'max:255'],
        ];
    }
}
