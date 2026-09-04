import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
import { c as login, n as cart, o as home, s as list, t as about } from "./routes-BtCAeSqc.js";
import { t as Toaster } from "./sonner-D1SF8OoB.js";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Menu, X } from "lucide-react";
//#region resources/js/routes/policy/index.ts
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
var privacy = (options) => ({
	url: privacy.url(options),
	method: "get"
});
privacy.definition = {
	methods: ["get", "head"],
	url: "/privacy-policy"
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
privacy.url = (options) => {
	return privacy.definition.url + queryParams(options);
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
privacy.get = (options) => ({
	url: privacy.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
privacy.head = (options) => ({
	url: privacy.url(options),
	method: "head"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
var privacyForm = (options) => ({
	action: privacy.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
privacyForm.get = (options) => ({
	action: privacy.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/privacy-policy'
*/
privacyForm.head = (options) => ({
	action: privacy.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
privacy.form = privacyForm;
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
var noReturn = (options) => ({
	url: noReturn.url(options),
	method: "get"
});
noReturn.definition = {
	methods: ["get", "head"],
	url: "/no-return-policy"
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
noReturn.url = (options) => {
	return noReturn.definition.url + queryParams(options);
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
noReturn.get = (options) => ({
	url: noReturn.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
noReturn.head = (options) => ({
	url: noReturn.url(options),
	method: "head"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
var noReturnForm = (options) => ({
	action: noReturn.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
noReturnForm.get = (options) => ({
	action: noReturn.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/no-return-policy'
*/
noReturnForm.head = (options) => ({
	action: noReturn.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
noReturn.form = noReturnForm;
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
var shipping = (options) => ({
	url: shipping.url(options),
	method: "get"
});
shipping.definition = {
	methods: ["get", "head"],
	url: "/shipping-policy"
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
shipping.url = (options) => {
	return shipping.definition.url + queryParams(options);
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
shipping.get = (options) => ({
	url: shipping.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
shipping.head = (options) => ({
	url: shipping.url(options),
	method: "head"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
var shippingForm = (options) => ({
	action: shipping.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
shippingForm.get = (options) => ({
	action: shipping.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/shipping-policy'
*/
shippingForm.head = (options) => ({
	action: shipping.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
shipping.form = shippingForm;
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
var terms = (options) => ({
	url: terms.url(options),
	method: "get"
});
terms.definition = {
	methods: ["get", "head"],
	url: "/terms-conditions"
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
terms.url = (options) => {
	return terms.definition.url + queryParams(options);
};
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
terms.get = (options) => ({
	url: terms.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
terms.head = (options) => ({
	url: terms.url(options),
	method: "head"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
var termsForm = (options) => ({
	action: terms.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
termsForm.get = (options) => ({
	action: terms.url(options),
	method: "get"
});
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/terms-conditions'
*/
termsForm.head = (options) => ({
	action: terms.url({ [options?.mergeQuery ? "mergeQuery" : "query"]: {
		_method: "HEAD",
		...options?.query ?? options?.mergeQuery ?? {}
	} }),
	method: "get"
});
terms.form = termsForm;
Object.assign(privacy, privacy), Object.assign(noReturn, noReturn), Object.assign(shipping, shipping), Object.assign(terms, terms);
//#endregion
//#region resources/js/components/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "bg-teal text-white",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "grid gap-10 border-b border-white/20 p-7 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)] lg:gap-8 lg:p-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					id: "newsletter",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "font-condensed text-4xl leading-[0.82] uppercase",
						children: [
							"Good coffee.",
							/* @__PURE__ */ jsx("br", {}),
							"Occasional emails."
						]
					}), /* @__PURE__ */ jsxs("form", {
						className: "mt-8 flex max-w-xs border-b border-oat/70",
						onSubmit: (event) => event.preventDefault(),
						children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "footer-email",
								className: "sr-only",
								children: "Email address"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "footer-email",
								type: "email",
								placeholder: "Your email",
								className: "min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/60"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-1 text-xs uppercase transition-colors hover:text-primary",
								children: "Join →"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs(FooterColumn, {
					title: "Shop",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: list.url(),
							children: "Coffee"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#subscription",
							children: "Subscriptions"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#rituals",
							children: "Bundles"
						}),
						/* @__PURE__ */ jsx("a", {
							href: home.url(),
							children: "Merchandise"
						})
					]
				}),
				/* @__PURE__ */ jsxs(FooterColumn, {
					title: "About",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: about.url(),
							children: "Our story"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#story",
							children: "Roasting"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Journal"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Wholesale"
						})
					]
				}),
				/* @__PURE__ */ jsxs(FooterColumn, {
					title: "Follow",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Instagram"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "TikTok"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Pinterest"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-3 px-7 py-4 text-[10px] tracking-[0.04em] text-oat uppercase sm:flex-row sm:items-center sm:justify-between lg:px-10",
			children: [/* @__PURE__ */ jsx("span", { children: "© 2026 Deklase Coffee" }), /* @__PURE__ */ jsxs("span", {
				className: "flex gap-6",
				children: [
					/* @__PURE__ */ jsx(Link, {
						href: privacy.url(),
						className: "transition-colors hover:text-primary",
						children: "Privacy"
					}),
					/* @__PURE__ */ jsx(Link, {
						href: shipping.url(),
						className: "transition-colors hover:text-primary",
						children: "Shipping"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#",
						className: "transition-colors hover:text-primary",
						children: "Terms"
					})
				]
			})]
		})]
	});
}
function FooterColumn({ title, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "text-xs tracking-[0.08em] text-canvas uppercase",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-col gap-1 text-sm text-oat [&_a]:transition-colors [&_a:hover]:text-primary",
			children
		})]
	});
}
//#endregion
//#region resources/js/components/Navbar.tsx
function Navbar({ cartCount = 0, isAuthenticated = false }) {
	const [isOpen, setIsOpen] = useState(false);
	const accountHref = isAuthenticated ? "/my-profile" : login.url();
	const bagCount = cartCount > 99 ? "99+" : String(cartCount).padStart(2, "0");
	const closeMenu = () => setIsOpen(false);
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-50 border-b border-hairline bg-white text-teal",
		children: [/* @__PURE__ */ jsxs("nav", {
			className: "mx-auto grid min-h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 text-[10px] font-semibold tracking-[0.04em] uppercase sm:px-8 lg:min-h-[68px] lg:px-10 lg:text-[11px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "hidden items-center gap-5 md:flex lg:gap-9",
					children: [/* @__PURE__ */ jsx(Link, {
						href: list.url(),
						className: "transition-colors hover:text-primary",
						children: "Shop"
					}), /* @__PURE__ */ jsx(Link, {
						href: home.url(),
						className: "transition-colors hover:text-primary",
						children: "Home"
					})]
				}),
				/* @__PURE__ */ jsx(Link, {
					href: home.url(),
					"aria-label": "Deklase home",
					className: "inline-flex items-center justify-center transition-opacity hover:opacity-70",
					children: /* @__PURE__ */ jsx("img", {
						src: "/logo/dc-header.webp",
						alt: "Deklase",
						className: "h-auto w-28 sm:w-36 lg:w-40"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-4 lg:gap-8",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: list.url(),
							"aria-label": "Search products",
							className: "hidden transition-colors hover:text-primary md:inline",
							children: "Search"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: accountHref,
							className: "hidden transition-colors hover:text-primary sm:inline",
							children: "Account"
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: cart.url(),
							className: "inline-flex items-center gap-1.5 transition-colors hover:text-primary",
							children: [
								"Bag (",
								bagCount,
								")"
							]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Open menu",
							onClick: () => setIsOpen(true),
							className: "inline-flex size-10 items-center justify-center md:hidden",
							children: /* @__PURE__ */ jsx(Menu, {
								className: "size-5",
								strokeWidth: 1.5
							})
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: ["fixed inset-0 z-[60] flex flex-col gap-0 bg-canvas p-5 text-ink transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "translate-x-full"].join(" "),
			"aria-hidden": !isOpen,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("img", {
						src: "/logo/dc-header.webp",
						alt: "Deklase",
						className: "h-auto w-36"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "Close menu",
						onClick: closeMenu,
						className: "inline-flex size-10 items-center justify-center",
						children: /* @__PURE__ */ jsx(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ jsx(Link, {
					href: list.url(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Shop"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: home.url() + "#subscription",
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Subscriptions"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: about.url(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Story"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: accountHref,
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Account"
				}),
				/* @__PURE__ */ jsxs(Link, {
					href: cart.url(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: [
						"Bag (",
						bagCount,
						")"
					]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/layouts/shop-layout.tsx
function ShopLayout({ children }) {
	const { props } = usePage();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-teal",
		children: [
			/* @__PURE__ */ jsx(Navbar, {
				cartCount: props.shop?.cart_count ?? 0,
				isAuthenticated: Boolean(props.auth.user)
			}),
			/* @__PURE__ */ jsx("main", {
				className: "w-full grow bg-white",
				children
			}),
			/* @__PURE__ */ jsx(Toaster, {}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ShopLayout as t };

//# sourceMappingURL=shop-layout-Bwdvbiv3.js.map