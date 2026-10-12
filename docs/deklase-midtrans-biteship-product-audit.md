# Audit Deklase: Midtrans, Biteship, Product dan Product Variant

Tanggal audit: 12 Oktober 2026. Codebase: Declasse Coffee / TokoKopi, disebut Deklase dalam dokumen ini.

## 1. Lingkup dan dasar pemeriksaan

- Sumber revisi induk: `commit-changes-87cca12-to-3740ad8.md`, rentang AxeGear `87cca12..3740ad8`.
- Pembanding: source Deklase pada HEAD `75c36e8` **beserta perubahan working tree**, bukan HEAD saja. Perubahan workflow, stock movement dan booking uncertainty yang sudah berada di working tree ikut diperiksa.
- Konteks domain: `prd.md`, `db.md`, `design.md`; source dan migration aktual menentukan kemampuan aplikasi saat ini. Dokumen domain belum tentu mencakup perubahan working tree terbaru.
- Bagian 1-9 merekam audit sebelum implementasi. Status implementasi dan verifikasi terbaru ada pada bagian 10; panduan operator ada di `docs/integration-recovery.md`.
- Laporan induk dipakai sebagai petunjuk, bukan bukti bahwa semua perbaikannya cocok untuk Deklase. Commit di bawah mengikuti atribusi laporan induk; tidak mengklaim pemeriksaan langsung seluruh diff Git repo AxeGear.
- Bukti dibedakan: temuan source, pemeriksaan kontrak resmi provider, probe lokal, dan tes otomatis. Tidak ada bukti browser QA, concurrency MySQL, atau transaksi sandbox/live provider dalam audit ini.

## 2. Ringkasan prioritas

P1: risiko pembayaran/fulfillment salah; P2: konsistensi data, keamanan log dan operasional; P3: UX atau perubahan bisnis bersyarat.

| ID | Prioritas | Perbandingan dengan induk | Perubahan Deklase yang diperlukan |
| --- | --- | --- | --- |
| M1 | P1 | Kesalahan sama, belum selesai | Jangan cancel lokal sebelum pembatalan provider terkonfirmasi, termasuk jalur admin. |
| M2 | P1 | Kesalahan sama + bug lokal tambahan | Bedakan Snap rejection dan uncertain; validasi token/redirect; perbaiki capture exception. |
| M3 | P1 | Guard status masih parsial | Tolak regresi status final sebelum metadata diperbarui. |
| M4 | P1 | Kesalahan sama | Satukan pembulatan IDR, item details, total dan validasi amount. |
| B1 | P1 | Kesalahan sama | Booking memakai coordinate object; rates tetap flat. |
| B2 | P1 | Kesalahan sama | Harga rate invalid jangan berubah menjadi ongkir gratis. |
| B3 | P1 | Kesalahan sama | Receipt webhook pending harus dapat diproses ulang secara atomic. |
| B5 | P1 | Sebagian sudah diperbaiki | Lengkapi guard transisi shipment dan completion di server. |
| P1 | P1 | Adaptasi domain diperlukan | Berat kirim varian yang dijual harus positif; jangan tersembunyi oleh fallback 1 gram. |
| M5 | P2 | Kesalahan sama pada sync | Simpan rejection log tanpa rollback akibat exception. |
| M6 | P2 | Kesalahan sama | Hapus raw webhook/provider body dari application log. |
| M7 | P2 | Belum lengkap | Alasan manual review dan rekonsiliasi uncertain harus terlihat serta dapat dijalankan. |
| B4 | P2 | Kesalahan sama | Pertahankan tracking link dan batasi URL ke HTTP(S). |
| P2 | P2 | Perlu verifikasi fixture | Samakan harga kartu dengan harga yang digunakan untuk sorting. |
| P3 | P3 | Sebagian UX sudah tersedia | Lengkapi error summary, fokus dan hubungan ARIA tanpa mengganti seluruh form. |

## 3. Midtrans

### M1. Pembatalan lokal tanpa kepastian provider

**Induk:** bagian 5.3, terutama commit `3740ad8`, memeriksa status provider, membatalkan Snap session untuk transaksi yang benar-benar belum ditemukan, dan memvalidasi hasil cancel transaksi.

**Deklase:** `app/Services/Customer/OrderService.php:142` mengizinkan cancel lokal ketika ID Midtrans kosong atau ketika metode pembayaran dan transaction ID belum terisi (`:150`). Tidak memilih metode pembayaran bukan bukti Snap session sudah tidak bisa dibayar. `app/Services/Integrations/MidtransService.php:67` belum memvalidasi seluruh reference, amount dan status response cancel. Jalur admin `app/Services/Admin/OrderManagementService.php:108` juga mempunyai pengecualian cancel unpaid yang langsung mengubah status lokal.

**Dampak:** aplikasi menyatakan cancelled sementara provider masih menerima pembayaran; voucher/status order bisa dilepas atau diubah terlalu awal.

**Perubahan:** gunakan satu flow cancellation terverifikasi untuk customer dan admin. Not-found hanya sah dari response Midtrans yang sesuai kontrak, bukan semua HTTP 404/timeout. Jika belum ada transaksi tetapi Snap token diketahui, cancel session dan periksa `canceled_at`. Untuk pending/authorize, validasi response cancel beserta order reference dan amount. Provider sudah final harus disinkronkan, kemudian cancel ditolak. Lock/recheck sebelum perubahan lokal; kegagalan jaringan tetap unresolved. Jangan menyediakan cancellation sebagai perubahan status admin biasa.

**Acceptance:** belum memilih metode tetapi Snap aktif; status lookup timeout; not-found tanpa token; Snap cancel malformed; provider sudah settlement; cancel amount/reference salah; customer/admin cancel bersamaan dengan webhook paid.

### M2. Snap uncertain diperlakukan sebagai failure, cleanup juga bermasalah

**Induk:** bagian 5.2, commit `3740ad8`, memisahkan rejection terkonfirmasi dari timeout/5xx/duplicate/malformed response. Uncertain mempertahankan cart dan voucher serta masuk manual review.

**Deklase:** `app/Services/Integrations/MidtransService.php:17` belum memastikan token nonempty dan redirect HTTPS valid. `app/Services/Customer/CheckoutService.php:321` menangani semua exception sebagai transaksi gagal; response sukses tanpa token/URL tetap dapat diteruskan sampai cart dikosongkan. **Bug tambahan:** closure catch pada `:330` hanya menangkap `$payment`, tetapi `:334` memakai `$exception->getMessage()`. Exception tidak tersedia di closure, sehingga cleanup dapat gagal dan rollback.

**Perubahan:** perbaiki capture exception; klasifikasikan hasil provider. Rejection harus terbukti dari kontrak error provider, bukan semua 4xx. Timeout, duplicate, 5xx atau response sukses tanpa session valid masuk uncertain/manual_review, mempertahankan cart/voucher dan melarang pembuatan session baru secara membabi buta. Recheck payment yang sudah paid sebelum update failure. Simpan marker uncertain dan failure reason yang aman; jangan menambahkan stock reservation AxeGear karena domain Deklase tidak memilikinya.

**Acceptance:** exception asli tidak tertutup exception cleanup; response tanpa token; URL non-HTTPS; timeout setelah provider mungkin berhasil; retry checkout yang sama; paid webhook datang selama Snap creation; cart/voucher tetap utuh untuk uncertain.

### M3. Status final masih dapat mundur, metadata berubah sebelum guard

**Induk:** bagian 5.1, commit `3c26c92`, `3740ad8`, guard stale/final events sebelum update dan paid idempotent tanpa mereset fulfillment.

**Deklase:** `app/Actions/Payments/ApplyMidtransPaymentStatusAction.php:35` baru memiliki guard parsial. `app/Services/Customer/MidtransWebhookService.php:69` dan `app/Actions/Payments/SyncMidtransPaymentAction.php:52` memperbarui metadata sebelum apply-status memutuskan event diterima. Refund/partial_refund lalu pending/settlement perlu guard eksplisit.

**Perubahan:** tentukan transisi legal payment/order; cek status tersimpan sebelum perubahan metadata. Duplicate/stale tetap boleh dicatat sebagai receipt yang diabaikan, tanpa merusak snapshot status/fraud/transaction. Jangan reset processing/ready_to_ship/delivered/completed saat paid diterima ulang.

**Batas penting:** stock finalization terbaru memakai unique movement per order item dan transaksi sendiri. Jangan menyatakan semua order baru akan mengurangi stok dua kali setelah refund. Order historis yang belum memiliki movement membutuhkan kebijakan kompatibilitas terpisah; jangan backfill atau deduct ulang tanpa rekonsiliasi.

**Acceptance:** paid berulang; refund lalu pending/settlement; fraud status stale; late paid ketika order cancelled; movement penuh versus sebagian; order historis tanpa movement.

### M4. Pembulatan IDR berbeda antara gross, item details dan amount matching

**Induk:** bagian 4.3, commit `3740ad8`, menggunakan integer IDR konsisten dan adjustment agar jumlah item tepat sama dengan gross.

**Deklase:** `app/Services/Integrations/MidtransService.php:24` membulatkan gross, sedangkan item pada `:114` dibulatkan per harga satuan. `amountMatches` pada `:104` memakai dua desimal. Total checkout di `app/Services/Customer/CheckoutService.php:250` dan `:575` masih bisa pecahan.

**Bukti probe lokal:** harga 1,49 x 2 menghasilkan total lokal 2,98, gross Snap 3, tetapi jumlah item Snap 2. Amount provider `3.00` tidak cocok dengan payment lokal 2,98 menurut matcher saat ini. Probe tidak memakai database/provider aktif.

**Perubahan:** tetapkan pembulatan half-up integer IDR sekali pada batas total; simpan jumlah yang benar-benar ditagihkan; pastikan jumlah `price * quantity` seluruh item, ongkir, diskon dan rounding adjustment sama dengan gross. Validasi amount provider sebagai numeric finite dengan nilai integer IDR yang sah, bukan menerima string malformed melalui cast. Tampilkan adjustment secara transparan di checkout bila diperlukan.

**Acceptance:** harga pecahan dengan quantity >1; voucher persen; ongkir; diskon; adjustment positif/negatif; nilai provider `3.00`; malformed/nonfinite amount; gross tepat sama dengan item sum.

### M5. Rejection log sync ikut rollback

**Induk:** bagian 5.1, commit `3740ad8`, commit rejection log dahulu lalu lempar validation exception di luar transaksi.

**Deklase:** `app/Actions/Payments/SyncMidtransPaymentAction.php:27` mencatat reference/amount mismatch lalu melempar exception di dalam transaksi yang sama. Log ikut rollback. Ini **bukan** keadaan semua webhook: amount mismatch pada `app/Services/Customer/MidtransWebhookService.php:44` dicatat lalu return, sehingga log jalur itu dapat commit.

**Perubahan:** pisahkan outcome transaksi dan exception; rejection log harus tetap tersimpan tanpa memutasi status payment. Terapkan urutan lock konsisten ketika berbagi jalur sync/webhook/cancellation.

**Acceptance:** sync mismatch mengembalikan error, payment tetap, satu rejection log tersimpan; webhook mismatch tetap mempertahankan log.

### M6. Application log memuat payload sensitif

**Induk:** bagian 5.1 mengharuskan sanitasi log; logging bukan alasan menyimpan seluruh payload atau selalu mengembalikan HTTP 200.

**Deklase:** `app/Http/Controllers/Customer/MidtransWebhookController.php:15` mencatat seluruh request, termasuk signature dan kemungkinan informasi customer/payment. `app/Services/Integrations/MidtransService.php:72` mencatat body kegagalan cancel.

**Perubahan:** whitelist provider, reference aman, status, event dan correlation ID. Jangan mencatat signature, token, authorization atau raw customer payload dalam application log. Receipt database yang diperlukan untuk audit memiliki kebijakan akses/retensi sendiri. Bedakan acknowledgement sukses, duplicate, invalid signature dan failure sementara sesuai kebutuhan retry provider.

**Acceptance:** log failure/success tidak memuat secret/PII; signature invalid tetap ditolak; failure processing tidak disamarkan sebagai keberhasilan.

### M7. Manual review belum memberikan diagnosis dan rekonsiliasi lengkap

**Induk:** bagian 5.1-5.2; admin menampilkan failure reason dan sync mengambil uncertain Snap meskipun belum expired.

**Deklase:** `app/Actions/Payments/ApplyMidtransPaymentStatusAction.php:70` mengubah status menjadi manual_review ketika stock finalization gagal tetapi tidak menyimpan alasan spesifik. `app/Models/Payment.php:26` **sudah** mendukung `failure_reason`; tidak perlu migration hanya untuk menambahkan field itu. `app/Actions/Payments/SyncExpiredMidtransPaymentsAction.php` hanya mengambil pending/authorize yang expired. Counter manual_review pada `app/Services/Admin/PaymentManagementService.php:49` berbasis fraud challenge/deny, bukan seluruh payment dengan transaction_status manual_review.

**Perubahan:** simpan alasan aman, marker uncertain dan waktu upaya sync; perbaiki filter/counter/detail admin; sertakan uncertain dalam rekonsiliasi dengan guard idempotent. Operator perlu tindakan jelas tanpa otomatis melepas voucher atau membuat Snap baru.

**Acceptance:** konflik stok terlihat alasannya; uncertain belum expired ikut dipilih; counter sesuai status; retry sync tidak menduplikasi stock movement.

## 4. Biteship dan fulfillment

### B1. Coordinate payload booking masih mengikuti bentuk rates

**Induk:** bagian 6.1, commit `3c26c92`, `5506fb2`, `3740ad8`, membedakan create order dan retrieve rates.

**Deklase:** booking `app/Services/Admin/ShipmentManagementService.php:388` dan `:397` masih mengirim `origin_latitude/longitude`, `destination_latitude/longitude`. Validator pada `:468` juga memeriksa bentuk flat. Kontrak create order memakai `origin_coordinate` dan `destination_coordinate`, masing-masing object latitude/longitude. Rate request justru harus tetap memakai field flat.

**Perubahan:** ubah mapper dan validator booking saja; pastikan finite dan bounds latitude -90..90, longitude -180..180. Pertahankan kebutuhan koordinat kedua sisi untuk instant courier. Request settings/address normal sudah membatasi koordinat; pemeriksaan helper finite tambahan adalah hardening, bukan bukti semua input saat ini bebas masuk.

**Acceptance:** HTTP fake assert bentuk booking nested, rates flat, koordinat 0 diterima, out-of-range/nonfinite ditolak; courier instant tanpa salah satu coordinate ditolak.

### B2. Rate missing atau invalid menjadi nol

**Induk:** bagian 6.1 membuang missing/nonnumeric/nonfinite/negatif tetapi mempertahankan nol eksplisit dan fallback `shipping_fee`.

**Deklase:** `app/Services/Integrations/BiteshipService.php:95` melakukan cast float atas `price ?? shipping_fee ?? 0`; missing atau teks invalid dapat menjadi 0 dan lolos filter nonnegative.

**Perubahan:** periksa kehadiran dan validitas nilai sebelum cast; pertahankan fallback yang valid. Nol eksplisit tidak boleh dianggap missing. Jika tidak ada rate sah, kembalikan empty/error yang jelas; jangan menyediakan ongkir gratis buatan.

**Acceptance:** missing, teks, null, negatif dan nonfinite ditolak; `0`/`0.00` sah; `shipping_fee` valid tetap terbaca; mixed valid/invalid tidak merusak seluruh hasil.

### B3. Receipt sebelum booking selesai tidak pernah diputar ulang

**Induk:** bagian 6.2 menyimpan receipt idempotent dan menambahkan atomic processing, immediate replay serta scheduled replay.

**Deklase:** `app/Http/Controllers/Customer/BiteshipWebhookController.php:25` menganggap semua hash existing sudah selesai tanpa memeriksa `processed_at`. Receipt dibuat pada `:36`, shipment diubah pada `:59`, receipt ditandai processed pada `:60`, tidak dalam satu transaksi. Shipment belum tersedia membuat receipt pending; delivery ulang hash sama tetap diabaikan. `routes/console.php` hanya menjadwalkan payment sync.

**Perubahan:** gunakan receipt unique hash/firstOrCreate; duplicate selesai hanya bila processed_at terisi. Lock receipt, pencocokan shipment, apply payload dan processed_at harus atomic. Receipt unmatched tetap pending. Replay segera setelah booking tersimpan, ditambah command terjadwal dengan withoutOverlapping dan logging error aman. Replay tidak boleh membuat booking provider baru.

**Acceptance:** webhook mendahului booking; duplicate pending diproses sesudah shipment tersedia; duplicate processed tidak mengulang efek; exception rollback status dan processed_at; dua worker; unmatched tetap pending; scheduler memulihkan receipt tertinggal.

### B4. Tracking link hilang ketika raw response diganti

**Induk:** bagian 6.4 mempertahankan link dari event/booking sebelumnya dan memvalidasi URL frontend.

**Deklase:** `app/Services/Admin/ShipmentManagementService.php:335` mengganti raw_order_response seluruhnya. Mapper webhook `app/Http/Controllers/Customer/BiteshipWebhookController.php:92` membentuk courier object tanpa mempertahankan link. `resources/js/pages/customer/order/detail-order.tsx:433` hanya mencari raw courier.link dan menerima string nonempty tanpa protokol check.

**Perubahan:** pertahankan tracking URL terakhir yang valid ketika payload baru tidak menyertakannya; pertahankan metadata relevan tanpa membiarkan status lama mengalahkan status baru. Frontend hanya menerima HTTP(S) yang valid. Jangan memakai label_url sebagai tracking URL: label pengiriman bukan halaman pelacakan. Midtrans tidak mengganti raw shipment response; tidak perlu port perbaikan di jalur payment untuk masalah ini.

**Acceptance:** booking punya link lalu webhook tanpa link; sync dengan link baru; URL invalid/non-HTTP(S); shipment lama yang sudah kehilangan link mendapat fallback aman, bukan link buatan.

### B5. Workflow sudah berkembang, guard lifecycle belum lengkap

**Induk:** bagian 6.3 dan 9.4; legal transitions, reason wajib untuk issue, stale/final guards, completion membutuhkan paid dan dua shipping snapshots delivered.

**Deklase:** workflow/history baru sudah ada. Namun `app/Services/Admin/ShipmentManagementService.php:233` terutama menjaga status final; belum sepenuhnya memeriksa transisi, payment dan booking eligibility untuk manual status update. Jalur seperti not_created langsung delivered perlu ditolak. `app/Services/Admin/OrderManagementService.php:126` mengizinkan completion berdasarkan paid dan order_status delivered, bukan memastikan shipment dan order shipping_status keduanya delivered. `app/Http/Requests/Admin/ShipmentStatusRequest.php` masih membolehkan description kosong dan belum menerima seluruh issue failed/lost/returned. Normalizer pada `app/Services/Admin/ShipmentManagementService.php:511` memetakan picking_up menjadi confirmed; status lain seperti on_hold/return_in_transit/disposed menjadi problem generik. Delivered timestamp pada `:339` masih dapat diganti oleh event delivered berbeda payload.

**Perubahan:** definisikan state machine minimum sesuai enum Deklase, validasi server untuk seluruh endpoint, reason trimmed wajib pada issue yang perlu alasan. Bedakan issue temporary, return transit dan terminal; gunakan histori untuk diagnosis tanpa otomatis refund/cancel/deduct/release stok. Completion harus memeriksa kedua snapshot; jaga delivered_at/completed_at pertama. Cocokkan status provider dengan kontrak sebelum memperluas enum; jangan menyalin string induk tanpa mapping.

**Acceptance:** not_created -> delivered ditolak; unpaid/manual-review tidak diproses; completion dengan snapshot berbeda ditolak; delivered duplicate mempertahankan timestamp; on_hold dan return transit tidak premature terminal; shipping issue tidak otomatis refund atau mengubah stok.

### Yang sudah diperbaiki: jangan dikerjakan ulang

- Booking memakai courier/service checkout melalui `source=order_detail`, dengan paid + ready_to_ship gate.
- `booking_uncertain`, validasi provider ID, dan blok retry duplicate/uncertain sudah ada; POST create tidak diulang otomatis seperti GET biasa.
- Berat booking per unit sudah `ceil(order_item.shipping_weight_gram / quantity)` pada `app/Services/Admin/ShipmentManagementService.php:413`. Snapshot item adalah berat agregat; tidak lagi langsung dikirim sebagai berat per unit. Uji rounding quantity tetap diperlukan.
- Koreksi kontrak saat implementasi: category booking kopi memakai enum resmi Biteship `food_and_drink`, bukan `coffee` atau `fashion`.
- Beberapa stale/duplicate tracking guards, terminal guards, histori admin dan stock movements sudah tersedia.
- Destination note sudah dikirim terpisah. Perbedaan penggabungan full_address/subdistrict dari induk bukan bukti note sekarang hilang.
- Canonical store settings sudah dipakai; seeder menghapus alias lama, bukan menambah identitas ganda. Perbedaan explicit-null precedence pada `app/Services/Settings/SiteSettingService.php:9` adalah keputusan kompatibilitas yang perlu diuji, bukan alasan menjalankan seeder pada DB aktif.

## 5. Product dan Product Variant

### P1. Berat kirim nol masih sah untuk varian yang dijual

**Induk:** bagian 4.1 dan 8, commit `c889c1b`, `3740ad8`, mensyaratkan ukuran varian aktif positif dan snapshot checkout konsisten.

**Deklase:** `app/Http/Requests/Admin/ProductRequest.php:55` dan `app/Http/Requests/Admin/ProductVariantRequest.php:25` menggunakan required/integer/min:0 untuk shipping_weight_gram. Publish validation pada `app/Http/Requests/Admin/ProductRequest.php:169` memeriksa varian aktif berstok, bukan berat kirim positif. Checkout/booking memakai fallback minimal 1 gram yang menyembunyikan data nol.

**Perubahan:** wajibkan berat kirim positif untuk active sellable variant pada nested maupun standalone form; checkout menolak data kirim invalid dengan error yang jelas. Bila draft/inactive boleh belum lengkap, backend/frontend harus sepakat. Berat bersih seperti gram/ml/pcs bukan pengganti berat fisik paket. Quantity dan snapshot harus mengikuti satu kontrak: rates berat per unit, order item snapshot aggregate, booking dikonversi per unit.

**Acceptance:** active weight 0 ditolak; draft/inactive sesuai kebijakan eksplisit; checkout data legacy invalid gagal aman; quantity >1 mempunyai berat quote/booking konsisten; order snapshot lama tidak berubah ketika produk diedit.

**Adaptasi wajib:** Deklase belum mempunyai length/width/height varian dan reserved_stock. Dimensi Biteship optional; empat dimensi wajib dan root estimator AxeGear bukan bugfix otomatis untuk Deklase. Tambahkan hanya bila kebutuhan layanan/packing dibuktikan, dengan migration dan fallback historis tersendiri. Jangan menambah reserved_stock bertentangan dengan PRD simple stock.

### P2. Harga sorting berpotensi berbeda dari harga kartu

**Induk:** bagian 9.3, commit `c889c1b`, memperbaiki sorting seluruh hasil sebelum pagination dan kestabilan urutan.

**Deklase:** `app/Services/Customer/ProductBrowsingService.php:58` mengurutkan harga berdasarkan minimum harga efektif varian aktif, sementara mapping kartu sekitar `:151` memakai varian aktif pertama. Produk multivarian bisa terlihat tidak sesuai urutan harga yang dibaca customer. Name/price sorting juga perlu tie-breaker ID untuk pagination stabil.

**Perubahan:** tetapkan aturan display, misalnya harga minimum atau label mulai dari, lalu gunakan aturan sama untuk sorting. Tambahkan tie-breaker deterministik. Ini temuan source yang perlu fixture untuk membuktikan tampilan aktual; default featured versus latest adalah keputusan bisnis, bukan otomatis bug.

**Acceptance:** dua produk dengan varian pertama bukan termurah; ascending/descending sesuai harga kartu; harga/nama identik stabil di beberapa halaman; inactive variant diabaikan; promo dipakai konsisten.

### P3. Validasi backend sudah banyak diperbaiki; UX error belum lengkap

**Induk:** bagian 8; SKU ownership/duplicate, harga per varian, error summary, fokus dan ARIA.

**Deklase yang sudah benar:** SKU produk/varian optional; unique/distinct nested SKU dan ownership ID sudah ada. Producer adalah text product-level dengan storage legacy `grind_type` nullable string|max:50; tasting_notes product-level. Rule `lte:variants.*.regular_price` bekerja untuk pasangan varian sendiri dalam Laravel yang terpasang; probe varian 100/150 gagal, varian 1000/200 lolos. Jangan melaporkan wildcard ini sebagai bug. Form sudah memiliki pesan Indonesia dan inline indexed errors.

**Perubahan tersisa:** pada `resources/js/pages/admin/products/form.tsx` dan `resources/js/pages/admin/product-variants/form.tsx`, tambahkan ringkasan error terhubung field, fokus/scroll field invalid pertama, aria-invalid dan aria-describedby; pertahankan draft/file saat gagal. Tidak perlu menambahkan dialog varian karena layout sekarang inline. Samakan aturan shipping weight backend/frontend sesuai P1.

**Acceptance:** upload terlalu besar/type invalid; SKU duplicate/null; sale melebihi regular hanya pada varian terkait; focus dapat digunakan keyboard; error screen reader terkait input; data form tidak hilang.

### Stock dan gallery: bedakan bug dari fitur tambahan

- `app/Actions/Stock/FinalizeOrderStockAction.php` terbaru sudah transactional, mengelompokkan quantity, mengunci stok berurutan, memvalidasi seluruh item, dan menggunakan movement unique per order item. Semua movement existing berarti idempotent; histori parsial gagal aman. Pertahankan mekanisme ini, bukan menyalin stock reservation/release AxeGear.
- Risiko overselling tanpa reservation harus diselesaikan dalam domain simple stock: payment dengan stok kurang masuk manual review, alasan terlihat, tindakan operator jelas. Tidak otomatis mengubah schema menjadi reservasi.
- Gallery detail sudah menyertakan seluruh gambar, deduplication, navigasi dan alt. Tidak ditemukan limit slice enam seperti induk; wrap versus disabled-edge adalah pilihan UX.
- Admin shipping estimator, reserved-stock column, shopping information dan perubahan komposisi produk induk adalah fitur opsional. Bukan syarat menyelesaikan bug integrasi. Jika diminta kemudian, gunakan tokens/layout dari `design.md`, bukan desain AxeGear.

## 6. Risiko induk yang jangan ikut disalin

- Bagian 4.2 dan 13 menyebut voucher/session dipertahankan tetapi binding voucher ke quotation hash masih berisiko. Jangan menganggap port session preservation menyelesaikan validasi voucher; uji sampai placeOrder dan hash/reprice server.
- Validator frontend dimensi induk menerima 0 atau meminta data inactive yang backend tidak wajibkan. Jangan memindahkan mismatch itu ke form Deklase.
- Build induk bisa stale. Jangan menyalin public/build atau hashed assets; regenerate Wayfinder melalui route/controller dan build source Deklase bila implementasi aplikasi dilakukan.
- Tidak ada backfill otomatis tracking link/order snapshots di induk. Jangan menulis ulang order historis dengan data produk terkini.
- Transkrip/audit awal induk bukan bukti bebas kerentanan atau keberhasilan provider production. Jangan menyalin rahasia atau payload sensitif ke dokumentasi.

## 7. Urutan implementasi yang disarankan

1. Tambahkan focused regression tests untuk M1-M4, B1-B3 dan P1. Tetapkan kontrak rounding, snapshot berat dan status final terlebih dahulu.
2. Perbaiki Midtrans creation/cancellation/status guards sebagai satu flow konsisten; logging/rejection persistence/manual review menyertainya. Gunakan field failure_reason existing.
3. Perbaiki payload/rate Biteship, kemudian atomic receipt replay dan scheduler. Pertahankan booking_uncertain yang sudah ada.
4. Lengkapi lifecycle server dan tracking-link preservation; sinkronkan tombol/status frontend dengan actions server. Jangan mengandalkan helper frontend sebagai validasi bisnis.
5. Perbaiki validasi berat produk, harga display/sort dan aksesibilitas error. Pertahankan optional SKU serta kontrak Producer/grind_type.
6. Jalankan focused suite, full CI, build dan rendered desktop/mobile QA. Uji lock/concurrency dengan engine produksi; uji sandbox provider memakai credentials lingkungan, bukan menaruh key di source.

Migration hanya jika fitur/schema yang benar-benar belum ada diperlukan. Untuk rollout stock movements, rekonsiliasi order historis terlebih dahulu; jangan menganggap movement kosong berarti pembayaran belum pernah mengurangi stok. Tidak ada `migrate:fresh`/reseed DB aktif dalam rekomendasi ini.

## 8. Verifikasi yang benar-benar dijalankan

Focused suite terbaru memakai SQLite in-memory, HTTP fake dan queue sync. `tests/Pest.php` saat audit sudah mengaktifkan RefreshDatabase secara global; catatan lama yang mengatakan sebaliknya tidak dipakai.

```powershell
php artisan test tests/Feature/Customer/CheckoutStockFinalizationTest.php tests/Feature/Customer/BiteshipShippingRateTest.php tests/Feature/Customer/CartStockAvailabilityTest.php tests/Feature/Customer/OrderDetailDataTest.php tests/Feature/Customer/MidtransFinishRedirectTest.php tests/Feature/Admin/ShipmentCreatedMailTest.php tests/Feature/Admin/ProductCreateTest.php tests/Feature/Admin/ProductEditTest.php tests/Feature/Admin/ProductVariantFormTest.php tests/Feature/Admin/ProductSkuReportTest.php tests/Feature/Customer/ProductListSearchTest.php tests/Feature/Customer/ProductDetailCartStateTest.php tests/Feature/Admin/OrderWorkflowTest.php
```

**Hasil:** 55 tes, 54 passed, 568 assertions, 1 error. Ini bukan full-suite pass.

Error existing: `tests/Feature/Customer/BiteshipShippingRateTest.php:40` memanggil `shippingRates('40123', ...)`, sedangkan `app/Services/Integrations/BiteshipService.php:45` meminta destination array. Fixture settings hanya memberikan postal code, sehingga pembaruan signature juga harus menyediakan origin/destination coordinates sesuai kontrak rates saat ini. Tes tidak diubah dalam tugas dokumentasi ini.

Probe monetary/validation yang dijalankan sebelumnya pada source dengan hash relevan tetap sama mengonfirmasi mismatch pembulatan IDR, rule nested lte per varian, penerimaan shipping weight nol, dan Producer text. Itu bukan bukti perilaku provider aktif.

Belum dijalankan: full `composer run ci:check`, frontend build/browser QA, concurrency MySQL, sandbox/live payment/shipping. Semua acceptance pada bagian temuan adalah test yang diperlukan, bukan klaim telah lulus. Hash delapan file integrasi/payment/workflow utama diperiksa terhadap baseline setelah pengguna mengizinkan kelanjutan audit.

## 9. Referensi kontrak resmi

Dokumentasi publik resmi diperiksa untuk membedakan kontrak API dari asumsi laporan induk. URL dicatat sebagai referensi; tidak ada request transaksi aktif.

- Midtrans cancel Snap session: `https://docs.midtrans.com/reference/cancel-a-snap-session.md`.
- Midtrans cancel transaction: `https://docs.midtrans.com/reference/cancel-transaction.md`; settled transaction memerlukan refund, bukan cancel.
- Midtrans item details: `https://docs.midtrans.com/reference/item-details-object.md`; IDR integer, jumlah item harus sama dengan gross.
- Midtrans status: `https://docs.midtrans.com/reference/get-transaction-status.md`.
- Biteship create order: `https://biteship.com/en/docs/api/orders/create`; coordinate object, weight gram per item dan quantity terpisah, dimensi optional.
- Biteship rates: `https://biteship.com/en/docs/api/rates/retrieve`; koordinat flat, jangan memakai mapper booking untuk rates.

Ringkasan keputusan: port prinsip verifikasi provider, idempotensi, atomic receipt, rounding dan validasi; jangan port domain fashion, reservation, dimensi wajib, atau redesign induk tanpa kebutuhan Deklase.

## 10. Implementasi 12 Oktober 2026

Keputusan pengguna: database kosong, tidak memerlukan backfill/kompatibilitas order historis; semua varian, termasuk draft/inactive, wajib memiliki berat kirim minimal 1 gram. Database aplikasi tidak dimigrasi, di-reset, atau di-seed dalam pekerjaan ini. Tidak ada dependency baru atau transaksi provider aktif.

| ID | Implementasi | Bukti regresi utama |
| --- | --- | --- |
| M1 | Satu action pembatalan customer/admin; status, referensi, amount dan cancel session diverifikasi; status lokal diperiksa ulang setelah request provider. | Session tanpa metode, not-found/lookup gagal, provider final, error admin. |
| M2 | Snap rejection dipisahkan dari uncertain; token/HTTPS wajib; cart/voucher uncertain dipertahankan, retry idempotency tidak membuat Snap baru. | Malformed success, 5xx/duplicate, rejection, respons Snap terlambat setelah refund. |
| M3 | Guard final/stale mendahului metadata; late paid order tertutup masuk review; fulfillment, timestamp dan movement tidak direset. | Refund/pending/settlement, stale fraud, late paid, stock finalization workflow. |
| M4 | Total IDR half-up disimpan sekali; item adjustment menyamai gross; checkout memakai summary server dan menampilkan rounding adjustment. | Harga pecahan, voucher/requotation, jumlah item dan malformed amount. |
| M5 | Receipt/rejection sync disimpan sebelum ValidationException dilaporkan. | Amount mismatch serta malformed metadata tetap memiliki rejection log. |
| M6 | Application log hanya acknowledgement/diagnosis aman, tanpa raw payment body. | Signed webhook, signature salah, assertion metadata log. |
| M7 | Reason/marker uncertain, filter/counter manual_review, detail/sync admin, scheduler uncertain nonexpired. | Rekonsiliasi uncertain terjadwal; error sync ditampilkan dalam summary admin. |
| B1 | Booking memakai coordinate object; rates tetap flat; berat per unit dan quantity terpisah; category `food_and_drink`. | Payload booking dan rate/checkout assertions. |
| B2 | Missing, malformed, negatif/nonfinite tidak menjadi gratis; nol eksplisit tetap valid. | Rate filtering dan checkout dengan ongkir nol. |
| B3 | Receipt pending dapat diproses ulang; lock/apply/processed_at atomic; replay setelah booking dan setiap 10 menit. | Webhook sebelum shipment, duplicate pending, rollback atomic. |
| B4 | Tracking HTTP(S) valid dipertahankan; URL tidak aman tidak dirender sebagai link; tracking bukan label. | Tracking link dan timestamp delivery dipertahankan. |
| B5 | Guard manual/provider, status hold/return/disposed, timestamp pertama; completion memerlukan kedua snapshot delivered. | OrderWorkflow, return/hold/disposed, unpaid/unbooked guard, filter index vs opsi detail. |
| P1 | Semua form mewajibkan berat >=1; quote/checkout menolak invalid; hash quote memuat berat; fallback 1g dihapus. | Inactive variant, invalid cart weight, perubahan berat membatalkan binding quote. |
| P2 | Kartu, sorting dan filter harga memakai minimum varian aktif yang sama; regular/sale satu varian, label Mulai dari. | Varian inactive diabaikan, display/sort/filter konsisten. |
| P3 | Error summary/fokus/ARIA pada kedua form; validasi file >2MB; input/file/draft dipertahankan. | Backend product/variant regression; frontend lint/type/build. Browser QA belum tersedia. |

### Batas verifikasi

- Tes memakai SQLite in-memory, HTTP fake dan queue sync; bukan bukti race/lock MySQL atau transaksi Midtrans/Biteship nyata.
- Rendered browser QA terhalang izin remote debugging. Tidak mengklaim verifikasi visual desktop/mobile.
- `composer run ci:check` berhenti di ESLint: 16 error dan 1 warning existing di luar file implementasi terfokus, termasuk `detailorderadmin.tsx` dan `tests/js/order-workflow.test.mjs`. Tidak memperbaiki debt unrelated.
- Full Pest masih memiliki empat kegagalan existing: AuthenticationTest (redirect customer), DashboardTest (akses customer), HomeBannerImagesTest (collectionBanners), CoffeeSeederTest (fixture gambar Unsplash).
- Angka hasil final dan perintah operasional dicatat pada `docs/integration-recovery.md`.
