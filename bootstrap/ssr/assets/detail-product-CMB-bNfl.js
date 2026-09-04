import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { t as addProductVariantToCart } from "./CartController-DqDmRnvp.js";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
//#region resources/js/pages/customer/products/detail-product.tsx
var formatPrice = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(value).replace("IDR", "Rp").trim();
var humanize = (value) => value ? value.replaceAll("_", " ") : null;
var stripHtml = (value) => value?.replace(/<[^>]*>/g, "").replaceAll("&nbsp;", " ").trim() ?? "";
function DetailProduct({ product }) {
	return /* @__PURE__ */ jsx(DetailProductPage, { product }, product.id);
}
function DetailProductPage({ product }) {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? null);
	const [quantity, setQuantity] = useState(1);
	const cartForm = useForm({ quantity: 1 });
	const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? null;
	const availableStock = selectedVariant?.available_stock ?? 0;
	const isAvailable = availableStock > 0;
	const price = selectedVariant?.sale_price ?? selectedVariant?.regular_price ?? product.sale_price ?? product.price;
	const description = product.short_description || stripHtml(product.description);
	const selectedImage = product.images[activeImageIndex];
	const meta = [
		["ORIGIN", product.origin],
		["PROCESS", humanize(product.process)],
		["FORMAT", humanize(selectedVariant?.grind_type ?? null) ?? product.category],
		["WEIGHT", selectedVariant?.net_weight ?? null]
	].filter(([, value]) => value);
	const selectVariant = (variant) => {
		setSelectedVariantId(variant.id);
		setQuantity(1);
		cartForm.setData("quantity", 1);
		if (variant.image_url) {
			const variantImageIndex = product.images.findIndex((image) => image.url === variant.image_url);
			if (variantImageIndex >= 0) setActiveImageIndex(variantImageIndex);
		}
	};
	const changeQuantity = (nextQuantity) => {
		const next = Math.max(1, Math.min(nextQuantity, availableStock || 1));
		setQuantity(next);
		cartForm.setData("quantity", next);
	};
	const addToBag = (event) => {
		event.preventDefault();
		if (!selectedVariant || !isAvailable || cartForm.processing) return;
		cartForm.submit(addProductVariantToCart(selectedVariant.id), { preserveScroll: true });
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, { title: product.title }), /* @__PURE__ */ jsx("main", {
		className: "border-t border-hairline bg-canvas text-ink",
		children: /* @__PURE__ */ jsxs("section", {
			className: "grid border-b border-hairline lg:grid-cols-2",
			children: [/* @__PURE__ */ jsx(ProductGallery, {
				gallery: product.images,
				activeIndex: activeImageIndex,
				mainImage: selectedImage,
				onNext: () => setActiveImageIndex((current) => current === product.images.length - 1 ? 0 : current + 1),
				onPrevious: () => setActiveImageIndex((current) => current === 0 ? product.images.length - 1 : current - 1),
				productTitle: product.title
			}), /* @__PURE__ */ jsx("section", {
				className: "bg-canvas lg:sticky lg:top-0 lg:self-start",
				children: /* @__PURE__ */ jsxs("div", {
					className: "px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11 xl:px-16",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[9px] font-semibold tracking-[0.08em] uppercase",
							children: product.category ?? "Coffee"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 max-w-xl font-condensed text-[clamp(46px,5.3vw,82px)] leading-[0.84] font-semibold tracking-[-0.045em] uppercase",
							children: product.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-[11px] leading-5 text-ink/80 sm:text-[12px]",
							children: description
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-[19px] font-medium tracking-[-0.02em]",
							children: formatPrice(price)
						}),
						/* @__PURE__ */ jsx("dl", {
							className: "mt-8 grid grid-cols-2 border-y border-hairline sm:grid-cols-4",
							children: meta.map(([label, value]) => /* @__PURE__ */ jsxs("div", {
								className: "border-r border-hairline px-3 py-4 last:border-r-0 sm:px-4",
								children: [/* @__PURE__ */ jsx("dt", {
									className: "text-[8px] font-semibold tracking-[0.08em] text-ink/65 uppercase",
									children: label
								}), /* @__PURE__ */ jsx("dd", {
									className: "mt-1 text-[9px] font-semibold tracking-[0.04em] uppercase",
									children: value
								})]
							}, label))
						}),
						product.variants.length > 0 && /* @__PURE__ */ jsxs("fieldset", {
							className: "mt-7",
							children: [/* @__PURE__ */ jsx("legend", {
								className: "text-[9px] font-semibold tracking-[0.08em] uppercase",
								children: "Choose your grind"
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: product.variants.map((variant) => {
									const active = variant.id === selectedVariant?.id;
									const label = humanize(variant.grind_type) ?? variant.net_weight ?? variant.sku;
									return /* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-pressed": active,
										onClick: () => selectVariant(variant),
										className: active ? "min-h-9 border border-ink bg-ink px-4 text-[8px] font-semibold tracking-[0.06em] text-canvas uppercase transition-colors duration-200" : "min-h-9 border border-ink/45 px-4 text-[8px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 hover:border-ink hover:bg-sand",
										children: label
									}, variant.id);
								})
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "mt-7",
							onSubmit: addToBag,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2 sm:grid-cols-[108px_1fr]",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "grid h-12 grid-cols-3 border border-hairline",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => changeQuantity(quantity - 1),
												disabled: quantity <= 1,
												"aria-label": "Decrease quantity",
												className: "flex items-center justify-center transition-colors hover:bg-sand disabled:opacity-30",
												children: /* @__PURE__ */ jsx(Minus, { size: 14 })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "flex items-center justify-center text-[11px] font-semibold tabular-nums",
												children: quantity
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => changeQuantity(quantity + 1),
												disabled: !isAvailable || quantity >= availableStock,
												"aria-label": "Increase quantity",
												className: "flex items-center justify-center transition-colors hover:bg-sand disabled:opacity-30",
												children: /* @__PURE__ */ jsx(Plus, { size: 14 })
											})
										]
									}), /* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: !isAvailable || !selectedVariant || cartForm.processing,
										className: "flex h-12 items-center justify-center gap-3 bg-ink px-5 text-[10px] font-semibold tracking-[0.07em] text-canvas uppercase transition-colors duration-200 hover:bg-[#b65c3a] disabled:bg-ink/35",
										children: [
											cartForm.processing ? "Adding to bag" : "Add to bag",
											/* @__PURE__ */ jsxs("span", { children: ["— ", formatPrice(price)] }),
											/* @__PURE__ */ jsx(ArrowRight, { size: 15 })
										]
									})]
								}),
								cartForm.errors.quantity && /* @__PURE__ */ jsx("p", {
									className: "mt-3 text-[11px] font-medium text-[#a6472b]",
									children: cartForm.errors.quantity
								}),
								!isAvailable && selectedVariant && /* @__PURE__ */ jsx("p", {
									className: "mt-3 text-[10px] font-semibold tracking-[0.06em] text-[#a6472b] uppercase",
									children: "Currently sold out"
								})
							]
						}),
						/* @__PURE__ */ jsx(CoffeeStory, { product }),
						/* @__PURE__ */ jsx("p", {
							className: "mt-6 border-t border-hairline pt-4 text-[8px] font-medium tracking-[0.04em] text-ink/65 uppercase",
							children: "Roasted fresh weekly · Shipping calculated at checkout · Secure checkout"
						})
					]
				})
			})]
		})
	})] });
}
function ProductGallery({ gallery, activeIndex, mainImage, onNext, onPrevious, productTitle }) {
	return /* @__PURE__ */ jsx("section", {
		className: "bg-oat",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[1.06/1] overflow-hidden border-b border-hairline bg-sand",
			children: [mainImage ? /* @__PURE__ */ jsx("img", {
				src: mainImage.url,
				alt: mainImage.alt,
				fetchPriority: "high",
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ jsx("div", {
				className: "flex h-full items-center justify-center px-8 text-center text-[10px] font-semibold tracking-[0.08em] text-ink/60 uppercase",
				children: "Image unavailable"
			}), gallery.length > 1 && /* @__PURE__ */ jsxs(Fragment$1, { children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onPrevious,
					"aria-label": "Previous image for " + productTitle,
					className: "absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center border border-canvas/70 bg-ink/75 text-canvas transition-colors hover:bg-ink",
					children: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 })
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onNext,
					"aria-label": "Next image for " + productTitle,
					className: "absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center border border-canvas/70 bg-ink/75 text-canvas transition-colors hover:bg-ink",
					children: /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "absolute right-4 bottom-4 bg-ink/75 px-3 py-1 text-[9px] font-semibold tracking-[0.08em] text-canvas uppercase",
					children: [
						activeIndex + 1,
						" / ",
						gallery.length
					]
				})
			] })]
		})
	});
}
function CoffeeStory({ product }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-8 border-y border-hairline bg-[#f1e8dc] px-5 py-6 sm:px-6 sm:py-7",
		children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h2", {
			className: "font-condensed text-[clamp(30px,3.2vw,44px)] leading-[0.83] font-semibold tracking-[-0.035em] uppercase",
			children: [
				"About",
				/* @__PURE__ */ jsx("br", {}),
				"this coffee."
			]
		}) }), product.variants.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "mt-6 border-t border-ink/20 pt-5",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-[9px] font-semibold tracking-[0.08em] uppercase",
				children: "Stock details"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-3 overflow-x-auto border-y border-ink/20",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[520px] text-left text-[9px]",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b border-ink/20 text-ink/60 uppercase",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-2.5 pr-3",
								children: "SKU"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-2.5 pr-3",
								children: "Grind"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-2.5 pr-3",
								children: "Weight"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-2.5 pr-3",
								children: "Price"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-2.5",
								children: "Stock"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: product.variants.map((variant) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b border-ink/15 last:border-b-0",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-3 font-semibold",
								children: variant.sku
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-3 capitalize",
								children: humanize(variant.grind_type) ?? "-"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-3",
								children: variant.net_weight ?? "-"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3 pr-3",
								children: formatPrice(variant.sale_price ?? variant.regular_price)
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: variant.available_stock
							})
						]
					}, variant.id)) })]
				})
			})]
		})]
	});
}
//#endregion
export { DetailProduct as default };

//# sourceMappingURL=detail-product-CMB-bNfl.js.map