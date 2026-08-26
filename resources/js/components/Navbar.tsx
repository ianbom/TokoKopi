import { Link } from '@inertiajs/react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

import { about, cart, home, list, login } from '@/routes';

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
        <header className="sticky top-0 z-50 border-b border-ink bg-canvas text-ink">
            <nav className="mx-auto grid min-h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 text-[11px] tracking-[0.04em] uppercase sm:px-8 lg:min-h-[76px] lg:px-10 lg:text-xs">
                <div className="hidden items-center gap-5 md:flex lg:gap-9">
                    <Link
                        href={list.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Shop
                    </Link>
                    <Link
                        href={home.url() + '#subscription'}
                        className="transition-colors hover:text-primary"
                    >
                        Subscriptions
                    </Link>
                    <Link
                        href={about.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Story
                    </Link>
                </div>
                <Link
                    href={home.url()}
                    aria-label="Declasse home"
                    className="font-serif text-3xl font-normal tracking-[-0.09em] normal-case transition-opacity hover:opacity-70 sm:text-4xl lg:text-[46px]"
                >
                    Declasse
                </Link>
                <div className="flex items-center justify-end gap-4 lg:gap-8">
                    <Link
                        href={list.url()}
                        aria-label="Search products"
                        className="hidden items-center gap-1.5 transition-colors hover:text-primary md:inline-flex"
                    >
                        <Search className="size-3.5" strokeWidth={1.5} />
                        <span>Search</span>
                    </Link>
                    <Link
                        href={accountHref}
                        className="hidden transition-colors hover:text-primary sm:inline"
                    >
                        Account
                    </Link>
                    <Link
                        href={cart.url()}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                    >
                        <ShoppingBag className="size-3.5" strokeWidth={1.5} />
                        <span>Bag ({bagCount})</span>
                    </Link>
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsOpen(true)}
                        className="inline-flex size-10 items-center justify-center md:hidden"
                    >
                        <Menu className="size-5" strokeWidth={1.5} />
                    </button>
                </div>
            </nav>
            <div
                className={[
                    'fixed inset-0 z-[60] flex flex-col gap-0 bg-canvas p-5 text-ink transition-transform duration-300 md:hidden',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                ].join(' ')}
                aria-hidden={!isOpen}
            >
                <div className="mb-8 flex items-center justify-between">
                    <span className="font-serif text-4xl tracking-[-0.09em]">
                        Declasse
                    </span>
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
                    href={home.url() + '#subscription'}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Subscriptions
                </Link>
                <Link
                    href={about.url()}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Story
                </Link>
                <Link
                    href={accountHref}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Account
                </Link>
                <Link
                    href={cart.url()}
                    onClick={closeMenu}
                    className="border-b border-hairline py-5 text-lg uppercase"
                >
                    Bag ({bagCount})
                </Link>
            </div>
        </header>
    );
}
