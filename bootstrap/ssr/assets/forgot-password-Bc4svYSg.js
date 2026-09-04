import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { c as login } from "./routes-BtCAeSqc.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { t as TextLink } from "./text-link-BHpCp7gT.js";
import { t as email } from "./password-ChThItA7.js";
import { Form, Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { LoaderCircle } from "lucide-react";
//#region resources/js/pages/auth/forgot-password.tsx
function ForgotPassword({ status }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Lupa kata sandi" }),
		status && /* @__PURE__ */ jsx("div", {
			className: "mb-6 border border-primary/30 bg-primary-soft px-4 py-3 text-[12px] leading-5 text-primary",
			children: status
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-7",
			children: [/* @__PURE__ */ jsx(Form, {
				...email.form(),
				children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ jsx(Label, {
							htmlFor: "email",
							className: "text-[10px] font-semibold tracking-[0.08em] uppercase",
							children: "Alamat email"
						}),
						/* @__PURE__ */ jsx(Input, {
							id: "email",
							type: "email",
							name: "email",
							autoComplete: "off",
							autoFocus: true,
							placeholder: "email@example.com",
							className: "h-12 rounded-none border-hairline-strong bg-canvas text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
						}),
						/* @__PURE__ */ jsx(InputError, { message: errors.email })
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-7 flex items-center justify-start",
					children: /* @__PURE__ */ jsxs(Button, {
						className: "h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
						disabled: processing,
						"data-test": "email-password-reset-link-button",
						children: [processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Kirim tautan reset kata sandi"]
					})
				})] })
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-x-1 text-center text-[12px] text-ink/65",
				children: [/* @__PURE__ */ jsx("span", { children: "Atau, kembali ke" }), /* @__PURE__ */ jsx(TextLink, {
					href: login(),
					className: "font-semibold text-primary no-underline hover:text-primary-hover",
					children: "masuk"
				})]
			})]
		})
	] });
}
ForgotPassword.layout = {
	title: "Lupa kata sandi",
	description: "Masukkan email untuk menerima tautan reset kata sandi"
};
//#endregion
export { ForgotPassword as default };

//# sourceMappingURL=forgot-password-Bc4svYSg.js.map