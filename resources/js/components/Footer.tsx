import { Link } from '@inertiajs/react';

import { about, home, list } from '@/routes';
import { privacy, shipping } from '@/routes/policy';

export default function Footer() {
    return (
        <footer className="bg-surface-dark text-canvas">
            <section
                id="subscription"
                className="grid border-b border-white/20 bg-primary text-canvas md:grid-cols-[1fr_1.2fr_1fr]"
            >
                <div className="border-b border-white/20 p-7 md:border-r md:border-b-0 lg:p-10">
                    <p className="font-condensed text-4xl leading-[0.82] uppercase lg:text-5xl">
                        Coffee that
                        <br />
                        shows up
                        <br />
                        for you.
                    </p>
                </div>
                <div className="border-b border-white/20 p-7 md:border-r md:border-b-0 lg:p-10">
                    <p className="text-sm leading-5">
                        Choose your coffee.
                        <br />
                        Choose your frequency.
                        <br />
                        We’ll handle the rest.
                    </p>
                    <a
                        href="#newsletter"
                        className="mt-5 inline-flex rounded-none border border-current px-4 py-2 text-[10px] tracking-[0.08em] uppercase transition-colors hover:bg-canvas hover:text-primary"
                    >
                        Start a subscription →
                    </a>
                </div>
                <div
                    aria-hidden="true"
                    className="hidden min-h-36 bg-oat/70 md:block"
                />
            </section>
            <section className="grid gap-10 border-b border-white/20 p-7 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)] lg:gap-8 lg:p-10">
                <div id="newsletter">
                    <h2 className="font-condensed text-4xl leading-[0.82] uppercase">
                        Good coffee.
                        <br />
                        Occasional emails.
                    </h2>
                    <form
                        className="mt-8 flex max-w-xs border-b border-oat/70"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label htmlFor="footer-email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="footer-email"
                            type="email"
                            placeholder="Your email"
                            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-canvas outline-none placeholder:text-oat"
                        />
                        <button
                            type="submit"
                            className="px-1 text-xs uppercase transition-colors hover:text-primary"
                        >
                            Join →
                        </button>
                    </form>
                </div>
                <FooterColumn title="Shop">
                    <Link href={list.url()}>Coffee</Link>
                    <a href="#subscription">Subscriptions</a>
                    <a href="#rituals">Bundles</a>
                    <a href={home.url()}>Merchandise</a>
                </FooterColumn>
                <FooterColumn title="About">
                    <Link href={about.url()}>Our story</Link>
                    <a href="#story">Roasting</a>
                    <a href="#">Journal</a>
                    <a href="#">Wholesale</a>
                </FooterColumn>
                <FooterColumn title="Follow">
                    <a href="#">Instagram</a>
                    <a href="#">TikTok</a>
                    <a href="#">Pinterest</a>
                </FooterColumn>
            </section>
            <div className="flex flex-col gap-3 px-7 py-4 text-[10px] tracking-[0.04em] text-oat uppercase sm:flex-row sm:items-center sm:justify-between lg:px-10">
                <span>© 2026 Declasse Coffee</span>
                <span className="flex gap-6">
                    <Link
                        href={privacy.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Privacy
                    </Link>
                    <Link
                        href={shipping.url()}
                        className="transition-colors hover:text-primary"
                    >
                        Shipping
                    </Link>
                    <a
                        href="#"
                        className="transition-colors hover:text-primary"
                    >
                        Terms
                    </a>
                </span>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-xs tracking-[0.08em] text-canvas uppercase">
                {title}
            </h3>
            <div className="flex flex-col gap-1 text-sm text-oat [&_a]:transition-colors [&_a:hover]:text-primary">
                {children}
            </div>
        </div>
    );
}
