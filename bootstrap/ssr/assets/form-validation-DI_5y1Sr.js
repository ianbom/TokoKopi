import { useEffect, useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/components/form-validation.tsx
var controls = "input:not([type=\"hidden\"]), select, textarea, [contenteditable=\"true\"], [role=\"checkbox\"]";
function focusField(name) {
	let field = null;
	let key = name;
	while (key && !field) {
		field = document.querySelector(`[data-field="${CSS.escape(key)}"]`);
		key = key.includes(".") ? key.slice(0, key.lastIndexOf(".")) : "";
	}
	const control = field?.querySelector(controls) ?? field?.querySelector("button");
	control?.focus({ preventScroll: true });
	field?.scrollIntoView({
		block: "center",
		behavior: "instant"
	});
	return Boolean(control);
}
function FormErrorSummary({ errors }) {
	const summary = useRef(null);
	const entries = Object.entries(errors).filter((entry) => Boolean(entry[1]));
	useEffect(() => {
		const first = Object.keys(errors).find((key) => errors[key]);
		if (first && !focusField(first)) summary.current?.focus();
	}, [errors]);
	if (!entries.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		ref: summary,
		tabIndex: -1,
		role: "alert",
		"aria-label": "Form belum dapat disimpan",
		className: "border border-destructive bg-destructive/5 p-4 text-sm",
		children: [/* @__PURE__ */ jsx("p", {
			className: "font-semibold",
			children: "Periksa input berikut. Data yang sudah diisi tetap tersimpan di form."
		}), /* @__PURE__ */ jsx("ul", {
			className: "mt-2 list-disc space-y-1 pl-5",
			children: entries.map(([name, message]) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "text-left underline underline-offset-2",
				onClick: () => focusField(name),
				children: message
			}) }, name))
		})]
	});
}
function FormField({ name, label, error, className = "", children, required = false, requiredIndicator = "text", showOptionalIndicator = true }) {
	const identifier = useId();
	const field = useRef(null);
	useEffect(() => {
		field.current?.querySelectorAll(controls).forEach((control, index) => {
			if (!(control instanceof HTMLInputElement && ["checkbox", "radio"].includes(control.type))) {
				if (index === 0) control.id = `${identifier}-input`;
				control.setAttribute("aria-labelledby", `${identifier}-label`);
			}
			control.setAttribute("aria-invalid", error ? "true" : "false");
			if (requiredIndicator === "asterisk") {
				control.setAttribute("aria-required", String(required));
				if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) control.required = required;
			}
			if (error) control.setAttribute("aria-describedby", `${identifier}-error`);
			else control.removeAttribute("aria-describedby");
		});
	}, [
		identifier,
		error,
		children,
		required,
		requiredIndicator
	]);
	return /* @__PURE__ */ jsxs("div", {
		ref: field,
		"data-field": name,
		className: `grid gap-1.5 ${className}`,
		children: [
			/* @__PURE__ */ jsxs("label", {
				id: `${identifier}-label`,
				htmlFor: `${identifier}-input`,
				className: "text-sm font-medium",
				children: [label, required && requiredIndicator === "asterisk" ? /* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					className: "ml-1 text-destructive",
					children: "*"
				}) : !required && !showOptionalIndicator ? "" : ` (${required ? "wajib" : "opsional"})`]
			}),
			children,
			error && /* @__PURE__ */ jsx("p", {
				id: `${identifier}-error`,
				className: "text-sm text-destructive",
				children: error
			})
		]
	});
}
//#endregion
export { FormField as n, FormErrorSummary as t };

//# sourceMappingURL=form-validation-DI_5y1Sr.js.map