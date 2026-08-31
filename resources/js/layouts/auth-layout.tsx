import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { home } from '@/routes';

type AuthLayoutProps = {
    title?: string;
    description?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    heroImage?: { src: string; alt: string };
    heroOverlay?: ReactNode;
    contentClassName?: string;
    children: ReactNode;
};

const defaultHero = {
    src: 'https://images.unsplash.com/photo-1515442261605-65987783cb6a?auto=format&fit=crop&w=1500&q=90',
    alt: 'Kopi Declasse dalam suasana hangat dan tenang',
};

export default function AuthLayout({
    title,
    description,
    breadcrumbs,
    heroImage,
    heroOverlay,
    contentClassName,
    children,
}: AuthLayoutProps) {
    const resolvedHeroImage = heroImage ?? defaultHero;

    return (
        <div className="min-h-svh bg-canvas font-sans text-ink">
            <div className="grid min-h-svh lg:grid-cols-[.95fr_1.05fr]">
                <section className="relative hidden min-h-svh overflow-hidden border-r border-hairline bg-surface-dark text-canvas lg:flex lg:flex-col lg:justify-between">
                    <img
                        src={resolvedHeroImage.src}
                        alt={resolvedHeroImage.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/42" />

                    <div className="relative z-10 flex items-start justify-between border-b border-canvas/30 px-10 py-7 xl:px-14">
                        <Link
                            href={home()}
                            className="font-serif text-[34px] leading-none tracking-[-0.045em] hover:text-oat"
                        >
                            Declasse
                        </Link>
                        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase">
                            Coffee roastery
                        </span>
                    </div>

                    <div className="relative z-10 border-t border-canvas/30 px-10 py-10 xl:px-14 xl:py-12">
                        <p className="text-[9px] font-semibold tracking-[0.12em] text-oat uppercase">
                            Your daily ritual
                        </p>
                        <p className="mt-4 max-w-xl font-condensed text-[clamp(54px,6vw,94px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase">
                            Good coffee.
                            <br />
                            Made personal.
                        </p>
                        <Link
                            href={home()}
                            className="mt-7 inline-flex items-center gap-3 rounded-none border border-canvas px-5 py-3 text-[10px] font-semibold tracking-[0.1em] uppercase hover:bg-canvas hover:text-ink"
                        >
                            Back to shop <ArrowRight size={15} />
                        </Link>
                    </div>

                    {heroOverlay && (
                        <div className="relative z-20">{heroOverlay}</div>
                    )}
                </section>

                <main className="flex min-h-svh flex-col bg-canvas">
                    <header className="flex items-center justify-between border-b border-hairline px-6 py-5 sm:px-10 lg:px-12 xl:px-16">
                        <Link
                            href={home()}
                            className="font-serif text-[30px] leading-none tracking-[-0.045em] hover:text-primary lg:hidden"
                        >
                            Declasse
                        </Link>
                        <p className="ml-auto text-[9px] font-semibold tracking-[0.1em] text-ink/60 uppercase">
                            Secure member access
                        </p>
                    </header>

                    <div className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 xl:py-14">
                        <div
                            className={[
                                'mx-auto w-full max-w-[500px]',
                                contentClassName ?? '',
                            ].join(' ')}
                        >
                            {breadcrumbs && breadcrumbs.length > 0 && (
                                <nav
                                    aria-label="Breadcrumb"
                                    className="mb-7 flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase"
                                >
                                    {breadcrumbs.map((crumb, index) => (
                                        <div
                                            key={`${crumb.label}-${index}`}
                                            className="flex items-center gap-2"
                                        >
                                            {crumb.href ? (
                                                <Link
                                                    href={crumb.href}
                                                    className="text-ink/55 hover:text-primary"
                                                >
                                                    {crumb.label}
                                                </Link>
                                            ) : (
                                                <span>{crumb.label}</span>
                                            )}
                                            {index < breadcrumbs.length - 1 && (
                                                <span className="text-ink/30">
                                                    /
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            )}

                            {(title || description) && (
                                <div className="mb-8 border-b border-hairline pb-7">
                                    <p className="text-[9px] font-semibold tracking-[0.1em] text-primary uppercase">
                                        Declasse account
                                    </p>
                                    {title && (
                                        <h1 className="mt-3 font-condensed text-[clamp(46px,6vw,72px)] leading-[0.82] font-semibold tracking-[-0.05em] uppercase">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="mt-5 max-w-[42ch] text-[12px] leading-[1.55] text-ink/70">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {children}
                        </div>
                    </div>

                    <footer className="flex items-center justify-between border-t border-hairline px-6 py-4 text-[8px] font-semibold tracking-[0.08em] text-ink/50 uppercase sm:px-10 lg:px-12 xl:px-16">
                        <span>Declasse Coffee</span>
                        <span>Private · Secure</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}
