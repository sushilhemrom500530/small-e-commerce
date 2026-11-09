<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
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
            'role' => ['required', 'string', Rule::in(UserRole::assignableValues())],
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
            'role.required' => "Role is required (must be 'shop_owner' or 'customer')",
            'role.in' => "Invalid role. Role must be 'shop_owner' or 'customer'",
            'email.email' => 'Invalid email',
        ];
    }
}
