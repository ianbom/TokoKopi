import { n as queryParams, t as applyUrlDefaults } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/story/index.ts
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/story"
};
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::index
* @see app/Http/Controllers/StoryController.php:11
* @route '/story'
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
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
var show = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
show.definition = {
	methods: ["get", "head"],
	url: "/story/{slug}"
};
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
show.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { slug: args };
	if (Array.isArray(args)) args = { slug: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { slug: args.slug };
	return show.definition.url.replace("{slug}", parsedArgs.slug.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
show.get = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
show.head = (args, options) => ({
	url: show.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
var showForm = (args, options) => ({
	action: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
showForm.get = (args, options) => ({
	action: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\StoryController::show
* @see app/Http/Controllers/StoryController.php:30
* @route '/story/{slug}'
*/
showForm.head = (args, options) => ({
	action: show.url(args, { [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
show.form = showForm;
Object.assign(index, index), Object.assign(show, show);
//#endregion
export { show as n, index as t };

//# sourceMappingURL=story-DPEc1iBk.js.map