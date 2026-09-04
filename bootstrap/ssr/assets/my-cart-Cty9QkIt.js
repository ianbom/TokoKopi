import { a as detail, r as checkout, s as list } from "./routes-BtCAeSqc.js";
import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { n as removeCartItem, r as updateCartItemQuantity } from "./CartController-DqDmRnvp.js";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region resources/js/pages/customer/cart/my-cart.tsx
var formatPrice = (price) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(price).replace("Rp", "Rp ");
var productMeta = (item) => [item.net_weight, item.grind_type?.replaceAll("_", " ")].filter(Boolean).join(" / ");
var stockIssueMessage = (item) => {
	if (item.available_stock <= 0) return "Stok habis. Hapus produk ini atau tunggu stok tersedia.";
	if (item.available_stock < item.quantity) return `Stok tersedia ${item.available_stock}. Sesuaikan jumlah sebelum checkout.`;
	return "Produk ini tidak lagi tersedia.";
};
function MyCart({ cartItems, summary, suggestedProducts }) {
	const { errors } = usePage().props;
	const [processingItemId, setProcessingItemId] = useState(null);
	const [processingAction, setProcessingAction] = useState(null);
	const hasStockIssues = useMemo(() => cartItems.some((item) => !item.is_available), [cartItems]);
	const updateQuantity = (item, quantity) => {
		if (processingItemId !== null || quantity < 1 || quantity === item.quantity || quantity > item.available_stock) return;
		setProcessingItemId(item.id);
		setProcessingAction("update");
		router.patch(updateCartItemQuantity(item.id), { quantity }, {
			preserveScroll: true,
			preserveState: true,
			onFinish: () => {
				setProcessingItemId(null);
				setProcessingAction(null);
			}
		});
	};
	const removeItem = (item) => {
		if (processingItemId !== null) return;
		setProcessingItemId(item.id);
		setProcessingAction("remove");
		router.delete(removeCartItem(item.id), {
			preserveScroll: true,
			preserveState: true,
			onFinish: () => {
				setProcessingItemId(null);
				setProcessingAction(null);
			}
		});
	};
	const continueToCheckout = () => {
		if (hasStockIssues) {
			toast.error("Sesuaikan produk yang stoknya tidak tersedia.");
			return;
		}
		router.visit(checkout.url());
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Keranjang Deklasee" }),
		/* @__PURE__ */ jsx("section", {
			className: "border-t border-b border-hairline bg-sand",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid min-h-[190px] lg:grid-cols-[1.25fr_.75fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col justify-between border-b border-hairline px-7 py-8 sm:px-12 lg:border-r lg:border-b-0 lg:px-16 lg:py-10",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[9px] font-semibold tracking-[0.1em] uppercase",
						children: "Your selection"
					}), /* @__PURE__ */ jsx("h1", {
						className: "mt-8 font-condensed text-[clamp(50px,6vw,86px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase",
						children: "Your cart."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-end px-7 py-8 sm:px-12 lg:px-10 lg:py-10",
					children: /* @__PURE__ */ jsx("p", {
						className: "max-w-xs text-[12px] leading-[1.45] text-ink/80",
						children: "Kopi pilihan Anda, siap dikirim untuk ritual seduh berikutnya."
					})
				})]
			})
		}),
		cartItems.length === 0 ? /* @__PURE__ */ jsx(EmptyCart, {}) : /* @__PURE__ */ jsx("main", {
			className: "border-b border-hairline",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid lg:grid-cols-[minmax(0,1fr)_370px]",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "min-w-0 border-b border-hairline lg:border-r lg:border-b-0",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-hairline px-7 py-3 text-[9px] font-semibold tracking-[0.08em] uppercase sm:px-10",
							children: [/* @__PURE__ */ jsxs("span", { children: [summary.item_count, " items selected"] }), /* @__PURE__ */ jsx(Link, {
								href: list.url(),
								className: "underline underline-offset-4 hover:text-primary",
								children: "Continue shopping"
							})]
						}),
						errors.quantity && /* @__PURE__ */ jsx("p", {
							className: "border-b border-hairline bg-primary/10 px-7 py-3 text-[11px] text-ink sm:px-10",
							children: errors.quantity
						}),
						/* @__PURE__ */ jsx("div", {
							className: "divide-y divide-hairline",
							children: cartItems.map((item, index) => /* @__PURE__ */ jsx(CartLine, {
								item,
								index,
								processing: processingItemId === item.id,
								processingAction,
								onDecrease: () => updateQuantity(item, item.quantity - 1),
								onIncrease: () => updateQuantity(item, item.quantity + 1),
								onRemove: () => removeItem(item)
							}, item.id))
						})
					]
				}), /* @__PURE__ */ jsx(OrderSummary, {
					summary,
					disabled: hasStockIssues,
					onCheckout: continueToCheckout
				})]
			})
		})
	] });
}
function CartLine({ item, index, processing, processingAction, onDecrease, onIncrease, onRemove }) {
	const disabled = processing || !item.is_available;
	return /* @__PURE__ */ jsxs("article", {
		className: "grid gap-5 px-7 py-6 sm:grid-cols-[150px_minmax(0,1fr)] sm:px-10 sm:py-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[1.05] overflow-hidden bg-oat",
			children: [/* @__PURE__ */ jsx("span", {
				className: "absolute top-3 left-3 z-10 text-[8px] font-semibold tracking-[0.08em] uppercase",
				children: String(index + 1).padStart(2, "0")
			}), item.image ? /* @__PURE__ */ jsx("img", {
				src: item.image,
				alt: item.title,
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ jsx("span", {
				className: "flex h-full items-center justify-center px-4 text-center text-[9px] font-semibold tracking-[0.08em] text-ink/60 uppercase",
				children: "Image unavailable"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					item.product_slug ? /* @__PURE__ */ jsx(Link, {
						href: detail.url({ query: { product: item.product_slug } }),
						className: "font-condensed text-[clamp(28px,3vw,40px)] leading-[0.86] font-semibold tracking-[-0.035em] uppercase hover:text-primary",
						children: item.title
					}) : /* @__PURE__ */ jsx("h2", {
						className: "font-condensed text-[clamp(28px,3vw,40px)] leading-[0.86] font-semibold tracking-[-0.035em] uppercase",
						children: item.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[10px] tracking-[0.05em] text-ink/70 uppercase",
						children: productMeta(item) || "Coffee variant"
					}),
					item.variant.sku && /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[9px] tracking-[0.04em] text-ink/55 uppercase",
						children: ["SKU ", item.variant.sku]
					}),
					!item.is_available && /* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-sm border-l-2 border-primary pl-3 text-[10px] leading-4 text-ink/80",
						children: stockIssueMessage(item)
					})
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-6 sm:flex-col sm:items-end",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[12px] font-semibold tabular-nums",
						children: formatPrice(item.subtotal)
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: onRemove,
						disabled: processing,
						className: "flex items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase hover:text-primary disabled:opacity-50",
						children: [
							/* @__PURE__ */ jsx(Trash2, { size: 14 }),
							" ",
							processingAction === "remove" ? "Removing" : "Remove"
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-hairline pt-4 sm:col-span-2",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-ink/65",
						children: item.is_available ? `${item.available_stock} tersedia` : "Tidak tersedia untuk checkout"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex h-9 border border-hairline",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onDecrease,
								disabled: disabled || item.quantity <= 1,
								className: "grid w-9 place-items-center hover:bg-oat disabled:opacity-35",
								"aria-label": `Kurangi ${item.title}`,
								children: /* @__PURE__ */ jsx(Minus, { size: 14 })
							}),
							/* @__PURE__ */ jsx("span", {
								className: "grid w-10 place-items-center border-x border-hairline text-[11px] font-semibold tabular-nums",
								children: item.quantity
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onIncrease,
								disabled: disabled || item.quantity >= item.available_stock,
								className: "grid w-9 place-items-center hover:bg-oat disabled:opacity-35",
								"aria-label": `Tambah ${item.title}`,
								children: /* @__PURE__ */ jsx(Plus, { size: 14 })
							})
						]
					})]
				})
			]
		})]
	});
}
function OrderSummary({ summary, disabled, onCheckout }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "bg-surface-dark px-7 py-8 text-canvas sm:px-10 lg:sticky lg:top-0 lg:h-fit",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-[9px] font-semibold tracking-[0.1em] text-oat uppercase",
				children: "Order summary"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-3 font-condensed text-[42px] leading-[0.82] font-semibold tracking-[-0.04em] uppercase",
				children: "Ready to brew."
			}),
			/* @__PURE__ */ jsxs("dl", {
				className: "mt-8 border-t border-oat/35 text-[11px]",
				children: [
					/* @__PURE__ */ jsx(SummaryRow, {
						label: "Subtotal",
						value: formatPrice(summary.subtotal)
					}),
					/* @__PURE__ */ jsx(SummaryRow, {
						label: "Shipping",
						value: "Calculated at checkout"
					}),
					/* @__PURE__ */ jsx(SummaryRow, {
						label: "Total",
						value: formatPrice(summary.total),
						emphasis: true
					})
				]
			}),
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: onCheckout,
				disabled,
				className: "mt-8 flex w-full items-center justify-between rounded-none bg-primary px-5 py-4 text-[10px] font-semibold tracking-[0.1em] text-white uppercase transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45",
				children: ["Checkout ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-[10px] leading-4 text-oat/80",
				children: "Ongkir dan metode pembayaran dikonfirmasi pada langkah berikutnya."
			})
		]
	});
}
function SummaryRow({ label, value, emphasis = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between border-b border-oat/35 py-4",
		children: [/* @__PURE__ */ jsx("dt", {
			className: emphasis ? "font-semibold uppercase" : "text-oat/80",
			children: label
		}), /* @__PURE__ */ jsx("dd", {
			className: emphasis ? "font-semibold tabular-nums" : "text-oat/85",
			children: value
		})]
	});
}
function EmptyCart() {
	return /* @__PURE__ */ jsx("section", {
		className: "grid min-h-[360px] place-items-center border-b border-hairline bg-canvas px-7 py-16 text-center",
		children: /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-[9px] font-semibold tracking-[0.1em] uppercase",
				children: "Nothing here yet"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-3 font-condensed text-[clamp(48px,6vw,82px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase",
				children: "Find your coffee."
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mx-auto mt-5 max-w-sm text-[12px] leading-[1.45] text-ink/75",
				children: "Pilih kopi dari koleksi kami untuk memulai keranjang Anda."
			}),
			/* @__PURE__ */ jsxs(Link, {
				href: list.url(),
				className: "mt-7 inline-flex items-center gap-3 rounded-none bg-ink px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary",
				children: ["Shop coffee ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
			})
		] })
	});
}
//#endregion
export { MyCart as default };

//# sourceMappingURL=my-cart-Cty9QkIt.js.map