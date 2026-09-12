import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { t as PasswordInput } from "./password-input-C9Jwud2a.js";
import { t as Spinner } from "./spinner-BgL9gHXF.js";
import { r as update } from "./password-ChThItA7.js";
import { Form, Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/auth/reset-password.tsx
function ResetPassword({ token, email }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Reset kata sandi" }),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-7 border border-hairline-strong bg-surface-soft px-4 py-3 text-[12px] leading-5 text-ink/65",
			children: [/* @__PURE__ */ jsx("p", {
				className: "font-semibold text-ink",
				children: "Buat kata sandi baru untuk akun ini."
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1",
				children: "Gunakan kata sandi yang belum pernah dipakai. Setelah reset selesai, masuk dengan kata sandi baru."
			})]
		}),
		/* @__PURE__ */ jsx(Form, {
			...update.form(),
			transform: (data) => ({
				...data,
				token,
				email
			}),
			resetOnSuccess: ["password", "password_confirmation"],
			children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", {
				className: "grid gap-7",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "email",
								className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
								children: "Email"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "email",
								type: "email",
								name: "email",
								autoComplete: "email",
								value: email,
								className: "h-12 rounded-none border-hairline-strong bg-oat text-[13px] text-ink/65 focus-visible:border-ink focus-visible:ring-0",
								readOnly: true
							}),
							/* @__PURE__ */ jsx(InputError, {
								message: errors.email,
								className: "mt-2"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] leading-5 text-ink/55",
								children: "Email ini berasal dari tautan reset dan tidak bisa diubah di sini."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "password",
								className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
								children: "Kata sandi"
							}),
							/* @__PURE__ */ jsx(PasswordInput, {
								id: "password",
								name: "password",
								autoComplete: "new-password",
								className: "h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0",
								autoFocus: true,
								placeholder: "Kata sandi"
							}),
							/* @__PURE__ */ jsx(InputError, { message: errors.password }),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] leading-5 text-ink/55",
								children: "Gunakan minimal 8 karakter dengan kombinasi huruf, angka, atau simbol."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "password_confirmation",
								className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
								children: "Konfirmasi kata sandi"
							}),
							/* @__PURE__ */ jsx(PasswordInput, {
								id: "password_confirmation",
								name: "password_confirmation",
								autoComplete: "new-password",
								className: "h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0",
								placeholder: "Konfirmasi kata sandi"
							}),
							/* @__PURE__ */ jsx(InputError, {
								message: errors.password_confirmation,
								className: "mt-2"
							})
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						className: "mt-1 h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
						disabled: processing,
						"data-test": "reset-password-button",
						children: [processing && /* @__PURE__ */ jsx(Spinner, {}), processing ? "Mereset kata sandi..." : "Reset kata sandi"]
					})
				]
			})
		})
	] });
}
ResetPassword.layout = {
	title: "Reset kata sandi",
	description: "Masukkan dan konfirmasi kata sandi baru untuk mengakses kembali akunmu."
};
//#endregion
export { ResetPassword as default };

//# sourceMappingURL=reset-password-DnbF9FgR.js.map