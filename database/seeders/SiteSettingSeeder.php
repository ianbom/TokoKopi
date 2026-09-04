<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $settings = [
            ['key' => 'store_name', 'value' => 'Deklase Roastery', 'type' => 'string'],
            ['key' => 'store_email', 'value' => 'deklaseroastery@gmail.com', 'type' => 'string'],
            ['key' => 'store_phone', 'value' => '085649529166', 'type' => 'string'],
            ['key' => 'store_address', 'value' => 'Ruko PJKA, Jl. Mastrip, Kepanjen Kidul, Sukorejo, Kota Blitar, Jawa Timur 66117, Indonesia', 'type' => 'text'],
            ['key' => 'store_maps_url', 'value' => 'https://maps.app.goo.gl/WC84rwHiPkmPm6ng7', 'type' => 'string'],
            ['key' => 'instagram_handle', 'value' => '@Deklaseid', 'type' => 'string'],
            ['key' => 'tiktok_handle', 'value' => '@deklaseroastery', 'type' => 'string'],
            ['key' => 'store_latitude', 'value' => '-8.092497', 'type' => 'number'],
            ['key' => 'store_longitude', 'value' => '112.1801619', 'type' => 'number'],
            ['key' => 'store_postal_code', 'value' => '66117', 'type' => 'string'],
            ['key' => 'shipping_couriers', 'value' => 'jne,jnt,sicepat,anteraja', 'type' => 'string'],
            ['key' => 'payment_expiry_duration', 'value' => '1440', 'type' => 'integer'],
            ['key' => 'payment_service_fee', 'value' => '0', 'type' => 'integer'],
        ];

        foreach ($settings as &$setting) {
            $setting['created_at'] = $now;
            $setting['updated_at'] = $now;
        }

        DB::table('site_settings')
            ->whereIn('key', [
                'enabled_couriers',
                'whatsapp_number',
                'instagram_url',
                'tiktok_url',
                'footer_text',
                'contact_phone',
                'contact_address',
                'contact_maps_url',
                'business_hours',
                'origin_address',
                'origin_province',
                'origin_city',
                'origin_district',
                'shipper_name',
                'shipper_phone',
            ])
            ->delete();

        DB::table('site_settings')->upsert(
            $settings,
            ['key'],             // unique column to match on
            ['value', 'type', 'updated_at']  // columns to update if exists
        );
    }
}
