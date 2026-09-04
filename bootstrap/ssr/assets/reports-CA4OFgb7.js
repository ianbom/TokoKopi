import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { u as formatPrice } from "./shared-C45zkJUt.js";
import { n as index, t as exportMethod } from "./reports-vaaoXKG8.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, Download, Search } from "lucide-react";
//#region resources/js/pages/admin/reports/index.tsx
function metricValue(metric) {
	return metric.format === "currency" ? formatPrice(metric.value) : new Intl.NumberFormat("id-ID").format(metric.value);
}
function titleCase(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
function ReportIndex({ type, tabs, filters, options, report }) {
	const { data, setData, get, processing } = useForm(filters);
	const submit = (event) => {
		event.preventDefault();
		get(index.url(type), {
			preserveState: true,
			replace: true
		});
	};
	const query = new URLSearchParams(Object.entries(data).filter(([, value]) => value !== "")).toString();
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: `${type} Report` }), /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-[100dvh] flex-1 flex-col gap-6 bg-canvas p-4 text-ink md:p-6",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("p", {
						className: "mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase",
						children: [/* @__PURE__ */ jsx(BarChart3, {
							className: "size-4",
							strokeWidth: 1.7
						}), "Reports"]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "font-serif text-3xl leading-tight text-ink sm:text-4xl",
						children: [titleCase(type), " Report"]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 max-w-2xl text-sm leading-6 text-muted-foreground",
						children: "Ringkasan data toko untuk order, produk, customer, shipment, dan voucher."
					})
				] }), /* @__PURE__ */ jsx(Button, {
					asChild: true,
					className: "h-10 w-full rounded-[6px] bg-primary px-5 text-[12px] font-semibold tracking-[0.08em] text-white uppercase shadow-none hover:bg-[#E67312] active:scale-[0.98] sm:w-auto",
					children: /* @__PURE__ */ jsxs("a", {
						href: exportMethod.url(type, { query: Object.fromEntries(new URLSearchParams(query)) }),
						children: [/* @__PURE__ */ jsx(Download, { className: "size-4" }), " Export CSV"]
					})
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "grid grid-cols-5 rounded-[6px] border border-hairline-strong bg-white p-1 sm:flex",
				children: tabs.map((tab) => /* @__PURE__ */ jsx(Link, {
					href: index(tab),
					className: `h-8 rounded-[4px] px-2 text-center text-xs font-semibold transition-colors sm:px-3 ${tab === type ? "bg-[#1A1A1A] text-white" : "text-muted-foreground hover:bg-surface-soft hover:text-ink"}`,
					children: titleCase(tab)
				}, tab))
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-end",
				children: [
					/* @__PURE__ */ jsx(Input, {
						type: "date",
						value: data.date_from,
						onChange: (event) => setData("date_from", event.target.value),
						className: "h-9 w-full cursor-pointer rounded-[6px] border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
					}),
					/* @__PURE__ */ jsx(Input, {
						type: "date",
						value: data.date_to,
						onChange: (event) => setData("date_to", event.target.value),
						className: "h-9 w-full cursor-pointer rounded-[6px] border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: data.payment_status,
						onChange: (event) => setData("payment_status", event.target.value),
						className: "h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All payment"
						}), options.paymentStatuses.map((status) => /* @__PURE__ */ jsx("option", {
							value: status,
							children: status
						}, status))]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: data.order_status,
						onChange: (event) => setData("order_status", event.target.value),
						className: "h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All order"
						}), options.orderStatuses.map((status) => /* @__PURE__ */ jsx("option", {
							value: status,
							children: status
						}, status))]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: data.category_id,
						onChange: (event) => setData("category_id", event.target.value),
						className: "h-9 w-full cursor-pointer rounded-[6px] border border-hairline-strong bg-white px-3 text-sm text-body shadow-none outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 lg:min-w-[150px]",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "All categories"
						}), options.categories.map((category) => /* @__PURE__ */ jsx("option", {
							value: category.id,
							children: category.name
						}, category.id))]
					}),
					/* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: processing,
						variant: "outline",
						className: "h-9 w-full rounded-[6px] border-hairline-strong bg-white px-4 text-body shadow-none hover:bg-surface-soft hover:text-ink active:scale-[0.98] lg:w-auto",
						children: [/* @__PURE__ */ jsx(Search, { className: "size-4" }), " Apply"]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "grid overflow-hidden rounded-[8px] border border-hairline-strong bg-white sm:grid-cols-2 xl:grid-cols-5",
				children: report.metrics.map((metric) => /* @__PURE__ */ jsxs("div", {
					className: "border-r border-b border-hairline-strong px-4 py-4 last:border-r-0 sm:px-5 sm:py-5",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-semibold text-muted-foreground",
						children: metric.label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-2xl font-bold tracking-tight text-ink",
						children: metricValue(metric)
					})]
				}, metric.label))
			}),
			report.tables.map((table) => /* @__PURE__ */ jsxs("section", {
				className: "rounded-[8px] border border-hairline-strong p-4 sm:p-5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-5 flex items-end justify-between gap-4",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold tracking-tight text-ink",
						children: table.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [table.rows.length, " rows"]
					})] })
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-5 overflow-x-auto rounded-[8px] border-y border-hairline-strong",
					children: /* @__PURE__ */ jsxs("table", {
						className: "admin-table w-full min-w-[760px] text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "border-b border-hairline-strong bg-surface-soft text-xs tracking-wider text-muted-foreground uppercase",
							children: /* @__PURE__ */ jsxs("tr", {
								className: "text-left",
								children: [/* @__PURE__ */ jsx("th", {
									className: "w-14 py-4 pr-4 pl-4 font-semibold",
									children: "No"
								}), table.columns.map((column) => /* @__PURE__ */ jsx("th", {
									className: "py-4 pr-4 font-semibold",
									children: column.replaceAll("_", " ")
								}, column))]
							})
						}), /* @__PURE__ */ jsxs("tbody", { children: [table.rows.map((row, index) => /* @__PURE__ */ jsxs("tr", {
							className: "transition-colors hover:bg-primary-soft",
							children: [/* @__PURE__ */ jsx("td", {
								className: "py-4 pr-4 pl-4 text-xs font-medium text-muted-foreground",
								children: index + 1
							}), table.columns.map((column) => /* @__PURE__ */ jsx("td", {
								className: "py-4 pr-4 text-body",
								children: formatCell(column, row[column])
							}, column))]
						}, index)), table.rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: table.columns.length + 1,
							className: "px-4 py-8 text-center text-sm text-muted-foreground",
							children: "No report data found."
						}) })] })]
					})
				})]
			}, table.title))
		]
	})] });
}
function formatCell(column, value) {
	if (value === null || value === void 0 || value === "") return "-";
	if ([
		"grand_total",
		"revenue",
		"total_spending",
		"total_discount"
	].includes(column)) return formatPrice(Number(value));
	return String(value);
}
//#endregion
export { ReportIndex as default };

//# sourceMappingURL=reports-CA4OFgb7.js.map