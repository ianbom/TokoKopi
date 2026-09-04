import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
import { n as cart, o as home, s as list, u as manageAddress } from "./routes-BtCAeSqc.js";
import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { Head, Link } from "@inertiajs/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Lock, MapPinned, ShieldCheck, Ticket, Truck } from "lucide-react";
import { toast } from "sonner";
//#region resources/js/routes/checkout/voucher/index.ts
/**
* @see \App\Http\Controllers\Customer\CheckoutController::apply
* @see app/Http/Controllers/Customer/CheckoutController.php:52
* @route '/checkout/voucher'
*/
var apply = (options) => ({
	url: apply.url(options),
	method: "post"
});
apply.definition = {
	methods: ["post"],
	url: "/checkout/voucher"
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::apply
* @see app/Http/Controllers/Customer/CheckoutController.php:52
* @route '/checkout/voucher'
*/
apply.url = (options) => {
	return apply.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::apply
* @see app/Http/Controllers/Customer/CheckoutController.php:52
* @route '/checkout/voucher'
*/
apply.post = (options) => ({
	url: apply.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::apply
* @see app/Http/Controllers/Customer/CheckoutController.php:52
* @route '/checkout/voucher'
*/
var applyForm = (options) => ({
	action: apply.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::apply
* @see app/Http/Controllers/Customer/CheckoutController.php:52
* @route '/checkout/voucher'
*/
applyForm.post = (options) => ({
	action: apply.url(options),
	method: "post"
});
apply.form = applyForm;
/**
* @see \App\Http\Controllers\Customer\CheckoutController::remove
* @see app/Http/Controllers/Customer/CheckoutController.php:57
* @route '/checkout/voucher'
*/
var remove = (options) => ({
	url: remove.url(options),
	method: "delete"
});
remove.definition = {
	methods: ["delete"],
	url: "/checkout/voucher"
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::remove
* @see app/Http/Controllers/Customer/CheckoutController.php:57
* @route '/checkout/voucher'
*/
remove.url = (options) => {
	return remove.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::remove
* @see app/Http/Controllers/Customer/CheckoutController.php:57
* @route '/checkout/voucher'
*/
remove.delete = (options) => ({
	url: remove.url(options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::remove
* @see app/Http/Controllers/Customer/CheckoutController.php:57
* @route '/checkout/voucher'
*/
var removeForm = (options) => ({
	action: remove.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::remove
* @see app/Http/Controllers/Customer/CheckoutController.php:57
* @route '/checkout/voucher'
*/
removeForm.delete = (options) => ({
	action: remove.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
remove.form = removeForm;
var voucher = {
	apply: Object.assign(apply, apply),
	remove: Object.assign(remove, remove)
};
//#endregion
//#region resources/js/routes/checkout/index.ts
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRates
* @see app/Http/Controllers/Customer/CheckoutController.php:38
* @route '/checkout/shipping-rates'
*/
var shippingRates = (options) => ({
	url: shippingRates.url(options),
	method: "post"
});
shippingRates.definition = {
	methods: ["post"],
	url: "/checkout/shipping-rates"
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRates
* @see app/Http/Controllers/Customer/CheckoutController.php:38
* @route '/checkout/shipping-rates'
*/
shippingRates.url = (options) => {
	return shippingRates.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRates
* @see app/Http/Controllers/Customer/CheckoutController.php:38
* @route '/checkout/shipping-rates'
*/
shippingRates.post = (options) => ({
	url: shippingRates.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRates
* @see app/Http/Controllers/Customer/CheckoutController.php:38
* @route '/checkout/shipping-rates'
*/
var shippingRatesForm = (options) => ({
	action: shippingRates.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRates
* @see app/Http/Controllers/Customer/CheckoutController.php:38
* @route '/checkout/shipping-rates'
*/
shippingRatesForm.post = (options) => ({
	action: shippingRates.url(options),
	method: "post"
});
shippingRates.form = shippingRatesForm;
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRate
* @see app/Http/Controllers/Customer/CheckoutController.php:45
* @route '/checkout/shipping-rate'
*/
var shippingRate = (options) => ({
	url: shippingRate.url(options),
	method: "post"
});
shippingRate.definition = {
	methods: ["post"],
	url: "/checkout/shipping-rate"
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRate
* @see app/Http/Controllers/Customer/CheckoutController.php:45
* @route '/checkout/shipping-rate'
*/
shippingRate.url = (options) => {
	return shippingRate.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRate
* @see app/Http/Controllers/Customer/CheckoutController.php:45
* @route '/checkout/shipping-rate'
*/
shippingRate.post = (options) => ({
	url: shippingRate.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRate
* @see app/Http/Controllers/Customer/CheckoutController.php:45
* @route '/checkout/shipping-rate'
*/
var shippingRateForm = (options) => ({
	action: shippingRate.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::shippingRate
* @see app/Http/Controllers/Customer/CheckoutController.php:45
* @route '/checkout/shipping-rate'
*/
shippingRateForm.post = (options) => ({
	action: shippingRate.url(options),
	method: "post"
});
shippingRate.form = shippingRateForm;
/**
* @see \App\Http\Controllers\Customer\CheckoutController::placeOrder
* @see app/Http/Controllers/Customer/CheckoutController.php:62
* @route '/checkout/place-order'
*/
var placeOrder = (options) => ({
	url: placeOrder.url(options),
	method: "post"
});
placeOrder.definition = {
	methods: ["post"],
	url: "/checkout/place-order"
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::placeOrder
* @see app/Http/Controllers/Customer/CheckoutController.php:62
* @route '/checkout/place-order'
*/
placeOrder.url = (options) => {
	return placeOrder.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\CheckoutController::placeOrder
* @see app/Http/Controllers/Customer/CheckoutController.php:62
* @route '/checkout/place-order'
*/
placeOrder.post = (options) => ({
	url: placeOrder.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::placeOrder
* @see app/Http/Controllers/Customer/CheckoutController.php:62
* @route '/checkout/place-order'
*/
var placeOrderForm = (options) => ({
	action: placeOrder.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\CheckoutController::placeOrder
* @see app/Http/Controllers/Customer/CheckoutController.php:62
* @route '/checkout/place-order'
*/
placeOrderForm.post = (options) => ({
	action: placeOrder.url(options),
	method: "post"
});
placeOrder.form = placeOrderForm;
Object.assign(shippingRates, shippingRates), Object.assign(shippingRate, shippingRate), Object.assign(voucher, voucher), Object.assign(placeOrder, placeOrder);
//#endregion
//#region resources/js/contexts/checkout-context.tsx
var CheckoutContext = createContext(null);
var checkoutStockAlertKey$1 = "checkout.stock_alert";
function checkoutIdempotencyKey() {
	const storageKey = "checkout.idempotency_key";
	const existing = window.sessionStorage.getItem(storageKey);
	if (existing) return existing;
	const generated = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	window.sessionStorage.setItem(storageKey, generated);
	return generated;
}
function csrfHeaders() {
	const token = document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];
	return {
		Accept: "application/json",
		"Content-Type": "application/json",
		...token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {}
	};
}
async function jsonRequest(url, method, body) {
	const response = await fetch(url, {
		method,
		headers: csrfHeaders(),
		body: body ? JSON.stringify(body) : void 0
	});
	const payload = await response.json().catch(() => ({}));
	if (!response.ok) throw payload.errors ?? { checkout: payload.message ?? "Request failed." };
	return payload;
}
function CheckoutProvider({ addresses, appliedVoucher, cartItems, children, defaultAddressId, selectedShippingRate, storeLocation, summary }) {
	const [currentAddressId, setCurrentAddressId] = useState(defaultAddressId);
	const [rates, setRates] = useState([]);
	const [currentRate, setCurrentRate] = useState(selectedShippingRate);
	const [currentVoucher, setCurrentVoucher] = useState(appliedVoucher);
	const [currentSummary, setCurrentSummary] = useState(summary);
	const [errors, setErrors] = useState({});
	const [shippingRatesLoading, setShippingRatesLoading] = useState(false);
	const [placingOrder, setPlacingOrder] = useState(false);
	const [idempotencyKey] = useState(checkoutIdempotencyKey);
	const resetShippingSummary = useCallback(() => {
		setCurrentSummary((current) => ({
			...current,
			shipping: 0,
			total: Math.max(0, current.subtotal + current.service_fee - current.discount)
		}));
	}, []);
	const loadShippingRates = useCallback(async (addressId, options = {}) => {
		const preserveSelectedRate = options.preserveSelectedRate ?? false;
		setErrors({});
		setCurrentAddressId(addressId);
		if (!preserveSelectedRate) {
			setCurrentRate(null);
			resetShippingSummary();
		}
		setShippingRatesLoading(true);
		try {
			const nextRates = (await jsonRequest(shippingRates.url(), "POST", { customer_address_id: addressId })).rates ?? [];
			setRates(nextRates);
			if (preserveSelectedRate) setCurrentRate((currentRate) => {
				if (!currentRate) return null;
				if (nextRates.some((rate) => rate.id === currentRate.id)) return currentRate;
				resetShippingSummary();
				return null;
			});
		} catch (error) {
			setRates([]);
			setErrors(error);
			if (!preserveSelectedRate) setCurrentRate(null);
		} finally {
			setShippingRatesLoading(false);
		}
	}, [resetShippingSummary]);
	const selectAddress = useCallback(async (addressId) => {
		await loadShippingRates(addressId);
	}, [loadShippingRates]);
	const selectShippingRate = useCallback(async (rate) => {
		setErrors({});
		try {
			await jsonRequest(shippingRate.url(), "POST", { shipping_rate_id: rate.id });
			setCurrentRate(rate);
			setCurrentSummary((current) => ({
				...current,
				shipping: rate.price,
				total: Math.max(0, current.subtotal + rate.price + current.service_fee - current.discount)
			}));
		} catch (error) {
			setErrors(error);
		}
	}, []);
	const applyVoucher = useCallback(async (code) => {
		setErrors({});
		try {
			const payload = await jsonRequest(apply.url(), "POST", { voucher_code: code });
			setCurrentVoucher(payload.voucher);
			setCurrentSummary(payload.summary);
		} catch (error) {
			setErrors(error);
		}
	}, []);
	const removeVoucher = useCallback(async () => {
		setErrors({});
		const payload = await jsonRequest(remove.url(), "DELETE");
		setCurrentVoucher(payload.voucher);
		setCurrentSummary(payload.summary);
	}, []);
	const placeOrder$1 = useCallback(async (notes, agreed) => {
		if (placingOrder) return null;
		if (!currentAddressId || !currentRate) {
			setErrors({ checkout: "Pilih alamat dan ongkir terlebih dahulu." });
			return null;
		}
		setPlacingOrder(true);
		setErrors({});
		try {
			const payload = await jsonRequest(placeOrder.url(), "POST", {
				customer_address_id: currentAddressId,
				shipping_rate_id: currentRate.id,
				idempotency_key: idempotencyKey,
				voucher_code: currentVoucher?.code ?? null,
				notes,
				no_return_refund_agreed: agreed
			});
			window.sessionStorage.removeItem("checkout.idempotency_key");
			return payload.redirect_url ?? null;
		} catch (error) {
			const errors = error;
			setErrors(errors);
			if (errors.cart) {
				window.sessionStorage.setItem(checkoutStockAlertKey$1, errors.cart);
				window.location.reload();
			}
			return null;
		} finally {
			setPlacingOrder(false);
		}
	}, [
		currentAddressId,
		currentRate,
		currentVoucher,
		idempotencyKey,
		placingOrder
	]);
	const value = useMemo(() => ({
		addresses,
		appliedVoucher: currentVoucher,
		applyVoucher,
		cartItems,
		errors,
		loadShippingRates,
		placeOrder: placeOrder$1,
		placingOrder,
		removeVoucher,
		selectAddress,
		selectShippingRate,
		selectedAddressId: currentAddressId,
		selectedShippingRate: currentRate,
		shippingRates: rates,
		shippingRatesLoading,
		storeLocation,
		summary: currentSummary
	}), [
		addresses,
		applyVoucher,
		cartItems,
		currentAddressId,
		currentRate,
		currentSummary,
		currentVoucher,
		errors,
		loadShippingRates,
		placeOrder$1,
		placingOrder,
		rates,
		removeVoucher,
		selectAddress,
		selectShippingRate,
		shippingRatesLoading,
		storeLocation
	]);
	return /* @__PURE__ */ jsx(CheckoutContext.Provider, {
		value,
		children
	});
}
function useCheckout() {
	const context = useContext(CheckoutContext);
	if (!context) throw new Error("useCheckout must be used inside CheckoutProvider");
	return context;
}
//#endregion
//#region resources/js/pages/customer/checkout/checkout.tsx
var formatPrice = (price) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}).format(price).replace("Rp", "Rp ");
var formatWeight = (grams) => {
	if (grams >= 1e3) return `${new Intl.NumberFormat("id-ID", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 0
	}).format(grams / 1e3)} kg`;
	return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(grams)} gram`;
};
var formatDistance = (meters) => meters >= 1e3 ? `${new Intl.NumberFormat("id-ID", {
	maximumFractionDigits: 2,
	minimumFractionDigits: 0
}).format(meters / 1e3)} km` : `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(meters)} m`;
var checkoutStockAlertKey = "checkout.stock_alert";
var stockIssueMessage = (item) => {
	if (item.available_stock <= 0) return "Produk sudah habis. Tidak bisa checkout.";
	if (item.available_stock < item.quantity) return `Stok tidak mencukupi. Tersedia ${item.available_stock}, di keranjang ${item.quantity}.`;
	return "Produk tidak tersedia. Tidak bisa checkout.";
};
var validCoordinates = (latitude, longitude) => Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
var coordinatesFrom = (location) => {
	const latitude = Number(location.latitude);
	const longitude = Number(location.longitude);
	return validCoordinates(latitude, longitude) ? [latitude, longitude] : null;
};
var distanceMeters = (from, to) => {
	const earthRadiusMeters = 6371e3;
	const toRadians = (degrees) => degrees * Math.PI / 180;
	const latitudeDelta = toRadians(to[0] - from[0]);
	const longitudeDelta = toRadians(to[1] - from[1]);
	const fromLatitude = toRadians(from[0]);
	const toLatitude = toRadians(to[0]);
	const haversine = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
	return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
};
var googleMapsDirectionsUrl = (from, to) => {
	const origin = `${from[0]},${from[1]}`;
	const destination = `${to[0]},${to[1]}`;
	return `https://www.google.com/maps/dir/?${new URLSearchParams({
		api: "1",
		origin,
		destination,
		travelmode: "driving"
	}).toString()}`;
};
function Checkout(props) {
	return /* @__PURE__ */ jsx(CheckoutProvider, {
		...props,
		children: /* @__PURE__ */ jsx(CheckoutScreen, {})
	});
}
function CheckoutScreen() {
	const { addresses, appliedVoucher, applyVoucher, cartItems, errors, loadShippingRates, placeOrder, placingOrder, removeVoucher, selectAddress, selectShippingRate, selectedAddressId, selectedShippingRate, shippingRates, shippingRatesLoading, storeLocation, summary } = useCheckout();
	const [voucherCode, setVoucherCode] = useState(appliedVoucher?.code ?? "");
	const [notes, setNotes] = useState("");
	const [agreed, setAgreed] = useState(false);
	const totalWeight = cartItems.reduce((total, item) => total + item.weight, 0);
	const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
	const storeCoordinates = coordinatesFrom(storeLocation);
	const destinationCoordinates = selectedAddress ? coordinatesFrom(selectedAddress) : null;
	const routeDistance = storeCoordinates && destinationCoordinates ? distanceMeters(storeCoordinates, destinationCoordinates) : null;
	const hasUnavailableItems = cartItems.filter((item) => !item.is_available).length > 0;
	useEffect(() => {
		if (selectedAddressId && shippingRates.length === 0) loadShippingRates(selectedAddressId, { preserveSelectedRate: true });
	}, [
		loadShippingRates,
		selectedAddressId,
		shippingRates.length
	]);
	useEffect(() => {
		const message = window.sessionStorage.getItem(checkoutStockAlertKey);
		if (!message) return;
		window.sessionStorage.removeItem(checkoutStockAlertKey);
		toast.error(message);
	}, []);
	const submitOrder = async () => {
		if (hasUnavailableItems) {
			window.sessionStorage.setItem(checkoutStockAlertKey, "Produk sudah habis atau stok tidak mencukupi. Perbarui keranjang sebelum membayar.");
			window.location.reload();
			return;
		}
		const redirectUrl = await placeOrder(notes, agreed);
		if (redirectUrl) window.location.href = redirectUrl;
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Checkout Deklasee Coffee" }), /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-canvas",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-[10px] font-medium tracking-[0.08em] text-muted-soft uppercase",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: home.url(),
							className: "transition-colors hover:text-primary",
							children: "Beranda"
						}),
						/* @__PURE__ */ jsx("span", { children: "/" }),
						/* @__PURE__ */ jsx(Link, {
							href: cart.url(),
							className: "transition-colors hover:text-primary",
							children: "Keranjang"
						}),
						/* @__PURE__ */ jsx("span", { children: "/" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-ink",
							children: "Checkout"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 border border-hairline bg-sand p-7 sm:p-10 lg:p-14",
					children: /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-[10px] font-medium tracking-[0.12em] text-body uppercase",
								children: "Secure checkout"
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-4 font-condensed text-[clamp(56px,7vw,108px)] leading-[0.81] font-semibold tracking-[-0.055em] text-ink uppercase",
								children: "Checkout"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-5 max-w-xl text-sm leading-5 text-body",
								children: "Pilih alamat tersimpan, ongkir Biteship, voucher, lalu bayar via Midtrans."
							})
						]
					})
				}),
				cartItems.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "border border-hairline bg-surface-soft p-10 text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "mb-4 font-condensed text-4xl leading-none font-semibold tracking-[-0.04em] text-ink uppercase",
						children: "Keranjang kosong"
					}), /* @__PURE__ */ jsx(Link, {
						href: list.url(),
						className: "text-xs font-medium tracking-[0.08em] text-primary uppercase underline",
						children: "Belanja dulu"
					})]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid min-w-0 border-x border-b border-hairline lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 divide-y divide-hairline",
						children: [
							/* @__PURE__ */ jsxs("section", {
								className: "p-6 sm:p-8 lg:p-10",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-5 flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", {
										className: "font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase",
										children: "Alamat Pengiriman"
									}) }), /* @__PURE__ */ jsx(Link, {
										href: manageAddress.url({ query: { redirect_to: "/checkout" } }),
										className: "text-[10px] font-medium tracking-[0.1em] text-primary uppercase hover:text-primary-hover",
										children: "Kelola alamat"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid gap-3 md:grid-cols-2",
									children: addresses.map((address) => /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => void selectAddress(address.id),
										className: `border p-4 text-left transition-colors ${selectedAddressId === address.id ? "border-primary bg-primary-soft" : "border-hairline bg-canvas hover:border-ink"}`,
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "mb-2 flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-[11px] font-semibold tracking-[0.08em] text-ink uppercase",
													children: address.label ?? "Alamat"
												}), address.is_default && /* @__PURE__ */ jsx("span", {
													className: "bg-primary px-2 py-1 text-[9px] font-medium tracking-[0.08em] text-canvas uppercase",
													children: "Utama"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-[12px] font-medium text-ink",
												children: address.recipient_name
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[11px] text-muted-soft",
												children: address.recipient_phone
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-2 text-[12px] leading-relaxed text-body",
												children: address.full_address
											}),
											(!address.postal_code || !address.latitude || !address.longitude) && /* @__PURE__ */ jsx("p", {
												className: "mt-2 text-[11px] font-semibold text-error",
												children: "Lengkapi kode pos dan koordinat di buku alamat."
											})
										]
									}, address.id))
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "p-6 sm:p-8 lg:p-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-5 flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Truck, {
											size: 18,
											className: "text-primary",
											strokeWidth: 1.5
										}), /* @__PURE__ */ jsx("h2", {
											className: "font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase",
											children: "Ongkir"
										})]
									}),
									errors.shipping && /* @__PURE__ */ jsx("p", {
										className: "mb-3 text-[12px] font-semibold text-error",
										children: errors.shipping
									}),
									errors.customer_address_id && /* @__PURE__ */ jsx("p", {
										className: "mb-3 text-[12px] font-semibold text-error",
										children: errors.customer_address_id
									}),
									shippingRatesLoading ? /* @__PURE__ */ jsx("div", {
										className: "border border-dashed border-hairline bg-surface-soft p-6 text-[12px] font-medium text-muted-soft",
										children: "Memuat harga ongkir..."
									}) : shippingRates.length === 0 ? /* @__PURE__ */ jsx("div", {
										className: "border border-dashed border-hairline bg-surface-soft p-6 text-[12px] font-medium text-muted-soft",
										children: "Pilih alamat dengan kode pos dan koordinat untuk melihat harga ongkir."
									}) : /* @__PURE__ */ jsx("div", {
										className: "grid gap-3 md:grid-cols-2",
										children: shippingRates.map((rate) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => void selectShippingRate(rate),
											className: `border p-4 text-left transition-colors ${selectedShippingRate?.id === rate.id ? "border-primary bg-primary-soft" : "border-hairline bg-canvas hover:border-ink"}`,
											children: [
												/* @__PURE__ */ jsxs("p", {
													className: "text-[11px] font-semibold tracking-[0.08em] text-ink uppercase",
													children: [
														rate.courier_company.toUpperCase(),
														" ",
														rate.courier_type
													]
												}),
												/* @__PURE__ */ jsxs("p", {
													className: "mt-1 text-[11px] text-muted-soft",
													children: [
														rate.courier_service_name ?? rate.description ?? "Layanan pengiriman",
														" ",
														"· ",
														rate.duration ?? "-"
													]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-3 text-sm font-semibold text-primary",
													children: formatPrice(rate.price)
												})
											]
										}, rate.id))
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "p-6 sm:p-8 lg:p-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-5 flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Ticket, {
											size: 18,
											className: "text-primary",
											strokeWidth: 1.5
										}), /* @__PURE__ */ jsx("h2", {
											className: "font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase",
											children: "Voucher"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex min-w-0 flex-wrap gap-2 sm:flex-nowrap",
										children: [
											/* @__PURE__ */ jsx("input", {
												value: voucherCode,
												onChange: (event) => setVoucherCode(event.target.value),
												placeholder: "Masukkan kode voucher",
												className: "h-12 min-w-[180px] flex-1 border border-hairline bg-canvas px-4 text-[13px] text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => void applyVoucher(voucherCode),
												className: "h-12 bg-primary px-6 text-[11px] font-semibold tracking-[0.08em] text-canvas uppercase hover:bg-primary-hover active:bg-primary-active",
												children: "Pakai"
											}),
											appliedVoucher && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => void removeVoucher(),
												className: "h-12 border border-ink px-4 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase hover:bg-ink hover:text-canvas",
												children: "Hapus"
											})
										]
									}),
									appliedVoucher && /* @__PURE__ */ jsxs("p", {
										className: "mt-2 text-[12px] font-semibold text-primary",
										children: [
											appliedVoucher.name,
											": -",
											formatPrice(appliedVoucher.discount)
										]
									}),
									errors.voucher_code && /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-[12px] font-semibold text-error",
										children: errors.voucher_code
									})
								]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "p-6 sm:p-8 lg:p-10",
								children: [
									/* @__PURE__ */ jsx("h2", {
										className: "mb-4 font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase",
										children: "Catatan Order"
									}),
									/* @__PURE__ */ jsx("textarea", {
										value: notes,
										onChange: (event) => setNotes(event.target.value),
										maxLength: 2e3,
										placeholder: "Opsional",
										className: "h-28 w-full resize-none border border-hairline bg-canvas px-4 py-3 text-[13px] text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "mt-4 flex items-start gap-3 text-[12px] leading-5 text-body",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: agreed,
											onChange: (event) => setAgreed(event.target.checked),
											className: "mt-0.5 h-4 w-4 border-ink text-primary focus:ring-primary"
										}), /* @__PURE__ */ jsx("span", { children: "Saya menyetujui kebijakan tanpa retur/refund, Syarat & Ketentuan, dan Kebijakan Privasi." })]
									}),
									errors.no_return_refund_agreed && /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-[12px] font-semibold text-error",
										children: errors.no_return_refund_agreed
									}),
									errors.checkout && /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-[12px] font-semibold text-error",
										children: errors.checkout
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("aside", {
						className: "w-full min-w-0",
						children: /* @__PURE__ */ jsxs("div", {
							className: "sticky top-24 lg:top-32",
							children: [
								/* @__PURE__ */ jsx("h2", {
									className: "mb-6 font-condensed text-3xl leading-none font-semibold tracking-[-0.035em] text-ink uppercase",
									children: "Ringkasan Pesanan"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mb-6 max-h-[340px] space-y-4 overflow-y-auto border-b border-hairline pr-2 pb-5",
									children: cartItems.map((item) => /* @__PURE__ */ jsxs("div", {
										className: "flex gap-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "relative h-24 w-20 shrink-0 overflow-hidden border border-hairline bg-surface-soft",
												children: [item.image && /* @__PURE__ */ jsx("img", {
													src: item.image,
													alt: item.title,
													className: "h-full w-full object-contain p-2"
												}), /* @__PURE__ */ jsx("span", {
													className: "absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] font-semibold text-canvas",
													children: item.quantity
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ jsx("p", {
														className: "font-serif text-base leading-4 text-ink",
														children: item.title
													}),
													/* @__PURE__ */ jsx("p", {
														className: "mt-1 text-[11px] text-muted-soft",
														children: [item.net_weight, item.grind_type?.replaceAll("_", " ")].filter(Boolean).join(" / ") || "-"
													}),
													/* @__PURE__ */ jsxs("p", {
														className: "mt-1 text-[11px] font-medium text-muted-soft",
														children: [
															"Berat:",
															" ",
															formatWeight(item.weight)
														]
													}),
													!item.is_available && /* @__PURE__ */ jsx("p", {
														className: "mt-1 text-[10px] font-semibold text-error",
														children: stockIssueMessage(item)
													})
												]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "max-w-[98px] shrink-0 text-right text-[12px] font-semibold break-words text-ink tabular-nums md:max-w-[112px]",
												children: formatPrice(item.subtotal)
											})
										]
									}, item.id))
								}),
								/* @__PURE__ */ jsx(SummaryRow, {
									label: "Subtotal",
									value: summary.subtotal
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-soft",
									children: [/* @__PURE__ */ jsx("span", { children: "Total Berat" }), /* @__PURE__ */ jsx("span", {
										className: "text-right font-black break-words tabular-nums",
										children: formatWeight(totalWeight)
									})]
								}),
								/* @__PURE__ */ jsx(SummaryRow, {
									label: "Ongkir",
									value: summary.shipping
								}),
								/* @__PURE__ */ jsx(SummaryRow, {
									label: "Biaya Layanan",
									value: summary.service_fee
								}),
								/* @__PURE__ */ jsx(SummaryRow, {
									label: "Diskon",
									value: -summary.discount,
									danger: true
								}),
								hasUnavailableItems && /* @__PURE__ */ jsx("div", {
									className: "mt-4 border border-error bg-primary-soft px-4 py-3 text-[12px] font-semibold text-error",
									children: "Ada item yang stoknya tidak tersedia. Perbarui keranjang sebelum checkout."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-5 border-t border-ink pt-5",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-end justify-between gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-semibold tracking-[0.08em] text-ink uppercase",
											children: "Total Pembayaran"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-right font-condensed text-3xl font-semibold tracking-[-0.03em] text-ink tabular-nums",
											children: formatPrice(summary.total)
										})]
									})
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => void submitOrder(),
									disabled: placingOrder || !selectedShippingRate || !agreed,
									className: "mt-6 flex h-14 w-full items-center justify-center bg-primary text-[11px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:bg-oat disabled:text-muted-soft",
									children: [/* @__PURE__ */ jsx(Lock, {
										size: 16,
										className: "mr-2"
									}), placingOrder ? "Membuat Pembayaran..." : "Bayar dengan Midtrans"]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 space-y-4 border-t border-hairline pt-6",
									children: [
										/* @__PURE__ */ jsx(CheckoutRouteMap, {
											destinationAddress: selectedAddress,
											destinationCoordinates,
											distance: routeDistance,
											storeCoordinates
										}),
										/* @__PURE__ */ jsx("div", {
											className: "border border-hairline bg-surface-soft p-4",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3 text-[12px] font-medium text-ink",
												children: [/* @__PURE__ */ jsx(ShieldCheck, {
													size: 16,
													className: "mt-0.5 shrink-0 text-primary",
													strokeWidth: 1.5
												}), /* @__PURE__ */ jsx("p", { children: "Pembayaran aman didukung Midtrans" })]
											})
										}),
										/* @__PURE__ */ jsx("div", {
											className: "border border-hairline bg-surface-soft p-4",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3 text-[12px] font-medium text-ink",
												children: [/* @__PURE__ */ jsx(Truck, {
													size: 16,
													className: "mt-0.5 shrink-0 text-primary",
													strokeWidth: 1.5
												}), /* @__PURE__ */ jsx("p", { children: "Ongkir dihitung oleh Biteship" })]
											})
										})
									]
								})
							]
						})
					})]
				})
			]
		})
	})] });
}
function CheckoutRouteMap({ destinationAddress, destinationCoordinates, distance, storeCoordinates }) {
	const [leafletModules, setLeafletModules] = useState(null);
	const [markerIcon, setMarkerIcon] = useState(null);
	const canShowRoute = Boolean(storeCoordinates && destinationCoordinates && distance !== null);
	const googleMapsUrl = storeCoordinates && destinationCoordinates ? googleMapsDirectionsUrl(storeCoordinates, destinationCoordinates) : null;
	useEffect(() => {
		let isMounted = true;
		Promise.all([
			import("leaflet"),
			Promise.resolve({            }),
			import("react-leaflet")
		]).then(([leaflet, , reactLeaflet]) => {
			if (!isMounted) return;
			setMarkerIcon(leaflet.icon({
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			}));
			setLeafletModules({
				MapContainer: reactLeaflet.MapContainer,
				Marker: reactLeaflet.Marker,
				Polyline: reactLeaflet.Polyline,
				Popup: reactLeaflet.Popup,
				TileLayer: reactLeaflet.TileLayer,
				useMap: reactLeaflet.useMap
			});
		});
		return () => {
			isMounted = false;
		};
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-hairline bg-surface-soft p-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", {
					className: "flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-ink uppercase",
					children: [/* @__PURE__ */ jsx(MapPinned, {
						size: 15,
						className: "text-primary"
					}), "Rute Pengiriman"]
				}) }), distance !== null && /* @__PURE__ */ jsx("span", {
					className: "border border-ink bg-canvas px-2.5 py-1 text-[10px] font-medium text-ink uppercase",
					children: formatDistance(distance)
				})]
			}),
			canShowRoute && leafletModules && markerIcon ? /* @__PURE__ */ jsx(RouteMap, {
				destinationAddress,
				destinationCoordinates,
				markerIcon,
				modules: leafletModules,
				storeCoordinates
			}) : /* @__PURE__ */ jsx("div", {
				className: "flex h-[220px] items-center justify-center border border-dashed border-hairline bg-canvas px-5 text-center text-[11px] text-muted-soft",
				children: !storeCoordinates ? "Koordinat toko belum dikonfigurasi." : !destinationCoordinates ? "Pilih alamat dengan koordinat untuk melihat rute." : "Memuat peta..."
			}),
			canShowRoute && /* @__PURE__ */ jsx("div", {
				className: "mt-3 space-y-3",
				children: googleMapsUrl && /* @__PURE__ */ jsx("a", {
					href: googleMapsUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-11 w-full items-center justify-center bg-primary px-3 text-[10px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary-hover",
					children: "Buka rute di Google Maps"
				})
			})
		]
	});
}
function RouteMap({ destinationAddress, destinationCoordinates, markerIcon, modules, storeCoordinates }) {
	const { MapContainer, Marker, Polyline, Popup, TileLayer } = modules;
	const bounds = [storeCoordinates, destinationCoordinates];
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden border border-hairline bg-canvas",
		children: /* @__PURE__ */ jsxs(MapContainer, {
			bounds,
			className: "h-[220px] w-full",
			scrollWheelZoom: false,
			children: [
				/* @__PURE__ */ jsx(TileLayer, {
					attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
					url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				}),
				/* @__PURE__ */ jsx(RouteMapUpdater, {
					bounds,
					modules
				}),
				/* @__PURE__ */ jsx(Polyline, {
					pathOptions: {
						color: "var(--color-primary)",
						weight: 4
					},
					positions: [storeCoordinates, destinationCoordinates]
				}),
				/* @__PURE__ */ jsx(Marker, {
					icon: markerIcon,
					position: storeCoordinates,
					children: /* @__PURE__ */ jsx(Popup, { children: "Lokasi toko" })
				}),
				/* @__PURE__ */ jsx(Marker, {
					icon: markerIcon,
					position: destinationCoordinates,
					children: /* @__PURE__ */ jsx(Popup, { children: destinationAddress?.label ?? "Alamat pengiriman" })
				})
			]
		})
	});
}
function RouteMapUpdater({ bounds, modules }) {
	const map = modules.useMap();
	useEffect(() => {
		map.invalidateSize();
		map.fitBounds(bounds, {
			padding: [28, 28],
			maxZoom: 15
		});
	}, [bounds, map]);
	return null;
}
function SummaryRow({ label, value, danger = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] ${danger ? "text-primary" : "text-muted-soft"}`,
		children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsxs("span", {
			className: "text-right font-semibold break-words tabular-nums",
			children: [value < 0 ? "-" : "", formatPrice(Math.abs(value))]
		})]
	});
}
//#endregion
export { Checkout as default };

//# sourceMappingURL=checkout-Dopd8idC.js.map