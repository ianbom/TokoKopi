<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['required', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('stories')->ignore($this->route('story'))],
            'category' => ['required', 'string', 'max:100'],
            'author_name' => ['required', 'string', 'max:100'],
            'excerpt' => ['required', 'string', 'max:1000'],
            'body_html' => ['required', 'string', 'max:200000'],
            'pull_quote' => ['nullable', 'string', 'max:500'],
            'quote_attribution' => ['nullable', 'string', 'max:120'],
            'cover_caption' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'cover_image' => [$this->route('story') ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
