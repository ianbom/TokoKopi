import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { i as index, n as destroy, r as edit, t as create } from "./stories-Ct4Uwes2.js";
import { a as Pagination } from "./shared-CDHedqtG.js";
import { n as show } from "./story-DPEc1iBk.js";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Plus, Search } from "lucide-react";
//#region resources/js/pages/admin/stories/index.tsx
function StoriesIndex({ stories, categories, filters, stats }) {
	const [search, setSearch] = useState(filters.search ?? "");
	const apply = (next) => router.get(index.url({ query: {
		...filters,
		per_page: stories.per_page ?? 10,
		...next
	} }), {}, {
		preserveState: true,
		replace: true
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Stories" }), /* @__PURE__ */ jsxs("main", {
		className: "space-y-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col justify-between gap-4 md:flex-row md:items-end",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold tracking-widest text-primary uppercase",
						children: "Pemasaran & Konten"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Stories"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Kelola cerita kopi, panduan seduh, dan kabar Deklase."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						href: create(),
						children: [/* @__PURE__ */ jsx(Plus, {}), " Story Baru"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
				children: Object.entries(stats).map(([label, value]) => /* @__PURE__ */ jsxs("div", {
					className: "border bg-canvas p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground capitalize",
						children: label
					}), /* @__PURE__ */ jsx("p", {
						className: "text-2xl font-semibold",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "flex flex-wrap gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					apply({
						search,
						page: "1"
					});
				},
				children: [
					/* @__PURE__ */ jsx(Input, {
						"aria-label": "Cari story",
						value: search,
						onChange: (event) => setSearch(event.target.value),
						placeholder: "Cari judul story",
						className: "max-w-sm"
					}),
					/* @__PURE__ */ jsxs("select", {
						"aria-label": "Kategori",
						value: filters.category ?? "",
						onChange: (event) => apply({
							category: event.target.value,
							page: "1"
						}),
						className: "h-9 max-w-full border bg-canvas px-3",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Semua kategori"
						}), categories.map((category) => /* @__PURE__ */ jsx("option", { children: category }, category))]
					}),
					/* @__PURE__ */ jsxs("select", {
						"aria-label": "Status",
						value: filters.status ?? "",
						onChange: (event) => apply({
							status: event.target.value,
							page: "1"
						}),
						className: "h-9 border bg-canvas px-3",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "",
								children: "Semua status"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "published",
								children: "Published"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "draft",
								children: "Draft"
							})
						]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						variant: "outline",
						children: [/* @__PURE__ */ jsx(Search, {}), " Cari"]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto border bg-canvas",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b bg-surface-soft text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Story"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Kategori"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Penulis"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Publikasi"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3 text-right",
								children: "Aksi"
							})
						] })
					}), /* @__PURE__ */ jsxs("tbody", { children: [stories.data.map((story) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex min-w-56 items-center gap-3",
									children: [/* @__PURE__ */ jsx("img", {
										src: story.cover_image_url,
										alt: "",
										className: "size-10 shrink-0 object-cover"
									}), /* @__PURE__ */ jsx(Link, {
										href: edit(story.id),
										className: "font-semibold hover:text-primary",
										children: story.title
									})]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: story.category
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: story.author_name
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 capitalize",
								children: story.status
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 whitespace-nowrap",
								children: story.published_at?.slice(0, 10) ?? "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-2",
									children: [
										story.status === "published" && /* @__PURE__ */ jsx(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ jsx(Link, {
												href: show(story.slug),
												children: "Lihat"
											})
										}),
										/* @__PURE__ */ jsx(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											children: /* @__PURE__ */ jsx(Link, {
												href: edit(story.id),
												children: "Edit"
											})
										}),
										/* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => {
												if (window.confirm("Hapus story ini beserta gambar sampulnya?")) router.delete(destroy.url(story.id));
											},
											children: "Hapus"
										})
									]
								})
							})
						]
					}, story.id)), stories.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "p-10 text-center text-muted-foreground",
						children: "Story tidak ditemukan."
					}) })] })]
				})
			}),
			/* @__PURE__ */ jsx(Pagination, { paginator: stories })
		]
	})] });
}
//#endregion
export { StoriesIndex as default };

//# sourceMappingURL=stories-XHFuhX_v.js.map