<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Category;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
                'toast' => fn () => $this->toast($request),
            ],
            'shop' => [
                'cart_count' => fn (): int => $this->cartCount($request),
                'featured_collections' => fn (): array => $this->featuredCategories(),
                'social_links' => fn (): array => $this->socialLinks(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function cartCount(Request $request): int
    {
        if (! $request->user()) {
            return 0;
        }

        return (int) Cart::query()
            ->where('user_id', $request->user()->id)
            ->withSum('items', 'quantity')
            ->first()?->items_sum_quantity;
    }

    /**
     * @return list<array{id: int, name: string, slug: string}>
     */
    private function featuredCategories(): array
    {
        return Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug'])
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{id: string, type: string, message: string}|null
     */
    private function toast(Request $request): ?array
    {
        foreach (['success', 'error', 'info', 'warning'] as $type) {
            $message = $request->session()->get($type);

            if ($message) {
                return [
                    'id' => (string) Str::uuid(),
                    'type' => $type,
                    'message' => $message,
                ];
            }
        }

        return null;
    }

    /**
     * @return array{instagram_url: string, tiktok_url: string}
     */
    private function socialLinks(): array
    {
        try {
            $settings = SiteSetting::query()
                ->whereIn('key', ['instagram_handle', 'tiktok_handle'])
                ->pluck('value', 'key');
        } catch (\Throwable) {
            $settings = collect();
        }

        $instagramHandle = $settings->get('instagram_handle') ?: '@Deklaseid';
        $tiktokHandle = $settings->get('tiktok_handle') ?: '@deklaseroastery';

        return [
            'instagram_url' => $this->formatSocialUrl($instagramHandle, 'https://instagram.com/'),
            'tiktok_url' => $this->formatSocialUrl($tiktokHandle, 'https://www.tiktok.com/@'),
        ];
    }

    private function formatSocialUrl(string $handle, string $baseUrl): string
    {
        $handle = trim($handle);

        if (Str::startsWith($handle, ['http://', 'https://'])) {
            return $handle;
        }

        $clean = ltrim($handle, '@/');

        if ($clean === '') {
            return $baseUrl;
        }

        return $baseUrl.$clean;
    }
}
