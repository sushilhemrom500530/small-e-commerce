<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
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
            'oldPassword' => ['required', 'string', 'min:6'],
            'newPassword' => ['required', 'string', 'min:6', 'different:oldPassword'],
            'confirmPassword' => ['required', 'string', 'min:6', 'same:newPassword'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'oldPassword.required' => 'Old password is required',
            'oldPassword.min' => 'Confirm password must be at least 6 characters',
            'newPassword.required' => 'New password is required',
            'newPassword.min' => 'New password must be at least 6 characters',
            'newPassword.different' => 'New password must be different from old password',
            'confirmPassword.required' => 'Confirm password is required',
            'confirmPassword.same' => 'Passwords do not match',
            'confirmPassword.min' => 'Confirm password must be at least 6 characters',
        ];
    }
}
