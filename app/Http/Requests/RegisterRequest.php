<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
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
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:6'],
            'confirmPassword' => ['required', 'string', 'min:6', 'same:password'],
            // Security fix: strictly prohibit 'admin' role elevation during registration
            'role' => ['sometimes', 'nullable', 'string', Rule::in(UserRole::assignableValues())],
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phoneNumber' => ['sometimes', 'nullable', 'string', 'max:30'],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'gender' => ['sometimes', 'nullable', 'string', Rule::in(['male', 'female', 'other'])],
            'profileUrl' => ['sometimes', 'nullable', 'string'],
            'serviceName' => ['sometimes', 'nullable', 'string', 'max:255'],
            'serviceLisence' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'confirmPassword.required' => 'Confirm password is required',
            'confirmPassword.same' => 'Password and confirmPassword must match',
            'confirmPassword.min' => 'Confirm password must be at least 6 characters',
            'role.in' => 'Invalid role. Must be shop_owner or customer',
        ];
    }
}
