import { t as Button } from "./button-Cl3HFMpR.js";
import { i as index } from "./product-variants-Bnlwplr7.js";
import { a as index$1, i as edit, r as destroy, s as publish, t as archive } from "./products-BPQs5U7S.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Archive, ArrowLeft, CheckCircle2, Pencil, Trash2 } from "lucide-react";
//#region resources/js/pages/admin/products/show.tsx
var money = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(Number(value ?? 0));
function ProductShow({ product }) {
	const action = (url, method) => router[method](url, {}, { preserveScroll: true });
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: product.name }), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-6xl space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col justify-between gap-4 md:flex-row md:items-start",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold tracking-widest text-primary uppercase",
						children: "Katalog kopi"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-4xl",
						children: product.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							product.sku ?? "-",
							" ·",
							" ",
							product.categories.join(", ") || "Tanpa kategori"
						]
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ jsxs(Link, {
								href: index$1(),
								children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ jsxs(Link, {
								href: edit(product),
								children: [/* @__PURE__ */ jsx(Pencil, {}), " Edit"]
							})
						}),
						product.status !== "active" && /* @__PURE__ */ jsxs(Button, {
							onClick: () => action(publish.url(product), "post"),
							children: [/* @__PURE__ */ jsx(CheckCircle2, {}), " Aktifkan"]
						}),
						product.status !== "archived" && /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => action(archive.url(product), "post"),
							children: [/* @__PURE__ */ jsx(Archive, {}), " Arsipkan"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "text-red-600",
							onClick: () => confirm(`Hapus ${product.name}?`) && action(destroy.url(product), "delete"),
							children: [/* @__PURE__ */ jsx(Trash2, {}), " Hapus"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid gap-4 md:grid-cols-[280px_1fr]",
				children: [/* @__PURE__ */ jsx("div", {
					className: "border bg-canvas p-3",
					children: product.images[0]?.image_url ? /* @__PURE__ */ jsx("img", {
						src: product.images[0].image_url,
						alt: product.images[0].alt_text ?? product.name,
						className: "aspect-square w-full object-cover"
					}) : /* @__PURE__ */ jsx("div", {
						className: "flex aspect-square items-center justify-center text-sm text-muted-foreground",
						children: "Belum ada gambar"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(Metric, {
							label: "Status",
							value: product.status
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Total stok",
							value: product.total_stock
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Varian",
							value: product.variants.length
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Terjual",
							value: product.order_items_count
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Origin",
							value: product.origin ?? "-"
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Process",
							value: product.process ?? "-"
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Featured",
							value: product.is_featured ? "Ya" : "Tidak"
						}),
						/* @__PURE__ */ jsx(Metric, {
							label: "Dibuat",
							value: product.created_at ?? "-"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "space-y-4 border bg-canvas p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-semibold",
						children: "Varian"
					}), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ jsx(Link, {
							href: index({ query: { product_id: product.id } }),
							children: "Kelola varian"
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "admin-table w-full min-w-[760px] text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "border-b text-left",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "SKU"
								}),
								/* @__PURE__ */ jsx("th", { children: "Berat" }),
								/* @__PURE__ */ jsx("th", { children: "Gilingan" }),
								/* @__PURE__ */ jsx("th", { children: "Harga" }),
								/* @__PURE__ */ jsx("th", { children: "Stok" }),
								/* @__PURE__ */ jsx("th", { children: "Status" })
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: product.variants.map((variant) => /* @__PURE__ */ jsxs("tr", {
							className: "border-b",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "p-3 font-medium",
									children: variant.sku
								}),
								/* @__PURE__ */ jsx("td", { children: variant.net_weight ?? "-" }),
								/* @__PURE__ */ jsx("td", { children: variant.grind_type ?? "-" }),
								/* @__PURE__ */ jsx("td", { children: money(variant.sale_price ?? variant.regular_price) }),
								/* @__PURE__ */ jsxs("td", { children: [
									variant.stock_quantity,
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted-foreground",
										children: [
											"/ min",
											" ",
											variant.low_stock_threshold
										]
									})
								] }),
								/* @__PURE__ */ jsx("td", { children: variant.is_active ? "Aktif" : "Nonaktif" })
							]
						}, variant.id)) })]
					})
				})]
			}),
			product.description && /* @__PURE__ */ jsxs("section", {
				className: "border bg-canvas p-5",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-semibold",
					children: "Deskripsi"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm whitespace-pre-wrap text-muted-foreground",
					children: product.description
				})]
			})
		]
	})] });
}
function Metric({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border p-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 truncate text-lg font-semibold capitalize",
			children: value
		})]
	});
}
//#endregion
export { ProductShow as default };

//# sourceMappingURL=show-BQXKdgbZ.js.map