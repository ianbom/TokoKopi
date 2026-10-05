<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoryRequest;
use App\Models\Story;
use App\Services\Admin\StoryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class StoryController extends Controller
{
    public function index(Request $request, StoryManagementService $stories): Response
    {
        return inertia('admin/stories/index', $stories->indexData($request));
    }

    public function create(): Response
    {
        return inertia('admin/stories/form', ['mode' => 'create', 'story' => null]);
    }

    public function edit(Story $story): Response
    {
        return inertia('admin/stories/form', ['mode' => 'edit', 'story' => $story]);
    }

    public function store(StoryRequest $request, StoryManagementService $stories): RedirectResponse
    {
        $stories->save($request, new Story);

        return redirect()->route('admin.stories.index')->with('success', 'Story berhasil dibuat.');
    }

    public function update(StoryRequest $request, Story $story, StoryManagementService $stories): RedirectResponse
    {
        $stories->save($request, $story);

        return redirect()->route('admin.stories.index')->with('success', 'Story berhasil diperbarui.');
    }

    public function destroy(Story $story, StoryManagementService $stories): RedirectResponse
    {
        $stories->delete($story);

        return redirect()->route('admin.stories.index')->with('success', 'Story berhasil dihapus.');
    }
}
