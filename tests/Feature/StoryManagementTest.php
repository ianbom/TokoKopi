<?php

use App\Models\Story;
use App\Models\User;
use App\Services\StoryHtmlSanitizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
});

it('lists only published stories and supports search and category filters', function () {
    storyRecord(['title' => 'Manual brewing at home', 'category' => 'Brewing']);
    storyRecord(['title' => 'Daily espresso', 'category' => 'Espresso']);
    storyRecord(['title' => 'Manual brewing draft', 'status' => 'draft', 'published_at' => null]);

    $this->get(route('story.index', ['search' => 'Manual', 'category' => 'Brewing']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('story/index')
            ->where('filters.search', 'Manual')
            ->where('filters.category', 'Brewing')
            ->has('stories.data', 1)
            ->where('stories.data.0.title', 'Manual brewing at home'));
});

it('renders a published story with related stories and hides drafts', function () {
    $story = storyRecord(['category' => 'Brewing']);
    storyRecord(['category' => 'Brewing']);
    storyRecord(['category' => 'Espresso']);
    $draft = storyRecord(['status' => 'draft', 'published_at' => null]);

    $this->get(route('story.show', $story->slug))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('story/show')
            ->where('story.slug', $story->slug)
            ->where('story.reading_minutes', 1)
            ->has('relatedStories', 1));

    $this->get(route('story.show', $draft->slug))->assertNotFound();
});

it('creates stories, sanitizes article HTML, replaces cover art, and deletes old files', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $payload = storyPayload([
        'body_html' => '<h2>Better coffee</h2><script>alert(1)</script><p onclick="run()">Taste notes</p><a href="javascript:alert(1)">safe text</a>',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.stories.store'), $payload)
        ->assertRedirect(route('admin.stories.index'));

    $story = Story::query()->where('slug', 'better-coffee')->firstOrFail();
    $oldCoverPath = Str::after($story->cover_image_url, '/storage/');
    expect($story->status)->toBe('published')
        ->and($story->published_at)->not->toBeNull()
        ->and($story->body_html)->toContain('<h2>Better coffee</h2>')
        ->and($story->body_html)->not->toContain('<script')
        ->and($story->body_html)->not->toContain('onclick')
        ->and($story->body_html)->not->toContain('javascript:');
    Storage::disk('public')->assertExists($oldCoverPath);

    $this->put(route('admin.stories.update', $story), storyPayload([
        'title' => 'Coffee Details',
        'slug' => 'coffee-details',
        'status' => 'draft',
        'cover_image' => UploadedFile::fake()->image('coffee-details.jpg'),
    ]))->assertRedirect(route('admin.stories.index'));

    $story->refresh();
    $newCoverPath = Str::after($story->cover_image_url, '/storage/');
    expect($story->slug)->toBe('coffee-details')
        ->and($story->status)->toBe('draft')
        ->and($story->published_at)->toBeNull();
    Storage::disk('public')->assertMissing($oldCoverPath);
    Storage::disk('public')->assertExists($newCoverPath);
    $this->get(route('story.show', $story->slug))->assertNotFound();

    $this->delete(route('admin.stories.destroy', $story))
        ->assertRedirect(route('admin.stories.index'));
    $this->assertDatabaseMissing('stories', ['id' => $story->id]);
    Storage::disk('public')->assertMissing($newCoverPath);
});

it('rejects invalid story fields and protects admin pages', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)
        ->post(route('admin.stories.store'), storyPayload(['status' => 'scheduled']))
        ->assertSessionHasErrors('status');

    $this->actingAs(User::factory()->create())
        ->get(route('admin.stories.index'))
        ->assertForbidden();
});

it('shows story counts and supports admin filters and pagination', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    storyRecord(['title' => 'Published coffee', 'status' => 'published']);
    storyRecord(['title' => 'Unpublished coffee', 'status' => 'draft', 'published_at' => null]);

    $this->actingAs($admin)
        ->get(route('admin.stories.index', ['search' => 'coffee', 'status' => 'draft', 'per_page' => 10]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/stories/index')
            ->where('filters.status', 'draft')
            ->where('stats.total', 2)
            ->where('stats.published', 1)
            ->where('stats.draft', 1)
            ->where('stories.total', 1)
            ->where('stories.per_page', 10));
});

it('paginates public stories and retains filters with oldest-first ordering', function () {
    foreach (range(1, 12) as $number) {
        storyRecord(['title' => "Guide {$number}", 'published_at' => now()->subDays(20 - $number)]);
    }

    $this->get(route('story.index', ['search' => 'Guide', 'category' => 'Coffee', 'sort' => 'oldest', 'page' => 2]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stories.per_page', 9)
            ->where('stories.total', 12)
            ->where('stories.current_page', 2)
            ->has('stories.data', 3)
            ->where('stories.data.0.title', 'Guide 10')
            ->where('filters.sort', 'oldest'));
});

it('provides create and edit pages and keeps the cover when no replacement is uploaded', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $this->actingAs($admin)->get(route('admin.stories.create'))
        ->assertInertia(fn (Assert $page) => $page->component('admin/stories/form')->where('mode', 'create')->where('story', null));
    $this->post(route('admin.stories.store'), storyPayload())->assertRedirect();
    $story = Story::query()->firstOrFail();
    $cover = $story->cover_image_url;

    $this->get(route('admin.stories.edit', $story))
        ->assertInertia(fn (Assert $page) => $page->component('admin/stories/form')->where('mode', 'edit')->where('story.id', $story->id));
    $this->put(route('admin.stories.update', $story), storyPayload(['cover_image' => null]))->assertRedirect();
    expect($story->fresh()->cover_image_url)->toBe($cover);
    Storage::disk('public')->assertExists(Str::after($cover, '/storage/'));
});

it('rejects duplicate slugs, unsupported covers and empty sanitized articles', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    storyRecord(['slug' => 'better-coffee']);

    $this->actingAs($admin)->post(route('admin.stories.store'), storyPayload())
        ->assertSessionHasErrors('slug');
    $this->post(route('admin.stories.store'), storyPayload(['slug' => 'new-story', 'cover_image' => null]))
        ->assertSessionHasErrors('cover_image');
    $this->post(route('admin.stories.store'), storyPayload(['slug' => 'new-story', 'cover_image' => UploadedFile::fake()->create('cover.svg', 1, 'image/svg+xml')]))
        ->assertSessionHasErrors('cover_image');
    $this->post(route('admin.stories.store'), storyPayload(['slug' => 'new-story', 'body_html' => '<script>alert(1)</script><p>&nbsp;</p>']))
        ->assertSessionHasErrors('body_html');
    expect(Storage::disk('public')->allFiles())->toBeEmpty();
});

it('blocks customer writes and does not reveal unpublished categories', function () {
    $draft = storyRecord(['status' => 'draft', 'published_at' => null, 'category' => 'Private']);
    storyRecord(['status' => 'published', 'published_at' => now()->addDay(), 'category' => 'Future']);

    $this->get(route('story.index'))->assertInertia(fn (Assert $page) => $page->has('stories.data', 0)->has('categories', 0));
    $this->actingAs(User::factory()->create())->post(route('admin.stories.store'), storyPayload())->assertForbidden();
    $this->put(route('admin.stories.update', $draft), storyPayload())->assertForbidden();
    $this->delete(route('admin.stories.destroy', $draft))->assertForbidden();
    $this->assertDatabaseHas('stories', ['id' => $draft->id]);
});

it('sanitizes unsafe HTML attributes and keeps supported formatting', function () {
    $html = '<h2>Catatan kopi</h2><p onmouseover=alert(1)>Kopi <strong>segar</strong></p><svg><script>alert(1)</script></svg><iframe src="https://example.test"></iframe><a href="java&#x09;script:alert(1)">Tautan</a><a href="https://example.test/coffee" target="_blank" onclick=alert(1)>Baca</a>';
    $safe = app(StoryHtmlSanitizer::class)->sanitize($html);

    expect($safe)->toContain('<h2>Catatan kopi</h2>', '<strong>segar</strong>', 'href="https://example.test/coffee"')
        ->not->toContain('onmouseover', 'onclick', '<svg', '<script', '<iframe', 'alert(1)', 'target=');
});

it('calculates reading time from article content in both public views', function () {
    $story = storyRecord(['body_html' => '<p>'.str_repeat('coffee ', 450).'</p>']);

    $this->get(route('story.index'))
        ->assertInertia(fn (Assert $page) => $page->where('stories.data.0.reading_minutes', 3));
    $this->get(route('story.show', $story->slug))
        ->assertInertia(fn (Assert $page) => $page->where('story.reading_minutes', 3));
});

it('stores editorial fields, exposes them publicly and lets admin clear them', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
    $editorial = [
        'pull_quote' => 'Mulai dengan kopi yang ingin Anda minum lagi.',
        'quote_attribution' => 'Catatan Deklase',
        'cover_caption' => 'Kopi dan waktu untuk menikmati seduhan.',
    ];

    $this->actingAs($admin)->post(route('admin.stories.store'), storyPayload($editorial))
        ->assertRedirect(route('admin.stories.index'));
    $story = Story::query()->where('slug', 'better-coffee')->firstOrFail();
    $this->assertDatabaseHas('stories', ['id' => $story->id, ...$editorial]);
    $this->get(route('story.show', $story->slug))->assertInertia(fn (Assert $page) => $page
        ->where('story.pull_quote', $editorial['pull_quote'])
        ->where('story.quote_attribution', $editorial['quote_attribution'])
        ->where('story.cover_caption', $editorial['cover_caption']));
    $this->get(route('admin.stories.edit', $story))->assertInertia(fn (Assert $page) => $page
        ->where('story.pull_quote', $editorial['pull_quote'])
        ->where('story.cover_caption', $editorial['cover_caption']));

    $this->put(route('admin.stories.update', $story), storyPayload([
        'cover_image' => null,
        'pull_quote' => '',
        'quote_attribution' => '',
        'cover_caption' => '',
    ]))->assertRedirect(route('admin.stories.index'));
    $this->assertDatabaseHas('stories', [
        'id' => $story->id, 'pull_quote' => null, 'quote_attribution' => null, 'cover_caption' => null,
    ]);
});

it('rejects editorial fields beyond their length limits', function () {
    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->actingAs($admin)->post(route('admin.stories.store'), storyPayload([
        'pull_quote' => str_repeat('a', 501),
        'quote_attribution' => str_repeat('a', 121),
        'cover_caption' => str_repeat('a', 256),
    ]))->assertSessionHasErrors(['pull_quote', 'quote_attribution', 'cover_caption']);
});

it('serves older stories with nullable editorial fields', function () {
    $story = storyRecord();

    $this->get(route('story.show', $story->slug))->assertInertia(fn (Assert $page) => $page
        ->where('story.pull_quote', null)
        ->where('story.quote_attribution', null)
        ->where('story.cover_caption', null));
});

function storyRecord(array $attributes = []): Story
{
    static $sequence = 0;
    $sequence++;

    return Story::query()->create(array_merge([
        'title' => "Coffee Story {$sequence}",
        'slug' => "coffee-story-{$sequence}",
        'category' => 'Coffee',
        'author_name' => 'Deklase',
        'excerpt' => 'A considered cup of coffee.',
        'body_html' => '<p>Thoughtful coffee, simply prepared.</p>',
        'cover_image_url' => '/storage/stories/cover.jpg',
        'status' => 'published',
        'published_at' => now()->subDays($sequence),
    ], $attributes));
}

function storyPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Better Coffee',
        'slug' => 'better-coffee',
        'category' => 'Brewing',
        'author_name' => 'Deklase',
        'excerpt' => 'Learn how to enjoy better coffee.',
        'body_html' => '<p>Great coffee begins with fresh beans.</p>',
        'status' => 'published',
        'cover_image' => UploadedFile::fake()->image('coffee.jpg'),
    ], $overrides);
}
