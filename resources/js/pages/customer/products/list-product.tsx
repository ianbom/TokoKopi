import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import EditorialProductGrid from '@/components/storefront/editorial-product-grid';
import ShopLayout from '@/layouts/shop-layout';
import { detail, list } from '@/routes';

type ProductCard = {
    id: number;
    slug: string;
    title: string;
    short_description: string;
    price: number;
    price_from: boolean;
    sale_price: number | null;
    image_url: string | null;
    variants: { is_active: boolean; stock: number }[];
};

type Filters = {
    category: string;
};

type Props = {
    products: {
        data: ProductCard[];
        total: number;
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: Filters;
    options: { categories: { id: number; name: string; slug: string }[] };
};

const cleanQuery = ({ category }: Filters) => (category ? { category } : {});

export default function ListProduct({ products, filters, options }: Props) {
    const [isFiltering, setIsFiltering] = useState(false);
    const categories = [{ name: 'All', slug: '' }, ...options.categories];

    const visit = (changes: Partial<Filters>) => {
        const next = { ...filters, ...changes };

        setIsFiltering(true);

        router.get(list.url(), cleanQuery(next), {
            onFinish: () => setIsFiltering(false),
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <ShopLayout>
            <Head title="List Product" />
            <section className="overflow-hidden border-t border-b border-hairline">
                <div className="grid lg:h-[327px] lg:grid-cols-[48.7%_51.3%]">
                    <div className="flex min-h-[280px] flex-col justify-between bg-[#f1e8dc] px-7 py-7 sm:px-12 sm:py-10 lg:min-h-0 lg:px-12 lg:py-14">
                        <div>
                            <p className="text-[9px] font-semibold tracking-[0.08em] text-ink uppercase">
                                Collection
                            </p>
                            <h1 className="mt-2 font-condensed text-[clamp(44px,5.6vw,80px)] leading-[0.86] font-semibold tracking-[-0.045em] text-ink uppercase">
                                Shop All Coffee
                            </h1>
                            <p className="mt-4 max-w-[460px] text-[12px] leading-[1.45] text-ink/85 sm:text-[14px]">
                                Explore Deklase&apos;s full collection of whole
                                bean coffee, ready-to-drink cans, and everyday
                                ritual essentials. Thoughtfully roasted,
                                beautifully packaged, and designed for modern
                                coffee routines.
                            </p>
                        </div>
                        <p className="mt-7 text-[9px] font-semibold tracking-[0.08em] text-ink uppercase">
                            {products.total} Products
                        </p>
                    </div>
                    <div className="relative h-[220px] w-full lg:h-full lg:min-h-0">
                        <img
                            src="/DK - website - header coffee 2.png"
                            alt="Coffee pouch and cup on a sunlit table"
                            fetchPriority="high"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="relative z-40 bg-canvas">
                <nav
                    aria-label="Product categories"
                    className="catalog-filter-scrollbar relative z-10 flex w-full min-w-0 items-center justify-start gap-6 overflow-x-auto border-b border-hairline px-8 py-[17px] text-[10px] font-semibold tracking-[0.06em] text-ink uppercase sm:gap-10 lg:justify-center-safe lg:gap-16"
                >
                    {categories.map((category) => {
                        const isActive = filters.category === category.slug;

                        return (
                            <button
                                key={category.slug}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() =>
                                    visit({ category: category.slug })
                                }
                                className={`relative shrink-0 border-b-2 py-1 whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${
                                    isActive
                                        ? 'border-ink font-extrabold text-ink'
                                        : 'border-transparent font-semibold text-ink/80 hover:border-ink/35 hover:text-ink'
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </nav>
            </section>
            <ProductGrid
                filterKey={JSON.stringify(cleanQuery(filters))}
                isFiltering={isFiltering}
                products={products.data}
                onClearFilters={() => visit({ category: '' })}
            />
            <ProductPagination products={products} />
        </ShopLayout>
    );
}

function ProductGrid({
    filterKey,
    isFiltering,
    products,
    onClearFilters,
}: {
    filterKey: string;
    isFiltering: boolean;
    products: ProductCard[];
    onClearFilters: () => void;
}) {
    return (
        <div
            key={filterKey}
            aria-busy={isFiltering}
            className={`border-t border-hairline transition duration-200 motion-reduce:transform-none motion-reduce:transition-none ${
                isFiltering
                    ? 'translate-y-1 opacity-50'
                    : 'translate-y-0 opacity-100'
            }`}
        >
            {products.length > 0 ? (
                <EditorialProductGrid
                    products={products.map((product) => ({
                        id: product.id,
                        name: product.title,
                        imageUrl: product.image_url,
                        metadata: product.short_description,
                        price: product.sale_price ?? product.price,
                        priceFrom: product.price_from,
                        soldOut: !product.variants.some(
                            (variant) => variant.is_active && variant.stock > 0,
                        ),
                        href: detail.url({
                            query: { product: product.slug },
                        }),
                    }))}
                    animated
                />
            ) : (
                <section
                    aria-labelledby="empty-product-title"
                    className="flex min-h-[36vh] flex-col items-center justify-center border-b border-hairline bg-white px-6 py-16 text-center"
                >
                    <span
                        aria-hidden="true"
                        className="mb-6 h-px w-12 bg-primary"
                    />
                    <h2
                        id="empty-product-title"
                        className="font-condensed text-4xl tracking-wide text-teal uppercase sm:text-5xl"
                    >
                        No coffee found
                    </h2>
                    <p
                        role="status"
                        className="mt-3 max-w-sm text-sm leading-6 text-body"
                    >
                        Try adjusting your filters or clear them to explore the
                        full collection.
                    </p>
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-7 inline-flex min-h-11 items-center justify-center border border-teal bg-teal px-6 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-white hover:text-teal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal motion-reduce:transition-none"
                    >
                        Clear all filters
                    </button>
                </section>
            )}
        </div>
    );
}

function ProductPagination({ products }: { products: Props['products'] }) {
    if (products.last_page <= 1) {
        return null;
    }

    const previous = products.links[0];
    const next = products.links.at(-1);

    return (
        <nav
            aria-label="Product pagination"
            className="flex items-center justify-between gap-4 border-b border-hairline bg-white px-5 py-5 text-[10px] font-semibold tracking-[0.08em] text-teal uppercase sm:px-8"
        >
            <div className="hidden text-body sm:block">
                {products.from}–{products.to} of {products.total}
            </div>
            <div className="flex items-center gap-1">
                {previous?.url ? (
                    <Link
                        href={previous.url}
                        preserveScroll
                        preserveState
                        replace
                        className="border border-hairline bg-white px-3 py-2 text-teal transition-colors hover:bg-sand"
                    >
                        Previous
                    </Link>
                ) : (
                    <span
                        aria-disabled="true"
                        className="px-3 py-2 text-body/40"
                    >
                        Previous
                    </span>
                )}
                {products.links.slice(1, -1).map((link, index) => {
                    const label = link.label.replace(/<[^>]+>/g, '').trim();

                    if (!link.url) {
                        return (
                            <span
                                key={`${label}-${index}`}
                                aria-disabled="true"
                                className="px-3 py-2 text-body/40"
                            >
                                {label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={`${label}-${index}`}
                            href={link.url}
                            preserveScroll
                            preserveState
                            replace
                            aria-current={link.active ? 'page' : undefined}
                            className={`border border-hairline px-3 py-2 transition-colors hover:bg-sand ${link.active ? 'bg-teal text-white' : 'bg-white text-teal'}`}
                        >
                            {label}
                        </Link>
                    );
                })}
                {next?.url ? (
                    <Link
                        href={next.url}
                        preserveScroll
                        preserveState
                        replace
                        className="border border-hairline bg-white px-3 py-2 text-teal transition-colors hover:bg-sand"
                    >
                        Next
                    </Link>
                ) : (
                    <span
                        aria-disabled="true"
                        className="px-3 py-2 text-body/40"
                    >
                        Next
                    </span>
                )}
            </div>
        </nav>
    );
}
