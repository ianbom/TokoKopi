import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/pages/admin/catalog/shared';
import type { Paginated } from '@/pages/admin/catalog/shared';
import { create, destroy, edit, index } from '@/routes/admin/stories';
import { show } from '@/routes/story';

type StoryRow = {
    id: number;
    title: string;
    slug: string;
    category: string;
    author_name: string;
    status: string;
    cover_image_url: string;
    published_at: string | null;
};
type Props = {
    stories: Paginated<StoryRow>;
    categories: string[];
    filters: Record<string, string>;
    stats: { total: number; published: number; draft: number };
};

export default function StoriesIndex({
    stories,
    categories,
    filters,
    stats,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const apply = (next: Record<string, string>) =>
        router.get(
            index.url({
                query: {
                    ...filters,
                    per_page: stories.per_page ?? 10,
                    ...next,
                },
            }),
            {},
            { preserveState: true, replace: true },
        );

    return (
        <>
            <Head title="Stories" />
            <main className="space-y-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Pemasaran & Konten
                        </p>
                        <h1 className="font-serif text-3xl">Stories</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola cerita kopi, panduan seduh, dan kabar
                            Deklase.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus /> Story Baru
                        </Link>
                    </Button>
                </header>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {Object.entries(stats).map(([label, value]) => (
                        <div key={label} className="border bg-canvas p-4">
                            <p className="text-xs text-muted-foreground capitalize">
                                {label}
                            </p>
                            <p className="text-2xl font-semibold">{value}</p>
                        </div>
                    ))}
                </div>
                <form
                    className="flex flex-wrap gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        apply({ search, page: '1' });
                    }}
                >
                    <Input
                        aria-label="Cari story"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari judul story"
                        className="max-w-sm"
                    />
                    <select
                        aria-label="Kategori"
                        value={filters.category ?? ''}
                        onChange={(event) =>
                            apply({ category: event.target.value, page: '1' })
                        }
                        className="h-9 max-w-full border bg-canvas px-3"
                    >
                        <option value="">Semua kategori</option>
                        {categories.map((category) => (
                            <option key={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        aria-label="Status"
                        value={filters.status ?? ''}
                        onChange={(event) =>
                            apply({ status: event.target.value, page: '1' })
                        }
                        className="h-9 border bg-canvas px-3"
                    >
                        <option value="">Semua status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <Button type="submit" variant="outline">
                        <Search /> Cari
                    </Button>
                </form>
                <div className="overflow-x-auto border bg-canvas">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-surface-soft text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="p-3">Story</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Penulis</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Publikasi</th>
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.data.map((story) => (
                                <tr
                                    key={story.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="p-3">
                                        <div className="flex min-w-56 items-center gap-3">
                                            <img
                                                src={story.cover_image_url}
                                                alt=""
                                                className="size-10 shrink-0 object-cover"
                                            />
                                            <Link
                                                href={edit(story.id)}
                                                className="font-semibold hover:text-primary"
                                            >
                                                {story.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="p-3">{story.category}</td>
                                    <td className="p-3">{story.author_name}</td>
                                    <td className="p-3 capitalize">
                                        {story.status}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {story.published_at?.slice(0, 10) ??
                                            '—'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            {story.status === 'published' && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Link
                                                        href={show(story.slug)}
                                                    >
                                                        Lihat
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link href={edit(story.id)}>
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            'Hapus story ini beserta gambar sampulnya?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            destroy.url(
                                                                story.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {stories.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-muted-foreground"
                                    >
                                        Story tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={stories} />
            </main>
        </>
    );
}
