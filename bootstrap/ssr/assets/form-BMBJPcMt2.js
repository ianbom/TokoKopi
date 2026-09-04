import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { a as index, c as show, l as store, u as update } from "./products-BPQs5U7S.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Bold, Highlighter, Italic, List, ListOrdered, Plus, Redo2, Save, Trash2, Undo2 } from "lucide-react";
import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
//#region resources/js/pages/admin/products/form.tsx
var blankImage = () => ({
	image_url: null,
	sort_order: 0,
	is_primary: true,
	image: null
});
var blankVariant = () => ({
	sku: "",
	net_weight: "",
	grind_type: "whole_bean",
	regular_price: "",
	sale_price: "",
	shipping_weight_gram: "",
	image_url: "",
	is_active: true,
	stock_quantity: "",
	low_stock_threshold: 5,
	image: null
});
var value = (item) => item == null ? "" : String(item);
function ProductForm({ mode, product, options }) {
	const form = useForm({
		name: product?.name ?? "",
		slug: product?.slug ?? "",
		sku: product?.sku ?? "",
		origin: product?.origin ?? "",
		process: product?.process ?? "",
		description: product?.description ?? "",
		status: product?.status ?? "draft",
		is_featured: product?.is_featured ?? false,
		is_new_arrival: product?.is_new_arrival ?? false,
		is_best_seller: product?.is_best_seller ?? false,
		category_ids: product?.category_ids ?? [],
		images: product?.images?.map((image) => ({
			...image,
			image: null
		})) ?? [blankImage()],
		variants: product?.variants?.map((variant) => ({
			...variant,
			net_weight: value(variant.net_weight),
			grind_type: value(variant.grind_type),
			regular_price: value(variant.regular_price),
			sale_price: value(variant.sale_price),
			shipping_weight_gram: value(variant.shipping_weight_gram),
			stock_quantity: value(variant.stock_quantity),
			low_stock_threshold: value(variant.low_stock_threshold),
			image: null
		})) ?? [blankVariant()]
	});
	const errors = form.errors;
	const setField = (field, fieldValue) => form.setData(field, fieldValue);
	const submit = (event) => {
		event.preventDefault();
		form.transform((data) => mode === "create" ? data : {
			...data,
			_method: "put"
		});
		form.post(mode === "create" ? store.url() : update.url(product.id), { forceFormData: true });
	};
	const patchImage = (imageIndex, patch) => setField("images", form.data.images.map((image, index) => index === imageIndex ? {
		...image,
		...patch
	} : image));
	const patchVariant = (variantIndex, patch) => setField("variants", form.data.variants.map((variant, index) => index === variantIndex ? {
		...variant,
		...patch
	} : variant));
	const toggleCategory = (categoryId, checked) => setField("category_ids", checked ? [...form.data.category_ids, categoryId] : form.data.category_ids.filter((id) => id !== categoryId));
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: mode === "create" ? "Tambah Produk" : "Edit Produk" }), /* @__PURE__ */ jsxs("main", {
		className: "w-full space-y-6 p-4 md:p-6",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold tracking-widest text-primary uppercase",
				children: "Katalog kopi"
			}), /* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: mode === "create" ? "Tambah Produk" : "Edit Produk"
			})] }), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ jsxs(Link, {
					href: mode === "edit" ? show(product) : index(),
					children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
				})
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "w-full space-y-6",
			children: [
				/* @__PURE__ */ jsxs("section", {
					className: "grid gap-4 border bg-canvas p-5 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Nama produk",
							error: errors.name,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "Contoh: Deklase Gayo Natural",
								value: form.data.name,
								onChange: (event) => setField("name", event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Slug",
							error: errors.slug,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "Deklase-gayo-natural",
								value: form.data.slug,
								onChange: (event) => setField("slug", event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "SKU",
							error: errors.sku,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "DCL-GAYO-250",
								value: form.data.sku ?? "",
								onChange: (event) => setField("sku", event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Origin",
							error: errors.origin,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "Aceh Gayo",
								value: form.data.origin ?? "",
								onChange: (event) => setField("origin", event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Process",
							error: errors.process,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "Natural anaerobic",
								value: form.data.process ?? "",
								onChange: (event) => setField("process", event.target.value)
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Status",
							error: errors.status,
							children: /* @__PURE__ */ jsx("select", {
								className: "h-9 border bg-canvas px-3 text-sm",
								value: form.data.status,
								onChange: (event) => setField("status", event.target.value),
								children: options.statuses.map((status) => /* @__PURE__ */ jsx("option", {
									value: status,
									children: status
								}, status))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Kategori",
							error: errors.category_ids,
							className: "lg:col-span-3",
							children: /* @__PURE__ */ jsx("div", {
								className: "grid gap-2 border bg-surface-soft p-3 sm:grid-cols-2 lg:grid-cols-4",
								children: options.categories.map((category) => /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: form.data.category_ids.includes(category.id),
										onChange: (event) => toggleCategory(category.id, event.target.checked)
									}), category.name]
								}, category.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Deskripsi",
							error: errors.description,
							className: "lg:col-span-3",
							children: /* @__PURE__ */ jsx(RichTextEditor, {
								content: form.data.description ?? "",
								onChange: (html) => setField("description", html)
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-5 text-sm lg:col-span-3",
							children: [
								"is_featured",
								"is_new_arrival",
								"is_best_seller"
							].map((field) => /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: form.data[field],
									onChange: (event) => setField(field, event.target.checked)
								}), field.replaceAll("_", " ")]
							}, field))
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "space-y-4 border bg-canvas p-5",
					children: [/* @__PURE__ */ jsx(SectionTitle, {
						title: "Gambar produk",
						onAdd: () => setField("images", [...form.data.images, {
							...blankImage(),
							is_primary: form.data.images.length === 0
						}])
					}), /* @__PURE__ */ jsx("div", {
						className: "grid gap-4 xl:grid-cols-2",
						children: form.data.images.map((image, imageIndex) => /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 border p-4 sm:grid-cols-[9rem_minmax(0,1fr)]",
							children: [/* @__PURE__ */ jsx(ImagePreview, {
								file: image.image,
								url: image.image_url,
								alt: form.data.name || "Pratinjau kopi"
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid gap-3",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "File gambar",
										error: errors[`images.${imageIndex}.image`],
										children: /* @__PURE__ */ jsx(Input, {
											type: "file",
											accept: "image/*",
											onChange: (event) => patchImage(imageIndex, { image: event.target.files?.[0] ?? null })
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Urutan",
										error: errors[`images.${imageIndex}.sort_order`],
										children: /* @__PURE__ */ jsx(Input, {
											type: "number",
											min: "0",
											placeholder: "0",
											value: value(image.sort_order),
											onChange: (event) => patchImage(imageIndex, { sort_order: Number(event.target.value) })
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-4 text-sm",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("input", {
												type: "radio",
												name: "primary_image",
												checked: image.is_primary,
												onChange: () => setField("images", form.data.images.map((item, index) => ({
													...item,
													is_primary: index === imageIndex
												})))
											}), "Gambar utama"]
										}), /* @__PURE__ */ jsxs(Button, {
											type: "button",
											size: "sm",
											variant: "ghost",
											onClick: () => setField("images", form.data.images.filter((_, index) => index !== imageIndex)),
											children: [/* @__PURE__ */ jsx(Trash2, {}), " Hapus"]
										})]
									})
								]
							})]
						}, image.id ?? imageIndex))
					})]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "space-y-4 border bg-canvas p-5",
					children: [/* @__PURE__ */ jsx(SectionTitle, {
						title: "Varian dan stok",
						onAdd: () => setField("variants", [...form.data.variants, blankVariant()])
					}), /* @__PURE__ */ jsx("div", {
						className: "grid gap-4",
						children: form.data.variants.map((variant, variantIndex) => /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 border p-4 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "SKU",
									error: errors[`variants.${variantIndex}.sku`],
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "DCL-GAYO-250-WB",
										value: variant.sku,
										onChange: (event) => patchVariant(variantIndex, { sku: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Berat bersih",
									error: errors[`variants.${variantIndex}.net_weight`],
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "250gram",
										value: variant.net_weight,
										onChange: (event) => patchVariant(variantIndex, { net_weight: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Grind type",
									error: errors[`variants.${variantIndex}.grind_type`],
									children: /* @__PURE__ */ jsx("select", {
										className: "h-9 border bg-canvas px-3 text-sm",
										value: variant.grind_type,
										onChange: (event) => patchVariant(variantIndex, { grind_type: event.target.value }),
										children: options.grindTypes.map((type) => /* @__PURE__ */ jsx("option", {
											value: type,
											children: type
										}, type))
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Harga normal",
									error: errors[`variants.${variantIndex}.regular_price`],
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										placeholder: "95000",
										value: value(variant.regular_price),
										onChange: (event) => patchVariant(variantIndex, { regular_price: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Harga promo",
									error: errors[`variants.${variantIndex}.sale_price`],
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										placeholder: "85000",
										value: value(variant.sale_price),
										onChange: (event) => patchVariant(variantIndex, { sale_price: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Berat kirim (gram)",
									error: errors[`variants.${variantIndex}.shipping_weight_gram`],
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										placeholder: "300",
										value: value(variant.shipping_weight_gram),
										onChange: (event) => patchVariant(variantIndex, { shipping_weight_gram: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Stok",
									error: errors[`variants.${variantIndex}.stock_quantity`],
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										placeholder: "20",
										value: value(variant.stock_quantity),
										onChange: (event) => patchVariant(variantIndex, { stock_quantity: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Batas stok rendah",
									error: errors[`variants.${variantIndex}.low_stock_threshold`],
									children: /* @__PURE__ */ jsx(Input, {
										type: "number",
										min: "0",
										placeholder: "5",
										value: value(variant.low_stock_threshold),
										onChange: (event) => patchVariant(variantIndex, { low_stock_threshold: event.target.value })
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "File gambar varian",
									error: errors[`variants.${variantIndex}.image`],
									className: "lg:col-span-2",
									children: /* @__PURE__ */ jsx(Input, {
										type: "file",
										accept: "image/*",
										onChange: (event) => patchVariant(variantIndex, { image: event.target.files?.[0] ?? null })
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-end gap-4",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "flex h-9 items-center gap-2 text-sm",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: variant.is_active,
											onChange: (event) => patchVariant(variantIndex, { is_active: event.target.checked })
										}), "Aktif"]
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										size: "icon",
										variant: "ghost",
										onClick: () => setField("variants", form.data.variants.filter((_, index) => index !== variantIndex)),
										children: /* @__PURE__ */ jsx(Trash2, {})
									})]
								})
							]
						}, variant.id ?? variantIndex))
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: form.processing,
						children: [/* @__PURE__ */ jsx(Save, {}), " Simpan"]
					})
				})
			]
		})]
	})] });
}
function RichTextEditor({ content, onChange }) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [StarterKit, Highlight],
		content,
		editorProps: { attributes: { class: "min-h-40 px-3 py-2 text-sm leading-6 outline-none" } },
		onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getHTML())
	});
	useEffect(() => {
		if (editor && editor.getHTML() !== content) editor.commands.setContent(content);
	}, [content, editor]);
	if (!editor) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "border bg-canvas",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap gap-1 border-b p-2",
			children: [
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Bold",
					onClick: () => editor.chain().focus().toggleBold().run(),
					children: /* @__PURE__ */ jsx(Bold, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Italic",
					onClick: () => editor.chain().focus().toggleItalic().run(),
					children: /* @__PURE__ */ jsx(Italic, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Highlight",
					onClick: () => editor.chain().focus().toggleHighlight().run(),
					children: /* @__PURE__ */ jsx(Highlighter, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Bullets",
					onClick: () => editor.chain().focus().toggleBulletList().run(),
					children: /* @__PURE__ */ jsx(List, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Numbered list",
					onClick: () => editor.chain().focus().toggleOrderedList().run(),
					children: /* @__PURE__ */ jsx(ListOrdered, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Undo",
					onClick: () => editor.chain().focus().undo().run(),
					children: /* @__PURE__ */ jsx(Undo2, {})
				}),
				/* @__PURE__ */ jsx(EditorButton, {
					editor,
					label: "Redo",
					onClick: () => editor.chain().focus().redo().run(),
					children: /* @__PURE__ */ jsx(Redo2, {})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative",
			children: [/* @__PURE__ */ jsx(EditorContent, { editor }), editor.isEmpty && /* @__PURE__ */ jsx("span", {
				className: "pointer-events-none absolute top-2 left-3 text-sm text-muted-soft",
				children: "Ceritakan rasa, aroma, dan karakter kopi ini."
			})]
		})]
	});
}
function EditorButton({ editor, label, onClick, children }) {
	return /* @__PURE__ */ jsx(Button, {
		type: "button",
		size: "icon",
		variant: "ghost",
		"aria-label": label,
		disabled: !editor.isEditable,
		onClick,
		children
	});
}
function ImagePreview({ file, url, alt }) {
	const preview = useMemo(() => file ? URL.createObjectURL(file) : url, [file, url]);
	useEffect(() => {
		if (!file || !preview) return;
		return () => URL.revokeObjectURL(preview);
	}, [file, preview]);
	return /* @__PURE__ */ jsx("div", {
		className: "aspect-square overflow-hidden border bg-surface-soft",
		children: preview ? /* @__PURE__ */ jsx("img", {
			src: preview,
			alt,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ jsx("div", {
			className: "grid h-full place-items-center px-4 text-center text-xs text-muted-soft",
			children: "Pilih foto kopi."
		})
	});
}
function Field({ label, error, className = "", children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `grid gap-1.5 ${className}`,
		children: [
			/* @__PURE__ */ jsx(Label, { children: label }),
			children,
			/* @__PURE__ */ jsx(InputError, { message: error })
		]
	});
}
function SectionTitle({ title, onAdd }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "font-semibold",
			children: title
		}), /* @__PURE__ */ jsxs(Button, {
			type: "button",
			variant: "outline",
			onClick: onAdd,
			children: [/* @__PURE__ */ jsx(Plus, {}), " Tambah"]
		})]
	});
}
//#endregion
export { ProductForm as default };

//# sourceMappingURL=form-BMBJPcMt2.js.map