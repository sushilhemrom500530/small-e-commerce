<?php

namespace App\Services;

use App\Exceptions\AppException;
use App\Models\TempUser;
use App\Models\User;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Throwable;

class JwtService
{
    protected string $secret;

    protected int $accessTtl;

    protected int $refreshTtl;

    protected string $algo;

    public function __construct()
    {
        $this->secret = (string) config('jwt.secret', env('JWT_SECRET_KEY', 'default_jwt_secret_key'));
        $this->accessTtl = (int) config('jwt.access_ttl', 2592000); // 30 days
        $this->refreshTtl = (int) config('jwt.refresh_ttl', 31536000); // 365 days
        $this->algo = (string) config('jwt.algo', 'HS256');
    }

    /**
     * Generate an access token for a permanent User.
     */
    public function generateAccessToken(User $user): string
    {
        $now = time();
        $payload = [
            'id' => (string) $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'iat' => $now,
            'exp' => $now + $this->accessTtl,
        ];

        return JWT::encode($payload, $this->secret, $this->algo);
    }

    /**
     * Generate a refresh token for a permanent User.
     */
    public function generateRefreshToken(User $user): string
    {
        $now = time();
        $payload = [
            'id' => (string) $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'iat' => $now,
            'exp' => $now + $this->refreshTtl,
        ];

        return JWT::encode($payload, $this->secret, $this->algo);
    }

    /**
     * Generate a verification token for TempUser (registration flow).
     */
    public function generateVerificationToken(TempUser $tempUser): string
    {
        $now = time();
        $payload = [
            'id' => (string) $tempUser->id,
            'email' => $tempUser->email,
            'role' => $tempUser->role,
            'iat' => $now,
            'exp' => $now + $this->refreshTtl, // 365d matching Express
        ];

        return JWT::encode($payload, $this->secret, $this->algo);
    }

    /**
     * Generate short-lived token for password reset (10 minutes).
     */
    public function generatePasswordResetToken(User $user): string
    {
        $now = time();
        $payload = [
            'id' => (string) $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'iat' => $now,
            'exp' => $now + 600, // 10 minutes
        ];

        return JWT::encode($payload, $this->secret, $this->algo);
    }

    /**
     * Verify and decode a JWT token.
     *
     * @throws AppException
     */
    public function verifyToken(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->secret, $this->algo));
        } catch (ExpiredException) {
            throw new AppException(401, 'Verification session has expired. Please request a new OTP.');
        } catch (SignatureInvalidException) {
            throw new AppException(401, 'Invalid token provided. Please authenticate again.');
        } catch (Throwable) {
            throw new AppException(401, 'Invalid or expired authorization token.');
        }
    }

    /**
     * Decode payload without verifying signature (useful for inspecting header/claims before verification).
     */
    public function decodeWithoutVerification(string $token): ?object
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        $payloadJson = base64_decode(strtr($parts[1], '-_', '+/'));
        if (! $payloadJson) {
            return null;
        }

        $decoded = json_decode($payloadJson);

        return is_object($decoded) ? $decoded : null;
    }
}
