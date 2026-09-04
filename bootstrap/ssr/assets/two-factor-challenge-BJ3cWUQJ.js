import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { c as InputOTPGroup, l as InputOTPSlot, o as store, s as InputOTP } from "./use-two-factor-auth-DaoGLIGv.js";
import { Form, Head, setLayoutProps } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { REGEXP_ONLY_DIGITS } from "input-otp";
//#region resources/js/pages/auth/two-factor-challenge.tsx
function TwoFactorChallenge() {
	const [showRecoveryInput, setShowRecoveryInput] = useState(false);
	const [code, setCode] = useState("");
	const authConfigContent = useMemo(() => {
		if (showRecoveryInput) return {
			title: "Kode pemulihan",
			description: "Konfirmasi akses ke akunmu dengan memasukkan salah satu kode pemulihan darurat.",
			toggleText: "masuk memakai kode autentikasi"
		};
		return {
			title: "Kode autentikasi",
			description: "Masukkan kode autentikasi dari aplikasi autentikator.",
			toggleText: "masuk memakai kode pemulihan"
		};
	}, [showRecoveryInput]);
	setLayoutProps({
		title: authConfigContent.title,
		description: authConfigContent.description
	});
	const toggleRecoveryMode = (clearErrors) => {
		setShowRecoveryInput(!showRecoveryInput);
		clearErrors();
		setCode("");
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Autentikasi dua faktor" }), /* @__PURE__ */ jsx("div", {
		className: "space-y-7",
		children: /* @__PURE__ */ jsx(Form, {
			...store.form(),
			className: "space-y-6",
			resetOnError: true,
			resetOnSuccess: !showRecoveryInput,
			children: ({ errors, processing, clearErrors }) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
				showRecoveryInput ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Input, {
					name: "recovery_code",
					type: "text",
					placeholder: "Masukkan kode pemulihan",
					autoFocus: showRecoveryInput,
					required: true,
					className: "h-12 rounded-none border-hairline-strong bg-canvas text-[13px] placeholder:text-ink/40 focus-visible:border-ink focus-visible:ring-0"
				}), /* @__PURE__ */ jsx(InputError, { message: errors.recovery_code })] }) : /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center space-y-3 text-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex w-full items-center justify-center",
						children: /* @__PURE__ */ jsx(InputOTP, {
							name: "code",
							maxLength: 6,
							value: code,
							onChange: (value) => setCode(value),
							disabled: processing,
							pattern: REGEXP_ONLY_DIGITS,
							children: /* @__PURE__ */ jsx(InputOTPGroup, {
								className: "gap-2",
								children: Array.from({ length: 6 }, (_, index) => /* @__PURE__ */ jsx(InputOTPSlot, {
									index,
									className: "h-12 w-12 rounded-none border-hairline-strong bg-canvas text-[14px] text-ink shadow-none first:rounded-none last:rounded-none"
								}, index))
							})
						})
					}), /* @__PURE__ */ jsx(InputError, { message: errors.code })]
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					className: "h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
					disabled: processing,
					children: "Lanjutkan"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-center text-[12px] text-ink/65",
					children: [/* @__PURE__ */ jsx("span", { children: "atau kamu bisa " }), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "cursor-pointer font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary-hover",
						onClick: () => toggleRecoveryMode(clearErrors),
						children: authConfigContent.toggleText
					})]
				})
			] })
		})
	})] });
}
//#endregion
export { TwoFactorChallenge as default };

//# sourceMappingURL=two-factor-challenge-BJ3cWUQJ.js.map