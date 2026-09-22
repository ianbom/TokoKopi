import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { addProductVariantToCart as addProductVariantToCartRoute } from '@/actions/App/Http/Controllers/Customer/CartController';
import {
    destroyProduct as destroyWishlistProductRoute,
    store as storeWishlistProductRoute,
} from '@/actions/App/Http/Controllers/Customer/WishlistController';
import ShopLayout from '@/layouts/shop-layout';

type ProductImage = {
    url: string;
    alt: string;
};

type Variant = {
    id: number;
    sku: string;
    net_weight: string | null;
    grind_type: string | null;
    tasting_notes: string | null;
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
    is_wishlisted: boolean;
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

export default function DetailProduct({ product }: Props) {
    return <DetailProductPage key={product.id} product={product} />;
}

function DetailProductPage({ product }: { product: ProductDetail }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        product.variants[0]?.id ?? null,
    );
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);
    const cartForm = useForm({ quantity: 1 });
    const wishlistForm = useForm({});
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
    const gallery = [
        ...product.images,
        ...product.variants.flatMap((variant) =>
            variant.image_url
                ? [
                      {
                          url: variant.image_url,
                          alt: `${product.title} ${humanize(variant.grind_type) ?? variant.sku}`,
                      },
                  ]
                : [],
        ),
    ].filter(
        (image, index, images) =>
            images.findIndex((candidate) => candidate.url === image.url) ===
            index,
    );
    const selectedImage = gallery[activeImageIndex];
    const meta = [
        ['ORIGIN', product.origin],
        ['PROCESS', humanize(product.process)],
        [
            'PRODUCER',
            humanize(selectedVariant?.grind_type ?? null) ?? product.category,
        ],
        ['TASTING NOTES', selectedVariant?.tasting_notes ?? null],
    ].filter(([, value]) => value) as Array<[string, string]>;

    const selectVariant = (variant: Variant) => {
        setSelectedVariantId(variant.id);
        setQuantity(1);
        cartForm.setData('quantity', 1);

        if (variant.image_url) {
            const variantImageIndex = gallery.findIndex(
                (image) => image.url === variant.image_url,
            );

            if (variantImageIndex >= 0) {
                setActiveImageIndex(variantImageIndex);
            }
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

    const toggleWishlist = () => {
        wishlistForm.submit(
            isWishlisted
                ? destroyWishlistProductRoute(product.id)
                : storeWishlistProductRoute(product.id),
            {
                preserveScroll: true,
                onSuccess: () => setIsWishlisted((value) => !value),
            },
        );
    };

    return (
        <ShopLayout>
            <Head title={product.title} />
            <main className="min-w-0 border-t border-hairline bg-canvas text-ink">
                <section className="grid min-w-0 border-b border-hairline lg:grid-cols-2">
                    <ProductGallery
                        gallery={gallery}
                        activeIndex={activeImageIndex}
                        mainImage={selectedImage}
                        onNext={() =>
                            setActiveImageIndex((current) =>
                                current === gallery.length - 1
                                    ? 0
                                    : current + 1,
                            )
                        }
                        onPrevious={() =>
                            setActiveImageIndex((current) =>
                                current === 0
                                    ? gallery.length - 1
                                    : current - 1,
                            )
                        }
                        onSelect={setActiveImageIndex}
                        productTitle={product.title}
                    />

                    <section className="min-w-0 bg-canvas lg:sticky lg:top-0 lg:self-start">
                        <div className="px-5 py-7 sm:px-10 sm:py-10 lg:px-12 lg:py-11 xl:px-16">
                            <p className="text-[9px] font-semibold tracking-[0.08em] uppercase">
                                {product.category ?? 'Coffee'}
                            </p>
                            <h1 className="mt-2 max-w-xl font-condensed text-[clamp(40px,12vw,64px)] leading-[0.84] font-semibold tracking-[-0.045em] break-words uppercase sm:text-[clamp(46px,5.3vw,82px)]">
                                {product.title}
                            </h1>
                            <p className="mt-3 max-w-prose text-[11px] leading-5 text-ink/80 sm:text-[12px]">
                                {description}
                            </p>
                            <p className="mt-4 text-[19px] font-medium tracking-[-0.02em]">
                                {formatPrice(price)}
                            </p>

                            <dl className="mt-8 grid grid-cols-2 border-y border-hairline sm:grid-cols-4">
                                {meta.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="min-w-0 border-r border-hairline px-3 py-4 last:border-r-0 sm:px-4"
                                    >
                                        <dt className="text-[8px] font-semibold tracking-[0.08em] text-ink/65 uppercase">
                                            {label}
                                        </dt>
                                        <dd className="mt-1 text-[9px] font-semibold tracking-[0.04em] break-words uppercase">
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
                                                [
                                                    humanize(
                                                        variant.grind_type,
                                                    ),
                                                    variant.net_weight,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ') || 'Variant';

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

                            <div className="mt-7 flex items-start gap-2">
                                <form
                                    className="min-w-0 flex-1"
                                    onSubmit={addToBag}
                                >
                                    <div className="flex gap-2">
                                        <div className="grid h-12 w-[88px] shrink-0 grid-cols-3 border border-hairline sm:w-[108px]">
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
                                            className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 bg-ink px-3 text-[10px] font-semibold tracking-[0.04em] text-canvas uppercase transition-colors duration-200 hover:bg-[#b65c3a] disabled:bg-ink/35 sm:gap-3 sm:px-5 sm:tracking-[0.07em]"
                                        >
                                            <span className="truncate">
                                                {cartForm.processing
                                                    ? 'Adding to bag'
                                                    : 'Add to bag'}
                                            </span>
                                            <span className="hidden shrink-0 sm:inline">
                                                — {formatPrice(price)}
                                            </span>
                                            <ArrowRight
                                                className="shrink-0"
                                                size={15}
                                            />
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

                                <button
                                    type="button"
                                    onClick={toggleWishlist}
                                    disabled={wishlistForm.processing}
                                    aria-pressed={isWishlisted}
                                    aria-label={
                                        isWishlisted
                                            ? 'Remove from wishlist'
                                            : 'Add to wishlist'
                                    }
                                    title={
                                        isWishlisted
                                            ? 'Remove from wishlist'
                                            : 'Add to wishlist'
                                    }
                                    className="flex size-12 shrink-0 items-center justify-center border border-ink transition-colors duration-200 hover:bg-sand disabled:cursor-wait disabled:opacity-50"
                                >
                                    <Heart
                                        size={17}
                                        fill={
                                            isWishlisted
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                </button>
                            </div>

                            <CoffeeStory product={product} />

                            <p className="mt-6 border-t border-hairline pt-4 text-[8px] font-medium tracking-[0.04em] text-ink/65 uppercase">
                                Roasted fresh weekly · Shipping calculated at
                                checkout · Secure checkout
                            </p>
                        </div>
                    </section>
                </section>
            </main>
        </ShopLayout>
    );
}

function ProductGallery({
    gallery,
    activeIndex,
    mainImage,
    onNext,
    onPrevious,
    onSelect,
    productTitle,
}: {
    gallery: ProductImage[];
    activeIndex: number;
    mainImage?: ProductImage;
    onNext: () => void;
    onPrevious: () => void;
    onSelect: (index: number) => void;
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
                {gallery.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={onPrevious}
                            aria-label={'Previous image for ' + productTitle}
                            className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center border border-canvas/70 bg-ink/75 text-canvas transition-colors hover:bg-ink"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            aria-label={'Next image for ' + productTitle}
                            className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center border border-canvas/70 bg-ink/75 text-canvas transition-colors hover:bg-ink"
                        >
                            <ArrowRight size={16} />
                        </button>
                        <span className="absolute right-4 bottom-4 bg-ink/75 px-3 py-1 text-[9px] font-semibold tracking-[0.08em] text-canvas uppercase">
                            {activeIndex + 1} / {gallery.length}
                        </span>
                    </>
                )}
            </div>
            {gallery.length > 0 ? (
                <div className="flex snap-x gap-3 overflow-x-auto border-b border-hairline bg-oat px-4 py-4 [scrollbar-width:thin] sm:px-5">
                    {gallery.map((image, index) => (
                        <button
                            key={`${image.url}-${index}`}
                            type="button"
                            aria-label={`Show image ${index + 1} for ${productTitle}`}
                            aria-pressed={index === activeIndex}
                            onClick={() => onSelect(index)}
                            className={`relative aspect-square w-24 shrink-0 snap-start overflow-hidden border transition-all sm:w-28 ${
                                index === activeIndex
                                    ? 'border-ink opacity-100'
                                    : 'border-hairline opacity-55 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            ) : null}
        </section>
    );
}

function CoffeeStory({ product }: { product: ProductDetail }) {
    return (
        <section className="mt-8 border-y border-hairline bg-[#f1e8dc] px-5 py-6 sm:px-6 sm:py-7">
            <div>
                <h2 className="font-condensed text-[clamp(30px,3.2vw,44px)] leading-[0.83] font-semibold tracking-[-0.035em] uppercase">
                    About
                    <br />
                    this coffee.
                </h2>
            </div>

            {product.variants.length > 0 && (
                <div className="mt-6 border-t border-ink/20 pt-5">
                    <p className="text-[9px] font-semibold tracking-[0.08em] uppercase">
                        Stock details
                    </p>
                    <div className="mt-3 overflow-x-auto border-y border-ink/20">
                        <table className="w-full min-w-[440px] text-left text-[9px]">
                            <thead className="border-b border-ink/20 text-ink/60 uppercase">
                                <tr>
                                    <th className="py-2.5 pr-3">Grind</th>
                                    <th className="py-2.5 pr-3">Weight</th>
                                    <th className="py-2.5 pr-3">Price</th>
                                    <th className="py-2.5">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variants.map((variant) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b border-ink/15 last:border-b-0"
                                    >
                                        <td className="py-3 pr-3 capitalize">
                                            {humanize(variant.grind_type) ??
                                                '-'}
                                        </td>
                                        <td className="py-3 pr-3">
                                            {variant.net_weight ?? '-'}
                                        </td>
                                        <td className="py-3 pr-3">
                                            {formatPrice(
                                                variant.sale_price ??
                                                    variant.regular_price,
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {variant.available_stock}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
