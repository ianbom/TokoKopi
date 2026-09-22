<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomeSettingRequest;
use App\Services\Admin\HomeSettingManagementService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class HomeSettingController extends Controller
{
    public function index(HomeSettingManagementService $settings): Response
    {
        return inertia('admin/home-settings/index', $settings->indexData());
    }

    public function update(HomeSettingRequest $request, HomeSettingManagementService $settings): RedirectResponse
    {
        $settings->update($request->validated());

        return back()->with('success', 'Home settings berhasil disimpan.');
    }
}
