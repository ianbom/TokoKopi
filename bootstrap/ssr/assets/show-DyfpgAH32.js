import { t as cn } from "./utils-DJjaB2Tv.js";
import { t as Button } from "./button-Cl3HFMpR.js";
import { i as index } from "./product-variants-ys4RJ_hb.js";
import { a as index$1, i as edit, r as destroy, s as publish, t as archive } from "./products-BEnK7CN1.js";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Archive, ArrowLeft, ArrowRight, CheckCircle2, Pencil, Trash2 } from "lucide-react";
//#region resources/js/components/HTMLRender.tsx
var hasHtmlTag = /<\/?[a-z][\s\S]*>/i;
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function normalizeHtml(value) {
	const trimmed = value.trim();
	if (trimmed === "") return "";
	if (!hasHtmlTag.test(trimmed)) return trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
	return trimmed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
}
function HTMLRender({ className, emptyFallback = null, html }) {
	const safeHtml = useMemo(() => normalizeHtml(html ?? ""), [html]);
	if (!safeHtml) return emptyFallback;
	return /* @__PURE__ */ jsx("div", {
		className: cn("space-y-3 text-sm leading-7 text-zinc-700", "[&_a]:font-semibold [&_a]:text-[#9A6B45] [&_a]:underline [&_a]:underline-offset-4", "[&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-zinc-600", "[&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-zinc-800", "[&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:font-semibold [&_h1]:text-zinc-950", "[&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-semibold [&_h2]:text-zinc-900", "[&_mark]:rounded-sm [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:text-zinc-950", "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5", "[&_p]:m-0", "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-950 [&_pre]:p-4 [&_pre]:text-zinc-50", "[&_strong]:font-semibold [&_strong]:text-zinc-900", "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5", className),
		dangerouslySetInnerHTML: { __html: safeHtml }
	});
}
//#endregion
//#region resources/js/pages/admin/products/show.tsx
var money = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(Number(value ?? 0));
var humanize = (value) => value ? value.replaceAll("_", " ") : "-";
function ProductShow({ product }) {
	const gallery = [...product.images].filter((image) => image.image_url).sort((left, right) => Number(right.is_primary) - Number(left.is_primary) || left.sort_order - right.sort_order);
	const [activeImage, setActiveImage] = useState(0);
	const currentImage = gallery[activeImage];
	const activeVariant = product.variants.find((variant) => variant.is_active) ?? product.variants[0];
	const flags = [
		product.is_featured ? "Featured" : null,
		product.is_new_arrival ? "New arrival" : null,
		product.is_best_seller ? "Best seller" : null
	].filter(Boolean);
	const action = (url, method) => router[method](url, {}, { preserveScroll: true });
	const changeImage = (direction) => setActiveImage((current) => (current + direction + gallery.length) % gallery.length);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: product.name }), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-7xl space-y-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col justify-between gap-4 border-b border-ink/15 pb-5 lg:flex-row lg:items-end",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] font-semibold tracking-[0.12em] text-primary uppercase",
					children: "Admin / Product detail"
				}), /* @__PURE__ */ jsx("h1", {
					className: "mt-2 font-condensed text-[clamp(42px,5vw,72px)] leading-[0.86] font-semibold tracking-[-0.04em] text-teal uppercase",
					children: product.name
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ jsxs(Link, {
								href: index$1(),
								children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Kembali"]
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ jsxs(Link, {
								href: edit(product),
								children: [/* @__PURE__ */ jsx(Pencil, {}), " Edit"]
							})
						}),
						product.status !== "active" ? /* @__PURE__ */ jsxs(Button, {
							onClick: () => action(publish.url(product), "post"),
							children: [/* @__PURE__ */ jsx(CheckCircle2, {}), " Aktifkan"]
						}) : null,
						product.status !== "archived" ? /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							onClick: () => action(archive.url(product), "post"),
							children: [/* @__PURE__ */ jsx(Archive, {}), " Arsipkan"]
						}) : null,
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "text-destructive hover:text-destructive",
							onClick: () => confirm(`Hapus ${product.name}?`) && action(destroy.url(product), "delete"),
							children: [/* @__PURE__ */ jsx(Trash2, {}), " Hapus"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "grid overflow-hidden border border-ink/15 bg-white lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative min-h-[420px] overflow-hidden bg-[#e9dfd1] sm:min-h-[560px] lg:min-h-[680px]",
					children: [currentImage?.image_url ? /* @__PURE__ */ jsx("img", {
						src: currentImage.image_url,
						alt: currentImage.alt_text ?? product.name,
						className: "absolute inset-0 h-full w-full object-cover"
					}) : /* @__PURE__ */ jsx("div", {
						className: "flex h-full min-h-[420px] items-center justify-center px-8 text-center text-xs font-semibold tracking-[0.08em] text-ink/55 uppercase",
						children: "Belum ada gambar produk"
					}), gallery.length > 1 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Gambar sebelumnya",
							onClick: () => changeImage(-1),
							className: "absolute top-1/2 left-4 grid size-11 -translate-y-1/2 place-items-center border border-white/70 bg-ink/75 text-white transition-colors hover:bg-ink",
							children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Gambar berikutnya",
							onClick: () => changeImage(1),
							className: "absolute top-1/2 right-4 grid size-11 -translate-y-1/2 place-items-center border border-white/70 bg-ink/75 text-white transition-colors hover:bg-ink",
							children: /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "absolute right-4 bottom-4 bg-ink/75 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase",
							children: [
								activeImage + 1,
								" / ",
								gallery.length
							]
						})
					] }) : null]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col bg-[#f4ede3] p-6 sm:p-8 lg:p-10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-ink/20 pb-5",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[10px] font-semibold tracking-[0.1em] uppercase",
								children: product.categories.join(" / ") || "Tanpa kategori"
							}), /* @__PURE__ */ jsx("span", {
								className: "border border-ink/30 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase",
								children: product.status
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "py-7",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-ink/60",
									children: ["SKU ", product.sku ?? "-"]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-3 font-condensed text-[clamp(46px,5vw,78px)] leading-[0.84] font-semibold tracking-[-0.045em] uppercase",
									children: product.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-5 text-xl font-semibold",
									children: activeVariant ? money(activeVariant.sale_price ?? activeVariant.regular_price) : "Harga belum tersedia"
								}),
								activeVariant?.sale_price ? /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-ink/50 line-through",
									children: money(activeVariant.regular_price)
								}) : null
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 border-y border-ink/20 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ jsx(Detail, {
									label: "Origin",
									value: product.origin ?? "-"
								}),
								/* @__PURE__ */ jsx(Detail, {
									label: "Process",
									value: product.process ?? "-"
								}),
								/* @__PURE__ */ jsx(Detail, {
									label: "Total stock",
									value: product.total_stock
								}),
								/* @__PURE__ */ jsx(Detail, {
									label: "Variants",
									value: product.variants.length
								}),
								/* @__PURE__ */ jsx(Detail, {
									label: "Sold",
									value: product.order_items_count
								}),
								/* @__PURE__ */ jsx(Detail, {
									label: "Updated",
									value: product.updated_at ?? "-"
								})
							]
						}),
						flags.length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2 border-b border-ink/20 py-5",
							children: flags.map((flag) => /* @__PURE__ */ jsx("span", {
								className: "bg-teal px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-white uppercase",
								children: flag
							}, flag))
						}) : null,
						/* @__PURE__ */ jsxs("div", {
							className: "pt-7",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "font-condensed text-4xl leading-[0.86] font-semibold tracking-[-0.035em] uppercase",
								children: "About this coffee."
							}), /* @__PURE__ */ jsx(HTMLRender, {
								html: product.description,
								className: "mt-5 text-ink/75 [&_h1]:text-teal [&_h2]:text-teal [&_strong]:text-teal",
								emptyFallback: /* @__PURE__ */ jsx("p", {
									className: "mt-5 text-sm text-ink/55",
									children: "Belum ada deskripsi produk."
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "border border-ink/15 bg-[#f1e8dc] p-5 sm:p-7",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col justify-between gap-4 border-b border-ink/20 pb-5 sm:flex-row sm:items-end",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-semibold tracking-[0.1em] text-primary uppercase",
							children: "Inventory"
						}), /* @__PURE__ */ jsx("h2", {
							className: "mt-2 font-condensed text-5xl leading-[0.84] font-semibold tracking-[-0.04em] uppercase",
							children: "Stock details."
						})] }), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ jsx(Link, {
								href: index({ query: { product_id: product.id } }),
								children: "Kelola varian"
							})
						})]
					}),
					product.variants.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "mt-5 overflow-x-auto border-y border-ink/20",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[980px] text-left text-xs",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "border-b border-ink/20 text-[9px] tracking-[0.08em] text-ink/55 uppercase",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "SKU"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Grind"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Weight"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Taste notes"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Price"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Shipping"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 pr-4",
										children: "Stock"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3",
										children: "Status"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", { children: product.variants.map((variant) => /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-ink/15 last:border-b-0",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-4 pr-4 font-semibold",
										children: variant.sku
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4 pr-4 capitalize",
										children: humanize(variant.grind_type)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4 pr-4",
										children: variant.net_weight ?? "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "max-w-56 py-4 pr-4",
										children: variant.tasting_notes ?? "-"
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 pr-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: money(variant.sale_price ?? variant.regular_price)
										}), variant.sale_price ? /* @__PURE__ */ jsx("div", {
											className: "mt-1 text-[10px] text-ink/45 line-through",
											children: money(variant.regular_price)
										}) : null]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 pr-4",
										children: [variant.shipping_weight_gram, " g"]
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-4 pr-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-semibold",
											children: variant.stock_quantity
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-1 text-[10px] text-ink/50",
											children: [
												"Alert at",
												" ",
												variant.low_stock_threshold
											]
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-4",
										children: /* @__PURE__ */ jsx("span", {
											className: `inline-flex px-2.5 py-1 text-[9px] font-semibold tracking-[0.06em] uppercase ${variant.is_active ? "bg-teal text-white" : "bg-ink/10 text-ink/60"}`,
											children: variant.is_active ? "Active" : "Inactive"
										})
									})
								]
							}, variant.id)) })]
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "py-10 text-center text-sm text-ink/55",
						children: "Belum ada varian produk."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[10px] text-ink/55",
						children: [
							/* @__PURE__ */ jsxs("span", { children: ["Created: ", product.created_at ?? "-"] }),
							/* @__PURE__ */ jsxs("span", { children: ["Updated: ", product.updated_at ?? "-"] }),
							/* @__PURE__ */ jsxs("span", { children: ["Slug: ", product.slug] })
						]
					})
				]
			})
		]
	})] });
}
function Detail({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border-r border-b border-ink/15 px-3 py-4 last:border-r-0 sm:px-4",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[9px] font-semibold tracking-[0.08em] text-ink/50 uppercase",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 truncate text-sm font-semibold capitalize",
			children: value
		})]
	});
}
//#endregion
export { ProductShow as default };

//# sourceMappingURL=show-DyfpgAH32.js.map