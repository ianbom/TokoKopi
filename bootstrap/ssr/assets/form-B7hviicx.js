import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as slugify } from "./slug-BNPHFZnW.js";
import { n as FormField, t as FormErrorSummary } from "./form-validation-DI_5y1Sr.js";
import { t as RichTextEditor } from "./rich-text-editor-wTupH7-S.js";
import { a as index, c as show, l as store, u as update } from "./products-10VBZ2wo.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
//#region resources/js/pages/admin/products/form.tsx
function Field(props) {
	return /* @__PURE__ */ jsx(FormField, {
		...props,
		showOptionalIndicator: false
	});
}
var blankImage = () => ({
	image_url: null,
	sort_order: 0,
	is_primary: true,
	image: null
});
var blankVariant = () => ({
	sku: "",
	net_weight: "",
	grind_type: "",
	length: "",
	width: "",
	height: "",
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
	const [autoGenerateSlug, setAutoGenerateSlug] = useState(mode === "create");
	const form = useForm({
		name: product?.name ?? "",
		slug: product?.slug ?? "",
		sku: product?.sku ?? "",
		origin: product?.origin ?? "",
		process: product?.process ?? "",
		grind_type: product?.grind_type ?? "",
		tasting_notes: product?.tasting_notes ?? "",
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
			grind_type: variant.grind_type ?? "",
			length: value(variant.length),
			width: value(variant.width),
			height: value(variant.height),
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
		const oversized = [...form.data.images.map((item, index) => ({
			file: item.image,
			field: `images.${index}.image`
		})), ...form.data.variants.map((item, index) => ({
			file: item.image,
			field: `variants.${index}.image`
		}))].filter((item) => item.file && item.file.size > 2 * 1024 * 1024);
		if (oversized.length) {
			form.setError(Object.fromEntries(oversized.map((item) => [item.field, "Gambar terlalu besar. Maksimal 2 MB."])));
			return;
		}
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
				/* @__PURE__ */ jsx(FormErrorSummary, { errors }),
				/* @__PURE__ */ jsxs("fieldset", {
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx("legend", {
							className: "px-2 text-base font-semibold text-ink",
							children: "Informasi dasar"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Nama, alamat halaman, SKU, dan kategori produk."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
							children: [
								/* @__PURE__ */ jsx(Field, {
									name: "name",
									label: "Nama produk",
									error: errors.name,
									required: true,
									requiredIndicator: "asterisk",
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "Contoh: Deklase Gayo Natural",
										value: form.data.name,
										onChange: (event) => {
											const name = event.target.value;
											form.setData((previous) => ({
												...previous,
												name,
												...mode === "create" && autoGenerateSlug ? { slug: slugify(name) } : {}
											}));
										}
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "slug",
									label: "Slug",
									error: errors.slug,
									required: true,
									requiredIndicator: "asterisk",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col gap-2 sm:flex-row",
										children: [/* @__PURE__ */ jsx(Input, {
											className: "min-w-0 flex-1",
											placeholder: "deklase-gayo-natural",
											value: form.data.slug,
											onChange: (event) => {
												setAutoGenerateSlug(false);
												setField("slug", event.target.value);
											}
										}), /* @__PURE__ */ jsx(Button, {
											type: "button",
											variant: "outline",
											className: "shrink-0",
											disabled: form.processing || !form.data.name.trim(),
											onClick: () => {
												setField("slug", slugify(form.data.name));
												setAutoGenerateSlug(mode === "create");
											},
											children: "Generate"
										})]
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "sku",
									label: "SKU",
									error: errors.sku,
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "DCL-GAYO-250",
										value: form.data.sku ?? "",
										onChange: (event) => setField("sku", event.target.value)
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "category_ids",
									label: "Kategori",
									error: errors.category_ids,
									className: "sm:col-span-2 xl:col-span-3",
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
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("fieldset", {
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx("legend", {
							className: "px-2 text-base font-semibold text-ink",
							children: "Profil kopi"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Informasi asal, proses, producer, dan karakter rasa."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-5 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsx(Field, {
									name: "origin",
									label: "Origin",
									error: errors.origin,
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "Aceh Gayo",
										value: form.data.origin ?? "",
										onChange: (event) => setField("origin", event.target.value)
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "process",
									label: "Process",
									error: errors.process,
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "Natural anaerobic",
										value: form.data.process ?? "",
										onChange: (event) => setField("process", event.target.value)
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "grind_type",
									label: "Producer",
									error: errors.grind_type,
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "Contoh: Kopi Klasik Roastery",
										value: form.data.grind_type ?? "",
										onChange: (event) => setField("grind_type", event.target.value)
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									name: "tasting_notes",
									label: "Tasting Notes",
									error: errors.tasting_notes,
									children: /* @__PURE__ */ jsx(Input, {
										placeholder: "Cokelat, jeruk, gula aren",
										value: form.data.tasting_notes ?? "",
										onChange: (event) => setField("tasting_notes", event.target.value)
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("fieldset", {
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx("legend", {
							className: "px-2 text-base font-semibold text-ink",
							children: "Deskripsi"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Tulis cerita kopi dan informasi produk yang akan dilihat pelanggan."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid gap-5",
							children: /* @__PURE__ */ jsx(Field, {
								name: "description",
								label: "Deskripsi",
								error: errors.description,
								children: /* @__PURE__ */ jsx(RichTextEditor, {
									content: form.data.description ?? "",
									onChange: (html) => setField("description", html)
								})
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("fieldset", {
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx("legend", {
							className: "px-2 text-base font-semibold text-ink",
							children: "Publikasi"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Atur status produk dan penanda tampilannya di katalog."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-5 lg:grid-cols-[minmax(12rem,20rem)_minmax(0,1fr)]",
							children: [/* @__PURE__ */ jsx(Field, {
								name: "status",
								label: "Status",
								error: errors.status,
								required: true,
								requiredIndicator: "asterisk",
								children: /* @__PURE__ */ jsx("select", {
									className: "h-9 border bg-canvas px-3 text-sm",
									value: form.data.status,
									onChange: (event) => setField("status", event.target.value),
									children: options.statuses.map((status) => /* @__PURE__ */ jsx("option", {
										value: status,
										children: status
									}, status))
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-start gap-x-6 gap-y-3 lg:pt-7",
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
									}), {
										is_featured: "Produk unggulan",
										is_new_arrival: "Produk baru",
										is_best_seller: "Terlaris"
									}[field]]
								}, field))
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					"data-field": "images",
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx(SectionTitle, {
							title: "Galeri produk",
							onAdd: () => setField("images", [...form.data.images, {
								...blankImage(),
								is_primary: form.data.images.length === 0
							}])
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Wajib memiliki minimal 1 foto produk."
						}),
						errors.images && /* @__PURE__ */ jsx("p", {
							role: "alert",
							className: "text-sm text-destructive",
							children: errors.images
						}),
						/* @__PURE__ */ jsx("div", {
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
											name: `images.${imageIndex}.image`,
											label: "File gambar",
											error: errors[`images.${imageIndex}.image`],
											children: /* @__PURE__ */ jsx(Input, {
												type: "file",
												accept: "image/*",
												onChange: (event) => patchImage(imageIndex, { image: event.target.files?.[0] ?? null })
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											name: `images.${imageIndex}.sort_order`,
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
												children: [
													/* @__PURE__ */ jsx("input", {
														type: "radio",
														name: "primary_image",
														checked: image.is_primary,
														onChange: () => setField("images", form.data.images.map((item, index) => ({
															...item,
															is_primary: index === imageIndex
														})))
													}),
													"Gambar utama",
													form.data.status === "active" && /* @__PURE__ */ jsx("span", {
														"aria-hidden": "true",
														className: "text-destructive",
														children: "*"
													})
												]
											}), /* @__PURE__ */ jsxs(Button, {
												type: "button",
												size: "sm",
												"aria-label": `Hapus gambar ${imageIndex + 1}`,
												variant: "ghost",
												onClick: () => setField("images", form.data.images.filter((_, index) => index !== imageIndex)),
												children: [/* @__PURE__ */ jsx(Trash2, {}), " Hapus"]
											})]
										})
									]
								})]
							}, image.id ?? imageIndex))
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					"data-field": "variants",
					className: "min-w-0 space-y-5 border border-hairline bg-canvas p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsx(SectionTitle, {
							title: "Varian produk",
							onAdd: () => setField("variants", [...form.data.variants, blankVariant()])
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "Kelompokkan pilihan produk beserta harga, pengiriman, dan stoknya."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid gap-6",
							children: form.data.variants.map((variant, variantIndex) => /* @__PURE__ */ jsxs("article", {
								"data-field": `variants.${variantIndex}`,
								"aria-labelledby": `variant-${variantIndex}-title`,
								className: "min-w-0 border border-hairline",
								children: [/* @__PURE__ */ jsxs("header", {
									className: "flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface-soft px-4 py-3 sm:px-5",
									children: [/* @__PURE__ */ jsxs("h3", {
										id: `variant-${variantIndex}-title`,
										className: "font-semibold text-ink",
										children: ["Varian ", variantIndex + 1]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-4",
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
											"aria-label": `Hapus varian ${variantIndex + 1}`,
											variant: "ghost",
											onClick: () => setField("variants", form.data.variants.filter((_, index) => index !== variantIndex)),
											children: /* @__PURE__ */ jsx(Trash2, {})
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-6 p-4 sm:p-5",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid gap-6 xl:grid-cols-2",
										children: [
											/* @__PURE__ */ jsxs("fieldset", {
												className: "min-w-0 space-y-5 border-t border-hairline pt-4",
												children: [
													/* @__PURE__ */ jsx("legend", {
														className: "px-2 text-base font-semibold text-ink",
														children: "Identitas varian"
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-sm text-muted-foreground",
														children: "SKU, ukuran isi, dan pilihan gilingan."
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "grid gap-4 sm:grid-cols-2",
														children: [
															/* @__PURE__ */ jsx(Field, {
																name: `variants.${variantIndex}.sku`,
																label: "SKU",
																error: errors[`variants.${variantIndex}.sku`],
																children: /* @__PURE__ */ jsx(Input, {
																	placeholder: "DCL-GAYO-250-WB",
																	value: variant.sku ?? "",
																	onChange: (event) => patchVariant(variantIndex, { sku: event.target.value })
																})
															}),
															/* @__PURE__ */ jsx(Field, {
																name: `variants.${variantIndex}.net_weight`,
																label: "Berat bersih",
																required: true,
																requiredIndicator: "asterisk",
																error: errors[`variants.${variantIndex}.net_weight`],
																children: /* @__PURE__ */ jsx(Input, {
																	placeholder: "250gram",
																	value: variant.net_weight,
																	onChange: (event) => patchVariant(variantIndex, { net_weight: event.target.value })
																})
															}),
															/* @__PURE__ */ jsx(Field, {
																name: `variants.${variantIndex}.grind_type`,
																label: "Grind Type",
																error: errors[`variants.${variantIndex}.grind_type`],
																children: /* @__PURE__ */ jsxs("select", {
																	className: "h-9 w-full border bg-canvas px-3 text-sm",
																	value: variant.grind_type,
																	onChange: (event) => patchVariant(variantIndex, { grind_type: event.target.value }),
																	children: [
																		/* @__PURE__ */ jsx("option", {
																			value: "",
																			children: "Tidak berlaku"
																		}),
																		/* @__PURE__ */ jsx("option", {
																			value: "whole_bean",
																			children: "whole bean"
																		}),
																		/* @__PURE__ */ jsx("option", {
																			value: "fine",
																			children: "fine"
																		}),
																		/* @__PURE__ */ jsx("option", {
																			value: "medium",
																			children: "medium"
																		}),
																		/* @__PURE__ */ jsx("option", {
																			value: "coarse",
																			children: "coarse"
																		})
																	]
																})
															})
														]
													})
												]
											}),
											/* @__PURE__ */ jsxs("fieldset", {
												className: "min-w-0 space-y-5 border-t border-hairline pt-4",
												children: [
													/* @__PURE__ */ jsx("legend", {
														className: "px-2 text-base font-semibold text-ink",
														children: "Harga"
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-sm text-muted-foreground",
														children: "Harga normal dan harga promo jika tersedia."
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "grid gap-4 sm:grid-cols-2",
														children: [/* @__PURE__ */ jsx(Field, {
															name: `variants.${variantIndex}.regular_price`,
															label: "Harga normal",
															required: true,
															requiredIndicator: "asterisk",
															error: errors[`variants.${variantIndex}.regular_price`],
															children: /* @__PURE__ */ jsx(Input, {
																type: "number",
																min: "0",
																placeholder: "95000",
																value: value(variant.regular_price),
																onChange: (event) => patchVariant(variantIndex, { regular_price: event.target.value })
															})
														}), /* @__PURE__ */ jsx(Field, {
															name: `variants.${variantIndex}.sale_price`,
															label: "Harga promo",
															error: errors[`variants.${variantIndex}.sale_price`],
															children: /* @__PURE__ */ jsx(Input, {
																type: "number",
																min: "0",
																placeholder: "85000",
																value: value(variant.sale_price),
																onChange: (event) => patchVariant(variantIndex, { sale_price: event.target.value })
															})
														})]
													})
												]
											}),
											/* @__PURE__ */ jsxs("fieldset", {
												className: "min-w-0 space-y-5 border-t border-hairline pt-4",
												children: [
													/* @__PURE__ */ jsx("legend", {
														className: "px-2 text-base font-semibold text-ink",
														children: "Pengiriman"
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-sm text-muted-foreground",
														children: "Berat kirim dan dimensi kemasan untuk pengiriman."
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "grid gap-4 sm:grid-cols-2",
														children: [/* @__PURE__ */ jsx(Field, {
															name: `variants.${variantIndex}.shipping_weight_gram`,
															label: "Berat kirim (gram)",
															required: true,
															requiredIndicator: "asterisk",
															error: errors[`variants.${variantIndex}.shipping_weight_gram`],
															children: /* @__PURE__ */ jsx(Input, {
																type: "number",
																min: "1",
																placeholder: "300",
																value: value(variant.shipping_weight_gram),
																onChange: (event) => patchVariant(variantIndex, { shipping_weight_gram: event.target.value })
															})
														}), /* @__PURE__ */ jsxs("fieldset", {
															className: "min-w-0 space-y-3 sm:col-span-2",
															children: [/* @__PURE__ */ jsx("legend", {
																className: "text-sm font-medium",
																children: "Dimensi kemasan (cm)"
															}), /* @__PURE__ */ jsx("div", {
																className: "grid items-end gap-4 sm:grid-cols-3",
																children: [
																	"length",
																	"width",
																	"height"
																].map((dimension) => /* @__PURE__ */ jsx(Field, {
																	name: `variants.${variantIndex}.${dimension}`,
																	label: {
																		length: "Panjang",
																		width: "Lebar",
																		height: "Tinggi"
																	}[dimension],
																	required: true,
																	requiredIndicator: "asterisk",
																	error: errors[`variants.${variantIndex}.${dimension}`],
																	children: /* @__PURE__ */ jsx(Input, {
																		type: "number",
																		min: "0.01",
																		max: "999999.99",
																		step: "0.01",
																		value: variant[dimension],
																		onChange: (event) => patchVariant(variantIndex, { [dimension]: event.target.value })
																	})
																}, dimension))
															})]
														})]
													})
												]
											}),
											/* @__PURE__ */ jsxs("fieldset", {
												className: "min-w-0 space-y-5 border-t border-hairline pt-4",
												children: [
													/* @__PURE__ */ jsx("legend", {
														className: "px-2 text-base font-semibold text-ink",
														children: "Stok"
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-sm text-muted-foreground",
														children: "Jumlah tersedia dan batas pemberitahuan stok rendah."
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "grid gap-4 sm:grid-cols-2",
														children: [/* @__PURE__ */ jsx(Field, {
															name: `variants.${variantIndex}.stock_quantity`,
															label: "Stok",
															required: true,
															requiredIndicator: "asterisk",
															error: errors[`variants.${variantIndex}.stock_quantity`],
															children: /* @__PURE__ */ jsx(Input, {
																type: "number",
																min: "0",
																placeholder: "20",
																value: value(variant.stock_quantity),
																onChange: (event) => patchVariant(variantIndex, { stock_quantity: event.target.value })
															})
														}), /* @__PURE__ */ jsx(Field, {
															name: `variants.${variantIndex}.low_stock_threshold`,
															label: "Batas stok rendah",
															required: true,
															requiredIndicator: "asterisk",
															error: errors[`variants.${variantIndex}.low_stock_threshold`],
															children: /* @__PURE__ */ jsx(Input, {
																type: "number",
																min: "0",
																placeholder: "5",
																value: value(variant.low_stock_threshold),
																onChange: (event) => patchVariant(variantIndex, { low_stock_threshold: event.target.value })
															})
														})]
													})
												]
											})
										]
									}), /* @__PURE__ */ jsxs("fieldset", {
										className: "min-w-0 space-y-5 border-t border-hairline pt-4",
										children: [
											/* @__PURE__ */ jsx("legend", {
												className: "px-2 text-base font-semibold text-ink",
												children: "Gambar varian"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-sm text-muted-foreground",
												children: "Gunakan gambar khusus varian jika berbeda dari gambar produk."
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid items-start gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]",
												children: [/* @__PURE__ */ jsx(ImagePreview, {
													file: variant.image,
													url: variant.image_url,
													alt: `${form.data.name || "Produk kopi"} - varian ${variantIndex + 1}`
												}), /* @__PURE__ */ jsx("div", {
													className: "min-w-0",
													children: /* @__PURE__ */ jsx(Field, {
														name: `variants.${variantIndex}.image`,
														label: "File gambar varian",
														error: errors[`variants.${variantIndex}.image`],
														children: /* @__PURE__ */ jsx(Input, {
															type: "file",
															accept: "image/*",
															onChange: (event) => patchVariant(variantIndex, { image: event.target.files?.[0] ?? null })
														})
													})
												})]
											})
										]
									})]
								})]
							}, variant.id ?? variantIndex))
						})
					]
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

//# sourceMappingURL=form-B7hviicx.js.map