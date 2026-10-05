import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import StoryCard from '@/components/story-card';
import type { StorySummary } from '@/components/story-card';
import ShopLayout from '@/layouts/shop-layout';
import { index } from '@/routes/story';

type Props = {
    stories: {
        data: StorySummary[];
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: string[];
    filters: { search: string; category: string; sort: 'latest' | 'oldest' };
};

export default function Stories({ stories, categories, filters }: Props) {
    const form = useForm(filters);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.get(index.url(), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <ShopLayout>
            <Head title="Stories | Deklase">
                <meta
                    name="description"
                    content="Coffee origins, brewing notes, and stories from Deklase."
                />
            </Head>
            <main className="bg-canvas text-teal">
                <header className="grid border-b border-hairline md:grid-cols-2">
                    <div className="flex flex-col justify-center px-7 py-12 lg:px-14 lg:py-20">
                        <p className="text-xs font-semibold tracking-widest uppercase">
                            Deklase Stories
                        </p>
                        <h1 className="mt-6 font-condensed text-[clamp(64px,8vw,118px)] leading-[0.84] tracking-tight uppercase">
                            Coffee,
                            <br />
                            beyond
                            <br />
                            the cup.
                        </h1>
                        <p className="mt-7 max-w-sm text-sm leading-6 text-body">
                            From origin to your everyday ritual. Explore the
                            people, places, and ideas behind our coffee.
                        </p>
                    </div>
                    <div className="relative min-h-64 bg-teal md:min-h-96">
                        {stories.data[0] ? (
                            <img
                                src={stories.data[0].cover_image_url}
                                alt={stories.data[0].title}
                                fetchPriority="high"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-64 items-center justify-center p-7 font-condensed text-5xl text-white uppercase">
                                Good coffee.
                                <br />
                                More to discover.
                            </div>
                        )}
                    </div>
                </header>
                <form
                    onSubmit={submit}
                    className="grid gap-3 border-b border-hairline p-5 sm:grid-cols-2 lg:grid-cols-[1fr_220px_180px_auto] lg:px-10 lg:py-6"
                >
                    <label className="grid gap-2 text-xs font-semibold uppercase">
                        Search stories
                        <input
                            type="search"
                            value={form.data.search}
                            onChange={(event) =>
                                form.setData('search', event.target.value)
                            }
                            placeholder="Search coffee stories"
                            className="h-11 min-w-0 border border-hairline bg-canvas px-3 text-sm font-normal normal-case"
                        />
                    </label>
                    <label className="grid gap-2 text-xs font-semibold uppercase">
                        Category
                        <select
                            value={form.data.category}
                            onChange={(event) =>
                                form.setData('category', event.target.value)
                            }
                            className="h-11 min-w-0 border border-hairline bg-canvas px-3 text-sm font-normal normal-case"
                        >
                            <option value="">All stories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="grid gap-2 text-xs font-semibold uppercase">
                        Sort
                        <select
                            value={form.data.sort}
                            onChange={(event) =>
                                form.setData(
                                    'sort',
                                    event.target.value as 'latest' | 'oldest',
                                )
                            }
                            className="h-11 border border-hairline bg-canvas px-3 text-sm font-normal normal-case"
                        >
                            <option value="latest">Latest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="h-11 self-end rounded-full border border-teal px-6 text-xs font-semibold uppercase transition-colors hover:bg-teal hover:text-white disabled:opacity-50"
                    >
                        Apply filters
                    </button>
                </form>
                <div className="flex items-center justify-between border-b border-hairline px-5 py-5 text-xs uppercase lg:px-10">
                    <h2>Our stories</h2>
                    <p>{stories.total} stories</p>
                </div>
                {stories.data.length > 0 ? (
                    <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                        {stories.data.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                ) : (
                    <p className="px-7 py-20 text-center text-body">
                        No stories found. Try another search or check back soon.
                    </p>
                )}
                {stories.total > 0 && (
                    <nav
                        aria-label="Story pagination"
                        className="flex flex-wrap justify-center gap-2 border-t border-hairline px-5 py-8"
                    >
                        {stories.links.map((link, position) => {
                            const label =
                                position === 0
                                    ? 'Previous'
                                    : position === stories.links.length - 1
                                      ? 'Next'
                                      : link.label;
                            const className =
                                'inline-flex min-h-11 min-w-11 items-center justify-center border border-hairline px-4 text-xs ' +
                                (link.active
                                    ? 'bg-teal text-white'
                                    : 'hover:bg-surface-soft');

                            return link.url ? (
                                <Link
                                    key={position}
                                    href={link.url}
                                    aria-current={
                                        link.active ? 'page' : undefined
                                    }
                                    className={className}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <span
                                    key={position}
                                    aria-disabled="true"
                                    className={className + ' opacity-40'}
                                >
                                    {label}
                                </span>
                            );
                        })}
                    </nav>
                )}
            </main>
        </ShopLayout>
    );
}
