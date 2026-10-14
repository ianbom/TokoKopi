<?php

namespace App\Http\Requests\Admin;

use App\Enums\ShippingStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShipmentStatusRequest extends FormRequest
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
            'shipping_status' => ['required', Rule::in(array_diff(ShippingStatus::values(), ['not_created', 'creating']))],
            'description' => ['required_if:shipping_status,'.implode(',', ShippingStatus::issueValues()), 'nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
