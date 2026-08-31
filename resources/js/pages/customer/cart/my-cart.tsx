import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
    removeCartItem,
    updateCartItemQuantity,
} from '@/actions/App/Http/Controllers/Customer/CartController';
import ShopLayout from '@/layouts/shop-layout';
import { checkout, detail, list } from '@/routes';

type CartItem = {
    id: number;
    product_id: number | null;
    product_slug: string | null;
    title: string;
    net_weight: string | null;
    grind_type: string | null;
    image: string | null;
    price: number;
    quantity: number;
    available_stock: number;
    is_available: boolean;
    variant: { id: number | null; sku: string | null };
    subtotal: number;
};

type CartSummary = {
    item_count: number;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
};

type SuggestedProduct = {
    id: number;
    slug: string;
    title: string;
    price: number;
    image: string | null;
    available_stock: number;
};

type Props = {
    cartItems: CartItem[];
    summary: CartSummary;
    suggestedProducts: SuggestedProduct[];
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    })
        .format(price)
        .replace('Rp', 'Rp ');

const productMeta = (item: Pick<CartItem, 'net_weight' | 'grind_type'>) =>
    [item.net_weight, item.grind_type?.replaceAll('_', ' ')]
        .filter(Boolean)
        .join(' / ');

const stockIssueMessage = (item: CartItem) => {
    if (item.available_stock <= 0) {
        return 'Stok habis. Hapus produk ini atau tunggu stok tersedia.';
    }

    if (item.available_stock < item.quantity) {
        return `Stok tersedia ${item.available_stock}. Sesuaikan jumlah sebelum checkout.`;
    }

    return 'Produk ini tidak lagi tersedia.';
};

export default function MyCart({
    cartItems,
    summary,
    suggestedProducts,
}: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [processingItemId, setProcessingItemId] = useState<number | null>(
        null,
    );
    const [processingAction, setProcessingAction] = useState<
        'update' | 'remove' | null
    >(null);
    const hasStockIssues = useMemo(
        () => cartItems.some((item) => !item.is_available),
        [cartItems],
    );

    const updateQuantity = (item: CartItem, quantity: number) => {
        if (
            processingItemId !== null ||
            quantity < 1 ||
            quantity === item.quantity ||
            quantity > item.available_stock
        ) {
            return;
        }

        setProcessingItemId(item.id);
        setProcessingAction('update');
        router.patch(
            updateCartItemQuantity(item.id),
            { quantity },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setProcessingItemId(null);
                    setProcessingAction(null);
                },
            },
        );
    };

    const removeItem = (item: CartItem) => {
        if (processingItemId !== null) {
            return;
        }

        setProcessingItemId(item.id);
        setProcessingAction('remove');
        router.delete(removeCartItem(item.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setProcessingItemId(null);
                setProcessingAction(null);
            },
        });
    };

    const continueToCheckout = () => {
        if (hasStockIssues) {
            toast.error('Sesuaikan produk yang stoknya tidak tersedia.');

            return;
        }

        router.visit(checkout.url());
    };

    return (
        <ShopLayout>
            <Head title="Keranjang | Declasse" />

            <section className="border-t border-b border-hairline bg-sand">
                <div className="grid min-h-[190px] lg:grid-cols-[1.25fr_.75fr]">
                    <div className="flex flex-col justify-between border-b border-hairline px-7 py-8 sm:px-12 lg:border-r lg:border-b-0 lg:px-16 lg:py-10">
                        <p className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                            Your selection
                        </p>
                        <h1 className="mt-8 font-condensed text-[clamp(50px,6vw,86px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase">
                            Your cart.
                        </h1>
                    </div>
                    <div className="flex items-end px-7 py-8 sm:px-12 lg:px-10 lg:py-10">
                        <p className="max-w-xs text-[12px] leading-[1.45] text-ink/80">
                            Kopi pilihan Anda, siap dikirim untuk ritual seduh
                            berikutnya.
                        </p>
                    </div>
                </div>
            </section>

            {cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <main className="border-b border-hairline">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_370px]">
                        <section className="min-w-0 border-b border-hairline lg:border-r lg:border-b-0">
                            <div className="flex items-center justify-between border-b border-hairline px-7 py-3 text-[9px] font-semibold tracking-[0.08em] uppercase sm:px-10">
                                <span>{summary.item_count} items selected</span>
                                <Link
                                    href={list.url()}
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Continue shopping
                                </Link>
                            </div>
                            {errors.quantity && (
                                <p className="border-b border-hairline bg-primary/10 px-7 py-3 text-[11px] text-ink sm:px-10">
                                    {errors.quantity}
                                </p>
                            )}
                            <div className="divide-y divide-hairline">
                                {cartItems.map((item, index) => (
                                    <CartLine
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        processing={
                                            processingItemId === item.id
                                        }
                                        processingAction={processingAction}
                                        onDecrease={() =>
                                            updateQuantity(
                                                item,
                                                item.quantity - 1,
                                            )
                                        }
                                        onIncrease={() =>
                                            updateQuantity(
                                                item,
                                                item.quantity + 1,
                                            )
                                        }
                                        onRemove={() => removeItem(item)}
                                    />
                                ))}
                            </div>
                        </section>
                        <OrderSummary
                            summary={summary}
                            disabled={hasStockIssues}
                            onCheckout={continueToCheckout}
                        />
                    </div>
                </main>
            )}

        </ShopLayout>
    );
}

function CartLine({
    item,
    index,
    processing,
    processingAction,
    onDecrease,
    onIncrease,
    onRemove,
}: {
    item: CartItem;
    index: number;
    processing: boolean;
    processingAction: 'update' | 'remove' | null;
    onDecrease: () => void;
    onIncrease: () => void;
    onRemove: () => void;
}) {
    const disabled = processing || !item.is_available;

    return (
        <article className="grid gap-5 px-7 py-6 sm:grid-cols-[150px_minmax(0,1fr)] sm:px-10 sm:py-8">
            <div className="relative aspect-[1.05] overflow-hidden bg-oat">
                <span className="absolute top-3 left-3 z-10 text-[8px] font-semibold tracking-[0.08em] uppercase">
                    {String(index + 1).padStart(2, '0')}
                </span>
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="flex h-full items-center justify-center px-4 text-center text-[9px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
                        Image unavailable
                    </span>
                )}
            </div>
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8">
                <div>
                    {item.product_slug ? (
                        <Link
                            href={detail.url({
                                query: { product: item.product_slug },
                            })}
                            className="font-condensed text-[clamp(28px,3vw,40px)] leading-[0.86] font-semibold tracking-[-0.035em] uppercase hover:text-primary"
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <h2 className="font-condensed text-[clamp(28px,3vw,40px)] leading-[0.86] font-semibold tracking-[-0.035em] uppercase">
                            {item.title}
                        </h2>
                    )}
                    <p className="mt-3 text-[10px] tracking-[0.05em] text-ink/70 uppercase">
                        {productMeta(item) || 'Coffee variant'}
                    </p>
                    {item.variant.sku && (
                        <p className="mt-1 text-[9px] tracking-[0.04em] text-ink/55 uppercase">
                            SKU {item.variant.sku}
                        </p>
                    )}
                    {!item.is_available && (
                        <p className="mt-4 max-w-sm border-l-2 border-primary pl-3 text-[10px] leading-4 text-ink/80">
                            {stockIssueMessage(item)}
                        </p>
                    )}
                </div>
                <div className="flex items-start justify-between gap-6 sm:flex-col sm:items-end">
                    <p className="text-[12px] font-semibold tabular-nums">
                        {formatPrice(item.subtotal)}
                    </p>
                    <button
                        type="button"
                        onClick={onRemove}
                        disabled={processing}
                        className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase hover:text-primary disabled:opacity-50"
                    >
                        <Trash2 size={14} />{' '}
                        {processingAction === 'remove' ? 'Removing' : 'Remove'}
                    </button>
                </div>
                <div className="flex items-center justify-between border-t border-hairline pt-4 sm:col-span-2">
                    <p className="text-[10px] text-ink/65">
                        {item.is_available
                            ? `${item.available_stock} tersedia`
                            : 'Tidak tersedia untuk checkout'}
                    </p>
                    <div className="flex h-9 border border-hairline">
                        <button
                            type="button"
                            onClick={onDecrease}
                            disabled={disabled || item.quantity <= 1}
                            className="grid w-9 place-items-center hover:bg-oat disabled:opacity-35"
                            aria-label={`Kurangi ${item.title}`}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="grid w-10 place-items-center border-x border-hairline text-[11px] font-semibold tabular-nums">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={onIncrease}
                            disabled={
                                disabled ||
                                item.quantity >= item.available_stock
                            }
                            className="grid w-9 place-items-center hover:bg-oat disabled:opacity-35"
                            aria-label={`Tambah ${item.title}`}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

function OrderSummary({
    summary,
    disabled,
    onCheckout,
}: {
    summary: CartSummary;
    disabled: boolean;
    onCheckout: () => void;
}) {
    return (
        <aside className="bg-surface-dark px-7 py-8 text-canvas sm:px-10 lg:sticky lg:top-0 lg:h-fit">
            <p className="text-[9px] font-semibold tracking-[0.1em] text-oat uppercase">
                Order summary
            </p>
            <h2 className="mt-3 font-condensed text-[42px] leading-[0.82] font-semibold tracking-[-0.04em] uppercase">
                Ready to brew.
            </h2>
            <dl className="mt-8 border-t border-oat/35 text-[11px]">
                <SummaryRow
                    label="Subtotal"
                    value={formatPrice(summary.subtotal)}
                />
                <SummaryRow label="Shipping" value="Calculated at checkout" />
                <SummaryRow
                    label="Total"
                    value={formatPrice(summary.total)}
                    emphasis
                />
            </dl>
            <button
                type="button"
                onClick={onCheckout}
                disabled={disabled}
                className="mt-8 flex w-full items-center justify-between rounded-full bg-primary px-5 py-4 text-[10px] font-semibold tracking-[0.1em] text-white uppercase transition hover:bg-[#9e4d30] disabled:cursor-not-allowed disabled:opacity-45"
            >
                Checkout <ArrowRight size={16} />
            </button>
            <p className="mt-4 text-[10px] leading-4 text-oat/80">
                Ongkir dan metode pembayaran dikonfirmasi pada langkah
                berikutnya.
            </p>
        </aside>
    );
}

function SummaryRow({
    label,
    value,
    emphasis = false,
}: {
    label: string;
    value: string;
    emphasis?: boolean;
}) {
    return (
        <div className="flex items-center justify-between border-b border-oat/35 py-4">
            <dt
                className={emphasis ? 'font-semibold uppercase' : 'text-oat/80'}
            >
                {label}
            </dt>
            <dd
                className={
                    emphasis ? 'font-semibold tabular-nums' : 'text-oat/85'
                }
            >
                {value}
            </dd>
        </div>
    );
}

function SuggestedProducts({ products }: { products: SuggestedProduct[] }) {
    return (
        <section className="border-b border-hairline bg-canvas">
            <div className="border-b border-hairline px-7 py-7 sm:px-10 lg:px-16">
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                    Continue exploring
                </p>
                <h2 className="mt-2 font-condensed text-[clamp(36px,4.5vw,64px)] leading-[0.82] font-semibold tracking-[-0.045em] uppercase">
                    Add another ritual.
                </h2>
            </div>
            <div className="grid grid-cols-2 border-l border-hairline md:grid-cols-4">
                {products.slice(0, 4).map((product, index) => (
                    <Link
                        key={product.id}
                        href={detail.url({ query: { product: product.slug } })}
                        className="group border-r border-b border-hairline p-3 sm:p-4"
                    >
                        <span className="text-[8px] font-semibold tracking-[0.08em] uppercase">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="mt-3 aspect-[.85] overflow-hidden bg-oat">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                />
                            ) : (
                                <span className="flex h-full items-center justify-center px-3 text-center text-[8px] font-semibold tracking-[0.08em] text-ink/55 uppercase">
                                    Image unavailable
                                </span>
                            )}
                        </div>
                        <h3 className="mt-3 text-[10px] font-semibold tracking-[0.04em] uppercase">
                            {product.title}
                        </h3>
                        <p className="mt-1 text-[10px] text-ink/70">
                            {formatPrice(product.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function EmptyCart() {
    return (
        <section className="grid min-h-[360px] place-items-center border-b border-hairline bg-canvas px-7 py-16 text-center">
            <div>
                <p className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                    Nothing here yet
                </p>
                <h2 className="mt-3 font-condensed text-[clamp(48px,6vw,82px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase">
                    Find your coffee.
                </h2>
                <p className="mx-auto mt-5 max-w-sm text-[12px] leading-[1.45] text-ink/75">
                    Pilih kopi dari koleksi kami untuk memulai keranjang Anda.
                </p>
                <Link
                    href={list.url()}
                    className="mt-7 inline-flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-canvas uppercase hover:bg-primary"
                >
                    Shop coffee <ArrowRight size={15} />
                </Link>
            </div>
        </section>
    );
}
