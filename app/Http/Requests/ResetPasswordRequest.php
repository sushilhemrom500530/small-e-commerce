<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
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
            'newPassword' => ['required', 'string', 'min:6'],
            'confirmPassword' => ['required', 'string', 'min:6', 'same:newPassword'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'newPassword.required' => 'Password is required',
            'newPassword.min' => 'Confirm password must be at least 6 characters',
            'confirmPassword.required' => 'Confirm password is required',
            'confirmPassword.same' => 'Passwords do not match',
            'confirmPassword.min' => 'Confirm password must be at least 6 characters',
        ];
    }
}
