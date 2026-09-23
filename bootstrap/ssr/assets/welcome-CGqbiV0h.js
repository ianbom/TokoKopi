import { o as list } from "./routes-DbqRfbKV.js";
import { t as ShopLayout } from "./shop-layout-I9ky1mHR.js";
import { t as editorial_product_grid_default } from "./editorial-product-grid-DbD-Br3z.js";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
//#region resources/js/pages/welcome.tsx
var images = {
	hero: "/logo/dc-bg.jpg",
	cta: "/dekalse-1.webp",
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
function Welcome({ wePresent, mostLoved, welcomeText, welcomeCarousel = [] }) {
	const slides = welcomeCarousel.length ? welcomeCarousel : [{
		image_url: images.hero,
		alt_text: "Hand holding a Deklase coffee can",
		sort_order: 1
	}];
	const heading = (welcomeText || "Coffee\nwithout\nthe routine.").split(/\r?\n/).filter(Boolean);
	const [activeSlide, setActiveSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const currentSlideIndex = activeSlide % slides.length;
	useEffect(() => {
		if (isPaused || slides.length < 2) return;
		const interval = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5e3);
		return () => window.clearInterval(interval);
	}, [isPaused, slides.length]);
	const changeSlide = (direction) => setActiveSlide((current) => (current + direction + slides.length) % slides.length);
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Deklase Coffee" }), /* @__PURE__ */ jsxs("div", {
		className: "overflow-x-clip bg-canvas text-ink",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "grid min-h-[calc(100dvh-3.5rem)] grid-cols-1 border-b border-hairline sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-68px)] lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-[430px] flex-col justify-between bg-white p-7 sm:p-12 lg:min-h-0 lg:p-14",
					children: [/* @__PURE__ */ jsx(Link, {
						href: list.url(),
						className: "w-max",
						children: /* @__PURE__ */ jsx(OutlineLink, { children: "Shop coffee" })
					}), /* @__PURE__ */ jsx("h1", {
						className: "font-condensed text-[clamp(64px,8vw,138px)] leading-[0.81] font-semibold tracking-[-0.055em] text-teal uppercase",
						children: heading.map((line, index) => /* @__PURE__ */ jsxs("span", { children: [line, index < heading.length - 1 ? /* @__PURE__ */ jsx("br", {}) : null] }, `${line}-${index}`))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "group relative h-full min-h-[clamp(340px,48dvh,720px)] overflow-hidden",
					onMouseEnter: () => setIsPaused(true),
					onMouseLeave: () => setIsPaused(false),
					onFocus: () => setIsPaused(true),
					onBlur: () => setIsPaused(false),
					children: [slides.map((slide, index) => /* @__PURE__ */ jsx("img", {
						src: slide.image_url,
						alt: slide.alt_text,
						fetchPriority: index === 0 ? "high" : void 0,
						className: `absolute inset-0 h-full min-h-[clamp(340px,48dvh,720px)] w-full object-cover contrast-95 saturate-75 transition-opacity duration-700 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"}`
					}, slide.image_url)), slides.length > 1 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Slide sebelumnya",
							onClick: () => changeSlide(-1),
							className: "absolute top-1/2 left-4 grid size-10 -translate-y-1/2 place-items-center border border-white/60 bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-5" })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Slide berikutnya",
							onClick: () => changeSlide(1),
							className: "absolute top-1/2 right-4 grid size-10 -translate-y-1/2 place-items-center border border-white/60 bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute right-4 bottom-4 flex gap-2",
							children: slides.map((slide, index) => /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": `Tampilkan slide ${index + 1}`,
								"aria-current": index === currentSlideIndex,
								onClick: () => setActiveSlide(index),
								className: `h-1.5 transition-all ${index === currentSlideIndex ? "w-7 bg-white" : "w-3 bg-white/50"}`
							}, slide.image_url))
						})
					] }) : null]
				})]
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
					src: images.cta,
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

//# sourceMappingURL=welcome-CGqbiV0h.js.map