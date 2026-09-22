import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import homeSettings from '@/routes/admin/home-settings';

type Slide = {
    image_url: string;
    alt_text: string;
    sort_order: number;
    is_active: boolean;
    image: File | null;
};

type Props = {
    welcomeText: string;
    slides: Omit<Slide, 'image'>[];
};

const newSlide = (sortOrder: number): Slide => ({
    image_url: '',
    alt_text: '',
    sort_order: sortOrder,
    is_active: true,
    image: null,
});

export default function HomeSettingsIndex({ welcomeText, slides }: Props) {
    const form = useForm({
        _method: 'PUT',
        welcome_text: welcomeText,
        slides: slides.map((slide) => ({ ...slide, image: null })) as Slide[],
    });

    const updateSlide = (index: number, changes: Partial<Slide>) => {
        form.setData(
            'slides',
            form.data.slides.map((slide, slideIndex) =>
                slideIndex === index ? { ...slide, ...changes } : slide,
            ),
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(homeSettings.update.url(), { forceFormData: true });
    };

    return (
        <>
            <Head title="Home Setting" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Content management
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Home Setting
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Atur judul dan carousel hero pada halaman utama.
                    </p>
                </div>

                <form onSubmit={submit} className="grid max-w-5xl gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome text</CardTitle>
                            <CardDescription>
                                Gunakan baris baru untuk mengatur pemenggalan
                                judul.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Label htmlFor="welcome_text">Hero heading</Label>
                            <Textarea
                                id="welcome_text"
                                rows={4}
                                value={form.data.welcome_text}
                                onChange={(event) =>
                                    form.setData(
                                        'welcome_text',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={form.errors.welcome_text} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Welcome carousel</CardTitle>
                                <CardDescription>
                                    Upload gambar hero, atur urutan, lalu
                                    aktifkan slide yang tampil.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    form.setData('slides', [
                                        ...form.data.slides,
                                        newSlide(form.data.slides.length + 1),
                                    ])
                                }
                            >
                                <Plus /> Tambah slide
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <InputError message={form.errors.slides} />
                            {form.data.slides.map((slide, index) => (
                                <div
                                    key={`${slide.image_url}-${index}`}
                                    className="grid gap-4 border p-4 md:grid-cols-[11rem_minmax(0,1fr)]"
                                >
                                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted">
                                        {slide.image_url ? (
                                            <img
                                                src={slide.image_url}
                                                alt={
                                                    slide.alt_text ||
                                                    'Carousel preview'
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImagePlus className="size-7 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="grid gap-2">
                                            <Label>Gambar</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) =>
                                                    updateSlide(index, {
                                                        image:
                                                            event.target
                                                                .files?.[0] ??
                                                            null,
                                                    })
                                                }
                                            />
                                            <InputError
                                                message={
                                                    form.errors[
                                                        `slides.${index}.image`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Alt text</Label>
                                            <Input
                                                value={slide.alt_text}
                                                onChange={(event) =>
                                                    updateSlide(index, {
                                                        alt_text:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            <InputError
                                                message={
                                                    form.errors[
                                                        `slides.${index}.alt_text`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-wrap items-end gap-4">
                                            <div className="grid gap-2">
                                                <Label>Urutan</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    className="w-24"
                                                    value={slide.sort_order}
                                                    onChange={(event) =>
                                                        updateSlide(index, {
                                                            sort_order: Number(
                                                                event.target
                                                                    .value,
                                                            ),
                                                        })
                                                    }
                                                />
                                            </div>
                                            <label className="flex h-10 items-center gap-2 text-sm font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={slide.is_active}
                                                    onChange={(event) =>
                                                        updateSlide(index, {
                                                            is_active:
                                                                event.target
                                                                    .checked,
                                                        })
                                                    }
                                                />
                                                Aktif
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    form.setData(
                                                        'slides',
                                                        form.data.slides.filter(
                                                            (_, slideIndex) =>
                                                                slideIndex !==
                                                                index,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Trash2 /> Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing}>
                            <Save /> Simpan perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
