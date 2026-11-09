<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GoogleLoginRequest extends FormRequest
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
            'idToken' => ['required_without_all:identityToken,token', 'nullable', 'string'],
            'identityToken' => ['required_without_all:idToken,token', 'nullable', 'string'],
            'token' => ['required_without_all:idToken,identityToken', 'nullable', 'string'],
            // Security fix: strictly prohibit 'admin' role elevation
            'role' => ['sometimes', 'nullable', 'string', Rule::in(UserRole::assignableValues())],
            'fullName' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'idToken.required_without_all' => 'Google ID token is required (idToken, identityToken, or token)',
            'role.in' => 'Invalid role. Role must be customer or shop_owner',
        ];
    }
}
