# Checkout payment selection

Checkout stays on Midtrans Snap redirect. Choosing a method and obtaining a
Snap token do not charge the customer or prove payment. Only validated
notifications/server reconciliation can change payment status.

## Contract

- `CheckoutPaymentMethod` is the backend catalog for names, local logos and
  validation. `services.midtrans.enabled_payments` is the merchant allowlist.
- The requested configuration enables `bca_va`, `bni_va`, `bri_va`, `echannel`,
  `permata_va`, `other_qris`, `gopay`, and `shopeepay`. Verify merchant activation
  separately in sandbox UAT and before production; remove unsupported channels
  from that config. An empty allowlist disables new checkouts.
- Checkout sends one `payment_method` plus the existing idempotency key.
  `payments.requested_payment_method` stores the immutable channel before HTTP.
  `payments.payment_method` remains the provider-confirmed `payment_type`:
  for example, `bca_va` may become `bank_transfer`, and `other_qris` may become
  `qris`. These identifiers are not required to match.
- The Snap request reads the saved snapshot and sets exactly one
  `enabled_payments` entry. Historical null snapshots are not backfilled or
  assigned a new Snap filter. Existing manual payments are not converted.
- User-row locking plus a locked idempotency recheck serializes creation.
  Only the creating request posts Snap, outside the transaction. Retries reuse
  the saved result or return an actionable detail-order link. A changed method
  cannot silently create a new order or replace the snapshot.
- Uncertain creation keeps the existing stock/voucher lifecycle intact and
  requires reconciliation. Neither a Core API 404 nor elapsed local time alone
  releases stock. Provider calls are not automatically repeated.
- Redirects require HTTPS, the exact Snap environment host, no userinfo, a
  standard HTTPS port and a `/snap/` path. Existing redirects are checked before
  checkout reuse as well. The browser completion route only navigates.
- Logo originals and source URLs/hashes are recorded in
  `public/images/payments/sources.json`. They are served locally.

## Deployment

Do not run these commands against the application database without approval.
Deploy during maintenance; stop checkout traffic and queue processing before
switching code. Keep maintenance active if any schema check fails.

1. Run `php artisan down` and stop the deployment's queue workers.
2. Deploy the code, then run `php artisan migrate --force`.
3. Run `php artisan migrate:status`; ensure
   `2026_10_27_000001_add_requested_payment_method_to_payments_table` is applied.
   Verify `payments.requested_payment_method` exists using the deployment's
   schema inspection tool. The checkout service also fails closed if missing.
4. Run `npm run build`. Refresh the deployment's config cache with
   `php artisan config:cache` after reviewing the merchant allowlist.
5. Run `php artisan queue:restart`, resume workers, then `php artisan up`.

The migration only adds a nullable column. No fresh migration, seeding,
backfill, or rewrite of historical payments is necessary. Do not roll the
column back while this checkout code receives traffic.

## Local regression checks

PHP tests use `phpunit.xml` with SQLite `:memory:`, fake HTTP and synthetic
credentials. The new payment-selection suite additionally asserts the DB
connection/database before creating fixtures.

```powershell
php artisan test --compact tests/Feature/Customer/CheckoutPaymentMethodTest.php
php artisan test --compact tests/Feature/Customer/IntegrationRecoveryTest.php tests/Feature/Customer/CartStockAvailabilityTest.php tests/Feature/Customer/CheckoutStockFinalizationTest.php tests/Feature/Customer/MidtransFinishRedirectTest.php tests/Feature/Customer/OrderDetailDataTest.php
npm run types:check
npm run lint:check
npm run format:check
composer run lint:check
npm run build
```

Browser fixtures render the actual checkout component, intercept checkout
requests locally and use only synthetic customer data. They never submit a
real payment. Use the isolated test Vite configuration to avoid sharing cache
or Wayfinder regeneration with the application's development server:

```powershell
node node_modules/vite/bin/vite.js --config=tests/browser/vite.config.ts
```

In a second terminal, with browser-harness connected to a test browser:

```powershell
Get-Content tests/browser/checkout-payment-method.py | browser-harness
$env:VITE_TEST_URL='http://127.0.0.1:5175'
npx playwright test tests/browser/checkout-voucher-sync.spec.ts --workers=1
```

Fake HTTP, deterministic request interleavings and local browser checks do not
prove live merchant support, public webhook delivery or production concurrency.
Merchant sandbox UAT still needs explicit authorization.

## Official references

- https://docs.midtrans.com/reference/request-body-json-parameter
- https://docs.midtrans.com/reference/snap-api-overview
- https://docs.midtrans.com/docs/https-notification-webhooks
- https://midtrans.com/payments
