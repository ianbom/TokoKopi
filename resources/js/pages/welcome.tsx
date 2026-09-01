import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import ShopLayout from '@/layouts/shop-layout';
import { list } from '@/routes';

type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    label: string;
};

const images = {
    hero: 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1500&q=90',
    ritual: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90',
    bean: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=90',
    can: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=90',
    bag: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=90',
    morning:
        'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=1400&q=90',
};

const featuredProducts: Product[] = [
    {
        id: 1,
        name: 'Espresso No. 01',
        price: 16,
        image: images.bag,
        label: 'Chocolate · Hazelnut',
    },
    {
        id: 2,
        name: 'Latte No. 02',
        price: 18,
        image: images.bean,
        label: 'Brown sugar · Vanilla',
    },
    {
        id: 3,
        name: 'Filter No. 03',
        price: 17,
        image: images.can,
        label: 'Citrus · Peach',
    },
    {
        id: 4,
        name: 'Decaf No. 04',
        price: 16,
        image: images.ritual,
        label: 'Cocoa · Almond',
    },
];

const ritualProducts: Product[] = [
    {
        id: 11,
        name: 'Ethiopia',
        price: 22,
        image: images.bag,
        label: 'Floral · Peach',
    },
    {
        id: 12,
        name: 'Colombia',
        price: 20,
        image: images.bean,
        label: 'Caramel · Citrus',
    },
    {
        id: 13,
        name: 'Brazil',
        price: 19,
        image: images.can,
        label: 'Chocolate · Almond',
    },
    {
        id: 14,
        name: 'Kenya',
        price: 23,
        image: images.ritual,
        label: 'Berry · Black tea',
    },
];

function OutlineLink({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex w-max items-center gap-5 rounded-none border border-current px-4 py-2 text-[11px] tracking-[0.04em] uppercase">
            {children}
            <span className="text-base leading-none">→</span>
        </span>
    );
}

function ProductGrid({ products }: { products: Product[] }) {
    return (
        <section className="grid grid-cols-2 border-b border-surface-dark bg-surface-dark lg:grid-cols-4">
            {products.map((product, index) => (
                <Link
                    key={product.id}
                    href={list.url({ query: { search: product.name } })}
                    className="group relative isolate aspect-[4/5] overflow-hidden border-r border-b border-surface-dark text-canvas even:border-r-0 sm:aspect-square lg:last:border-r-0 lg:even:border-r"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50" />
                    <span className="absolute top-5 left-5 z-10 text-sm font-medium sm:top-6 sm:left-6">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="absolute right-5 bottom-6 left-5 z-10 sm:right-7 sm:bottom-7 sm:left-7">
                        <h3 className="font-serif text-xl leading-none font-normal sm:text-2xl lg:text-[28px]">
                            {product.name}
                        </h3>
                        <p className="mt-2 text-xs text-canvas/90 sm:text-sm">
                            {product.label}
                        </p>
                        <strong className="mt-3 block text-sm font-medium">
                            {'$'}
                            {product.price}
                        </strong>
                    </div>
                </Link>
            ))}
        </section>
    );
}

export default function Welcome() {
    return (
        <ShopLayout>
            <Head title="Declasse Coffee" />
            <div className="overflow-x-clip bg-canvas text-ink">
                <section className="grid min-h-[560px] grid-cols-1 border-b border-hairline lg:grid-cols-[.95fr_1.05fr]">
                    <div className="flex min-h-[480px] flex-col justify-between bg-sand p-8 sm:p-12 lg:min-h-0 lg:p-16">
                        <p className="text-sm leading-5">
                            Roasted slowly. Made deliberately.
                            <br />
                            Coffee for everyday rituals.
                        </p>
                        <Link href={list.url()} className="w-max">
                            <OutlineLink>Shop coffee</OutlineLink>
                        </Link>
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
                <ProductGrid products={featuredProducts} />
                <section
                    id="story"
                    className="grid border-b border-hairline lg:min-h-[380px] lg:grid-cols-2"
                >
                    <img
                        src={images.ritual}
                        alt="Pour-over coffee ritual"
                        loading="lazy"
                        className="h-full min-h-[300px] w-full object-cover saturate-75"
                    />
                    <div className="bg-surface-dark p-9 text-canvas sm:p-12 lg:p-16">
                        <span className="text-[11px] tracking-[0.08em] text-oat uppercase">
                            Our approach
                        </span>
                        <h2 className="mt-5 font-condensed text-[clamp(56px,5.8vw,95px)] leading-[0.81] font-semibold tracking-[-0.055em] uppercase">
                            Better coffee
                            <br />
                            starts with
                            <br />
                            better details.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-5">
                            We work with carefully selected beans, thoughtful
                            roasting profiles and uncomplicated brewing —
                            because great coffee doesn’t need to be complicated.
                        </p>
                        <a
                            href="#story"
                            className="mt-6 inline-block text-xs font-medium tracking-[0.06em] text-primary uppercase"
                        >
                            Read our story ↗
                        </a>
                    </div>
                </section>
                <ProductGrid products={ritualProducts} />
                <section className="grid min-h-[220px] border-b border-hairline lg:min-h-[250px] lg:grid-cols-[.9fr_1.1fr]">
                    <div className="flex min-h-[220px] flex-col justify-between p-8 sm:p-12">
                        <p className="text-sm leading-5">
                            Good coffee doesn’t need
                            <br />
                            an occasion. Sometimes the
                            <br />
                            ritual is enough.
                        </p>
                        <h2 className="font-condensed text-[clamp(56px,5.7vw,100px)] leading-[0.81] font-semibold tracking-[-0.055em] uppercase">
                            Make
                            <br />
                            mornings
                            <br />
                            matter.
                        </h2>
                        <Link href={list.url()} className="w-max">
                            <OutlineLink>Shop coffee</OutlineLink>
                        </Link>
                    </div>
                    <img
                        src={images.morning}
                        alt="Coffee to go in the morning"
                        loading="lazy"
                        className="h-full min-h-[220px] w-full object-cover saturate-75 lg:min-h-[250px]"
                    />
                </section>
            </div>
        </ShopLayout>
    );
}
