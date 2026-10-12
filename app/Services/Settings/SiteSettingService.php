<?php

namespace App\Services\Settings;

use App\Models\SiteSetting;

class SiteSettingService
{
    public function get(string $key, ?string $default = null): ?string
    {
        $setting = SiteSetting::query()->where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }

    public function first(array $keys, ?string $default = null): ?string
    {
        foreach ($keys as $key) {
            $setting = SiteSetting::query()->where('key', $key)->first();
            if ($setting) {
                return $setting->value;
            }
        }

        return $default;
    }
}
