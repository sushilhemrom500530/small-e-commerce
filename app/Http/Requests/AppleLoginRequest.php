<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppleLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'identityToken' => ['required', 'string'],
            // Security fix: strictly prohibit 'admin' role elevation
            'role' => ['sometimes', 'nullable', 'string', Rule::in(['client', 'provider'])],
            'fullName' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'identityToken.required' => 'Apple identity token is required',
            'role.in' => 'Invalid role. Role must be client or provider',
        ];
    }
}
