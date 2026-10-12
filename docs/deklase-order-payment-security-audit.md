# Audit Keamanan dan Bug: Pesanan, Midtrans, Biteship, Pembayaran

Tanggal: 12 Oktober 2026. Proyek: Deklase / Declasse Coffee, `E:\laragon\www\CoffeShop\TokoKopi`.

## 1. Dasar dan batas pemeriksaan

- Audit keamanan oleh Codex terhadap HEAD `75c36e8` beserta working tree setelah implementasi audit sebelumnya. Bukan audit HEAD saja; nomor baris merupakan snapshot saat pemeriksaan.
- Konteks domain: `prd.md`, `db.md`, `design.md`. Fokus: ownership, otorisasi, webhook, nominal/status pembayaran, stok, checkout, booking dan lifecycle shipment.
- Dokumen ini mencatat **temuan yang belum diperbaiki dalam audit ulang**, bukan menyatakan seluruh perbaikan sebelumnya gagal. Dokumen sebelumnya tetap tersedia di `docs/deklase-midtrans-biteship-product-audit.md`; panduan operasional ada di `docs/integration-recovery.md`.
- Bukti dibedakan antara pemeriksaan source, probe lokal, dan tes existing. Probe memakai SQLite in-memory, HTTP fake/preventStrayRequests, serta konfigurasi key dummy; tidak mengirim transaksi provider.
- Tidak mengubah source aplikasi, menjalankan migration/reset/reseed database aplikasi, atau melakukan pentest production/Strix. Migration pada probe hanya membangun database SQLite in-memory yang terisolasi.
- P1 berarti risiko tinggi terhadap integritas pembayaran/pengiriman; P2 berarti risiko menengah terhadap data, akses, atau availability. Prioritas bukan skor CVSS dan bukan bukti semua temuan dapat dieksploitasi publik tanpa prasyarat.

## 2. Ringkasan temuan

| ID | Prioritas | Kategori | Temuan | Tingkat bukti |
| --- | --- | --- | --- | --- |
| A1 | P1 | Keamanan pembayaran | Field status tidak terikat signature, tetapi dipercaya langsung. | Probe mutasi payload bertanda tangan dummy; eksploitasi membutuhkan payload valid yang terakses. |
| A2 | P1 | Integritas pembayaran | Settlement yang masuk manual review masih dapat turun menjadi cancelled. | Probe transisi action lokal. |
| A3 | P1 | Integritas pengiriman | Cancel shipment lokal tanpa cancel provider; delivered berikutnya ditolak. | Probe service, nol request provider. |
| A4 | P2 | Kehilangan data | Item cart baru selama Snap request ikut dihapus. | Probe penyisipan item selama callback HTTP fake. |
| A5 | P2 | Kontrol akses | Customer inactive dengan autentikasi existing masih melewati guard checkout. | Source dan probe HTTP kernel dengan user inactive terautentikasi. |
| A6 | P2 | Lifecycle shipment | Return terminal langsung setelah delivered diabaikan. | Probe apply payload provider. |
| A7 | P2 | Availability | Route pemanggil provider tidak memiliki throttle aplikasi. | Source/middleware inspection; proteksi infrastruktur belum diperiksa. |

Enam perilaku direproduksi dalam probe lokal. A7 tidak diuji melalui flood/load test.

## 3. Detail temuan

### A1. Status pembayaran dapat dimodifikasi tanpa mengubah signature

**Source:** `app/Services/Integrations/MidtransService.php:143`, `app/Services/Customer/MidtransWebhookService.php:28`, `app/Actions/Payments/SyncMidtransPaymentAction.php:64`.

Signature diperiksa terhadap `order_id + status_code + gross_amount + server_key`. Ini mengikuti bentuk signature provider; masalahnya bukan algoritma hash. Field `transaction_status` dan `fraud_status` tidak termasuk bagian tersebut, tetapi jalur webhook langsung menggunakannya untuk perubahan finansial tanpa mengambil status otoritatif dari provider. Validator juga belum memastikan kombinasi status_code/status/fraud konsisten sebelum settlement diterapkan.

**Probe:** buat signature dummy untuk payload pending dengan status_code `201`, nominal `3.00`, lalu ubah hanya transaction_status menjadi settlement. Handler menerima payload; order menjadi paid, tanpa request status provider.

**Prasyarat keamanan:** pihak penyerang harus memperoleh payload tertandatangani valid untuk referensi/nominal terkait. Audit tidak membuktikan kebocoran payload tersebut, akses customer ke signature, atau kemampuan membuat signature baru tanpa server key. Payload probe ditandatangani dengan key dummy yang diketahui penguji.

**Dampak:** jika prasyarat terpenuhi, mutasi field yang tidak terikat signature dapat menghasilkan paid palsu, perubahan fraud, atau status finansial tidak benar.

**Rekomendasi:** setelah autentikasi notifikasi, ambil status melalui Get Status API server-side; terapkan payload otoritatif dengan pemeriksaan referensi, nominal dan konsistensi status/fraud. Jangan mengganti formula signature provider dengan hash custom yang tidak didukung. Jika verifikasi upstream gagal, jangan menyatakan paid; simpan receipt/retry yang aman.

**Acceptance:** mutasi status/fraud dengan signature yang masih valid tidak menghasilkan paid; provider pending tetap pending; mismatch amount/reference ditolak; settlement valid memotong stok sekali; timeout verifikasi tidak mengubah status finansial menjadi sukses.

### A2. Settlement dalam manual review masih dapat diturunkan menjadi cancelled

**Source:** `app/Actions/Payments/ApplyMidtransPaymentStatusAction.php:34`, `app/Actions/Payments/ApplyMidtransPaymentStatusAction.php:89`, `app/Actions/Payments/ApplyMidtransPaymentStatusAction.php:122`.

Saat settlement diterima tetapi stok tidak cukup, order/payment menjadi manual_review dan raw response masih berisi settlement. Guard manual review hanya memblokir sebagian event pending/authorize; cancel/expire/failure masih dapat memperbarui metadata dan menjalankan markFailed. Guard markFailed hanya mengenali order dengan payment_status paid, bukan bukti bahwa dana sudah diterima tetapi finalisasi operasional tertahan.

**Probe:** settlement dengan stock quantity nol menghasilkan manual_review. Pemanggilan cancel berikutnya menghasilkan cancelled dan raw response berubah menjadi cancel.

**Dampak:** bukti status finansial terakhir tertimpa, pesanan berpotensi ditutup meskipun dana sudah diterima. Jalur markFailed juga memanggil pelepasan voucher; efek voucher ini terlihat dari source, bukan diukur dalam probe tersebut. Probe membuktikan kelemahan state machine, bukan terjadinya rangkaian event tersebut pada transaksi provider nyata.

**Rekomendasi:** bedakan status finansial terkonfirmasi dari review stok/fraud/late payment. Pertahankan bukti settlement/capture yang diterima; blokir regresi finansial sebelum metadata maupun voucher berubah. Refund terkonfirmasi tetap harus dapat diproses. Review fraud yang belum menerima dana tidak boleh disamakan dengan konflik stok setelah settlement.

**Acceptance:** settlement dalam stock review lalu stale cancel/expire/pending mempertahankan bukti pembayaran; late paid order tertutup tetap review; refund valid tetap diterapkan; voucher tidak dilepas hanya karena event stale; retry finalisasi tidak menduplikasi stock movement.

### A3. Shipment dapat cancelled lokal tanpa pembatalan Biteship

**Source:** `app/Services/Admin/ShipmentManagementService.php:235`, `app/Services/Admin/ShipmentManagementService.php:556`, `app/Services/Admin/ShipmentManagementService.php:575`.

Opsi manual dari confirmed/allocated mencakup cancelled. updateStatus hanya mengubah database dan tracking lokal; tidak ada request pembatalan booking Biteship. Status lokal cancelled kemudian dianggap terminal, sehingga webhook delivered ditolak oleh guard.

**Probe:** shipment paid dan confirmed dengan booking ID diberi cancelled melalui service admin. Payload delivered berikutnya diabaikan: shipment tetap cancelled, order shipment_failed, nol request provider.

**Dampak:** admin melihat pengiriman batal sementara booking provider mungkin masih aktif; status kedatangan nyata tidak dapat merekonsiliasi snapshot lokal. Ini risiko workflow oleh pengguna admin yang sah, bukan bypass otorisasi admin.

**Rekomendasi:** jangan menawarkan cancellation provider sebagai terminal override lokal biasa. Untuk pembatalan booking, gunakan operasi provider dengan konfirmasi hasil sebelum menetapkan cancelled. Timeout/malformed response tetap unresolved. Jika override manual memang diperlukan bisnis, pisahkan dari status provider dan wajibkan rekonsiliasi/audit trail.

**Acceptance:** request cancellation provider gagal/timeout tidak menutup shipment lokal; cancellation terkonfirmasi baru menjadi cancelled; respons/webhook yang berlomba diperiksa ulang; tidak ada booking ulang otomatis hanya karena cancellation belum pasti.

### A4. Item cart baru selama request Snap ikut terhapus

**Source:** `app/Services/Customer/CheckoutService.php:380`.

Setelah order snapshot disimpan dan request Snap selesai, seluruh item cart user dihapus. Penghapusan tidak dibatasi ke snapshot yang dibeli. Request dari tab lain masih dapat menambah/mengubah cart saat request provider berlangsung.

**Probe:** order membeli variant ID 1. Callback fake Snap menambahkan variant ID 2 ke cart sebelum mengembalikan response sukses. Setelah checkout, remaining_cart_items menjadi nol, meskipun variant ID 2 tidak ada di order.

**Dampak:** item atau perubahan cart yang tidak dibeli hilang; customer harus memasukkannya ulang. Probe mensimulasikan interleaving pada batas HTTP, bukan pengujian lock multi-koneksi MySQL.

**Rekomendasi:** finalisasi cart berdasarkan ID dan quantity snapshot, dalam transaksi dengan locking/cek perubahan yang tepat. Pertahankan item baru serta quantity tambahan; jangan sekadar menghapus seluruh cart atau semua row yang memiliki variant ID sama.

**Acceptance:** item baru tetap ada; penambahan quantity pada item yang dibeli menyisakan quantity tambahan; row yang dihapus lalu ditambahkan ulang tidak terhapus sebagai snapshot lama; retry idempotency tidak mengonsumsi cart dua kali.

### A5. Penonaktifan customer tidak efektif untuk autentikasi existing

**Source:** `app/Services/Admin/CustomerManagementService.php:106`, `app/Providers/FortifyServiceProvider.php:48`, `routes/web.php:68`, `app/Http/Requests/Customer/PlaceOrderRequest.php:9`.

Toggle inactive hanya mengubah flag database. Login baru memeriksa is_active, tetapi route customer menggunakan auth/verified saja; controller/request checkout tidak memeriksa akun aktif. Tidak ditemukan pencabutan sesi di toggle tersebut.

**Probe:** HTTP kernel menerima user inactive yang dipasang sebagai user terautentikasi. POST shipping-rates mencapai validasi cart dan mendapat `422 Keranjang kosong`, bukan penolakan akses. Probe service checkout juga membuat order untuk user inactive. Tidak dilakukan login browser atau pengujian cookie sesi lama nyata.

**Dampak:** akun yang diblokir tetapi masih memiliki sesi dapat mengakses jalur customer dan pemanggilan provider; flag admin tidak berlaku sebagai kontrol akses setiap request.

**Rekomendasi:** periksa status aktif melalui middleware pada seluruh route customer terlindungi; cabut sesi ketika akun dinonaktifkan, sesuai session driver. Middleware tetap diperlukan agar keamanan tidak bergantung hanya pada penghapusan record session.

**Acceptance:** setelah deactivation, sesi lama tidak dapat checkout, meminta rate, atau mengubah order; login baru tetap ditolak; akses admin inactive tetap ditolak; webhook provider tidak bergantung pada status customer sehingga rekonsiliasi dana tetap berjalan.

### A6. Return terminal langsung setelah delivered ditolak

**Source:** `app/Services/Admin/ShipmentManagementService.php:578`.

Guard dari delivered hanya menerima delivered/return_in_transit. Jika returned diterima tanpa event intermediate return_in_transit, event diabaikan meskipun status tersebut dikenali oleh mapper. Delivery webhook tidak boleh diasumsikan selalu lengkap dan berurutan.

**Probe:** shipment delivered menerima payload provider returned; state lokal tetap delivered.

**Dampak:** snapshot pengiriman tidak mencerminkan return dan pemeriksaan penyelesaian order dapat memakai status delivered yang tidak lagi aktual. Probe tidak membuktikan provider tertentu pasti mengirim rangkaian tersebut.

**Rekomendasi:** dukung transisi return terminal yang sah tanpa mewajibkan seluruh event intermediate, menggunakan status/timestamp otoritatif. Jangan membuka semua regresi atau melakukan refund otomatis berdasarkan return.

**Acceptance:** delivered langsung returned diproses ketika valid; stale returned ditolak bila bukti waktunya lebih lama; event return duplicate idempotent; returned/lost/disposed tidak otomatis mengembalikan dana atau menyelesaikan order.

### A7. Endpoint provider tidak memiliki throttle aplikasi

**Source:** `routes/web.php:87`, `routes/web.php:88`, `routes/web.php:92`; registrasi limiter di providers dan konfigurasi middleware bootstrap.

Route area Biteship, shipping-rates, dan place-order tidak mempunyai limiter aplikasi. Pemeriksaan middleware place-order menghasilkan web/auth/verified tanpa throttle. Limiter login yang ditemukan tidak membatasi endpoint tersebut.

**Dampak:** akun terverifikasi dapat membuat banyak panggilan upstream dan menahan worker/connection selama timeout integrasi. Potensi pemakaian kuota atau biaya bergantung kontrak provider; audit tidak mengukur biaya atau melakukan flood test. Proteksi WAF/reverse proxy belum diperiksa.

**Rekomendasi:** limiter per akun/IP yang sesuai perilaku checkout, pembatasan concurrency, serta deduplikasi request identik. Nilai batas perlu ditetapkan saat implementasi berdasarkan trafik dan kuota; jangan menghalangi retry webhook sah atau rekonsiliasi operator.

**Acceptance:** excess request mendapat 429 sebelum memanggil provider; akun berbeda tidak saling memblokir tanpa alasan; duplicate checkout tidak membuat sesi baru; retry normal checkout/webhook tetap dapat pulih.

## 4. Verifikasi dan kontrol yang sudah ditemukan

Focused existing suite dijalankan ulang:

```powershell
php artisan test --compact tests/Feature/Customer/IntegrationRecoveryTest.php tests/Feature/Admin/OrderWorkflowTest.php
```

**Hasil: 63 passed, 362 assertions.** Enam probe audit bersifat sementara dan belum menjadi regression tests permanen. Kelulusan suite existing tidak membuktikan temuan baru sudah tertutup. Full suite/build tidak dijalankan ulang khusus untuk audit ini; hasil fase implementasi sebelumnya bukan hasil audit ulang.

Ringkasan hasil probe:

```text
unsigned_status_mutation: payment_status=paid, provider_http_requests=0
stock_review_then_cancel: before=manual_review, after=cancelled, raw.transaction_status=cancel
shipment_local_cancel: shipment_status=cancelled, order_status=shipment_failed, provider_http_requests=0
concurrent_cart_add: purchased_variant_ids=[1], added_variant_id=2, remaining_cart_items=0
inactive_account_authenticated_checkout: http_status=422, errors.cart=Keranjang kosong.
direct_return_webhook: provider_status=returned, local_status=delivered
```

Kontrol yang ditemukan pada jalur yang diperiksa:

- Ownership detail/cancel order serta alamat customer diperiksa; tidak ditemukan bypass ownership pada jalur tersebut. Ini bukan jaminan semua endpoint aplikasi bebas IDOR.
- Middleware admin memeriksa role dan is_active. Signature Midtrans dan secret Biteship diperiksa; signature bukan bukti integritas seluruh field payload, sebagaimana A1.
- Validasi amount, receipt hashing/deduplication, transaksi/locking, unique checkout idempotency dan stock movement tersedia. Efektivitas concurrency engine produksi belum diuji.
- Biteship bypass secret dibatasi local/testing dan flag eksplisit. Guard status, validasi berat serta tracking URL sudah ada, tetapi masih memiliki batas lifecycle yang dijelaskan di atas.

## 5. Tindak lanjut dan batas klaim

Prioritas perbaikan: A1-A3 terlebih dahulu, kemudian A4-A7. Tambahkan regression tests untuk setiap temuan sebelum menyatakan tertutup. Pertahankan model stok sederhana, SKU opsional, kontrak Producer/grind_type, serta perubahan working tree unrelated.

Belum diverifikasi: concurrency MySQL multi-koneksi, browser desktop/mobile, cookie sesi persisten nyata, transaksi sandbox/live, delivery webhook jaringan nyata, WAF/rate limit production dan seluruh permukaan aplikasi di luar scope. Audit ini tidak menyimpulkan codebase aman secara menyeluruh, tidak membuktikan kebocoran server key/signature, dan tidak menyatakan semua hipotesis telah dieksploitasi di production.
