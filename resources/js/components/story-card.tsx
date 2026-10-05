import { Link } from '@inertiajs/react';
import { show } from '@/routes/story';

export type StorySummary = {
    id: number;
    title: string;
    slug: string;
    category: string;
    author_name: string;
    excerpt: string;
    cover_image_url: string;
    published_at: string | null;
    reading_minutes: number;
};

export default function StoryCard({ story }: { story: StorySummary }) {
    return (
        <article className="min-w-0 border-b border-hairline bg-canvas">
            <Link
                href={show(story.slug)}
                className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal"
            >
                <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
                    <img
                        src={story.cover_image_url}
                        alt={story.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                </div>
                <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap justify-between gap-2 text-[10px] font-semibold tracking-widest text-body uppercase">
                        <span>{story.category}</span>
                        <span>{story.reading_minutes} min read</span>
                    </div>
                    <h2 className="mt-4 font-condensed text-4xl leading-none [overflow-wrap:anywhere] text-teal uppercase">
                        {story.title}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-body">
                        {story.excerpt}
                    </p>
                    <p className="mt-6 text-xs font-semibold text-teal uppercase group-hover:underline">
                        Read story{' '}
                        <span aria-hidden="true" className="text-primary">
                            →
                        </span>
                    </p>
                </div>
            </Link>
        </article>
    );
}
