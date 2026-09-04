import { t as cn } from "./utils-DJjaB2Tv.js";
import { t as Button } from "./button-Cl3HFMpR.js";
import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
import { h as register, o as home } from "./routes-BtCAeSqc.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as PasswordInput } from "./password-input-C9Jwud2a.js";
import { t as Spinner } from "./spinner-BgL9gHXF.js";
import { t as TextLink } from "./text-link-BHpCp7gT.js";
import { n as request } from "./password-ChThItA7.js";
import { Form, Head } from "@inertiajs/react";
import "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { CheckIcon } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
//#region resources/js/components/ui/checkbox.tsx
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ jsx(CheckboxPrimitive.Root, {
		"data-slot": "checkbox",
		className: cn("peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "flex items-center justify-center text-current transition-none",
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
		})
	});
}
//#endregion
//#region resources/js/routes/auth/google/index.ts
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
var redirect = (options) => ({
	url: redirect.url(options),
	method: "get"
});
redirect.definition = {
	methods: ["get", "head"],
	url: "/auth/google"
};
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
redirect.url = (options) => {
	return redirect.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
redirect.get = (options) => ({
	url: redirect.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
redirect.head = (options) => ({
	url: redirect.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
var redirectForm = (options) => ({
	action: redirect.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
redirectForm.get = (options) => ({
	action: redirect.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::redirect
* @see app/Http/Controllers/Auth/GoogleAuthController.php:15
* @route '/auth/google'
*/
redirectForm.head = (options) => ({
	action: redirect.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
redirect.form = redirectForm;
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
var callback = (options) => ({
	url: callback.url(options),
	method: "get"
});
callback.definition = {
	methods: ["get", "head"],
	url: "/auth/google/callback"
};
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
callback.url = (options) => {
	return callback.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
callback.get = (options) => ({
	url: callback.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
callback.head = (options) => ({
	url: callback.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
var callbackForm = (options) => ({
	action: callback.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
callbackForm.get = (options) => ({
	action: callback.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Auth\GoogleAuthController::callback
* @see app/Http/Controllers/Auth/GoogleAuthController.php:20
* @route '/auth/google/callback'
*/
callbackForm.head = (options) => ({
	action: callback.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
callback.form = callbackForm;
Object.assign(redirect, redirect), Object.assign(callback, callback);
//#endregion
//#region resources/js/routes/login/index.ts
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/login"
};
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::store
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:58
* @route '/login'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
Object.assign(store, store);
//#endregion
//#region resources/js/pages/auth/login.tsx
function Login({ status, canResetPassword, canRegister }) {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Masuk" }), /* @__PURE__ */ jsx(Form, {
		...store.form(),
		resetOnSuccess: ["password"],
		className: "flex flex-col gap-5",
		children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
			status && /* @__PURE__ */ jsx("div", {
				className: "border border-primary-border bg-primary-soft px-4 py-3 text-[11px] leading-5 text-ink",
				children: status
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2.5",
						children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "email",
								className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
								children: "Alamat email"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "email",
								type: "email",
								name: "email",
								required: true,
								autoFocus: true,
								tabIndex: 1,
								autoComplete: "email",
								placeholder: "nama@email.com",
								className: "h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
							}),
							/* @__PURE__ */ jsx(InputError, { message: errors.email })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "password",
									className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
									children: "Kata sandi"
								}), canResetPassword && /* @__PURE__ */ jsx(TextLink, {
									href: request(),
									className: "text-[9px] font-semibold tracking-[0.08em] text-primary uppercase no-underline hover:text-primary-hover",
									tabIndex: 5,
									children: "Lupa kata sandi?"
								})]
							}),
							/* @__PURE__ */ jsx(PasswordInput, {
								id: "password",
								name: "password",
								required: true,
								tabIndex: 2,
								autoComplete: "current-password",
								placeholder: "Masukkan kata sandi",
								className: "h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
							}),
							/* @__PURE__ */ jsx(InputError, { message: errors.password })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 pt-1",
						children: [/* @__PURE__ */ jsx(Checkbox, {
							id: "remember",
							name: "remember",
							tabIndex: 3,
							className: "size-4 rounded-none border-ink data-[state=checked]:border-primary data-[state=checked]:bg-primary"
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "remember",
							className: "text-[12px] text-ink/75",
							children: "Ingat saya"
						})]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						className: "mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
						tabIndex: 4,
						disabled: processing,
						"data-test": "login-button",
						children: [processing && /* @__PURE__ */ jsx(Spinner, {}), "Masuk"]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative py-1 text-center",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-1/2 border-t border-hairline" }), /* @__PURE__ */ jsx("span", {
					className: "relative bg-canvas px-4 text-[10px] text-ink/55",
					children: "atau"
				})]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "button",
				variant: "outline",
				className: "h-12 w-full rounded-none border-ink bg-transparent text-[10px] font-semibold tracking-[0.08em] text-ink uppercase shadow-none hover:bg-ink hover:text-canvas",
				tabIndex: 1,
				onClick: () => {
					window.location.href = redirect.url();
				},
				children: [/* @__PURE__ */ jsx("svg", {
					"aria-hidden": "true",
					className: "size-4",
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ jsx("path", {
						fill: "currentColor",
						d: "M21.35 11.1h-9.18v2.98h5.29c-.23 1.6-1.6 4.69-5.29 4.69-3.18 0-5.78-2.63-5.78-5.88S8.99 7 12.17 7c1.81 0 3.03.77 3.72 1.44l2.53-2.44c-1.62-1.51-3.72-2.44-6.25-2.44C7.01 3.56 2.82 7.74 2.82 12.9s4.19 9.34 9.35 9.34c5.39 0 8.96-3.79 8.96-9.13 0-.61-.07-1.08-.15-1.55z"
					})
				}), "Masuk dengan Google"]
			}),
			canRegister && /* @__PURE__ */ jsxs("p", {
				className: "text-center text-[12px] text-ink/65",
				children: [
					"Belum punya akun?",
					" ",
					/* @__PURE__ */ jsx(TextLink, {
						href: register(),
						tabIndex: 5,
						className: "font-semibold text-primary no-underline hover:text-primary-hover",
						children: "Buat akun"
					})
				]
			})
		] })
	})] });
}
Login.layout = {
	title: "Masuk",
	description: "Masuk untuk menyimpan ritual kopi dan melanjutkan pesanan Anda.",
	breadcrumbs: [
		{
			label: "Beranda",
			href: home()
		},
		{ label: "Akun" },
		{ label: "Masuk" }
	]
};
//#endregion
export { Login as default };

//# sourceMappingURL=login-DhWerEqA.js.map