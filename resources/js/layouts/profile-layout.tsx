import { Head, Link } from '@inertiajs/react';
import { Bell, Heart, LogOut, MapPin, Package, User } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';

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
    return (
        <ShopLayout>
            <Head title={`${pageTitle} Deklasee`} />

            <section className="border-t border-b border-hairline bg-sand">
                <div className="grid min-h-[220px] lg:grid-cols-[1.25fr_.75fr]">
                    <div className="flex flex-col justify-between border-b border-hairline px-7 py-8 sm:px-12 lg:border-r lg:border-b-0 lg:px-16 lg:py-10">
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
                        <h1 className="mt-10 max-w-4xl font-condensed text-[clamp(50px,6.5vw,92px)] leading-[0.8] font-semibold tracking-[-0.05em] uppercase">
                            {title}
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end bg-canvas px-7 py-8 sm:px-12 lg:px-10 lg:py-10">
                        <p className="text-[9px] font-semibold tracking-[0.1em] text-primary uppercase">
                            Member space
                        </p>
                        <p className="mt-4 max-w-sm text-[12px] leading-[1.5] text-ink/75">
                            {subtitle}
                        </p>
                    </div>
                </div>
            </section>

            <main className="border-b border-hairline bg-canvas">
                <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="border-b border-hairline bg-surface-soft lg:border-r lg:border-b-0">
                        <div className="border-b border-hairline px-7 py-4 sm:px-10 lg:px-8">
                            <p className="text-[9px] font-semibold tracking-[0.1em] uppercase">
                                Akun Saya
                            </p>
                        </div>
                        <nav className="hide-scrollbar flex overflow-x-auto lg:block">
                            {ACCOUNT_NAV.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = item.id === activePath;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`group flex min-w-fit items-center gap-3 border-r border-hairline px-5 py-4 text-[10px] font-semibold tracking-[0.06em] uppercase lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8 ${isActive
                                            ? 'bg-ink text-canvas'
                                            : 'text-ink hover:bg-oat/55 hover:text-primary'
                                            }`}
                                    >
                                        <span className="text-[8px] tabular-nums opacity-55">
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
                                className="flex min-w-fit items-center gap-3 border-r border-hairline px-5 py-4 text-[10px] font-semibold tracking-[0.06em] uppercase hover:bg-primary-soft hover:text-primary lg:w-full lg:min-w-0 lg:border-r-0 lg:border-b lg:px-8"
                            >
                                <span className="text-[8px] tabular-nums opacity-55">
                                    06
                                </span>
                                <LogOut size={15} strokeWidth={1.7} />
                                <span>Keluar</span>
                            </Link>
                        </nav>
                    </aside>

                    <section className="min-w-0 px-7 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
                        {children}
                    </section>
                </div>
            </main>
        </ShopLayout>
    );
}
