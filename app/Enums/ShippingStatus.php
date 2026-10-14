<?php

namespace App\Enums;

enum ShippingStatus: string
{
    case NotCreated = 'not_created';
    case Creating = 'creating';
    case Confirmed = 'confirmed';
    case Scheduled = 'scheduled';
    case Allocated = 'allocated';
    case PickingUp = 'picking_up';
    case Picked = 'picked';
    case InTransit = 'in_transit';
    case DroppingOff = 'dropping_off';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Failed = 'failed';
    case Rejected = 'rejected';
    case CourierNotFound = 'courier_not_found';
    case Problem = 'problem';
    case Lost = 'lost';
    case Returned = 'returned';
    case OnHold = 'on_hold';
    case ReturnInTransit = 'return_in_transit';
    case Disposed = 'disposed';

    public static function activeValues(): array
    {
        return [self::Creating->value, self::Confirmed->value, self::Scheduled->value, self::Allocated->value, self::PickingUp->value, self::Picked->value, self::InTransit->value, self::DroppingOff->value, self::Delivered->value];
    }

    public static function retryableValues(): array
    {
        return [self::NotCreated->value, self::Failed->value, self::Problem->value];
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function issueValues(): array
    {
        return [self::Failed->value, self::Rejected->value, self::CourierNotFound->value, self::Cancelled->value, self::Problem->value, self::Lost->value, self::Returned->value, self::OnHold->value, self::ReturnInTransit->value, self::Disposed->value];
    }
}
