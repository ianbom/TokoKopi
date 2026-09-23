import { t as cn } from "./utils-DJjaB2Tv.js";
import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-gF9YmbJt.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-DxD0CdJ4.js";
import { t as Label } from "./label-DK-3jehL.js";
import { t as homeSettings } from "./home-settings-BBvmTtBM.js";
import { Head, useForm } from "@inertiajs/react";
import * as React$1 from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
//#region resources/js/components/ui/textarea.tsx
var Textarea = React$1.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region resources/js/pages/admin/home-settings/index.tsx
var newSlide = (sortOrder) => ({
	image_url: "",
	alt_text: "",
	sort_order: sortOrder,
	is_active: true,
	image: null
});
function HomeSettingsIndex({ welcomeText, slides }) {
	const form = useForm({
		_method: "PUT",
		welcome_text: welcomeText,
		slides: slides.map((slide) => ({
			...slide,
			image: null
		}))
	});
	const updateSlide = (index, changes) => {
		form.setData("slides", form.data.slides.map((slide, slideIndex) => slideIndex === index ? {
			...slide,
			...changes
		} : slide));
	};
	const submit = (event) => {
		event.preventDefault();
		form.post(homeSettings.update.url(), { forceFormData: true });
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Home Setting" }), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col gap-6 p-4 md:p-6",
		children: [/* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm font-medium text-muted-foreground",
				children: "Content management"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Home Setting"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Atur judul dan carousel hero pada halaman utama."
			})
		] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "grid max-w-5xl gap-6",
			children: [
				/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, { children: "Welcome text" }), /* @__PURE__ */ jsx(CardDescription, { children: "Gunakan baris baru untuk mengatur pemenggalan judul." })] }), /* @__PURE__ */ jsxs(CardContent, {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ jsx(Label, {
							htmlFor: "welcome_text",
							children: "Hero heading"
						}),
						/* @__PURE__ */ jsx(Textarea, {
							id: "welcome_text",
							rows: 4,
							value: form.data.welcome_text,
							onChange: (event) => form.setData("welcome_text", event.target.value)
						}),
						/* @__PURE__ */ jsx(InputError, { message: form.errors.welcome_text })
					]
				})] }),
				/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, {
					className: "flex-row items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ jsx(CardTitle, { children: "Welcome carousel" }), /* @__PURE__ */ jsx(CardDescription, { children: "Upload gambar hero, atur urutan, lalu aktifkan slide yang tampil." })]
					}), /* @__PURE__ */ jsxs(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => form.setData("slides", [...form.data.slides, newSlide(form.data.slides.length + 1)]),
						children: [/* @__PURE__ */ jsx(Plus, {}), " Tambah slide"]
					})]
				}), /* @__PURE__ */ jsxs(CardContent, {
					className: "grid gap-4",
					children: [/* @__PURE__ */ jsx(InputError, { message: form.errors.slides }), form.data.slides.map((slide, index) => /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 border p-4 md:grid-cols-[11rem_minmax(0,1fr)]",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted",
							children: slide.image_url ? /* @__PURE__ */ jsx("img", {
								src: slide.image_url,
								alt: slide.alt_text || "Carousel preview",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ jsx(ImagePlus, { className: "size-7 text-muted-foreground" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ jsx(Label, { children: "Gambar" }),
										/* @__PURE__ */ jsx(Input, {
											type: "file",
											accept: "image/*",
											onChange: (event) => updateSlide(index, { image: event.target.files?.[0] ?? null })
										}),
										/* @__PURE__ */ jsx(InputError, { message: form.errors[`slides.${index}.image`] })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [
										/* @__PURE__ */ jsx(Label, { children: "Alt text" }),
										/* @__PURE__ */ jsx(Input, {
											value: slide.alt_text,
											onChange: (event) => updateSlide(index, { alt_text: event.target.value })
										}),
										/* @__PURE__ */ jsx(InputError, { message: form.errors[`slides.${index}.alt_text`] })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-end gap-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "grid gap-2",
											children: [/* @__PURE__ */ jsx(Label, { children: "Urutan" }), /* @__PURE__ */ jsx(Input, {
												type: "number",
												min: "0",
												className: "w-24",
												value: slide.sort_order,
												onChange: (event) => updateSlide(index, { sort_order: Number(event.target.value) })
											})]
										}),
										/* @__PURE__ */ jsxs("label", {
											className: "flex h-10 items-center gap-2 text-sm font-medium",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: slide.is_active,
												onChange: (event) => updateSlide(index, { is_active: event.target.checked })
											}), "Aktif"]
										}),
										/* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "text-destructive hover:text-destructive",
											onClick: () => form.setData("slides", form.data.slides.filter((_, slideIndex) => slideIndex !== index)),
											children: [/* @__PURE__ */ jsx(Trash2, {}), " Hapus"]
										})
									]
								})
							]
						})]
					}, `${slide.image_url}-${index}`))]
				})] }),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: form.processing,
						children: [/* @__PURE__ */ jsx(Save, {}), " Simpan perubahan"]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { HomeSettingsIndex as default };

//# sourceMappingURL=home-settings-DX3ObPPF.js.map