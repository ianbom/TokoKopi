import { i as detail, o as list } from "./routes-DbqRfbKV.js";
import { t as ShopLayout } from "./shop-layout-I9ky1mHR.js";
import { t as editorial_product_grid_default } from "./editorial-product-grid-DbD-Br3z.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/customer/products/list-product.tsx
var quickLinks = [
	{
		label: "All",
		filters: {}
	},
	{
		label: "Coffee Beans",
		filters: { category: "coffee-beans" }
	},
	{
		label: "Espresso",
		filters: { category: "espresso" }
	},
	{
		label: "Filter Coffee",
		filters: { category: "filter-coffee" }
	},
	{
		label: "Ready to Drink",
		filters: { category: "ready-to-drink" }
	},
	{
		label: "Best Sellers",
		filters: { type: "best_seller" }
	}
];
var cleanQuery = (filters) => Object.fromEntries(Object.entries(filters).filter(([key, value]) => value !== "" && !(key === "sort" && value === "featured")));
function ListProduct({ products, filters }) {
	const [isFiltering, setIsFiltering] = useState(false);
	const visit = (changes) => {
		const next = {
			...filters,
			...changes
		};
		setIsFiltering(true);
		router.get(list.url(), cleanQuery(next), {
			onFinish: () => setIsFiltering(false),
			preserveScroll: true,
			preserveState: true,
			replace: true
		});
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "List Product" }),
		/* @__PURE__ */ jsx("section", {
			className: "border-t border-b border-hairline",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid lg:h-[327px] lg:grid-cols-[48.7%_51.3%]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-[280px] flex-col justify-between bg-[#f1e8dc] px-7 py-7 sm:px-12 sm:py-10 lg:min-h-0 lg:px-12 lg:py-14",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[9px] font-semibold tracking-[0.08em] text-ink uppercase",
							children: "Collection"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-condensed text-[clamp(44px,5.6vw,80px)] leading-[0.86] font-semibold tracking-[-0.045em] text-ink uppercase",
							children: "Shop All Coffee"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 max-w-[460px] text-[12px] leading-[1.45] text-ink/85 sm:text-[14px]",
							children: "Explore Deklase's full collection of whole bean coffee, ready-to-drink cans, and everyday ritual essentials. Thoughtfully roasted, beautifully packaged, and designed for modern coffee routines."
						})
					] }), /* @__PURE__ */ jsxs("p", {
						className: "mt-7 text-[9px] font-semibold tracking-[0.08em] text-ink uppercase",
						children: [products.total, " Products"]
					})]
				}), /* @__PURE__ */ jsx("img", {
					src: "/deklase-2.webp",
					alt: "Coffee pouch and cup on a sunlit table",
					fetchPriority: "high",
					decoding: "async",
					className: "h-[220px] w-full object-cover lg:h-full"
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "relative z-40 bg-canvas",
			children: /* @__PURE__ */ jsx("nav", {
				className: "relative z-10 flex min-w-max items-center justify-center gap-10 overflow-x-auto border-b border-hairline px-8 py-[17px] text-[10px] font-semibold tracking-[0.06em] text-ink uppercase sm:gap-16",
				children: quickLinks.map((link) => {
					const isActive = link.filters.category ? filters.category === link.filters.category && filters.type === "" : link.filters.type ? filters.type === link.filters.type && filters.category === "" : filters.category === "" && filters.type === "";
					return /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-pressed": isActive,
						onClick: () => visit({
							category: link.filters.category ?? "",
							type: link.filters.type ?? "",
							grind_type: "",
							process: "",
							price: ""
						}),
						className: `relative border-b-2 py-1 whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${isActive ? "border-ink font-extrabold text-ink" : "border-transparent font-semibold text-ink/55 hover:border-ink/35 hover:text-ink"}`,
						children: link.label
					}, link.label);
				})
			})
		}),
		/* @__PURE__ */ jsx(ProductGrid, {
			filterKey: JSON.stringify(cleanQuery(filters)),
			isFiltering,
			products: products.data
		}),
		/* @__PURE__ */ jsx(ProductPagination, { products })
	] });
}
function ProductGrid({ filterKey, isFiltering, products }) {
	return /* @__PURE__ */ jsx("div", {
		"aria-busy": isFiltering,
		className: `border-t border-hairline transition duration-200 motion-reduce:transform-none motion-reduce:transition-none ${isFiltering ? "translate-y-1 opacity-50" : "translate-y-0 opacity-100"}`,
		children: /* @__PURE__ */ jsx(editorial_product_grid_default, {
			products: products.map((product) => ({
				id: product.id,
				name: product.title,
				imageUrl: product.image_url,
				metadata: product.short_description,
				price: product.sale_price ?? product.price,
				href: detail.url({ query: { product: product.slug } })
			})),
			animated: true
		})
	}, filterKey);
}
function ProductPagination({ products }) {
	if (products.last_page <= 1) return null;
	const previous = products.links[0];
	const next = products.links.at(-1);
	return /* @__PURE__ */ jsxs("nav", {
		"aria-label": "Product pagination",
		className: "flex items-center justify-between gap-4 border-b border-hairline bg-white px-5 py-5 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase sm:px-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "hidden text-body sm:block",
			children: [
				products.from,
				"–",
				products.to,
				" of ",
				products.total
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1",
			children: [
				previous?.url ? /* @__PURE__ */ jsx(Link, {
					href: previous.url,
					preserveScroll: true,
					preserveState: true,
					replace: true,
					className: "border border-hairline bg-white px-3 py-2 text-teal transition-colors hover:bg-sand",
					children: "Previous"
				}) : /* @__PURE__ */ jsx("span", {
					"aria-disabled": "true",
					className: "px-3 py-2 text-body/40",
					children: "Previous"
				}),
				products.links.slice(1, -1).map((link, index) => {
					const label = link.label.replace(/<[^>]+>/g, "").trim();
					if (!link.url) return /* @__PURE__ */ jsx("span", {
						"aria-disabled": "true",
						className: "px-3 py-2 text-body/40",
						children: label
					}, `${label}-${index}`);
					return /* @__PURE__ */ jsx(Link, {
						href: link.url,
						preserveScroll: true,
						preserveState: true,
						replace: true,
						"aria-current": link.active ? "page" : void 0,
						className: `border border-hairline px-3 py-2 transition-colors hover:bg-sand ${link.active ? "bg-teal text-white" : "bg-white text-teal"}`,
						children: label
					}, `${label}-${index}`);
				}),
				next?.url ? /* @__PURE__ */ jsx(Link, {
					href: next.url,
					preserveScroll: true,
					preserveState: true,
					replace: true,
					className: "border border-hairline bg-white px-3 py-2 text-teal transition-colors hover:bg-sand",
					children: "Next"
				}) : /* @__PURE__ */ jsx("span", {
					"aria-disabled": "true",
					className: "px-3 py-2 text-body/40",
					children: "Next"
				})
			]
		})]
	});
}
//#endregion
export { ListProduct as default };

//# sourceMappingURL=list-product-C92sfoL4.js.map