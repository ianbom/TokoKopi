import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/categories/index.ts
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/categories"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::index
* @see app/Http/Controllers/Admin/CategoryController.php:15
* @route '/admin/categories'
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
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
var create = (options) => ({
	url: create.url(options),
	method: "get"
});
create.definition = {
	methods: ["get", "head"],
	url: "/admin/categories/create"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
create.url = (options) => {
	return create.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
create.get = (options) => ({
	url: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
create.head = (options) => ({
	url: create.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
var createForm = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
*/
createForm.get = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::create
* @see app/Http/Controllers/Admin/CategoryController.php:20
* @route '/admin/categories/create'
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
* @see \App\Http\Controllers\Admin\CategoryController::store
* @see app/Http/Controllers/Admin/CategoryController.php:28
* @route '/admin/categories'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/categories"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::store
* @see app/Http/Controllers/Admin/CategoryController.php:28
* @route '/admin/categories'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::store
* @see app/Http/Controllers/Admin/CategoryController.php:28
* @route '/admin/categories'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::store
* @see app/Http/Controllers/Admin/CategoryController.php:28
* @route '/admin/categories'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::store
* @see app/Http/Controllers/Admin/CategoryController.php:28
* @route '/admin/categories'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
var edit = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/admin/categories/{category}/edit"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
edit.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { category: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { category: args.id };
	if (Array.isArray(args)) args = { category: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { category: typeof args.category === "object" ? args.category.id : args.category };
	return edit.definition.url.replace("{category}", parsedArgs.category.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
edit.get = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
edit.head = (args, options) => ({
	url: edit.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
var editForm = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
*/
editForm.get = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::edit
* @see app/Http/Controllers/Admin/CategoryController.php:35
* @route '/admin/categories/{category}/edit'
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
* @see \App\Http\Controllers\Admin\CategoryController::update
* @see app/Http/Controllers/Admin/CategoryController.php:43
* @route '/admin/categories/{category}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/categories/{category}"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::update
* @see app/Http/Controllers/Admin/CategoryController.php:43
* @route '/admin/categories/{category}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { category: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { category: args.id };
	if (Array.isArray(args)) args = { category: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { category: typeof args.category === "object" ? args.category.id : args.category };
	return update.definition.url.replace("{category}", parsedArgs.category.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::update
* @see app/Http/Controllers/Admin/CategoryController.php:43
* @route '/admin/categories/{category}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::update
* @see app/Http/Controllers/Admin/CategoryController.php:43
* @route '/admin/categories/{category}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::update
* @see app/Http/Controllers/Admin/CategoryController.php:43
* @route '/admin/categories/{category}'
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
* @see \App\Http\Controllers\Admin\CategoryController::destroy
* @see app/Http/Controllers/Admin/CategoryController.php:50
* @route '/admin/categories/{category}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/categories/{category}"
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::destroy
* @see app/Http/Controllers/Admin/CategoryController.php:50
* @route '/admin/categories/{category}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { category: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { category: args.id };
	if (Array.isArray(args)) args = { category: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { category: typeof args.category === "object" ? args.category.id : args.category };
	return destroy.definition.url.replace("{category}", parsedArgs.category.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\CategoryController::destroy
* @see app/Http/Controllers/Admin/CategoryController.php:50
* @route '/admin/categories/{category}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::destroy
* @see app/Http/Controllers/Admin/CategoryController.php:50
* @route '/admin/categories/{category}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\CategoryController::destroy
* @see app/Http/Controllers/Admin/CategoryController.php:50
* @route '/admin/categories/{category}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
var categories = {
	index: Object.assign(index, index),
	create: Object.assign(create, create),
	store: Object.assign(store, store),
	edit: Object.assign(edit, edit),
	update: Object.assign(update, update),
	destroy: Object.assign(destroy, destroy)
};
//#endregion
export { index as a, edit as i, create as n, destroy as r, categories as t };

//# sourceMappingURL=categories-D24WUaDg.js.map