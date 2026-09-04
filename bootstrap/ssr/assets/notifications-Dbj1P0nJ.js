import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CtTsjyTX.js";
import { a as Pagination } from "./shared-C45zkJUt.js";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Bell, BellRing, CheckCircle2, Clock, Plus, RotateCcw, Search, Send, Tag } from "lucide-react";
//#region resources/js/pages/admin/notifications/index.tsx
var getTypeConfig = (type) => {
	const safeType = type || "notification";
	if (safeType.includes("order")) return {
		dot: "bg-blue-400",
		text: "text-blue-700",
		bg: "bg-blue-50 border-blue-100"
	};
	if (safeType.includes("payment")) return {
		dot: "bg-emerald-400",
		text: "text-emerald-700",
		bg: "bg-emerald-50 border-emerald-100"
	};
	if (safeType.includes("promo") || safeType.includes("voucher")) return {
		dot: "bg-purple-400",
		text: "text-purple-700",
		bg: "bg-purple-50 border-purple-100"
	};
	return {
		dot: "bg-zinc-400",
		text: "text-zinc-600",
		bg: "bg-zinc-50 border-zinc-200"
	};
};
function NotificationsIndex({ notifications, filters, types }) {
	const { data, setData, get, processing } = useForm({
		search: filters.search ?? "",
		type: filters.type ?? "",
		read: filters.read ?? ""
	});
	const submit = (event) => {
		event.preventDefault();
		get("/admin/notifications", {
			preserveState: true,
			replace: true
		});
	};
	const resetFilters = () => {
		router.get("/admin/notifications", {}, { preserveState: false });
	};
	const readCount = notifications.data.filter((notification) => notification.is_read).length;
	const unreadCount = notifications.data.length - readCount;
	const uniqueTypes = new Set(notifications.data.map((notification) => notification.type).filter(Boolean)).size;
	const referencedCount = notifications.data.filter((notification) => notification.reference_type || notification.reference_id).length;
	const stats = [
		{
			title: "Total Notifications",
			val: notifications.total,
			sub: "stored messages",
			icon: Bell,
			iconBg: "bg-white/20",
			iconColor: "text-white",
			cardBg: "bg-gradient-to-br from-[#151515] to-[#9A6B45]",
			subColor: "text-white/60",
			valColor: "text-white",
			titleColor: "text-white/80",
			accent: "",
			featured: true
		},
		{
			title: "Unread",
			val: unreadCount,
			sub: "shown page",
			icon: BellRing,
			iconBg: "bg-blue-100",
			iconColor: "text-blue-500",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-blue-500",
			titleColor: "text-zinc-700",
			accent: "from-blue-400 to-blue-600",
			featured: false
		},
		{
			title: "Read",
			val: readCount,
			sub: "shown page",
			icon: CheckCircle2,
			iconBg: "bg-emerald-100",
			iconColor: "text-emerald-600",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-emerald-600",
			titleColor: "text-zinc-700",
			accent: "from-emerald-400 to-emerald-600",
			featured: false
		},
		{
			title: "Types",
			val: uniqueTypes,
			sub: "shown page",
			icon: Tag,
			iconBg: "bg-purple-100",
			iconColor: "text-purple-500",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-purple-500",
			titleColor: "text-zinc-700",
			accent: "from-purple-400 to-purple-600",
			featured: false
		},
		{
			title: "Referenced",
			val: referencedCount,
			sub: "has source",
			icon: Send,
			iconBg: "bg-amber-100",
			iconColor: "text-amber-600",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-amber-600",
			titleColor: "text-zinc-700",
			accent: "from-amber-400 to-amber-600",
			featured: false
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Notifications" }), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 p-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-start justify-between gap-4 md:flex-row md:items-end",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "mb-1 text-[11px] font-bold tracking-widest text-[#151515]/50 uppercase",
						children: "Customer Management"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl leading-tight text-zinc-900",
						children: "Notifications"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-zinc-400",
						children: "Pantau dan kirim notifikasi manual untuk customer atau segment customer aktif."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					className: "bg-primary text-white hover:bg-primary/90",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/admin/notifications/create",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Send Notification"]
					})
				})]
			}),
			/* @__PURE__ */ jsx(StatsGrid, { stats }),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "flex flex-wrap items-end gap-3",
						children: [
							/* @__PURE__ */ jsxs(FilterSelect, {
								label: "Type",
								value: data.type || "all",
								onChange: (value) => setData("type", value === "all" ? "" : value),
								children: [/* @__PURE__ */ jsx(SelectItem, {
									value: "all",
									children: "All Types"
								}), types.map((type) => /* @__PURE__ */ jsx(SelectItem, {
									value: type,
									className: "capitalize",
									children: type.replace(/_/g, " ")
								}, type))]
							}),
							/* @__PURE__ */ jsxs(FilterSelect, {
								label: "Read",
								value: data.read || "all",
								onChange: (value) => setData("read", value === "all" ? "" : value),
								children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "all",
										children: "Read Status"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "read",
										children: "Read"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "unread",
										children: "Unread"
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "relative min-w-[260px] flex-1",
								children: /* @__PURE__ */ jsx(Input, {
									value: data.search,
									onChange: (event) => setData("search", event.target.value),
									placeholder: "Search title, message, customer...",
									className: "max-w-sm"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "ml-auto flex gap-2",
								children: [/* @__PURE__ */ jsxs(Button, {
									type: "submit",
									variant: "outline",
									disabled: processing,
									children: [/* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" }), " Search"]
								}), /* @__PURE__ */ jsxs(Button, {
									type: "button",
									variant: "outline",
									onClick: resetFilters,
									children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto border",
						children: /* @__PURE__ */ jsxs("table", {
							className: "admin-table w-full min-w-[960px] text-sm",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "border-b bg-surface-soft text-left",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "w-14 px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "No"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Notification"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Customer"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Read"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Reference"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Created"
									})
								] })
							}), /* @__PURE__ */ jsxs("tbody", { children: [notifications.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 7,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center gap-3 py-20",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100",
											children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-zinc-400" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-zinc-400",
											children: "No notifications found. Try adjusting your filters."
										}),
										/* @__PURE__ */ jsxs(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 text-xs",
											onClick: resetFilters,
											children: [
												/* @__PURE__ */ jsx(RotateCcw, { className: "mr-1 h-3 w-3" }),
												" ",
												"Clear Filters"
											]
										})
									]
								})
							}) }), notifications.data.map((notification, index) => {
								const typeConfig = getTypeConfig(notification.type);
								return /* @__PURE__ */ jsxs("tr", {
									className: "transition-colors hover:bg-zinc-50/70",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5 text-xs font-medium text-zinc-400",
											children: (notifications.from ?? 1) + index
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex max-w-lg flex-col gap-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "font-medium text-zinc-900",
													children: notification.title
												}), /* @__PURE__ */ jsx("span", {
													className: "truncate text-xs text-zinc-500",
													children: notification.message
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col gap-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "font-medium text-zinc-700",
													children: notification.customer ?? "-"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs text-zinc-500",
													children: notification.customer_email ?? "-"
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ jsxs("span", {
												className: "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize " + typeConfig.text + " " + typeConfig.bg,
												children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full " + typeConfig.dot }), notification.type.replace(/_/g, " ")]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ jsx(ReadPill, { read: notification.is_read })
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col gap-1 text-xs text-zinc-500",
												children: [/* @__PURE__ */ jsx("span", { children: notification.reference_type ?? "-" }), /* @__PURE__ */ jsx("span", { children: notification.reference_id ? "#" + notification.reference_id : "" })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3.5 text-xs whitespace-nowrap text-zinc-500",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-zinc-300" }), notification.created_at ?? "-"]
											})
										})
									]
								}, notification.id);
							})] })]
						})
					}),
					/* @__PURE__ */ jsx(Pagination, { paginator: notifications })
				]
			})
		]
	})] });
}
function StatsGrid({ stats }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 gap-3 md:grid-cols-6",
		children: stats.map((m) => /* @__PURE__ */ jsxs("div", {
			className: "border bg-canvas p-4",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: m.title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-2xl font-semibold",
				children: m.val
			})]
		}, m.title))
	});
}
function ReadPill({ read }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold " + (read ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-blue-100 bg-blue-50 text-blue-700"),
		children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full " + (read ? "bg-emerald-400" : "bg-blue-400") }), read ? "Read" : "Unread"]
	});
}
function FilterSelect({ label, value, onChange, children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-col gap-1",
		children: /* @__PURE__ */ jsxs(Select, {
			value,
			onValueChange: onChange,
			children: [/* @__PURE__ */ jsx(SelectTrigger, {
				"aria-label": label,
				className: "h-10 w-[180px] rounded-none border bg-canvas px-3 text-sm shadow-none",
				children: /* @__PURE__ */ jsx(SelectValue, {})
			}), /* @__PURE__ */ jsx(SelectContent, { children })]
		})
	});
}
//#endregion
export { NotificationsIndex as default };

//# sourceMappingURL=notifications-Dbj1P0nJ.js.map