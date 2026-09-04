import { t as Button } from "./button-Cl3HFMpR.js";
import { l as logout } from "./routes-BtCAeSqc.js";
import { t as Spinner } from "./spinner-BgL9gHXF.js";
import { t as TextLink } from "./text-link-BHpCp7gT.js";
import { t as send } from "./verification-DeJjgmgy.js";
import { Form, Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/auth/verify-email.tsx
function VerifyEmail({ status }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Verifikasi email" }),
		status === "verification-link-sent" && /* @__PURE__ */ jsx("div", {
			className: "mb-6 border border-primary/30 bg-primary-soft px-4 py-3 text-[12px] leading-5 text-primary",
			children: "Email verifikasi terkirim. Periksa kotak masuk dan klik tautan untuk mengaktifkan akunmu."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-7 space-y-4 text-[12px] leading-6 text-ink/65",
			children: [/* @__PURE__ */ jsx("p", { children: "Kami mengirim tautan verifikasi ke alamat email yang dipakai saat registrasi. Akunmu siap digunakan setelah tautan tersebut dibuka." }), /* @__PURE__ */ jsxs("div", {
				className: "border border-hairline-strong bg-surface-soft px-4 py-3 text-left",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-ink",
					children: "Tidak menerima email?"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-2 list-disc space-y-1 pl-4",
					children: [
						/* @__PURE__ */ jsx("li", { children: "Periksa folder spam, promosi, atau junk." }),
						/* @__PURE__ */ jsx("li", { children: "Tunggu beberapa menit sebelum meminta tautan baru." }),
						/* @__PURE__ */ jsx("li", { children: "Gunakan tombol di bawah untuk mengirim ulang email verifikasi." })
					]
				})]
			})]
		}),
		/* @__PURE__ */ jsx(Form, {
			...send.form(),
			className: "space-y-5 text-center",
			children: ({ processing }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Button, {
				disabled: processing,
				className: "h-12 w-full rounded-none bg-primary text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-none hover:bg-primary-hover focus-visible:ring-0",
				children: [processing && /* @__PURE__ */ jsx(Spinner, {}), processing ? "Mengirim email verifikasi..." : "Kirim ulang email verifikasi"]
			}), /* @__PURE__ */ jsx(TextLink, {
				href: logout(),
				className: "mx-auto block text-[12px] font-semibold text-primary no-underline hover:text-primary-hover",
				children: "Keluar"
			})] })
		})
	] });
}
VerifyEmail.layout = {
	title: "Verifikasi email",
	description: "Periksa kotak masuk dan klik tautan verifikasi untuk mengaktifkan akunmu."
};
//#endregion
export { VerifyEmail as default };

//# sourceMappingURL=verify-email-FVl0ESJ3.js.map