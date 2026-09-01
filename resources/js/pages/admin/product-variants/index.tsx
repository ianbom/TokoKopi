import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/pages/admin/catalog/shared';
import {
    create,
    destroy,
    edit,
    stockAdjustment,
} from '@/routes/admin/product-variants';
type Variant = {
    id: number;
    product: string | null;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    regular_price: string;
    sale_price: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
};
type Props = {
    variants: {
        data: Variant[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
        per_page?: number;
    };
    product: { id: number; name: string } | null;
    stats: Record<string, number>;
};
export default function ProductVariantsIndex({
    variants,
    product,
    stats,
}: Props) {
    return (
        <>
            <Head title="Varian Produk" />
            <main className="space-y-6 p-6">
                <header className="flex justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog
                        </p>
                        <h1 className="font-serif text-3xl">
                            {product
                                ? `Varian ${product.name}`
                                : 'Varian Produk'}
                        </h1>
                    </div>
                    <Button asChild>
                        <Link
                            href={create(
                                product
                                    ? { query: { product_id: product.id } }
                                    : undefined,
                            )}
                        >
                            <Plus /> Varian Baru
                        </Link>
                    </Button>
                </header>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="border p-4">
                            <p className="text-xs text-muted-foreground">
                                {key.replace('_', ' ')}
                            </p>
                            <p className="text-2xl font-semibold">{value}</p>
                        </div>
                    ))}
                </div>
                <div className="overflow-x-auto border">
                    <table className="admin-table w-full min-w-[720px] text-sm">
                        <thead className="border-b bg-surface-soft text-left">
                            <tr>
                                <th className="p-3">Produk / SKU</th>
                                <th>Berat</th>
                                <th>Gilingan</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {variants.data.map((variant) => (
                                <tr key={variant.id} className="border-b">
                                    <td className="p-3">
                                        <b>{variant.product}</b>
                                        <p className="text-xs text-muted-foreground">
                                            {variant.sku}
                                        </p>
                                    </td>
                                    <td>{variant.net_weight ?? '-'}</td>
                                    <td>{variant.grind_type ?? '-'}</td>
                                    <td>
                                        Rp{' '}
                                        {Number(
                                            variant.sale_price ??
                                                variant.regular_price,
                                        ).toLocaleString('id-ID')}
                                    </td>
                                    <td>
                                        {variant.stock_quantity} / min{' '}
                                        {variant.low_stock_threshold}
                                    </td>
                                    <td>
                                        {variant.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link
                                                href={stockAdjustment(variant)}
                                            >
                                                Stok
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={edit(variant)}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                router.delete(
                                                    destroy.url(variant),
                                                )
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={variants} />
            </main>
        </>
    );
}
