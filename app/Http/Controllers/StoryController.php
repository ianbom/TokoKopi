<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Inertia\Response;

class StoryController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'category' => $request->string('category')->toString(),
            'sort' => $request->string('sort')->toString() === 'oldest' ? 'oldest' : 'latest',
        ];

        return inertia('story/index', [
            'stories' => Story::query()->published()
                ->when($filters['search'] !== '', fn ($query) => $query->where(fn ($query) => $query->where('title', 'like', '%'.$filters['search'].'%')->orWhere('excerpt', 'like', '%'.$filters['search'].'%')))
                ->when($filters['category'] !== '', fn ($query) => $query->where('category', $filters['category']))
                ->orderBy('published_at', $filters['sort'] === 'oldest' ? 'asc' : 'desc')->orderBy('id', $filters['sort'] === 'oldest' ? 'asc' : 'desc')
                ->paginate(9)->withQueryString()->through(fn (Story $story): array => $this->summary($story)),
            'categories' => Story::query()->published()->distinct()->orderBy('category')->pluck('category'),
            'filters' => $filters,
        ]);
    }

    public function show(string $slug): Response
    {
        $story = Story::query()->published()->where('slug', $slug)->firstOrFail();

        return inertia('story/show', [
            'story' => [
                ...$this->summary($story),
                'body_html' => $story->body_html,
                'pull_quote' => $story->pull_quote,
                'quote_attribution' => $story->quote_attribution,
                'cover_caption' => $story->cover_caption,
            ],
            'relatedStories' => Story::query()->published()->where('id', '!=', $story->id)->where('category', $story->category)
                ->latest('published_at')->limit(3)->get()->map(fn (Story $related): array => $this->summary($related)),
        ]);
    }

    private function summary(Story $story): array
    {
        return [
            'id' => $story->id,
            'title' => $story->title,
            'slug' => $story->slug,
            'category' => $story->category,
            'author_name' => $story->author_name,
            'excerpt' => $story->excerpt,
            'cover_image_url' => $story->cover_image_url,
            'published_at' => $story->published_at?->toDateString(),
            'reading_minutes' => $story->readingMinutes(),
        ];
    }
}
