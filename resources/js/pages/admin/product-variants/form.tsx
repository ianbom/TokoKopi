import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit, index, store, update } from '@/routes/admin/product-variants';

type Product = { id: number; name: string; sku: string | null };
type Variant = {
    id: number;
    product_id: number;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    regular_price: string | number;
    sale_price: string | number | null;
    shipping_weight_gram: number;
    image_url: string | null;
    is_active: boolean;
    stock_quantity: number;
    low_stock_threshold: number;
};
type Props = {
    mode: 'create' | 'edit';
    variant: Variant | null;
    products: Product[];
    selectedProductId: number | null;
};
type Data = {
    product_id: string | number;
    sku: string;
    net_weight: string;
    grind_type: string;
    regular_price: string | number;
    sale_price: string | number;
    shipping_weight_gram: string | number;
    image_url: string;
    is_active: boolean;
    stock_quantity: string | number;
    low_stock_threshold: string | number;
    image: File | null;
};

export default function VariantForm({
    mode,
    variant,
    products,
    selectedProductId,
}: Props) {
    const form = useForm<Data>({
        product_id: variant?.product_id ?? selectedProductId ?? '',
        sku: variant?.sku ?? '',
        net_weight: String(variant?.net_weight ?? ''),
        grind_type: variant?.grind_type ?? 'whole_bean',
        regular_price: String(variant?.regular_price ?? ''),
        sale_price: String(variant?.sale_price ?? ''),
        shipping_weight_gram: variant?.shipping_weight_gram ?? '',
        image_url: variant?.image_url ?? '',
        is_active: variant?.is_active ?? true,
        stock_quantity: variant?.stock_quantity ?? '',
        low_stock_threshold: variant?.low_stock_threshold ?? 5,
        image: null,
    });
    const errors = form.errors as Record<string, string | undefined>;
    const setField = <Key extends keyof Data>(field: Key, value: Data[Key]) =>
        form.setData(field, value as never);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) =>
            mode === 'create' ? data : { ...data, _method: 'put' },
        );
        form.post(mode === 'create' ? store.url() : update.url(variant!.id), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={mode === 'create' ? 'Tambah Varian' : 'Edit Varian'} />
            <main className="w-full space-y-6 p-4 md:p-6">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                            Katalog kopi
                        </p>
                        <h1 className="font-serif text-3xl">
                            {mode === 'create'
                                ? 'Tambah Varian'
                                : 'Edit Varian'}
                        </h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={variant ? edit(variant) : index()}>
                            <ArrowLeft /> Kembali
                        </Link>
                    </Button>
                </header>
                <form
                    onSubmit={submit}
                    className="grid w-full gap-4 border bg-canvas p-5 md:grid-cols-3"
                >
                    <Field label="Produk" error={errors.product_id}>
                        <select
                            className="h-9 border bg-canvas px-3 text-sm"
                            value={form.data.product_id}
                            onChange={(event) =>
                                setField(
                                    'product_id',
                                    Number(event.target.value),
                                )
                            }
                        >
                            <option value="">Pilih produk kopi</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="SKU" error={errors.sku}>
                        <Input
                            placeholder="DCL-GAYO-250-WB"
                            value={form.data.sku}
                            onChange={(event) =>
                                setField('sku', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Berat netto" error={errors.net_weight}>
                        <Input
                            placeholder="250gram"
                            value={form.data.net_weight}
                            onChange={(event) =>
                                setField('net_weight', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Grind type" error={errors.grind_type}>
                        <select
                            className="h-9 border bg-canvas px-3 text-sm"
                            value={form.data.grind_type}
                            onChange={(event) =>
                                setField('grind_type', event.target.value)
                            }
                        >
                            {['whole_bean', 'fine', 'medium', 'coarse'].map(
                                (type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ),
                            )}
                        </select>
                    </Field>
                    <Field label="Harga normal" error={errors.regular_price}>
                        <Input
                            type="number"
                            min="0"
                            placeholder="95000"
                            value={form.data.regular_price}
                            onChange={(event) =>
                                setField('regular_price', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Harga promo" error={errors.sale_price}>
                        <Input
                            type="number"
                            min="0"
                            placeholder="85000"
                            value={form.data.sale_price}
                            onChange={(event) =>
                                setField('sale_price', event.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Berat kirim (gram)"
                        error={errors.shipping_weight_gram}
                    >
                        <Input
                            type="number"
                            min="0"
                            placeholder="300"
                            value={form.data.shipping_weight_gram}
                            onChange={(event) =>
                                setField(
                                    'shipping_weight_gram',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    <Field label="Stok" error={errors.stock_quantity}>
                        <Input
                            type="number"
                            min="0"
                            placeholder="20"
                            value={form.data.stock_quantity}
                            onChange={(event) =>
                                setField('stock_quantity', event.target.value)
                            }
                        />
                    </Field>
                    <Field
                        label="Batas stok rendah"
                        error={errors.low_stock_threshold}
                    >
                        <Input
                            type="number"
                            min="0"
                            placeholder="5"
                            value={form.data.low_stock_threshold}
                            onChange={(event) =>
                                setField(
                                    'low_stock_threshold',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    <Field
                        label="File gambar varian"
                        error={errors.image}
                        className="md:col-span-2"
                    >
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setField(
                                    'image',
                                    event.target.files?.[0] ?? null,
                                )
                            }
                        />
                    </Field>
                    <div className="flex items-end gap-4">
                        <label className="flex h-9 items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(event) =>
                                    setField('is_active', event.target.checked)
                                }
                            />
                            Aktif
                        </label>
                        <VariantImagePreview
                            file={form.data.image}
                            url={form.data.image_url}
                        />
                    </div>
                    <div className="flex justify-end md:col-span-3">
                        <Button type="submit" disabled={form.processing}>
                            <Save /> Simpan
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
function VariantImagePreview({
    file,
    url,
}: {
    file: File | null;
    url: string;
}) {
    const preview = useMemo(
        () => (file ? URL.createObjectURL(file) : url || null),
        [file, url],
    );

    useEffect(() => {
        if (!file || !preview) {
            return;
        }

        return () => URL.revokeObjectURL(preview);
    }, [file, preview]);

    return preview ? (
        <img
            src={preview}
            alt="Pratinjau varian kopi"
            className="h-16 w-16 object-cover"
        />
    ) : null;
}
function Field({
    label,
    error,
    className = '',
    children,
}: {
    label: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`grid gap-1.5 ${className}`}>
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
