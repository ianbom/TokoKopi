import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
//#region resources/js/routes/admin/settings/index.ts
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/admin/settings"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
var indexForm = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
*/
indexForm.get = (options) => ({
	action: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::index
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings'
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
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:19
* @route '/admin/settings'
*/
var update = (options) => ({
	url: update.url(options),
	method: "put"
});
update.definition = {
	methods: ["put"],
	url: "/admin/settings"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:19
* @route '/admin/settings'
*/
update.url = (options) => {
	return update.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:19
* @route '/admin/settings'
*/
update.put = (options) => ({
	url: update.url(options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:19
* @route '/admin/settings'
*/
var updateForm = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::update
* @see app/Http/Controllers/Admin/SettingController.php:19
* @route '/admin/settings'
*/
updateForm.put = (options) => ({
	action: update.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "PUT",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "post"
});
update.form = updateForm;
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
var store = (options) => ({
	url: store.url(options),
	method: "get"
});
store.definition = {
	methods: ["get", "head"],
	url: "/admin/settings/store"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
store.get = (options) => ({
	url: store.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
store.head = (options) => ({
	url: store.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
storeForm.get = (options) => ({
	action: store.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::store
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/store'
*/
storeForm.head = (options) => ({
	action: store.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
store.form = storeForm;
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
var contact = (options) => ({
	url: contact.url(options),
	method: "get"
});
contact.definition = {
	methods: ["get", "head"],
	url: "/admin/settings/contact"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
contact.url = (options) => {
	return contact.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
contact.get = (options) => ({
	url: contact.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
contact.head = (options) => ({
	url: contact.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
var contactForm = (options) => ({
	action: contact.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
contactForm.get = (options) => ({
	action: contact.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::contact
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/contact'
*/
contactForm.head = (options) => ({
	action: contact.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
contact.form = contactForm;
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
var payment = (options) => ({
	url: payment.url(options),
	method: "get"
});
payment.definition = {
	methods: ["get", "head"],
	url: "/admin/settings/payment"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
payment.url = (options) => {
	return payment.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
payment.get = (options) => ({
	url: payment.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
payment.head = (options) => ({
	url: payment.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
var paymentForm = (options) => ({
	action: payment.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
paymentForm.get = (options) => ({
	action: payment.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::payment
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/payment'
*/
paymentForm.head = (options) => ({
	action: payment.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
payment.form = paymentForm;
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
var shipping = (options) => ({
	url: shipping.url(options),
	method: "get"
});
shipping.definition = {
	methods: ["get", "head"],
	url: "/admin/settings/shipping"
};
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
shipping.url = (options) => {
	return shipping.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
shipping.get = (options) => ({
	url: shipping.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
shipping.head = (options) => ({
	url: shipping.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
var shippingForm = (options) => ({
	action: shipping.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
shippingForm.get = (options) => ({
	action: shipping.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Admin\SettingController::shipping
* @see app/Http/Controllers/Admin/SettingController.php:14
* @route '/admin/settings/shipping'
*/
shippingForm.head = (options) => ({
	action: shipping.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
shipping.form = shippingForm;
var settings = {
	index: Object.assign(index, index),
	update: Object.assign(update, update),
	store: Object.assign(store, store),
	contact: Object.assign(contact, contact),
	payment: Object.assign(payment, payment),
	shipping: Object.assign(shipping, shipping)
};
//#endregion
export { settings as t };

//# sourceMappingURL=settings-CyfKnAnW.js.map