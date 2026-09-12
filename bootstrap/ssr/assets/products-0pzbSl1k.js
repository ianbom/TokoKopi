import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { a as Pagination } from "./shared-C45zkJUt.js";
import { a as index, c as show, i as edit, n as create, r as destroy } from "./products-BPQs5U7S.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Plus, Search } from "lucide-react";
//#region resources/js/pages/admin/products/index.tsx
var money = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(value);
function ProductsIndex({ products, filters, options, stats }) {
	const [search, setSearch] = useState(filters.search ?? "");
	const apply = (next) => router.get(index.url({ query: {
		...filters,
		...next
	} }), {}, {
		preserveState: true,
		replace: true
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Produk" }), /* @__PURE__ */ jsxs("main", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col justify-between gap-4 md:flex-row md:items-end",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold tracking-widest text-primary uppercase",
						children: "Katalog"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Produk Kopi"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Kelola produk, kategori, varian, dan stok kopi."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						href: create(),
						children: [/* @__PURE__ */ jsx(Plus, {}), " Produk Baru"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-6",
				children: Object.entries(stats).map(([label, value]) => /* @__PURE__ */ jsxs("div", {
					className: "border bg-canvas p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: label.replace("_", " ")
					}), /* @__PURE__ */ jsx("p", {
						className: "text-2xl font-semibold",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "flex flex-wrap gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					apply({
						search,
						page: "1"
					});
				},
				children: [
					/* @__PURE__ */ jsx(Input, {
						value: search,
						onChange: (event) => setSearch(event.target.value),
						placeholder: "Cari nama atau SKU",
						className: "max-w-sm"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: filters.category_id ?? "",
						onChange: (event) => apply({
							category_id: event.target.value,
							page: "1"
						}),
						className: "border bg-canvas px-3",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Semua kategori"
						}), options.categories.map((category) => /* @__PURE__ */ jsx("option", {
							value: category.id,
							children: category.name
						}, category.id))]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: filters.status ?? "",
						onChange: (event) => apply({
							status: event.target.value,
							page: "1"
						}),
						className: "border bg-canvas px-3",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Semua status"
						}), options.statuses.map((status) => /* @__PURE__ */ jsx("option", {
							value: status,
							children: status
						}, status))]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						variant: "outline",
						children: [/* @__PURE__ */ jsx(Search, {}), " Cari"]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "admin-table w-full min-w-[760px] text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b bg-surface-soft text-left",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Produk"
							}),
							/* @__PURE__ */ jsx("th", { children: "Kategori" }),
							/* @__PURE__ */ jsx("th", { children: "Harga mulai" }),
							/* @__PURE__ */ jsx("th", { children: "Varian" }),
							/* @__PURE__ */ jsx("th", { children: "Stok" }),
							/* @__PURE__ */ jsx("th", { children: "Status" }),
							/* @__PURE__ */ jsx("th", {})
						] })
					}), /* @__PURE__ */ jsxs("tbody", { children: [products.data.map((product) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [product.thumbnail && /* @__PURE__ */ jsx("img", {
										src: product.thumbnail,
										alt: "",
										className: "size-10 object-cover"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Link, {
										href: show(product),
										className: "font-semibold hover:text-primary",
										children: product.name
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: product.sku ?? "-"
									})] })]
								})
							}),
							/* @__PURE__ */ jsx("td", { children: product.categories.join(", ") || "-" }),
							/* @__PURE__ */ jsx("td", { children: money(product.minimum_price) }),
							/* @__PURE__ */ jsx("td", { children: product.variants_count }),
							/* @__PURE__ */ jsx("td", { children: product.total_stock }),
							/* @__PURE__ */ jsx("td", {
								className: "capitalize",
								children: product.status
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "p-3 text-right",
								children: [/* @__PURE__ */ jsx(Button, {
									asChild: true,
									size: "sm",
									variant: "outline",
									children: /* @__PURE__ */ jsx(Link, {
										href: edit(product),
										children: "Edit"
									})
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => router.delete(destroy.url(product)),
									children: "Hapus"
								})]
							})
						]
					}, product.id)), products.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "p-10 text-center text-muted-foreground",
						children: "Produk tidak ditemukan."
					}) })] })]
				})
			}),
			/* @__PURE__ */ jsx(Pagination, { paginator: products })
		]
	})] });
}
//#endregion
export { ProductsIndex as default };

//# sourceMappingURL=products-0pzbSl1k.js.map