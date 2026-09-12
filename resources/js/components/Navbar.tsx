import { Link } from '@inertiajs/react';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

import { cart, home, list, location, login } from '@/routes';

type NavbarProps = {
    cartCount?: number;
    isAuthenticated?: boolean;
};

export default function Navbar({
    cartCount = 0,
    isAuthenticated = false,
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const accountHref = isAuthenticated ? '/my-profile' : login.url();
    const bagCount =
        cartCount > 99 ? '99+' : String(cartCount).padStart(2, '0');
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-hairline bg-white text-teal">
            <nav className="mx-auto grid min-h-14 w-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 text-[10px] font-semibold tracking-[0.04em] uppercase sm:min-h-16 sm:px-6 md:px-8 lg:min-h-[68px] lg:px-10 lg:text-[11px]">
                <div className="hidden items-center gap-5 md:flex lg:gap-9">
                    <Link
                        href={list.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Shop
                    </Link>
                    <Link
                        href={home.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Home
                    </Link>
                    <Link
                        href={location.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Locations
                    </Link>
                </div>
                <Link
                    href={home.url()}
                    aria-label="Deklase home"
                    className="col-start-2 inline-flex items-center justify-center transition-opacity hover:opacity-70"
                >
                    <img
                        src="/logo/dc-header.webp"
                        alt="Deklase"
                        className="h-auto w-24 sm:w-28 lg:w-40"
                    />
                </Link>
                <div className="col-start-3 flex min-w-0 items-center justify-end gap-1 sm:gap-2 md:gap-4 lg:gap-8">

                    <Link
                        href={accountHref}
                        className="hidden transition-colors hover:text-primary md:inline"
                    >
                        Account
                    </Link>
                    <Link
                        href={cart.url()}
                        aria-label={`Cart (${bagCount} items)`}
                        className="relative inline-flex size-10 shrink-0 items-center justify-center transition-colors hover:text-primary"
                    >
                        <ShoppingCart
                            className="size-[18px]"
                            strokeWidth={1.5}
                        />
                        <span className="absolute -top-0.5 -right-1 grid min-w-4 place-items-center bg-primary px-1 py-px text-[8px] leading-3 text-teal tabular-nums">
                            {bagCount}
                        </span>
                    </Link>
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsOpen(true)}
                        className="inline-flex size-10 shrink-0 items-center justify-center md:hidden"
                    >
                        <Menu className="size-5" strokeWidth={1.5} />
                    </button>
                </div>
            </nav>
            <div
                className={[
                    'fixed inset-0 z-[60] flex min-h-[100dvh] flex-col gap-0 overflow-y-auto overscroll-contain bg-canvas px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] text-ink transition-transform duration-300 md:hidden',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                ].join(' ')}
                aria-hidden={!isOpen}
            >
                <div className="mb-8 flex items-center justify-between">
                    <img
                        src="/logo/dc-header.webp"
                        alt="Deklase"
                        className="h-auto w-36"
                    />
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                        className="inline-flex size-10 items-center justify-center"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <Link
                    href={list.url()}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Shop
                </Link>
                <Link
                    href={home.url()}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Home
                </Link>
                <Link
                    href={location.url()}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Locations
                </Link>

                <Link
                    href={accountHref}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Account
                </Link>
            </div>
        </header>
    );
}
