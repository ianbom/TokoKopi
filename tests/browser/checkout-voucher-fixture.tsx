import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
    CheckoutProvider,
    useCheckout,
} from '../../resources/js/contexts/checkout-context';
import type { ShippingRate } from '../../resources/js/contexts/checkout-context';

function Probe() {
    const checkout = useCheckout();
    const { loadShippingRates } = checkout;
    const initialRatesRequested = useRef(false);

    useEffect(() => {
        if (!initialRatesRequested.current) {
            initialRatesRequested.current = true;
            void loadShippingRates(1, { preserveSelectedRate: true });
        }
    }, [loadShippingRates]);

    return (
        <>
            <button onClick={() => void checkout.applyVoucher('KOPI10')}>
                Apply
            </button>
            <button onClick={() => void checkout.removeVoucher()}>
                Remove
            </button>
            <button
                onClick={() =>
                    void checkout.selectShippingRate(checkout.shippingRates[0])
                }
            >
                Select
            </button>
            <button onClick={() => void checkout.placeOrder('', true)}>
                Order
            </button>
            <pre id="state">
                {JSON.stringify({
                    voucher: checkout.appliedVoucher,
                    rate: checkout.selectedShippingRate,
                    rates: checkout.shippingRates,
                    summary: checkout.summary,
                    errors: checkout.errors,
                    loading:
                        checkout.shippingRatesLoading ||
                        checkout.voucherUpdating,
                })}
            </pre>
        </>
    );
}

export function mount(rate: ShippingRate | null) {
    createRoot(document.getElementById('root')!).render(
        <CheckoutProvider
            addresses={[]}
            appliedVoucher={null}
            cartItems={[]}
            defaultAddressId={1}
            selectedShippingRate={rate}
            storeLocation={{ latitude: null, longitude: null }}
            summary={{
                item_count: 1,
                subtotal: 90000,
                shipping: rate?.price ?? 0,
                discount: 0,
                service_fee: 0,
                total: 90000 + (rate?.price ?? 0),
            }}
        >
            <Probe />
        </CheckoutProvider>,
    );
}
