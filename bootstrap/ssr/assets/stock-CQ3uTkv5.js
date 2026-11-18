import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/stock/index.ts
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
var stock = { index: Object.assign(index, index) };
//#endregion
export { stock as n, index as t };

//# sourceMappingURL=stock-CQ3uTkv5.js.map