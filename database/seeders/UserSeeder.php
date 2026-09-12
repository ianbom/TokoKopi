<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'password' => 'admin123',
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
        foreach ([
            [
                'email' => 'customer@Deklasecoffee.test',
                'attributes' => [
                    'name' => 'Deklase Customer',
                    'phone' => '081234567890',
                    'password' => 'password',
                    'role' => 'customer',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ],
                'address' => [
                    'recipient_name' => 'Deklase Customer',
                    'recipient_phone' => '081234567890',
                    'label' => 'Rumah',
                    'province' => 'Jawa Timur',
                    'city' => 'Kota Blitar',
                    'district' => 'Sananwetan',
                    'subdistrict' => 'Bendogerit',
                    'postal_code' => '66133',
                    'biteship_area_id' => null,
                    'latitude' => -8.0924970,
                    'longitude' => 112.1801619,
                    'full_address' => 'Jl. Semeru No. 12, Bendogerit, Sananwetan, Kota Blitar, Jawa Timur 66133',
                    'note' => 'Alamat demo customer.',
                    'is_default' => true,
                ],
            ],
            [
                'email' => 'i.alehansyah@gmail.com',
                'attributes' => [
                    'name' => 'Ian A',
                    'phone' => '081234567891',
                    'password' => 'ianbom123',
                    'role' => 'customer',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ],
                'address' => [
                    'recipient_name' => 'Ian A',
                    'recipient_phone' => '081234567891',
                    'label' => 'Rumah',
                    'province' => 'Jawa Timur',
                    'city' => 'Kota Malang',
                    'district' => 'Sukun',
                    'subdistrict' => 'Bandungrejosari',
                    'postal_code' => '65148',
                    'biteship_area_id' => null,
                    'latitude' => -8.0057840,
                    'longitude' => 112.6306830,
                    'full_address' => 'Jl. Melati No. 8, Bandungrejosari, Sukun, Kota Malang, Jawa Timur 65148',
                    'note' => 'Alamat demo customer.',
                    'is_default' => true,
                ],
            ],
        ] as $customer) {
            $user = User::query()->updateOrCreate(
                ['email' => $customer['email']],
                $customer['attributes'],
            );

            $user->addresses()->updateOrCreate(
                ['label' => $customer['address']['label']],
                $customer['address'],
            );
        }
    }
}
