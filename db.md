Project declasse_coffee_ecommerce {
  database_type: "MySQL"
}

/*
  DECLASSE COFFEE E-COMMERCE DATABASE — SIMPLE STOCK

  Fokus:
  - Database disederhanakan untuk toko kopi.
  - Catalog dibuat sederhana untuk produk coffee roastery.
  - Product dan category menggunakan relasi many-to-many.
  - Collections dan product_collections dihapus.
  - Product reviews dihapus.
  - Semua produk menggunakan product_variants, termasuk produk tanpa pilihan khusus.
    Untuk produk tanpa pilihan, tetap buat satu variant dengan SKU, harga, dan stock.
  - Variant kopi fokus pada:
    net_weight fleksibel, grind type, harga, dan stok.
  - Detail produk dibuat minimal; origin dan process dapat disimpan di products.
  - Description memakai longtext untuk konten rich text dari Tiptap.js.
  - Stok dikelola langsung oleh website melalui tabel stocks.
  - Tidak menggunakan Desty Omni atau sistem inventory/reservation yang kompleks.
  - Setiap product variant memiliki satu data stock sederhana.
*/


// =========================
// USERS
// =========================

Table users {
  id bigint [pk, increment]
  name varchar(255) [not null]
  email varchar(255) [not null, unique]
  google_id varchar(255) [unique]
  phone varchar(255)
  role varchar(255) [not null, default: 'customer', note: 'customer, admin']
  avatar_url varchar(255)
  is_active boolean [not null, default: true]
  email_verified_at timestamp
  password varchar(255) [not null]
  two_factor_secret text
  two_factor_recovery_codes text
  two_factor_confirmed_at timestamp
  remember_token varchar(100)
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    email
    role
    is_active
  }
}

Table customer_addresses {
  id bigint [pk, increment]
  user_id bigint [not null]
  recipient_name varchar(150) [not null]
  recipient_phone varchar(30) [not null]
  label varchar(100)
  province varchar(100) [not null]
  city varchar(100) [not null]
  district varchar(100) [not null]
  subdistrict varchar(100)
  postal_code varchar(20) [not null]
  biteship_area_id varchar(100)
  latitude decimal(10,7)
  longitude decimal(10,7)
  full_address text [not null]
  note text
  is_default boolean [not null, default: false]
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    user_id
    biteship_area_id
  }
}


// =========================
// COFFEE CATALOG
// =========================

Table categories {
  id bigint [pk, increment]
  name varchar(150) [not null]
  slug varchar(180) [not null, unique]
  description text
  image_url varchar(255)
  sort_order int [not null, default: 0]
  is_active boolean [not null, default: true]
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    slug
    is_active
  }
}

/*
  PRODUCT

  Product dibuat sederhana.

  Category menggunakan relasi many-to-many melalui product_categories.
  Satu product dapat memiliki banyak category dan satu category dapat
  digunakan oleh banyak product.

  Contoh category:
  - Coffee Beans
  - Espresso
  - Filter Coffee
  - Single Origin
  - Blend
  - Ready to Drink
  - Best Seller
*/

Table products {
  id bigint [pk, increment]

  name varchar(200) [not null]
  slug varchar(220) [not null, unique]
  sku varchar(100) [unique, note: 'SKU induk / kode produk utama']

  origin varchar(180) [note: 'Contoh: Sumatera Karo, Ijen, Gayo, Toraja, Ethiopia']
  process varchar(100) [note: 'Contoh: natural, washed, anaerobic, wet hulled']

  description longtext [note: 'Konten rich text Tiptap.js: deskripsi produk, origin, karakter kopi, brewing recommendation, storage, dll']

  status varchar(30) [not null, default: 'draft', note: 'draft, active, inactive, archived']

  is_featured boolean [not null, default: false]
  is_new_arrival boolean [not null, default: false]
  is_best_seller boolean [not null, default: false]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    sku
    status
    is_featured
    is_new_arrival
    is_best_seller
  }
}

Table product_categories {
  id bigint [pk, increment]
  product_id bigint [not null]
  category_id bigint [not null]
  created_at timestamp
  updated_at timestamp

  indexes {
    (product_id, category_id) [unique]
    product_id
    category_id
  }
}

Table product_images {
  id bigint [pk, increment]
  product_id bigint [not null]
  image_url varchar(255) [not null]
  alt_text varchar(255)
  sort_order int [not null, default: 0]
  is_primary boolean [not null, default: false]
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    product_id
    is_primary
  }
}

/*
  PRODUCT VARIANT

  Variant dibuat sederhana untuk kebutuhan produk kopi.

  Contoh:
  - net_weight = "100gram", grind_type = "whole_bean"
  - net_weight = "200gram", grind_type = "fine"
  - net_weight = "1kg", grind_type = "whole_bean"
  - net_weight = "100ml", grind_type = null
  - net_weight = "2pcs", grind_type = null

  net_weight menggunakan varchar agar fleksibel dan tidak terbatas
  hanya pada satuan gram.

  Setiap product minimal memiliki satu product_variant.
*/

Table product_variants {
  id bigint [pk, increment]
  product_id bigint [not null]

  sku varchar(100) [not null, unique, note: 'SKU unik untuk setiap varian produk']

  net_weight varchar(100) [note: 'Label isi/berat fleksibel. Contoh: 100gram, 250gram, 1kg, 100ml, 2pcs']
  grind_type varchar(50) [note: 'whole_bean, fine, medium_fine, medium, medium_coarse, coarse, tubruk; boleh null']

  regular_price decimal(15,2) [not null]
  sale_price decimal(15,2)

  shipping_weight_gram int [not null, default: 0, note: 'Berat paket dalam gram untuk perhitungan ongkir']

  image_url varchar(255)
  is_active boolean [not null, default: true]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    product_id
    sku
    net_weight
    grind_type
    is_active
  }
}



// =========================
// STOCKS
// =========================

/*
  STOCKS

  Stok dibuat sederhana dan dikelola langsung oleh website.

  Aturan:
  - Satu product_variant memiliki satu baris stock.
  - quantity adalah jumlah stok yang tersedia untuk dijual.
  - Tidak menggunakan stock reservation.
  - Tidak menggunakan Desty Omni atau sinkronisasi inventory pihak ketiga.
  - Pengurangan / pengembalian stok ditangani oleh business logic aplikasi
    ketika order dibayar, dibatalkan, atau direfund sesuai kebutuhan.

  Contoh:
  - Espresso No.01 200g Whole Bean -> quantity 25
  - Espresso No.01 200g Fine       -> quantity 12
  - Espresso Liquid 1000ml         -> quantity 8
*/

Table stocks {
  id bigint [pk, increment]
  product_variant_id bigint [not null, unique]
  quantity int [not null, default: 0, note: 'Jumlah stok tersedia']
  low_stock_threshold int [not null, default: 5, note: 'Batas peringatan stok menipis']
  created_at timestamp
  updated_at timestamp

  indexes {
    product_variant_id
    quantity
  }
}


// =========================
// CART
// =========================

Table carts {
  id bigint [pk, increment]
  user_id bigint [not null, unique]
  created_at timestamp
  updated_at timestamp
}

Table cart_items {
  id bigint [pk, increment]
  cart_id bigint [not null]
  product_id bigint [not null]
  product_variant_id bigint [not null]
  quantity int [not null, default: 1]
  price_snapshot decimal(15,2) [not null]
  variant_name_snapshot varchar(180)
  created_at timestamp
  updated_at timestamp

  indexes {
    cart_id
    product_id
    product_variant_id
    (cart_id, product_variant_id) [unique]
  }
}


// =========================
// VOUCHERS
// =========================

Table vouchers {
  id bigint [pk, increment]
  code varchar(50) [not null, unique]
  name varchar(150) [not null]
  description text
  discount_type varchar(30) [not null, note: 'percentage, fixed']
  discount_value decimal(15,2) [not null]
  max_discount decimal(15,2)
  min_order_amount decimal(15,2)
  usage_limit int
  used_count int [not null, default: 0]
  starts_at timestamp
  ends_at timestamp
  is_active boolean [not null, default: true]
  created_at timestamp
  updated_at timestamp
  deleted_at timestamp

  indexes {
    code
    is_active
    starts_at
    ends_at
  }
}

Table voucher_products {
  id bigint [pk, increment]
  voucher_id bigint [not null]
  product_id bigint [not null]
  created_at timestamp
  updated_at timestamp

  indexes {
    (voucher_id, product_id) [unique]
  }
}

Table voucher_categories {
  id bigint [pk, increment]
  voucher_id bigint [not null]
  category_id bigint [not null]
  created_at timestamp
  updated_at timestamp

  indexes {
    (voucher_id, category_id) [unique]
  }
}


// =========================
// ORDERS
// =========================

Table orders {
  id bigint [pk, increment]
  user_id bigint [not null]
  customer_address_id bigint
  order_number varchar(100) [not null, unique]
  checkout_idempotency_key varchar(100)

  customer_name varchar(150) [not null]
  customer_email varchar(191) [not null]
  customer_phone varchar(30) [not null]

  subtotal decimal(15,2) [not null, default: 0]
  discount_amount decimal(15,2) [not null, default: 0]
  shipping_cost decimal(15,2) [not null, default: 0]
  insurance_cost decimal(15,2) [not null, default: 0]
  service_fee decimal(15,2) [not null, default: 0]
  grand_total decimal(15,2) [not null, default: 0]

  voucher_id bigint
  voucher_code varchar(50)

  payment_status varchar(50) [not null, default: 'pending', note: 'pending, paid, failed, expired, refunded']
  order_status varchar(50) [not null, default: 'pending_payment', note: 'pending_payment, paid, processing, shipped, completed, cancelled']
  shipping_status varchar(50) [not null, default: 'not_created', note: 'not_created, created, picked_up, in_transit, delivered, failed, returned']


  notes text
  paid_at timestamp
  cancelled_at timestamp
  expired_at timestamp
  completed_at timestamp

  voucher_released_at timestamp

  created_at timestamp
  updated_at timestamp

  indexes {
    (user_id, checkout_idempotency_key) [unique]
    order_number
    payment_status
    order_status
    shipping_status
  }
}

Table order_items {
  id bigint [pk, increment]
  order_id bigint [not null]
  product_id bigint
  product_variant_id bigint

  product_name varchar(200) [not null]
  product_sku varchar(100)
  variant_sku varchar(100)

  net_weight varchar(100) [note: 'Snapshot variant. Contoh: 100gram, 100ml, 2pcs']
  grind_type varchar(50)

  price decimal(15,2) [not null]
  quantity int [not null]
  subtotal decimal(15,2) [not null]

  shipping_weight_gram int [not null, default: 0]
  product_image_url varchar(255)

  created_at timestamp
  updated_at timestamp

  indexes {
    order_id
    product_id
    product_variant_id
    variant_sku
    grind_type
  }
}

Table order_addresses {
  id bigint [pk, increment]
  order_id bigint [not null, unique]
  recipient_name varchar(150) [not null]
  recipient_phone varchar(30) [not null]
  province varchar(100) [not null]
  city varchar(100) [not null]
  district varchar(100) [not null]
  subdistrict varchar(100)
  postal_code varchar(20) [not null]
  biteship_area_id varchar(100)
  latitude decimal(10,7)
  longitude decimal(10,7)
  full_address text [not null]
  note text
  created_at timestamp
  updated_at timestamp
}


// =========================
// PAYMENTS
// =========================

Table payments {
  id bigint [pk, increment]
  order_id bigint [not null, unique]
  payment_provider varchar(50) [not null, default: 'midtrans']
  payment_method varchar(100)

  midtrans_order_id varchar(100) [unique]
  midtrans_transaction_id varchar(150)
  midtrans_snap_token varchar(255)
  midtrans_redirect_url varchar(255)

  transaction_status varchar(50)
  fraud_status varchar(50)
  gross_amount decimal(15,2) [not null]
  currency varchar(10) [not null, default: 'IDR']

  paid_at timestamp
  expired_at timestamp
  expires_at timestamp
  last_synced_at timestamp
  failure_reason text
  raw_response json

  created_at timestamp
  updated_at timestamp

  indexes {
    midtrans_order_id
    midtrans_transaction_id
    expires_at
    last_synced_at
  }
}

Table payment_logs {
  id bigint [pk, increment]
  payment_id bigint
  order_id bigint
  provider varchar(50) [not null, default: 'midtrans']
  event_type varchar(100)
  transaction_status varchar(50)
  payload_hash varchar(64) [unique]
  payload json [not null]
  processed_at timestamp
  created_at timestamp
  updated_at timestamp

  indexes {
    payment_id
    order_id
    event_type
    transaction_status
  }
}


// =========================
// SHIPMENTS
// =========================

Table shipments {
  id bigint [pk, increment]
  order_id bigint [not null, unique]

  shipping_provider varchar(50) [not null, default: 'biteship']
  biteship_order_id varchar(150) [unique]
  biteship_tracking_id varchar(150)
  waybill_id varchar(150)
  label_url varchar(255)

  courier_company varchar(100) [not null]
  courier_type varchar(100) [not null]
  courier_service_name varchar(150)
  delivery_type varchar(50) [not null, default: 'now']

  shipping_cost decimal(15,2) [not null, default: 0]
  insurance_cost decimal(15,2) [not null, default: 0]
  estimated_delivery varchar(100)

  shipping_status varchar(50) [not null, default: 'not_created']
  shipped_at timestamp
  delivered_at timestamp
  cancelled_at timestamp
  creating_at timestamp
  last_synced_at timestamp
  failed_reason text

  raw_rate_response json
  raw_order_response json

  created_at timestamp
  updated_at timestamp

  indexes {
    biteship_tracking_id
    waybill_id
    shipping_status
  }
}

Table shipment_trackings {
  id bigint [pk, increment]
  shipment_id bigint [not null]
  status varchar(100) [not null]
  description text
  location varchar(255)
  happened_at timestamp
  provider_happened_at timestamp
  payload_hash varchar(64) [unique]
  raw_payload json
  created_at timestamp
  updated_at timestamp

  indexes {
    shipment_id
    status
    happened_at
  }
}

Table biteship_webhook_logs {
  id bigint [pk, increment]
  event_type varchar(100)
  biteship_order_id varchar(150)
  biteship_tracking_id varchar(150)
  waybill_id varchar(150)
  payload_hash varchar(64) [unique]
  payload json [not null]
  processed_at timestamp
  created_at timestamp
  updated_at timestamp

  indexes {
    event_type
    biteship_order_id
    biteship_tracking_id
    waybill_id
  }
}


// =========================
// WISHLIST & NOTIFICATIONS
// =========================

Table wishlists {
  id bigint [pk, increment]
  user_id bigint [not null]
  product_id bigint [not null]
  created_at timestamp
  updated_at timestamp

  indexes {
    (user_id, product_id) [unique]
  }
}

Table notifications {
  id bigint [pk, increment]
  user_id bigint [not null]
  title varchar(180) [not null]
  message text [not null]
  type varchar(50) [not null]
  reference_type varchar(100)
  reference_id bigint
  is_read boolean [not null, default: false]
  read_at timestamp
  created_at timestamp
  updated_at timestamp

  indexes {
    user_id
    type
    is_read
  }
}


// =========================
// CMS
// =========================

Table banners {
  id bigint [pk, increment]
  title varchar(180) [not null]
  subtitle varchar(255)
  image_desktop_url varchar(255) [not null]
  image_mobile_url varchar(255)
  button_text varchar(100)
  button_url varchar(255)
  placement varchar(100) [not null, default: 'homepage']
  sort_order int [not null, default: 0]
  is_active boolean [not null, default: true]
  starts_at timestamp
  ends_at timestamp
  created_at timestamp
  updated_at timestamp

  indexes {
    placement
    is_active
    sort_order
  }
}

Table pages {
  id bigint [pk, increment]
  title varchar(180) [not null]
  slug varchar(180) [not null, unique]
  content longtext [not null]
  type varchar(100) [not null, note: 'about, terms, privacy, shipping, return_policy']
  meta_title varchar(255)
  meta_description text
  is_active boolean [not null, default: true]
  created_at timestamp
  updated_at timestamp

  indexes {
    slug
    type
    is_active
  }
}

Table site_settings {
  id bigint [pk, increment]
  key varchar(150) [not null, unique]
  value text
  type varchar(50) [not null, default: 'string']
  created_at timestamp
  updated_at timestamp
}


// =========================
// ADMIN LOGS
// =========================

Table admin_activity_logs {
  id bigint [pk, increment]
  user_id bigint [not null]
  action varchar(150) [not null]
  module varchar(100) [not null]
  reference_type varchar(100)
  reference_id bigint
  old_values json
  new_values json
  ip_address varchar(45)
  user_agent text
  created_at timestamp

  indexes {
    user_id
    action
    module
    reference_type
    reference_id
  }
}


// =========================
// RELATIONSHIPS
// =========================

Ref: customer_addresses.user_id > users.id [delete: cascade]


Ref: product_categories.product_id > products.id [delete: cascade]
Ref: product_categories.category_id > categories.id [delete: cascade]

Ref: product_images.product_id > products.id [delete: cascade]
Ref: product_variants.product_id > products.id [delete: cascade]
Ref: stocks.product_variant_id > product_variants.id [delete: cascade]








Ref: carts.user_id > users.id [delete: cascade]

Ref: cart_items.cart_id > carts.id [delete: cascade]
Ref: cart_items.product_id > products.id [delete: cascade]
Ref: cart_items.product_variant_id > product_variants.id [delete: cascade]

Ref: voucher_products.voucher_id > vouchers.id [delete: cascade]
Ref: voucher_products.product_id > products.id [delete: cascade]

Ref: voucher_categories.voucher_id > vouchers.id [delete: cascade]
Ref: voucher_categories.category_id > categories.id [delete: cascade]

Ref: orders.user_id > users.id [delete: restrict]
Ref: orders.customer_address_id > customer_addresses.id [delete: set null]
Ref: orders.voucher_id > vouchers.id [delete: set null]

Ref: order_items.order_id > orders.id [delete: cascade]
Ref: order_items.product_id > products.id [delete: set null]
Ref: order_items.product_variant_id > product_variants.id [delete: set null]

Ref: order_addresses.order_id > orders.id [delete: cascade]

Ref: payments.order_id > orders.id [delete: cascade]

Ref: payment_logs.payment_id > payments.id [delete: set null]
Ref: payment_logs.order_id > orders.id [delete: set null]

Ref: shipments.order_id > orders.id [delete: cascade]
Ref: shipment_trackings.shipment_id > shipments.id [delete: cascade]

Ref: wishlists.user_id > users.id [delete: cascade]
Ref: wishlists.product_id > products.id [delete: cascade]

Ref: notifications.user_id > users.id [delete: cascade]

Ref: admin_activity_logs.user_id > users.id [delete: cascade]
