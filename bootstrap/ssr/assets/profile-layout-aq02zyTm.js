import { d as myOrder, f as myProfile, l as logout, m as notifications, p as myWishlist, u as manageAddress } from "./routes-CjewBCXs.js";
import { t as ShopLayout } from "./shop-layout-TDbKdiGe.js";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
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
	const accountNavRef = useRef(null);
	const activeNavItemRef = useRef(null);
	useEffect(() => {
		const nav = accountNavRef.current;
		const activeItem = activeNavItemRef.current;
		if (!nav || !activeItem) return;
		const revealActiveItem = () => {
			nav.scrollLeft = activeItem.offsetLeft - (nav.clientWidth - activeItem.clientWidth) / 2;
		};
		const observer = new ResizeObserver(revealActiveItem);
		revealActiveItem();
		observer.observe(nav);
		return () => observer.disconnect();
	}, [activePath]);
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: `${pageTitle} Deklasee` }),
		/* @__PURE__ */ jsx("section", {
			className: "border-t border-b border-hairline bg-sand",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid lg:min-h-[220px] lg:grid-cols-[1.25fr_.75fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col justify-between border-b border-hairline px-4 py-6 sm:px-12 sm:py-8 lg:border-r lg:border-b-0 lg:px-16 lg:py-10",
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
						className: "mt-8 max-w-4xl font-condensed text-[clamp(36px,9vw,50px)] leading-[0.9] font-semibold tracking-[-0.05em] break-words uppercase sm:mt-10 sm:text-[clamp(50px,6.5vw,92px)] sm:leading-[0.8]",
						children: title
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col justify-end bg-canvas px-4 py-5 sm:px-12 sm:py-8 lg:px-10 lg:py-10",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[9px] font-semibold tracking-[0.1em] text-primary uppercase",
						children: "Member space"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-sm text-[13px] leading-[1.5] text-ink/75 sm:mt-4 sm:text-[12px]",
						children: subtitle
					})]
				})]
			})
		}),
		/* @__PURE__ */ jsx("main", {
			className: "border-b border-hairline bg-canvas",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid min-w-0 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "min-w-0 border-b border-hairline bg-surface-soft lg:border-r lg:border-b-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "border-b border-hairline px-4 py-3 sm:px-10 sm:py-4 lg:px-8",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-[9px] font-semibold tracking-[0.1em] uppercase",
							children: "Akun Saya"
						})
					}), /* @__PURE__ */ jsxs("nav", {
						ref: accountNavRef,
						"aria-label": "Navigasi akun",
						className: "hide-scrollbar relative flex min-w-0 overflow-x-auto overscroll-x-contain lg:block",
						children: [ACCOUNT_NAV.map((item, index) => {
							const Icon = item.icon;
							const isActive = item.id === activePath;
							return /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								ref: isActive ? activeNavItemRef : void 0,
								"aria-current": isActive ? "page" : void 0,
								className: `group flex min-h-11 min-w-fit shrink-0 items-center gap-2 border-r border-hairline px-3 py-3 text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-3 sm:px-5 sm:py-4 lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8 ${isActive ? "bg-ink text-canvas" : "text-ink hover:bg-oat/55 hover:text-primary"}`,
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "hidden text-[8px] tabular-nums opacity-55 sm:inline",
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
							className: "flex min-h-11 min-w-fit shrink-0 items-center gap-2 border-r border-hairline px-3 py-3 text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-3 sm:px-5 sm:py-4 lg:w-full lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "hidden text-[8px] tabular-nums opacity-55 sm:inline",
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
					className: "min-w-0 px-4 py-6 [overflow-wrap:anywhere] sm:px-10 sm:py-10 lg:px-12 xl:px-16",
					children
				})]
			})
		})
	] });
}
//#endregion
export { ProfileLayout as t };

//# sourceMappingURL=profile-layout-aq02zyTm.js.map