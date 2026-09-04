import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
import { a as detail, s as list } from "./routes-BtCAeSqc.js";
import { t as ProfileLayout } from "./profile-layout-BEi9Hx0H.js";
import { Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Heart } from "lucide-react";
//#region resources/js/actions/App/Http/Controllers/Customer/WishlistController.ts
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/wishlist"
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::index
* @see app/Http/Controllers/Customer/WishlistController.php:17
* @route '/wishlist'
*/
indexForm.head = (options) => ({
	action: index.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
index.form = indexForm;
/**
* @see \App\Http\Controllers\Customer\WishlistController::store
* @see app/Http/Controllers/Customer/WishlistController.php:29
* @route '/wishlist/{product}'
*/
var store = (args, options) => ({
	url: store.url(args, options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/wishlist/{product}"
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::store
* @see app/Http/Controllers/Customer/WishlistController.php:29
* @route '/wishlist/{product}'
*/
store.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { product: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { product: args.id };
	if (Array.isArray(args)) args = { product: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { product: typeof args.product === "object" ? args.product.id : args.product };
	return store.definition.url.replace("{product}", parsedArgs.product.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::store
* @see app/Http/Controllers/Customer/WishlistController.php:29
* @route '/wishlist/{product}'
*/
store.post = (args, options) => ({
	url: store.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::store
* @see app/Http/Controllers/Customer/WishlistController.php:29
* @route '/wishlist/{product}'
*/
var storeForm = (args, options) => ({
	action: store.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::store
* @see app/Http/Controllers/Customer/WishlistController.php:29
* @route '/wishlist/{product}'
*/
storeForm.post = (args, options) => ({
	action: store.url(args, options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroyProduct
* @see app/Http/Controllers/Customer/WishlistController.php:46
* @route '/wishlist/products/{product}'
*/
var destroyProduct = (args, options) => ({
	url: destroyProduct.url(args, options),
	method: "delete"
});
destroyProduct.definition = {
	methods: ["delete"],
	url: "/wishlist/products/{product}"
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroyProduct
* @see app/Http/Controllers/Customer/WishlistController.php:46
* @route '/wishlist/products/{product}'
*/
destroyProduct.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { product: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { product: args.id };
	if (Array.isArray(args)) args = { product: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { product: typeof args.product === "object" ? args.product.id : args.product };
	return destroyProduct.definition.url.replace("{product}", parsedArgs.product.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroyProduct
* @see app/Http/Controllers/Customer/WishlistController.php:46
* @route '/wishlist/products/{product}'
*/
destroyProduct.delete = (args, options) => ({
	url: destroyProduct.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroyProduct
* @see app/Http/Controllers/Customer/WishlistController.php:46
* @route '/wishlist/products/{product}'
*/
var destroyProductForm = (args, options) => ({
	action: destroyProduct.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroyProduct
* @see app/Http/Controllers/Customer/WishlistController.php:46
* @route '/wishlist/products/{product}'
*/
destroyProductForm.delete = (args, options) => ({
	action: destroyProduct.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroyProduct.form = destroyProductForm;
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroy
* @see app/Http/Controllers/Customer/WishlistController.php:22
* @route '/wishlist/{wishlist}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/wishlist/{wishlist}"
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroy
* @see app/Http/Controllers/Customer/WishlistController.php:22
* @route '/wishlist/{wishlist}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { wishlist: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { wishlist: args.id };
	if (Array.isArray(args)) args = { wishlist: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { wishlist: typeof args.wishlist === "object" ? args.wishlist.id : args.wishlist };
	return destroy.definition.url.replace("{wishlist}", parsedArgs.wishlist.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroy
* @see app/Http/Controllers/Customer/WishlistController.php:22
* @route '/wishlist/{wishlist}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroy
* @see app/Http/Controllers/Customer/WishlistController.php:22
* @route '/wishlist/{wishlist}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Customer\WishlistController::destroy
* @see app/Http/Controllers/Customer/WishlistController.php:22
* @route '/wishlist/{wishlist}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
//#endregion
//#region resources/js/pages/customer/wishlist/my-wishlist.tsx
var fallbackImages = [
	"/img/abdul-raheem-kannath-aNWfK46QWto-unsplash.webp",
	"/img/ainur-iman-qcNmigFPTQM-unsplash.webp",
	"/img/atiyeh-fathi-CvdzGjVX9DA-unsplash.webp",
	"/img/hasan-almasi-_X2UAmIcpko-unsplash.webp",
	"/img/ike-ellyana-2F70bGqQVa4-unsplash.webp"
];
var formatPrice = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(value).replace("IDR", "Rp").trim();
function MyWishlist({ wishlistItems, summary }) {
	const visibleWishlistItems = wishlistItems.filter((item) => item.is_available);
	return /* @__PURE__ */ jsx(ProfileLayout, {
		title: "Wishlist Saya",
		pageTitle: "Wishlist Saya",
		subtitle: "Simpan item favoritmu sebelum kehabisan.",
		activePath: "wishlist",
		breadcrumbs: [
			{
				label: "Beranda",
				href: "/"
			},
			{
				label: "Akun Saya",
				href: "/my-profile"
			},
			{ label: "Wishlist Saya" }
		],
		children: /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex items-end justify-between border-b border-hairline-strong pb-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "mb-1 text-[10px] font-semibold tracking-[0.24em] text-muted-foreground uppercase",
					children: "Item Tersimpan"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-[17px] font-semibold tracking-wide text-ink uppercase",
					children: "Koleksi Wishlist"
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "text-right text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
					children: [summary.item_count, " produk tersimpan"]
				})]
			}), visibleWishlistItems.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-10 xl:grid-cols-4",
				children: visibleWishlistItems.map((item, index) => /* @__PURE__ */ jsx(WishlistTile, {
					item,
					index
				}, item.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "flex min-h-[360px] flex-col items-center justify-center border border-hairline-strong bg-sand px-6 text-center",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold text-ink uppercase",
						children: "Wishlist masih kosong"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 max-w-sm text-[12px] leading-6 text-muted-foreground",
						children: "Simpan produk favorit dari katalog agar mudah ditemukan kembali."
					}),
					/* @__PURE__ */ jsx(Link, {
						href: list.url(),
						className: "mt-5 inline-flex h-10 items-center justify-center rounded-none bg-primary px-5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase hover:bg-primary-hover",
						children: "Lihat Produk"
					})
				]
			})]
		})
	});
}
function WishlistTile({ item, index }) {
	const productHref = detail.url({ query: { product: item.slug } });
	const removeItem = (event) => {
		event.preventDefault();
		event.stopPropagation();
		router.delete(destroy.url(item.id), { preserveScroll: true });
	};
	return /* @__PURE__ */ jsxs(Link, {
		href: productHref,
		className: "group flex h-full flex-col",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative aspect-square overflow-hidden border border-hairline bg-oat p-5 sm:p-6",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: item.image ?? fallbackImages[index % fallbackImages.length],
						alt: item.title,
						loading: "lazy",
						decoding: "async",
						className: "h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
					}),
					item.badge && /* @__PURE__ */ jsx("div", {
						className: "absolute top-0 left-0 z-10 flex min-h-24 w-9 [transform:rotate(180deg)] items-center justify-center bg-primary px-1 py-2 text-[10px] font-semibold tracking-[0.08em] text-white uppercase [text-orientation:mixed] [writing-mode:vertical-rl] sm:w-10 sm:text-[11px]",
						children: item.badge
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "Hapus dari wishlist",
						onClick: removeItem,
						className: "absolute top-3 right-3 z-10 grid size-9 place-items-center border border-hairline-strong bg-canvas text-ink transition hover:border-primary hover:text-primary",
						children: /* @__PURE__ */ jsx(Heart, {
							size: 18,
							fill: "currentColor",
							strokeWidth: 1.8
						})
					})
				]
			}),
			item.colors.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: item.colors.map((color) => /* @__PURE__ */ jsx("span", {
					className: "size-4 border border-hairline-strong",
					style: { backgroundColor: color.hex },
					title: color.name
				}, color.hex))
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
				children: item.category
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "mt-1 text-[11px] leading-[1.4] font-semibold text-ink uppercase transition-colors group-hover:text-primary",
				children: item.title
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex flex-wrap items-center gap-2 text-[11px] text-body",
				children: [/* @__PURE__ */ jsx("span", { children: formatPrice(item.sale_price ?? item.price) }), item.sale_price !== null && /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground line-through",
					children: formatPrice(item.price)
				})]
			})
		]
	});
}
//#endregion
export { MyWishlist as default };

//# sourceMappingURL=my-wishlist-qbReb8pt.js.map