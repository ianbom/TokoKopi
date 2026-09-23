import { t as ShopLayout } from "./shop-layout-I9ky1mHR.js";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
//#region resources/js/data/locations.ts
var storeLocations = [
	{
		id: "sentul-blitar",
		name: "de CLASSE Gelato & Coffee — Sentul",
		address: "Jalan Insinyur Soekarno, Sentul, Blitar, Jawa Timur 66112",
		latitude: -8.0912279,
		longitude: 112.1729637,
		googleMapsUrl: "https://www.google.com/maps/place/de+CLASSE+Gelato+%26+Coffee/@-8.0948283,112.1715738,15.94z/data=!4m7!3m6!1s0x2e78ed0022d27f2d:0xb7e71e15ff7ff37!8m2!3d-8.0912279!4d112.1729637!15sChNkZWtsYXNlIHRlbmlzIGFndW5nkgELY29mZmVlX3Nob3DgAQA!16s%2Fg%2F11z8l5b78p?entry=tts&g_ep=EgoyMDI2MDYyOS4wIPu8ASoASAFQAw%3D%3D&skid=29f2a7ef-b356-4223-a4b1-4535e00d4f4d",
		whatsapp: "62881036635841"
	},
	{
		id: "bendogerit-blitar",
		name: "Roastery & HQ — Bendogerit",
		address: "Jalan Sudanco Supriyadi, Bendogerit, Blitar, Jawa Timur 66131",
		latitude: -8.0926464,
		longitude: 112.1802333,
		googleMapsUrl: "https://www.google.com/maps/place/de+CLASSE+Gelato+%26+Coffee/@-8.0948468,112.1786734,17.14z/data=!4m6!3m5!1s0x2e78ec663916e64d:0xaef2787ef098a5d6!8m2!3d-8.0926464!4d112.1802333!16s%2Fg%2F11bzrfg61v?entry=tts&g_ep=EgoyMDI2MDIyNS4wIPu8ASoASAFQAw%3D%3D&skid=f0f3836c-f6bc-48e7-8a28-e8574761d684",
		whatsapp: "6282354304898"
	},
	{
		id: "sukorejo-blitar",
		name: "de CLASSE Gelato & Coffee — Sukorejo",
		address: "Jalan Anggrek, Sukorejo, Blitar, Jawa Timur 66111",
		latitude: -8.1004699,
		longitude: 112.1604184,
		googleMapsUrl: "https://www.google.com/maps/place/De+Classe+Gelato+%26+Coffee/@-8.1007214,112.1601364,18.83z/data=!4m6!3m5!1s0x2e78ed7cbb6948a7:0x7a59f6b949362a23!8m2!3d-8.1004699!4d112.1604184!16s%2Fg%2F11fpqbktr3?entry=tts&g_ep=EgoyMDI2MDIyNS4wIPu8ASoASAFQAw%3D%3D&skid=ad297cd1-7d9a-484f-8d4a-0bf3afa270e8",
		whatsapp: "6281359645511"
	},
	{
		id: "kepanjenkidul-blitar",
		name: "de CLASSE Gelato & Coffee — Kepanjenkidul",
		address: "Jalan Tentara Genie Pelajar, Kepanjenkidul, Blitar, Jawa Timur 66112",
		latitude: -8.1021875,
		longitude: 112.1695625,
		googleMapsUrl: "https://www.google.com/maps/place/de+CLASSE+Gelato+%26+Coffee/@-8.1020045,112.1689519,19.2z/data=!4m6!3m5!1s0x2e78ed80a7c1d621:0xcb86f64c700e65c3!8m2!3d-8.1021875!4d112.1695625!16s%2Fg%2F11x87h3_wf?entry=tts&g_ep=EgoyMDI2MDIyNS4wIPu8ASoASAFQAw%3D%3D&skid=4612c71f-dd7e-491a-bacb-a84ff412b6be",
		whatsapp: "6285853228419"
	},
	{
		id: "klojen-malang",
		name: "de CLASSE Gelato & Coffee — Klojen",
		address: "Jalan Dokter Cipto Mangunkusumo, Klojen, Kota Malang, Jawa Timur 65111",
		latitude: -7.969126,
		longitude: 112.636699,
		googleMapsUrl: "https://www.google.com/maps/place/de+CLASSE+Gelato+%26+Coffee/@-7.9692485,112.6364513,21z/data=!4m6!3m5!1s0x2dd6292e5b4ad8cf:0x43f653d465e7824f!8m2!3d-7.969126!4d112.636699!16s%2Fg%2F11myqjmchh?entry=tts&g_ep=EgoyMDI2MDIyNS4wIPu8ASoASAFQAw%3D%3D&skid=abd5b9f2-6203-4430-9df5-ce3b0dd4f149",
		whatsapp: "6285854301745"
	},
	{
		id: "temas-batu",
		name: "de CLASSE Gelato & Coffee — Batu",
		address: "Jalan Munif, Temas, Kota Batu, Jawa Timur 65341",
		latitude: -7.8715669,
		longitude: 112.5270296,
		googleMapsUrl: "https://www.google.com/maps/place/de+CLASSE+Gelato+%26+Coffee/@-7.8716294,112.5270707,21z/data=!4m6!3m5!1s0x2e7881f00aef4913:0x98a21e05c865a4dc!8m2!3d-7.8715669!4d112.5270296!16s%2Fg%2F11wnp2_kyf?entry=tts&g_ep=EgoyMDI2MDIyNS4wIPu8ASoASAFQAw%3D%3D&skid=c235c29b-e123-454e-8982-7133b628d1e0",
		whatsapp: "6285736571494"
	}
];
//#endregion
//#region resources/js/pages/location.tsx
var mapCenter = [-8.024, 112.365];
function LocationPage() {
	const [modules, setModules] = useState(null);
	const [markerIcon, setMarkerIcon] = useState(null);
	const [loadError, setLoadError] = useState(false);
	useEffect(() => {
		let isMounted = true;
		Promise.all([
			import("leaflet"),
			Promise.resolve({            }),
			import("react-leaflet")
		]).then(([leaflet, , reactLeaflet]) => {
			if (!isMounted) return;
			setMarkerIcon(leaflet.divIcon({
				className: "deklasse-location-pin",
				html: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" viewBox=\"0 0 24 24\" fill=\"#ffffff\" stroke=\"#135d60\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"filter:drop-shadow(0 3px 3px rgba(19,93,96,.35))\"><path d=\"M3 9l1.5-5h15L21 9\"/><path d=\"M5 13v7h14v-7\"/><path d=\"M9 20v-5h6v5\"/><path d=\"M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0\"/></svg>",
				iconSize: [36, 36],
				iconAnchor: [18, 32],
				popupAnchor: [0, -30]
			}));
			setModules({
				MapContainer: reactLeaflet.MapContainer,
				Marker: reactLeaflet.Marker,
				Popup: reactLeaflet.Popup,
				TileLayer: reactLeaflet.TileLayer,
				useMap: reactLeaflet.useMap
			});
		}).catch(() => {
			if (isMounted) setLoadError(true);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	return /* @__PURE__ */ jsxs(ShopLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Lokasi Deklase" }),
		/* @__PURE__ */ jsx("section", {
			className: "border-b border-hairline bg-teal px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-16",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-[1600px] gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] font-semibold tracking-[0.1em] text-primary uppercase",
					children: "Store locator"
				}), /* @__PURE__ */ jsxs("h1", {
					className: "mt-3 max-w-3xl font-condensed text-[clamp(60px,8vw,132px)] leading-[0.81] font-semibold tracking-[-0.045em] uppercase",
					children: [
						"Find your",
						/* @__PURE__ */ jsx("br", {}),
						"Deklase."
					]
				})] }), /* @__PURE__ */ jsx("p", {
					className: "max-w-md text-[13px] leading-6 text-white/80 sm:text-sm",
					children: "Temukan de CLASSE Gelato & Coffee terdekat, buka petunjuk arah, atau hubungi cabang langsung lewat WhatsApp."
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "border-b border-hairline bg-canvas",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-[1600px] border-x border-hairline",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-hairline px-7 py-4 sm:px-12 lg:px-16",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-[10px] font-semibold tracking-[0.08em] text-teal uppercase",
						children: "All locations"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[10px] font-semibold tracking-[0.08em] text-body uppercase",
						children: [storeLocations.length, " stores"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-[420px] bg-surface-soft sm:h-[560px]",
					children: modules && markerIcon ? /* @__PURE__ */ jsx(LocationMap, {
						markerIcon,
						modules
					}) : /* @__PURE__ */ jsx("div", {
						className: "flex h-full items-center justify-center text-[12px] font-medium text-muted-foreground",
						children: loadError ? "Peta gagal dimuat." : "Memuat peta..."
					})
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "bg-canvas",
			children: /* @__PURE__ */ jsx("div", {
				className: "mx-auto grid max-w-[1600px] border-l border-hairline sm:grid-cols-2 lg:grid-cols-3",
				children: storeLocations.map((location, index) => /* @__PURE__ */ jsxs("article", {
					className: "flex min-h-72 flex-col justify-between border-r border-b border-hairline p-7 sm:p-9",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("p", {
							className: "text-[10px] font-semibold tracking-[0.08em] text-primary uppercase",
							children: [
								"Location",
								" ",
								String(index + 1).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-5 max-w-sm font-condensed text-4xl leading-[0.9] font-semibold tracking-[-0.03em] text-teal uppercase",
							children: location.name
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex gap-3 text-[13px] leading-5 text-body",
							children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ jsx("p", { children: location.address })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex gap-3 text-[13px] leading-5 text-body",
							children: [/* @__PURE__ */ jsx(Phone, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ jsxs("p", { children: ["+", location.whatsapp] })]
						})
					] }), /* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ jsxs("a", {
							href: location.googleMapsUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-2 border border-teal px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase transition-colors hover:bg-teal hover:text-white",
							children: [
								"Google Maps",
								" ",
								/* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })
							]
						}), /* @__PURE__ */ jsxs("a", {
							href: `https://wa.me/${location.whatsapp}`,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-2 border border-primary px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase transition-colors hover:bg-primary",
							children: [
								"WhatsApp",
								" ",
								/* @__PURE__ */ jsx(MessageCircle, { className: "size-3" })
							]
						})]
					})]
				}, location.id))
			})
		})
	] });
}
function LocationMap({ markerIcon, modules }) {
	const { MapContainer, Marker, Popup, TileLayer } = modules;
	return /* @__PURE__ */ jsxs(MapContainer, {
		center: mapCenter,
		zoom: 10,
		scrollWheelZoom: true,
		className: "h-full w-full",
		children: [
			/* @__PURE__ */ jsx(TileLayer, {
				attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
				url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			}),
			/* @__PURE__ */ jsx(MapBounds, { modules }),
			storeLocations.map((location) => /* @__PURE__ */ jsx(Marker, {
				icon: markerIcon,
				position: [location.latitude, location.longitude],
				children: /* @__PURE__ */ jsx(Popup, { children: /* @__PURE__ */ jsxs("div", {
					className: "min-w-48 text-sm text-teal",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-semibold",
							children: location.name
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs leading-4",
							children: location.address
						}),
						/* @__PURE__ */ jsx("a", {
							href: location.googleMapsUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "mt-3 inline-block text-xs font-semibold underline",
							children: "Open Google Maps"
						})
					]
				}) })
			}, location.id))
		]
	});
}
function MapBounds({ modules }) {
	const map = modules.useMap();
	useEffect(() => {
		map.fitBounds(storeLocations.map((location) => [location.latitude, location.longitude]), {
			padding: [40, 40],
			maxZoom: 14
		});
	}, [map]);
	return null;
}
//#endregion
export { LocationPage as default };

//# sourceMappingURL=location-B8_6Q79e.js.map