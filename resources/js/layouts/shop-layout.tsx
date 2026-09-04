import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

type ShopLayoutProps = { children: ReactNode };

type SharedShopProps = {
    auth: { user: unknown | null };
    shop?: { cart_count?: number };
};

export default function ShopLayout({ children }: ShopLayoutProps) {
    const { props } = usePage<SharedShopProps>();

    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-teal">
            <Navbar
                cartCount={props.shop?.cart_count ?? 0}
                isAuthenticated={Boolean(props.auth.user)}
            />
            <main className="w-full grow bg-white">{children}</main>
            <Toaster />
            <Footer />
        </div>
    );
}
