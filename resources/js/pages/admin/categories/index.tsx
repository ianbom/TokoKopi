import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/pages/admin/catalog/shared';
import { create, destroy, edit, index } from '@/routes/admin/categories';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    products_count: number;
    created_at: string | null;
};

type Categories = {
    data: Category[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
    per_page?: number;
};

type Props = {
    categories: Categories;
    filters: Record<string, string>;
    stats: { total: number; active: number; inactive: number };
};

export default function CategoriesIndex({ categories, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const apply = (next: Record<string, string>) =>
        router.get(
            index.url({ query: { ...filters, ...next } }),
            {},
            { preserveState: true, replace: true },
        );

    return (
        <>
            <Head title="Kategori" />
            <main className="space-y-6 p-6">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog
                        </p>
                        <h1 className="font-serif text-3xl">Kategori Produk</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori dan visibilitas produk kopi.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus /> Kategori Baru
                        </Link>
                    </Button>
                </header>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {Object.entries(stats).map(([label, value]) => (
                        <div key={label} className="border bg-canvas p-4">
                            <p className="text-xs text-muted-foreground">
                                {label.replace('_', ' ')}
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
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama atau slug"
                        className="max-w-sm"
                    />
                    <select
                        value={filters.status ?? ''}
                        onChange={(event) =>
                            apply({ status: event.target.value, page: '1' })
                        }
                        className="border bg-canvas px-3"
                    >
                        <option value="">Semua status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                    <Button type="submit" variant="outline">
                        <Search /> Cari
                    </Button>
                </form>

                <div className="overflow-x-auto border">
                    <table className="admin-table w-full min-w-[760px] text-sm">
                        <thead className="border-b bg-surface-soft text-left">
                            <tr>
                                <th className="p-3">Kategori</th>
                                <th>Slug</th>
                                <th>Produk</th>
                                <th>Status</th>
                                <th>Dibuat</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.map((category) => (
                                <tr key={category.id} className="border-b">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {category.image_url && (
                                                <img
                                                    src={category.image_url}
                                                    alt=""
                                                    className="size-10 object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold">
                                                    {category.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {category.description ??
                                                        '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{category.slug}</td>
                                    <td>{category.products_count}</td>
                                    <td className="capitalize">
                                        {category.is_active
                                            ? 'active'
                                            : 'inactive'}
                                    </td>
                                    <td>{category.created_at ?? '-'}</td>
                                    <td className="p-3 text-right">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={edit(category)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.delete(
                                                    destroy.url(category),
                                                )
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {categories.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-muted-foreground"
                                    >
                                        Kategori tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={categories} />
            </main>
        </>
    );
}
