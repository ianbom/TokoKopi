import { Head, Link, router } from '@inertiajs/react';
import { Archive, ArrowLeft, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as variantsIndex } from '@/routes/admin/product-variants';
import {
    archive,
    destroy,
    edit,
    index,
    publish,
} from '@/routes/admin/products';

type Image = {
    id: number;
    image_url: string | null;
    alt_text: string | null;
    is_primary: boolean;
};
type Variant = {
    id: number;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    regular_price: string | number;
    sale_price: string | number | null;
    shipping_weight_gram: number;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
};
type Product = {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    origin: string | null;
    process: string | null;
    description: string | null;
    status: string;
    is_featured: boolean;
    is_new_arrival: boolean;
    is_best_seller: boolean;
    categories: string[];
    images: Image[];
    variants: Variant[];
    total_stock: number;
    order_items_count: number;
    created_at: string | null;
    updated_at: string | null;
};

const money = (value: string | number | null) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
export default function ProductShow({ product }: { product: Product }) {
    const action = (url: string, method: 'post' | 'delete') =>
        router[method](url, {}, { preserveScroll: true });

    return (
        <>
            <Head title={product.name} />
            <main className="mx-auto max-w-6xl space-y-6 p-6">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog kopi
                        </p>
                        <h1 className="font-serif text-4xl">{product.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {product.sku ?? '-'} ·{' '}
                            {product.categories.join(', ') || 'Tanpa kategori'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={index()}>
                                <ArrowLeft /> Kembali
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={edit(product)}>
                                <Pencil /> Edit
                            </Link>
                        </Button>
                        {product.status !== 'active' && (
                            <Button
                                onClick={() =>
                                    action(publish.url(product), 'post')
                                }
                            >
                                <CheckCircle2 /> Aktifkan
                            </Button>
                        )}
                        {product.status !== 'archived' && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    action(archive.url(product), 'post')
                                }
                            >
                                <Archive /> Arsipkan
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="text-red-600"
                            onClick={() =>
                                confirm(`Hapus ${product.name}?`) &&
                                action(destroy.url(product), 'delete')
                            }
                        >
                            <Trash2 /> Hapus
                        </Button>
                    </div>
                </header>
                <section className="grid gap-4 md:grid-cols-[280px_1fr]">
                    <div className="border bg-canvas p-3">
                        {product.images[0]?.image_url ? (
                            <img
                                src={product.images[0].image_url}
                                alt={product.images[0].alt_text ?? product.name}
                                className="aspect-square w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
                                Belum ada gambar
                            </div>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Metric label="Status" value={product.status} />
                        <Metric
                            label="Total stok"
                            value={product.total_stock}
                        />
                        <Metric
                            label="Varian"
                            value={product.variants.length}
                        />
                        <Metric
                            label="Terjual"
                            value={product.order_items_count}
                        />
                        <Metric label="Origin" value={product.origin ?? '-'} />
                        <Metric
                            label="Process"
                            value={product.process ?? '-'}
                        />
                        <Metric
                            label="Featured"
                            value={product.is_featured ? 'Ya' : 'Tidak'}
                        />
                        <Metric
                            label="Dibuat"
                            value={product.created_at ?? '-'}
                        />
                    </div>
                </section>
                <section className="space-y-4 border bg-canvas p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Varian</h2>
                        <Button asChild variant="outline">
                            <Link
                                href={variantsIndex({
                                    query: { product_id: product.id },
                                })}
                            >
                                Kelola varian
                            </Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="admin-table w-full min-w-[760px] text-sm">
                            <thead className="border-b text-left">
                                <tr>
                                    <th className="p-3">SKU</th>
                                    <th>Berat</th>
                                    <th>Gilingan</th>
                                    <th>Harga</th>
                                    <th>Stok</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variants.map((variant) => (
                                    <tr key={variant.id} className="border-b">
                                        <td className="p-3 font-medium">
                                            {variant.sku}
                                        </td>
                                        <td>{variant.net_weight ?? '-'}</td>
                                        <td>{variant.grind_type ?? '-'}</td>
                                        <td>
                                            {money(
                                                variant.sale_price ??
                                                    variant.regular_price,
                                            )}
                                        </td>
                                        <td>
                                            {variant.stock_quantity}{' '}
                                            <span className="text-xs text-muted-foreground">
                                                / min{' '}
                                                {variant.low_stock_threshold}
                                            </span>
                                        </td>
                                        <td>
                                            {variant.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                {product.description && (
                    <section className="border bg-canvas p-5">
                        <h2 className="font-semibold">Deskripsi</h2>
                        <p className="mt-3 text-sm whitespace-pre-wrap text-muted-foreground">
                            {product.description}
                        </p>
                    </section>
                )}
            </main>
        </>
    );
}
function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 truncate text-lg font-semibold capitalize">
                {value}
            </p>
        </div>
    );
}
