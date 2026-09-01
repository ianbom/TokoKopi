<?php

namespace App\Services\Admin;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class SettingManagementService
{
    private array $sections = [
        'store' => [
            'title' => 'Store Settings',
            'description' => 'Kelola identitas toko, kontak, dan link sosial yang tampil di website.',
            'fields' => [
                ['key' => 'store_name', 'label' => 'Store Name', 'type' => 'string'],
                ['key' => 'store_email', 'label' => 'Store Email', 'type' => 'string', 'input' => 'email'],
                ['key' => 'store_phone', 'label' => 'Store Phone', 'type' => 'string'],
                ['key' => 'store_address', 'label' => 'Store Address', 'type' => 'string', 'input' => 'textarea'],
                ['key' => 'store_maps_url', 'label' => 'Google Maps URL', 'type' => 'string', 'input' => 'url'],
                ['key' => 'store_latitude', 'label' => 'Latitude', 'type' => 'number', 'input' => 'number'],
                ['key' => 'store_longitude', 'label' => 'Longitude', 'type' => 'number', 'input' => 'number'],
                ['key' => 'instagram_handle', 'label' => 'Instagram', 'type' => 'string'],
                ['key' => 'tiktok_handle', 'label' => 'TikTok', 'type' => 'string'],
            ],
        ],
        'payment' => [
            'title' => 'Payment Settings',
            'description' => 'Simpan konfigurasi pembayaran non-sensitif. Server key tetap dikelola dari .env.',
            'fields' => [
                ['key' => 'payment_expiry_duration', 'label' => 'Payment Expiry Duration (minutes)', 'type' => 'number', 'input' => 'number'],
                ['key' => 'payment_service_fee', 'label' => 'Payment Service Fee', 'type' => 'number', 'input' => 'number'],
            ],
        ],
        'shipping' => [
            'title' => 'Shipping Settings',
            'description' => 'Kelola postal code dan kurir aktif. Identitas serta lokasi pengiriman mengikuti Store Settings.',
            'fields' => [
                ['key' => 'store_postal_code', 'label' => 'Store Postal Code', 'type' => 'string'],
                ['key' => 'shipping_couriers', 'label' => 'Shipping Couriers', 'type' => 'string'],
            ],
        ],
    ];

    public function indexData(Request $request): array
    {
        $activeSection = (string) $request->route('section', 'store');
        abort_unless(array_key_exists($activeSection, $this->sections), 404);

        $keys = $this->fields()->pluck('key')->all();

        return [
            'activeSection' => $activeSection,
            'sections' => $this->sections,
            'values' => SiteSetting::query()->whereIn('key', $keys)->pluck('value', 'key')->all(),
        ];
    }

    public function update(array $validated): void
    {
        foreach ($this->fields() as $field) {
            $key = $field['key'];

            if (! array_key_exists($key, $validated)) {
                continue;
            }

            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'value' => $this->normalizeValue($validated[$key]),
                    'type' => $field['type'],
                ],
            );
        }
    }

    private function fields(): Collection
    {
        return collect($this->sections)->flatMap(fn (array $section): array => $section['fields'])->values();
    }

    private function normalizeValue(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_array($value)) {
            return json_encode($value, JSON_THROW_ON_ERROR);
        }

        return (string) $value;
    }
}
