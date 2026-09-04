import { d as myOrder, f as myProfile, l as logout, m as notifications, p as myWishlist, u as manageAddress } from "./routes-BtCAeSqc.js";
import { t as ShopLayout } from "./shop-layout-Bwdvbiv3.js";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Bell, Heart, LogOut, MapPin, Package, User } from "lucide-react";
//#region resources/js/layouts/profile-layout.tsx
var ACCOUNT_NAV = [
	{
		id: "my-profile",
		href: myProfile.url(),
		label: "Pengaturan Profil",
		mobileLabel: "Profil",
		icon: User
	},
	{
		id: "list-order",
		href: myOrder.url(),
		label: "Pesanan Saya",
		mobileLabel: "Pesanan",
		icon: Package
	},
	{
		id: "address",
		href: manageAddress.url(),
		label: "Buku Alamat",
		mobileLabel: "Alamat",
		icon: MapPin
	},
	{
		id: "wishlist",
		href: myWishlist.url(),
		label: "Wishlist Saya",
		mobileLabel: "Wishlist",
		icon: Heart
	},
	{
		id: "notifications",
		href: notifications.url(),
		label: "Notifikasi",
		mobileLabel: "Notifikasi",
		icon: Bell
	}
];
function ProfileLayout({ children, title, pageTitle, subtitle, activePath, breadcrumbs }) {
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: `${pageTitle} Deklasee` }),
		/* @__PURE__ */ jsx("section", {
			className: "border-t border-b border-hairline bg-sand",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid min-h-[220px] lg:grid-cols-[1.25fr_.75fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col justify-between border-b border-hairline px-7 py-8 sm:px-12 lg:border-r lg:border-b-0 lg:px-16 lg:py-10",
					children: [/* @__PURE__ */ jsx("nav", {
						className: "flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase",
						children: breadcrumbs.map((breadcrumb, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [breadcrumb.href ? /* @__PURE__ */ jsx(Link, {
							href: breadcrumb.href,
							className: "text-ink/65 hover:text-primary",
							children: breadcrumb.label
						}) : /* @__PURE__ */ jsx("span", { children: breadcrumb.label }), index < breadcrumbs.length - 1 && /* @__PURE__ */ jsx("span", {
							className: "text-ink/35",
							children: "/"
						})] }, `${breadcrumb.label}-${index}`))
					}), /* @__PURE__ */ jsx("h1", {
						className: "mt-10 max-w-4xl font-condensed text-[clamp(50px,6.5vw,92px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase",
						children: title
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col justify-end bg-canvas px-7 py-8 sm:px-12 lg:px-10 lg:py-10",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[9px] font-semibold tracking-[0.1em] text-primary uppercase",
						children: "Member space"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-sm text-[12px] leading-[1.5] text-ink/75",
						children: subtitle
					})]
				})]
			})
		}),
		/* @__PURE__ */ jsx("main", {
			className: "border-b border-hairline bg-canvas",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "border-b border-hairline bg-surface-soft lg:border-r lg:border-b-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "border-b border-hairline px-7 py-4 sm:px-10 lg:px-8",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-[9px] font-semibold tracking-[0.1em] uppercase",
							children: "Akun Saya"
						})
					}), /* @__PURE__ */ jsxs("nav", {
						className: "hide-scrollbar flex overflow-x-auto lg:block",
						children: [ACCOUNT_NAV.map((item, index) => {
							const Icon = item.icon;
							const isActive = item.id === activePath;
							return /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								className: `group flex min-w-fit items-center gap-3 border-r border-hairline px-5 py-4 text-[10px] font-semibold tracking-[0.06em] uppercase lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8 ${isActive ? "bg-ink text-canvas" : "text-ink hover:bg-oat/55 hover:text-primary"}`,
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[8px] tabular-nums opacity-55",
										children: String(index + 1).padStart(2, "0")
									}),
									/* @__PURE__ */ jsx(Icon, {
										size: 15,
										strokeWidth: 1.7
									}),
									/* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: item.label
									}),
									/* @__PURE__ */ jsx("span", {
										className: "sm:hidden",
										children: item.mobileLabel
									})
								]
							}, item.id);
						}), /* @__PURE__ */ jsxs(Link, {
							href: logout.url(),
							method: "post",
							as: "button",
							className: "flex min-w-fit items-center gap-3 border-r border-hairline px-5 py-4 text-[10px] font-semibold tracking-[0.06em] uppercase hover:bg-primary-soft hover:text-primary lg:w-full lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[8px] tabular-nums opacity-55",
									children: "06"
								}),
								/* @__PURE__ */ jsx(LogOut, {
									size: 15,
									strokeWidth: 1.7
								}),
								/* @__PURE__ */ jsx("span", { children: "Keluar" })
							]
						})]
					})]
				}), /* @__PURE__ */ jsx("section", {
					className: "min-w-0 px-7 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16",
					children
				})]
			})
		})
	] });
}
//#endregion
export { ProfileLayout as t };

//# sourceMappingURL=profile-layout-BEi9Hx0H.js.map