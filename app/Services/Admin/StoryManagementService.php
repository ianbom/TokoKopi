<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\StoryRequest;
use App\Models\Story;
use App\Services\StoryHtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class StoryManagementService
{
    use ResolvesAdminPagination;
    use StoresUploadedFiles;

    public function indexData(Request $request): array
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'category' => $request->string('category')->toString(),
            'status' => $request->string('status')->toString(),
        ];

        return [
            'stories' => Story::query()
                ->when($filters['search'] !== '', fn ($query) => $query->where('title', 'like', '%'.$filters['search'].'%'))
                ->when($filters['category'] !== '', fn ($query) => $query->where('category', $filters['category']))
                ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
                ->select(['id', 'title', 'slug', 'category', 'author_name', 'cover_image_url', 'status', 'published_at'])
                ->latest('id')->paginate($this->perPage($request))->withQueryString(),
            'filters' => $filters,
            'categories' => Story::query()->distinct()->orderBy('category')->pluck('category'),
            'stats' => [
                'total' => Story::query()->count(),
                'published' => Story::query()->where('status', 'published')->count(),
                'draft' => Story::query()->where('status', 'draft')->count(),
            ],
        ];
    }

    public function save(StoryRequest $request, Story $story): void
    {
        $data = $request->validated();
        unset($data['cover_image']);
        $data['body_html'] = app(StoryHtmlSanitizer::class)->sanitize($data['body_html']);
        if (! preg_match('/[^\s\x{00a0}]/u', html_entity_decode(strip_tags($data['body_html']), ENT_QUOTES | ENT_HTML5, 'UTF-8'))) {
            throw ValidationException::withMessages(['body_html' => 'Isi story tidak boleh kosong.']);
        }
        $data['published_at'] = $data['status'] === 'published' ? ($story->published_at ?? now()) : null;
        $oldCover = $story->cover_image_url;
        $newCover = $request->hasFile('cover_image') ? $this->storePublicFile($request->file('cover_image'), 'stories') : null;
        if ($newCover !== null) {
            $data['cover_image_url'] = $newCover;
        }
        try {
            $story->fill($data)->saveOrFail();
        } catch (Throwable $exception) {
            $this->deletePublicFile($newCover);
            throw $exception;
        }
        if ($newCover !== null) {
            $this->deletePublicFile($oldCover);
        }
    }

    public function delete(Story $story): void
    {
        $cover = $story->cover_image_url;
        $story->deleteOrFail();
        $this->deletePublicFile($cover);
    }
}
