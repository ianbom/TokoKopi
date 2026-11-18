<?php

namespace App\Enums;

use Illuminate\Validation\Rule;

enum CheckoutPaymentMethod: string
{
    case Gopay = 'gopay';
    case Mandiri = 'echannel';
    case Bni = 'bni_va';
    case Bri = 'bri_va';
    case Permata = 'permata_va';
    case Cimb = 'cimb_va';
    case Bsi = 'bsi_va';
    case Other = 'other_va';
    case Bca = 'bca_va';
    case Qris = 'other_qris';
    case Shopeepay = 'shopeepay';

    public function label(): string
    {
        return match ($this) {
            self::Bca => 'BCA Virtual Account',
            self::Bni => 'BNI VA',
            self::Bri => 'BRI VA',
            self::Mandiri => 'Mandiri VA',
            self::Permata => 'Permata VA',
            self::Cimb => 'CIMB Niaga VA',
            self::Bsi => 'BSI VA',
            self::Other => 'Other VA',
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
            'logo' => '/images/payments/'.$method->value.match ($method) {
                self::Gopay => '.webp',
                self::Other => '.svg',
                default => '.png',
            },
        ], self::enabled());
    }

    public static function rules(): array
    {
        return ['required', 'string', Rule::in(array_map(fn (self $method): string => $method->value, self::enabled()))];
    }
}
