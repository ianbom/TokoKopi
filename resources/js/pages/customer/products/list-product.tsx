import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EditorialProductGrid from '@/components/storefront/editorial-product-grid';
import ShopLayout from '@/layouts/shop-layout';
import { detail, list } from '@/routes';

type ProductCard = {
    id: number;
    slug: string;
    title: string;
    short_description: string;
    price: number;
    sale_price: number | null;
    image_url: string | null;
};

type FilterOption = {
    value: string;
    label: string;
};

type Filters = {
    category: string;
    grind_type: string;
    process: string;
    price: string;
    sort: string;
    type: string;
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
    options: {
        categories: Array<{ id: number; name: string; slug: string }>;
        grindTypes: string[];
        processes: string[];
        priceRanges: FilterOption[];
        sorts: FilterOption[];
    };
};

type QuickLink = {
    label: string;
    filters: Partial<Pick<Filters, 'category' | 'type'>>;
};

const quickLinks = [
    { label: 'All', filters: {} },
    { label: 'Coffee Beans', filters: { category: 'coffee-beans' } },
    { label: 'Espresso', filters: { category: 'espresso' } },
    { label: 'Filter Coffee', filters: { category: 'filter-coffee' } },
    { label: 'Ready to Drink', filters: { category: 'ready-to-drink' } },
    { label: 'Best Sellers', filters: { type: 'best_seller' } },
] satisfies QuickLink[];

const humanize = (value: string) => value.replaceAll('_', ' ');

const cleanQuery = (filters: Filters) =>
    Object.fromEntries(
        Object.entries(filters).filter(
            ([key, value]) =>
                value !== '' && !(key === 'sort' && value === 'featured'),
        ),
    );

export default function ListProduct({ products, filters, options }: Props) {
    const [isFiltering, setIsFiltering] = useState(false);
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    const visit = (changes: Partial<Filters>) => {
        const next = { ...filters, ...changes };

        setOpenFilter(null);
        setIsFiltering(true);

        router.get(list.url(), cleanQuery(next), {
            onFinish: () => setIsFiltering(false),
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const selectedCategory = options.categories.find(
        (category) => category.slug === filters.category,
    );
    const selectedPrice = options.priceRanges.find(
        (price) => price.value === filters.price,
    );
    const selectedSort = options.sorts.find(
        (sort) => sort.value === filters.sort,
    );

    return (
        <ShopLayout>
            <Head title="List Product" />
            <section className="border-t border-b border-hairline">
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
                    <img
                        src="/images/product-list-hero.png"
                        alt="Coffee pouch and cup on a sunlit table"
                        fetchPriority="high"
                        decoding="async"
                        className="h-[220px] w-full object-cover lg:h-full"
                    />
                </div>
            </section>

            <section className="relative z-40 bg-canvas">
                <div className="relative z-40 grid grid-cols-2 border-b border-hairline text-[9px] font-semibold tracking-[0.06em] text-ink uppercase sm:grid-cols-3 lg:grid-cols-[1.15fr_.9fr_1.1fr_.8fr_1.2fr_1.45fr_1.4fr]">
                    <FilterMenu
                        id="category"
                        isOpen={openFilter === 'category'}
                        label={selectedCategory?.name ?? 'Category'}
                        onOpenChange={setOpenFilter}
                        options={options.categories.map((category) => ({
                            value: category.slug,
                            label: category.name,
                        }))}
                        value={filters.category}
                        onChange={(category) => visit({ category, type: '' })}
                    />
                    <FilterMenu
                        id="grind-type"
                        isOpen={openFilter === 'grind-type'}
                        label={
                            filters.grind_type
                                ? humanize(filters.grind_type)
                                : 'Grind Type'
                        }
                        onOpenChange={setOpenFilter}
                        options={options.grindTypes.map((grindType) => ({
                            value: grindType,
                            label: humanize(grindType),
                        }))}
                        value={filters.grind_type}
                        onChange={(grindType) =>
                            visit({ grind_type: grindType })
                        }
                    />
                    <FilterMenu
                        id="process"
                        isOpen={openFilter === 'process'}
                        label={filters.process || 'Process'}
                        onOpenChange={setOpenFilter}
                        options={options.processes.map((process) => ({
                            value: process,
                            label: process,
                        }))}
                        value={filters.process}
                        onChange={(process) => visit({ process })}
                    />
                    <FilterMenu
                        id="price"
                        isOpen={openFilter === 'price'}
                        label={selectedPrice?.label ?? 'Price'}
                        onOpenChange={setOpenFilter}
                        options={options.priceRanges}
                        value={filters.price}
                        onChange={(price) => visit({ price })}
                    />
                    <span className="hidden border-r border-hairline lg:block" />
                    <FilterMenu
                        id="sort"
                        isOpen={openFilter === 'sort'}
                        label={`Sort By: ${selectedSort?.label ?? 'Featured'}`}
                        onOpenChange={setOpenFilter}
                        options={options.sorts}
                        value={filters.sort}
                        onChange={(sort) => visit({ sort })}
                    />
                    <span className="flex min-h-[49px] items-center justify-center border-r border-hairline px-4 text-[10px] font-normal tracking-normal text-ink/70 normal-case sm:border-r-0">
                        Showing {products.total} products
                    </span>
                </div>

                <nav className="relative z-10 flex min-w-max items-center justify-center gap-10 overflow-x-auto border-b border-hairline px-8 py-[17px] text-[10px] font-semibold tracking-[0.06em] text-ink uppercase sm:gap-16">
                    {quickLinks.map((link) => {
                        const isActive = link.filters.category
                            ? filters.category === link.filters.category &&
                              filters.type === ''
                            : link.filters.type
                              ? filters.type === link.filters.type &&
                                filters.category === ''
                              : filters.category === '' && filters.type === '';

                        return (
                            <button
                                key={link.label}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() =>
                                    visit({
                                        category: link.filters.category ?? '',
                                        type: link.filters.type ?? '',
                                        grind_type: '',
                                        process: '',
                                        price: '',
                                    })
                                }
                                className={`relative border-b-2 py-1 whitespace-nowrap transition-colors duration-200 motion-reduce:transition-none ${
                                    isActive
                                        ? 'border-ink font-extrabold text-ink'
                                        : 'border-transparent font-semibold text-ink/55 hover:border-ink/35 hover:text-ink'
                                }`}
                            >
                                {link.label}
                            </button>
                        );
                    })}
                </nav>
            </section>
            <ProductGrid
                filterKey={JSON.stringify(cleanQuery(filters))}
                isFiltering={isFiltering}
                products={products.data}
            />
            <ProductPagination products={products} />
        </ShopLayout>
    );
}

function FilterMenu({
    id,
    isOpen,
    label,
    onOpenChange,
    options,
    value,
    onChange,
}: {
    id: string;
    isOpen: boolean;
    label: string;
    onOpenChange: (id: string | null) => void;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                onOpenChange(null);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onOpenChange(null);
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isOpen, onOpenChange]);

    const selectOption = (nextValue: string) => {
        onOpenChange(null);
        onChange(nextValue);
    };

    return (
        <div
            ref={menuRef}
            className={`relative border-r border-hairline ${isOpen ? 'z-50' : ''}`}
        >
            <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => onOpenChange(isOpen ? null : id)}
                className="flex h-[49px] w-full cursor-pointer items-center justify-center gap-6 px-5 transition-colors duration-200 hover:bg-canvas/70 motion-reduce:transition-none"
            >
                <span className="truncate">{label}</span>
                <ArrowRight
                    size={13}
                    strokeWidth={1.8}
                    className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>
            <div
                role="menu"
                aria-hidden={!isOpen}
                className={`absolute top-full left-0 z-50 max-h-72 min-w-full origin-top overflow-y-auto border border-hairline bg-canvas py-2 shadow-xl transition duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
                    isOpen
                        ? 'pointer-events-auto translate-y-0 scale-y-100 opacity-100'
                        : 'pointer-events-none -translate-y-1 scale-y-95 opacity-0'
                }`}
            >
                <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={value === ''}
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => selectOption('')}
                    className={`block w-full px-4 py-2 text-left text-[10px] tracking-[0.06em] uppercase hover:bg-sand ${
                        value === '' ? 'bg-sand' : ''
                    }`}
                >
                    All
                </button>
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={value === option.value}
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => selectOption(option.value)}
                        className={`block w-full px-4 py-2 text-left text-[10px] tracking-[0.06em] uppercase hover:bg-sand ${
                            value === option.value ? 'bg-sand' : ''
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ProductGrid({
    filterKey,
    isFiltering,
    products,
}: {
    filterKey: string;
    isFiltering: boolean;
    products: ProductCard[];
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
            <EditorialProductGrid
                products={products.map((product) => ({
                    id: product.id,
                    name: product.title,
                    imageUrl: product.image_url,
                    metadata: product.short_description,
                    price: product.sale_price ?? product.price,
                    href: detail.url({
                        query: { product: product.slug },
                    }),
                }))}
                animated
            />
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
