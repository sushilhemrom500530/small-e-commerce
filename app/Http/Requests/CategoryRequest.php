<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($categoryId)],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
