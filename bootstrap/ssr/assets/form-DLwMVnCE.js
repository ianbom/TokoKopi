import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { a as store, i as index, s as update } from "./stories-Ct4Uwes2.js";
import { t as InputError } from "./input-error-BW1E6fYx.js";
import { t as Label } from "./label-D8BoTw7V.js";
import { t as RichTextEditor } from "./rich-text-editor-BGfsOuiY.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Save } from "lucide-react";
//#region resources/js/pages/admin/stories/form.tsx
var slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180);
function StoryForm({ mode, story }) {
	const form = useForm({
		title: story?.title ?? "",
		slug: story?.slug ?? "",
		category: story?.category ?? "",
		author_name: story?.author_name ?? "Deklase",
		excerpt: story?.excerpt ?? "",
		body_html: story?.body_html ?? "",
		pull_quote: story?.pull_quote ?? "",
		quote_attribution: story?.quote_attribution ?? "",
		cover_caption: story?.cover_caption ?? "",
		status: story?.status ?? "draft",
		cover_image: null
	});
	const preview = useMemo(() => form.data.cover_image ? URL.createObjectURL(form.data.cover_image) : story?.cover_image_url, [form.data.cover_image, story?.cover_image_url]);
	useEffect(() => () => {
		if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
	}, [preview]);
	const submit = (event) => {
		event.preventDefault();
		form.transform((data) => mode === "edit" ? {
			...data,
			_method: "put"
		} : data);
		form.post(mode === "edit" ? update.url(story.id) : store.url(), { forceFormData: true });
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: mode === "edit" ? "Edit Story" : "Story Baru" }), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold tracking-widest text-primary uppercase",
				children: "Konten Deklase"
			}), /* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: mode === "edit" ? "Edit Story" : "Story Baru"
			})] }), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ jsxs(Link, {
					href: index(),
					children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
				})
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 space-y-5 border bg-canvas p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-title",
								children: "Judul"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-title",
								maxLength: 180,
								required: true,
								value: form.data.title,
								onChange: (event) => {
									const title = event.target.value;
									form.setData({
										...form.data,
										title,
										slug: form.data.slug === slugify(form.data.title) ? slugify(title) : form.data.slug
									});
								}
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.title })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-slug",
								children: "Slug"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-slug",
								maxLength: 180,
								required: true,
								pattern: "[a-z0-9]+(-[a-z0-9]+)*",
								value: form.data.slug,
								onChange: (event) => form.setData("slug", event.target.value)
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Huruf kecil, angka, dan tanda hubung. Digunakan pada URL story."
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.slug })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-excerpt",
								children: "Ringkasan"
							}),
							/* @__PURE__ */ jsx("textarea", {
								id: "story-excerpt",
								required: true,
								maxLength: 1e3,
								value: form.data.excerpt,
								onChange: (event) => form.setData("excerpt", event.target.value),
								className: "min-h-28 w-full border bg-canvas px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.excerpt })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-medium",
								children: "Isi story"
							}),
							/* @__PURE__ */ jsx(RichTextEditor, {
								content: form.data.body_html,
								onChange: (html) => form.setData("body_html", html),
								placeholder: "Tulis cerita kopi Deklase di sini."
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.body_html })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2 border-t pt-5",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-quote",
								children: "Kutipan editorial (opsional)"
							}),
							/* @__PURE__ */ jsx("textarea", {
								id: "story-quote",
								maxLength: 500,
								rows: 4,
								value: form.data.pull_quote,
								onChange: (event) => form.setData("pull_quote", event.target.value),
								className: "w-full border bg-canvas px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Ditampilkan sebagai sorotan di bawah foto sampul. Kosongkan untuk menyembunyikannya."
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.pull_quote })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-attribution",
								children: "Sumber kutipan (opsional)"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-attribution",
								maxLength: 120,
								value: form.data.quote_attribution,
								onChange: (event) => form.setData("quote_attribution", event.target.value)
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.quote_attribution })
						]
					})
				]
			}), /* @__PURE__ */ jsxs("aside", {
				className: "space-y-5 border bg-canvas p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-category",
								children: "Kategori"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-category",
								maxLength: 100,
								required: true,
								placeholder: "Contoh: Brewing",
								value: form.data.category,
								onChange: (event) => form.setData("category", event.target.value)
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.category })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-author",
								children: "Penulis"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-author",
								maxLength: 100,
								required: true,
								value: form.data.author_name,
								onChange: (event) => form.setData("author_name", event.target.value)
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.author_name })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-status",
								children: "Status"
							}),
							/* @__PURE__ */ jsxs("select", {
								id: "story-status",
								value: form.data.status,
								onChange: (event) => form.setData("status", event.target.value),
								className: "h-9 border bg-canvas px-3 text-sm",
								children: [/* @__PURE__ */ jsx("option", {
									value: "draft",
									children: "Draft"
								}), /* @__PURE__ */ jsx("option", {
									value: "published",
									children: "Published"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Published langsung tampil di halaman Story."
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.status })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-cover",
								children: "Gambar sampul"
							}),
							preview && /* @__PURE__ */ jsx("img", {
								src: preview,
								alt: "Pratinjau sampul story",
								className: "aspect-[4/3] w-full object-cover"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-cover",
								type: "file",
								accept: "image/jpeg,image/png,image/webp",
								required: mode === "create",
								onChange: (event) => form.setData("cover_image", event.target.files?.[0] ?? null)
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "JPG, PNG, atau WebP. Maksimal 4 MB."
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.cover_image })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ jsx(Label, {
								htmlFor: "story-caption",
								children: "Keterangan foto (opsional)"
							}),
							/* @__PURE__ */ jsx(Input, {
								id: "story-caption",
								maxLength: 255,
								value: form.data.cover_caption,
								onChange: (event) => form.setData("cover_caption", event.target.value)
							}),
							/* @__PURE__ */ jsx(InputError, { message: form.errors.cover_caption })
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: form.processing,
						className: "w-full",
						children: [
							/* @__PURE__ */ jsx(Save, {}),
							" ",
							form.processing ? "Menyimpan…" : "Simpan Story"
						]
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { StoryForm as default };

//# sourceMappingURL=form-DLwMVnCE.js.map