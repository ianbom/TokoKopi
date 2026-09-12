import { t as cn } from "./utils-DJjaB2Tv.js";
import { t as Button } from "./button-Cl3HFMpR.js";
import { t as Input } from "./input-DDYt-tEh.js";
import { t as InputError } from "./input-error-NrpA4cu1.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-D4LqnWpI.js";
import { t as Label } from "./label-C9yoF3Ap.js";
import { t as settings } from "./settings-CyfKnAnW.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { Save } from "lucide-react";
//#region resources/js/pages/admin/settings/index.tsx
var sectionLinks = {
	store: settings.store.url(),
	payment: settings.payment.url(),
	shipping: settings.shipping.url()
};
var DEFAULT_MAP_CENTER = [-8.092497, 112.1801619];
var validCoordinates = (latitude, longitude) => Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
var hasCoordinateValues = (latitude, longitude) => latitude.trim() !== "" && longitude.trim() !== "" && validCoordinates(Number(latitude), Number(longitude));
function AdminSettingsIndex({ activeSection, sections, values }) {
	const current = sections[activeSection];
	const { data, setData, put, processing, errors, recentlySuccessful } = useForm(current.fields.reduce((carry, field) => {
		carry[field.key] = values[field.key] ?? "";
		return carry;
	}, {}));
	const visibleFields = current.fields.filter((field) => field.key !== "store_latitude" && field.key !== "store_longitude");
	const latitude = data.store_latitude ?? "";
	const longitude = data.store_longitude ?? "";
	const hasStoreCoordinates = hasCoordinateValues(latitude, longitude);
	const submit = (event) => {
		event.preventDefault();
		put(settings.update.url(), { preserveScroll: true });
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Head, { title: "Admin Settings" }), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col gap-6 p-4 md:p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col justify-between gap-3 md:flex-row md:items-end",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-medium text-muted-foreground",
					children: "Settings"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: current.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 max-w-2xl text-sm text-muted-foreground",
					children: current.description
				})
			] }), recentlySuccessful ? /* @__PURE__ */ jsx("span", {
				className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
				children: "Settings tersimpan"
			}) : null]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ jsx(Card, {
				className: "h-fit py-3",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "flex flex-col gap-1 px-3",
					children: [Object.entries(sections).map(([key, section]) => /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: key === activeSection ? "secondary" : "ghost",
						className: cn("justify-start", key === activeSection && "bg-primary/10 text-primary hover:bg-primary/15"),
						children: /* @__PURE__ */ jsx(Link, {
							href: sectionLinks[key] ?? "/admin/settings",
							children: section.title
						})
					}, key)), /* @__PURE__ */ jsx(Button, {
						asChild: true,
						variant: "ghost",
						className: "justify-start",
						children: /* @__PURE__ */ jsx(Link, {
							href: "/admin/admin-users",
							children: "Admin Users"
						})
					})]
				})
			}), /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, { children: current.title }), /* @__PURE__ */ jsx(CardDescription, { children: "Sensitive API keys seperti Midtrans server key dan Biteship API key tetap dikelola dari file environment." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: visibleFields.map((field) => /* @__PURE__ */ jsxs("div", {
							className: cn("grid gap-2", field.input === "textarea" && "md:col-span-2"),
							children: [
								/* @__PURE__ */ jsx(Label, {
									htmlFor: field.key,
									children: field.label
								}),
								field.input === "textarea" ? /* @__PURE__ */ jsx("textarea", {
									id: field.key,
									value: data[field.key] ?? "",
									onChange: (event) => setData(field.key, event.target.value),
									className: "min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
								}) : field.input === "select" ? /* @__PURE__ */ jsxs("select", {
									id: field.key,
									value: data[field.key] ?? "",
									onChange: (event) => setData(field.key, event.target.value),
									className: "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Select option"
									}), field.options?.map((option) => /* @__PURE__ */ jsx("option", {
										value: option,
										children: option
									}, option))]
								}) : /* @__PURE__ */ jsx(Input, {
									id: field.key,
									type: field.input ?? "text",
									value: data[field.key] ?? "",
									onChange: (event) => setData(field.key, event.target.value)
								}),
								/* @__PURE__ */ jsx(InputError, { message: errors[field.key] })
							]
						}, field.key))
					}),
					activeSection === "store" && /* @__PURE__ */ jsx(LocationPicker, {
						error: errors.store_latitude ?? errors.store_longitude,
						latitude,
						longitude,
						onChange: (nextLatitude, nextLongitude) => {
							setData("store_latitude", nextLatitude.toFixed(7));
							setData("store_longitude", nextLongitude.toFixed(7));
						}
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-3 border-t pt-6",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ jsx(Link, {
								href: "/admin/dashboard",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: processing || activeSection === "store" && !hasStoreCoordinates,
							children: [/* @__PURE__ */ jsx(Save, {}), processing ? "Saving..." : "Save Settings"]
						})]
					})
				]
			}) })] })]
		})]
	})] });
}
function LocationPicker({ latitude, longitude, error, onChange }) {
	const [modules, setModules] = useState(null);
	const [markerIcon, setMarkerIcon] = useState(null);
	const [loadError, setLoadError] = useState(false);
	const parsedLatitude = Number(latitude);
	const parsedLongitude = Number(longitude);
	const hasCoordinates = hasCoordinateValues(latitude, longitude);
	const position = hasCoordinates ? [parsedLatitude, parsedLongitude] : DEFAULT_MAP_CENTER;
	useEffect(() => {
		let isMounted = true;
		Promise.all([
			import("leaflet"),
			Promise.resolve({            }),
			import("react-leaflet")
		]).then(([leaflet, , reactLeaflet]) => {
			if (!isMounted) return;
			setMarkerIcon(leaflet.icon({
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			}));
			setModules({
				MapContainer: reactLeaflet.MapContainer,
				Marker: reactLeaflet.Marker,
				TileLayer: reactLeaflet.TileLayer,
				useMap: reactLeaflet.useMap,
				useMapEvents: reactLeaflet.useMapEvents
			});
		}).catch(() => {
			if (isMounted) setLoadError(true);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-4 border-t pt-6 md:col-span-2",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Store Location" }), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Klik peta untuk menetapkan pin, atau drag pin yang sudah ada."
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-md border bg-muted/20",
				children: modules && markerIcon ? /* @__PURE__ */ jsx(ClientMap, {
					hasCoordinates,
					markerIcon,
					modules,
					onChange,
					position
				}) : /* @__PURE__ */ jsx("div", {
					className: "flex h-[360px] items-center justify-center text-sm text-muted-foreground",
					children: loadError ? "Peta gagal dimuat." : "Memuat peta..."
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ jsx(CoordinateInput, {
					id: "store_latitude",
					label: "Latitude",
					max: 90,
					min: -90,
					value: latitude
				}), /* @__PURE__ */ jsx(CoordinateInput, {
					id: "store_longitude",
					label: "Longitude",
					max: 180,
					min: -180,
					value: longitude
				})]
			}),
			!hasCoordinates && /* @__PURE__ */ jsx("p", {
				className: "text-sm font-medium text-amber-700",
				children: "Tetapkan pin di peta sebelum menyimpan lokasi toko."
			}),
			/* @__PURE__ */ jsx(InputError, { message: error })
		]
	});
}
function CoordinateInput({ id, label, max, min, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ jsx(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ jsx(Input, {
			id,
			max,
			min,
			readOnly: true,
			step: "any",
			type: "number",
			value
		})]
	});
}
function ClientMap({ hasCoordinates, markerIcon, modules, onChange, position }) {
	const { MapContainer, Marker, TileLayer } = modules;
	const zoom = hasCoordinates ? 17 : 12;
	return /* @__PURE__ */ jsxs(MapContainer, {
		center: position,
		className: "h-[360px] w-full",
		scrollWheelZoom: true,
		zoom,
		children: [
			/* @__PURE__ */ jsx(TileLayer, {
				attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
				url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			}),
			/* @__PURE__ */ jsx(MapUpdater, {
				center: position,
				modules,
				zoom
			}),
			/* @__PURE__ */ jsx(MapClickHandler, {
				modules,
				onChange
			}),
			hasCoordinates && /* @__PURE__ */ jsx(Marker, {
				draggable: true,
				eventHandlers: { dragend: (event) => {
					const nextPosition = event.target.getLatLng();
					onChange(nextPosition.lat, nextPosition.lng);
				} },
				icon: markerIcon,
				position
			})
		]
	});
}
function MapUpdater({ center, modules, zoom }) {
	const map = modules.useMap();
	useEffect(() => {
		map.invalidateSize();
		map.setView(center, zoom);
	}, [
		center,
		map,
		zoom
	]);
	return null;
}
function MapClickHandler({ modules, onChange }) {
	modules.useMapEvents({ click: (event) => {
		onChange(event.latlng.lat, event.latlng.lng);
	} });
	return null;
}
//#endregion
export { AdminSettingsIndex as default };

//# sourceMappingURL=settings-DcalnVNZ.js.map