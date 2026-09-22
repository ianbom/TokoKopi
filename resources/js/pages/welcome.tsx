import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import EditorialProductGrid from '@/components/storefront/editorial-product-grid';
import ShopLayout from '@/layouts/shop-layout';
import { list } from '@/routes';

type Product = {
    id: number;
    name: string;
    title?: string;
    slug: string;
    price: number;
    image_url: string | null;
    category?: string | null;
    short_description?: string | null;
};

type Props = {
    wePresent: Product[];
    mostLoved: Product[];
    welcomeText?: string | null;
    welcomeCarousel?: {
        image_url: string;
        alt_text: string;
        sort_order: number;
    }[];
};

const images = {
    hero: '/logo/dc-bg.jpg',
    cta: '/dekalse-1.webp',
    ritual: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90',
    morning:
        'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=1400&q=90',
};

function OutlineLink({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex w-max items-center gap-4 rounded-full border border-current px-4 py-2 text-[10px] font-semibold tracking-[0.06em] uppercase">
            {children}
            <span className="text-sm leading-none text-primary">→</span>
        </span>
    );
}

export default function Welcome({
    wePresent,
    mostLoved,
    welcomeText,
    welcomeCarousel = [],
}: Props) {
    const slides = welcomeCarousel.length
        ? welcomeCarousel
        : [
              {
                  image_url: images.hero,
                  alt_text: 'Hand holding a Deklase coffee can',
                  sort_order: 1,
              },
          ];
    const heading = (welcomeText || 'Coffee\nwithout\nthe routine.')
        .split(/\r?\n/)
        .filter(Boolean);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const currentSlideIndex = activeSlide % slides.length;

    useEffect(() => {
        if (isPaused || slides.length < 2) {
            return;
        }

        const interval = window.setInterval(
            () => setActiveSlide((current) => (current + 1) % slides.length),
            5000,
        );

        return () => window.clearInterval(interval);
    }, [isPaused, slides.length]);

    const changeSlide = (direction: -1 | 1) =>
        setActiveSlide(
            (current) => (current + direction + slides.length) % slides.length,
        );

    return (
        <ShopLayout>
            <Head title="Deklase Coffee" />
            <div className="overflow-x-clip bg-canvas text-ink">
                <section className="grid min-h-[calc(100dvh-3.5rem)] grid-cols-1 border-b border-hairline sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-68px)] lg:grid-cols-2">
                    <div className="flex min-h-[430px] flex-col justify-between bg-white p-7 sm:p-12 lg:min-h-0 lg:p-14">
                        <Link href={list.url()} className="w-max">
                            <OutlineLink>Shop coffee</OutlineLink>
                        </Link>
                        <h1 className="font-condensed text-[clamp(64px,8vw,138px)] leading-[0.81] font-semibold tracking-[-0.055em] text-teal uppercase">
                            {heading.map((line, index) => (
                                <span key={`${line}-${index}`}>
                                    {line}
                                    {index < heading.length - 1 ? <br /> : null}
                                </span>
                            ))}
                        </h1>
                    </div>
                    <div
                        className="group relative h-full min-h-[clamp(340px,48dvh,720px)] overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                    >
                        {slides.map((slide, index) => (
                            <img
                                key={slide.image_url}
                                src={slide.image_url}
                                alt={slide.alt_text}
                                fetchPriority={index === 0 ? 'high' : undefined}
                                className={`absolute inset-0 h-full min-h-[clamp(340px,48dvh,720px)] w-full object-cover contrast-95 saturate-75 transition-opacity duration-700 ${
                                    index === currentSlideIndex
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                }`}
                            />
                        ))}
                        {slides.length > 1 ? (
                            <>
                                <button
                                    type="button"
                                    aria-label="Slide sebelumnya"
                                    onClick={() => changeSlide(-1)}
                                    className="absolute top-1/2 left-4 grid size-10 -translate-y-1/2 place-items-center border border-white/60 bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Slide berikutnya"
                                    onClick={() => changeSlide(1)}
                                    className="absolute top-1/2 right-4 grid size-10 -translate-y-1/2 place-items-center border border-white/60 bg-black/20 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                                <div className="absolute right-4 bottom-4 flex gap-2">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={slide.image_url}
                                            type="button"
                                            aria-label={`Tampilkan slide ${index + 1}`}
                                            aria-current={
                                                index === currentSlideIndex
                                            }
                                            onClick={() =>
                                                setActiveSlide(index)
                                            }
                                            className={`h-1.5 transition-all ${
                                                index === currentSlideIndex
                                                    ? 'w-7 bg-white'
                                                    : 'w-3 bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                </section>
                {/* <div className="flex min-h-8 items-center justify-center gap-4 overflow-hidden bg-teal px-4 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-white uppercase">
                    Slow roasted <i className="h-px w-4 bg-primary" /> Daily
                    rituals <i className="h-px w-4 bg-primary" /> Specialty
                    coffee <i className="h-px w-4 bg-primary" /> Good mornings
                    <i className="h-px w-4 bg-primary" /> Brew different
                </div> */}
                <EditorialProductGrid
                    products={wePresent.slice(0, 4).map((product) => ({
                        id: product.id,
                        name: product.title ?? product.name,
                        imageUrl: product.image_url,
                        metadata:
                            product.category ??
                            product.short_description ??
                            null,
                        price: product.price,
                        href: list.url({ query: { search: product.name } }),
                    }))}
                />
                <section
                    id="story"
                    className="grid border-b border-hairline lg:grid-cols-2"
                >
                    <img
                        src={images.ritual}
                        alt="Pour-over coffee ritual"
                        loading="lazy"
                        className="h-full min-h-[300px] w-full object-cover saturate-75"
                    />
                    <div className="bg-teal p-8 text-white sm:p-12 lg:p-14">
                        <span className="text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
                            Our approach
                        </span>
                        <h2 className="mt-5 max-w-xl font-condensed text-[clamp(56px,5.8vw,95px)] leading-[0.81] font-semibold tracking-[-0.055em] uppercase">
                            Better coffee
                            <br />
                            starts with
                            <br />
                            better details.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-5 text-white/90">
                            Carefully selected beans, thoughtful roasting
                            profiles, uncomplicated brewing. Great coffee does
                            not need to be complicated.
                        </p>
                        <a
                            href="#story"
                            className="mt-6 inline-block text-xs font-semibold tracking-[0.06em] text-primary uppercase"
                        >
                            Read our story ↗
                        </a>
                    </div>
                </section>

                <EditorialProductGrid
                    products={mostLoved.slice(0, 4).map((product) => ({
                        id: product.id,
                        name: product.title ?? product.name,
                        imageUrl: product.image_url,
                        metadata:
                            product.category ??
                            product.short_description ??
                            null,
                        price: product.price,
                        href: list.url({ query: { search: product.name } }),
                    }))}
                />
                <section className="grid border-b border-hairline lg:grid-cols-[.9fr_1.1fr]">
                    <div className="flex min-h-[230px] flex-col justify-between bg-white p-7 sm:p-12">
                        <p className="max-w-xs text-xs leading-5 text-teal sm:text-sm">
                            Good coffee does not need an occasion. Sometimes the
                            ritual is enough.
                        </p>
                        <h2 className="font-condensed text-[clamp(56px,5.7vw,100px)] leading-[0.81] font-semibold tracking-[-0.055em] text-teal uppercase">
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
                        src={images.cta}
                        alt="Coffee to go in the morning"
                        loading="lazy"
                        className="min-h-[230px] w-full object-cover saturate-75"
                    />
                </section>
            </div>
        </ShopLayout>
    );
}
