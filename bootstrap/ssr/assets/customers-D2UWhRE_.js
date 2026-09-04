import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, s as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-DttT2oSg.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CtTsjyTX.js";
import { a as Pagination, u as formatPrice } from "./shared-C45zkJUt.js";
import "./shared-CW0TJaCh.js";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarDays, CreditCard, Eye, MapPin, MoreVertical, Power, RotateCcw, Search, UserCheck, UserX, Users } from "lucide-react";
//#region resources/js/pages/admin/customers/index.tsx
var openDatePicker = (event) => {
	event.currentTarget.showPicker?.();
};
function CustomersIndex({ customers, filters }) {
	const { data, setData, get, processing } = useForm({
		search: filters.search ?? "",
		is_active: filters.is_active ?? "",
		date_from: filters.date_from ?? "",
		date_to: filters.date_to ?? "",
		spent_min: filters.spent_min ?? "",
		spent_max: filters.spent_max ?? ""
	});
	const submit = (event) => {
		event.preventDefault();
		get("/admin/customers", {
			preserveState: true,
			replace: true
		});
	};
	const resetFilters = () => {
		router.get("/admin/customers", {}, { preserveState: false });
	};
	const activeCount = customers.data.filter((customer) => customer.is_active).length;
	const inactiveCount = customers.data.length - activeCount;
	const orderCount = customers.data.reduce((total, customer) => total + customer.orders_count, 0);
	const addressCount = customers.data.reduce((total, customer) => total + customer.addresses_count, 0);
	const stats = [
		{
			title: "Total Customers",
			val: customers.total,
			sub: "registered accounts",
			icon: Users,
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
			title: "Active",
			val: activeCount,
			sub: "shown page",
			icon: UserCheck,
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
			title: "Inactive",
			val: inactiveCount,
			sub: "shown page",
			icon: UserX,
			iconBg: "bg-rose-100",
			iconColor: "text-rose-500",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-rose-500",
			titleColor: "text-zinc-700",
			accent: "from-rose-400 to-red-500",
			featured: false
		},
		{
			title: "Orders",
			val: orderCount,
			sub: "shown page",
			icon: CreditCard,
			iconBg: "bg-blue-100",
			iconColor: "text-blue-500",
			cardBg: "bg-white",
			subColor: "text-zinc-400",
			valColor: "text-blue-500",
			titleColor: "text-zinc-700",
			accent: "",
			featured: false
		},
		{
			title: "Addresses",
			val: addressCount,
			sub: "shown page",
			icon: MapPin,
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
			title: "Filter",
			val: data.is_active || "All",
			sub: "current status",
			icon: CalendarDays,
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Customers" }), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-6 p-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col items-start justify-between gap-4 md:flex-row md:items-end",
				children: /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "mb-1 text-[11px] font-bold tracking-widest text-[#151515]/50 uppercase",
						children: "Customer Management"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl leading-tight text-zinc-900",
						children: "Customers"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-zinc-400",
						children: "Lihat profil customer, total spending, status aktif, alamat, wishlist, dan histori order."
					})
				] })
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
								label: "Status",
								value: data.is_active || "all",
								onChange: (value) => setData("is_active", value === "all" ? "" : value),
								children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "inactive",
										children: "Inactive"
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "relative min-w-[220px] flex-1",
								children: /* @__PURE__ */ jsx(Input, {
									value: data.search,
									onChange: (event) => setData("search", event.target.value),
									placeholder: "Search name, email, phone...",
									className: "max-w-sm"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "px-0.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase",
									children: "Dates"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "flex flex-col gap-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-medium text-zinc-400",
											children: "From"
										}), /* @__PURE__ */ jsx(Input, {
											type: "date",
											value: data.date_from,
											onClick: openDatePicker,
											onChange: (event) => setData("date_from", event.target.value),
											className: "h-10 min-w-[160px] border bg-canvas px-3"
										})]
									}), /* @__PURE__ */ jsxs("label", {
										className: "flex flex-col gap-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-medium text-zinc-400",
											children: "To"
										}), /* @__PURE__ */ jsx(Input, {
											type: "date",
											value: data.date_to,
											onClick: openDatePicker,
											onChange: (event) => setData("date_to", event.target.value),
											className: "h-10 min-w-[160px] border bg-canvas px-3"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "px-0.5 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase",
									children: "Spending"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx(Input, {
										value: data.spent_min,
										onChange: (event) => setData("spent_min", event.target.value),
										placeholder: "Min",
										className: "h-10 w-[110px] border bg-canvas px-3 text-sm"
									}), /* @__PURE__ */ jsx(Input, {
										value: data.spent_max,
										onChange: (event) => setData("spent_max", event.target.value),
										placeholder: "Max",
										className: "h-10 w-[110px] border bg-canvas px-3 text-sm"
									})]
								})]
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
							className: "admin-table w-full min-w-[900px] text-sm",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "border-b bg-surface-soft text-left",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "w-14 px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "No"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Customer"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Phone"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Orders"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Spent"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase",
										children: "Registered"
									}),
									/* @__PURE__ */ jsx("th", { className: "w-10 px-4 py-3" })
								] })
							}), /* @__PURE__ */ jsxs("tbody", { children: [customers.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 8,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center gap-3 py-20",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100",
											children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-zinc-400" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-zinc-400",
											children: "No customers found. Try adjusting your filters."
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
							}) }), customers.data.map((customer, index) => /* @__PURE__ */ jsxs("tr", {
								className: "transition-colors hover:bg-zinc-50/70",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 text-xs font-medium text-zinc-400",
										children: (customers.from ?? 1) + index
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col gap-1",
											children: [/* @__PURE__ */ jsx(Link, {
												href: `/admin/customers/${customer.id}`,
												className: "font-medium text-zinc-900 transition-colors hover:text-[#151515]",
												children: customer.name
											}), /* @__PURE__ */ jsx("span", {
												className: "text-xs text-zinc-500",
												children: customer.email
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 text-zinc-600",
										children: customer.phone ?? "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col gap-1",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-semibold text-zinc-900",
												children: customer.orders_count
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-xs text-zinc-500",
												children: [
													customer.addresses_count,
													" ",
													"addresses"
												]
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 font-semibold text-zinc-900",
										children: formatPrice(customer.total_spent)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ jsx(StatusPill, { active: customer.is_active })
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 text-xs whitespace-nowrap text-zinc-500",
										children: customer.registered_at ?? "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3.5 text-right",
										children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ jsx(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600",
												children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
											align: "end",
											className: "w-44",
											children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ jsxs(Link, {
													href: `/admin/customers/${customer.id}`,
													className: "flex w-full items-center gap-2",
													children: [
														/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }),
														" ",
														"View Details"
													]
												})
											}), /* @__PURE__ */ jsx(DropdownMenuItem, {
												asChild: true,
												children: /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => router.post(`/admin/customers/${customer.id}/toggle-active`, {}, { preserveScroll: true }),
													className: "flex w-full items-center gap-2",
													children: [
														/* @__PURE__ */ jsx(Power, { className: "h-3.5 w-3.5" }),
														" ",
														"Toggle Status"
													]
												})
											})]
										})] })
									})
								]
							}, customer.id))] })]
						})
					}),
					/* @__PURE__ */ jsx(Pagination, { paginator: customers })
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
function StatusPill({ active }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold " + (active ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"),
		children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full " + (active ? "bg-emerald-400" : "bg-rose-400") }), active ? "Active" : "Inactive"]
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
export { CustomersIndex as default };

//# sourceMappingURL=customers-D2UWhRE_.js.map