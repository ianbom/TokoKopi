import { Head } from '@inertiajs/react';
import type { DivIcon, Map as LeafletMap } from 'leaflet';
import { ExternalLink, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import type * as ReactLeaflet from 'react-leaflet';
import { storeLocations } from '@/data/locations';
import ShopLayout from '@/layouts/shop-layout';

type ReactLeafletModules = Pick<
    typeof ReactLeaflet,
    'MapContainer' | 'Marker' | 'Popup' | 'TileLayer' | 'useMap'
>;

const mapCenter: [number, number] = [-8.024, 112.365];

export default function LocationPage() {
    const [modules, setModules] = useState<ReactLeafletModules | null>(null);
    const [markerIcon, setMarkerIcon] = useState<DivIcon | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            import('leaflet'),
            import('leaflet/dist/leaflet.css'),
            import('react-leaflet'),
        ])
            .then(([leaflet, , reactLeaflet]) => {
                if (!isMounted) {
                    return;
                }

                setMarkerIcon(
                    leaflet.divIcon({
                        className: 'deklasse-location-pin',
                        html: '<span style="display:block;width:18px;height:18px;border:3px solid #ffffff;border-radius:9999px;background:#135d60;box-shadow:0 0 0 1px rgba(19,93,96,.35)"></span>',
                        iconSize: [18, 18],
                        iconAnchor: [9, 9],
                    }),
                );
                setModules({
                    MapContainer: reactLeaflet.MapContainer,
                    Marker: reactLeaflet.Marker,
                    Popup: reactLeaflet.Popup,
                    TileLayer: reactLeaflet.TileLayer,
                    useMap: reactLeaflet.useMap,
                });
            })
            .catch(() => {
                if (isMounted) {
                    setLoadError(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <ShopLayout>
            <Head title="Lokasi Deklase" />

            <section className="border-b border-hairline bg-teal px-7 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
                <div className="mx-auto grid max-w-[1600px] gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] text-primary uppercase">
                            Store locator
                        </p>
                        <h1 className="mt-3 max-w-3xl font-condensed text-[clamp(60px,8vw,132px)] leading-[0.81] font-semibold tracking-[-0.045em] uppercase">
                            Find your
                            <br />
                            Deklase.
                        </h1>
                    </div>
                    <p className="max-w-md text-[13px] leading-6 text-white/80 sm:text-sm">
                        Temukan de CLASSE Gelato &amp; Coffee terdekat, buka
                        petunjuk arah, atau hubungi cabang langsung lewat
                        WhatsApp.
                    </p>
                </div>
            </section>

            <section className="border-b border-hairline bg-canvas">
                <div className="mx-auto max-w-[1600px] border-x border-hairline">
                    <div className="flex items-center justify-between border-b border-hairline px-7 py-4 sm:px-12 lg:px-16">
                        <p className="text-[10px] font-semibold tracking-[0.08em] text-teal uppercase">
                            All locations
                        </p>
                        <p className="text-[10px] font-semibold tracking-[0.08em] text-body uppercase">
                            {storeLocations.length} stores
                        </p>
                    </div>
                    <div className="h-[420px] bg-surface-soft sm:h-[560px]">
                        {modules && markerIcon ? (
                            <LocationMap
                                markerIcon={markerIcon}
                                modules={modules}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-[12px] font-medium text-muted-foreground">
                                {loadError
                                    ? 'Peta gagal dimuat.'
                                    : 'Memuat peta...'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-canvas">
                <div className="mx-auto grid max-w-[1600px] border-l border-hairline sm:grid-cols-2 lg:grid-cols-3">
                    {storeLocations.map((location, index) => (
                        <article
                            key={location.id}
                            className="flex min-h-72 flex-col justify-between border-r border-b border-hairline p-7 sm:p-9"
                        >
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.08em] text-primary uppercase">
                                    Location{' '}
                                    {String(index + 1).padStart(2, '0')}
                                </p>
                                <h2 className="mt-5 max-w-sm font-condensed text-4xl leading-[0.9] font-semibold tracking-[-0.03em] text-teal uppercase">
                                    {location.name}
                                </h2>
                                <div className="mt-6 flex gap-3 text-[13px] leading-5 text-body">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <p>{location.address}</p>
                                </div>
                                <div className="mt-3 flex gap-3 text-[13px] leading-5 text-body">
                                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <p>+{location.whatsapp}</p>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href={location.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 border border-teal px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase transition-colors hover:bg-teal hover:text-white"
                                >
                                    Google Maps{' '}
                                    <ExternalLink className="size-3" />
                                </a>
                                <a
                                    href={`https://wa.me/${location.whatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 border border-primary px-4 py-2 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase transition-colors hover:bg-primary"
                                >
                                    WhatsApp{' '}
                                    <MessageCircle className="size-3" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}

function LocationMap({
    markerIcon,
    modules,
}: {
    markerIcon: DivIcon;
    modules: ReactLeafletModules;
}) {
    const { MapContainer, Marker, Popup, TileLayer } = modules;

    return (
        <MapContainer
            center={mapCenter}
            zoom={10}
            scrollWheelZoom
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBounds modules={modules} />
            {storeLocations.map((location) => (
                <Marker
                    key={location.id}
                    icon={markerIcon}
                    position={[location.latitude, location.longitude]}
                >
                    <Popup>
                        <div className="min-w-48 text-sm text-teal">
                            <p className="font-semibold">{location.name}</p>
                            <p className="mt-1 text-xs leading-4">
                                {location.address}
                            </p>
                            <a
                                href={location.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block text-xs font-semibold underline"
                            >
                                Open Google Maps
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

function MapBounds({ modules }: { modules: ReactLeafletModules }) {
    const map = modules.useMap() as LeafletMap;

    useEffect(() => {
        map.fitBounds(
            storeLocations.map((location) => [
                location.latitude,
                location.longitude,
            ]),
            { padding: [40, 40], maxZoom: 14 },
        );
    }, [map]);

    return null;
}
