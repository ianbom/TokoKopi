import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { update } from '@/actions/App/Http/Controllers/Admin/StockController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/admin/stock';

type Variant = {
    id: number;
    product_id: number;
    product: string | null;
    sku: string;
    quantity: number;
    low_stock_threshold: number;
};
export default function StockAdjustment({ variant }: { variant: Variant }) {
    const form = useForm({ type: 'in', quantity: 1, note: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(update.url(variant.id));
    };

    return (
        <>
            <Head title="Penyesuaian Stok" />
            <main className="mx-auto max-w-2xl space-y-6 p-6">
                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Inventory
                        </p>
                        <h1 className="font-serif text-3xl">
                            Penyesuaian Stok
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {variant.product ?? '-'} · {variant.sku}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={index()}>
                            <ArrowLeft /> Kembali
                        </Link>
                    </Button>
                </header>
                <div className="grid grid-cols-2 gap-3">
                    <Metric label="Stok saat ini" value={variant.quantity} />
                    <Metric
                        label="Batas rendah"
                        value={variant.low_stock_threshold}
                    />
                </div>
                <form
                    onSubmit={submit}
                    className="space-y-4 border bg-canvas p-5"
                >
                    <Field label="Tipe" error={form.errors.type}>
                        <select
                            className="h-9 border bg-canvas px-3 text-sm"
                            value={form.data.type}
                            onChange={(e) =>
                                form.setData('type', e.target.value)
                            }
                        >
                            <option value="in">Tambah</option>
                            <option value="out">Kurangi</option>
                            <option value="adjustment">Tetapkan</option>
                        </select>
                    </Field>
                    <Field label="Jumlah" error={form.errors.quantity}>
                        <Input
                            type="number"
                            value={form.data.quantity}
                            onChange={(e) =>
                                form.setData('quantity', Number(e.target.value))
                            }
                        />
                    </Field>
                    <Field label="Catatan" error={form.errors.note}>
                        <textarea
                            className="min-h-24 border bg-canvas px-3 py-2 text-sm"
                            value={form.data.note}
                            onChange={(e) =>
                                form.setData('note', e.target.value)
                            }
                        />
                    </Field>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing}>
                            <Save /> Simpan
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
function Metric({ label, value }: { label: string; value: number }) {
    return (
        <div className="border bg-canvas p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
}
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
