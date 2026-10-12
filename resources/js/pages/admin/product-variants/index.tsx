import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    sku: string | null;
    net_weight: string | null;
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
    const [variantToDelete, setVariantToDelete] = useState<Variant | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

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
                    <table className="admin-table w-full min-w-[820px] text-sm">
                        <thead className="border-b bg-surface-soft text-left">
                            <tr>
                                <th className="w-14 p-3 text-center">No.</th>
                                <th>Produk / SKU</th>
                                <th>Berat</th>
                                <th className="text-right">Harga</th>
                                <th className="text-right">Stok</th>
                                <th>Status</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.data.map((variant, rowIndex) => (
                                <tr key={variant.id} className="border-b">
                                    <td className="p-3 text-center tabular-nums">
                                        {(variants.from ?? 1) + rowIndex}
                                    </td>
                                    <td className="p-3">
                                        <b>{variant.product}</b>
                                        <p className="text-xs text-muted-foreground">
                                            {variant.sku ?? '-'}
                                        </p>
                                    </td>
                                    <td>{variant.net_weight ?? '-'}</td>
                                    <td className="text-right whitespace-nowrap tabular-nums">
                                        Rp{' '}
                                        {Number(
                                            variant.sale_price ??
                                                variant.regular_price,
                                        ).toLocaleString('id-ID')}
                                    </td>
                                    <td className="text-right whitespace-nowrap tabular-nums">
                                        {variant.stock_quantity} / min{' '}
                                        {variant.low_stock_threshold}
                                    </td>
                                    <td>
                                        {variant.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2 whitespace-nowrap">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={stockAdjustment(
                                                        variant,
                                                    )}
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
                                                variant="destructive"
                                                onClick={() =>
                                                    setVariantToDelete(variant)
                                                }
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination paginator={variants} normalizeNavigationLabels />
            </main>
            <Dialog
                open={variantToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setVariantToDelete(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus varian?</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus varian{' '}
                            {variantToDelete?.net_weight ?? ''} dari{' '}
                            {variantToDelete?.product ?? 'produk ini'}? Varian
                            yang pernah dipesan akan dinonaktifkan, bukan
                            dihapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={deleting}
                            >
                                Batal
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={!variantToDelete || deleting}
                            onClick={() => {
                                if (!variantToDelete || deleting) {
                                    return;
                                }

                                setDeleting(true);
                                router.delete(destroy.url(variantToDelete), {
                                    preserveScroll: true,
                                    onSuccess: () => setVariantToDelete(null),
                                    onFinish: () => setDeleting(false),
                                });
                            }}
                        >
                            {deleting ? 'Menghapus...' : 'Hapus varian'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
