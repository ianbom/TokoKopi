import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { t as index$1 } from "./stock-CQ3uTkv5.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Save } from "lucide-react";
//#region resources/js/actions/App/Http/Controllers/Admin/StockController.ts
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var edit = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/admin/product-variants/{productVariant}/stock-adjustment"
};
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
edit.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { productVariant: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { productVariant: args.id };
	if (Array.isArray(args)) args = { productVariant: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { productVariant: typeof args.productVariant === "object" ? args.productVariant.id : args.productVariant };
	return edit.definition.url.replace("{productVariant}", parsedArgs.productVariant.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
edit.get = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
edit.head = (args, options) => ({
	url: edit.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var editForm = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
editForm.get = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::edit
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
editForm.head = (args, options) => ({
	action: edit.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
edit.form = editForm;
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "post"
});
update.definition = {
	methods: ["post"],
	url: "/admin/product-variants/{productVariant}/stock-adjustment"
};
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { productVariant: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { productVariant: args.id };
	if (Array.isArray(args)) args = { productVariant: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { productVariant: typeof args.productVariant === "object" ? args.productVariant.id : args.productVariant };
	return update.definition.url.replace("{productVariant}", parsedArgs.productVariant.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
update.post = (args, options) => ({
	url: update.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var updateForm = (args, options) => ({
	action: update.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
updateForm.post = (args, options) => ({
	action: update.url(args, options),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/stock"
};
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::index
* @see app/Http/Controllers/Admin/StockController.php:15
* @route '/admin/stock'
*/
indexForm.head = (options) => ({
	action: index.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
index.form = indexForm;
//#endregion
//#region resources/js/pages/admin/stock/adjustment.tsx
function StockAdjustment({ variant }) {
	const form = useForm({
		type: "in",
		quantity: 1,
		note: ""
	});
	const submit = (event) => {
		event.preventDefault();
		form.post(update.url(variant.id));
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Penyesuaian Stok" }), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-2xl space-y-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold tracking-widest text-primary uppercase",
						children: "Inventory"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Penyesuaian Stok"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-muted-foreground",
						children: [
							variant.product ?? "-",
							" · ",
							variant.sku
						]
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ jsxs(Link, {
						href: index$1(),
						children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsx(Metric, {
					label: "Stok saat ini",
					value: variant.quantity
				}), /* @__PURE__ */ jsx(Metric, {
					label: "Batas rendah",
					value: variant.low_stock_threshold
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-4 border bg-canvas p-5",
				children: [
					/* @__PURE__ */ jsx(Field, {
						label: "Tipe",
						error: form.errors.type,
						children: /* @__PURE__ */ jsxs("select", {
							className: "h-9 border bg-canvas px-3 text-sm",
							value: form.data.type,
							onChange: (e) => form.setData("type", e.target.value),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "in",
									children: "Tambah"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "out",
									children: "Kurangi"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "adjustment",
									children: "Tetapkan"
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Jumlah",
						error: form.errors.quantity,
						children: /* @__PURE__ */ jsx(Input, {
							type: "number",
							value: form.data.quantity,
							onChange: (e) => form.setData("quantity", Number(e.target.value))
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Catatan",
						error: form.errors.note,
						children: /* @__PURE__ */ jsx("textarea", {
							className: "min-h-24 border bg-canvas px-3 py-2 text-sm",
							value: form.data.note,
							onChange: (e) => form.setData("note", e.target.value)
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: form.processing,
							children: [/* @__PURE__ */ jsx(Save, {}), " Simpan"]
						})
					})
				]
			})
		]
	})] });
}
function Metric({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border bg-canvas p-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "text-2xl font-semibold",
			children: value
		})]
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-1.5",
		children: [
			/* @__PURE__ */ jsx(Label, { children: label }),
			children,
			/* @__PURE__ */ jsx(InputError, { message: error })
		]
	});
}
//#endregion
export { StockAdjustment as default };

//# sourceMappingURL=adjustment-BX9U1vgv.js.map