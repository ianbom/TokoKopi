<?php

use App\Actions\Shipments\ProcessBiteshipWebhookAction;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('payments:sync-expired-midtrans')->everyTenMinutes()->withoutOverlapping();

Artisan::command('shipments:replay-biteship-webhooks', function (ProcessBiteshipWebhookAction $processor) {
    $stats = $processor->replay();
    $this->info(json_encode($stats, JSON_THROW_ON_ERROR));

    return $stats['failed'] > 0 ? 1 : 0;
})->purpose('Process pending Biteship webhook receipts');

Schedule::command('shipments:replay-biteship-webhooks')->everyTenMinutes()->withoutOverlapping();
