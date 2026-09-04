import { t as Button } from "./button-Cl3HFMpR.js";
import { a as Pagination } from "./shared-C45zkJUt.js";
import { n as destroy, o as stockAdjustment, r as edit, t as create } from "./product-variants-Bnlwplr7.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
//#region resources/js/pages/admin/product-variants/index.tsx
function ProductVariantsIndex({ variants, product, stats }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Varian Produk" }), /* @__PURE__ */ jsxs("main", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold tracking-widest text-primary uppercase",
					children: "Katalog"
				}), /* @__PURE__ */ jsx("h1", {
					className: "font-serif text-3xl",
					children: product ? `Varian ${product.name}` : "Varian Produk"
				})] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						href: create(product ? { query: { product_id: product.id } } : void 0),
						children: [/* @__PURE__ */ jsx(Plus, {}), " Varian Baru"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: Object.entries(stats).map(([key, value]) => /* @__PURE__ */ jsxs("div", {
					className: "border p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: key.replace("_", " ")
					}), /* @__PURE__ */ jsx("p", {
						className: "text-2xl font-semibold",
						children: value
					})]
				}, key))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "admin-table w-full min-w-[720px] text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b bg-surface-soft text-left",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Produk / SKU"
							}),
							/* @__PURE__ */ jsx("th", { children: "Berat" }),
							/* @__PURE__ */ jsx("th", { children: "Gilingan" }),
							/* @__PURE__ */ jsx("th", { children: "Harga" }),
							/* @__PURE__ */ jsx("th", { children: "Stok" }),
							/* @__PURE__ */ jsx("th", { children: "Status" }),
							/* @__PURE__ */ jsx("th", {})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: variants.data.map((variant) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "p-3",
								children: [/* @__PURE__ */ jsx("b", { children: variant.product }), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: variant.sku
								})]
							}),
							/* @__PURE__ */ jsx("td", { children: variant.net_weight ?? "-" }),
							/* @__PURE__ */ jsx("td", { children: variant.grind_type ?? "-" }),
							/* @__PURE__ */ jsxs("td", { children: [
								"Rp",
								" ",
								Number(variant.sale_price ?? variant.regular_price).toLocaleString("id-ID")
							] }),
							/* @__PURE__ */ jsxs("td", { children: [
								variant.stock_quantity,
								" / min",
								" ",
								variant.low_stock_threshold
							] }),
							/* @__PURE__ */ jsx("td", { children: variant.is_active ? "Aktif" : "Nonaktif" }),
							/* @__PURE__ */ jsxs("td", {
								className: "p-3 text-right",
								children: [
									/* @__PURE__ */ jsx(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ jsx(Link, {
											href: stockAdjustment(variant),
											children: "Stok"
										})
									}),
									/* @__PURE__ */ jsx(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ jsx(Link, {
											href: edit(variant),
											children: "Edit"
										})
									}),
									/* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => router.delete(destroy.url(variant)),
										children: "Hapus"
									})
								]
							})
						]
					}, variant.id)) })]
				})
			}),
			/* @__PURE__ */ jsx(Pagination, { paginator: variants })
		]
	})] });
}
//#endregion
export { ProductVariantsIndex as default };

//# sourceMappingURL=product-variants-nyVasQXO.js.map