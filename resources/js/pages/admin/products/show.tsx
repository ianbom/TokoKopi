import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import HTMLRender from '@/components/HTMLRender';
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
    sort_order: number;
    is_primary: boolean;
};

type Variant = {
    id: number;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    tasting_notes: string | null;
    regular_price: string | number;
    sale_price: string | number | null;
    shipping_weight_gram: number;
    image_url: string | null;
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

const humanize = (value: string | null) =>
    value ? value.replaceAll('_', ' ') : '-';

export default function ProductShow({ product }: { product: Product }) {
    const gallery = [...product.images]
        .filter((image) => image.image_url)
        .sort(
            (left, right) =>
                Number(right.is_primary) - Number(left.is_primary) ||
                left.sort_order - right.sort_order,
        );
    const [activeImage, setActiveImage] = useState(0);
    const currentImage = gallery[activeImage];
    const activeVariant =
        product.variants.find((variant) => variant.is_active) ??
        product.variants[0];
    const flags = [
        product.is_featured ? 'Featured' : null,
        product.is_new_arrival ? 'New arrival' : null,
        product.is_best_seller ? 'Best seller' : null,
    ].filter(Boolean) as string[];
    const action = (url: string, method: 'post' | 'delete') =>
        router[method](url, {}, { preserveScroll: true });
    const changeImage = (direction: -1 | 1) =>
        setActiveImage(
            (current) =>
                (current + direction + gallery.length) % gallery.length,
        );

    return (
        <>
            <Head title={product.name} />
            <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col justify-between gap-4 border-b border-ink/15 pb-5 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
                            Admin / Product detail
                        </p>
                        <h1 className="mt-2 font-condensed text-[clamp(42px,5vw,72px)] leading-[0.86] font-semibold tracking-[-0.04em] text-teal uppercase">
                            {product.name}
                        </h1>
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
                        {product.status !== 'active' ? (
                            <Button
                                onClick={() =>
                                    action(publish.url(product), 'post')
                                }
                            >
                                <CheckCircle2 /> Aktifkan
                            </Button>
                        ) : null}
                        {product.status !== 'archived' ? (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    action(archive.url(product), 'post')
                                }
                            >
                                <Archive /> Arsipkan
                            </Button>
                        ) : null}
                        <Button
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                                confirm(`Hapus ${product.name}?`) &&
                                action(destroy.url(product), 'delete')
                            }
                        >
                            <Trash2 /> Hapus
                        </Button>
                    </div>
                </header>

                <section className="grid overflow-hidden border border-ink/15 bg-white lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
                    <div className="relative min-h-[420px] overflow-hidden bg-[#e9dfd1] sm:min-h-[560px] lg:min-h-[680px]">
                        {currentImage?.image_url ? (
                            <img
                                src={currentImage.image_url}
                                alt={currentImage.alt_text ?? product.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center text-xs font-semibold tracking-[0.08em] text-ink/55 uppercase">
                                Belum ada gambar produk
                            </div>
                        )}
                        {gallery.length > 1 ? (
                            <>
                                <button
                                    type="button"
                                    aria-label="Gambar sebelumnya"
                                    onClick={() => changeImage(-1)}
                                    className="absolute top-1/2 left-4 grid size-11 -translate-y-1/2 place-items-center border border-white/70 bg-ink/75 text-white transition-colors hover:bg-ink"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Gambar berikutnya"
                                    onClick={() => changeImage(1)}
                                    className="absolute top-1/2 right-4 grid size-11 -translate-y-1/2 place-items-center border border-white/70 bg-ink/75 text-white transition-colors hover:bg-ink"
                                >
                                    <ArrowRight className="size-4" />
                                </button>
                                <span className="absolute right-4 bottom-4 bg-ink/75 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase">
                                    {activeImage + 1} / {gallery.length}
                                </span>
                            </>
                        ) : null}
                    </div>

                    <div className="flex flex-col bg-[#f4ede3] p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/20 pb-5">
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase">
                                {product.categories.join(' / ') ||
                                    'Tanpa kategori'}
                            </p>
                            <span className="border border-ink/30 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
                                {product.status}
                            </span>
                        </div>

                        <div className="py-7">
                            <p className="text-xs text-ink/60">
                                SKU {product.sku ?? '-'}
                            </p>
                            <h2 className="mt-3 font-condensed text-[clamp(46px,5vw,78px)] leading-[0.84] font-semibold tracking-[-0.045em] uppercase">
                                {product.name}
                            </h2>
                            <p className="mt-5 text-xl font-semibold">
                                {activeVariant
                                    ? money(
                                          activeVariant.sale_price ??
                                              activeVariant.regular_price,
                                      )
                                    : 'Harga belum tersedia'}
                            </p>
                            {activeVariant?.sale_price ? (
                                <p className="mt-1 text-sm text-ink/50 line-through">
                                    {money(activeVariant.regular_price)}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-2 border-y border-ink/20 sm:grid-cols-3">
                            <Detail
                                label="Origin"
                                value={product.origin ?? '-'}
                            />
                            <Detail
                                label="Process"
                                value={product.process ?? '-'}
                            />
                            <Detail
                                label="Total stock"
                                value={product.total_stock}
                            />
                            <Detail
                                label="Variants"
                                value={product.variants.length}
                            />
                            <Detail
                                label="Sold"
                                value={product.order_items_count}
                            />
                            <Detail
                                label="Updated"
                                value={product.updated_at ?? '-'}
                            />
                        </div>

                        {flags.length > 0 ? (
                            <div className="flex flex-wrap gap-2 border-b border-ink/20 py-5">
                                {flags.map((flag) => (
                                    <span
                                        key={flag}
                                        className="bg-teal px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-white uppercase"
                                    >
                                        {flag}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        <div className="pt-7">
                            <h2 className="font-condensed text-4xl leading-[0.86] font-semibold tracking-[-0.035em] uppercase">
                                About this coffee.
                            </h2>
                            <HTMLRender
                                html={product.description}
                                className="mt-5 text-ink/75 [&_h1]:text-teal [&_h2]:text-teal [&_strong]:text-teal"
                                emptyFallback={
                                    <p className="mt-5 text-sm text-ink/55">
                                        Belum ada deskripsi produk.
                                    </p>
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="border border-ink/15 bg-[#f1e8dc] p-5 sm:p-7">
                    <div className="flex flex-col justify-between gap-4 border-b border-ink/20 pb-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] text-primary uppercase">
                                Inventory
                            </p>
                            <h2 className="mt-2 font-condensed text-5xl leading-[0.84] font-semibold tracking-[-0.04em] uppercase">
                                Stock details.
                            </h2>
                        </div>
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

                    {product.variants.length > 0 ? (
                        <div className="mt-5 overflow-x-auto border-y border-ink/20">
                            <table className="w-full min-w-[980px] text-left text-xs">
                                <thead className="border-b border-ink/20 text-[9px] tracking-[0.08em] text-ink/55 uppercase">
                                    <tr>
                                        <th className="py-3 pr-4">SKU</th>
                                        <th className="py-3 pr-4">Grind</th>
                                        <th className="py-3 pr-4">Weight</th>
                                        <th className="py-3 pr-4">
                                            Taste notes
                                        </th>
                                        <th className="py-3 pr-4">Price</th>
                                        <th className="py-3 pr-4">Shipping</th>
                                        <th className="py-3 pr-4">Stock</th>
                                        <th className="py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.variants.map((variant) => (
                                        <tr
                                            key={variant.id}
                                            className="border-b border-ink/15 last:border-b-0"
                                        >
                                            <td className="py-4 pr-4 font-semibold">
                                                {variant.sku}
                                            </td>
                                            <td className="py-4 pr-4 capitalize">
                                                {humanize(variant.grind_type)}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {variant.net_weight ?? '-'}
                                            </td>
                                            <td className="max-w-56 py-4 pr-4">
                                                {variant.tasting_notes ?? '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold">
                                                    {money(
                                                        variant.sale_price ??
                                                            variant.regular_price,
                                                    )}
                                                </div>
                                                {variant.sale_price ? (
                                                    <div className="mt-1 text-[10px] text-ink/45 line-through">
                                                        {money(
                                                            variant.regular_price,
                                                        )}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {variant.shipping_weight_gram} g
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold">
                                                    {variant.stock_quantity}
                                                </div>
                                                <div className="mt-1 text-[10px] text-ink/50">
                                                    Alert at{' '}
                                                    {
                                                        variant.low_stock_threshold
                                                    }
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 text-[9px] font-semibold tracking-[0.06em] uppercase ${
                                                        variant.is_active
                                                            ? 'bg-teal text-white'
                                                            : 'bg-ink/10 text-ink/60'
                                                    }`}
                                                >
                                                    {variant.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="py-10 text-center text-sm text-ink/55">
                            Belum ada varian produk.
                        </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[10px] text-ink/55">
                        <span>Created: {product.created_at ?? '-'}</span>
                        <span>Updated: {product.updated_at ?? '-'}</span>
                        <span>Slug: {product.slug}</span>
                    </div>
                </section>
            </main>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="border-r border-b border-ink/15 px-3 py-4 last:border-r-0 sm:px-4">
            <p className="text-[9px] font-semibold tracking-[0.08em] text-ink/50 uppercase">
                {label}
            </p>
            <p className="mt-2 truncate text-sm font-semibold capitalize">
                {value}
            </p>
        </div>
    );
}
