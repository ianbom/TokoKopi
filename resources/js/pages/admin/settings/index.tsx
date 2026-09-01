import { Head, Link, useForm } from '@inertiajs/react';
import type {
    Icon,
    LatLng,
    LeafletMouseEvent,
    Map as LeafletMap,
} from 'leaflet';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type * as ReactLeaflet from 'react-leaflet';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import settings from '@/routes/admin/settings/index';

type SettingField = {
    key: string;
    label: string;
    type: string;
    input?: 'email' | 'number' | 'select' | 'textarea' | 'url';
    options?: string[];
};

type SettingSection = {
    title: string;
    description: string;
    fields: SettingField[];
};

type Props = {
    activeSection: string;
    sections: Record<string, SettingSection>;
    values: Record<string, string | null>;
};

const sectionLinks: Record<string, string> = {
    store: settings.store.url(),
    payment: settings.payment.url(),
    shipping: settings.shipping.url(),
};

const DEFAULT_MAP_CENTER: [number, number] = [-8.092497, 112.1801619];

const validCoordinates = (latitude: number, longitude: number): boolean =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

const hasCoordinateValues = (latitude: string, longitude: string): boolean =>
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    validCoordinates(Number(latitude), Number(longitude));

type ReactLeafletModules = {
    MapContainer: typeof ReactLeaflet.MapContainer;
    Marker: typeof ReactLeaflet.Marker;
    TileLayer: typeof ReactLeaflet.TileLayer;
    useMap: typeof ReactLeaflet.useMap;
    useMapEvents: typeof ReactLeaflet.useMapEvents;
};

export default function AdminSettingsIndex({
    activeSection,
    sections,
    values,
}: Props) {
    const current = sections[activeSection];
    const initialData = current.fields.reduce<Record<string, string>>(
        (carry, field) => {
            carry[field.key] = values[field.key] ?? '';

            return carry;
        },
        {},
    );

    const { data, setData, put, processing, errors, recentlySuccessful } =
        useForm<Record<string, string>>(initialData);
    const visibleFields = current.fields.filter(
        (field) =>
            field.key !== 'store_latitude' && field.key !== 'store_longitude',
    );
    const latitude = data.store_latitude ?? '';
    const longitude = data.store_longitude ?? '';
    const hasStoreCoordinates = hasCoordinateValues(latitude, longitude);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(settings.update.url(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Admin Settings" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Settings
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {current.title}
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            {current.description}
                        </p>
                    </div>

                    {recentlySuccessful ? (
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                            Settings tersimpan
                        </span>
                    ) : null}
                </div>

                <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <Card className="h-fit py-3">
                        <CardContent className="flex flex-col gap-1 px-3">
                            {Object.entries(sections).map(([key, section]) => (
                                <Button
                                    key={key}
                                    asChild
                                    variant={
                                        key === activeSection
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    className={cn(
                                        'justify-start',
                                        key === activeSection &&
                                            'bg-primary/10 text-primary hover:bg-primary/15',
                                    )}
                                >
                                    <Link
                                        href={
                                            sectionLinks[key] ??
                                            '/admin/settings'
                                        }
                                    >
                                        {section.title}
                                    </Link>
                                </Button>
                            ))}
                            <Button
                                asChild
                                variant="ghost"
                                className="justify-start"
                            >
                                <Link href="/admin/admin-users">
                                    Admin Users
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{current.title}</CardTitle>
                            <CardDescription>
                                Sensitive API keys seperti Midtrans server key
                                dan Biteship API key tetap dikelola dari file
                                environment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-5 md:grid-cols-2">
                                    {visibleFields.map((field) => (
                                        <div
                                            key={field.key}
                                            className={cn(
                                                'grid gap-2',
                                                field.input === 'textarea' &&
                                                    'md:col-span-2',
                                            )}
                                        >
                                            <Label htmlFor={field.key}>
                                                {field.label}
                                            </Label>

                                            {field.input === 'textarea' ? (
                                                <textarea
                                                    id={field.key}
                                                    value={
                                                        data[field.key] ?? ''
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            field.key,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                />
                                            ) : field.input === 'select' ? (
                                                <select
                                                    id={field.key}
                                                    value={
                                                        data[field.key] ?? ''
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            field.key,
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                >
                                                    <option value="">
                                                        Select option
                                                    </option>
                                                    {field.options?.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            ) : (
                                                <Input
                                                    id={field.key}
                                                    type={field.input ?? 'text'}
                                                    value={
                                                        data[field.key] ?? ''
                                                    }
                                                    onChange={(event) =>
                                                        setData(
                                                            field.key,
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            )}

                                            <InputError
                                                message={errors[field.key]}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {activeSection === 'store' && (
                                    <LocationPicker
                                        error={
                                            errors.store_latitude ??
                                            errors.store_longitude
                                        }
                                        latitude={latitude}
                                        longitude={longitude}
                                        onChange={(
                                            nextLatitude,
                                            nextLongitude,
                                        ) => {
                                            setData(
                                                'store_latitude',
                                                nextLatitude.toFixed(7),
                                            );
                                            setData(
                                                'store_longitude',
                                                nextLongitude.toFixed(7),
                                            );
                                        }}
                                    />
                                )}

                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/admin/dashboard">
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            (activeSection === 'store' &&
                                                !hasStoreCoordinates)
                                        }
                                    >
                                        <Save />
                                        {processing
                                            ? 'Saving...'
                                            : 'Save Settings'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

type LocationPickerProps = {
    latitude: string;
    longitude: string;
    error?: string;
    onChange: (latitude: number, longitude: number) => void;
};

function LocationPicker({
    latitude,
    longitude,
    error,
    onChange,
}: LocationPickerProps) {
    const [modules, setModules] = useState<ReactLeafletModules | null>(null);
    const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
    const [loadError, setLoadError] = useState(false);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const hasCoordinates = hasCoordinateValues(latitude, longitude);
    const position: [number, number] = hasCoordinates
        ? [parsedLatitude, parsedLongitude]
        : DEFAULT_MAP_CENTER;

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
                    leaflet.icon({
                        iconUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconRetinaUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                        shadowUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    }),
                );
                setModules({
                    MapContainer: reactLeaflet.MapContainer,
                    Marker: reactLeaflet.Marker,
                    TileLayer: reactLeaflet.TileLayer,
                    useMap: reactLeaflet.useMap,
                    useMapEvents: reactLeaflet.useMapEvents,
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
        <div className="grid gap-4 border-t pt-6 md:col-span-2">
            <div>
                <Label>Store Location</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                    Klik peta untuk menetapkan pin, atau drag pin yang sudah
                    ada.
                </p>
            </div>

            <div className="overflow-hidden rounded-md border bg-muted/20">
                {modules && markerIcon ? (
                    <ClientMap
                        hasCoordinates={hasCoordinates}
                        markerIcon={markerIcon}
                        modules={modules}
                        onChange={onChange}
                        position={position}
                    />
                ) : (
                    <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
                        {loadError ? 'Peta gagal dimuat.' : 'Memuat peta...'}
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <CoordinateInput
                    id="store_latitude"
                    label="Latitude"
                    max={90}
                    min={-90}
                    value={latitude}
                />
                <CoordinateInput
                    id="store_longitude"
                    label="Longitude"
                    max={180}
                    min={-180}
                    value={longitude}
                />
            </div>

            {!hasCoordinates && (
                <p className="text-sm font-medium text-amber-700">
                    Tetapkan pin di peta sebelum menyimpan lokasi toko.
                </p>
            )}
            <InputError message={error} />
        </div>
    );
}

function CoordinateInput({
    id,
    label,
    max,
    min,
    value,
}: {
    id: string;
    label: string;
    max: number;
    min: number;
    value: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                max={max}
                min={min}
                readOnly
                step="any"
                type="number"
                value={value}
            />
        </div>
    );
}

function ClientMap({
    hasCoordinates,
    markerIcon,
    modules,
    onChange,
    position,
}: {
    hasCoordinates: boolean;
    markerIcon: Icon;
    modules: ReactLeafletModules;
    onChange: (latitude: number, longitude: number) => void;
    position: [number, number];
}) {
    const { MapContainer, Marker, TileLayer } = modules;
    const zoom = hasCoordinates ? 17 : 12;

    return (
        <MapContainer
            center={position}
            className="h-[360px] w-full"
            scrollWheelZoom
            zoom={zoom}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={position} modules={modules} zoom={zoom} />
            <MapClickHandler modules={modules} onChange={onChange} />
            {hasCoordinates && (
                <Marker
                    draggable
                    eventHandlers={{
                        dragend: (event) => {
                            const nextPosition =
                                event.target.getLatLng() as LatLng;

                            onChange(nextPosition.lat, nextPosition.lng);
                        },
                    }}
                    icon={markerIcon}
                    position={position}
                />
            )}
        </MapContainer>
    );
}

function MapUpdater({
    center,
    modules,
    zoom,
}: {
    center: [number, number];
    modules: ReactLeafletModules;
    zoom: number;
}) {
    const map = modules.useMap() as LeafletMap;

    useEffect(() => {
        map.invalidateSize();
        map.setView(center, zoom);
    }, [center, map, zoom]);

    return null;
}

function MapClickHandler({
    modules,
    onChange,
}: {
    modules: ReactLeafletModules;
    onChange: (latitude: number, longitude: number) => void;
}) {
    modules.useMapEvents({
        click: (event: LeafletMouseEvent) => {
            onChange(event.latlng.lat, event.latlng.lng);
        },
    });

    return null;
}
