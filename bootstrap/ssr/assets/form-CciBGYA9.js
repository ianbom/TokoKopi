import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { c as update, i as index, r as edit, s as store } from "./product-variants-Bnlwplr7.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Save } from "lucide-react";
//#region resources/js/pages/admin/product-variants/form.tsx
function VariantForm({ mode, variant, products, selectedProductId }) {
	const form = useForm({
		product_id: variant?.product_id ?? selectedProductId ?? "",
		sku: variant?.sku ?? "",
		net_weight: String(variant?.net_weight ?? ""),
		grind_type: variant?.grind_type ?? "whole_bean",
		regular_price: String(variant?.regular_price ?? ""),
		sale_price: String(variant?.sale_price ?? ""),
		shipping_weight_gram: variant?.shipping_weight_gram ?? "",
		image_url: variant?.image_url ?? "",
		is_active: variant?.is_active ?? true,
		stock_quantity: variant?.stock_quantity ?? "",
		low_stock_threshold: variant?.low_stock_threshold ?? 5,
		image: null
	});
	const errors = form.errors;
	const setField = (field, value) => form.setData(field, value);
	const submit = (event) => {
		event.preventDefault();
		form.transform((data) => mode === "create" ? data : {
			...data,
			_method: "put"
		});
		form.post(mode === "create" ? store.url() : update.url(variant.id), { forceFormData: true });
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: mode === "create" ? "Tambah Varian" : "Edit Varian" }), /* @__PURE__ */ jsxs("main", {
		className: "w-full space-y-6 p-4 md:p-6",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold tracking-widest text-primary uppercase",
				children: "Katalog kopi"
			}), /* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: mode === "create" ? "Tambah Varian" : "Edit Varian"
			})] }), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ jsxs(Link, {
					href: variant ? edit(variant) : index(),
					children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
				})
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "grid w-full gap-4 border bg-canvas p-5 md:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "Produk",
					error: errors.product_id,
					children: /* @__PURE__ */ jsxs("select", {
						className: "h-9 border bg-canvas px-3 text-sm",
						value: form.data.product_id,
						onChange: (event) => setField("product_id", Number(event.target.value)),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Pilih produk kopi"
						}), products.map((product) => /* @__PURE__ */ jsx("option", {
							value: product.id,
							children: product.name
						}, product.id))]
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "SKU",
					error: errors.sku,
					children: /* @__PURE__ */ jsx(Input, {
						placeholder: "DCL-GAYO-250-WB",
						value: form.data.sku,
						onChange: (event) => setField("sku", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Berat netto",
					error: errors.net_weight,
					children: /* @__PURE__ */ jsx(Input, {
						placeholder: "250gram",
						value: form.data.net_weight,
						onChange: (event) => setField("net_weight", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Grind type",
					error: errors.grind_type,
					children: /* @__PURE__ */ jsx("select", {
						className: "h-9 border bg-canvas px-3 text-sm",
						value: form.data.grind_type,
						onChange: (event) => setField("grind_type", event.target.value),
						children: [
							"whole_bean",
							"fine",
							"medium",
							"coarse"
						].map((type) => /* @__PURE__ */ jsx("option", {
							value: type,
							children: type
						}, type))
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Harga normal",
					error: errors.regular_price,
					children: /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						placeholder: "95000",
						value: form.data.regular_price,
						onChange: (event) => setField("regular_price", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Harga promo",
					error: errors.sale_price,
					children: /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						placeholder: "85000",
						value: form.data.sale_price,
						onChange: (event) => setField("sale_price", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Berat kirim (gram)",
					error: errors.shipping_weight_gram,
					children: /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						placeholder: "300",
						value: form.data.shipping_weight_gram,
						onChange: (event) => setField("shipping_weight_gram", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Stok",
					error: errors.stock_quantity,
					children: /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						placeholder: "20",
						value: form.data.stock_quantity,
						onChange: (event) => setField("stock_quantity", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Batas stok rendah",
					error: errors.low_stock_threshold,
					children: /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						placeholder: "5",
						value: form.data.low_stock_threshold,
						onChange: (event) => setField("low_stock_threshold", event.target.value)
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "File gambar varian",
					error: errors.image,
					className: "md:col-span-2",
					children: /* @__PURE__ */ jsx(Input, {
						type: "file",
						accept: "image/*",
						onChange: (event) => setField("image", event.target.files?.[0] ?? null)
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-end gap-4",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "flex h-9 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: form.data.is_active,
							onChange: (event) => setField("is_active", event.target.checked)
						}), "Aktif"]
					}), /* @__PURE__ */ jsx(VariantImagePreview, {
						file: form.data.image,
						url: form.data.image_url
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end md:col-span-3",
					children: /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: form.processing,
						children: [/* @__PURE__ */ jsx(Save, {}), " Simpan"]
					})
				})
			]
		})]
	})] });
}
function VariantImagePreview({ file, url }) {
	const preview = useMemo(() => file ? URL.createObjectURL(file) : url || null, [file, url]);
	useEffect(() => {
		if (!file || !preview) return;
		return () => URL.revokeObjectURL(preview);
	}, [file, preview]);
	return preview ? /* @__PURE__ */ jsx("img", {
		src: preview,
		alt: "Pratinjau varian kopi",
		className: "h-16 w-16 object-cover"
	}) : null;
}
function Field({ label, error, className = "", children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${className}`,
		children: [
			/* @__PURE__ */ jsx(Label, { children: label }),
			children,
			/* @__PURE__ */ jsx(InputError, { message: error })
		]
	});
}
//#endregion
export { VariantForm as default };

//# sourceMappingURL=form-CciBGYA9.js.map