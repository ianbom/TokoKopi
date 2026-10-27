import { createInertiaApp } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import Checkout from '../../resources/js/pages/customer/checkout/checkout';
import '../../resources/css/app.css';

export const probe = {
    orderRequests: 0,
    payloads: [] as Record<string, unknown>[],
    releaseOrder: () => {},
};

export async function mount() {
    let voucher = false;
    let selectedRate = true;
    const rate = {
        id: 'jne-reg',
        courier_company: 'jne',
        courier_type: 'reg',
        courier_service_name: 'Reguler',
        description: 'Regular delivery',
        duration: '2 - 3 days',
        price: 16000,
    };
    const summary = () => ({
        item_count: 1,
        subtotal: 90000,
        shipping: selectedRate ? 16000 : 0,
        discount: voucher ? 10000 : 0,
        service_fee: 0,
        rounding_adjustment: 0,
        total: 90000 + (selectedRate ? 16000 : 0) - (voucher ? 10000 : 0),
    });
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input, init) => {
        const url = new URL(
            typeof input === 'string'
                ? input
                : input instanceof URL
                  ? input.href
                  : input.url,
            window.location.href,
        );

        if (!url.pathname.startsWith('/checkout/')) {
            return originalFetch(input, init);
        }

        const data = init?.body ? JSON.parse(String(init.body)) : {};

        if (url.pathname === '/checkout/place-order') {
            probe.orderRequests++;
            probe.payloads.push(data);
            await new Promise<void>((resolve) => {
                probe.releaseOrder = resolve;
            });

            return Response.json(
                {
                    errors: {
                        payment_method: ['Periksa metode pembayaran.'],
                        order_id: ['42'],
                    },
                },
                { status: 422 },
            );
        }

        if (url.pathname === '/checkout/shipping-rates') {
            selectedRate = false;

            return Response.json({ rates: [rate], summary: summary() });
        }

        if (url.pathname === '/checkout/shipping-rate') {
            selectedRate = true;

            return Response.json({ rate, summary: summary() });
        }

        if (url.pathname === '/checkout/voucher') {
            voucher = init?.method !== 'DELETE';

            return Response.json({
                voucher: voucher
                    ? { code: 'COFFEE10', name: 'Coffee', discount: 10000 }
                    : null,
                summary: summary(),
            });
        }

        throw new Error('Unexpected fixture request');
    };
    const address = {
        id: 1,
        label: 'Rumah',
        recipient_name: 'Test Customer',
        recipient_phone: '081234567890',
        province: 'Jawa Timur',
        city: 'Blitar',
        district: 'Test',
        subdistrict: null,
        postal_code: '66111',
        biteship_area_id: null,
        latitude: null,
        longitude: null,
        full_address: 'Synthetic Address',
        note: null,
        is_default: true,
    };
    const props: ComponentProps<typeof Checkout> = {
        paymentMethods: [
            {
                id: 'bca_va',
                name: 'BCA Virtual Account',
                logo: '/images/payments/bca_va.png',
            },
            {
                id: 'bni_va',
                name: 'BNI Virtual Account',
                logo: '/images/payments/bni_va.png',
            },
            {
                id: 'bri_va',
                name: 'BRI Virtual Account',
                logo: '/images/payments/bri_va.png',
            },
            {
                id: 'echannel',
                name: 'Mandiri Bill Payment',
                logo: '/images/payments/echannel.png',
            },
            {
                id: 'permata_va',
                name: 'Permata Virtual Account',
                logo: '/images/payments/permata_va.png',
            },
            {
                id: 'other_qris',
                name: 'QRIS',
                logo: '/images/payments/other_qris.png',
            },
            { id: 'gopay', name: 'GoPay', logo: '/images/payments/gopay.webp' },
            {
                id: 'shopeepay',
                name: 'ShopeePay',
                logo: '/images/payments/shopeepay.png',
            },
        ],
        addresses: [
            address,
            { ...address, id: 2, label: 'Kantor', is_default: false },
        ],
        appliedVoucher: null,
        cartItems: [
            {
                id: 1,
                title: 'Deklase Coffee',
                sku: 'TEST-COFFEE',
                variant_sku: 'TEST-250',
                net_weight: '250g',
                grind_type: 'whole_bean',
                image: '/products/mockup-ladies.jpg',
                price: 90000,
                quantity: 1,
                weight: 300,
                available_stock: 10,
                subtotal: 90000,
                is_available: true,
            },
        ],
        defaultAddressId: 1,
        selectedShippingRate: rate,
        storeLocation: { latitude: null, longitude: null },
        summary: summary(),
    };
    await createInertiaApp({
        page: {
            component: 'customer/checkout/checkout',
            props: {
                ...props,
                auth: { user: { id: 1, name: 'Test Customer' } },
            },
            url: '/checkout',
            version: 'fixture',
            clearHistory: false,
            encryptHistory: false,
        },
        resolve: () => Checkout,
        setup: ({ el, App, props: appProps }) =>
            createRoot(el).render(<App {...appProps} />),
    });
}
