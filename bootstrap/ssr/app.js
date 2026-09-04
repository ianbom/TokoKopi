import { n as toUrl, t as cn } from "./assets/utils-DJjaB2Tv.js";
import { t as Button } from "./assets/button-Cl3HFMpR.js";
import "./assets/input-DDYt-tEh.js";
import { a as DropdownMenuLabel, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuSeparator, r as DropdownMenuGroup, s as DropdownMenuTrigger, t as DropdownMenu } from "./assets/dropdown-menu-DttT2oSg.js";
import { i as dashboard, l as logout, o as home } from "./assets/routes-BtCAeSqc.js";
import { t as edit } from "./assets/profile-BIxHBbMP.js";
import { t as Toaster } from "./assets/sonner-D1SF8OoB.js";
import { t as Heading } from "./assets/heading-COoAH6p0.js";
import { t as edit$1 } from "./assets/security-v_B6Kg-C.js";
import { Link, createInertiaApp, router, usePage } from "@inertiajs/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React$1 from "react";
import { Fragment, useCallback, useSyncExternalStore } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { ArrowRight, BarChart3, Bell, Boxes, ChevronRight, ChevronsUpDown, CircleDollarSign, ClipboardList, FileText, Heart, Home, LayoutGrid, LogOut, Package, PanelLeftCloseIcon, PanelLeftOpenIcon, Settings, ShieldCheck, ShoppingBag, Tags, Truck, UserCog, Users, WalletCards, XIcon } from "lucide-react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
//#region resources/js/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Root, {
		"data-slot": "tooltip",
		...props
	});
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, sideOffset = 4, children, ...props }) {
	return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(TooltipPrimitive.Content, {
		"data-slot": "tooltip-content",
		sideOffset,
		className: cn("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-sm rounded-md px-3 py-1.5 text-xs", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })]
	}) });
}
var setCookie = (name, value, days = 365) => {
	if (typeof document === "undefined") return;
	const maxAge = days * 24 * 60 * 60;
	document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};
var applyTheme = () => {
	if (typeof document === "undefined") return;
	document.documentElement.classList.remove("dark");
	document.documentElement.style.colorScheme = "light";
};
function initializeTheme() {
	if (typeof window === "undefined") return;
	localStorage.setItem("appearance", "light");
	setCookie("appearance", "light");
	applyTheme();
}
//#endregion
//#region resources/js/components/ui/separator.tsx
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
		"data-slot": "separator-root",
		decorative,
		orientation,
		className: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
		"data-slot": "sheet-overlay",
		className: cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
		"data-slot": "sheet-content",
		className: cn("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className),
		...props,
		children: [children, /* @__PURE__ */ jsxs(SheetPrimitive.Close, {
			className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
			children: [/* @__PURE__ */ jsx(XIcon, { className: "size-4" }), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-1.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Title, {
		"data-slot": "sheet-title",
		className: cn("text-foreground font-semibold", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(SheetPrimitive.Description, {
		"data-slot": "sheet-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
//#endregion
//#region resources/js/hooks/use-mobile.tsx
var mql = typeof window === "undefined" ? void 0 : window.matchMedia(`(max-width: 767px)`);
function mediaQueryListener(callback) {
	if (!mql) return () => {};
	mql.addEventListener("change", callback);
	return () => {
		mql.removeEventListener("change", callback);
	};
}
function isSmallerThanBreakpoint() {
	return mql?.matches ?? false;
}
function getServerSnapshot() {
	return false;
}
function useIsMobile() {
	return useSyncExternalStore(mediaQueryListener, isSmallerThanBreakpoint, getServerSnapshot);
}
//#endregion
//#region resources/js/components/ui/sidebar.tsx
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 3600 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = React$1.createContext(null);
function useSidebar() {
	const context = React$1.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = React$1.useState(false);
	const [_open, _setOpen] = React$1.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = React$1.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = React$1.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	React$1.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = React$1.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ jsx(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ jsx("div", {
			"data-slot": "sidebar-wrapper",
			style: {
				"--sidebar-width": SIDEBAR_WIDTH,
				"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
				...style
			},
			className: cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className),
			...props,
			children
		})
	});
}
function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar",
		className: cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className),
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ jsxs(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: [/* @__PURE__ */ jsxs(SheetHeader, {
			className: "sr-only",
			children: [/* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })]
		}), /* @__PURE__ */ jsx(SheetContent, {
			"data-sidebar": "sidebar",
			"data-slot": "sidebar",
			"data-mobile": "true",
			className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: /* @__PURE__ */ jsx("div", {
				className: "flex h-full w-full flex-col",
				children
			})
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "group peer text-sidebar-foreground hidden md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		"data-slot": "sidebar",
		children: [/* @__PURE__ */ jsx("div", { className: cn("relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ jsx("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ jsx("div", {
				"data-sidebar": "sidebar",
				className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
				children
			})
		})]
	});
}
function SidebarTrigger({ className, onClick, ...props }) {
	const { toggleSidebar, isMobile, state } = useSidebar();
	return /* @__PURE__ */ jsxs(Button, {
		"data-sidebar": "trigger",
		"data-slot": "sidebar-trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [isMobile || state === "collapsed" ? /* @__PURE__ */ jsx(PanelLeftOpenIcon, {}) : /* @__PURE__ */ jsx(PanelLeftCloseIcon, {}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Toggle sidebar"
		})]
	});
}
function SidebarInset({ className, ...props }) {
	return /* @__PURE__ */ jsx("main", {
		"data-slot": "sidebar-inset",
		className: cn("bg-background relative flex max-w-full min-h-svh flex-1 flex-col", "peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0", className),
		...props
	});
}
function SidebarHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-header",
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-footer",
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
}
function SidebarContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-content",
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
}
function SidebarGroup({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group",
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
}
function SidebarGroupLabel({ className, asChild = false, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "div", {
		"data-slot": "sidebar-group-label",
		"data-sidebar": "group-label",
		className: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:select-none group-data-[collapsible=icon]:pointer-events-none", className),
		...props
	});
}
function SidebarGroupContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sidebar-group-content",
		"data-sidebar": "group-content",
		className: cn("w-full text-sm", className),
		...props
	});
}
function SidebarMenu({ className, ...props }) {
	return /* @__PURE__ */ jsx("ul", {
		"data-slot": "sidebar-menu",
		"data-sidebar": "menu",
		className: cn("flex w-full min-w-0 flex-col gap-1", className),
		...props
	});
}
function SidebarMenuItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "sidebar-menu-item",
		"data-sidebar": "menu-item",
		className: cn("group/menu-item relative", className),
		...props
	});
}
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function SidebarMenuButton({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }) {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ jsx(Comp, {
		"data-slot": "sidebar-menu-button",
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ jsx(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
}
//#endregion
//#region resources/js/components/app-content.tsx
function AppContent({ variant = "sidebar", children, ...props }) {
	if (variant === "sidebar") return /* @__PURE__ */ jsx(SidebarInset, {
		...props,
		children
	});
	return /* @__PURE__ */ jsx("main", {
		className: "mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl",
		...props,
		children
	});
}
//#endregion
//#region resources/js/components/app-shell.tsx
function AppShell({ children, variant = "sidebar" }) {
	const isOpen = usePage().props.sidebarOpen;
	if (variant === "header") return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen w-full flex-col",
		children
	});
	return /* @__PURE__ */ jsx(SidebarProvider, {
		defaultOpen: isOpen,
		children
	});
}
//#endregion
//#region resources/js/hooks/use-current-url.ts
function useCurrentUrl() {
	const page = usePage();
	const currentUrlPath = new URL(page.url, typeof window !== "undefined" ? window.location.origin : "http://localhost").pathname;
	const isCurrentUrl = (urlToCheck, currentUrl, startsWith = false) => {
		const urlToCompare = currentUrl ?? currentUrlPath;
		const urlString = toUrl(urlToCheck);
		const comparePath = (path) => startsWith ? urlToCompare.startsWith(path) : path === urlToCompare;
		if (!urlString.startsWith("http")) return comparePath(urlString);
		try {
			return comparePath(new URL(urlString).pathname);
		} catch {
			return false;
		}
	};
	const isCurrentOrParentUrl = (urlToCheck, currentUrl) => {
		return isCurrentUrl(urlToCheck, currentUrl, true);
	};
	const whenCurrentUrl = (urlToCheck, ifTrue, ifFalse = null) => {
		return isCurrentUrl(urlToCheck) ? ifTrue : ifFalse;
	};
	return {
		currentUrl: currentUrlPath,
		isCurrentUrl,
		isCurrentOrParentUrl,
		whenCurrentUrl
	};
}
//#endregion
//#region resources/js/components/nav-main.tsx
function NavMain({ items = [], groups }) {
	const { isCurrentOrParentUrl } = useCurrentUrl();
	return /* @__PURE__ */ jsx(Fragment$1, { children: (groups ?? [{
		title: "Platform",
		items
	}]).map((group) => /* @__PURE__ */ jsxs(SidebarGroup, {
		className: "px-1 py-2",
		children: [/* @__PURE__ */ jsx(SidebarGroupLabel, {
			className: "px-2 text-[11px] font-semibold tracking-[0.16em] text-white/75 uppercase",
			children: group.title
		}), /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: group.items.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
			asChild: true,
			isActive: isCurrentOrParentUrl(item.href),
			tooltip: { children: item.title },
			className: "relative h-9 rounded-[6px] text-[13px] font-medium text-white transition-colors duration-200 before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary-foreground data-[active=true]:before:bg-sidebar-primary-foreground",
			children: /* @__PURE__ */ jsxs(Link, {
				href: item.href,
				prefetch: true,
				children: [item.icon && /* @__PURE__ */ jsx(item.icon, {}), /* @__PURE__ */ jsx("span", { children: item.title })]
			})
		}) }, item.title)) }) })]
	}, group.title)) });
}
//#endregion
//#region resources/js/components/ui/avatar.tsx
function Avatar({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
		"data-slot": "avatar",
		className: cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className),
		...props
	});
}
function AvatarImage({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
		"data-slot": "avatar-image",
		className: cn("aspect-square size-full", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
		"data-slot": "avatar-fallback",
		className: cn("bg-muted flex size-full items-center justify-center rounded-full", className),
		...props
	});
}
//#endregion
//#region resources/js/hooks/use-initials.tsx
function useInitials() {
	return useCallback((fullName) => {
		const names = fullName.trim().split(" ");
		if (names.length === 0) return "";
		if (names.length === 1) return names[0].charAt(0).toUpperCase();
		return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
	}, []);
}
//#endregion
//#region resources/js/components/user-info.tsx
function UserInfo({ user, showEmail = false }) {
	const getInitials = useInitials();
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(Avatar, {
		className: "h-8 w-8 overflow-hidden rounded-full",
		children: [/* @__PURE__ */ jsx(AvatarImage, {
			src: user.avatar,
			alt: user.name
		}), /* @__PURE__ */ jsx(AvatarFallback, {
			className: "rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white",
			children: getInitials(user.name)
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid flex-1 text-left text-sm leading-tight",
		children: [/* @__PURE__ */ jsx("span", {
			className: "truncate font-medium",
			children: user.name
		}), showEmail && /* @__PURE__ */ jsx("span", {
			className: "truncate text-xs text-muted-foreground",
			children: user.email
		})]
	})] });
}
//#endregion
//#region resources/js/hooks/use-mobile-navigation.ts
function useMobileNavigation() {
	return useCallback(() => {
		document.body.style.removeProperty("pointer-events");
	}, []);
}
//#endregion
//#region resources/js/components/user-menu-content.tsx
function UserMenuContent({ user }) {
	const cleanup = useMobileNavigation();
	const handleLogout = () => {
		cleanup();
		router.flushAll();
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(DropdownMenuLabel, {
			className: "p-0 font-normal",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 px-1 py-1.5 text-left text-sm",
				children: /* @__PURE__ */ jsx(UserInfo, {
					user,
					showEmail: true
				})
			})
		}),
		/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
		/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsx(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Link, {
				className: "block w-full cursor-pointer",
				href: edit(),
				prefetch: true,
				onClick: cleanup,
				children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2" }), "Settings"]
			})
		}) }),
		/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
		/* @__PURE__ */ jsx(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Link, {
				className: "block w-full cursor-pointer",
				href: logout(),
				method: "post",
				as: "button",
				onClick: handleLogout,
				"data-test": "logout-button",
				children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2" }), "Log out"]
			})
		})
	] });
}
//#endregion
//#region resources/js/components/nav-user.tsx
function NavUser() {
	const { auth } = usePage().props;
	const { state } = useSidebar();
	const isMobile = useIsMobile();
	if (!auth.user) return null;
	return /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs(SidebarMenuButton, {
			size: "lg",
			className: "group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent",
			"data-test": "sidebar-menu-button",
			children: [/* @__PURE__ */ jsx(UserInfo, { user: auth.user }), /* @__PURE__ */ jsx(ChevronsUpDown, { className: "ml-auto size-4" })]
		})
	}), /* @__PURE__ */ jsx(DropdownMenuContent, {
		className: "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
		align: "end",
		side: isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom",
		children: /* @__PURE__ */ jsx(UserMenuContent, { user: auth.user })
	})] }) }) });
}
//#endregion
//#region resources/js/components/app-sidebar.tsx
var mainNavItems = [{
	title: "Dasbor",
	href: dashboard(),
	icon: LayoutGrid
}];
var adminNavGroups = [
	{
		title: "Ringkasan",
		items: [{
			title: "Dashboard",
			href: "/admin/dashboard",
			icon: LayoutGrid
		}]
	},
	{
		title: "Katalog",
		items: [
			{
				title: "Produk",
				href: "/admin/products",
				icon: Package
			},
			{
				title: "Varian",
				href: "/admin/product-variants",
				icon: Boxes
			},
			{
				title: "Kategori",
				href: "/admin/categories",
				icon: Tags
			},
			{
				title: "Stok",
				href: "/admin/stock",
				icon: BarChart3
			}
		]
	},
	{
		title: "Penjualan",
		items: [
			{
				title: "Pesanan",
				href: "/admin/orders",
				icon: ShoppingBag
			},
			{
				title: "Pembayaran",
				href: "/admin/payments",
				icon: WalletCards
			},
			{
				title: "Log Pembayaran",
				href: "/admin/payment-logs",
				icon: FileText
			},
			{
				title: "Pengiriman",
				href: "/admin/shipments",
				icon: Truck
			},
			{
				title: "Log Biteship",
				href: "/admin/biteship-webhook-logs",
				icon: ClipboardList
			}
		]
	},
	{
		title: "Pelanggan",
		items: [
			{
				title: "Pelanggan",
				href: "/admin/customers",
				icon: Users
			},
			{
				title: "Alamat",
				href: "/admin/customer-addresses",
				icon: Home
			},
			{
				title: "Notifikasi",
				href: "/admin/notifications",
				icon: Bell
			},
			{
				title: "Insight Wishlist",
				href: "/admin/wishlists",
				icon: Heart
			}
		]
	},
	{
		title: "Pemasaran & Konten",
		items: [{
			title: "Voucher",
			href: "/admin/vouchers",
			icon: CircleDollarSign
		}]
	},
	{
		title: "Sistem",
		items: [
			{
				title: "Laporan Penjualan",
				href: "/admin/reports/sales",
				icon: BarChart3
			},
			{
				title: "Laporan Produk",
				href: "/admin/reports/products",
				icon: ClipboardList
			},
			{
				title: "Laporan Pelanggan",
				href: "/admin/reports/customers",
				icon: Users
			},
			{
				title: "Laporan Pengiriman",
				href: "/admin/reports/shipments",
				icon: Truck
			},
			{
				title: "Laporan Voucher",
				href: "/admin/reports/vouchers",
				icon: CircleDollarSign
			},
			{
				title: "Log Audit",
				href: "/admin/audit-logs",
				icon: ShieldCheck
			},
			{
				title: "Pengaturan",
				href: "/admin/settings",
				icon: Settings
			},
			{
				title: "Pengguna Admin",
				href: "/admin/admin-users",
				icon: UserCog
			}
		]
	}
];
function AppSidebar() {
	const { url } = usePage();
	const isAdmin = url.startsWith("/admin");
	return /* @__PURE__ */ jsxs(Sidebar, {
		collapsible: "icon",
		variant: "sidebar",
		className: "border-r border-ink/15",
		children: [
			/* @__PURE__ */ jsx(SidebarHeader, {
				className: "h-16 border-b border-ink/15 px-3",
				children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {
					size: "lg",
					asChild: true,
					className: "h-10 justify-center rounded-[6px] text-white transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
					children: /* @__PURE__ */ jsx(Link, {
						href: isAdmin ? "/admin/dashboard" : dashboard(),
						prefetch: true,
						children: /* @__PURE__ */ jsx("img", {
							src: "/logo/dc-header-white.webp",
							alt: "Dashboard Deklase",
							className: "h-auto w-32 group-data-[collapsible=icon]:hidden"
						})
					})
				}) }) })
			}),
			/* @__PURE__ */ jsx(SidebarContent, {
				className: "admin-sidebar-scrollbar gap-1 px-2 py-3",
				children: isAdmin ? /* @__PURE__ */ jsx(NavMain, { groups: adminNavGroups }) : /* @__PURE__ */ jsx(NavMain, { items: mainNavItems })
			}),
			/* @__PURE__ */ jsx(SidebarFooter, {
				className: "border-t border-ink/15 p-3",
				children: /* @__PURE__ */ jsx(NavUser, {})
			})
		]
	});
}
//#endregion
//#region resources/js/components/ui/breadcrumb.tsx
function Breadcrumb({ ...props }) {
	return /* @__PURE__ */ jsx("nav", {
		"aria-label": "breadcrumb",
		"data-slot": "breadcrumb",
		...props
	});
}
function BreadcrumbList({ className, ...props }) {
	return /* @__PURE__ */ jsx("ol", {
		"data-slot": "breadcrumb-list",
		className: cn("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5", className),
		...props
	});
}
function BreadcrumbItem({ className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "breadcrumb-item",
		className: cn("inline-flex items-center gap-1.5", className),
		...props
	});
}
function BreadcrumbLink({ asChild, className, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "a", {
		"data-slot": "breadcrumb-link",
		className: cn("hover:text-foreground transition-colors", className),
		...props
	});
}
function BreadcrumbPage({ className, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		"data-slot": "breadcrumb-page",
		role: "link",
		"aria-disabled": "true",
		"aria-current": "page",
		className: cn("text-foreground font-normal", className),
		...props
	});
}
function BreadcrumbSeparator({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		"data-slot": "breadcrumb-separator",
		role: "presentation",
		"aria-hidden": "true",
		className: cn("[&>svg]:size-3.5", className),
		...props,
		children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
	});
}
//#endregion
//#region resources/js/components/breadcrumbs.tsx
function Breadcrumbs({ breadcrumbs }) {
	return /* @__PURE__ */ jsx(Fragment$1, { children: breadcrumbs.length > 0 && /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsx(BreadcrumbList, { children: breadcrumbs.map((item, index) => {
		const isLast = index === breadcrumbs.length - 1;
		return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(BreadcrumbItem, { children: isLast ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.title }) : /* @__PURE__ */ jsx(BreadcrumbLink, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Link, {
				href: item.href,
				children: item.title
			})
		}) }), !isLast && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})] }, index);
	}) }) }) });
}
//#endregion
//#region resources/js/components/app-sidebar-header.tsx
function AppSidebarHeader({ breadcrumbs = [] }) {
	return /* @__PURE__ */ jsxs("header", {
		className: "relative flex h-16 shrink-0 items-center justify-center border-b border-ink/15 bg-canvas px-6 text-center text-ink transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute left-6 md:left-4",
			children: /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1 border border-ink/15 text-ink hover:bg-ink hover:text-white" })
		}), /* @__PURE__ */ jsx("div", {
			className: "flex min-w-0 items-center justify-center text-[15px] font-semibold tracking-[0.08em] uppercase md:text-[17px]",
			children: /* @__PURE__ */ jsx(Breadcrumbs, { breadcrumbs })
		})]
	});
}
//#endregion
//#region resources/js/layouts/app/app-sidebar-layout.tsx
function AppSidebarLayout({ children, breadcrumbs = [] }) {
	return /* @__PURE__ */ jsxs(AppShell, {
		variant: "sidebar",
		children: [/* @__PURE__ */ jsx(AppSidebar, {}), /* @__PURE__ */ jsxs(AppContent, {
			variant: "sidebar",
			className: "overflow-x-hidden bg-canvas text-ink selection:bg-primary selection:text-white",
			children: [
				/* @__PURE__ */ jsx(AppSidebarHeader, { breadcrumbs }),
				children,
				/* @__PURE__ */ jsx(Toaster, {})
			]
		})]
	});
}
//#endregion
//#region resources/js/layouts/app-layout.tsx
function AppLayout({ breadcrumbs = [], children }) {
	return /* @__PURE__ */ jsx(AppSidebarLayout, {
		breadcrumbs,
		children
	});
}
//#endregion
//#region resources/js/layouts/auth-layout.tsx
var defaultHero = {
	src: "https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1500&q=90",
	alt: "Kopi Deklase dalam suasana hangat dan tenang"
};
function AuthLayout({ title, description, breadcrumbs, heroImage, heroOverlay, contentClassName, children }) {
	const resolvedHeroImage = heroImage ?? defaultHero;
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-svh bg-canvas font-sans text-ink lg:h-svh lg:min-h-0 lg:overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid min-h-svh lg:h-full lg:min-h-0 lg:grid-cols-[.95fr_1.05fr]",
			children: [/* @__PURE__ */ jsxs("section", {
				className: "relative hidden min-h-svh overflow-hidden border-r border-hairline bg-surface-dark text-canvas lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:justify-between",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: resolvedHeroImage.src,
						alt: resolvedHeroImage.alt,
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-ink/42" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 flex items-start justify-between border-b border-canvas/30 px-10 py-7 xl:px-14",
						children: [/* @__PURE__ */ jsx(Link, {
							href: home(),
							className: "font-serif text-[34px] leading-none tracking-[-0.045em] hover:text-oat",
							children: "Deklase"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[9px] font-semibold tracking-[0.12em] uppercase",
							children: "Coffee roastery"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 border-t border-canvas/30 px-10 py-10 xl:px-14 xl:py-12",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-[9px] font-semibold tracking-[0.12em] text-oat uppercase",
								children: "Your daily ritual"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-4 max-w-xl font-condensed text-[clamp(54px,6vw,94px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase",
								children: [
									"Good coffee.",
									/* @__PURE__ */ jsx("br", {}),
									"Made personal."
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: home(),
								className: "mt-7 inline-flex items-center gap-3 rounded-none border border-canvas px-5 py-3 text-[10px] font-semibold tracking-[0.1em] uppercase hover:bg-canvas hover:text-ink",
								children: ["Back to shop ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
							})
						]
					}),
					heroOverlay && /* @__PURE__ */ jsx("div", {
						className: "relative z-20",
						children: heroOverlay
					})
				]
			}), /* @__PURE__ */ jsx("main", {
				className: "flex min-h-svh flex-col bg-canvas lg:h-full lg:min-h-0 lg:overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex flex-1 items-center px-6 py-10 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:px-12 lg:py-6 xl:px-16 xl:py-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: ["mx-auto w-full max-w-[500px] lg:max-w-[460px]", contentClassName ?? ""].join(" "),
						children: [
							breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ jsx("nav", {
								"aria-label": "Breadcrumb",
								className: "mb-7 flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase lg:mb-4",
								children: breadcrumbs.map((crumb, index) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [crumb.href ? /* @__PURE__ */ jsx(Link, {
										href: crumb.href,
										className: "text-ink/55 hover:text-primary",
										children: crumb.label
									}) : /* @__PURE__ */ jsx("span", { children: crumb.label }), index < breadcrumbs.length - 1 && /* @__PURE__ */ jsx("span", {
										className: "text-ink/30",
										children: "/"
									})]
								}, `${crumb.label}-${index}`))
							}),
							(title || description) && /* @__PURE__ */ jsxs("div", {
								className: "mb-8 border-b border-hairline pb-7 lg:mb-5 lg:pb-5",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-[9px] font-semibold tracking-[0.1em] text-primary uppercase",
										children: "Deklase account"
									}),
									title && /* @__PURE__ */ jsx("h1", {
										className: "mt-3 font-condensed text-[clamp(46px,6vw,72px)] leading-[0.82] font-semibold tracking-[-0.05em] uppercase lg:text-[clamp(40px,4.2vw,62px)]",
										children: title
									}),
									description && /* @__PURE__ */ jsx("p", {
										className: "mt-5 max-w-[42ch] text-[12px] leading-[1.55] text-ink/70 lg:mt-3",
										children: description
									})
								]
							}),
							children
						]
					})
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/layouts/settings/layout.tsx
var sidebarNavItems = [{
	title: "Profile",
	href: edit(),
	icon: null
}, {
	title: "Security",
	href: edit$1(),
	icon: null
}];
function SettingsLayout({ children }) {
	const { isCurrentOrParentUrl } = useCurrentUrl();
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-6",
		children: [/* @__PURE__ */ jsx(Heading, {
			title: "Settings",
			description: "Manage your profile and account settings"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col lg:flex-row lg:space-x-12",
			children: [
				/* @__PURE__ */ jsx("aside", {
					className: "w-full max-w-xl lg:w-48",
					children: /* @__PURE__ */ jsx("nav", {
						className: "flex flex-col space-y-1 space-x-0",
						"aria-label": "Settings",
						children: sidebarNavItems.map((item, index) => /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							className: cn("w-full justify-start", { "bg-muted": isCurrentOrParentUrl(item.href) }),
							children: /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								children: [item.icon && /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }), item.title]
							})
						}, `${toUrl(item.href)}-${index}`))
					})
				}),
				/* @__PURE__ */ jsx(Separator, { className: "my-6 lg:hidden" }),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 md:max-w-2xl",
					children: /* @__PURE__ */ jsx("section", {
						className: "max-w-xl space-y-12",
						children
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/app.tsx
var appName = "Laravel";
var pages = /* @__PURE__ */ Object.assign({
	"./pages/about/index.tsx": () => import("./assets/about-jhzdjIth.js"),
	"./pages/admin/admin-users/form.tsx": () => import("./assets/form-BYME3LgI.js"),
	"./pages/admin/admin-users/index.tsx": () => import("./assets/admin-users-CQvzg96V.js"),
	"./pages/admin/audit-logs/index.tsx": () => import("./assets/audit-logs-BIwoZEo5.js"),
	"./pages/admin/banners/form.tsx": () => import("./assets/form-OHFRov6K.js"),
	"./pages/admin/banners/index.tsx": () => import("./assets/banners-CdcNjeUy.js"),
	"./pages/admin/biteship-webhook-logs/index.tsx": () => import("./assets/biteship-webhook-logs-U17xYuPx.js"),
	"./pages/admin/biteship-webhook-logs/show.tsx": () => import("./assets/show-RGqPGOQJ.js"),
	"./pages/admin/blogs/form.tsx": () => import("./assets/form-D_HKycT4.js"),
	"./pages/admin/blogs/index.tsx": () => import("./assets/blogs-zHOpnJrX.js"),
	"./pages/admin/catalog/shared.tsx": () => import("./assets/shared-DFl0a3MO.js"),
	"./pages/admin/categories/form.tsx": () => import("./assets/form-C_sm5PBA.js"),
	"./pages/admin/categories/index.tsx": () => import("./assets/categories-D54yTRzm.js"),
	"./pages/admin/customer-addresses/form.tsx": () => import("./assets/form-C9DGJ8it.js"),
	"./pages/admin/customer-addresses/index.tsx": () => import("./assets/customer-addresses-CLRP9XQo.js"),
	"./pages/admin/customer-addresses/show.tsx": () => import("./assets/show-aTvg3rki.js"),
	"./pages/admin/customers/index.tsx": () => import("./assets/customers-D2UWhRE_.js"),
	"./pages/admin/customers/show.tsx": () => import("./assets/show-6ZG2_WyV.js"),
	"./pages/admin/dashboard.tsx": () => import("./assets/dashboard-B4Tvd8-D.js"),
	"./pages/admin/gallery/form.tsx": () => import("./assets/form-CoSXuulC.js"),
	"./pages/admin/gallery/index.tsx": () => import("./assets/gallery-D6B6hAF0.js"),
	"./pages/admin/marketing/shared.tsx": () => import("./assets/shared-BSAlasE9.js"),
	"./pages/admin/new-product/form.tsx": () => import("./assets/form-DySFF8Gn.js"),
	"./pages/admin/notifications/form.tsx": () => import("./assets/form-Cjr5atEm.js"),
	"./pages/admin/notifications/index.tsx": () => import("./assets/notifications-Dbj1P0nJ.js"),
	"./pages/admin/orders/index.tsx": () => import("./assets/orders-CvyF_DSp.js"),
	"./pages/admin/orders/show.tsx": () => import("./assets/show-Bm56UVvs.js"),
	"./pages/admin/pages/form.tsx": () => import("./assets/form-BDO6qqwX.js"),
	"./pages/admin/pages/index.tsx": () => import("./assets/pages-DyJPOU3T.js"),
	"./pages/admin/pagination.tsx": () => import("./assets/pagination-Mn5yoydn.js"),
	"./pages/admin/payment-logs/index.tsx": () => import("./assets/payment-logs-BZbWSLJs.js"),
	"./pages/admin/payment-logs/show.tsx": () => import("./assets/show-CTkSZTKc.js"),
	"./pages/admin/payments/index.tsx": () => import("./assets/payments-C3iZKOzL.js"),
	"./pages/admin/payments/show.tsx": () => import("./assets/show-P0pY10OC.js"),
	"./pages/admin/product-variants/form.tsx": () => import("./assets/form-CciBGYA9.js"),
	"./pages/admin/product-variants/index.tsx": () => import("./assets/product-variants-nyVasQXO.js"),
	"./pages/admin/products/form.tsx": () => import("./assets/form-BMBJPcMt2.js"),
	"./pages/admin/products/index.tsx": () => import("./assets/products-0pzbSl1k.js"),
	"./pages/admin/products/show.tsx": () => import("./assets/show-BQXKdgbZ.js"),
	"./pages/admin/reports/index.tsx": () => import("./assets/reports-CA4OFgb7.js"),
	"./pages/admin/resource-form.tsx": () => import("./assets/resource-form-CM8s7eF7.js"),
	"./pages/admin/resource-index.tsx": () => import("./assets/resource-index-B1QGEPM3.js"),
	"./pages/admin/resource-show.tsx": () => import("./assets/resource-show-CIQq5GPJ.js"),
	"./pages/admin/sales/shared.tsx": () => import("./assets/shared-D7H4URl1.js"),
	"./pages/admin/settings/index.tsx": () => import("./assets/settings-DcalnVNZ.js"),
	"./pages/admin/shipments/index.tsx": () => import("./assets/shipments-Bt40hzPc.js"),
	"./pages/admin/shipments/show.tsx": () => import("./assets/show-b65buove.js"),
	"./pages/admin/stock/adjustment.tsx": () => import("./assets/adjustment-BX9U1vgv.js"),
	"./pages/admin/stock/index.tsx": () => import("./assets/stock-C-iJ6G6B.js"),
	"./pages/admin/vouchers/form.tsx": () => import("./assets/form-CKjVi5rY.js"),
	"./pages/admin/vouchers/index.tsx": () => import("./assets/vouchers-CszoWdVw.js"),
	"./pages/admin/wishlists/index.tsx": () => import("./assets/wishlists-e3xGXb7_.js"),
	"./pages/auth/confirm-password.tsx": () => import("./assets/confirm-password-CN5ufcrN.js"),
	"./pages/auth/forgot-password.tsx": () => import("./assets/forgot-password-Bc4svYSg.js"),
	"./pages/auth/login.tsx": () => import("./assets/login-DhWerEqA.js"),
	"./pages/auth/register.tsx": () => import("./assets/register-CHAmUMpV.js"),
	"./pages/auth/reset-password.tsx": () => import("./assets/reset-password-DnbF9FgR.js"),
	"./pages/auth/two-factor-challenge.tsx": () => import("./assets/two-factor-challenge-BJ3cWUQJ.js"),
	"./pages/auth/verify-email.tsx": () => import("./assets/verify-email-FVl0ESJ3.js"),
	"./pages/blog/index.tsx": () => import("./assets/blog-Cfy_Fcx6.js"),
	"./pages/blog/show.tsx": () => import("./assets/show-D4drKiZB.js"),
	"./pages/contact/index.tsx": () => import("./assets/contact-JCwD-uZV.js"),
	"./pages/customer/cart/my-cart.tsx": () => import("./assets/my-cart-Cty9QkIt.js"),
	"./pages/customer/checkout/checkout.tsx": () => import("./assets/checkout-Dopd8idC.js"),
	"./pages/customer/manage-address/manage-address.tsx": () => import("./assets/manage-address-BY--JPQc.js"),
	"./pages/customer/notification/list-notification.tsx": () => import("./assets/list-notification-Cz4tRvMe.js"),
	"./pages/customer/order/detail-order.tsx": () => import("./assets/detail-order-Dsq20VQb.js"),
	"./pages/customer/order/my-order.tsx": () => import("./assets/my-order-C4pSDlnH.js"),
	"./pages/customer/policy/no-return-policy.tsx": () => import("./assets/no-return-policy-CXgmpXU5.js"),
	"./pages/customer/policy/privacy-policy.tsx": () => import("./assets/privacy-policy-Bl08jmGF.js"),
	"./pages/customer/policy/shipping-policy.tsx": () => import("./assets/shipping-policy-Ca7OTmWg.js"),
	"./pages/customer/policy/term-condition.tsx": () => import("./assets/term-condition-B0qgUcPa.js"),
	"./pages/customer/products/detail-product.tsx": () => import("./assets/detail-product-CMB-bNfl.js"),
	"./pages/customer/products/list-product.tsx": () => import("./assets/list-product-DOeUwSmy.js"),
	"./pages/customer/profile/my-profile.tsx": () => import("./assets/my-profile-t4I6mynn.js"),
	"./pages/customer/wishlist/my-wishlist.tsx": () => import("./assets/my-wishlist-qbReb8pt.js"),
	"./pages/dashboard.tsx": () => import("./assets/dashboard-CP8HcExM.js"),
	"./pages/gallery/index.tsx": () => import("./assets/gallery-CWY-ILaP.js"),
	"./pages/new-product/index.tsx": () => import("./assets/new-product-DcjNf6Lm.js"),
	"./pages/settings/appearance.tsx": () => import("./assets/appearance-9OZUMvSw.js"),
	"./pages/settings/profile.tsx": () => import("./assets/profile-DkgFUZA_.js"),
	"./pages/settings/security.tsx": () => import("./assets/security-DpOi9p5s.js"),
	"./pages/welcome.tsx": () => import("./assets/welcome-Ds2igkXQ.js")
});
var render = await createInertiaApp({
	title: (title) => title ? `${title} - ${appName}` : appName,
	resolve: async (name) => {
		const page = pages[`./pages/${name}.tsx`];
		if (!page) throw new Error(`Page not found: ${name}`);
		return (await page()).default;
	},
	layout: (name) => {
		switch (true) {
			case name === "welcome": return null;
			case name === "home": return null;
			case name === "detail": return null;
			case name.startsWith("auth/"): return AuthLayout;
			case name.startsWith("admin/"): return AppLayout;
			case name.startsWith("settings/"): return [AppLayout, SettingsLayout];
			default: return null;
		}
	},
	strictMode: true,
	withApp(app) {
		return /* @__PURE__ */ jsx(TooltipProvider, {
			delayDuration: 0,
			children: app
		});
	},
	progress: { color: "#4B5563" }
});
var renderPage = (page) => render(page, renderToString);
createServer(renderPage);
initializeTheme();
//#endregion
export { renderPage as default };

//# sourceMappingURL=app.js.map