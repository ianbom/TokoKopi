import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/stories/index.ts
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/stories"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::index
* @see app/Http/Controllers/Admin/StoryController.php:15
* @route '/admin/stories'
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
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
var create = (options) => ({
	url: create.url(options),
	method: "get"
});
create.definition = {
	methods: ["get", "head"],
	url: "/admin/stories/create"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
create.url = (options) => {
	return create.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
create.get = (options) => ({
	url: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
create.head = (options) => ({
	url: create.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
var createForm = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
*/
createForm.get = (options) => ({
	action: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::create
* @see app/Http/Controllers/Admin/StoryController.php:20
* @route '/admin/stories/create'
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
* @see \App\Http\Controllers\Admin\StoryController::store
* @see app/Http/Controllers/Admin/StoryController.php:30
* @route '/admin/stories'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/admin/stories"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::store
* @see app/Http/Controllers/Admin/StoryController.php:30
* @route '/admin/stories'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::store
* @see app/Http/Controllers/Admin/StoryController.php:30
* @route '/admin/stories'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::store
* @see app/Http/Controllers/Admin/StoryController.php:30
* @route '/admin/stories'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::store
* @see app/Http/Controllers/Admin/StoryController.php:30
* @route '/admin/stories'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
var edit = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
edit.definition = {
	methods: ["get", "head"],
	url: "/admin/stories/{story}/edit"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
edit.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { story: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { story: args.id };
	if (Array.isArray(args)) args = { story: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { story: typeof args.story === "object" ? args.story.id : args.story };
	return edit.definition.url.replace("{story}", parsedArgs.story.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
edit.get = (args, options) => ({
	url: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
edit.head = (args, options) => ({
	url: edit.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
var editForm = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
*/
editForm.get = (args, options) => ({
	action: edit.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::edit
* @see app/Http/Controllers/Admin/StoryController.php:25
* @route '/admin/stories/{story}/edit'
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
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put", "patch"],
	url: "/admin/stories/{story}"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { story: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { story: args.id };
	if (Array.isArray(args)) args = { story: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { story: typeof args.story === "object" ? args.story.id : args.story };
	return update.definition.url.replace("{story}", parsedArgs.story.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
update.patch = (args, options) => ({
	url: update.url(args, options),
	method: "patch"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
var updateForm = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
updateForm.put = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::update
* @see app/Http/Controllers/Admin/StoryController.php:37
* @route '/admin/stories/{story}'
*/
updateForm.patch = (args, options) => ({
	action: update.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PATCH",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Admin\StoryController::destroy
* @see app/Http/Controllers/Admin/StoryController.php:44
* @route '/admin/stories/{story}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/admin/stories/{story}"
};
/**
* @see \App\Http\Controllers\Admin\StoryController::destroy
* @see app/Http/Controllers/Admin/StoryController.php:44
* @route '/admin/stories/{story}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { story: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { story: args.id };
	if (Array.isArray(args)) args = { story: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { story: typeof args.story === "object" ? args.story.id : args.story };
	return destroy.definition.url.replace("{story}", parsedArgs.story.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\StoryController::destroy
* @see app/Http/Controllers/Admin/StoryController.php:44
* @route '/admin/stories/{story}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::destroy
* @see app/Http/Controllers/Admin/StoryController.php:44
* @route '/admin/stories/{story}'
*/
var destroyForm = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\StoryController::destroy
* @see app/Http/Controllers/Admin/StoryController.php:44
* @route '/admin/stories/{story}'
*/
destroyForm.delete = (args, options) => ({
	action: destroy.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "DELETE",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
destroy.form = destroyForm;
var stories = {
	index: Object.assign(index, index),
	create: Object.assign(create, create),
	store: Object.assign(store, store),
	edit: Object.assign(edit, edit),
	update: Object.assign(update, update),
	destroy: Object.assign(destroy, destroy)
};
//#endregion
export { store as a, index as i, destroy as n, stories as o, edit as r, update as s, create as t };

//# sourceMappingURL=stories-Ct4Uwes2.js.map