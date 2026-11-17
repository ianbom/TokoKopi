import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

type ShopLayoutProps = { children: ReactNode };

type SharedShopProps = {
    auth: { user: unknown | null };
    shop?: {
        cart_count?: number;
        social_links?: {
            instagram_url?: string;
            tiktok_url?: string;
            whatsapp_url?: string | null;
        };
    };
};

export default function ShopLayout({ children }: ShopLayoutProps) {
    const { props } = usePage<SharedShopProps>();

    return (
        <div className="flex min-h-[100dvh] min-w-0 flex-col overflow-x-clip bg-white font-sans text-teal">
            <Navbar
                cartCount={props.shop?.cart_count ?? 0}
                isAuthenticated={Boolean(props.auth.user)}
            />
            <main className="min-w-0 grow bg-white">{children}</main>
            <Toaster />
            <Footer socialLinks={props.shop?.social_links} />
            {props.shop?.social_links?.whatsapp_url && (
                <a
                    href={props.shop.social_links.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat WhatsApp Deklase (buka tab baru)"
                    title="Chat WhatsApp Deklase"
                    className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-7"
                        aria-hidden="true"
                    >
                        <path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.44 0 .07 5.37.07 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.96 11.96 0 0 0 5.86 1.49h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.21-3.52-8.47ZM12.05 21.85a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.68.96.98-3.59-.23-.37a9.92 9.92 0 0 1-1.52-5.28c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.9 9.9 0 0 1 2.92 7.05c0 5.49-4.47 9.96-9.97 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
