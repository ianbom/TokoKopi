import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index, store, update } from '@/routes/admin/stories';

type Story = {
    id: number;
    title: string;
    slug: string;
    category: string;
    author_name: string;
    excerpt: string;
    body_html: string;
    status: 'draft' | 'published';
    cover_image_url: string;
    pull_quote: string | null;
    quote_attribution: string | null;
    cover_caption: string | null;
};
type Props = { mode: 'create' | 'edit'; story: Story | null };
const slugify = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 180);

export default function StoryForm({ mode, story }: Props) {
    const form = useForm({
        title: story?.title ?? '',
        slug: story?.slug ?? '',
        category: story?.category ?? '',
        author_name: story?.author_name ?? 'Deklase',
        excerpt: story?.excerpt ?? '',
        body_html: story?.body_html ?? '',
        pull_quote: story?.pull_quote ?? '',
        quote_attribution: story?.quote_attribution ?? '',
        cover_caption: story?.cover_caption ?? '',
        status: story?.status ?? 'draft',
        cover_image: null as File | null,
    });
    const preview = useMemo(
        () =>
            form.data.cover_image
                ? URL.createObjectURL(form.data.cover_image)
                : story?.cover_image_url,
        [form.data.cover_image, story?.cover_image_url],
    );
    useEffect(
        () => () => {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        },
        [preview],
    );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) =>
            mode === 'edit' ? { ...data, _method: 'put' } : data,
        );
        form.post(mode === 'edit' ? update.url(story!.id) : store.url(), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={mode === 'edit' ? 'Edit Story' : 'Story Baru'} />
            <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Konten Deklase
                        </p>
                        <h1 className="font-serif text-3xl">
                            {mode === 'edit' ? 'Edit Story' : 'Story Baru'}
                        </h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={index()}>
                            <ArrowLeft /> Kembali
                        </Link>
                    </Button>
                </header>
                <form
                    onSubmit={submit}
                    className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
                >
                    <div className="min-w-0 space-y-5 border bg-canvas p-5">
                        <div className="grid gap-2">
                            <Label htmlFor="story-title">Judul</Label>
                            <Input
                                id="story-title"
                                maxLength={180}
                                required
                                value={form.data.title}
                                onChange={(event) => {
                                    const title = event.target.value;
                                    form.setData({
                                        ...form.data,
                                        title,
                                        slug:
                                            form.data.slug ===
                                            slugify(form.data.title)
                                                ? slugify(title)
                                                : form.data.slug,
                                    });
                                }}
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-slug">Slug</Label>
                            <Input
                                id="story-slug"
                                maxLength={180}
                                required
                                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                                value={form.data.slug}
                                onChange={(event) =>
                                    form.setData('slug', event.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Huruf kecil, angka, dan tanda hubung. Digunakan
                                pada URL story.
                            </p>
                            <InputError message={form.errors.slug} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-excerpt">Ringkasan</Label>
                            <textarea
                                id="story-excerpt"
                                required
                                maxLength={1000}
                                value={form.data.excerpt}
                                onChange={(event) =>
                                    form.setData('excerpt', event.target.value)
                                }
                                className="min-h-28 w-full border bg-canvas px-3 py-2 text-sm"
                            />
                            <InputError message={form.errors.excerpt} />
                        </div>
                        <div className="grid gap-2">
                            <h2 className="text-sm font-medium">Isi story</h2>
                            <RichTextEditor
                                content={form.data.body_html}
                                onChange={(html) =>
                                    form.setData('body_html', html)
                                }
                                placeholder="Tulis cerita kopi Deklase di sini."
                            />
                            <InputError message={form.errors.body_html} />
                        </div>
                        <div className="grid gap-2 border-t pt-5">
                            <Label htmlFor="story-quote">
                                Kutipan editorial (opsional)
                            </Label>
                            <textarea
                                id="story-quote"
                                maxLength={500}
                                rows={4}
                                value={form.data.pull_quote}
                                onChange={(event) =>
                                    form.setData(
                                        'pull_quote',
                                        event.target.value,
                                    )
                                }
                                className="w-full border bg-canvas px-3 py-2 text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Ditampilkan sebagai sorotan di bawah foto
                                sampul. Kosongkan untuk menyembunyikannya.
                            </p>
                            <InputError message={form.errors.pull_quote} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-attribution">
                                Sumber kutipan (opsional)
                            </Label>
                            <Input
                                id="story-attribution"
                                maxLength={120}
                                value={form.data.quote_attribution}
                                onChange={(event) =>
                                    form.setData(
                                        'quote_attribution',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={form.errors.quote_attribution}
                            />
                        </div>
                    </div>
                    <aside className="space-y-5 border bg-canvas p-5">
                        <div className="grid gap-2">
                            <Label htmlFor="story-category">Kategori</Label>
                            <Input
                                id="story-category"
                                maxLength={100}
                                required
                                placeholder="Contoh: Brewing"
                                value={form.data.category}
                                onChange={(event) =>
                                    form.setData('category', event.target.value)
                                }
                            />
                            <InputError message={form.errors.category} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-author">Penulis</Label>
                            <Input
                                id="story-author"
                                maxLength={100}
                                required
                                value={form.data.author_name}
                                onChange={(event) =>
                                    form.setData(
                                        'author_name',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={form.errors.author_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-status">Status</Label>
                            <select
                                id="story-status"
                                value={form.data.status}
                                onChange={(event) =>
                                    form.setData(
                                        'status',
                                        event.target.value as
                                            | 'draft'
                                            | 'published',
                                    )
                                }
                                className="h-9 border bg-canvas px-3 text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            <p className="text-xs text-muted-foreground">
                                Published langsung tampil di halaman Story.
                            </p>
                            <InputError message={form.errors.status} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-cover">Gambar sampul</Label>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Pratinjau sampul story"
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            )}
                            <Input
                                id="story-cover"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                required={mode === 'create'}
                                onChange={(event) =>
                                    form.setData(
                                        'cover_image',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, atau WebP. Maksimal 4 MB.
                            </p>
                            <InputError message={form.errors.cover_image} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="story-caption">
                                Keterangan foto (opsional)
                            </Label>
                            <Input
                                id="story-caption"
                                maxLength={255}
                                value={form.data.cover_caption}
                                onChange={(event) =>
                                    form.setData(
                                        'cover_caption',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={form.errors.cover_caption} />
                        </div>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="w-full"
                        >
                            <Save />{' '}
                            {form.processing ? 'Menyimpan…' : 'Simpan Story'}
                        </Button>
                    </aside>
                </form>
            </main>
        </>
    );
}
