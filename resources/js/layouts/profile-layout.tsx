import { Head, Link } from '@inertiajs/react';
import { Bell, Heart, LogOut, MapPin, Package, User } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';

import ShopLayout from '@/layouts/shop-layout';
import {
    logout,
    manageAddress,
    myOrder,
    myProfile,
    myWishlist,
    notifications,
} from '@/routes';

const ACCOUNT_NAV = [
    {
        id: 'my-profile',
        href: myProfile.url(),
        label: 'Pengaturan Profil',
        mobileLabel: 'Profil',
        icon: User,
    },
    {
        id: 'list-order',
        href: myOrder.url(),
        label: 'Pesanan Saya',
        mobileLabel: 'Pesanan',
        icon: Package,
    },
    {
        id: 'address',
        href: manageAddress.url(),
        label: 'Buku Alamat',
        mobileLabel: 'Alamat',
        icon: MapPin,
    },
    {
        id: 'wishlist',
        href: myWishlist.url(),
        label: 'Wishlist Saya',
        mobileLabel: 'Wishlist',
        icon: Heart,
    },
    {
        id: 'notifications',
        href: notifications.url(),
        label: 'Notifikasi',
        mobileLabel: 'Notifikasi',
        icon: Bell,
    },
];

type Breadcrumb = {
    label: string;
    href?: string;
};

type ProfileLayoutProps = {
    children: ReactNode;
    title: ReactNode | string;
    pageTitle: string;
    subtitle: string;
    activePath: string;
    breadcrumbs: Breadcrumb[];
};

export default function ProfileLayout({
    children,
    title,
    pageTitle,
    subtitle,
    activePath,
    breadcrumbs,
}: ProfileLayoutProps) {
    const accountNavRef = useRef<HTMLElement | null>(null);
    const activeNavItemRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        const nav = accountNavRef.current;
        const activeItem = activeNavItemRef.current;

        if (!nav || !activeItem) {
            return;
        }

        const revealActiveItem = () => {
            nav.scrollLeft =
                activeItem.offsetLeft -
                (nav.clientWidth - activeItem.clientWidth) / 2;
        };
        const observer = new ResizeObserver(revealActiveItem);

        revealActiveItem();
        observer.observe(nav);

        return () => observer.disconnect();
    }, [activePath]);

    return (
        <ShopLayout>
            <Head title={`${pageTitle} Deklasee`} />

            <section className="border-t border-b border-hairline bg-sand">
                <div className="grid lg:min-h-[220px] lg:grid-cols-[1.25fr_.75fr]">
                    <div className="flex min-w-0 flex-col justify-between border-b border-hairline px-4 py-6 sm:px-12 sm:py-8 lg:border-r lg:border-b-0 lg:px-16 lg:py-10">
                        <nav className="flex flex-wrap items-center gap-2 text-[9px] font-semibold tracking-[0.08em] uppercase">
                            {breadcrumbs.map((breadcrumb, index) => (
                                <React.Fragment
                                    key={`${breadcrumb.label}-${index}`}
                                >
                                    {breadcrumb.href ? (
                                        <Link
                                            href={breadcrumb.href}
                                            className="text-ink/65 hover:text-primary"
                                        >
                                            {breadcrumb.label}
                                        </Link>
                                    ) : (
                                        <span>{breadcrumb.label}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && (
                                        <span className="text-ink/35">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                        <h1 className="mt-8 max-w-4xl font-condensed text-[clamp(36px,9vw,50px)] leading-[0.9] font-semibold tracking-[-0.05em] break-words uppercase sm:mt-10 sm:text-[clamp(50px,6.5vw,92px)] sm:leading-[0.8]">
                            {title}
                        </h1>
                    </div>
                    <div className="flex min-w-0 flex-col justify-end bg-canvas px-4 py-5 sm:px-12 sm:py-8 lg:px-10 lg:py-10">
                        <p className="text-[9px] font-semibold tracking-[0.1em] text-primary uppercase">
                            Member space
                        </p>
                        <p className="mt-3 max-w-sm text-[13px] leading-[1.5] text-ink/75 sm:mt-4 sm:text-[12px]">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </section>

            <main className="border-b border-hairline bg-canvas">
                <div className="grid min-w-0 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="min-w-0 border-b border-hairline bg-surface-soft lg:border-r lg:border-b-0">
                        <div className="border-b border-hairline px-4 py-3 sm:px-10 sm:py-4 lg:px-8">
                            <p className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                                Akun Saya
                            </p>
                        </div>
                        <nav
                            ref={accountNavRef}
                            aria-label="Navigasi akun"
                            className="hide-scrollbar relative flex min-w-0 overflow-x-auto overscroll-x-contain lg:block"
                        >
                            {ACCOUNT_NAV.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = item.id === activePath;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        ref={
                                            isActive
                                                ? activeNavItemRef
                                                : undefined
                                        }
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                        className={`group flex min-h-11 min-w-fit shrink-0 items-center gap-2 border-r border-hairline px-3 py-3 text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-3 sm:px-5 sm:py-4 lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8 ${
                                            isActive
                                                ? 'bg-ink text-canvas'
                                                : 'text-ink hover:bg-oat/55 hover:text-primary'
                                        }`}
                                    >
                                        <span className="hidden text-[8px] tabular-nums opacity-55 sm:inline">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <Icon size={15} strokeWidth={1.7} />
                                        <span className="hidden sm:inline">
                                            {item.label}
                                        </span>
                                        <span className="sm:hidden">
                                            {item.mobileLabel}
                                        </span>
                                    </Link>
                                );
                            })}
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                className="flex min-h-11 min-w-fit shrink-0 items-center gap-2 border-r border-hairline px-3 py-3 text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-3 sm:px-5 sm:py-4 lg:w-full lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8"
                            >
                                <span className="hidden text-[8px] tabular-nums opacity-55 sm:inline">
                                    06
                                </span>
                                <LogOut size={15} strokeWidth={1.7} />
                                <span>Keluar</span>
                            </Link>
                        </nav>
                    </aside>

                    <section className="min-w-0 px-4 py-6 [overflow-wrap:anywhere] sm:px-10 sm:py-10 lg:px-12 xl:px-16">
                        {children}
                    </section>
                </div>
            </main>
        </ShopLayout>
    );
}
