import { t as Button } from "./button-Cl3HFMpR.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { t as PasswordInput } from "./password-input-C9Jwud2a.js";
import { t as Spinner } from "./spinner-BgL9gHXF.js";
import { n as store } from "./confirm-BFE5c2Wk.js";
import { Form, Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/auth/confirm-password.tsx
function ConfirmPassword() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Konfirmasi kata sandi" }), /* @__PURE__ */ jsx(Form, {
		...store.form(),
		resetOnSuccess: ["password"],
		children: ({ processing, errors }) => /* @__PURE__ */ jsxs("div", {
			className: "space-y-7",
			children: [/* @__PURE__ */ jsxs("div", {
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
						placeholder: "Kata sandi",
						autoComplete: "current-password",
						autoFocus: true,
						className: "h-12 rounded-none border-hairline-strong bg-canvas pr-12 text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
					}),
					/* @__PURE__ */ jsx(InputError, { message: errors.password })
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center",
				children: /* @__PURE__ */ jsxs(Button, {
					className: "h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
					disabled: processing,
					"data-test": "confirm-password-button",
					children: [processing && /* @__PURE__ */ jsx(Spinner, {}), "Konfirmasi kata sandi"]
				})
			})]
		})
	})] });
}
ConfirmPassword.layout = {
	title: "Konfirmasi kata sandi",
	description: "Ini area aman aplikasi. Konfirmasi kata sandi sebelum melanjutkan."
};
//#endregion
export { ConfirmPassword as default };

//# sourceMappingURL=confirm-password-CN5ufcrN.js.map