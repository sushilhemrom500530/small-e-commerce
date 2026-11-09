<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
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
            'otp' => ['required', 'string'],
            'email' => ['sometimes', 'nullable', 'string', 'email'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'otp.required' => 'Otp is required',
            'email.email' => 'Invalid email',
        ];
    }
}
