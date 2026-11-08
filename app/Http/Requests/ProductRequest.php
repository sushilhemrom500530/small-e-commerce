<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isCreate = $this->isMethod('post');

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => [
                'required',
                Rule::exists('subcategories', 'id')->where('category_id', $this->category_id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [$isCreate && ! $this->hasFile('thumbnail') ? 'required' : 'nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'featured_images' => ['nullable'],
            'featured_images.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'new_price' => ['required', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category.',
            'subcategory_id.required' => 'Please select a subcategory for this product.',
            'subcategory_id.exists' => 'The selected subcategory does not belong to the selected category.',
            'name.required' => 'Product name is required.',
            'new_price.required' => 'Selling price is required.',
            'image.required' => 'Please upload a product thumbnail image.',
        ];
    }
}
