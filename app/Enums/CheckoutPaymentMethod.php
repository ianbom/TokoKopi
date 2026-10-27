<?php

namespace App\Enums;

use Illuminate\Validation\Rule;

enum CheckoutPaymentMethod: string
{
    case Bca = 'bca_va';
    case Bni = 'bni_va';
    case Bri = 'bri_va';
    case Mandiri = 'echannel';
    case Permata = 'permata_va';
    case Qris = 'other_qris';
    case Gopay = 'gopay';
    case Shopeepay = 'shopeepay';

    public function label(): string
    {
        return match ($this) {
            self::Bca => 'BCA Virtual Account',
            self::Bni => 'BNI Virtual Account',
            self::Bri => 'BRI Virtual Account',
            self::Mandiri => 'Mandiri Bill Payment',
            self::Permata => 'Permata Virtual Account',
            self::Qris => 'QRIS',
            self::Gopay => 'GoPay',
            self::Shopeepay => 'ShopeePay',
        };
    }

    public static function enabled(): array
    {
        return array_values(array_filter(self::cases(), fn (self $method): bool => in_array($method->value, config('services.midtrans.enabled_payments', []), true)));
    }

    public static function options(): array
    {
        return array_map(fn (self $method): array => [
            'id' => $method->value,
            'name' => $method->label(),
            'logo' => '/images/payments/'.$method->value.($method === self::Gopay ? '.webp' : '.png'),
        ], self::enabled());
    }

    public static function rules(): array
    {
        return ['required', 'string', Rule::in(array_map(fn (self $method): string => $method->value, self::enabled()))];
    }
}
