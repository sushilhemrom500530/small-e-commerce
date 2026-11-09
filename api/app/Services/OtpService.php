<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Mail\OtpMail;
use App\Models\EmailOtp;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class OtpService
{
    public const OTP_EXPIRY_SECONDS = 160;

    /**
     * Generate a 6-digit OTP, store in database and Redis, and delete old OTPs.
     */
    public function generateOtp(string $email): string
    {
        $normalizedEmail = strtolower(trim($email));

        // Delete any existing OTP records for this email
        EmailOtp::where('email', $normalizedEmail)->delete();
        Cache::forget("otp:{$normalizedEmail}");

        $otp = (string) random_int(100000, 999999);
        $expiresAt = now()->addSeconds(self::OTP_EXPIRY_SECONDS);

        EmailOtp::create([
            'email' => $normalizedEmail,
            'otp' => $otp,
            'expires_at' => $expiresAt,
            'verified' => false,
        ]);

        // Distributed cache store in Redis/Cache
        try {
            Cache::put("otp:{$normalizedEmail}", [
                'otp' => $otp,
                'expires_at' => $expiresAt->timestamp,
                'verified' => false,
            ], self::OTP_EXPIRY_SECONDS);
        } catch (Throwable $e) {
            Log::warning('Redis OTP cache failure: '.$e->getMessage());
        }

        return $otp;
    }

    /**
     * Send OTP email safely.
     */
    public function sendOtpEmail(string $email, string $otp, string $purpose = 'Verification'): void
    {
        try {
            Mail::to($email)->send(new OtpMail($otp, $purpose));
        } catch (Throwable $e) {
            Log::error('Failed to send OTP email: '.$e->getMessage());
        }
    }

    /**
     * Verify an OTP for registration or general verification.
     *
     * @throws AppException
     */
    public function verifyOtp(string $email, string $otp): bool
    {
        $normalizedEmail = strtolower(trim($email));

        $record = EmailOtp::where('email', $normalizedEmail)->latest()->first();

        if (! $record) {
            throw new AppException(404, 'OTP not found. Please request again.');
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            Cache::forget("otp:{$normalizedEmail}");
            throw new AppException(400, 'OTP expired. Please request a new one.');
        }

        if ($record->verified) {
            throw new AppException(400, 'OTP already verified');
        }

        if ($record->otp !== $otp) {
            throw new AppException(400, 'Invalid OTP. Please try again.');
        }

        $record->update(['verified' => true]);

        try {
            Cache::put("otp:{$normalizedEmail}", [
                'otp' => $otp,
                'expires_at' => $record->expires_at->timestamp,
                'verified' => true,
            ], self::OTP_EXPIRY_SECONDS);
        } catch (Throwable) {
            // non-fatal
        }

        return true;
    }

    /**
     * Verify OTP for forgot password flow.
     *
     * @throws AppException
     */
    public function verifyForgotPasswordOtp(string $email, string $otp): bool
    {
        $normalizedEmail = strtolower(trim($email));

        $record = EmailOtp::where('email', $normalizedEmail)->latest()->first();

        if (! $record) {
            throw new AppException(400, 'OTP not found. Please request again.');
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            Cache::forget("otp:{$normalizedEmail}");
            throw new AppException(400, 'OTP expired. Please request a new one.');
        }

        if ($record->otp !== $otp) {
            throw new AppException(400, 'Invalid OTP. Please try again.');
        }

        if ($record->verified) {
            throw new AppException(400, 'OTP already verified');
        }

        $record->update(['verified' => true]);

        return true;
    }

    /**
     * Decide whether OTP value can be returned in response.
     * Strict requirement: Keep OTP values secure, never return them in production responses.
     */
    public function formatOtpForResponse(string $otp): ?string
    {
        if (app()->environment('production') || config('app.env') === 'production') {
            return null;
        }

        return $otp;
    }
}
