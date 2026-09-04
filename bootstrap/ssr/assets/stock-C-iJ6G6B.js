import { t as Button } from "./button-Cl3HFMpR.js";
import { a as Pagination } from "./shared-C45zkJUt.js";
import { o as stockAdjustment } from "./product-variants-Bnlwplr7.js";
import { Head, Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/admin/stock/index.tsx
function StockIndex({ variants, stats }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Stok" }), /* @__PURE__ */ jsxs("main", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold tracking-widest text-primary uppercase",
					children: "Inventory"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "font-serif text-3xl",
					children: "Stok Varian"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Stok aktual berasal dari tabel stocks."
				})
			] }),
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
					className: "admin-table w-full min-w-[660px] text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b bg-surface-soft text-left",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Produk"
							}),
							/* @__PURE__ */ jsx("th", { children: "SKU" }),
							/* @__PURE__ */ jsx("th", { children: "Varian" }),
							/* @__PURE__ */ jsx("th", { children: "Stok" }),
							/* @__PURE__ */ jsx("th", { children: "Minimum" }),
							/* @__PURE__ */ jsx("th", {})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: variants.data.map((variant) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: variant.product
							}),
							/* @__PURE__ */ jsx("td", { children: variant.sku }),
							/* @__PURE__ */ jsx("td", { children: [variant.net_weight, variant.grind_type].filter(Boolean).join(" · ") || "-" }),
							/* @__PURE__ */ jsx("td", { children: variant.quantity }),
							/* @__PURE__ */ jsx("td", { children: variant.low_stock_threshold }),
							/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Button, {
								asChild: true,
								size: "sm",
								variant: "outline",
								children: /* @__PURE__ */ jsx(Link, {
									href: stockAdjustment(variant),
									children: "Atur stok"
								})
							}) })
						]
					}, variant.id)) })]
				})
			}),
			/* @__PURE__ */ jsx(Pagination, { paginator: variants })
		]
	})] });
}
//#endregion
export { StockIndex as default };

//# sourceMappingURL=stock-C-iJ6G6B.js.map