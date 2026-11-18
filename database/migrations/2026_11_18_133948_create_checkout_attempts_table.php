<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checkout_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('idempotency_key', 100);
            $table->string('midtrans_order_id', 100)->unique();
            $table->string('environment', 10);
            $table->string('payment_method', 30);
            $table->char('request_hash', 64);
            $table->char('snap_request_hash', 64)->nullable();
            $table->string('status', 20)->index();
            $table->text('snap_response')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'idempotency_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkout_attempts');
    }
};
