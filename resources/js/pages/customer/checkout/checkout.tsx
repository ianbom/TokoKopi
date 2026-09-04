import { Head, Link } from '@inertiajs/react';
import type { Icon, LatLngBoundsExpression, Map as LeafletMap } from 'leaflet';
import { Lock, MapPinned, ShieldCheck, Ticket, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type * as ReactLeaflet from 'react-leaflet';
import { toast } from 'sonner';
import { CheckoutProvider, useCheckout } from '@/contexts/checkout-context';
import type {
    CheckoutAddress,
    CheckoutItem,
    CheckoutStoreLocation,
    CheckoutSummary,
    ShippingRate,
    Voucher,
} from '@/contexts/checkout-context';
import ShopLayout from '@/layouts/shop-layout';
import { cart, home, list, manageAddress } from '@/routes';

type Props = {
    addresses: CheckoutAddress[];
    appliedVoucher: Voucher;
    cartItems: CheckoutItem[];
    defaultAddressId: number | null;
    selectedShippingRate: ShippingRate | null;
    storeLocation: CheckoutStoreLocation;
    summary: CheckoutSummary;
};

type ReactLeafletModules = {
    MapContainer: typeof ReactLeaflet.MapContainer;
    Marker: typeof ReactLeaflet.Marker;
    Polyline: typeof ReactLeaflet.Polyline;
    Popup: typeof ReactLeaflet.Popup;
    TileLayer: typeof ReactLeaflet.TileLayer;
    useMap: typeof ReactLeaflet.useMap;
};

type Coordinates = [number, number];

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(price)
        .replace('Rp', 'Rp ');

const formatWeight = (grams: number) => {
    if (grams >= 1000) {
        return `${new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        }).format(grams / 1000)} kg`;
    }

    return `${new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(grams)} gram`;
};

const formatDistance = (meters: number) =>
    meters >= 1000
        ? `${new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        }).format(meters / 1000)} km`
        : `${new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 0,
        }).format(meters)} m`;

const checkoutStockAlertKey = 'checkout.stock_alert';

const stockIssueMessage = (item: CheckoutItem) => {
    if (item.available_stock <= 0) {
        return 'Produk sudah habis. Tidak bisa checkout.';
    }

    if (item.available_stock < item.quantity) {
        return `Stok tidak mencukupi. Tersedia ${item.available_stock}, di keranjang ${item.quantity}.`;
    }

    return 'Produk tidak tersedia. Tidak bisa checkout.';
};

const validCoordinates = (latitude: number, longitude: number): boolean =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

const coordinatesFrom = (
    location: Pick<
        CheckoutAddress | CheckoutStoreLocation,
        'latitude' | 'longitude'
    >,
): Coordinates | null => {
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    return validCoordinates(latitude, longitude) ? [latitude, longitude] : null;
};

const distanceMeters = (from: Coordinates, to: Coordinates) => {
    const earthRadiusMeters = 6371000;
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const latitudeDelta = toRadians(to[0] - from[0]);
    const longitudeDelta = toRadians(to[1] - from[1]);
    const fromLatitude = toRadians(from[0]);
    const toLatitude = toRadians(to[0]);
    const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(fromLatitude) *
        Math.cos(toLatitude) *
        Math.sin(longitudeDelta / 2) ** 2;

    return Math.round(
        earthRadiusMeters *
        2 *
        Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)),
    );
};

const googleMapsDirectionsUrl = (from: Coordinates, to: Coordinates) => {
    const origin = `${from[0]},${from[1]}`;
    const destination = `${to[0]},${to[1]}`;
    const params = new URLSearchParams({
        api: '1',
        origin,
        destination,
        travelmode: 'driving',
    });

    return `https://www.google.com/maps/dir/?${params.toString()}`;
};

export default function Checkout(props: Props) {
    return (
        <CheckoutProvider {...props}>
            <CheckoutScreen />
        </CheckoutProvider>
    );
}

function CheckoutScreen() {
    const {
        addresses,
        appliedVoucher,
        applyVoucher,
        cartItems,
        errors,
        loadShippingRates,
        placeOrder,
        placingOrder,
        removeVoucher,
        selectAddress,
        selectShippingRate,
        selectedAddressId,
        selectedShippingRate,
        shippingRates,
        shippingRatesLoading,
        storeLocation,
        summary,
    } = useCheckout();
    const [voucherCode, setVoucherCode] = useState(appliedVoucher?.code ?? '');
    const [notes, setNotes] = useState('');
    const [agreed, setAgreed] = useState(false);
    const totalWeight = cartItems.reduce(
        (total, item) => total + item.weight,
        0,
    );
    const selectedAddress =
        addresses.find((address) => address.id === selectedAddressId) ?? null;
    const storeCoordinates = coordinatesFrom(storeLocation);
    const destinationCoordinates = selectedAddress
        ? coordinatesFrom(selectedAddress)
        : null;
    const routeDistance =
        storeCoordinates && destinationCoordinates
            ? distanceMeters(storeCoordinates, destinationCoordinates)
            : null;
    const unavailableItems = cartItems.filter((item) => !item.is_available);
    const hasUnavailableItems = unavailableItems.length > 0;

    useEffect(() => {
        if (selectedAddressId && shippingRates.length === 0) {
            void loadShippingRates(selectedAddressId, {
                preserveSelectedRate: true,
            });
        }
    }, [loadShippingRates, selectedAddressId, shippingRates.length]);

    useEffect(() => {
        const message = window.sessionStorage.getItem(checkoutStockAlertKey);

        if (!message) {
            return;
        }

        window.sessionStorage.removeItem(checkoutStockAlertKey);
        toast.error(message);
    }, []);

    const submitOrder = async () => {
        if (hasUnavailableItems) {
            window.sessionStorage.setItem(
                checkoutStockAlertKey,
                'Produk sudah habis atau stok tidak mencukupi. Perbarui keranjang sebelum membayar.',
            );
            window.location.reload();

            return;
        }

        const redirectUrl = await placeOrder(notes, agreed);

        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };

    return (
        <ShopLayout>
            <Head title="Checkout Deklasee Coffee" />

            <main className="min-h-screen bg-canvas">
                <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
                    <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.08em] text-muted-soft uppercase">
                        <Link
                            href={home.url()}
                            className="transition-colors hover:text-primary"
                        >
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link
                            href={cart.url()}
                            className="transition-colors hover:text-primary"
                        >
                            Keranjang
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-ink">Checkout</span>
                    </div>

                    <div className="mt-6 border border-hairline bg-sand p-7 sm:p-10 lg:p-14">
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-[0.12em] text-body uppercase">
                                Secure checkout
                            </p>
                            <h1 className="mt-4 font-condensed text-[clamp(56px,7vw,108px)] leading-[0.81] font-semibold tracking-[-0.055em] text-ink uppercase">
                                Checkout
                            </h1>
                            <p className="mt-5 max-w-xl text-sm leading-5 text-body">
                                Pilih alamat tersimpan, ongkir Biteship,
                                voucher, lalu bayar via Midtrans.
                            </p>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="border border-hairline bg-surface-soft p-10 text-center">
                            <p className="mb-4 font-condensed text-4xl leading-none font-semibold tracking-[-0.04em] text-ink uppercase">
                                Keranjang kosong
                            </p>
                            <Link
                                href={list.url()}
                                className="text-xs font-medium tracking-[0.08em] text-primary uppercase underline"
                            >
                                Belanja dulu
                            </Link>
                        </div>
                    ) : (
                        <div className="grid min-w-0 border-x border-b border-hairline lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
                            <div className="min-w-0 divide-y divide-hairline">
                                <section className="p-6 sm:p-8 lg:p-10">
                                    <div className="mb-5 flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase">
                                                Alamat Pengiriman
                                            </h2>
                                        </div>
                                        <Link
                                            href={manageAddress.url({
                                                query: {
                                                    redirect_to: '/checkout',
                                                },
                                            })}
                                            className="text-[10px] font-medium tracking-[0.1em] text-primary uppercase hover:text-primary-hover"
                                        >
                                            Kelola alamat
                                        </Link>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {addresses.map((address) => (
                                            <button
                                                key={address.id}
                                                type="button"
                                                onClick={() =>
                                                    void selectAddress(
                                                        address.id,
                                                    )
                                                }
                                                className={`border p-4 text-left transition-colors ${selectedAddressId === address.id ? 'border-primary bg-primary-soft' : 'border-hairline bg-canvas hover:border-ink'}`}
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-3">
                                                    <p className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
                                                        {address.label ??
                                                            'Alamat'}
                                                    </p>
                                                    {address.is_default && (
                                                        <span className="bg-primary px-2 py-1 text-[9px] font-medium tracking-[0.08em] text-canvas uppercase">
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[12px] font-medium text-ink">
                                                    {address.recipient_name}
                                                </p>
                                                <p className="mt-1 text-[11px] text-muted-soft">
                                                    {address.recipient_phone}
                                                </p>
                                                <p className="mt-2 text-[12px] leading-relaxed text-body">
                                                    {address.full_address}
                                                </p>
                                                {(!address.postal_code ||
                                                    !address.latitude ||
                                                    !address.longitude) && (
                                                        <p className="mt-2 text-[11px] font-semibold text-error">
                                                            Lengkapi kode pos dan
                                                            koordinat di buku
                                                            alamat.
                                                        </p>
                                                    )}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-6 sm:p-8 lg:p-10">
                                    <div className="mb-5 flex items-center gap-2">
                                        <Truck
                                            size={18}
                                            className="text-primary"
                                            strokeWidth={1.5}
                                        />
                                        <h2 className="font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase">
                                            Ongkir
                                        </h2>
                                    </div>
                                    {errors.shipping && (
                                        <p className="mb-3 text-[12px] font-semibold text-error">
                                            {errors.shipping}
                                        </p>
                                    )}
                                    {errors.customer_address_id && (
                                        <p className="mb-3 text-[12px] font-semibold text-error">
                                            {errors.customer_address_id}
                                        </p>
                                    )}
                                    {shippingRatesLoading ? (
                                        <div className="border border-dashed border-hairline bg-surface-soft p-6 text-[12px] font-medium text-muted-soft">
                                            Memuat harga ongkir...
                                        </div>
                                    ) : shippingRates.length === 0 ? (
                                        <div className="border border-dashed border-hairline bg-surface-soft p-6 text-[12px] font-medium text-muted-soft">
                                            Pilih alamat dengan kode pos dan
                                            koordinat untuk melihat harga
                                            ongkir.
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {shippingRates.map((rate) => (
                                                <button
                                                    key={rate.id}
                                                    type="button"
                                                    onClick={() =>
                                                        void selectShippingRate(
                                                            rate,
                                                        )
                                                    }
                                                    className={`border p-4 text-left transition-colors ${selectedShippingRate?.id === rate.id ? 'border-primary bg-primary-soft' : 'border-hairline bg-canvas hover:border-ink'}`}
                                                >
                                                    <p className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
                                                        {rate.courier_company.toUpperCase()}{' '}
                                                        {rate.courier_type}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-muted-soft">
                                                        {rate.courier_service_name ??
                                                            rate.description ??
                                                            'Layanan pengiriman'}{' '}
                                                        · {rate.duration ?? '-'}
                                                    </p>
                                                    <p className="mt-3 text-sm font-semibold text-primary">
                                                        {formatPrice(
                                                            rate.price,
                                                        )}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section className="p-6 sm:p-8 lg:p-10">
                                    <div className="mb-5 flex items-center gap-2">
                                        <Ticket
                                            size={18}
                                            className="text-primary"
                                            strokeWidth={1.5}
                                        />
                                        <h2 className="font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase">
                                            Voucher
                                        </h2>
                                    </div>
                                    <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
                                        <input
                                            value={voucherCode}
                                            onChange={(event) =>
                                                setVoucherCode(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Masukkan kode voucher"
                                            className="h-12 min-w-[180px] flex-1 border border-hairline bg-canvas px-4 text-[13px] text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void applyVoucher(voucherCode)
                                            }
                                            className="h-12 bg-primary px-6 text-[11px] font-semibold tracking-[0.08em] text-canvas uppercase hover:bg-primary-hover active:bg-primary-active"
                                        >
                                            Pakai
                                        </button>
                                        {appliedVoucher && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void removeVoucher()
                                                }
                                                className="h-12 border border-ink px-4 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase hover:bg-ink hover:text-canvas"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                    {appliedVoucher && (
                                        <p className="mt-2 text-[12px] font-semibold text-primary">
                                            {appliedVoucher.name}: -
                                            {formatPrice(
                                                appliedVoucher.discount,
                                            )}
                                        </p>
                                    )}
                                    {errors.voucher_code && (
                                        <p className="mt-2 text-[12px] font-semibold text-error">
                                            {errors.voucher_code}
                                        </p>
                                    )}
                                </section>

                                <section className="p-6 sm:p-8 lg:p-10">
                                    <h2 className="mb-4 font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase">
                                        Catatan Order
                                    </h2>
                                    <textarea
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                        maxLength={2000}
                                        placeholder="Opsional"
                                        className="h-28 w-full resize-none border border-hairline bg-canvas px-4 py-3 text-[13px] text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
                                    />
                                    <label className="mt-4 flex items-start gap-3 text-[12px] leading-5 text-body">
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={(event) =>
                                                setAgreed(event.target.checked)
                                            }
                                            className="mt-0.5 h-4 w-4 border-ink text-primary focus:ring-primary"
                                        />
                                        <span>
                                            Saya menyetujui kebijakan tanpa
                                            retur/refund, Syarat & Ketentuan,
                                            dan Kebijakan Privasi.
                                        </span>
                                    </label>
                                    {errors.no_return_refund_agreed && (
                                        <p className="mt-2 text-[12px] font-semibold text-error">
                                            {errors.no_return_refund_agreed}
                                        </p>
                                    )}
                                    {errors.checkout && (
                                        <p className="mt-2 text-[12px] font-semibold text-error">
                                            {errors.checkout}
                                        </p>
                                    )}
                                </section>
                            </div>

                            <aside className="w-full min-w-0">
                                <div className="sticky top-24 lg:top-32">
                                    <h2 className="mb-6 font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase">
                                        Ringkasan Pesanan
                                    </h2>
                                    <div className="mb-6 max-h-[340px] space-y-4 overflow-y-auto border-b border-hairline pr-2 pb-5">
                                        {cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-3"
                                            >
                                                <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-hairline bg-surface-soft">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                    )}
                                                    <span className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] font-semibold text-canvas">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-serif text-base leading-4 text-ink">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-muted-soft">
                                                        {[
                                                            item.net_weight,
                                                            item.grind_type?.replaceAll(
                                                                '_',
                                                                ' ',
                                                            ),
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' / ') || '-'}
                                                    </p>
                                                    <p className="mt-1 text-[11px] font-medium text-muted-soft">
                                                        Berat:{' '}
                                                        {formatWeight(
                                                            item.weight,
                                                        )}
                                                    </p>
                                                    {!item.is_available && (
                                                        <p className="mt-1 text-[10px] font-semibold text-error">
                                                            {stockIssueMessage(
                                                                item,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="max-w-[98px] shrink-0 text-right text-[12px] font-semibold break-words text-ink tabular-nums md:max-w-[112px]">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <SummaryRow
                                        label="Subtotal"
                                        value={summary.subtotal}
                                    />
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-soft">
                                        <span>Total Berat</span>
                                        <span className="text-right font-black break-words tabular-nums">
                                            {formatWeight(totalWeight)}
                                        </span>
                                    </div>
                                    <SummaryRow
                                        label="Ongkir"
                                        value={summary.shipping}
                                    />
                                    <SummaryRow
                                        label="Biaya Layanan"
                                        value={summary.service_fee}
                                    />
                                    <SummaryRow
                                        label="Diskon"
                                        value={-summary.discount}
                                        danger
                                    />
                                    {hasUnavailableItems && (
                                        <div className="mt-4 border border-error bg-primary-soft px-4 py-3 text-[12px] font-semibold text-error">
                                            Ada item yang stoknya tidak
                                            tersedia. Perbarui keranjang sebelum
                                            checkout.
                                        </div>
                                    )}
                                    <div className="mt-5 border-t border-ink pt-5">
                                        <div className="flex flex-wrap items-end justify-between gap-2">
                                            <span className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
                                                Total Pembayaran
                                            </span>
                                            <span className="text-right font-condensed text-3xl font-semibold tracking-[-0.03em] text-ink tabular-nums">
                                                {formatPrice(summary.total)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void submitOrder()}
                                        disabled={
                                            placingOrder ||
                                            !selectedShippingRate ||
                                            !agreed
                                        }
                                        className="mt-6 flex h-14 w-full items-center justify-center bg-primary text-[11px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:bg-oat disabled:text-muted-soft"
                                    >
                                        <Lock size={16} className="mr-2" />
                                        {placingOrder
                                            ? 'Membuat Pembayaran...'
                                            : 'Bayar dengan Midtrans'}
                                    </button>
                                    <div className="mt-8 space-y-4 border-t border-hairline pt-6">
                                        <CheckoutRouteMap
                                            destinationAddress={selectedAddress}
                                            destinationCoordinates={
                                                destinationCoordinates
                                            }
                                            distance={routeDistance}
                                            storeCoordinates={storeCoordinates}
                                        />
                                        <div className="border border-hairline bg-surface-soft p-4">
                                            <div className="flex items-start gap-3 text-[12px] font-medium text-ink">
                                                <ShieldCheck
                                                    size={16}
                                                    className="mt-0.5 shrink-0 text-primary"
                                                    strokeWidth={1.5}
                                                />
                                                <p>
                                                    Pembayaran aman didukung
                                                    Midtrans
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border border-hairline bg-surface-soft p-4">
                                            <div className="flex items-start gap-3 text-[12px] font-medium text-ink">
                                                <Truck
                                                    size={16}
                                                    className="mt-0.5 shrink-0 text-primary"
                                                    strokeWidth={1.5}
                                                />
                                                <p>
                                                    Ongkir dihitung oleh
                                                    Biteship
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </ShopLayout>
    );
}

function CheckoutRouteMap({
    destinationAddress,
    destinationCoordinates,
    distance,
    storeCoordinates,
}: {
    destinationAddress: CheckoutAddress | null;
    destinationCoordinates: Coordinates | null;
    distance: number | null;
    storeCoordinates: Coordinates | null;
}) {
    const [leafletModules, setLeafletModules] =
        useState<ReactLeafletModules | null>(null);
    const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
    const canShowRoute = Boolean(
        storeCoordinates && destinationCoordinates && distance !== null,
    );
    const googleMapsUrl =
        storeCoordinates && destinationCoordinates
            ? googleMapsDirectionsUrl(storeCoordinates, destinationCoordinates)
            : null;

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            import('leaflet'),
            import('leaflet/dist/leaflet.css'),
            import('react-leaflet'),
        ]).then(([leaflet, , reactLeaflet]) => {
            if (!isMounted) {
                return;
            }

            setMarkerIcon(
                leaflet.icon({
                    iconUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            );
            setLeafletModules({
                MapContainer: reactLeaflet.MapContainer,
                Marker: reactLeaflet.Marker,
                Polyline: reactLeaflet.Polyline,
                Popup: reactLeaflet.Popup,
                TileLayer: reactLeaflet.TileLayer,
                useMap: reactLeaflet.useMap,
            });
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="border border-hairline bg-surface-soft p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-ink uppercase">
                        <MapPinned size={15} className="text-primary" />
                        Rute Pengiriman
                    </p>
                </div>
                {distance !== null && (
                    <span className="border border-ink bg-canvas px-2.5 py-1 text-[10px] font-medium text-ink uppercase">
                        {formatDistance(distance)}
                    </span>
                )}
            </div>

            {canShowRoute && leafletModules && markerIcon ? (
                <RouteMap
                    destinationAddress={destinationAddress}
                    destinationCoordinates={
                        destinationCoordinates as Coordinates
                    }
                    markerIcon={markerIcon}
                    modules={leafletModules}
                    storeCoordinates={storeCoordinates as Coordinates}
                />
            ) : (
                <div className="flex h-[220px] items-center justify-center border border-dashed border-hairline bg-canvas px-5 text-center text-[11px] text-muted-soft">
                    {!storeCoordinates
                        ? 'Koordinat toko belum dikonfigurasi.'
                        : !destinationCoordinates
                            ? 'Pilih alamat dengan koordinat untuk melihat rute.'
                            : 'Memuat peta...'}
                </div>
            )}

            {canShowRoute && (
                <div className="mt-3 space-y-3">
                    {googleMapsUrl && (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 w-full items-center justify-center bg-primary px-3 text-[10px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary-hover"
                        >
                            Buka rute di Google Maps
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

function RouteMap({
    destinationAddress,
    destinationCoordinates,
    markerIcon,
    modules,
    storeCoordinates,
}: {
    destinationAddress: CheckoutAddress | null;
    destinationCoordinates: Coordinates;
    markerIcon: Icon;
    modules: ReactLeafletModules;
    storeCoordinates: Coordinates;
}) {
    const { MapContainer, Marker, Polyline, Popup, TileLayer } = modules;
    const bounds: LatLngBoundsExpression = [
        storeCoordinates,
        destinationCoordinates,
    ];

    return (
        <div className="overflow-hidden border border-hairline bg-canvas">
            <MapContainer
                bounds={bounds}
                className="h-[220px] w-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RouteMapUpdater bounds={bounds} modules={modules} />
                <Polyline
                    pathOptions={{ color: 'var(--color-primary)', weight: 4 }}
                    positions={[storeCoordinates, destinationCoordinates]}
                />
                <Marker icon={markerIcon} position={storeCoordinates}>
                    <Popup>Lokasi toko</Popup>
                </Marker>
                <Marker icon={markerIcon} position={destinationCoordinates}>
                    <Popup>
                        {destinationAddress?.label ?? 'Alamat pengiriman'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

function RouteMapUpdater({
    bounds,
    modules,
}: {
    bounds: LatLngBoundsExpression;
    modules: ReactLeafletModules;
}) {
    const map = modules.useMap() as LeafletMap;

    useEffect(() => {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
    }, [bounds, map]);

    return null;
}

function SummaryRow({
    label,
    value,
    danger = false,
}: {
    label: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <div
            className={`mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] ${danger ? 'text-primary' : 'text-muted-soft'}`}
        >
            <span>{label}</span>
            <span className="text-right font-semibold break-words tabular-nums">
                {value < 0 ? '-' : ''}
                {formatPrice(Math.abs(value))}
            </span>
        </div>
    );
}
