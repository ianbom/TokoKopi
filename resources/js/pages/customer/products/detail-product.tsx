import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { addProductVariantToCart as addProductVariantToCartRoute } from '@/actions/App/Http/Controllers/Customer/CartController';
import ShopLayout from '@/layouts/shop-layout';
import { detail } from '@/routes';

type ProductImage = {
    url: string;
    alt: string;
};

type Variant = {
    id: number;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    regular_price: number;
    sale_price: number | null;
    image_url?: string | null;
    available_stock: number;
};

type ProductCard = {
    id: number;
    slug: string;
    title: string;
    short_description: string;
    price: number;
    sale_price: number | null;
    image_url: string | null;
};

type ProductDetail = ProductCard & {
    category: string | null;
    origin: string | null;
    process: string | null;
    description: string | null;
    images: ProductImage[];
    variants: Variant[];
};

type Props = {
    product: ProductDetail;
    relatedProducts: ProductCard[];
};

const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace('IDR', 'Rp')
        .trim();

const humanize = (value: string | null) =>
    value ? value.replaceAll('_', ' ') : null;

const stripHtml = (value: string | null) =>
    value
        ?.replace(/<[^>]*>/g, '')
        .replaceAll('&nbsp;', ' ')
        .trim() ?? '';

export default function DetailProduct({ product, relatedProducts }: Props) {
    return (
        <DetailProductPage
            key={product.id}
            product={product}
            relatedProducts={relatedProducts}
        />
    );
}

function DetailProductPage({ product, relatedProducts }: Props) {
    const [mainImage, setMainImage] = useState<string | null>(
        product.images[0]?.url ?? null,
    );
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        product.variants[0]?.id ?? null,
    );
    const [quantity, setQuantity] = useState(1);
    const cartForm = useForm({ quantity: 1 });
    const selectedVariant =
        product.variants.find((variant) => variant.id === selectedVariantId) ??
        null;
    const availableStock = selectedVariant?.available_stock ?? 0;
    const isAvailable = availableStock > 0;
    const price =
        selectedVariant?.sale_price ??
        selectedVariant?.regular_price ??
        product.sale_price ??
        product.price;
    const description =
        product.short_description || stripHtml(product.description);
    const selectedImage =
        product.images.find((image) => image.url === mainImage) ??
        product.images[0];
    const meta = [
        ['ORIGIN', product.origin],
        ['PROCESS', humanize(product.process)],
        [
            'FORMAT',
            humanize(selectedVariant?.grind_type ?? null) ?? product.category,
        ],
        ['WEIGHT', selectedVariant?.net_weight ?? null],
    ].filter(([, value]) => value) as Array<[string, string]>;

    const selectVariant = (variant: Variant) => {
        setSelectedVariantId(variant.id);
        setQuantity(1);
        cartForm.setData('quantity', 1);

        if (variant.image_url) {
            setMainImage(variant.image_url);
        }
    };
    const changeQuantity = (nextQuantity: number) => {
        const next = Math.max(1, Math.min(nextQuantity, availableStock || 1));

        setQuantity(next);
        cartForm.setData('quantity', next);
    };
    const addToBag = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedVariant || !isAvailable || cartForm.processing) {
            return;
        }

        cartForm.submit(addProductVariantToCartRoute(selectedVariant.id), {
            preserveScroll: true,
        });
    };

    return (
        <ShopLayout>
            <Head title={product.title} />
            <main className="border-t border-hairline bg-canvas text-ink">
                <section className="grid border-b border-hairline lg:grid-cols-2">
                    <ProductGallery
                        gallery={product.images}
                        mainImage={selectedImage}
                        onSelect={setMainImage}
                        productTitle={product.title}
                    />

                    <section className="bg-canvas lg:sticky lg:top-0 lg:self-start">
                        <div className="px-7 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11 xl:px-16">
                            <p className="text-[9px] font-semibold tracking-[0.08em] uppercase">
                                {product.category ?? 'Coffee'}
                            </p>
                            <h1 className="mt-2 max-w-xl font-condensed text-[clamp(46px,5.3vw,82px)] leading-[0.84] font-semibold tracking-[-0.045em] uppercase">
                                {product.title}
                            </h1>
                            <p className="mt-3 text-[11px] leading-5 text-ink/80 sm:text-[12px]">
                                {description}
                            </p>
                            <p className="mt-4 text-[19px] font-medium tracking-[-0.02em]">
                                {formatPrice(price)}
                            </p>

                            <dl className="mt-8 grid grid-cols-2 border-y border-hairline sm:grid-cols-4">
                                {meta.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="border-r border-hairline px-3 py-4 last:border-r-0 sm:px-4"
                                    >
                                        <dt className="text-[8px] font-semibold tracking-[0.08em] text-ink/65 uppercase">
                                            {label}
                                        </dt>
                                        <dd className="mt-1 text-[9px] font-semibold tracking-[0.04em] uppercase">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            {product.variants.length > 0 && (
                                <fieldset className="mt-7">
                                    <legend className="text-[9px] font-semibold tracking-[0.08em] uppercase">
                                        Choose your grind
                                    </legend>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {product.variants.map((variant) => {
                                            const active =
                                                variant.id ===
                                                selectedVariant?.id;
                                            const label =
                                                humanize(variant.grind_type) ??
                                                variant.net_weight ??
                                                variant.sku;

                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() =>
                                                        selectVariant(variant)
                                                    }
                                                    className={
                                                        active
                                                            ? 'min-h-9 border border-ink bg-ink px-4 text-[8px] font-semibold tracking-[0.06em] text-canvas uppercase transition-colors duration-200'
                                                            : 'min-h-9 border border-ink/45 px-4 text-[8px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 hover:border-ink hover:bg-sand'
                                                    }
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            )}

                            <form className="mt-7" onSubmit={addToBag}>
                                <div className="grid gap-2 sm:grid-cols-[108px_1fr]">
                                    <div className="grid h-12 grid-cols-3 border border-hairline">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(quantity - 1)
                                            }
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                            className="flex items-center justify-center transition-colors hover:bg-sand disabled:opacity-30"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="flex items-center justify-center text-[11px] font-semibold tabular-nums">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(quantity + 1)
                                            }
                                            disabled={
                                                !isAvailable ||
                                                quantity >= availableStock
                                            }
                                            aria-label="Increase quantity"
                                            className="flex items-center justify-center transition-colors hover:bg-sand disabled:opacity-30"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={
                                            !isAvailable ||
                                            !selectedVariant ||
                                            cartForm.processing
                                        }
                                        className="flex h-12 items-center justify-center gap-3 bg-ink px-5 text-[10px] font-semibold tracking-[0.07em] text-canvas uppercase transition-colors duration-200 hover:bg-[#b65c3a] disabled:bg-ink/35"
                                    >
                                        {cartForm.processing
                                            ? 'Adding to bag'
                                            : 'Add to bag'}
                                        <span>— {formatPrice(price)}</span>
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                                {cartForm.errors.quantity && (
                                    <p className="mt-3 text-[11px] font-medium text-[#a6472b]">
                                        {cartForm.errors.quantity}
                                    </p>
                                )}
                                {!isAvailable && selectedVariant && (
                                    <p className="mt-3 text-[10px] font-semibold tracking-[0.06em] text-[#a6472b] uppercase">
                                        Currently sold out
                                    </p>
                                )}
                            </form>

                            <p className="mt-6 border-t border-hairline pt-4 text-[8px] font-medium tracking-[0.04em] text-ink/65 uppercase">
                                Roasted fresh weekly · Shipping calculated at
                                checkout · Secure checkout
                            </p>
                        </div>
                    </section>
                </section>

                <CoffeeStory product={product} meta={meta} />

                {product.images[2] && (
                    <section className="relative border-b border-hairline bg-ink text-canvas">
                        <img
                            src={product.images[2].url}
                            alt={product.images[2].alt}
                            loading="lazy"
                            className="h-[300px] w-full object-cover opacity-80 sm:h-[380px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
                        <p className="absolute bottom-7 left-7 max-w-36 text-[11px] leading-[1.1] font-semibold tracking-[0.06em] uppercase sm:bottom-10 sm:left-10">
                            Made for everyday rituals.
                        </p>
                    </section>
                )}

                {relatedProducts.length > 0 && (
                    <RelatedProducts products={relatedProducts} />
                )}
            </main>
        </ShopLayout>
    );
}

function ProductGallery({
    gallery,
    mainImage,
    onSelect,
    productTitle,
}: {
    gallery: ProductImage[];
    mainImage?: ProductImage;
    onSelect: (url: string) => void;
    productTitle: string;
}) {
    return (
        <section className="bg-oat">
            <div className="relative aspect-[1.06/1] overflow-hidden border-b border-hairline bg-sand">
                {mainImage ? (
                    <img
                        src={mainImage.url}
                        alt={mainImage.alt}
                        fetchPriority="high"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center px-8 text-center text-[10px] font-semibold tracking-[0.08em] text-ink/60 uppercase">
                        Image unavailable
                    </div>
                )}
            </div>
            {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-px bg-hairline p-4 sm:p-5">
                    {gallery.slice(0, 3).map((image, index) => {
                        const active = image.url === mainImage?.url;

                        return (
                            <button
                                key={image.url}
                                type="button"
                                onClick={() => onSelect(image.url)}
                                aria-label={
                                    'Show image ' +
                                    (index + 1) +
                                    ' for ' +
                                    productTitle
                                }
                                className={
                                    active
                                        ? 'bg-canvas p-1 text-left ring-1 ring-ink'
                                        : 'bg-canvas p-1 text-left transition-opacity hover:opacity-70'
                                }
                            >
                                <img
                                    src={image.url}
                                    alt=""
                                    loading="lazy"
                                    className="aspect-[1.15/1] w-full object-cover"
                                />
                                <span className="mt-2 block text-[7px] font-semibold tracking-[0.05em] text-ink/70 uppercase">
                                    0{index + 1} ·{' '}
                                    {index === 0
                                        ? 'Packshot'
                                        : index === 1
                                          ? 'Detail'
                                          : 'Lifestyle'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

function CoffeeStory({
    product,
    meta,
}: {
    product: ProductDetail;
    meta: Array<[string, string]>;
}) {
    return (
        <section className="grid border-b border-hairline bg-[#f1e8dc] md:grid-cols-[.9fr_1.1fr]">
            <div className="border-b border-hairline px-7 py-8 sm:px-10 sm:py-10 md:border-r md:border-b-0">
                <p className="font-condensed text-[clamp(30px,3.2vw,48px)] leading-[0.83] font-semibold tracking-[-0.035em] uppercase">
                    About
                    <br />
                    this coffee.
                </p>
                <p className="mt-5 max-w-sm text-[11px] leading-[1.45] text-ink/85 sm:text-[12px]">
                    {stripHtml(product.description) ||
                        product.short_description}
                </p>
            </div>
            <dl className="px-7 py-6 sm:px-10 sm:py-8">
                {meta.map(([label, value]) => (
                    <div
                        key={label}
                        className="grid grid-cols-[108px_1fr] border-b border-ink/20 py-2 text-[9px] leading-4 sm:grid-cols-[150px_1fr]"
                    >
                        <dt className="font-semibold tracking-[0.06em] uppercase">
                            {label}
                        </dt>
                        <dd className="text-ink/80">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function RelatedProducts({ products }: { products: ProductCard[] }) {
    return (
        <section className="bg-canvas px-7 py-10 sm:px-10 sm:py-12">
            <p className="text-[9px] font-semibold tracking-[0.08em] uppercase">
                You may also like
            </p>
            <h2 className="mt-1 font-condensed text-[clamp(31px,3.8vw,54px)] leading-[0.85] font-semibold tracking-[-0.04em] uppercase">
                More from Declasse.
            </h2>
            <div className="mt-8 grid grid-cols-2 border-t border-l border-hairline sm:grid-cols-4">
                {products.map((product, index) => (
                    <Link
                        key={product.id}
                        href={detail.url({ query: { product: product.slug } })}
                        className="group border-r border-b border-hairline bg-canvas p-3 sm:p-4"
                    >
                        <span className="text-[8px] font-semibold tracking-[0.06em] text-ink/70 uppercase">
                            0{index + 1}
                        </span>
                        <div className="mt-3 aspect-[.8] overflow-hidden bg-oat">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center px-3 text-center text-[8px] font-semibold tracking-[0.06em] text-ink/60 uppercase">
                                    Image unavailable
                                </div>
                            )}
                        </div>
                        <h3 className="mt-3 text-[10px] font-semibold tracking-[0.04em] uppercase">
                            {product.title}
                        </h3>
                        <p className="mt-1 text-[9px] text-ink/70">
                            {formatPrice(product.sale_price ?? product.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
