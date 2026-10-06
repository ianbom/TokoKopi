import { n as show } from "./story-DPEc1iBk.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/components/story-card.tsx
function StoryCard({ story }) {
	return /* @__PURE__ */ jsx("article", {
		className: "min-w-0 border-b border-hairline bg-canvas",
		children: /* @__PURE__ */ jsxs(Link, {
			href: show(story.slug),
			className: "group block h-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal",
			children: [/* @__PURE__ */ jsx("div", {
				className: "aspect-[4/3] overflow-hidden bg-surface-soft",
				children: /* @__PURE__ */ jsx("img", {
					src: story.cover_image_url,
					alt: story.title,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6 lg:p-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap justify-between gap-2 text-[10px] font-semibold tracking-widest text-body uppercase",
						children: [/* @__PURE__ */ jsx("span", { children: story.category }), /* @__PURE__ */ jsxs("span", { children: [story.reading_minutes, " min read"] })]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-4 font-condensed text-4xl leading-none [overflow-wrap:anywhere] text-teal uppercase",
						children: story.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 line-clamp-3 text-sm leading-6 text-body",
						children: story.excerpt
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-6 text-xs font-semibold text-teal uppercase group-hover:underline",
						children: [
							"Read story",
							" ",
							/* @__PURE__ */ jsx("span", {
								"aria-hidden": "true",
								className: "text-primary",
								children: "→"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { StoryCard as t };

//# sourceMappingURL=story-card-t8CyuIlg.js.map