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
    let serverSelection: string | null =
        options.initialSelection === false ? null : originalRate.id;
    let rateRequests = 0;
    let orderRequests = 0;
    let voucherRequests = 0;
    const currentRate = () => ({
        ...originalRate,
        ...(rateRequests > 1 ? options.changedRate : {}),
    });
    const summary = () => {
        const shipping = serverSelection ? currentRate().price : 0;
        const discount = voucherApplied ? 9000 : 0;

        return {
            item_count: 1,
            subtotal: 90000,
            shipping,
            discount,
            service_fee: 0,
            rounding_adjustment: 0,
            total: 90000 + shipping - discount,
        };
    };

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
            serverSelection = null;

            if (rateRequests > 1 && options.rateFailure) {
                await route.fulfill({
                    status: 422,
                    json: { errors: { shipping: 'Ongkir tidak tersedia.' } },
                });

                return;
            }

            await route.fulfill({
                json: {
                    rates: [currentRate()],
                    summary: summary(),
                },
            });
        } else if (path === '/checkout/shipping-rate') {
            serverSelection = route.request().postDataJSON().shipping_rate_id;
            await route.fulfill({
                json: { rate: currentRate(), summary: summary() },
            });
        } else if (path === '/checkout/voucher') {
            voucherRequests++;

            if (options.invalidVoucher) {
                await route.fulfill({
                    status: 422,
                    json: { errors: { voucher_code: 'Voucher tidak valid.' } },
                });

                return;
            }

            voucherApplied = route.request().method() === 'POST';
            await route.fulfill({
                json: {
                    voucher: voucherApplied
                        ? { code: 'KOPI10', name: 'Kopi 10%', discount: 9000 }
                        : null,
                    summary: summary(),
                },
            });
        } else if (path === '/checkout/place-order') {
            expect(route.request().postDataJSON().payment_method).toBe(
                'bca_va',
            );
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
    await page
        .getByRole('button', { name: 'Select payment', exact: true })
        .click();
    await expect.poll(async () => (await state(page)).rates.length).toBe(1);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);

    return {
        rateRequests: () => rateRequests,
        orderRequests: () => orderRequests,
        voucherRequests: () => voucherRequests,
    };
}

test('same-tick submissions send only one checkout request', async ({
    page,
}) => {
    const requests = await setup(page);
    await page
        .getByRole('button', { name: 'Double order', exact: true })
        .click();
    await expect.poll(() => requests.orderRequests()).toBe(1);
    await page.waitForTimeout(100);
    expect(requests.orderRequests()).toBe(1);
});

test('apply and remove voucher preserve shipping selection and correct totals without refreshing rates', async ({
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
    expect(requests.rateRequests()).toBe(1);
    expect((await state(page)).rate).toEqual(originalRate);
    expect((await state(page)).summary.shipping).toBe(originalRate.price);
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
    expect(requests.rateRequests()).toBe(1);
    expect((await state(page)).rate).toEqual(originalRate);
    expect((await state(page)).summary.shipping).toBe(originalRate.price);
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
            await expect
                .poll(async () => Boolean((await state(page)).loading))
                .toBe(false);
            await page.getByText('Refresh', { exact: true }).click();
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
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    await page.getByText('Refresh', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).errors.shipping)
        .toBe('Ongkir tidak tersedia.');
    expect((await state(page)).rate).toBeNull();
    expect(requests.rateRequests()).toBe(2);
});

test('voucher update blocks checkout and duplicate voucher requests', async ({
    page,
}) => {
    const requests = await setup(page);
    let releaseVoucher!: () => void;
    let updatingVoucher = false;
    const voucherReady = new Promise<void>((resolve) => {
        releaseVoucher = resolve;
    });

    await page.route('**/checkout/voucher', async (route) => {
        updatingVoucher = true;
        await voucherReady;
        await route.fallback();
    });
    await page.getByText('Apply', { exact: true }).click();
    await expect.poll(() => updatingVoucher).toBe(true);
    expect((await state(page)).loading).toBe(true);
    expect((await state(page)).rate).toEqual(originalRate);
    expect((await state(page)).summary.shipping).toBe(originalRate.price);
    await page.getByText('Order', { exact: true }).click();
    await page.getByText('Apply', { exact: true }).click();
    expect(requests.orderRequests()).toBe(0);
    releaseVoucher();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(97000);
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect(requests.rateRequests()).toBe(1);
    expect(requests.voucherRequests()).toBe(1);
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

test('voucher without selected shipping preserves selectable rates', async ({
    page,
}) => {
    const requests = await setup(page, { initialSelection: false });
    await page.getByText('Apply', { exact: true }).click();
    await expect
        .poll(async () => Boolean((await state(page)).loading))
        .toBe(false);
    expect(requests.rateRequests()).toBe(1);
    expect((await state(page)).rate).toBeNull();
    expect((await state(page)).rates).toHaveLength(1);
    expect((await state(page)).summary.total).toBe(81000);
    await page.getByText('Select', { exact: true }).click();
    await expect
        .poll(async () => (await state(page)).summary.total)
        .toBe(97000);
});
