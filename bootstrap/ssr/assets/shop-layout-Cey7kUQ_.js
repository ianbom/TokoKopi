import { n as queryParams } from "./wayfinder-Bgbpuenu.js";
import { a as home, c as login, o as list, s as location, t as cart } from "./routes-CjewBCXs.js";
import { t as Toaster } from "./sonner-ByfnscM6.js";
import { t as index } from "./story-D3qgNey9.js";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Menu, ShoppingCart, X } from "lucide-react";
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
function Footer({ socialLinks }) {
	const pageProps = usePage().props;
	const links = socialLinks ?? pageProps.shop?.social_links;
	const instagramUrl = links?.instagram_url || "https://instagram.com/Deklaseid";
	const tiktokUrl = links?.tiktok_url || "https://www.tiktok.com/@deklaseroastery";
	return /* @__PURE__ */ jsxs("footer", {
		className: "bg-teal text-white",
		children: [/* @__PURE__ */ jsxs("section", {
			className: "grid gap-8 border-b border-white/20 px-5 py-8 sm:grid-cols-2 sm:gap-10 sm:p-7 lg:grid-cols-[2fr_repeat(3,1fr)] lg:gap-8 lg:p-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					id: "newsletter",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "font-condensed text-3xl leading-[0.82] uppercase sm:text-4xl",
						children: [
							"Good coffee.",
							/* @__PURE__ */ jsx("br", {}),
							"Occasional emails."
						]
					}), /* @__PURE__ */ jsxs("form", {
						className: "mt-8 flex w-full max-w-xs border-b border-oat/70",
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
					title: "Deklase",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: index(),
							children: "Stories"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#newsletter",
							children: "Newsletter"
						}),
						/* @__PURE__ */ jsx("a", {
							href: home.url(),
							children: "Tentang kopi kami"
						}),
						/* @__PURE__ */ jsx("a", {
							href: list.url(),
							children: "Semua kopi"
						})
					]
				}),
				/* @__PURE__ */ jsxs(FooterColumn, {
					title: "Follow",
					children: [/* @__PURE__ */ jsx("a", {
						href: instagramUrl,
						target: "_blank",
						rel: "noreferrer",
						children: "Instagram"
					}), /* @__PURE__ */ jsx("a", {
						href: tiktokUrl,
						target: "_blank",
						rel: "noreferrer",
						children: "TikTok"
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-3 px-5 py-4 text-[10px] tracking-[0.04em] text-oat uppercase sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-7 lg:px-10",
			children: [/* @__PURE__ */ jsx("span", { children: "© 2026 Deklase Coffee" }), /* @__PURE__ */ jsxs("span", {
				className: "flex flex-wrap gap-x-6 gap-y-2",
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
			className: "mx-auto grid min-h-14 w-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 text-[10px] font-semibold tracking-[0.04em] uppercase sm:min-h-16 sm:px-6 md:px-8 lg:min-h-[68px] lg:px-10 lg:text-[11px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "hidden items-center gap-5 md:flex lg:gap-9",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: list.url(),
							className: "transition-colors hover:text-primary",
							children: "Shop"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: home.url(),
							className: "transition-colors hover:text-primary",
							children: "Home"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: location.url(),
							className: "transition-colors hover:text-primary",
							children: "Locations"
						}),
						/* @__PURE__ */ jsx(Link, {
							href: index(),
							className: "transition-colors hover:text-primary",
							children: "Stories"
						})
					]
				}),
				/* @__PURE__ */ jsx(Link, {
					href: home.url(),
					"aria-label": "Deklase home",
					className: "col-start-2 inline-flex items-center justify-center transition-opacity hover:opacity-70",
					children: /* @__PURE__ */ jsx("img", {
						src: "/logo/dc-header.webp",
						alt: "Deklase",
						className: "h-auto w-24 sm:w-28 lg:w-40"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "col-start-3 flex min-w-0 items-center justify-end gap-1 sm:gap-2 md:gap-4 lg:gap-8",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: accountHref,
							className: "hidden transition-colors hover:text-primary md:inline",
							children: "Account"
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: cart.url(),
							"aria-label": `Cart (${bagCount} items)`,
							className: "relative inline-flex size-10 shrink-0 items-center justify-center transition-colors hover:text-primary",
							children: [/* @__PURE__ */ jsx(ShoppingCart, {
								className: "size-[18px]",
								strokeWidth: 1.5
							}), /* @__PURE__ */ jsx("span", {
								className: "absolute -top-0.5 -right-1 grid min-w-4 place-items-center bg-primary px-1 py-px text-[8px] leading-3 text-teal tabular-nums",
								children: bagCount
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": "Open menu",
							onClick: () => setIsOpen(true),
							className: "inline-flex size-10 shrink-0 items-center justify-center md:hidden",
							children: /* @__PURE__ */ jsx(Menu, {
								className: "size-5",
								strokeWidth: 1.5
							})
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: ["fixed inset-0 z-[60] flex min-h-[100dvh] flex-col gap-0 overflow-y-auto overscroll-contain bg-canvas px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] text-ink transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "translate-x-full"].join(" "),
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
					href: home.url(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Home"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: location.url(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Locations"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: index(),
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Stories"
				}),
				/* @__PURE__ */ jsx(Link, {
					href: accountHref,
					onClick: closeMenu,
					className: "border-b border-hairline py-5 text-lg uppercase",
					children: "Account"
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
		className: "flex min-h-[100dvh] min-w-0 flex-col overflow-x-clip bg-white font-sans text-teal",
		children: [
			/* @__PURE__ */ jsx(Navbar, {
				cartCount: props.shop?.cart_count ?? 0,
				isAuthenticated: Boolean(props.auth.user)
			}),
			/* @__PURE__ */ jsx("main", {
				className: "min-w-0 grow bg-white",
				children
			}),
			/* @__PURE__ */ jsx(Toaster, {}),
			/* @__PURE__ */ jsx(Footer, { socialLinks: props.shop?.social_links }),
			props.shop?.social_links?.whatsapp_url && /* @__PURE__ */ jsx("a", {
				href: props.shop.social_links.whatsapp_url,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": "Chat WhatsApp Deklase (buka tab baru)",
				title: "Chat WhatsApp Deklase",
				className: "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]",
				children: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					className: "size-7",
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", { d: "M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.44 0 .07 5.37.07 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.96 11.96 0 0 0 5.86 1.49h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.21-3.52-8.47ZM12.05 21.85a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.68.96.98-3.59-.23-.37a9.92 9.92 0 0 1-1.52-5.28c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.9 9.9 0 0 1 2.92 7.05c0 5.49-4.47 9.96-9.97 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" })
				})
			})
		]
	});
}
//#endregion
export { ShopLayout as t };

//# sourceMappingURL=shop-layout-Cey7kUQ_.js.map