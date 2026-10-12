<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('order_item_stock_movements', 'movement_type')) {
            Schema::table('order_item_stock_movements', function (Blueprint $table) {
                $table->string('movement_type', 20)->default('deduction');
            });
        }

        if (! Schema::hasIndex('order_item_stock_movements', 'order_item_stock_movement_type_unique')) {
            Schema::table('order_item_stock_movements', function (Blueprint $table) {
                $table->unique(['order_item_id', 'movement_type'], 'order_item_stock_movement_type_unique');
            });
        }

        if (Schema::hasIndex('order_item_stock_movements', 'order_item_stock_movements_order_item_id_unique')) {
            Schema::table('order_item_stock_movements', function (Blueprint $table) {
                $table->dropUnique(['order_item_id']);
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('order_item_stock_movements', 'movement_type')) {
            return;
        }

        if (DB::table('order_item_stock_movements')->where('movement_type', 'release')->exists()) {
            throw new RuntimeException('Riwayat pengembalian stok sudah ada. Rollback dibatalkan agar riwayat stok tetap utuh.');
        }

        if (! Schema::hasIndex('order_item_stock_movements', 'order_item_stock_movements_order_item_id_unique')) {
            Schema::table('order_item_stock_movements', function (Blueprint $table) {
                $table->unique('order_item_id');
            });
        }

        if (Schema::hasIndex('order_item_stock_movements', 'order_item_stock_movement_type_unique')) {
            Schema::table('order_item_stock_movements', function (Blueprint $table) {
                $table->dropUnique('order_item_stock_movement_type_unique');
            });
        }

        Schema::table('order_item_stock_movements', function (Blueprint $table) {
            $table->dropColumn('movement_type');
        });
    }
};
