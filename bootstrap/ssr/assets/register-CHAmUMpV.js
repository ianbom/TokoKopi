import { t as Button } from "./button-Cl3HFMpR.js";
import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
import { c as login, o as home } from "./routes-BtCAeSqc.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as PasswordInput } from "./password-input-C9Jwud2a.js";
import { t as Spinner } from "./spinner-BgL9gHXF.js";
import { t as TextLink } from "./text-link-BHpCp7gT.js";
import { Form, Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/routes/register/index.ts
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
* @route '/register'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/register"
};
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
* @route '/register'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
* @route '/register'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
* @route '/register'
*/
var storeForm = (options) => ({
	action: store.url(options),
	method: "post"
});
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::store
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:53
* @route '/register'
*/
storeForm.post = (options) => ({
	action: store.url(options),
	method: "post"
});
store.form = storeForm;
Object.assign(store, store);
//#endregion
//#region resources/js/pages/auth/register.tsx
function Register() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Daftar" }), /* @__PURE__ */ jsx(Form, {
		...store.form(),
		resetOnSuccess: ["password", "password_confirmation"],
		disableWhileProcessing: true,
		className: "flex flex-col gap-5",
		children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-2.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "name",
							className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
							children: "Nama lengkap"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "name",
							type: "text",
							required: true,
							autoFocus: true,
							tabIndex: 1,
							autoComplete: "name",
							name: "name",
							placeholder: "Masukkan nama lengkap",
							className: "h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
						}),
						/* @__PURE__ */ jsx(InputError, {
							message: errors.name,
							className: "mt-0"
						})
					]
				}),
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
							required: true,
							tabIndex: 2,
							autoComplete: "email",
							name: "email",
							placeholder: "nama@email.com",
							className: "h-[48px] w-full border border-hairline-strong bg-canvas px-4 text-[13px] outline-none placeholder:text-ink/40 focus:border-ink"
						}),
						/* @__PURE__ */ jsx(InputError, { message: errors.email })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-2.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "password",
							className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
							children: "Kata sandi"
						}),
						/* @__PURE__ */ jsx(PasswordInput, {
							id: "password",
							required: true,
							tabIndex: 3,
							autoComplete: "new-password",
							name: "password",
							placeholder: "Buat kata sandi",
							className: "h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
						}),
						/* @__PURE__ */ jsx(InputError, { message: errors.password })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-2.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "password_confirmation",
							className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
							children: "Konfirmasi kata sandi"
						}),
						/* @__PURE__ */ jsx(PasswordInput, {
							id: "password_confirmation",
							required: true,
							tabIndex: 4,
							autoComplete: "new-password",
							name: "password_confirmation",
							placeholder: "Ulangi kata sandi",
							className: "h-[48px] rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
						}),
						/* @__PURE__ */ jsx(InputError, { message: errors.password_confirmation })
					]
				}),
				/* @__PURE__ */ jsxs(Button, {
					type: "submit",
					className: "mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
					tabIndex: 5,
					disabled: processing,
					"data-test": "register-user-button",
					children: [processing && /* @__PURE__ */ jsx(Spinner, {}), "Buat akun"]
				})
			]
		}), /* @__PURE__ */ jsxs("p", {
			className: "text-center text-[12px] text-ink/65",
			children: [
				"Sudah punya akun?",
				" ",
				/* @__PURE__ */ jsx(TextLink, {
					href: login(),
					tabIndex: 6,
					className: "font-semibold text-primary no-underline hover:text-primary-hover",
					children: "Masuk"
				})
			]
		})] })
	})] });
}
Register.layout = {
	title: "Buat Akun",
	description: "Simpan preferensi kopi dan buat setiap pembelian lebih mudah.",
	breadcrumbs: [
		{
			label: "Beranda",
			href: home()
		},
		{ label: "Akun" },
		{ label: "Daftar" }
	]
};
//#endregion
export { Register as default };

//# sourceMappingURL=register-CHAmUMpV.js.map