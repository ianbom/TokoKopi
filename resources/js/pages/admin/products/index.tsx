import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/pages/admin/catalog/shared';
import { create, destroy, edit, index, show } from '@/routes/admin/products';

type Product = {
    id: number;
    name: string;
    sku: string | null;
    categories: string[];
    thumbnail: string | null;
    minimum_price: number;
    total_stock: number;
    variants_count: number;
    status: string;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    created_at: string | null;
};
type Props = {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
        per_page?: number;
    };
    filters: Record<string, string>;
    options: { categories: { id: number; name: string }[]; statuses: string[] };
    stats: {
        total: number;
        active: number;
        draft: number;
        archived: number;
        low_stock: number;
        out_of_stock: number;
    };
};
const money = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

export default function ProductsIndex({
    products,
    filters,
    options,
    stats,
}: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const apply = (next: Record<string, string>) =>
        router.get(
            index.url({ query: { ...filters, ...next } }),
            {},
            { preserveState: true, replace: true },
        );

    return (
        <>
            <Head title="Produk" />
            <main className="space-y-6 p-6">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog
                        </p>
                        <h1 className="font-serif text-3xl">Produk Kopi</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola produk, kategori, varian, dan stok kopi.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus /> Produk Baru
                        </Link>
                    </Button>
                </header>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
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
                        placeholder="Cari nama atau SKU"
                        className="max-w-sm"
                    />
                    <select
                        value={filters.category_id ?? ''}
                        onChange={(event) =>
                            apply({
                                category_id: event.target.value,
                                page: '1',
                            })
                        }
                        className="border bg-canvas px-3"
                    >
                        <option value="">Semua kategori</option>
                        {options.categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.status ?? ''}
                        onChange={(event) =>
                            apply({ status: event.target.value, page: '1' })
                        }
                        className="border bg-canvas px-3"
                    >
                        <option value="">Semua status</option>
                        {options.statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" variant="outline">
                        <Search /> Cari
                    </Button>
                </form>
                <div className="overflow-x-auto border">
                    <table className="admin-table w-full min-w-[760px] text-sm">
                        <thead className="border-b bg-surface-soft text-left">
                            <tr>
                                <th className="p-3">Produk</th>
                                <th>Kategori</th>
                                <th>Harga mulai</th>
                                <th>Varian</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr key={product.id} className="border-b">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {product.thumbnail && (
                                                <img
                                                    src={product.thumbnail}
                                                    alt=""
                                                    className="size-10 object-cover"
                                                />
                                            )}
                                            <div>
                                                <Link
                                                    href={show(product)}
                                                    className="font-semibold hover:text-primary"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.sku ?? '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {product.categories.join(', ') || '-'}
                                    </td>
                                    <td>{money(product.minimum_price)}</td>
                                    <td>{product.variants_count}</td>
                                    <td>{product.total_stock}</td>
                                    <td className="capitalize">
                                        {product.status}
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={edit(product)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.delete(
                                                    destroy.url(product),
                                                )
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-muted-foreground"
                                    >
                                        Produk tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={products} />
            </main>
        </>
    );
}
