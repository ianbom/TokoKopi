import { t as index } from "./story-DPEc1iBk.js";
import { t as ShopLayout } from "./shop-layout-TDbKdiGe.js";
import { t as StoryCard } from "./story-card-t8CyuIlg.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/pages/story/index.tsx
function Stories({ stories, categories, filters }) {
	const form = useForm(filters);
	const submit = (event) => {
		event.preventDefault();
		form.get(index.url(), {
			preserveState: true,
			preserveScroll: true,
			replace: true
		});
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, {
		title: "Stories | Deklase",
		children: /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: "Coffee origins, brewing notes, and stories from Deklase."
		})
	}), /* @__PURE__ */ jsxs("main", {
		className: "bg-canvas text-teal",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "grid border-b border-hairline md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col justify-center px-7 py-12 lg:px-14 lg:py-20",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold tracking-widest uppercase",
							children: "Deklase Stories"
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "mt-6 font-condensed text-[clamp(64px,8vw,118px)] leading-[0.84] tracking-tight uppercase",
							children: [
								"Coffee,",
								/* @__PURE__ */ jsx("br", {}),
								"beyond",
								/* @__PURE__ */ jsx("br", {}),
								"the cup."
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-7 max-w-sm text-sm leading-6 text-body",
							children: "From origin to your everyday ritual. Explore the people, places, and ideas behind our coffee."
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "relative min-h-64 bg-teal md:min-h-96",
					children: stories.data[0] ? /* @__PURE__ */ jsx("img", {
						src: stories.data[0].cover_image_url,
						alt: stories.data[0].title,
						fetchPriority: "high",
						className: "absolute inset-0 h-full w-full object-cover"
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex h-full min-h-64 items-center justify-center p-7 font-condensed text-5xl text-white uppercase",
						children: [
							"Good coffee.",
							/* @__PURE__ */ jsx("br", {}),
							"More to discover."
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "grid gap-3 border-b border-hairline p-5 sm:grid-cols-2 lg:grid-cols-[1fr_220px_180px_auto] lg:px-10 lg:py-6",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "grid gap-2 text-xs font-semibold uppercase",
						children: ["Search stories", /* @__PURE__ */ jsx("input", {
							type: "search",
							value: form.data.search,
							onChange: (event) => form.setData("search", event.target.value),
							placeholder: "Search coffee stories",
							className: "h-11 min-w-0 border border-hairline bg-canvas px-3 text-sm font-normal normal-case"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "grid gap-2 text-xs font-semibold uppercase",
						children: ["Category", /* @__PURE__ */ jsxs("select", {
							value: form.data.category,
							onChange: (event) => form.setData("category", event.target.value),
							className: "h-11 min-w-0 border border-hairline bg-canvas px-3 text-sm font-normal normal-case",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "All stories"
							}), categories.map((category) => /* @__PURE__ */ jsx("option", {
								value: category,
								children: category
							}, category))]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "grid gap-2 text-xs font-semibold uppercase",
						children: ["Sort", /* @__PURE__ */ jsxs("select", {
							value: form.data.sort,
							onChange: (event) => form.setData("sort", event.target.value),
							className: "h-11 border border-hairline bg-canvas px-3 text-sm font-normal normal-case",
							children: [/* @__PURE__ */ jsx("option", {
								value: "latest",
								children: "Latest first"
							}), /* @__PURE__ */ jsx("option", {
								value: "oldest",
								children: "Oldest first"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: form.processing,
						className: "h-11 self-end rounded-full border border-teal px-6 text-xs font-semibold uppercase transition-colors hover:bg-teal hover:text-white disabled:opacity-50",
						children: "Apply filters"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-hairline px-5 py-5 text-xs uppercase lg:px-10",
				children: [/* @__PURE__ */ jsx("h2", { children: "Our stories" }), /* @__PURE__ */ jsxs("p", { children: [stories.total, " stories"] })]
			}),
			stories.data.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3",
				children: stories.data.map((story) => /* @__PURE__ */ jsx(StoryCard, { story }, story.id))
			}) : /* @__PURE__ */ jsx("p", {
				className: "px-7 py-20 text-center text-body",
				children: "No stories found. Try another search or check back soon."
			}),
			stories.total > 0 && /* @__PURE__ */ jsx("nav", {
				"aria-label": "Story pagination",
				className: "flex flex-wrap justify-center gap-2 border-t border-hairline px-5 py-8",
				children: stories.links.map((link, position) => {
					const label = position === 0 ? "Previous" : position === stories.links.length - 1 ? "Next" : link.label;
					const className = "inline-flex min-h-11 min-w-11 items-center justify-center border border-hairline px-4 text-xs " + (link.active ? "bg-teal text-white" : "hover:bg-surface-soft");
					return link.url ? /* @__PURE__ */ jsx(Link, {
						href: link.url,
						"aria-current": link.active ? "page" : void 0,
						className,
						children: label
					}, position) : /* @__PURE__ */ jsx("span", {
						"aria-disabled": "true",
						className: className + " opacity-40",
						children: label
					}, position);
				})
			})
		]
	})] });
}
//#endregion
export { Stories as default };

//# sourceMappingURL=story-BfyabiH2.js.map