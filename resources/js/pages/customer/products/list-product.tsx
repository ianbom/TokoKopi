import { InfiniteScroll, Link } from '@inertiajs/react';
import { memo } from 'react';
import ShopLayout from '@/layouts/shop-layout';
import { detail } from '@/routes';

const images = {
    hero: 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1500&q=90',
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

type Props = {
    products: {
        data: ProductCard[];
    };
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

export default function ListProduct({ products }: Props) {
    return (
        <ShopLayout>
              <section className="grid min-h-[560px] grid-cols-1 border-b border-hairline lg:grid-cols-[.95fr_1.05fr]">
                                <div className="flex min-h-[480px] flex-col justify-between bg-sand p-8 sm:p-12 lg:min-h-0 lg:p-16">
                                    <p className="text-sm leading-5">
                                        Roasted slowly. Made deliberately.
                                        <br />
                                        Coffee for everyday rituals.
                                    </p>
                                    <h1 className="font-condensed text-[clamp(64px,8vw,138px)] leading-[0.81] font-semibold tracking-[-0.055em] uppercase">
                                        Coffee
                                        <br />
                                        without
                                        <br />
                                        the routine.
                                    </h1>
                                </div>
                                <img
                                    src={images.hero}
                                    alt="Hand holding a Declasse coffee can"
                                    fetchPriority="high"
                                    className="h-full min-h-[320px] w-full object-cover contrast-95 saturate-75"
                                />
                            </section>
            <div className="flex min-h-8 items-center justify-center gap-4 overflow-hidden bg-surface-dark px-4 text-[10px] tracking-[0.12em] whitespace-nowrap text-canvas uppercase">
                Slow roasted <i className="h-px w-4 bg-oat" /> Daily rituals{' '}
                <i className="h-px w-4 bg-oat" /> Specialty coffee{' '}
                <i className="h-px w-4 bg-oat" /> Good mornings{' '}
                <i className="h-px w-4 bg-oat" /> Brew different
            </div>
            <ProductGrid products={products.data} />
        </ShopLayout>
    );
}

const ProductGrid = memo(function ProductGrid({
    products,
}: {
    products: ProductCard[];
}) {
    return (
        <InfiniteScroll data="products" buffer={400}>
            {({ loading }) => (
                <>
                    <div className="grid grid-cols-2 border-t border-hairline sm:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductTile key={product.id} product={product} />
                        ))}
                    </div>
                    {loading && <ProductGridSkeleton />}
                </>
            )}
        </InfiniteScroll>
    );
});

function ProductGridSkeleton() {
    return (
        <div
            aria-label="Loading products"
            aria-busy="true"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="relative aspect-[4/5] overflow-hidden border-r border-b border-hairline bg-oat"
                >
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                    <div className="absolute right-5 bottom-6 left-5 space-y-3 sm:right-7 sm:bottom-7 sm:left-7">
                        <div className="h-6 w-4/5 animate-pulse bg-canvas/50" />
                        <div className="h-3 w-1/2 animate-pulse bg-canvas/40" />
                        <div className="h-4 w-1/3 animate-pulse bg-canvas/50" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const ProductTile = memo(function ProductTile({
    product,
}: {
    product: ProductCard;
}) {
    return (
        <article className="group relative overflow-hidden border-r border-b border-hairline bg-ink text-canvas">
            <Link
                href={detail.url({ query: { product: product.slug } })}
                className="relative isolate block aspect-[4/5] overflow-hidden"
            >
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-oat px-6 text-center text-[11px] font-semibold tracking-[0.12em] text-body uppercase">
                        Image unavailable
                    </div>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/55" />
                <div className="absolute right-5 bottom-6 left-5 z-10 sm:right-7 sm:bottom-7 sm:left-7">
                    <h3 className="line-clamp-2 font-serif text-[21px] leading-[1.05] font-normal sm:text-[25px] lg:text-[28px]">
                        {product.title}
                    </h3>
                    <p className="mt-2 line-clamp-1 text-[12px] leading-5 text-canvas/85 sm:text-[14px]">
                        {product.short_description}
                    </p>
                    <strong className="mt-3 block text-[13px] font-medium sm:text-[14px]">
                        {formatPrice(product.sale_price ?? product.price)}
                    </strong>
                </div>
            </Link>
        </article>
    );
});
