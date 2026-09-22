<?php

namespace App\Services\Admin;

use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;

class HomeSettingManagementService
{
    use StoresUploadedFiles;

    public function indexData(): array
    {
        return [
            'welcomeText' => SiteSetting::query()->where('key', 'welcome_text')->value('value') ?? "Coffee\nwithout\nthe routine.",
            'slides' => $this->slides(),
        ];
    }

    /**
     * @param  array{welcome_text: string, slides: array<int, array<string, mixed>>}  $data
     */
    public function update(array $data): void
    {
        $oldUrls = collect($this->slides())->pluck('image_url')->filter();
        $slides = collect($data['slides'])
            ->map(function (array $slide): array {
                $image = $slide['image'] ?? null;
                $imageUrl = $image instanceof UploadedFile
                    ? $this->storePublicFile($image, 'images/home')
                    : ($slide['image_url'] ?? null);

                return [
                    'image_url' => $imageUrl,
                    'alt_text' => $slide['alt_text'],
                    'sort_order' => (int) $slide['sort_order'],
                    'is_active' => (bool) $slide['is_active'],
                ];
            })
            ->sortBy('sort_order')
            ->values()
            ->all();

        SiteSetting::query()->updateOrCreate(
            ['key' => 'welcome_text'],
            ['value' => $data['welcome_text'], 'type' => 'text'],
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'welcome_carousel'],
            ['value' => json_encode($slides, JSON_THROW_ON_ERROR), 'type' => 'json'],
        );

        $newUrls = collect($slides)->pluck('image_url');
        $oldUrls->diff($newUrls)->each(fn (string $url) => $this->deletePublicFile($url));
    }

    /**
     * @return array<int, array{image_url: string, alt_text: string, sort_order: int, is_active: bool}>
     */
    private function slides(): array
    {
        $value = SiteSetting::query()->where('key', 'welcome_carousel')->value('value');
        $slides = json_decode((string) $value, true);

        return is_array($slides) ? $slides : [];
    }
}
