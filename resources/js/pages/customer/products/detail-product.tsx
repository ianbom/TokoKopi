import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { addProductVariantToCart as addProductVariantToCartRoute } from '@/actions/App/Http/Controllers/Customer/CartController';
import {
    destroyProduct as destroyWishlistProductRoute,
    store as storeWishlistProductRoute,
} from '@/actions/App/Http/Controllers/Customer/WishlistController';
import HTMLRender from '@/components/HTMLRender';
import ShopLayout from '@/layouts/shop-layout';
import { getVariantSelection } from '@/lib/product-variant-selection';
import type { VariantOption } from '@/lib/product-variant-selection';

type ProductImage = {
    url: string;
    alt: string;
};

type Variant = VariantOption & {
    sku: string | null;
    length: number;
    width: number;
    height: number;
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
    grind_type: string | null;
    tasting_notes: string | null;
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

const grindLabel = (grind: string | null) =>
    ({ whole_bean: 'Beans', fine: 'Fine', medium: 'Medium', coarse: 'Coarse' })[
        grind ?? ''
    ] ??
    humanize(grind) ??
    'Tanpa grind';

const optionClass = (active: boolean) =>
    'min-h-11 rounded-none border px-4 py-2 text-[11px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40 ' +
    (active
        ? 'border-ink bg-ink text-canvas'
        : 'border-ink/45 hover:border-ink enabled:hover:bg-sand');

export default function DetailProduct({ product }: Props) {
    return <DetailProductPage key={product.id} product={product} />;
}

function DetailProductPage({ product }: { product: ProductDetail }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState<
        string | null | undefined
    >(
        () =>
            getVariantSelection(product.variants, undefined, undefined)
                .initialWeight,
    );
    const [selectedGrind, setSelectedGrind] = useState<
        string | null | undefined
    >(undefined);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);
    const cartForm = useForm({ quantity: 1 });
    const wishlistForm = useForm({});
    const selection = getVariantSelection(
        product.variants,
        selectedWeight,
        selectedGrind,
    );
    const selectedVariant = selection.variant;
    const priceVariant = selectedVariant ?? selection.previewVariant;
    const availableStock = selectedVariant?.available_stock ?? 0;
    const isAvailable = availableStock > 0;
    const regularPrice = priceVariant?.regular_price ?? product.price;
    const salePrice = priceVariant
        ? priceVariant.sale_price
        : product.sale_price;
    const price = salePrice ?? regularPrice;
    const hasDiscount = salePrice !== null && salePrice < regularPrice;
    const gallery = [
        ...product.images,
        ...product.variants.flatMap((variant) =>
            variant.image_url
                ? [
                      {
                          url: variant.image_url,
                          alt: [product.title, variant.net_weight]
                              .filter(Boolean)
                              .join(' '),
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
        ['PRODUCER', humanize(product.grind_type) ?? product.category],
        ['TASTING NOTES', product.tasting_notes],
    ].filter(([, value]) => value) as Array<[string, string]>;

    const resetQuantity = () => {
        setQuantity(1);
        cartForm.setData('quantity', 1);
        cartForm.clearErrors('quantity');
    };
    const showVariantImage = (variant: VariantOption | null) => {
        const index = gallery.findIndex(
            (image) => image.url === variant?.image_url,
        );
        setActiveImageIndex(index >= 0 ? index : 0);
    };
    const selectWeight = (weight: string | null) => {
        if (weight === selectedWeight) {
            return;
        }

        setSelectedWeight(weight);
        setSelectedGrind(undefined);
        resetQuantity();
        showVariantImage(
            getVariantSelection(product.variants, weight, undefined).variant,
        );
    };
    const selectGrind = (grind: string | null) => {
        setSelectedGrind(grind);
        resetQuantity();
        showVariantImage(
            getVariantSelection(product.variants, selectedWeight, grind)
                .variant,
        );
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
                <section className="grid min-w-0 grid-cols-1 border-b border-hairline lg:grid-cols-2">
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
                            <HTMLRender
                                html={
                                    product.description ||
                                    product.short_description
                                }
                                className="mt-3 max-w-prose text-[11px] leading-5 text-ink/80 sm:text-[12px]"
                            />
                            <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-[19px] font-medium tracking-[-0.02em]">
                                <span>
                                    {!selectedVariant &&
                                        selection.previewPrice !== null &&
                                        'Mulai dari '}
                                    {formatPrice(price)}
                                </span>
                                {hasDiscount && (
                                    <s className="text-[13px] font-normal text-ink/80">
                                        {formatPrice(regularPrice)}
                                    </s>
                                )}
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

                            {selection.weights.length > 0 && (
                                <div className="mt-7 space-y-5">
                                    <fieldset>
                                        <legend className="text-[11px] font-medium tracking-[0.02em]">
                                            Weight
                                        </legend>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selection.weights.map((weight) => (
                                                <button
                                                    key={
                                                        weight.value ??
                                                        'default'
                                                    }
                                                    type="button"
                                                    aria-pressed={
                                                        selectedWeight ===
                                                        weight.value
                                                    }
                                                    disabled={!weight.available}
                                                    onClick={() =>
                                                        selectWeight(
                                                            weight.value,
                                                        )
                                                    }
                                                    className={optionClass(
                                                        selectedWeight ===
                                                            weight.value,
                                                    )}
                                                >
                                                    {weight.value || 'Default'}
                                                    {!weight.available && (
                                                        <span className="block text-[9px]">
                                                            Stok habis
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </fieldset>
                                    {selection.requiresGrind && (
                                        <fieldset aria-describedby="variant-selection-status">
                                            <legend className="text-[11px] font-medium tracking-[0.02em]">
                                                Grind Request
                                            </legend>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {selection.grinds.map(
                                                    (grind) => (
                                                        <button
                                                            key={
                                                                grind.value ??
                                                                'no-grind'
                                                            }
                                                            type="button"
                                                            aria-pressed={
                                                                selectedGrind ===
                                                                grind.value
                                                            }
                                                            disabled={
                                                                !grind.available
                                                            }
                                                            onClick={() =>
                                                                selectGrind(
                                                                    grind.value,
                                                                )
                                                            }
                                                            className={optionClass(
                                                                selectedGrind ===
                                                                    grind.value,
                                                            )}
                                                        >
                                                            {grindLabel(
                                                                grind.value,
                                                            )}
                                                            {!grind.available && (
                                                                <span className="block text-[9px]">
                                                                    {grind.exists
                                                                        ? 'Stok habis'
                                                                        : 'Tidak tersedia'}
                                                                </span>
                                                            )}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </fieldset>
                                    )}
                                </div>
                            )}
                            <p
                                id="variant-selection-status"
                                role="status"
                                className="mt-3 text-[11px] text-ink/70"
                            >
                                {isAvailable
                                    ? ''
                                    : selection.requiresGrind &&
                                        selectedGrind === undefined
                                      ? 'Pilih grind untuk berat yang dipilih.'
                                      : 'Produk ini sedang habis.'}
                            </p>

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
                                                disabled={
                                                    !isAvailable ||
                                                    quantity <= 1
                                                }
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
                                                    : selection.requiresGrind &&
                                                        selectedGrind ===
                                                            undefined
                                                      ? 'Pilih grind'
                                                      : 'Add to bag'}
                                            </span>
                                            {selectedVariant && (
                                                <span className="hidden shrink-0 sm:inline">
                                                    — {formatPrice(price)}
                                                </span>
                                            )}
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
                                            <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
                                                {formatPrice(
                                                    variant.sale_price ??
                                                        variant.regular_price,
                                                )}
                                                {variant.sale_price !== null &&
                                                    variant.sale_price <
                                                        variant.regular_price && (
                                                        <s className="text-ink/80">
                                                            {formatPrice(
                                                                variant.regular_price,
                                                            )}
                                                        </s>
                                                    )}
                                            </span>
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
