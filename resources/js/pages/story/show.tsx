import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Share2 } from 'lucide-react';
import { useState } from 'react';
import HTMLRender from '@/components/HTMLRender';
import StoryCard from '@/components/story-card';
import type { StorySummary } from '@/components/story-card';
import ShopLayout from '@/layouts/shop-layout';
import { home } from '@/routes';
import { index } from '@/routes/story';

type Props = {
    story: StorySummary & {
        body_html: string;
        pull_quote: string | null;
        quote_attribution: string | null;
        cover_caption: string | null;
    };
    relatedStories: StorySummary[];
};

export default function StoryDetail({ story, relatedStories }: Props) {
    const [shareMessage, setShareMessage] = useState('');
    const publishedDate = story.published_at
        ? new Intl.DateTimeFormat('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
          }).format(new Date(story.published_at))
        : null;
    const share = async () => {
        setShareMessage('');

        try {
            if (navigator.share) {
                await navigator.share({
                    title: story.title,
                    text: story.excerpt,
                    url: window.location.href,
                });

                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            setShareMessage('Link copied.');
        } catch (error) {
            if (
                !(error instanceof DOMException && error.name === 'AbortError')
            ) {
                setShareMessage(
                    'Sharing unavailable. Copy the URL from your browser.',
                );
            }
        }
    };

    return (
        <ShopLayout>
            <Head title={story.title + ' | Deklase Stories'}>
                <meta name="description" content={story.excerpt} />
            </Head>
            <article className="min-w-0 bg-canvas text-teal">
                <header>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex flex-wrap items-center gap-3 border-b border-hairline px-6 text-[11px] font-medium tracking-wider uppercase lg:px-14"
                    >
                        <Link
                            href={home()}
                            className="inline-flex min-h-11 items-center hover:underline"
                        >
                            Home
                        </Link>
                        <span aria-hidden="true">/</span>
                        <Link
                            href={index()}
                            className="inline-flex min-h-11 items-center hover:underline"
                        >
                            Stories
                        </Link>
                    </nav>
                    <div className="grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-16 lg:px-14 lg:py-20">
                        <div className="min-w-0">
                            <p className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-widest uppercase">
                                <span
                                    aria-hidden="true"
                                    className="h-px w-8 bg-primary"
                                />
                                {story.category}
                            </p>
                            <h1 className="max-w-4xl font-condensed text-[clamp(48px,7.5vw,116px)] leading-[0.88] tracking-tight [overflow-wrap:anywhere] uppercase">
                                {story.title}
                            </h1>
                        </div>
                        <div className="flex min-w-0 flex-col justify-end lg:border-l lg:border-hairline lg:pl-10">
                            <p className="max-w-lg text-base leading-7 [overflow-wrap:anywhere] text-body sm:text-lg sm:leading-8">
                                {story.excerpt}
                            </p>
                            <div className="mt-7 border-t border-hairline pt-5">
                                <p className="text-xs font-semibold tracking-wide [overflow-wrap:anywhere] uppercase">
                                    By {story.author_name}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-body">
                                    {publishedDate && (
                                        <time dateTime={story.published_at!}>
                                            {publishedDate}
                                        </time>
                                    )}
                                    <span>
                                        {story.reading_minutes} min read
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={share}
                                className="mt-6 inline-flex min-h-11 items-center justify-between gap-8 self-start border border-teal px-5 text-xs font-semibold tracking-wide uppercase hover:bg-teal hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal motion-safe:transition-colors"
                            >
                                Share story{' '}
                                <Share2 size={15} aria-hidden="true" />
                            </button>
                            <p role="status" className="mt-2 text-xs text-body">
                                {shareMessage}
                            </p>
                        </div>
                    </div>
                </header>
                <figure className="border-y border-hairline">
                    <div className="aspect-[4/3] overflow-hidden bg-surface-soft sm:aspect-[16/9] lg:aspect-[16/7]">
                        <img
                            src={story.cover_image_url}
                            alt={story.title}
                            fetchPriority="high"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {story.cover_caption && (
                        <figcaption className="border-t border-hairline px-6 py-4 text-xs leading-5 [overflow-wrap:anywhere] text-body sm:px-10 lg:px-14">
                            {story.cover_caption}
                        </figcaption>
                    )}
                </figure>
                {story.pull_quote && (
                    <figure className="grid gap-6 border-b border-hairline bg-teal px-6 py-10 text-white sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-14 lg:px-14 lg:py-16">
                        <span
                            aria-hidden="true"
                            className="font-condensed text-8xl leading-none text-primary lg:text-[140px]"
                        >
                            “
                        </span>
                        <div className="max-w-4xl min-w-0">
                            <blockquote className="font-condensed text-[clamp(28px,3.5vw,48px)] leading-[1.15] [overflow-wrap:anywhere]">
                                <p>{story.pull_quote}</p>
                            </blockquote>
                            {story.quote_attribution && (
                                <figcaption className="mt-6 text-xs font-medium tracking-wider [overflow-wrap:anywhere] text-primary uppercase">
                                    {story.quote_attribution}
                                </figcaption>
                            )}
                        </div>
                    </figure>
                )}
                <div className="px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
                    <HTMLRender
                        html={story.body_html}
                        className="mx-auto max-w-[740px] text-base leading-8 [overflow-wrap:anywhere] text-body [&_a]:text-teal [&_a]:decoration-primary [&_a]:underline-offset-4 [&_blockquote]:rounded-none [&_blockquote]:border-primary [&_blockquote]:bg-surface-soft [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-teal [&_h1]:mt-12 [&_h1]:font-condensed [&_h1]:text-4xl [&_h1]:text-teal [&_h2]:mt-12 [&_h2]:font-condensed [&_h2]:text-4xl [&_h2]:text-teal [&_h3]:mt-8 [&_h3]:font-condensed [&_h3]:text-3xl [&_h3]:text-teal [&_h4]:text-teal [&_img]:h-auto [&_img]:max-w-full [&_li]:pl-1 [&_mark]:bg-primary/30 [&_mark]:text-teal [&_ol]:my-6 [&_p]:my-5 [&_pre]:max-w-full [&_strong]:text-teal [&_ul]:my-6 [&>p:first-child]:text-lg [&>p:first-child]:leading-8"
                    />
                    <div className="mx-auto mt-10 flex max-w-[740px] items-center justify-between gap-4 border-t border-hairline pt-6">
                        <Link
                            href={index()}
                            className="inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase hover:underline"
                        >
                            <ArrowLeft size={16} aria-hidden="true" /> Back to
                            stories
                        </Link>
                        <span
                            aria-hidden="true"
                            className="h-px w-12 bg-primary"
                        />
                    </div>
                </div>
                {relatedStories.length > 0 && (
                    <section
                        aria-labelledby="related-stories-heading"
                        className="border-t border-hairline"
                    >
                        <div className="flex flex-wrap items-end justify-between gap-6 px-6 py-9 sm:px-10 lg:px-14 lg:py-12">
                            <div>
                                <p className="mb-3 text-xs font-semibold tracking-widest uppercase">
                                    Keep reading
                                </p>
                                <h2
                                    id="related-stories-heading"
                                    className="font-condensed text-[clamp(40px,5vw,64px)] leading-none uppercase"
                                >
                                    More coffee stories
                                </h2>
                            </div>
                            <Link
                                href={index()}
                                className="inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase hover:underline"
                            >
                                All stories{' '}
                                <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
                            {relatedStories.map((related) => (
                                <StoryCard key={related.id} story={related} />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </ShopLayout>
    );
}
