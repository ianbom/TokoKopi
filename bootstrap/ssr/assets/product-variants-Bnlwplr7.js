import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/product-variants/stock-adjustment/index.ts
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var update$1 = (args, options) => ({
	url: update$1.url(args, options),
	method: "post"
});
update$1.definition = {
	methods: ["post"],
	url: "/admin/product-variants/{productVariant}/stock-adjustment"
};
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
update$1.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { productVariant: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { productVariant: args.id };
	if (Array.isArray(args)) args = { productVariant: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { productVariant: typeof args.productVariant === "object" ? args.productVariant.id : args.productVariant };
	return update$1.definition.url.replace("{productVariant}", parsedArgs.productVariant.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
update$1.post = (args, options) => ({
	url: update$1.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var updateForm$1 = (args, options) => ({
	action: update$1.url(args, options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StockController::update
* @see app/Http/Controllers/Admin/StockController.php:27
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
updateForm$1.post = (args, options) => ({
	action: update$1.url(args, options),
	method: "post"
});
update$1.form = updateForm$1;
var stockAdjustment$1 = { update: Object.assign(update$1, update$1) };
//#endregion
//#region resources/js/routes/admin/product-variants/index.ts
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/product-variants"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::index
* @see app/Http/Controllers/Admin/ProductVariantController.php:16
* @route '/admin/product-variants'
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
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
var create = (options) => ({
	url: create.url(options),
	method: "get"
});
create.definition = {
	methods: ["get", "head"],
	url: "/admin/product-variants/create"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
create.url = (options) => {
	return create.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
create.get = (options) => ({
	url: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
create.head = (options) => ({
	url: create.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
var createForm = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
createForm.get = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::create
* @see app/Http/Controllers/Admin/ProductVariantController.php:21
* @route '/admin/product-variants/create'
*/
createForm.head = (options) => ({
	action: create.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
create.form = createForm;
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::store
* @see app/Http/Controllers/Admin/ProductVariantController.php:31
* @route '/admin/product-variants'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/product-variants"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::store
* @see app/Http/Controllers/Admin/ProductVariantController.php:31
* @route '/admin/product-variants'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::store
* @see app/Http/Controllers/Admin/ProductVariantController.php:31
* @route '/admin/product-variants'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::store
* @see app/Http/Controllers/Admin/ProductVariantController.php:31
* @route '/admin/product-variants'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::store
* @see app/Http/Controllers/Admin/ProductVariantController.php:31
* @route '/admin/product-variants'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
*/
var edit = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/admin/product-variants/{productVariant}/edit"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
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
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
*/
edit.get = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
*/
edit.head = (args, options) => ({
	url: edit.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
*/
var editForm = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
*/
editForm.get = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::edit
* @see app/Http/Controllers/Admin/ProductVariantController.php:38
* @route '/admin/product-variants/{productVariant}/edit'
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
* @see \App\Http\Controllers\Admin\ProductVariantController::update
* @see app/Http/Controllers/Admin/ProductVariantController.php:48
* @route '/admin/product-variants/{productVariant}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/product-variants/{productVariant}"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::update
* @see app/Http/Controllers/Admin/ProductVariantController.php:48
* @route '/admin/product-variants/{productVariant}'
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
* @see \App\Http\Controllers\Admin\ProductVariantController::update
* @see app/Http/Controllers/Admin/ProductVariantController.php:48
* @route '/admin/product-variants/{productVariant}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::update
* @see app/Http/Controllers/Admin/ProductVariantController.php:48
* @route '/admin/product-variants/{productVariant}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::update
* @see app/Http/Controllers/Admin/ProductVariantController.php:48
* @route '/admin/product-variants/{productVariant}'
*/
updateForm.put = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::destroy
* @see app/Http/Controllers/Admin/ProductVariantController.php:55
* @route '/admin/product-variants/{productVariant}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/product-variants/{productVariant}"
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::destroy
* @see app/Http/Controllers/Admin/ProductVariantController.php:55
* @route '/admin/product-variants/{productVariant}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { productVariant: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { productVariant: args.id };
	if (Array.isArray(args)) args = { productVariant: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { productVariant: typeof args.productVariant === "object" ? args.productVariant.id : args.productVariant };
	return destroy.definition.url.replace("{productVariant}", parsedArgs.productVariant.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::destroy
* @see app/Http/Controllers/Admin/ProductVariantController.php:55
* @route '/admin/product-variants/{productVariant}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::destroy
* @see app/Http/Controllers/Admin/ProductVariantController.php:55
* @route '/admin/product-variants/{productVariant}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\ProductVariantController::destroy
* @see app/Http/Controllers/Admin/ProductVariantController.php:55
* @route '/admin/product-variants/{productVariant}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var stockAdjustment = (args, options) => ({
	url: stockAdjustment.url(args, options),
	method: "get"
});
stockAdjustment.definition = {
	methods: ["get", "head"],
	url: "/admin/product-variants/{productVariant}/stock-adjustment"
};
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
stockAdjustment.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { productVariant: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { productVariant: args.id };
	if (Array.isArray(args)) args = { productVariant: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { productVariant: typeof args.productVariant === "object" ? args.productVariant.id : args.productVariant };
	return stockAdjustment.definition.url.replace("{productVariant}", parsedArgs.productVariant.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
stockAdjustment.get = (args, options) => ({
	url: stockAdjustment.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
stockAdjustment.head = (args, options) => ({
	url: stockAdjustment.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
var stockAdjustmentForm = (args, options) => ({
	action: stockAdjustment.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
stockAdjustmentForm.get = (args, options) => ({
	action: stockAdjustment.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StockController::stockAdjustment
* @see app/Http/Controllers/Admin/StockController.php:20
* @route '/admin/product-variants/{productVariant}/stock-adjustment'
*/
stockAdjustmentForm.head = (args, options) => ({
	action: stockAdjustment.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
stockAdjustment.form = stockAdjustmentForm;
var productVariants = {
	index: Object.assign(index, index),
	create: Object.assign(create, create),
	store: Object.assign(store, store),
	edit: Object.assign(edit, edit),
	update: Object.assign(update, update),
	destroy: Object.assign(destroy, destroy),
	stockAdjustment: Object.assign(stockAdjustment, stockAdjustment$1)
};
//#endregion
export { productVariants as a, update as c, index as i, destroy as n, stockAdjustment as o, edit as r, store as s, create as t };

//# sourceMappingURL=product-variants-Bnlwplr7.js.map