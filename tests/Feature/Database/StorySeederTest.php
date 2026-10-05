<?php

use App\Models\Story;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\StorySeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('seeds three complete published stories available on public pages', function () {
    $this->travelTo(now()->setDate(2026, 10, 5)->setTime(12, 0));
    $this->seed(StorySeeder::class);

    $stories = Story::query()->orderBy('published_at')->get();
    expect($stories)->toHaveCount(3)
        ->and($stories->pluck('category')->all())->toBe(['Origin', 'Brewing', 'Coffee Guide']);

    foreach ($stories as $story) {
        expect($story->title)->not->toBeEmpty()
            ->and($story->slug)->not->toBeEmpty()
            ->and($story->author_name)->toBe('Deklase')
            ->and($story->excerpt)->not->toBeEmpty()
            ->and($story->pull_quote)->not->toBeEmpty()
            ->and($story->quote_attribution)->not->toBeEmpty()
            ->and($story->cover_caption)->not->toBeEmpty()
            ->and($story->body_html)->toContain('<h2>', '<p>')
            ->and(parse_url($story->cover_image_url, PHP_URL_HOST))->toBe('images.unsplash.com')
            ->and($story->status)->toBe('published')
            ->and($story->published_at->isPast())->toBeTrue();

        $this->get(route('story.show', $story->slug))
            ->assertSuccessful()
            ->assertInertia(fn (Assert $page) => $page->component('story/show')->where('story.title', $story->title));
    }

    $this->get(route('story.index'))->assertInertia(fn (Assert $page) => $page->component('story/index')->has('stories.data', 3));
});

it('does not duplicate stories or overwrite admin changes when run again', function () {
    $this->seed(StorySeeder::class);
    $story = Story::query()->firstOrFail();
    $story->update([
        'title' => 'Judul dari admin',
        'pull_quote' => 'Kutipan dari admin',
        'quote_attribution' => 'Editor Deklase',
        'cover_caption' => 'Caption yang sudah ditinjau',
        'body_html' => '<p>Konten yang sudah ditinjau admin.</p>',
        'status' => 'draft',
        'published_at' => null,
    ]);
    $before = $story->fresh()->getAttributes();

    $this->seed(StorySeeder::class);

    expect(Story::query()->count())->toBe(3)
        ->and($story->fresh()->getAttributes())->toBe($before);
});

it('registers the story seeder in the main database seeder', function () {
    $seeder = Mockery::mock(DatabaseSeeder::class)->makePartial();
    $seeder->shouldReceive('call')->once()
        ->withArgs(fn (array $seeders): bool => in_array(StorySeeder::class, $seeders, true))
        ->andReturnSelf();

    $seeder->run();
});
