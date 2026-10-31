import { t as Button } from "./button-Cl3HFMpR.js";
import { a as Pagination } from "./shared-Di8Xj7q4.js";
import { a as DialogFooter, i as DialogDescription, n as DialogClose, o as DialogHeader, r as DialogContent, s as DialogTitle, t as Dialog } from "./dialog-CtJR2l4m.js";
import { n as destroy, o as stockAdjustment, r as edit, t as create } from "./product-variants-CB5o3pk7.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
//#region resources/js/pages/admin/product-variants/index.tsx
function ProductVariantsIndex({ variants, product, stats }) {
	const [variantToDelete, setVariantToDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Varian Produk" }),
		/* @__PURE__ */ jsxs("main", {
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
						className: "admin-table w-full min-w-[820px] text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "border-b bg-surface-soft text-left",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "w-14 p-3 text-center",
									children: "No."
								}),
								/* @__PURE__ */ jsx("th", { children: "Produk / SKU" }),
								/* @__PURE__ */ jsx("th", { children: "Berat" }),
								/* @__PURE__ */ jsx("th", {
									className: "text-right",
									children: "Harga"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "text-right",
									children: "Stok"
								}),
								/* @__PURE__ */ jsx("th", { children: "Status" }),
								/* @__PURE__ */ jsx("th", {
									className: "text-right",
									children: "Aksi"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: variants.data.map((variant, rowIndex) => /* @__PURE__ */ jsxs("tr", {
							className: "border-b",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "p-3 text-center tabular-nums",
									children: (variants.from ?? 1) + rowIndex
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "p-3",
									children: [/* @__PURE__ */ jsx("b", { children: variant.product }), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: variant.sku ?? "-"
									})]
								}),
								/* @__PURE__ */ jsx("td", { children: variant.net_weight ?? "-" }),
								/* @__PURE__ */ jsxs("td", {
									className: "text-right whitespace-nowrap tabular-nums",
									children: [
										"Rp",
										" ",
										Number(variant.sale_price ?? variant.regular_price).toLocaleString("id-ID")
									]
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "text-right whitespace-nowrap tabular-nums",
									children: [
										variant.stock_quantity,
										" / min",
										" ",
										variant.low_stock_threshold
									]
								}),
								/* @__PURE__ */ jsx("td", { children: variant.is_active ? "Aktif" : "Nonaktif" }),
								/* @__PURE__ */ jsx("td", {
									className: "p-3 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex justify-end gap-2 whitespace-nowrap",
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
												variant: "destructive",
												onClick: () => setVariantToDelete(variant),
												children: "Hapus"
											})
										]
									})
								})
							]
						}, variant.id)) })]
					})
				}),
				/* @__PURE__ */ jsx(Pagination, {
					paginator: variants,
					normalizeNavigationLabels: true
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: variantToDelete !== null,
			onOpenChange: (open) => {
				if (!open && !deleting) setVariantToDelete(null);
			},
			children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Hapus varian?" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
				"Yakin ingin menghapus varian",
				" ",
				variantToDelete?.net_weight ?? "",
				" dari",
				" ",
				variantToDelete?.product ?? "produk ini",
				"? Varian yang pernah dipesan akan dinonaktifkan, bukan dihapus."
			] })] }), /* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(DialogClose, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					disabled: deleting,
					children: "Batal"
				})
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "destructive",
				disabled: !variantToDelete || deleting,
				onClick: () => {
					if (!variantToDelete || deleting) return;
					setDeleting(true);
					router.delete(destroy.url(variantToDelete), {
						preserveScroll: true,
						onSuccess: () => setVariantToDelete(null),
						onFinish: () => setDeleting(false)
					});
				},
				children: deleting ? "Menghapus..." : "Hapus varian"
			})] })] })
		})
	] });
}
//#endregion
export { ProductVariantsIndex as default };

//# sourceMappingURL=product-variants-yGK8_FF6.js.map