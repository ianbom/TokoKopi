import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/reports/index.ts
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
var index = (args, options) => ({
	url: index.url(args, options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/reports/{type}"
};
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
index.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { type: args };
	if (Array.isArray(args)) args = { type: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { type: args.type };
	return index.definition.url.replace("{type}", parsedArgs.type.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
index.get = (args, options) => ({
	url: index.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
index.head = (args, options) => ({
	url: index.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
var indexForm = (args, options) => ({
	action: index.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
indexForm.get = (args, options) => ({
	action: index.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::index
* @see app/Http/Controllers/Admin/ReportController.php:13
* @route '/admin/reports/{type}'
*/
indexForm.head = (args, options) => ({
	action: index.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
index.form = indexForm;
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
var exportMethod = (args, options) => ({
	url: exportMethod.url(args, options),
	method: "get"
});
exportMethod.definition = {
	methods: ["get", "head"],
	url: "/admin/reports/{type}/export"
};
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
exportMethod.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { type: args };
	if (Array.isArray(args)) args = { type: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { type: args.type };
	return exportMethod.definition.url.replace("{type}", parsedArgs.type.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
exportMethod.get = (args, options) => ({
	url: exportMethod.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
exportMethod.head = (args, options) => ({
	url: exportMethod.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
var exportMethodForm = (args, options) => ({
	action: exportMethod.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
exportMethodForm.get = (args, options) => ({
	action: exportMethod.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\ReportController::exportMethod
* @see app/Http/Controllers/Admin/ReportController.php:18
* @route '/admin/reports/{type}/export'
*/
exportMethodForm.head = (args, options) => ({
	action: exportMethod.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
exportMethod.form = exportMethodForm;
var reports = {
	index: Object.assign(index, index),
	export: Object.assign(exportMethod, exportMethod)
};
//#endregion
export { index as n, reports as r, exportMethod as t };

//# sourceMappingURL=reports-vaaoXKG8.js.map