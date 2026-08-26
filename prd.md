# PRD Website E-Commerce Declasse Coffee

**Nama Produk:** Declasse Coffee E-Commerce Website  
**Tipe Dokumen:** Product Requirements Document (PRD)  
**Versi:** 2.0  
**Tanggal:** 26 Agustus 2026  
**Stack:** Laravel, Inertia.js, React, TypeScript, MySQL, Midtrans, Biteship  
**Target Platform:** Web desktop dan mobile responsive

---

## 1. Ringkasan Produk

Declasse Coffee adalah website e-commerce resmi untuk menjual produk kopi dan produk terkait kopi secara langsung melalui website.

Katalog produk dirancang fleksibel agar dapat menangani beberapa bentuk produk, antara lain:

- kopi biji,
- kopi bubuk,
- kopi cair / concentrate,
- produk satuan / pcs,
- drip bag atau ready-to-brew,
- produk kopi lain dengan variasi isi yang berbeda.

Website berfungsi sebagai kanal penjualan langsung milik brand Declasse Coffee dengan pengalaman visual yang premium, editorial, modern, dan product-focused.

Sistem dibangun menggunakan Laravel sebagai backend utama, Inertia.js sebagai penghubung backend dan frontend, React TypeScript sebagai frontend, MySQL sebagai database, Midtrans sebagai payment gateway, serta Biteship untuk perhitungan ongkir, pembuatan pengiriman, dan tracking.

Pengelolaan stok dibuat sederhana dan dilakukan langsung melalui database website menggunakan tabel `stocks`.

Tidak digunakan:

- Desty Omni,
- inventory reservation,
- reserved stock,
- stock logs kompleks,
- marketplace product mapping,
- collection,
- product collection,
- product review.

---

## 2. Tujuan Produk

Tujuan utama website Declasse Coffee adalah:

1. Menyediakan storefront resmi Declasse Coffee.
2. Menampilkan katalog kopi dengan visual premium dan editorial.
3. Memungkinkan customer membeli produk langsung melalui website.
4. Menangani berbagai jenis produk seperti bubuk, biji, cair, dan pcs.
5. Menyediakan product variant yang fleksibel.
6. Mengintegrasikan pembayaran online melalui Midtrans.
7. Mengintegrasikan pengiriman melalui Biteship.
8. Mengelola stok langsung dari website secara sederhana.
9. Menyediakan admin dashboard untuk produk, kategori, variant, stok, order, voucher, banner, dan CMS.
10. Memberikan struktur database sederhana dan mudah dipelihara.
11. Mendukung pertumbuhan katalog tanpa perlu membuat schema khusus untuk setiap jenis produk.
12. Menjadi fondasi storefront yang SEO-friendly dan responsive.

---

## 3. Latar Belakang

Declasse Coffee membutuhkan kanal penjualan langsung yang tidak hanya berfungsi sebagai katalog, tetapi juga memperkuat identitas brand.

Website dirancang dengan karakter:

- premium,
- modern,
- editorial,
- specialty coffee,
- product-first,
- visual,
- minimal,
- warm,
- sophisticated.

Produk kopi memiliki karakter variasi yang berbeda dari fashion atau apparel.

Contohnya:

```text
Coffee Beans
- 100gram Whole Bean
- 250gram Whole Bean
- 1kg Whole Bean

Ground Coffee
- 100gram Fine
- 250gram Medium
- 500gram Coarse

Coffee Liquid
- 250ml
- 500ml
- 1L

Drip Bag
- 5pcs
- 10pcs
```

Karena itu database tidak menggunakan struktur variant berbasis warna dan ukuran.

Sebaliknya, product variant menggunakan field fleksibel:

- `net_weight`
- `grind_type`
- `regular_price`
- `sale_price`
- `shipping_weight_gram`

`net_weight` menggunakan tipe string agar dapat menyimpan nilai seperti:

- `100gram`
- `250gram`
- `1kg`
- `100ml`
- `500ml`
- `2pcs`
- `10pcs`

Dengan pendekatan ini, satu schema dapat menangani produk biji, bubuk, cair, dan pcs.

---

## 4. Ruang Lingkup Produk

### 4.1 Dalam Scope

Website mencakup:

1. Public storefront.
2. Customer authentication.
3. Product catalog.
4. Category browsing.
5. Product listing.
6. Product detail.
7. Search.
8. Cart.
9. Checkout.
10. Customer address management.
11. Shipping rate calculation melalui Biteship.
12. Payment melalui Midtrans Snap.
13. Order history.
14. Order detail.
15. Shipment tracking.
16. Wishlist.
17. Voucher.
18. Notification.
19. Admin dashboard.
20. Product management.
21. Product image management.
22. Product variant management.
23. Category management.
24. Product-category many-to-many management.
25. Stock management sederhana.
26. Order management.
27. Payment monitoring.
28. Shipment management.
29. Banner management.
30. CMS static pages.
31. Site settings.
32. Admin activity logs.
33. Midtrans webhook.
34. Biteship webhook.
35. Responsive storefront.

### 4.2 Di Luar Scope MVP

Fitur berikut tidak wajib pada MVP:

1. Product reviews.
2. Collection / campaign collection.
3. Product collection.
4. Marketplace product links.
5. Marketplace synchronization.
6. Desty Omni.
7. Inventory reservation.
8. Multi warehouse.
9. Stock history / stock ledger kompleks.
10. Loyalty point.
11. Affiliate/referral.
12. Multi-vendor marketplace.
13. Subscription recurring billing.
14. Product comparison.
15. Advanced AI recommendation.
16. Native mobile app.
17. Full accounting system.
18. ERP.
19. Complex return/refund automation.
20. Advanced warehouse management.

---

## 5. User Role

### 5.1 Guest

Guest adalah user yang belum login.

Kemampuan:

- melihat homepage,
- melihat product listing,
- melihat category,
- melihat product detail,
- mencari produk,
- melihat harga,
- melihat variant yang tersedia,
- melihat status ketersediaan stok.

Jika cart hanya disimpan di database, guest harus login sebelum menyimpan item ke cart.

### 5.2 Customer

Customer adalah user yang sudah login.

Kemampuan:

- mengelola profile,
- mengelola alamat,
- menambahkan produk ke cart,
- memilih variant,
- mengubah quantity,
- menggunakan voucher,
- checkout,
- memilih kurir,
- membayar melalui Midtrans,
- melihat order history,
- melihat order detail,
- melihat status pembayaran,
- melihat status pengiriman,
- melihat tracking,
- menambahkan produk ke wishlist,
- menerima notification.

### 5.3 Admin

Admin digunakan untuk operasional toko.

Kemampuan:

- mengelola produk,
- mengelola kategori,
- menghubungkan produk dengan banyak kategori,
- upload gambar produk,
- menentukan primary image,
- mengelola product variant,
- mengelola stok,
- mengelola voucher,
- mengelola order,
- melihat payment,
- membuat shipment,
- melihat tracking,
- mengelola banner,
- mengelola CMS page,
- mengelola customer,
- melihat notification terkait operasional,
- melihat admin activity log.

### 5.4 Super Admin

Super Admin memiliki seluruh kemampuan Admin, ditambah:

- mengelola admin,
- mengatur Midtrans,
- mengatur Biteship,
- mengatur site settings,
- mengelola konfigurasi sistem,
- melihat seluruh audit log.

---

## 6. Target User

Target customer Declasse Coffee:

1. Coffee enthusiast.
2. Home brewer.
3. Espresso enthusiast.
4. Customer yang membeli whole bean.
5. Customer yang membeli ground coffee.
6. Customer yang membutuhkan kopi praktis.
7. Customer coffee concentrate / liquid coffee.
8. Customer dari Instagram, TikTok, Google, ads, dan komunitas kopi.
9. Customer yang mencari specialty coffee Indonesia.
10. Customer yang membutuhkan produk kopi untuk konsumsi pribadi maupun hadiah.

---

## 7. Value Proposition

Website Declasse Coffee harus menonjolkan:

1. Specialty coffee dengan presentasi premium.
2. Informasi produk yang jelas.
3. Pilihan variant yang mudah dipahami.
4. Fleksibilitas pilihan isi seperti gram, ml, pcs, dan kg.
5. Pilihan grind untuk produk yang membutuhkan.
6. Product photography yang kuat.
7. Checkout langsung tanpa marketplace.
8. Pembayaran aman melalui Midtrans.
9. Pilihan pengiriman melalui Biteship.
10. Stock availability yang dikelola langsung oleh website.
11. Brand experience yang lebih kuat dibandingkan marketplace.

---

## 8. Teknologi

### 8.1 Backend

- Laravel 12 atau versi stabil terbaru.
- PHP 8.3+.
- Laravel Starter Kit React + Inertia.
- Laravel Queue.
- Laravel Scheduler jika diperlukan.
- Laravel Notifications.
- Laravel Policies.
- Laravel Form Request.
- Laravel Eloquent ORM.

### 8.2 Frontend

- React.
- TypeScript.
- Inertia.js.
- Vite.
- Tailwind CSS.
- Tiptap.js.
- Shadcn/ui atau custom component.
- React Hook Form atau Inertia Form.
- Zod opsional.

### 8.3 Database

- MySQL 8.x.

### 8.4 Payment

- Midtrans Snap.
- Midtrans webhook / notification.

### 8.5 Shipping

- Biteship Rates API.
- Biteship Orders API.
- Biteship Tracking API.
- Biteship webhook.

### 8.6 Stock

Stock menggunakan tabel lokal sederhana:

```text
product_variants
        |
        v
      stocks
```

Tabel `stocks` menyimpan:

- `product_variant_id`
- `quantity`
- `low_stock_threshold`

Tidak menggunakan:

- `reserved_stock`
- inventory reservation
- stock synchronization
- Desty
- warehouse stock

### 8.7 Storage

- local storage untuk development,
- public storage / S3-compatible untuk production,
- URL gambar disimpan di database.

---

## 9. Prinsip Arsitektur

1. Laravel menjadi backend utama.
2. Inertia digunakan untuk menghubungkan Laravel dan React.
3. React TypeScript digunakan untuk frontend.
4. MySQL menjadi relational database.
5. Product dibuat sederhana.
6. Product tidak menyimpan harga utama.
7. Harga berada di `product_variants`.
8. Setiap product minimal memiliki satu variant.
9. Product dan category menggunakan many-to-many.
10. Product dapat memiliki banyak category.
11. Category dapat memiliki banyak product.
12. Tidak ada nested category melalui `parent_id`.
13. Detail panjang produk disimpan di `products.description`.
14. Stock berada di tabel `stocks`, satu stock per product variant.
15. Tidak ada stock reservation.
16. Tidak ada collection.
17. Tidak ada product review.
18. Tidak ada product marketplace mapping.
19. Midtrans webhook harus idempotent.
20. Biteship webhook harus idempotent.
21. Semua kalkulasi harga dan total harus dilakukan ulang di backend.
22. Frontend tidak boleh menjadi sumber kebenaran untuk harga atau stok.

---

## 10. Modul Utama

## 10.1 Public Storefront

### Halaman

1. Homepage.
2. Shop All / Product Listing.
3. Category Page.
4. Product Detail.
5. Search Result.
6. Cart.
7. Checkout.
8. Static Page.
9. Wishlist.
10. Account.
11. Order History.
12. Order Detail.

### Requirement

Homepage dapat menampilkan:

- hero campaign,
- featured products,
- best seller,
- new arrival,
- category shortcut,
- brand story,
- editorial coffee section,
- subscription marketing section jika hanya berupa promosi,
- newsletter,
- footer.

Product card menampilkan:

- full-bleed product image atau lifestyle image,
- dark overlay,
- product name,
- harga mulai dari variant,
- informasi singkat yang relevan.

Product listing mendukung:

- category,
- keyword,
- price,
- newest,
- best seller,
- featured.

---

## 10.2 Product Catalog

### Struktur Database

Tabel utama:

1. `categories`
2. `products`
3. `product_categories`
4. `product_images`
5. `product_variants`
6. `stocks`

### Product

Field utama:

```text
id
name
slug
sku
origin
process
description
status
is_featured
is_new_arrival
is_best_seller
created_at
updated_at
deleted_at
```

### Requirement

Admin dapat:

- membuat produk,
- mengubah produk,
- menghapus / soft-delete produk,
- menentukan status,
- mengisi nama,
- mengisi slug,
- mengisi SKU induk,
- mengisi origin,
- mengisi process,
- mengisi description menggunakan Tiptap.js,
- menentukan featured,
- menentukan new arrival,
- menentukan best seller,
- menambahkan banyak gambar,
- menentukan primary image,
- menghubungkan produk ke banyak kategori,
- menambahkan minimal satu variant.

### Contoh Produk

#### Produk Biji

```text
Product:
Declasse Flores Bajawa

Origin:
Flores

Process:
Natural

Category:
Coffee Beans
Single Origin
```

Variant:

```text
100gram / whole_bean
250gram / whole_bean
1kg / whole_bean
```

#### Produk Bubuk

```text
Product:
Declasse House Blend Ground Coffee
```

Variant:

```text
100gram / fine
250gram / medium
500gram / coarse
```

#### Produk Cair

```text
Product:
Declasse Espresso Concentrate
```

Variant:

```text
250ml / grind_type null
500ml / grind_type null
1L / grind_type null
```

#### Produk Pcs

```text
Product:
Declasse Drip Bag
```

Variant:

```text
5pcs / grind_type null
10pcs / grind_type null
```

---

## 10.3 Category

### Deskripsi

Category digunakan sebagai klasifikasi produk.

Category tidak memiliki parent-child relationship.

### Struktur

```text
categories

id
name
slug
description
image_url
sort_order
is_active
created_at
updated_at
deleted_at
```

### Relasi

```text
products
   |
   | many-to-many
   |
product_categories
   |
categories
```

Satu produk dapat mempunyai banyak kategori.

Contoh:

```text
Declasse Flores Bajawa
- Coffee Beans
- Single Origin
- Filter Coffee
```

Satu kategori juga dapat mempunyai banyak produk.

### Contoh Category

- Coffee Beans
- Ground Coffee
- Single Origin
- Blend
- Espresso
- Filter Coffee
- Ready to Drink
- Drip Bag
- Best Seller
- New Arrival

### Requirement

Admin dapat:

- membuat category,
- edit category,
- mengatur slug,
- upload image,
- mengatur sort order,
- mengaktifkan / menonaktifkan category.

---

## 10.4 Product Images

### Deskripsi

Satu product dapat mempunyai banyak gambar.

### Requirement

- minimal satu gambar sangat direkomendasikan,
- satu gambar dapat ditandai sebagai primary,
- gambar dapat diurutkan,
- alt text dapat diisi,
- image gallery digunakan pada product detail.

Product card menggunakan primary image jika tersedia.

---

## 10.5 Product Variant

### Deskripsi

Variant adalah unit produk yang benar-benar dibeli oleh customer.

Harga tidak berada di product utama.

Harga berada pada setiap variant.

### Struktur

```text
product_variants

id
product_id
sku
net_weight
grind_type
regular_price
sale_price
shipping_weight_gram
image_url
is_active
created_at
updated_at
deleted_at
```

### `net_weight`

`net_weight` menggunakan string agar fleksibel.

Contoh:

```text
100gram
250gram
500gram
1kg
100ml
250ml
500ml
1L
2pcs
5pcs
10pcs
```

Nama field tetap `net_weight` sesuai rancangan database, meskipun penggunaannya berfungsi sebagai label isi/ukuran produk yang fleksibel.

### `grind_type`

Nullable.

Contoh:

```text
whole_bean
fine
medium_fine
medium
medium_coarse
coarse
tubruk
```

Untuk cair atau pcs:

```text
grind_type = null
```

### Requirement

- Setiap product minimal satu variant.
- SKU variant wajib unik.
- `regular_price` wajib.
- `sale_price` opsional.
- `sale_price <= regular_price`.
- `net_weight` dapat berupa gram, ml, pcs, kg, atau label custom lain.
- `grind_type` hanya diisi jika relevan.
- `shipping_weight_gram` tetap numeric untuk Biteship.
- Variant inactive tidak dapat dibeli.

---

## 10.6 Stock

### Deskripsi

Stock dibuat sederhana.

Satu variant mempunyai satu data stock.

### Struktur

```text
stocks

id
product_variant_id
quantity
low_stock_threshold
created_at
updated_at
```

### Relasi

```text
product_variant
     |
     | 1 : 1
     |
   stock
```

### Prinsip

- `quantity` adalah stok tersedia.
- Tidak ada `reserved_stock`.
- Tidak ada `available_stock = stock - reserved_stock`.
- Tidak ada stock log.
- Tidak ada stock reservation table.
- Tidak ada warehouse.
- Tidak ada Desty.
- Tidak ada synchronization pihak ketiga.

### Requirement

- Admin dapat melihat stock semua variant.
- Admin dapat mengubah quantity.
- Quantity tidak boleh negatif.
- Low stock ditentukan menggunakan `low_stock_threshold`.
- Add to cart wajib memeriksa stock.
- Checkout wajib memvalidasi stock kembali.
- Backend wajib menangani concurrency menggunakan database transaction dan row lock pada proses final order/payment yang memengaruhi stok.
- Stok tidak boleh berkurang lebih dari sekali untuk order yang sama.

### Stock Display

```text
quantity > low_stock_threshold
→ In Stock

quantity > 0 dan quantity <= low_stock_threshold
→ Low Stock

quantity = 0
→ Out of Stock
```

---

## 10.7 Cart

### Struktur

```text
carts
cart_items
```

### Requirement

- Cart terkait user.
- Customer dapat add product variant.
- Customer dapat update quantity.
- Customer dapat remove item.
- `cart_items` menyimpan:
  - product,
  - product_variant,
  - quantity,
  - price_snapshot,
  - variant snapshot.
- Quantity minimal 1.
- Add to cart ditolak jika variant inactive.
- Add to cart ditolak jika stok tidak cukup.
- Checkout harus menggunakan harga terbaru dari backend, bukan hanya `price_snapshot`.

### Product Detail Behavior

Product Detail hanya mempunyai fungsi commerce utama:

```text
Select Variant
→ Select Quantity
→ Add to Bag
```

Product Detail tidak memuat:

- input alamat,
- shipping method,
- payment method,
- checkout form.

Semua itu dilakukan pada halaman checkout.

---

## 10.8 Checkout

### Flow

```text
Cart
→ Validate cart
→ Select address
→ Get Biteship rates
→ Select courier
→ Apply voucher (optional)
→ Calculate total
→ Create order
→ Generate Midtrans Snap token
→ Customer payment
→ Midtrans webhook
→ Update payment/order
→ Reduce stock exactly once
→ Create shipment
```

### Requirement

- User wajib login.
- Cart tidak boleh kosong.
- Semua variant harus aktif.
- Semua stok harus cukup.
- Customer harus memiliki alamat.
- Customer memilih shipping option.
- Backend menghitung ulang harga.
- Backend menghitung voucher.
- Backend menghitung shipping.
- Backend menghasilkan grand total.
- Order number unik.
- Checkout menggunakan idempotency key.
- Cart dibersihkan setelah order berhasil dibuat sesuai implementasi yang dipilih.
- Tidak menggunakan stock reservation.

### Strategi Stok Tanpa Reservation

Karena database tidak memiliki reservation stock:

1. Cart tidak mengunci stok.
2. Stock selalu divalidasi ulang saat checkout.
3. Stock wajib divalidasi ulang sebelum finalisasi payment/order.
4. Pengurangan stok harus terjadi tepat satu kali.
5. Gunakan transaction + row locking saat melakukan pengurangan stok.
6. Jika stok tidak lagi tersedia sebelum payment flow dapat dilanjutkan, sistem harus menampilkan error yang jelas dan mencegah overselling.

Implementasi detail timing pengurangan stok harus konsisten di backend dan diuji terhadap race condition.

---

## 10.9 Payment Midtrans

### Requirement

- Menggunakan Midtrans Snap.
- Snap token dibuat dari backend.
- Sistem menyimpan:
  - `midtrans_order_id`,
  - `midtrans_transaction_id`,
  - `midtrans_snap_token`,
  - `midtrans_redirect_url`,
  - transaction status,
  - fraud status,
  - gross amount,
  - raw response.
- Webhook wajib memverifikasi signature.
- Webhook wajib idempotent.
- Payment tidak boleh diproses dua kali.

### Status Payment

```text
pending
paid
failed
expired
refunded
```

### Status Mapping

Settlement / capture sukses:

```text
payment_status = paid
order_status = paid
```

Expired:

```text
payment_status = expired
```

Failed / deny:

```text
payment_status = failed
```

---

## 10.10 Shipping Biteship

### Requirement

- Search area.
- Rate checking.
- Customer memilih courier.
- Shipment dapat dibuat setelah order paid.
- Shipment dapat dibuat admin atau otomatis.
- Tracking disimpan.
- Webhook Biteship diproses idempotent.

### Data Shipment

- courier company,
- courier type,
- courier service,
- shipping cost,
- insurance,
- estimated delivery,
- Biteship order ID,
- tracking ID,
- waybill,
- label,
- shipping status.

### Shipping Weight

Biteship menggunakan:

```text
product_variants.shipping_weight_gram
```

Bukan `net_weight`.

Contoh:

```text
net_weight = "500ml"
shipping_weight_gram = 650
```

Ini karena kemasan ikut memengaruhi berat kirim.

---

## 10.11 Voucher

### Requirement

Voucher dapat:

- percentage,
- fixed amount,
- memiliki minimum order,
- memiliki maximum discount,
- memiliki usage limit,
- memiliki periode aktif,
- berlaku untuk seluruh produk,
- berlaku untuk produk tertentu,
- berlaku untuk kategori tertentu.

Tabel:

```text
vouchers
voucher_products
voucher_categories
```

---

## 10.12 Wishlist

### Requirement

- Wishlist hanya untuk user login.
- User dapat add/remove product.
- Wishlist menyimpan product, bukan variant.
- Product inactive dapat disembunyikan atau ditampilkan sebagai unavailable.

---

## 10.13 Notification

Notification digunakan untuk informasi customer atau operasional.

Contoh:

- order berhasil dibuat,
- payment berhasil,
- order dikirim,
- order selesai.

---

## 10.14 Admin Dashboard

### Halaman

1. Dashboard Overview.
2. Products.
3. Create Product.
4. Edit Product.
5. Categories.
6. Product Variants.
7. Stocks.
8. Orders.
9. Order Detail.
10. Payments.
11. Shipments.
12. Vouchers.
13. Banners.
14. CMS Pages.
15. Customers.
16. Site Settings.
17. Admin Activity Logs.

Tidak ada:

- Collection Management.
- Review Moderation.
- Marketplace Mapping.
- Desty Integration.
- Inventory Reservation.
- Stock Log page.

### Metrics

Dashboard dapat menampilkan:

- total sales,
- total orders,
- pending payment,
- paid orders,
- orders pending shipment,
- low stock variants,
- out of stock variants,
- best selling products,
- recent orders.

---

## 10.15 CMS

### Tabel

```text
banners
pages
site_settings
```

### Requirement

Admin dapat mengelola:

- homepage banner,
- About,
- Terms,
- Privacy,
- Shipping Policy,
- Return Policy,
- general settings.

Konten `pages.content` menggunakan rich text.

---

## 11. User Flow

### 11.1 Guest Browse

```text
Homepage
→ Shop All / Category
→ Product Detail
→ Select Variant
→ Login jika dibutuhkan
```

### 11.2 Customer Add to Cart

```text
Product Detail
→ Select Variant
→ Select Quantity
→ Add to Bag
→ Cart
```

### 11.3 Customer Checkout

```text
Cart
→ Checkout
→ Select Address
→ Select Biteship Rate
→ Apply Voucher (optional)
→ Create Order
→ Midtrans Payment
→ Payment Success
→ Order Detail
```

### 11.4 Admin Create Product

```text
Admin Login
→ Products
→ Create Product
→ Name / Slug / SKU
→ Origin / Process
→ Description
→ Select Multiple Categories
→ Upload Images
→ Add Variant
→ Set Stock
→ Publish
```

### 11.5 Admin Create Product Variant

Contoh biji:

```text
SKU: FLORES-250-WB
net_weight: 250gram
grind_type: whole_bean
regular_price: 95000
shipping_weight_gram: 300
stock: 20
```

Contoh cair:

```text
SKU: ESP-LIQ-500
net_weight: 500ml
grind_type: null
regular_price: 85000
shipping_weight_gram: 650
stock: 12
```

### 11.6 Admin Process Order

```text
Payment Paid
→ Order Paid
→ Processing
→ Create Shipment
→ Print Label
→ Shipped
→ Tracking Updates
→ Delivered
→ Completed
```

---

## 12. Status dan State Machine

### 12.1 Order Status

| Status | Deskripsi |
|---|---|
| `pending_payment` | Order dibuat dan belum dibayar |
| `paid` | Pembayaran sukses |
| `processing` | Order sedang diproses |
| `shipped` | Order dikirim |
| `completed` | Order selesai |
| `cancelled` | Order dibatalkan |

### 12.2 Payment Status

| Status | Deskripsi |
|---|---|
| `pending` | Menunggu pembayaran |
| `paid` | Pembayaran sukses |
| `failed` | Pembayaran gagal |
| `expired` | Pembayaran kadaluarsa |
| `refunded` | Pembayaran dikembalikan |

### 12.3 Shipping Status

| Status | Deskripsi |
|---|---|
| `not_created` | Shipment belum dibuat |
| `created` | Shipment berhasil dibuat |
| `picked_up` | Paket telah diambil courier |
| `in_transit` | Paket dalam perjalanan |
| `delivered` | Paket telah diterima |
| `failed` | Pengiriman gagal |
| `returned` | Paket dikembalikan |

Tidak ada state inventory reservation.

---

## 13. Database Ringkas

### 13.1 User

- `users`
- `customer_addresses`

### 13.2 Product Catalog

- `categories`
- `products`
- `product_categories`
- `product_images`
- `product_variants`
- `stocks`

### 13.3 Cart

- `carts`
- `cart_items`

### 13.4 Promotion

- `vouchers`
- `voucher_products`
- `voucher_categories`

### 13.5 Order

- `orders`
- `order_items`
- `order_addresses`

### 13.6 Payment

- `payments`
- `payment_logs`

### 13.7 Shipping

- `shipments`
- `shipment_trackings`
- `biteship_webhook_logs`

### 13.8 Customer Features

- `wishlists`
- `notifications`

### 13.9 CMS

- `banners`
- `pages`
- `site_settings`

### 13.10 Audit

- `admin_activity_logs`

Tidak terdapat tabel:

```text
collections
product_collections
product_reviews
product_marketplace_links
stock_logs
inventory_reservations
desty_*
```

---

## 14. Relasi Database Utama

### Product dan Category

```text
products
   |
   | many
   v
product_categories
   ^
   | many
categories
```

### Product dan Variant

```text
products
   |
   | 1:N
   v
product_variants
```

### Variant dan Stock

```text
product_variants
   |
   | 1:1
   v
stocks
```

### Product dan Image

```text
products
   |
   | 1:N
   v
product_images
```

---

## 15. API / Internal Route Design

Karena aplikasi menggunakan Laravel + Inertia, route utama menggunakan web routes Laravel.

### 15.1 Public Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/` | Homepage |
| GET | `/products` | Shop All |
| GET | `/products/{slug}` | Product Detail |
| GET | `/categories/{slug}` | Category |
| GET | `/search` | Search |
| GET | `/pages/{slug}` | Static Page |

Tidak ada route:

```text
/collections/{slug}
```

### 15.2 Customer Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/cart` | Cart |
| POST | `/cart/items` | Add item |
| PATCH | `/cart/items/{id}` | Update quantity |
| DELETE | `/cart/items/{id}` | Remove item |
| GET | `/checkout` | Checkout |
| POST | `/checkout` | Create order |
| GET | `/orders` | Order history |
| GET | `/orders/{order_number}` | Order detail |
| POST | `/wishlist/{product}` | Add wishlist |
| DELETE | `/wishlist/{product}` | Remove wishlist |

Tidak ada route review.

### 15.3 Admin Product Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/admin/products` | Product list |
| GET | `/admin/products/create` | Create product |
| POST | `/admin/products` | Store product |
| GET | `/admin/products/{product}/edit` | Edit product |
| PUT | `/admin/products/{product}` | Update product |
| DELETE | `/admin/products/{product}` | Delete product |

### 15.4 Admin Category Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/admin/categories` | Category list |
| POST | `/admin/categories` | Create category |
| PUT | `/admin/categories/{category}` | Update category |
| DELETE | `/admin/categories/{category}` | Delete category |

### 15.5 Admin Variant Routes

| Method | Route | Deskripsi |
|---|---|---|
| POST | `/admin/products/{product}/variants` | Create variant |
| PUT | `/admin/product-variants/{variant}` | Update variant |
| DELETE | `/admin/product-variants/{variant}` | Delete variant |

### 15.6 Admin Stock Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/admin/stocks` | Stock list |
| PUT | `/admin/product-variants/{variant}/stock` | Update stock |

Tidak ada stock log route.

### 15.7 Order Routes

| Method | Route | Deskripsi |
|---|---|---|
| GET | `/admin/orders` | Order list |
| GET | `/admin/orders/{order}` | Order detail |
| POST | `/admin/orders/{order}/create-shipment` | Create Biteship shipment |

### 15.8 Webhook Routes

| Method | Route | Deskripsi |
|---|---|---|
| POST | `/webhooks/midtrans` | Midtrans notification |
| POST | `/webhooks/biteship` | Biteship webhook |

### 15.9 Utility API

| Method | Route | Deskripsi |
|---|---|---|
| POST | `/api/shipping/rates` | Biteship rates |
| GET | `/api/areas/search` | Biteship area search |
| POST | `/api/payments/midtrans/snap-token` | Generate Snap token jika dipisah dari checkout |

---

## 16. Validasi Bisnis

### Product

- `name` wajib.
- `slug` wajib dan unique.
- Minimal satu category direkomendasikan.
- Minimal satu product image direkomendasikan.
- Minimal satu variant wajib.
- Product inactive tidak dapat dibeli.

### Category

- `name` wajib.
- `slug` wajib unique.
- Tidak ada parent category.

### Product Variant

- `sku` wajib unique.
- `regular_price > 0`.
- `sale_price` nullable.
- Jika ada `sale_price`, maka `sale_price <= regular_price`.
- `net_weight` dapat berupa string custom.
- `grind_type` nullable.
- `shipping_weight_gram >= 0`.

### Stock

- Setiap active variant sebaiknya memiliki stock.
- `quantity >= 0`.
- `low_stock_threshold >= 0`.

### Cart

- Quantity minimal 1.
- Quantity tidak boleh melebihi stock terbaru.
- Variant inactive tidak dapat ditambahkan.

### Checkout

- User wajib login.
- Cart tidak kosong.
- Address lengkap.
- Shipping service dipilih.
- Stock divalidasi ulang.
- Price dihitung ulang backend.
- Voucher divalidasi backend.
- Grand total dihitung backend.

### Order

- Order number unique.
- Checkout idempotency key mencegah duplicate order.
- Payment callback tidak boleh memproses order yang sama dua kali.

---

## 17. Product Detail Requirements

Product Detail sengaja dibuat sederhana.

### Layout Utama

```text
Header
Breadcrumb

Product Detail
├── Main Image
├── Thumbnail Gallery
└── Product Information
    ├── Product Name
    ├── Origin / Short Context
    ├── Price
    ├── Variant
    ├── Quantity
    └── Add to Bag

About This Coffee

Optional Lifestyle Image

Related Products

Footer
```

### Fungsi Utama

```text
Select Variant
→ Select Quantity
→ Add to Bag
```

Tidak ada di Product Detail:

- alamat,
- payment,
- courier,
- shipping form,
- checkout form.

### Variant UI

Frontend dapat membentuk label variant dari:

```text
net_weight + grind_type
```

Contoh:

```text
100gram · Whole Bean
250gram · Whole Bean
250gram · Fine
500ml
5pcs
```

---

## 18. Product Listing Requirements

### Filter

Product listing dapat difilter berdasarkan:

- category,
- harga,
- keyword.

Opsional berdasarkan data produk:

- origin,
- process.

Sort:

- Featured,
- Newest,
- Price Low to High,
- Price High to Low,
- Best Seller.

### Harga Product Card

Karena harga berada di product variant:

Jika semua variant sama:

```text
Rp95.000
```

Jika berbeda:

```text
Mulai Rp95.000
```

Harga minimum dapat dihitung dari variant aktif.

---

## 19. Frontend Design Direction

Declasse Coffee menggunakan visual:

- Warm Cream,
- Warm Sand,
- Deep Forest,
- Soft Oat,
- Burnt Terracotta.

Karakter:

- editorial,
- premium,
- specialty coffee,
- minimal,
- strong product photography,
- thin borders,
- oversized typography,
- low-radius UI.

### Product Card

Product card menggunakan:

- full-bleed image,
- dark overlay,
- white text overlay,
- product name,
- price,
- tasting / descriptive text jika berasal dari content yang tersedia.

Card tidak menggunakan floating white box.

---

## 20. Admin Product Form

### Product Information

Field:

- Name
- Slug
- SKU
- Origin
- Process
- Status
- Featured
- New Arrival
- Best Seller
- Description

### Categories

Admin dapat memilih **lebih dari satu category**.

UI disarankan menggunakan:

- checkbox list,
- searchable multi-select,
- command selector.

### Product Images

- upload multiple,
- reorder,
- primary image,
- alt text.

### Variant

Per variant:

- SKU
- Net Weight
- Grind Type
- Regular Price
- Sale Price
- Shipping Weight
- Variant Image
- Active

### Stock

Per variant:

- Quantity
- Low Stock Threshold

---

## 21. Acceptance Criteria

### 21.1 Product

- Admin dapat create product.
- Product dapat mempunyai banyak category.
- Category dapat mempunyai banyak product.
- Product dapat mempunyai banyak image.
- Product minimal memiliki satu variant.
- Product description dapat menyimpan rich text.
- Product dapat tampil di storefront.

### 21.2 Variant

- Variant dapat menggunakan `100gram`.
- Variant dapat menggunakan `500ml`.
- Variant dapat menggunakan `5pcs`.
- Variant dapat memiliki `grind_type = null`.
- Variant dapat memiliki harga berbeda.

### 21.3 Stock

- Setiap variant dapat memiliki quantity sendiri.
- Admin dapat update quantity.
- Quantity tidak boleh negatif.
- Low stock dapat diketahui menggunakan threshold.
- Add to cart menolak quantity melebihi stock.

### 21.4 Cart

- Customer dapat add to cart.
- Customer dapat update quantity.
- Customer dapat remove item.
- Variant yang dipilih tersimpan dengan benar.

### 21.5 Checkout

- Customer dapat memilih address.
- Customer dapat memilih Biteship rate.
- Voucher dapat diterapkan.
- Order dapat dibuat.
- Stock divalidasi sebelum order/payment finalization.

### 21.6 Payment

- Snap token berhasil dibuat.
- Midtrans webhook dapat diproses.
- Payment sukses mengubah status menjadi paid.
- Duplicate webhook tidak memproses stok dua kali.

### 21.7 Shipping

- Rate Biteship tampil.
- Shipment dapat dibuat.
- Tracking dapat diperbarui.
- Customer dapat melihat status.

---

## 22. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| `net_weight` terlalu bebas | Data variant tidak konsisten | Tetapkan naming convention pada admin UI |
| SKU tidak konsisten | Stock sulit dikelola | SKU variant wajib unique |
| Checkout bersamaan pada stok rendah | Overselling | Transaction + row lock + backend stock revalidation |
| Midtrans webhook ganda | Stock/order diproses dua kali | Idempotent webhook dan pengecekan state |
| Harga berubah saat item berada di cart | Total salah | Recalculate dari database saat checkout |
| Biteship rate gagal | Checkout tertahan | Retry + clear error state |
| Rich text mengandung script | XSS | Sanitasi output Tiptap |
| Gambar terlalu besar | Performance buruk | Resize, WebP/AVIF, lazy loading |

---

## 23. Non-Functional Requirements

### 23.1 Performance

- Homepage target < 3 detik dalam kondisi produksi wajar.
- Product listing menggunakan pagination.
- Product images dioptimasi.
- Gunakan eager loading yang tepat.
- Index query catalog.
- Jangan melakukan N+1 query untuk variant/category/images.

### 23.2 Security

- Password di-hash Laravel.
- Admin route menggunakan auth + role middleware.
- Midtrans webhook memverifikasi signature.
- API key Biteship / Midtrans hanya backend.
- File upload divalidasi.
- Rich text disanitasi.
- CSRF aktif.
- Sensitive endpoint rate-limited.

### 23.3 Reliability

- Webhook idempotent.
- Payment payload dicatat.
- Biteship webhook payload dicatat.
- Stok tidak boleh negatif.
- Stock deduction harus atomic.

### 23.4 Maintainability

Gunakan service/action terpisah untuk:

- checkout,
- Midtrans,
- Biteship,
- stock mutation,
- voucher.

Gunakan:

- Form Request,
- Enum,
- Policies,
- Database Transaction.

### 23.5 SEO

Database product saat ini tidak mempunyai `meta_title` dan `meta_description`.

Karena itu SEO product dapat dibentuk dari data utama:

```text
<title>
{product.name} | Declasse Coffee
```

Meta description dapat:

- dihasilkan dari excerpt `description`,
- atau ditambahkan kemudian jika kebutuhan SEO berkembang.

Category memiliki slug SEO-friendly.

Product:

```text
/products/{slug}
```

Category:

```text
/categories/{slug}
```

Product image mempunyai `alt_text`.

---

## 24. Suggested Folder Structure

```text
app/
  Actions/
    Checkout/
      CreateOrderAction.php
      ValidateCheckoutStockAction.php

    Payment/
      CreateMidtransSnapTokenAction.php
      HandleMidtransWebhookAction.php

    Shipping/
      GetBiteshipRatesAction.php
      CreateBiteshipShipmentAction.php
      HandleBiteshipWebhookAction.php

    Stock/
      UpdateStockAction.php
      ReduceStockForOrderAction.php

  Enums/
    OrderStatus.php
    PaymentStatus.php
    ShippingStatus.php

  Http/
    Controllers/
      Storefront/
      Customer/
      Admin/
      Webhook/
      Api/

    Requests/
      ProductRequest.php
      ProductVariantRequest.php
      CategoryRequest.php
      StockRequest.php
      CheckoutRequest.php
      VoucherRequest.php

  Jobs/
    CreateBiteshipShipmentJob.php
    ProcessMidtransWebhookJob.php

  Models/
    User.php
    CustomerAddress.php
    Category.php
    Product.php
    ProductImage.php
    ProductVariant.php
    Stock.php
    Cart.php
    CartItem.php
    Order.php
    OrderItem.php
    Payment.php
    Shipment.php
    Voucher.php
    Wishlist.php

  Services/
    MidtransService.php
    BiteshipService.php
    StockService.php

resources/
  js/
    Pages/
      Storefront/
      Auth/
      Customer/
      Admin/

    Components/
    Layouts/
    Types/
```

Tidak diperlukan class seperti:

```text
ReserveStockAction
ReleaseStockAction
FinalizeReservedStockAction
DestyService
ProductCollection
ProductReview
```

---

## 25. MVP Scope

MVP fokus pada:

1. Homepage.
2. Shop All.
3. Category.
4. Product Detail.
5. Search.
6. Login/Register.
7. Product Catalog.
8. Product Variant.
9. Product Image.
10. Category many-to-many.
11. Simple Stock.
12. Cart.
13. Checkout.
14. Address.
15. Midtrans.
16. Biteship rate.
17. Basic shipment.
18. Order history.
19. Admin Product.
20. Admin Category.
21. Admin Stock.
22. Admin Order.
23. Voucher.
24. CMS.
25. Payment webhook.
26. Biteship webhook.

---

## 26. Future Enhancement

Setelah MVP:

1. Subscription commerce.
2. Coffee recommendation quiz.
3. Brew guide personalization.
4. Advanced product filtering.
5. Customer segmentation.
6. Email marketing.
7. Abandoned cart.
8. Loyalty.
9. Bundle builder.
10. Gift set.
11. Advanced analytics.
12. Export sales report.
13. Multi warehouse jika bisnis membutuhkan.
14. Return/refund automation.
15. Structured SEO fields jika diperlukan.
16. Coffee flavor profile metadata jika ingin filtering lebih kompleks.

---

## 27. Environment Variables

```env
APP_NAME="Declasse Coffee"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=declasse_coffee
DB_USERNAME=root
DB_PASSWORD=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true

BITESHIP_API_KEY=
BITESHIP_BASE_URL=https://api.biteship.com
BITESHIP_ORIGIN_AREA_ID=

QUEUE_CONNECTION=database
FILESYSTEM_DISK=public
```

---

## 28. Testing Requirements

### Unit Test

- Variant price.
- Sale price validation.
- Voucher calculation.
- Stock validation.
- Order total.
- Status transition.

### Feature Test

- Product create.
- Many-to-many category sync.
- Variant create.
- Stock update.
- Add to cart.
- Update cart quantity.
- Checkout.
- Create Midtrans Snap token.
- Handle Midtrans webhook.
- Get Biteship rates.
- Create shipment.
- Wishlist.

### Stock Concurrency Test

Wajib menguji:

- dua customer mencoba membeli variant terakhir,
- duplicate Midtrans webhook,
- repeated checkout request,
- stock tidak pernah menjadi negatif.

### Integration Test

- Midtrans sandbox.
- Biteship development/staging environment yang tersedia.

### Manual Test

- Product create/edit.
- Multiple categories.
- Image upload/reorder.
- Tiptap.
- Variant `100gram`.
- Variant `500ml`.
- Variant `5pcs`.
- Whole bean.
- Ground coffee.
- Cart mobile.
- Checkout mobile.
- Payment.
- Tracking.

---

## 29. Definition of Done

Fitur selesai jika:

1. UI responsive.
2. Backend validation selesai.
3. Migration sesuai database final.
4. Authorization berjalan.
5. Error handling tersedia.
6. Test utama tersedia.
7. Environment terdokumentasi.
8. Tidak ada dummy production.
9. Midtrans webhook idempotent.
10. Biteship webhook idempotent.
11. Stock tidak dapat menjadi negatif.
12. Admin dapat mengoperasikan sistem tanpa akses database langsung.
13. Product dapat memiliki banyak category.
14. Produk biji, bubuk, cair, dan pcs berhasil ditambahkan dan dibeli.
15. Product Detail hanya menangani pemilihan product/variant/quantity dan Add to Bag sebelum cart/checkout.

---

## 30. Referensi Teknis

- Laravel Starter Kit React Inertia  
  https://laravel.com/docs/starter-kits

- Inertia.js  
  https://inertiajs.com/

- Midtrans Snap  
  https://docs.midtrans.com/docs/snap

- Biteship API  
  https://biteship.com/en/docs/intro

Dokumentasi versi library/integrasi harus dicek kembali pada saat implementasi.

---

## 31. Lampiran: Product Schema Final

```text
categories

products

product_categories

product_images

product_variants

stocks
```

### Product

```text
products
├── id
├── name
├── slug
├── sku
├── origin
├── process
├── description
├── status
├── is_featured
├── is_new_arrival
├── is_best_seller
├── created_at
├── updated_at
└── deleted_at
```

### Product Variant

```text
product_variants
├── id
├── product_id
├── sku
├── net_weight
├── grind_type
├── regular_price
├── sale_price
├── shipping_weight_gram
├── image_url
├── is_active
├── created_at
├── updated_at
└── deleted_at
```

### Stock

```text
stocks
├── id
├── product_variant_id
├── quantity
├── low_stock_threshold
├── created_at
└── updated_at
```

### Category Pivot

```text
product_categories
├── id
├── product_id
├── category_id
├── created_at
└── updated_at
```

---

## 32. Contoh Data Produk

### 32.1 Coffee Beans

```text
Product:
Declasse Gayo Natural

Categories:
Coffee Beans
Single Origin
Filter Coffee

Variant 1:
net_weight = "100gram"
grind_type = "whole_bean"

Variant 2:
net_weight = "250gram"
grind_type = "whole_bean"
```

### 32.2 Ground Coffee

```text
Product:
Declasse House Blend

Categories:
Ground Coffee
Blend

Variant:
net_weight = "250gram"
grind_type = "medium"
```

### 32.3 Coffee Liquid

```text
Product:
Declasse Espresso Concentrate

Categories:
Ready to Drink

Variant:
net_weight = "500ml"
grind_type = null
```

### 32.4 Product Pcs

```text
Product:
Declasse Drip Bag

Categories:
Drip Bag
Ready to Brew

Variant:
net_weight = "5pcs"
grind_type = null
```

Dengan struktur tersebut, keempat tipe produk dapat menggunakan alur commerce yang sama:

```text
Product
→ Variant
→ Stock
→ Cart
→ Order
```

---

## 33. Kesimpulan

Declasse Coffee E-Commerce dibangun sebagai modern monolith menggunakan Laravel, Inertia.js, React TypeScript, dan MySQL.

Sistem sengaja dibuat lebih sederhana dibandingkan rancangan awal.

Fokus utama adalah:

- katalog kopi yang fleksibel,
- product-category many-to-many,
- product variant sederhana,
- stock sederhana,
- cart,
- checkout,
- Midtrans,
- Biteship,
- CMS,
- admin operasional.

Tidak digunakan:

- collection,
- product collection,
- product review,
- marketplace product link,
- Desty Omni,
- inventory reservation,
- reserved stock,
- stock logs kompleks.

Database tetap dapat menangani produk:

- bubuk,
- biji,
- cair,
- pcs,

tanpa membuat table terpisah untuk masing-masing jenis produk.

Pendekatan ini menjaga database tetap sederhana, fleksibel, dan mudah dikembangkan sesuai pertumbuhan Declasse Coffee.
