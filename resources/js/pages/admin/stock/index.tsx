import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/pages/admin/catalog/shared';
import { stockAdjustment } from '@/routes/admin/product-variants';
type Variant = {
    id: number;
    product: string | null;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    quantity: number;
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
    stats: Record<string, number>;
};
export default function StockIndex({ variants, stats }: Props) {
    return (
        <>
            <Head title="Stok" />
            <main className="space-y-6 p-6">
                <header>
                    <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                        Inventory
                    </p>
                    <h1 className="font-serif text-3xl">Stok Varian</h1>
                    <p className="text-sm text-muted-foreground">
                        Stok aktual berasal dari tabel stocks.
                    </p>
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
                    <table className="admin-table w-full min-w-[660px] text-sm">
                        <thead className="border-b bg-surface-soft text-left">
                            <tr>
                                <th className="p-3">Produk</th>
                                <th>SKU</th>
                                <th>Varian</th>
                                <th>Stok</th>
                                <th>Minimum</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {variants.data.map((variant) => (
                                <tr key={variant.id} className="border-b">
                                    <td className="p-3">{variant.product}</td>
                                    <td>{variant.sku}</td>
                                    <td>
                                        {[
                                            variant.net_weight,
                                            variant.grind_type,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') || '-'}
                                    </td>
                                    <td>{variant.quantity}</td>
                                    <td>{variant.low_stock_threshold}</td>
                                    <td>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link
                                                href={stockAdjustment(variant)}
                                            >
                                                Atur stok
                                            </Link>
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
