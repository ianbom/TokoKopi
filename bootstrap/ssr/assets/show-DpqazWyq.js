import { a as home } from "./routes-CjewBCXs.js";
import { t as HTMLRender } from "./HTMLRender-V_I0mzWs.js";
import { t as index } from "./story-DPEc1iBk.js";
import { t as ShopLayout } from "./shop-layout-TDbKdiGe.js";
import { t as StoryCard } from "./story-card-t8CyuIlg.js";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowUpRight, Share2 } from "lucide-react";
//#region resources/js/pages/story/show.tsx
function StoryDetail({ story, relatedStories }) {
	const [shareMessage, setShareMessage] = useState("");
	const publishedDate = story.published_at ? new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(story.published_at)) : null;
	const share = async () => {
		setShareMessage("");
		try {
			if (navigator.share) {
				await navigator.share({
					title: story.title,
					text: story.excerpt,
					url: window.location.href
				});
				return;
			}
			await navigator.clipboard.writeText(window.location.href);
			setShareMessage("Link copied.");
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) setShareMessage("Sharing unavailable. Copy the URL from your browser.");
		}
	};
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [/* @__PURE__ */ jsx(Head, {
		title: story.title + " | Deklase Stories",
		children: /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: story.excerpt
		})
	}), /* @__PURE__ */ jsxs("article", {
		className: "min-w-0 bg-canvas text-teal",
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsxs("nav", {
				"aria-label": "Breadcrumb",
				className: "flex flex-wrap items-center gap-3 border-b border-hairline px-6 text-[11px] font-medium tracking-wider uppercase lg:px-14",
				children: [
					/* @__PURE__ */ jsx(Link, {
						href: home(),
						className: "inline-flex min-h-11 items-center hover:underline",
						children: "Home"
					}),
					/* @__PURE__ */ jsx("span", {
						"aria-hidden": "true",
						children: "/"
					}),
					/* @__PURE__ */ jsx(Link, {
						href: index(),
						className: "inline-flex min-h-11 items-center hover:underline",
						children: "Stories"
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-16 lg:px-14 lg:py-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "mb-6 flex items-center gap-3 text-xs font-semibold tracking-widest uppercase",
						children: [/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							className: "h-px w-8 bg-primary"
						}), story.category]
					}), /* @__PURE__ */ jsx("h1", {
						className: "max-w-4xl font-condensed text-[clamp(48px,7.5vw,116px)] leading-[0.88] tracking-tight [overflow-wrap:anywhere] uppercase",
						children: story.title
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col justify-end lg:border-l lg:border-hairline lg:pl-10",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "max-w-lg text-base leading-7 [overflow-wrap:anywhere] text-body sm:text-lg sm:leading-8",
							children: story.excerpt
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-7 border-t border-hairline pt-5",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-xs font-semibold tracking-wide [overflow-wrap:anywhere] uppercase",
								children: ["By ", story.author_name]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-body",
								children: [publishedDate && /* @__PURE__ */ jsx("time", {
									dateTime: story.published_at,
									children: publishedDate
								}), /* @__PURE__ */ jsxs("span", { children: [story.reading_minutes, " min read"] })]
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: share,
							className: "mt-6 inline-flex min-h-11 items-center justify-between gap-8 self-start border border-teal px-5 text-xs font-semibold tracking-wide uppercase hover:bg-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal motion-safe:transition-colors",
							children: [
								"Share story",
								" ",
								/* @__PURE__ */ jsx(Share2, {
									size: 15,
									"aria-hidden": "true"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							role: "status",
							className: "mt-2 text-xs text-body",
							children: shareMessage
						})
					]
				})]
			})] }),
			/* @__PURE__ */ jsxs("figure", {
				className: "border-y border-hairline",
				children: [/* @__PURE__ */ jsx("div", {
					className: "aspect-[4/3] overflow-hidden bg-surface-soft sm:aspect-[16/9] lg:aspect-[16/7]",
					children: /* @__PURE__ */ jsx("img", {
						src: story.cover_image_url,
						alt: story.title,
						fetchPriority: "high",
						className: "h-full w-full object-cover"
					})
				}), story.cover_caption && /* @__PURE__ */ jsx("figcaption", {
					className: "border-t border-hairline px-6 py-4 text-xs leading-5 [overflow-wrap:anywhere] text-body sm:px-10 lg:px-14",
					children: story.cover_caption
				})]
			}),
			story.pull_quote && /* @__PURE__ */ jsxs("figure", {
				className: "grid gap-6 border-b border-hairline bg-teal px-6 py-10 text-white sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-14 lg:px-14 lg:py-16",
				children: [/* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					className: "font-condensed text-8xl leading-none text-primary lg:text-[140px]",
					children: "“"
				}), /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl min-w-0",
					children: [/* @__PURE__ */ jsx("blockquote", {
						className: "font-condensed text-[clamp(28px,3.5vw,48px)] leading-[1.15] [overflow-wrap:anywhere]",
						children: /* @__PURE__ */ jsx("p", { children: story.pull_quote })
					}), story.quote_attribution && /* @__PURE__ */ jsx("figcaption", {
						className: "mt-6 text-xs font-medium tracking-wider [overflow-wrap:anywhere] text-primary uppercase",
						children: story.quote_attribution
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "px-6 py-12 sm:px-10 sm:py-16 lg:py-20",
				children: [/* @__PURE__ */ jsx(HTMLRender, {
					html: story.body_html,
					className: "mx-auto max-w-[740px] text-base leading-8 [overflow-wrap:anywhere] text-body [&_a]:text-teal [&_a]:decoration-primary [&_a]:underline-offset-4 [&_blockquote]:rounded-none [&_blockquote]:border-primary [&_blockquote]:bg-surface-soft [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-teal [&_h1]:mt-12 [&_h1]:font-condensed [&_h1]:text-4xl [&_h1]:text-teal [&_h2]:mt-12 [&_h2]:font-condensed [&_h2]:text-4xl [&_h2]:text-teal [&_h3]:mt-8 [&_h3]:font-condensed [&_h3]:text-3xl [&_h3]:text-teal [&_h4]:text-teal [&_img]:h-auto [&_img]:max-w-full [&_li]:pl-1 [&_mark]:bg-primary/30 [&_mark]:text-teal [&_ol]:my-6 [&_p]:my-5 [&_pre]:max-w-full [&_strong]:text-teal [&_ul]:my-6 [&>p:first-child]:text-lg [&>p:first-child]:leading-8"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mx-auto mt-10 flex max-w-[740px] items-center justify-between gap-4 border-t border-hairline pt-6",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: index(),
						className: "inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase hover:underline",
						children: [/* @__PURE__ */ jsx(ArrowLeft, {
							size: 16,
							"aria-hidden": "true"
						}), " Back to stories"]
					}), /* @__PURE__ */ jsx("span", {
						"aria-hidden": "true",
						className: "h-px w-12 bg-primary"
					})]
				})]
			}),
			relatedStories.length > 0 && /* @__PURE__ */ jsxs("section", {
				"aria-labelledby": "related-stories-heading",
				className: "border-t border-hairline",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end justify-between gap-6 px-6 py-9 sm:px-10 lg:px-14 lg:py-12",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "mb-3 text-xs font-semibold tracking-widest uppercase",
						children: "Keep reading"
					}), /* @__PURE__ */ jsx("h2", {
						id: "related-stories-heading",
						className: "font-condensed text-[clamp(40px,5vw,64px)] leading-none uppercase",
						children: "More coffee stories"
					})] }), /* @__PURE__ */ jsxs(Link, {
						href: index(),
						className: "inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase hover:underline",
						children: [
							"All stories",
							" ",
							/* @__PURE__ */ jsx(ArrowUpRight, {
								size: 18,
								"aria-hidden": "true"
							})
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3",
					children: relatedStories.map((related) => /* @__PURE__ */ jsx(StoryCard, { story: related }, related.id))
				})]
			})
		]
	})] });
}
//#endregion
export { StoryDetail as default };

//# sourceMappingURL=show-DpqazWyq.js.map