# Pemulihan integrasi Deklase

Implementasi audit M1-M7, B1-B5, P1-P3, 12 Oktober 2026. Berlaku untuk database kosong sesuai keputusan pengguna, bukan panduan backfill order historis.

## Prasyarat rilis

- Deploy source dan build frontend dari revisi yang sama; Wayfinder digenerasikan oleh build, bukan diedit manual.
- Pastikan migration workflow/stock movement/booking uncertainty yang sudah ada di repository ikut dalam deployment melalui prosedur migrasi normal. Pekerjaan ini tidak menjalankan migration/reset/reseed database aplikasi.
- Konfigurasi key Midtrans/Biteship, mode sandbox/production, webhook signature/secret, identitas toko, alamat, postal code dan koordinat. Jangan simpan key pada source atau dokumentasi.
- Jalankan scheduler Laravel setiap menit dan queue worker untuk email/notifikasi. Dua tugas pemulihan dijadwalkan setiap 10 menit, dengan `withoutOverlapping`.
- Berat kirim setiap varian minimal 1 gram, termasuk varian draft/inactive. Booking memakai `food_and_drink`, berat per unit dan quantity terpisah; dimensi tidak diwajibkan.

## Midtrans

1. Buka admin Payments; filter `manual_review`, periksa failure reason, marker Snap uncertain, related order dan payment logs. Error Sync Status ditampilkan pada halaman.
2. Gunakan Sync Status untuk membaca status provider. Rekonsiliasi terjadwal mencakup pending/authorize yang expired dan Snap uncertain yang belum expired.
3. Jangan mengulang checkout atau membuat Snap baru ketika hasil creation uncertain. Cart/voucher dipertahankan; idempotency key yang sama tidak membuat sesi kedua.
4. Pembatalan customer/admin wajib mendapat kepastian provider. Not-found hanya cukup jika Snap token diketahui dan cancel session memiliki `canceled_at`; pending/authorize memerlukan cancel transaction valid dengan reference/amount cocok. Timeout/response malformed tetap unresolved.
5. Jika status sudah settlement/capture/refund, jangan memaksa cancel lokal. Payment final disinkronkan; paid yang datang setelah order ditutup masuk manual review tanpa memotong stok otomatis.
6. Jika alasan review menunjukkan stok tidak cukup, periksa stok dan movement order, koreksi stok melalui workflow resmi, lalu sync ulang. Jangan mengedit payment/status/movement langsung untuk melewati guard.

Perintah manual (membaca API provider untuk payment yang memenuhi kriteria):

```powershell
php artisan payments:sync-expired-midtrans
```

Amount provider wajib cocok dengan gross integer IDR. Receipt mismatch tetap tersimpan di payment logs; raw payload tidak dicetak ke application log. Data payload di database/admin tetap sensitif: batasi akses dan retensinya.

## Biteship

1. Booking hanya untuk order paid setelah packing/ready_to_ship, memakai pilihan kurir checkout tersimpan.
2. Jika `booking_uncertain` aktif, jangan tekan create/retry booking berulang. Periksa dashboard provider dan sinkronkan booking yang sudah diketahui sebelum melanjutkan. Reference booking yang belum diketahui membutuhkan rekonsiliasi operator, bukan POST booking baru.
3. Webhook sebelum booking tersimpan tetap pending. Replay segera setelah booking dan scheduler memproses receipt saat shipment dapat dicocokkan.
4. Replay idempotent: receipt yang sudah processed tidak diaplikasikan ulang; apply shipment dan processed_at berada dalam satu transaksi. Receipt dengan identifier bertentangan tidak ditautkan paksa.
5. Status provider tidak dikenal dicatat tanpa mengganti state; transisi stale/regressive diabaikan. Hold/return/disposed tidak otomatis melakukan refund atau menyelesaikan order.
6. Completion order memerlukan order dan shipment sama-sama delivered. Timestamp pertama serta tracking HTTP(S) yang valid dipertahankan.

Perintah manual (memproses receipt tersimpan, tidak membuat booking baru):

```powershell
php artisan shipments:replay-biteship-webhooks
```

Output replay: `checked`, `processed`, `failed`. Pending tanpa shipment cocok tetap pending, bukan failure. Exception dicatat menggunakan receipt ID dan class exception, bukan raw alamat/payload.

## Verifikasi rilis

- Jalankan focused integration/product/workflow suite, frontend typecheck/build dan lint/format file terubah.
- Full CI masih memiliki debt existing; jangan menyatakan full-suite pass.
- Sebelum production: rendered QA desktop/mobile untuk checkout/form/error, pengujian concurrency pada engine database produksi, serta transaksi sandbox payment/cancel/webhook dan booking/status/replay. Pengujian lokal HTTP fake tidak menggantikan langkah ini.
- Tidak ada transaksi sandbox/live atau aplikasi DB migration dilakukan dalam implementasi ini. Browser QA lokal terhalang izin remote debugging.

### Hasil lokal final

- Focused suite bagian 8 audit ditambah `IntegrationRecoveryTest.php`: 94 passed, 751 assertions.
- Recovery + OrderWorkflow: 63 passed, 362 assertions.
- Full `php artisan test --compact`: 188 tes, 184 passed, 4 failed, 1605 assertions. Kegagalan existing: AuthenticationTest, DashboardTest, HomeBannerImagesTest, CoffeeSeederTest; bukan full-suite pass.
- `npm run build`: passed, 3043 modules; Wayfinder digenerasikan ulang. `npm run types:check`: passed.
- ESLint/Prettier file TS/TSX terubah dan Pint file PHP terubah: passed. `git diff --check`: passed.
- `node --experimental-strip-types --test tests/js/order-workflow.test.mjs`: 1 passed.
- `composer run ci:check`: blocked pada ESLint dengan 16 error dan 1 warning di luar file implementasi terfokus. Tidak mengubah file unrelated untuk menghilangkan kegagalan tersebut.

Focused pemulihan dapat diulang dengan:

```powershell
php artisan test --compact tests/Feature/Customer/IntegrationRecoveryTest.php tests/Feature/Admin/OrderWorkflowTest.php
node --experimental-strip-types --test tests/js/order-workflow.test.mjs
```
