import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/home-settings/index.ts
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/home-settings"
};
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::index
* @see app/Http/Controllers/Admin/HomeSettingController.php:13
* @route '/admin/home-settings'
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
* @see \App\Http\Controllers\Admin\HomeSettingController::update
* @see app/Http/Controllers/Admin/HomeSettingController.php:18
* @route '/admin/home-settings'
*/
var update = (options) => ({
	url: update.url(options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/home-settings"
};
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::update
* @see app/Http/Controllers/Admin/HomeSettingController.php:18
* @route '/admin/home-settings'
*/
update.url = (options) => {
	return update.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::update
* @see app/Http/Controllers/Admin/HomeSettingController.php:18
* @route '/admin/home-settings'
*/
update.put = (options) => ({
	url: update.url(options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::update
* @see app/Http/Controllers/Admin/HomeSettingController.php:18
* @route '/admin/home-settings'
*/
var updateForm = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\HomeSettingController::update
* @see app/Http/Controllers/Admin/HomeSettingController.php:18
* @route '/admin/home-settings'
*/
updateForm.put = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
var homeSettings = {
	index: Object.assign(index, index),
	update: Object.assign(update, update)
};
//#endregion
export { homeSettings as t };

//# sourceMappingURL=home-settings-BBvmTtBM.js.map