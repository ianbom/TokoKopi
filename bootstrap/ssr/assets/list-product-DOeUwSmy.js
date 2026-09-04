import { a as detail, s as list } from "./routes-BtCAeSqc.js";
import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { t as editorial_product_grid_default } from "./editorial-product-grid-pg8u_lWj.js";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight } from "lucide-react";
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
var humanize = (value) => value.replaceAll("_", " ");
var cleanQuery = (filters) => Object.fromEntries(Object.entries(filters).filter(([key, value]) => value !== "" && !(key === "sort" && value === "featured")));
function ListProduct({ products, filters, options }) {
	const [isFiltering, setIsFiltering] = useState(false);
	const [openFilter, setOpenFilter] = useState(null);
	const visit = (changes) => {
		const next = {
			...filters,
			...changes
		};
		setOpenFilter(null);
		setIsFiltering(true);
		router.get(list.url(), cleanQuery(next), {
			onFinish: () => setIsFiltering(false),
			preserveScroll: true,
			preserveState: true,
			replace: true
		});
	};
	const selectedCategory = options.categories.find((category) => category.slug === filters.category);
	const selectedPrice = options.priceRanges.find((price) => price.value === filters.price);
	const selectedSort = options.sorts.find((sort) => sort.value === filters.sort);
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
					src: "/images/product-list-hero.png",
					alt: "Coffee pouch and cup on a sunlit table",
					fetchPriority: "high",
					decoding: "async",
					className: "h-[220px] w-full object-cover lg:h-full"
				})]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "relative z-40 bg-canvas",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative z-40 grid grid-cols-2 border-b border-hairline text-[9px] font-semibold tracking-[0.06em] text-ink uppercase sm:grid-cols-3 lg:grid-cols-[1.15fr_.9fr_1.1fr_.8fr_1.2fr_1.45fr_1.4fr]",
				children: [
					/* @__PURE__ */ jsx(FilterMenu, {
						id: "category",
						isOpen: openFilter === "category",
						label: selectedCategory?.name ?? "Category",
						onOpenChange: setOpenFilter,
						options: options.categories.map((category) => ({
							value: category.slug,
							label: category.name
						})),
						value: filters.category,
						onChange: (category) => visit({
							category,
							type: ""
						})
					}),
					/* @__PURE__ */ jsx(FilterMenu, {
						id: "grind-type",
						isOpen: openFilter === "grind-type",
						label: filters.grind_type ? humanize(filters.grind_type) : "Grind Type",
						onOpenChange: setOpenFilter,
						options: options.grindTypes.map((grindType) => ({
							value: grindType,
							label: humanize(grindType)
						})),
						value: filters.grind_type,
						onChange: (grindType) => visit({ grind_type: grindType })
					}),
					/* @__PURE__ */ jsx(FilterMenu, {
						id: "process",
						isOpen: openFilter === "process",
						label: filters.process || "Process",
						onOpenChange: setOpenFilter,
						options: options.processes.map((process) => ({
							value: process,
							label: process
						})),
						value: filters.process,
						onChange: (process) => visit({ process })
					}),
					/* @__PURE__ */ jsx(FilterMenu, {
						id: "price",
						isOpen: openFilter === "price",
						label: selectedPrice?.label ?? "Price",
						onOpenChange: setOpenFilter,
						options: options.priceRanges,
						value: filters.price,
						onChange: (price) => visit({ price })
					}),
					/* @__PURE__ */ jsx("span", { className: "hidden border-r border-hairline lg:block" }),
					/* @__PURE__ */ jsx(FilterMenu, {
						id: "sort",
						isOpen: openFilter === "sort",
						label: `Sort By: ${selectedSort?.label ?? "Featured"}`,
						onOpenChange: setOpenFilter,
						options: options.sorts,
						value: filters.sort,
						onChange: (sort) => visit({ sort })
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "flex min-h-[49px] items-center justify-center border-r border-hairline px-4 text-[10px] font-normal tracking-normal text-ink/70 normal-case sm:border-r-0",
						children: [
							"Showing ",
							products.total,
							" products"
						]
					})
				]
			}), /* @__PURE__ */ jsx("nav", {
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
			})]
		}),
		/* @__PURE__ */ jsx(ProductGrid, {
			filterKey: JSON.stringify(cleanQuery(filters)),
			isFiltering,
			products: products.data
		}),
		/* @__PURE__ */ jsx(ProductPagination, { products })
	] });
}
function FilterMenu({ id, isOpen, label, onOpenChange, options, value, onChange }) {
	const menuRef = useRef(null);
	useEffect(() => {
		if (!isOpen) return;
		const closeOnOutsideClick = (event) => {
			if (!menuRef.current?.contains(event.target)) onOpenChange(null);
		};
		const closeOnEscape = (event) => {
			if (event.key === "Escape") onOpenChange(null);
		};
		document.addEventListener("pointerdown", closeOnOutsideClick);
		document.addEventListener("keydown", closeOnEscape);
		return () => {
			document.removeEventListener("pointerdown", closeOnOutsideClick);
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, [isOpen, onOpenChange]);
	const selectOption = (nextValue) => {
		onOpenChange(null);
		onChange(nextValue);
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: menuRef,
		className: `relative border-r border-hairline ${isOpen ? "z-50" : ""}`,
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-expanded": isOpen,
			"aria-haspopup": "menu",
			onClick: () => onOpenChange(isOpen ? null : id),
			className: "flex h-[49px] w-full cursor-pointer items-center justify-center gap-6 px-5 transition-colors duration-200 hover:bg-canvas/70 motion-reduce:transition-none",
			children: [/* @__PURE__ */ jsx("span", {
				className: "truncate",
				children: label
			}), /* @__PURE__ */ jsx(ArrowRight, {
				size: 13,
				strokeWidth: 1.8,
				className: `shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-90" : ""}`
			})]
		}), /* @__PURE__ */ jsxs("div", {
			role: "menu",
			"aria-hidden": !isOpen,
			className: `absolute top-full left-0 z-50 max-h-72 min-w-full origin-top overflow-y-auto border border-hairline bg-canvas py-2 shadow-xl transition duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${isOpen ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100" : "pointer-events-none -translate-y-1 scale-y-95 opacity-0"}`,
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				role: "menuitemradio",
				"aria-checked": value === "",
				tabIndex: isOpen ? 0 : -1,
				onClick: () => selectOption(""),
				className: `block w-full px-4 py-2 text-left text-[10px] tracking-[0.06em] uppercase hover:bg-sand ${value === "" ? "bg-sand" : ""}`,
				children: "All"
			}), options.map((option) => /* @__PURE__ */ jsx("button", {
				type: "button",
				role: "menuitemradio",
				"aria-checked": value === option.value,
				tabIndex: isOpen ? 0 : -1,
				onClick: () => selectOption(option.value),
				className: `block w-full px-4 py-2 text-left text-[10px] tracking-[0.06em] uppercase hover:bg-sand ${value === option.value ? "bg-sand" : ""}`,
				children: option.label
			}, option.value))]
		})]
	});
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

//# sourceMappingURL=list-product-DOeUwSmy.js.map