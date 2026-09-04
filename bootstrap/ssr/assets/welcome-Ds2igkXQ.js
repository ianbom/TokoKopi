import { s as list } from "./routes-BtCAeSqc.js";
import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { t as editorial_product_grid_default } from "./editorial-product-grid-pg8u_lWj.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/welcome.tsx
var images = {
	hero: "/logo/dc-bg.jpg",
	ritual: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90",
	morning: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=1400&q=90"
};
function OutlineLink({ children }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex w-max items-center gap-4 rounded-full border border-current px-4 py-2 text-[10px] font-semibold tracking-[0.06em] uppercase",
		children: [children, /* @__PURE__ */ jsx("span", {
			className: "text-sm leading-none text-primary",
			children: "→"
		})]
	});
}
function Welcome({ wePresent, mostLoved }) {
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Deklase Coffee" }), /* @__PURE__ */ jsxs("div", {
		className: "overflow-x-clip bg-canvas text-ink",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "grid min-h-[500px] grid-cols-1 border-b border-hairline lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-[430px] flex-col justify-between bg-white p-7 sm:p-12 lg:min-h-0 lg:p-14",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "max-w-[220px] text-xs leading-5 text-teal sm:text-sm",
							children: [
								"Roasted slowly. Made deliberately.",
								/* @__PURE__ */ jsx("br", {}),
								"Coffee for everyday rituals."
							]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: list.url(),
							className: "w-max",
							children: /* @__PURE__ */ jsx(OutlineLink, { children: "Shop coffee" })
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "font-condensed text-[clamp(64px,8vw,138px)] leading-[0.81] font-semibold tracking-[-0.055em] text-teal uppercase",
							children: [
								"Coffee",
								/* @__PURE__ */ jsx("br", {}),
								"without",
								/* @__PURE__ */ jsx("br", {}),
								"the routine."
							]
						})
					]
				}), /* @__PURE__ */ jsx("img", {
					src: images.hero,
					alt: "Hand holding a Deklase coffee can",
					fetchPriority: "high",
					className: "h-full min-h-[300px] w-full object-cover contrast-95 saturate-75"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-8 items-center justify-center gap-4 overflow-hidden bg-teal px-4 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-white uppercase",
				children: [
					"Slow roasted ",
					/* @__PURE__ */ jsx("i", { className: "h-px w-4 bg-primary" }),
					" Daily rituals ",
					/* @__PURE__ */ jsx("i", { className: "h-px w-4 bg-primary" }),
					" Specialty coffee ",
					/* @__PURE__ */ jsx("i", { className: "h-px w-4 bg-primary" }),
					" Good mornings",
					/* @__PURE__ */ jsx("i", { className: "h-px w-4 bg-primary" }),
					" Brew different"
				]
			}),
			/* @__PURE__ */ jsx(editorial_product_grid_default, { products: wePresent.slice(0, 4).map((product) => ({
				id: product.id,
				name: product.title ?? product.name,
				imageUrl: product.image_url,
				metadata: product.category ?? product.short_description ?? null,
				price: product.price,
				href: list.url({ query: { search: product.name } })
			})) }),
			/* @__PURE__ */ jsxs("section", {
				id: "story",
				className: "grid border-b border-hairline lg:grid-cols-2",
				children: [/* @__PURE__ */ jsx("img", {
					src: images.ritual,
					alt: "Pour-over coffee ritual",
					loading: "lazy",
					className: "h-full min-h-[300px] w-full object-cover saturate-75"
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-teal p-8 text-white sm:p-12 lg:p-14",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-semibold tracking-[0.12em] text-primary uppercase",
							children: "Our approach"
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "mt-5 max-w-xl font-condensed text-[clamp(56px,5.8vw,95px)] leading-[0.81] font-semibold tracking-[-0.055em] uppercase",
							children: [
								"Better coffee",
								/* @__PURE__ */ jsx("br", {}),
								"starts with",
								/* @__PURE__ */ jsx("br", {}),
								"better details."
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-5 max-w-sm text-sm leading-5 text-white/90",
							children: "Carefully selected beans, thoughtful roasting profiles, uncomplicated brewing. Great coffee does not need to be complicated."
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#story",
							className: "mt-6 inline-block text-xs font-semibold tracking-[0.06em] text-primary uppercase",
							children: "Read our story ↗"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(editorial_product_grid_default, { products: mostLoved.slice(0, 4).map((product) => ({
				id: product.id,
				name: product.title ?? product.name,
				imageUrl: product.image_url,
				metadata: product.category ?? product.short_description ?? null,
				price: product.price,
				href: list.url({ query: { search: product.name } })
			})) }),
			/* @__PURE__ */ jsxs("section", {
				className: "grid border-b border-hairline lg:grid-cols-[.9fr_1.1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-[230px] flex-col justify-between bg-white p-7 sm:p-12",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "max-w-xs text-xs leading-5 text-teal sm:text-sm",
							children: "Good coffee does not need an occasion. Sometimes the ritual is enough."
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "font-condensed text-[clamp(56px,5.7vw,100px)] leading-[0.81] font-semibold tracking-[-0.055em] text-teal uppercase",
							children: [
								"Make",
								/* @__PURE__ */ jsx("br", {}),
								"mornings",
								/* @__PURE__ */ jsx("br", {}),
								"matter."
							]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: list.url(),
							className: "w-max",
							children: /* @__PURE__ */ jsx(OutlineLink, { children: "Shop coffee" })
						})
					]
				}), /* @__PURE__ */ jsx("img", {
					src: images.hero,
					alt: "Coffee to go in the morning",
					loading: "lazy",
					className: "min-h-[230px] w-full object-cover saturate-75"
				})]
			})
		]
	})] });
}
//#endregion
export { Welcome as default };

//# sourceMappingURL=welcome-Ds2igkXQ.js.map