<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SelectRoleRequest extends FormRequest
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
            // Security fix: strictly prohibit 'admin' role elevation
            'role' => ['required', 'string', Rule::in(['client', 'provider'])],
            'email' => ['sometimes', 'nullable', 'string', 'email'],
            'userId' => ['sometimes', 'nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role.required' => "Role is required (must be 'provider' or 'client')",
            'role.in' => "Invalid role. Role must be 'provider' or 'client'",
            'email.email' => 'Invalid email',
        ];
    }
}
