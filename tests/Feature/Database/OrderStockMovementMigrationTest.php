<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

function stockMovementMigration(): Migration
{
    return require database_path('migrations/2026_10_12_100002_add_movement_type_to_order_item_stock_movements_table.php');
}

function stockMovementMigrationRow(): array
{
    $user = User::factory()->create();
    $order = Order::query()->create([
        'user_id' => $user->id, 'order_number' => 'MIG-'.Str::uuid(),
        'customer_name' => $user->name, 'customer_email' => $user->email,
        'customer_phone' => '081234567890', 'subtotal' => 10000, 'grand_total' => 10000,
    ]);
    $item = $order->items()->create(['product_name' => 'Kopi Gayo', 'quantity' => 1, 'price' => 10000, 'subtotal' => 10000]);

    return ['order_item_id' => $item->id, 'product_variant_id' => null, 'quantity' => -1, 'stock_before' => 5, 'stock_after' => 4];
}

beforeEach(function () {
    Schema::drop('order_item_stock_movements');
    $migration = require database_path('migrations/2026_10_12_100001_create_order_item_stock_movements_table.php');
    $migration->up();
});

test('stock movement migration preserves data and is safe to run twice', function () {
    $row = stockMovementMigrationRow();
    DB::table('order_item_stock_movements')->insert($row);
    $migration = stockMovementMigration();
    $migration->up();
    $migration->up();

    expect(Schema::hasColumn('order_item_stock_movements', 'movement_type'))->toBeTrue()
        ->and(Schema::hasIndex('order_item_stock_movements', ['order_item_id'], 'unique'))->toBeFalse()
        ->and(Schema::hasIndex('order_item_stock_movements', ['order_item_id', 'movement_type'], 'unique'))->toBeTrue();
    $this->assertDatabaseHas('order_item_stock_movements', [...$row, 'movement_type' => 'deduction']);
    $this->assertDatabaseCount('order_item_stock_movements', 1);
});

test('stock movement migration resumes after a partial mysql migration', function (bool $replacementExists) {
    $row = stockMovementMigrationRow();
    DB::table('order_item_stock_movements')->insert($row);
    Schema::table('order_item_stock_movements', fn (Blueprint $table) => $table->string('movement_type', 20)->default('deduction'));
    if ($replacementExists) {
        Schema::table('order_item_stock_movements', fn (Blueprint $table) => $table->unique(['order_item_id', 'movement_type'], 'order_item_stock_movement_type_unique'));
    }
    stockMovementMigration()->up();

    expect(Schema::hasIndex('order_item_stock_movements', ['order_item_id'], 'unique'))->toBeFalse()
        ->and(Schema::hasIndex('order_item_stock_movements', ['order_item_id', 'movement_type'], 'unique'))->toBeTrue();
    $this->assertDatabaseHas('order_item_stock_movements', [...$row, 'movement_type' => 'deduction']);
})->with(['column only' => false, 'column and replacement index' => true]);

test('stock movements allow one deduction and one release but reject repeated types', function () {
    stockMovementMigration()->up();
    $row = stockMovementMigrationRow();
    DB::table('order_item_stock_movements')->insert([...$row, 'movement_type' => 'deduction']);
    DB::table('order_item_stock_movements')->insert([...$row, 'movement_type' => 'release', 'quantity' => 1, 'stock_before' => 4, 'stock_after' => 5]);
    $this->assertDatabaseCount('order_item_stock_movements', 2);
    expect(fn () => DB::table('order_item_stock_movements')->insert([...$row, 'movement_type' => 'deduction']))->toThrow(QueryException::class);
});

test('stock movement migration preserves the order item foreign key', function () {
    stockMovementMigration()->up();
    $row = stockMovementMigrationRow();
    expect(fn () => DB::table('order_item_stock_movements')->insert([...$row, 'order_item_id' => 999999]))->toThrow(QueryException::class);
    DB::table('order_item_stock_movements')->insert($row);
    DB::table('order_items')->where('id', $row['order_item_id'])->delete();
    $this->assertDatabaseCount('order_item_stock_movements', 0);
});

test('stock movement rollback restores the original unique index without losing deductions', function () {
    $migration = stockMovementMigration();
    $migration->up();
    $row = stockMovementMigrationRow();
    DB::table('order_item_stock_movements')->insert($row);
    $migration->down();

    expect(Schema::hasColumn('order_item_stock_movements', 'movement_type'))->toBeFalse()
        ->and(Schema::hasIndex('order_item_stock_movements', ['order_item_id'], 'unique'))->toBeTrue();
    $this->assertDatabaseHas('order_item_stock_movements', $row);
    expect(fn () => DB::table('order_item_stock_movements')->insert($row))->toThrow(QueryException::class);
});

test('stock movement rollback refuses to discard release history', function () {
    $migration = stockMovementMigration();
    $migration->up();
    $row = stockMovementMigrationRow();
    DB::table('order_item_stock_movements')->insert([...$row, 'movement_type' => 'deduction']);
    DB::table('order_item_stock_movements')->insert([...$row, 'movement_type' => 'release', 'quantity' => 1]);
    expect(fn () => $migration->down())->toThrow(RuntimeException::class, 'Riwayat pengembalian stok');

    expect(Schema::hasColumn('order_item_stock_movements', 'movement_type'))->toBeTrue()
        ->and(Schema::hasIndex('order_item_stock_movements', ['order_item_id', 'movement_type'], 'unique'))->toBeTrue();
    $this->assertDatabaseCount('order_item_stock_movements', 2);
});
