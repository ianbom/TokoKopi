import { Link } from '@inertiajs/react';
import { memo } from 'react';

export type EditorialProduct = {
    id: number;
    name: string;
    imageUrl: string | null;
    metadata: string | null;
    price: number;
    href: string;
};

type EditorialProductGridProps = {
    products: EditorialProduct[];
    animated?: boolean;
};

export function EditorialProductGridSkeleton() {
    return (
        <div
            aria-label="Loading products"
            aria-busy="true"
            className="grid grid-cols-2 border-b border-hairline lg:grid-cols-4"
        >
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="border-r border-b border-hairline bg-white p-5 sm:p-7 lg:p-8"
                >
                    <div className="aspect-[4/5] animate-pulse bg-surface-soft sm:aspect-square" />
                    <div className="space-y-2 pt-5">
                        <div className="mx-auto h-3 w-8 animate-pulse bg-surface-muted" />
                        <div className="mx-auto h-3 w-3/4 animate-pulse bg-surface-muted" />
                        <div className="mx-auto h-3 w-1/2 animate-pulse bg-surface-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90';

const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    })
        .format(value)
        .replace('IDR', 'Rp')
        .trim();

function EditorialProductGrid({
    products,
    animated = false,
}: EditorialProductGridProps) {
    return (
        <section className="grid grid-cols-2 border-b border-hairline lg:grid-cols-4">
            {products.map((product, index) => (
                <Link
                    key={product.id}
                    href={product.href}
                    style={
                        animated
                            ? {
                                  animationDelay: `${Math.min(index, 7) * 45}ms`,
                              }
                            : undefined
                    }
                    className={`group border-r border-b border-hairline bg-white p-5 last:border-r-0 sm:p-7 lg:p-8 ${animated ? 'animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none' : ''}`}
                >
                    <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-surface-soft sm:aspect-square">
                        <img
                            src={product.imageUrl ?? FALLBACK_IMAGE}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                    </div>
                    <div className="pt-5 text-center text-teal">
                        <span className="text-[10px] font-semibold tracking-[0.12em]">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-2 text-xs font-semibold tracking-[0.04em] uppercase sm:text-sm">
                            {product.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[11px] text-body">
                            {product.metadata ?? 'Specialty coffee'}
                        </p>
                        <strong className="mt-2 block text-xs font-semibold">
                            {formatPrice(product.price)}
                        </strong>
                    </div>
                </Link>
            ))}
        </section>
    );
}

export default memo(EditorialProductGrid);
