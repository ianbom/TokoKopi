import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import {
    placeOrder as placeOrderRoute,
    shippingRate,
    shippingRates,
} from '@/routes/checkout';
import {
    apply as applyVoucherRoute,
    remove as removeVoucherRoute,
} from '@/routes/checkout/voucher';

export type CheckoutItem = {
    id: number;
    title: string;
    sku: string | null;
    variant_sku: string | null;
    net_weight: string | null;
    grind_type: string | null;
    image: string | null;
    price: number;
    quantity: number;
    weight: number;
    available_stock: number;
    subtotal: number;
    is_available: boolean;
};

export type CheckoutAddress = {
    id: number;
    label: string | null;
    recipient_name: string;
    recipient_phone: string;
    province: string;
    city: string;
    district: string;
    subdistrict: string | null;
    postal_code: string;
    biteship_area_id: string | null;
    latitude: string | null;
    longitude: string | null;
    full_address: string;
    note: string | null;
    is_default: boolean;
};

export type ShippingRate = {
    id: string;
    courier_company: string;
    courier_type: string;
    courier_service_name: string | null;
    description: string | null;
    duration: string | null;
    price: number;
};

export type Voucher = {
    code: string;
    name: string;
    discount: number;
} | null;

export type CheckoutSummary = {
    item_count: number;
    subtotal: number;
    shipping: number;
    discount: number;
    service_fee: number;
    total: number;
};

export type CheckoutStoreLocation = {
    latitude: string | null;
    longitude: string | null;
};

type CheckoutContextValue = {
    addresses: CheckoutAddress[];
    appliedVoucher: Voucher;
    applyVoucher: (code: string) => Promise<void>;
    cartItems: CheckoutItem[];
    errors: Record<string, string>;
    loadShippingRates: (
        addressId: number,
        options?: { preserveSelectedRate?: boolean },
    ) => Promise<void>;
    placeOrder: (notes: string, agreed: boolean) => Promise<string | null>;
    placingOrder: boolean;
    removeVoucher: () => Promise<void>;
    selectAddress: (addressId: number) => Promise<void>;
    selectShippingRate: (rate: ShippingRate) => Promise<void>;
    selectedAddressId: number | null;
    selectedShippingRate: ShippingRate | null;
    shippingRates: ShippingRate[];
    shippingRatesLoading: boolean;
    storeLocation: CheckoutStoreLocation;
    summary: CheckoutSummary;
    voucherUpdating: boolean;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);
const checkoutStockAlertKey = 'checkout.stock_alert';

function checkoutIdempotencyKey() {
    const storageKey = 'checkout.idempotency_key';
    const existing = window.sessionStorage.getItem(storageKey);

    if (existing) {
        return existing;
    }

    const generated =
        window.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(storageKey, generated);

    return generated;
}

function csrfHeaders() {
    const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'X-XSRF-TOKEN': decodeURIComponent(token) } : {}),
    };
}

async function jsonRequest(
    url: string,
    method: string,
    body?: Record<string, unknown>,
) {
    const response = await fetch(url, {
        method,
        headers: csrfHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const errors = payload.errors ?? {
            checkout: payload.message ?? 'Request failed.',
        };

        throw errors;
    }

    return payload;
}

export function CheckoutProvider({
    addresses,
    appliedVoucher,
    cartItems,
    children,
    defaultAddressId,
    selectedShippingRate,
    storeLocation,
    summary,
}: {
    addresses: CheckoutAddress[];
    appliedVoucher: Voucher;
    cartItems: CheckoutItem[];
    children: ReactNode;
    defaultAddressId: number | null;
    selectedShippingRate: ShippingRate | null;
    storeLocation: CheckoutStoreLocation;
    summary: CheckoutSummary;
}) {
    const [currentAddressId, setCurrentAddressId] = useState<number | null>(
        defaultAddressId,
    );
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [currentRate, setCurrentRate] = useState<ShippingRate | null>(
        selectedShippingRate,
    );
    const [currentVoucher, setCurrentVoucher] =
        useState<Voucher>(appliedVoucher);
    const [currentSummary, setCurrentSummary] = useState(summary);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shippingRatesLoading, setShippingRatesLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [voucherUpdating, setVoucherUpdating] = useState(false);
    const shippingRequestInProgress = useRef(false);
    const voucherRequestInProgress = useRef(false);
    const [idempotencyKey] = useState(checkoutIdempotencyKey);

    const updateShippingSummary = useCallback((price = 0) => {
        setCurrentSummary((current) => ({
            ...current,
            shipping: price,
            total: Math.max(
                0,
                current.subtotal +
                    price +
                    current.service_fee -
                    current.discount,
            ),
        }));
    }, []);

    const loadShippingRates = useCallback(
        async (
            addressId: number,
            options: { preserveSelectedRate?: boolean } = {},
        ) => {
            if (shippingRequestInProgress.current) {
                return;
            }

            shippingRequestInProgress.current = true;
            const preserveSelectedRate = options.preserveSelectedRate ?? false;

            setErrors({});
            setCurrentAddressId(addressId);

            if (!preserveSelectedRate) {
                setCurrentRate(null);
                updateShippingSummary();
            }

            setShippingRatesLoading(true);

            try {
                const payload = await jsonRequest(shippingRates.url(), 'POST', {
                    customer_address_id: addressId,
                });
                const nextRates: ShippingRate[] = payload.rates ?? [];

                setRates(nextRates);

                if (preserveSelectedRate) {
                    const preservedRate = currentRate
                        ? nextRates.find(
                              (rate) =>
                                  (
                                      [
                                          'courier_company',
                                          'courier_type',
                                          'courier_service_name',
                                          'duration',
                                      ] as const
                                  ).every(
                                      (key) =>
                                          String(rate[key] ?? '') ===
                                          String(currentRate[key] ?? ''),
                                  ) &&
                                  Number(rate.price) ===
                                      Number(currentRate.price),
                          )
                        : null;

                    if (preservedRate) {
                        await jsonRequest(shippingRate.url(), 'POST', {
                            shipping_rate_id: preservedRate.id,
                        });
                        setCurrentRate(preservedRate);
                        updateShippingSummary(preservedRate.price);
                    } else {
                        setCurrentRate(null);
                        updateShippingSummary();

                        if (currentRate) {
                            setErrors({
                                shipping_rate_id:
                                    'Ongkir berubah. Pilih ulang ongkir.',
                            });
                        }
                    }
                }
            } catch (error) {
                setRates([]);
                setErrors(error as Record<string, string>);
                setCurrentRate(null);
                updateShippingSummary();
            } finally {
                shippingRequestInProgress.current = false;
                setShippingRatesLoading(false);
            }
        },
        [currentRate, updateShippingSummary],
    );

    const selectAddress = useCallback(
        async (addressId: number) => {
            if (voucherRequestInProgress.current || placingOrder) {
                return;
            }

            await loadShippingRates(addressId);
        },
        [loadShippingRates, placingOrder],
    );

    const selectShippingRate = useCallback(
        async (rate: ShippingRate) => {
            if (
                shippingRequestInProgress.current ||
                voucherRequestInProgress.current ||
                placingOrder
            ) {
                return;
            }

            shippingRequestInProgress.current = true;
            setShippingRatesLoading(true);
            setErrors({});

            try {
                await jsonRequest(shippingRate.url(), 'POST', {
                    shipping_rate_id: rate.id,
                });
                setCurrentRate(rate);
                updateShippingSummary(rate.price);
            } catch (error) {
                setErrors(error as Record<string, string>);
                setCurrentRate(null);
                updateShippingSummary();
            } finally {
                shippingRequestInProgress.current = false;
                setShippingRatesLoading(false);
            }
        },
        [placingOrder, updateShippingSummary],
    );

    const updateVoucher = useCallback(
        async (code?: string) => {
            if (
                voucherRequestInProgress.current ||
                shippingRequestInProgress.current ||
                placingOrder
            ) {
                return;
            }

            voucherRequestInProgress.current = true;
            setVoucherUpdating(true);
            setErrors({});

            try {
                const payload =
                    code === undefined
                        ? await jsonRequest(removeVoucherRoute.url(), 'DELETE')
                        : await jsonRequest(applyVoucherRoute.url(), 'POST', {
                              voucher_code: code,
                          });
                setCurrentVoucher(payload.voucher);
                setCurrentSummary(payload.summary);

                if (currentAddressId) {
                    await loadShippingRates(currentAddressId, {
                        preserveSelectedRate: true,
                    });
                } else {
                    setCurrentRate(null);
                    setRates([]);
                }
            } catch (error) {
                setErrors(error as Record<string, string>);
            } finally {
                voucherRequestInProgress.current = false;
                setVoucherUpdating(false);
            }
        },
        [currentAddressId, loadShippingRates, placingOrder],
    );

    const applyVoucher = useCallback(
        (code: string) => updateVoucher(code),
        [updateVoucher],
    );
    const removeVoucher = useCallback(() => updateVoucher(), [updateVoucher]);

    const placeOrder = useCallback(
        async (notes: string, agreed: boolean) => {
            if (
                placingOrder ||
                shippingRequestInProgress.current ||
                voucherRequestInProgress.current
            ) {
                return null;
            }

            if (!currentAddressId || !currentRate) {
                setErrors({
                    checkout: 'Pilih alamat dan ongkir terlebih dahulu.',
                });

                return null;
            }

            setPlacingOrder(true);
            setErrors({});

            try {
                const payload = await jsonRequest(
                    placeOrderRoute.url(),
                    'POST',
                    {
                        customer_address_id: currentAddressId,
                        shipping_rate_id: currentRate.id,
                        idempotency_key: idempotencyKey,
                        voucher_code: currentVoucher?.code ?? null,
                        notes,
                        no_return_refund_agreed: agreed,
                    },
                );

                window.sessionStorage.removeItem('checkout.idempotency_key');

                return payload.redirect_url ?? null;
            } catch (error) {
                const errors = error as Record<string, string>;
                setErrors(errors);

                if (errors.cart) {
                    window.sessionStorage.setItem(
                        checkoutStockAlertKey,
                        errors.cart,
                    );
                    window.location.reload();
                }

                return null;
            } finally {
                setPlacingOrder(false);
            }
        },
        [
            currentAddressId,
            currentRate,
            currentVoucher,
            idempotencyKey,
            placingOrder,
        ],
    );

    const value = useMemo<CheckoutContextValue>(
        () => ({
            addresses,
            appliedVoucher: currentVoucher,
            applyVoucher,
            cartItems,
            errors,
            loadShippingRates,
            placeOrder,
            placingOrder,
            removeVoucher,
            selectAddress,
            selectShippingRate,
            selectedAddressId: currentAddressId,
            selectedShippingRate: currentRate,
            shippingRates: rates,
            shippingRatesLoading,
            storeLocation,
            summary: currentSummary,
            voucherUpdating,
        }),
        [
            addresses,
            applyVoucher,
            cartItems,
            currentAddressId,
            currentRate,
            currentSummary,
            currentVoucher,
            errors,
            loadShippingRates,
            placeOrder,
            placingOrder,
            rates,
            removeVoucher,
            selectAddress,
            selectShippingRate,
            shippingRatesLoading,
            storeLocation,
            voucherUpdating,
        ],
    );

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);

    if (!context) {
        throw new Error('useCheckout must be used inside CheckoutProvider');
    }

    return context;
}
