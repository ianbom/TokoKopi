import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ channel: 'chrome' });

const viteUrl = process.env.VITE_TEST_URL ?? 'http://[::1]:5173';
const originalRate = {
    id: 'jne-reg',
    courier_company: 'jne',
    courier_type: 'reg',
    courier_service_name: 'Reguler',
    description: 'Layanan reguler',
    duration: '2 - 3 days',
    price: 16000,
};

async function state(page: Page) {
    return JSON.parse((await page.locator('#state').textContent())!);
}

async function setup(
    page: Page,
    options: {
        changedRate?: Partial<typeof originalRate>;
        rateFailure?: boolean;
        initialSelection?: boolean;
        invalidVoucher?: boolean;
    } = {},
) {
    let voucherApplied = false;
    let serverSelection: string | null = originalRate.id;
    let rateRequests = 0;
    let orderRequests = 0;

    await page.route(viteUrl + '/', (route) =>
        route.fulfill({
            contentType: 'text/html',
            body:
                '<div id="root"></div><script type="module">import RefreshRuntime from "/@react-refresh"; RefreshRuntime.injectIntoGlobalHook(window); window.$RefreshReg$ = () => {}; window.$RefreshSig$ = () => (type) => type; window.__vite_plugin_react_preamble_installed__ = true; const { mount } = await import("/tests/browser/checkout-voucher-fixture.tsx"); mount(' +
                JSON.stringify(
                    options.initialSelection === false ? null : originalRate,
                ) +
                ');</script>',
        }),
    );
    await page.route('**/checkout/**', async (route) => {
        const path = new URL(route.request().url()).pathname;

        if (path === '/checkout/shipping-rates') {
            rateRequests++;

            if (rateRequests > 1 && options.rateFailure) {
                await route.fulfill({
                    status: 422,
                    json: { errors: { shipping: 'Ongkir tidak tersedia.' } },
                });

                return;
            }

            await route.fulfill({
                json: {
                    rates: [
                        {
                            ...originalRate,
                            ...(rateRequests > 1 ? options.changedRate : {}),
                        },
                    ],
                },
            });
        } else if (path === '/checkout/shipping-rate') {
            serverSelection = route.request().postDataJSON().shipping_rate_id;
            await route.fulfill({ json: { rate: originalRate } });
        } else if (path === '/checkout/voucher') {
            if (options.invalidVoucher) {
                await route.fulfill({
                    status: 422,
                    json: { errors: { voucher_code: 'Voucher tidak valid.' } },
                });

                return;
            }

            voucherApplied = route.request().method() === 'POST';
            serverSelection = null;
            await route.fulfill({
                json: {
                    voucher: voucherApplied
                        ? { code: 'KOPI10', name: 'Kopi 10%', discount: 9000 }
                        : null,
                    summary: {
                        item_count: 1,
                        subtotal: 90000,
                        shipping: 0,
                        discount: voucherApplied ? 9000 : 0,
                        service_fee: 0,
                        total: voucherApplied ? 81000 : 90000,
                    },
                },
            });
        } else if (path === '/checkout/place-order') {
            orderRequests++;
            await route.fulfill(
                serverSelection
                    ? { json: { redirect_url: '/payment' } }
                    : {
                          status: 422,
                          json: {
                              errors: {
                                  shipping_rate_id: 'Pilih ulang ongkir.',
                              },
                          },
                      },
            );
        } else {
            await route.continue();
        }
    });
    await page.goto(viteUrl + '/');
    await expect.poll(async () => (await state(page)).rates.length).toBe(1);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);

    return {
        rateRequests: () => rateRequests,
        orderRequests: () => orderRequests,
    };
}

test('apply and remove voucher refresh rates, rebind selection and keep correct totals', async ({
    page,
}) => {
    const requests = await setup(page);
    await page.getByText('Apply', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(97000);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect(requests.rateRequests()).toBe(2);
    await page.getByText('Order', { exact: true }).click();
    await expect.poll(requests.orderRequests).toBe(1);
    expect((await state(page)).errors).toEqual({});

    await page.getByText('Remove', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(106000);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect((await state(page)).voucher).toBeNull();
    expect(requests.rateRequests()).toBe(3);
});

for (const changedRate of [
    { price: 18000 },
    { courier_company: 'jnt' },
    { courier_type: 'express' },
    { courier_service_name: 'Express' },
    { duration: '1 day' },
]) {
    test(
        'changed rate requires reselection: ' + JSON.stringify(changedRate),
        async ({ page }) => {
            const requests = await setup(page, { changedRate });
            await page.getByText('Apply', { exact: true }).click();
            await expect.poll(requests.rateRequests).toBe(2);
            await expect.poll(async () => (await state(page)).rate).toBeNull();
            await page.getByText('Order', { exact: true }).click();
            expect(requests.orderRequests()).toBe(0);
            await page.getByText('Select', { exact: true }).click();
            await expect
                .poll(async () => (await state(page)).summary.total)
                .toBe(81000 + (changedRate.price ?? originalRate.price));
        },
    );
}

test('rate failure clears stale selection without automatically retrying', async ({
    page,
}) => {
    const requests = await setup(page, { rateFailure: true });
    await page.getByText('Apply', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).errors.shipping)
        .toBe('Ongkir tidak tersedia.');
    expect((await state(page)).rate).toBeNull();
    expect(requests.rateRequests()).toBe(2);
});

test('shipping synchronization blocks checkout and duplicate voucher requests', async ({
    page,
}) => {
    const requests = await setup(page);
    let releaseRates!: () => void;
    let refreshing = false;
    const ratesReady = new Promise<void>((resolve) => {
        releaseRates = resolve;
    });

    await page.route('**/checkout/shipping-rates', async (route) => {
        refreshing = true;
        await ratesReady;
        await route.fallback();
    });
    await page.getByText('Apply', { exact: true }).click();
    await expect.poll(() => refreshing).toBe(true);
    expect((await state(page)).loading).toBe(true);
    await page.getByText('Order', { exact: true }).click();
    await page.getByText('Apply', { exact: true }).click();
    expect(requests.orderRequests()).toBe(0);
    releaseRates();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(97000);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect(requests.rateRequests()).toBe(2);
});

test('invalid voucher preserves current shipping and does not refresh rates', async ({
    page,
}) => {
    const requests = await setup(page, { invalidVoucher: true });
    await page.getByText('Apply', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).errors.voucher_code)
        .toBe('Voucher tidak valid.');
    expect((await state(page)).summary.total).toBe(106000);
    expect(requests.rateRequests()).toBe(1);
});

test('voucher without selected shipping still refreshes selectable rates', async ({
    page,
}) => {
    const requests = await setup(page, { initialSelection: false });
    await page.getByText('Apply', { exact: true }).click();
    await expect.poll(requests.rateRequests).toBe(2);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect((await state(page)).rate).toBeNull();
    await page.getByText('Select', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(97000);
});
