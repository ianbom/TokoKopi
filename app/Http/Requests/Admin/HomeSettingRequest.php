<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class HomeSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin' && (bool) $this->user()?->is_active;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'welcome_text' => ['required', 'string', 'max:500'],
            'slides' => ['required', 'array', 'min:1'],
            'slides.*' => ['array'],
            'slides.*.image' => ['nullable', 'image', 'max:4096'],
            'slides.*.image_url' => ['nullable', 'string', 'max:2048'],
            'slides.*.alt_text' => ['required', 'string', 'max:255'],
            'slides.*.sort_order' => ['required', 'integer', 'min:0'],
            'slides.*.is_active' => ['required', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $slides = $this->input('slides', []);

            foreach ($slides as $index => $slide) {
                if (! is_array($slide)) {
                    continue;
                }

                if (! $this->file("slides.{$index}.image") && blank($slide['image_url'] ?? null)) {
                    $validator->errors()->add("slides.{$index}.image", 'Pilih file gambar.');
                }
            }

            if (! collect($slides)->contains(fn ($slide) => is_array($slide) && filter_var($slide['is_active'] ?? false, FILTER_VALIDATE_BOOL))) {
                $validator->errors()->add('slides', 'Aktifkan minimal satu slide.');
            }
        }];
    }
}
