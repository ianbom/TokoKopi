import { Link } from "@inertiajs/react";
import { memo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/components/storefront/editorial-product-grid.tsx
var FALLBACK_IMAGE = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90";
var formatPrice = (value) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0
}).format(value).replace("IDR", "Rp").trim();
function EditorialProductGrid({ products, animated = false }) {
	return /* @__PURE__ */ jsx("section", {
		className: "grid grid-cols-2 border-b border-hairline lg:grid-cols-4",
		children: products.map((product, index) => /* @__PURE__ */ jsxs(Link, {
			href: product.href,
			style: animated ? { animationDelay: `${Math.min(index, 7) * 45}ms` } : void 0,
			className: `group border-r border-b border-hairline bg-white p-5 last:border-r-0 sm:p-7 lg:p-8 ${animated ? "animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none" : ""}`,
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex aspect-[4/5] items-center justify-center overflow-hidden bg-surface-soft sm:aspect-square",
				children: /* @__PURE__ */ jsx("img", {
					src: product.imageUrl ?? FALLBACK_IMAGE,
					alt: product.name,
					loading: "lazy",
					decoding: "async",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "pt-5 text-center text-teal",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-semibold tracking-[0.12em]",
						children: String(index + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-2 text-xs font-semibold tracking-[0.04em] uppercase sm:text-sm",
						children: product.name
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 line-clamp-1 text-[11px] text-body",
						children: product.metadata ?? "Specialty coffee"
					}),
					/* @__PURE__ */ jsx("strong", {
						className: "mt-2 block text-xs font-semibold",
						children: formatPrice(product.price)
					})
				]
			})]
		}, product.id))
	});
}
var editorial_product_grid_default = memo(EditorialProductGrid);
//#endregion
export { editorial_product_grid_default as t };

//# sourceMappingURL=editorial-product-grid-pg8u_lWj.js.map