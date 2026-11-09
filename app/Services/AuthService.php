<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Exceptions\AppException;
use App\Http\Resources\UserResource;
use App\Models\TempUser;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{
    public function __construct(
        protected JwtService $jwtService,
        protected OtpService $otpService,
        protected GoogleAuthService $googleAuthService,
        protected AppleAuthService $appleAuthService
    ) {}

    /**
     * Register a new user: checks existing users, stages in TempUser, sends OTP, and issues a verification token.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function registerUser(array $payload): array
    {
        $normalizedEmail = strtolower(trim((string) ($payload['email'] ?? '')));

        // 1. Check if email already exists in User model
        $existingUser = User::where('email', $normalizedEmail)->first();

        if ($existingUser && ($existingUser->status === 'deleted' || $existingUser->is_deleted)) {
            throw new AppException(400, 'This email has already been used; please try a different one.');
        }

        if ($existingUser) {
            throw new AppException(400, 'This email is already registered. Please login to continue.');
        }

        // 2. Clear previous unverified registration if exists
        TempUser::where('email', $normalizedEmail)->delete();

        // 3. Security check: normal registration can NEVER assign admin role
        $requestedRole = $payload['role'] ?? null;
        $role = in_array($requestedRole, [UserRole::ShopOwner->value, 'provider'], true)
            ? UserRole::ShopOwner->value
            : UserRole::Customer->value;

        // 4. Store user registration info in TempUser model
        $tempUser = TempUser::create([
            'name' => $payload['name'] ?? null,
            'email' => $normalizedEmail,
            'password' => Hash::make((string) $payload['password']),
            'role' => $role,
            'phone_number' => $payload['phoneNumber'] ?? ($payload['phone_number'] ?? null),
            'address' => $payload['address'] ?? null,
            'gender' => $payload['gender'] ?? null,
            'profile_url' => $payload['profileUrl'] ?? ($payload['profile_url'] ?? null),
            'service_name' => $payload['serviceName'] ?? ($payload['service_name'] ?? null),
            'service_lisence' => $payload['serviceLisence'] ?? ($payload['service_lisence'] ?? null),
            'status' => 'pending',
            'is_verified' => false,
            'is_profile_completed' => false,
        ]);

        // 5. Generate and send verification OTP
        $otp = $this->otpService->generateOtp($normalizedEmail);
        $this->otpService->sendOtpEmail($normalizedEmail, $otp, 'Account Verification');

        // 6. Issue verification JWT Token
        $token = $this->jwtService->generateVerificationToken($tempUser);

        return [
            'user' => [
                '_id' => (string) $tempUser->id,
                'id' => (string) $tempUser->id,
                'email' => $tempUser->email,
                'name' => (string) ($tempUser->name ?? ''),
                'role' => $tempUser->role,
            ],
            'role' => $tempUser->role,
            'token' => $token,
            'otp' => $this->otpService->formatOtpForResponse($otp),
        ];
    }

    /**
     * Login user: validates credentials and status, issues access and refresh tokens.
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function loginUser(string $email, string $password): array
    {
        $normalizedEmail = strtolower(trim($email));

        $user = User::where('email', $normalizedEmail)->first();

        if (! $user) {
            $tempUser = TempUser::where('email', $normalizedEmail)->first();
            if ($tempUser) {
                throw new AppException(400, 'Your account is not verified yet. Please verify your OTP to activate your account.');
            }

            throw new AppException(400, 'User not found');
        }

        if ($user->status === 'pending' || ! $user->is_verified) {
            throw new AppException(400, 'Your account is not verified. Please verify your account.');
        }

        if ($user->status === 'suspended') {
            throw new AppException(400, 'Your account is suspended. Please contact support.');
        }

        if ($user->status === 'deleted' || $user->is_deleted) {
            throw new AppException(400, 'Your account is deleted. Please contact support.');
        }

        if (! Hash::check($password, $user->password)) {
            throw new AppException(400, 'Invalid password');
        }

        $token = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        $userData = (new UserResource($user))->resolve();
        $shop = $user->shops()->first();
        if ($shop) {
            $userData['shop'] = [
                'id' => (int) $shop->id,
                'name' => (string) $shop->name,
                'slug' => (string) $shop->slug,
            ];
            $userData['shopId'] = (int) $shop->id;
            $userData['shopSlug'] = (string) $shop->slug;
            $userData['shopName'] = (string) $shop->name;
        }

        return [
            'user' => $userData,
            'role' => $user->role,
            'token' => $token,
            'accessToken' => $token,
            'refreshToken' => $refreshToken,
        ];
    }

    /**
     * Verify OTP: validates the OTP code, promotes TempUser to permanent User, and returns authenticated payload.
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function verifyOtp(?string $token, string $otp, ?string $requestEmail = null): array
    {
        $email = null;

        if ($token) {
            $decoded = $this->jwtService->verifyToken($token);
            $email = isset($decoded->email) ? strtolower(trim((string) $decoded->email)) : null;
        }

        if (! $email && $requestEmail) {
            $email = strtolower(trim($requestEmail));
        }

        if (! $email) {
            throw new AppException(400, 'Email could not be determined from the token or request body.');
        }

        // Verify OTP code
        $this->otpService->verifyOtp($email, $otp);

        // Find TempUser
        $tempUser = TempUser::where('email', $email)->first();

        if (! $tempUser) {
            $alreadyVerifiedUser = User::where('email', $email)->first();
            if ($alreadyVerifiedUser) {
                throw new AppException(400, 'This account is already verified. Please login to continue.');
            }

            throw new AppException(404, 'User not found');
        }

        // Promote to permanent User
        $user = User::create([
            'name' => $tempUser->name,
            'email' => $tempUser->email,
            'password' => $tempUser->password, // already hashed
            'role' => $tempUser->role,
            'phone_number' => $tempUser->phone_number,
            'address' => $tempUser->address,
            'gender' => $tempUser->gender,
            'profile_url' => $tempUser->profile_url,
            'service_name' => $tempUser->service_name,
            'service_lisence' => $tempUser->service_lisence,
            'is_profile_completed' => $tempUser->is_profile_completed,
            'status' => 'active',
            'is_verified' => true,
            'is_deleted' => false,
            'email_verified_at' => now(),
        ]);

        $tempUser->delete();

        $verifiedToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        return [
            'user' => (new UserResource($user))->resolve(),
            'role' => $user->role,
            'token' => $verifiedToken,
            'refreshToken' => $refreshToken,
        ];
    }

    /**
     * Resend verification OTP.
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function resendOtp(string $email): array
    {
        $normalizedEmail = strtolower(trim($email));

        $user = User::where('email', $normalizedEmail)->first();
        $tempUser = TempUser::where('email', $normalizedEmail)->first();

        if (! $user && ! $tempUser) {
            throw new AppException(404, 'User account not found');
        }

        $otp = $this->otpService->generateOtp($normalizedEmail);
        $this->otpService->sendOtpEmail($normalizedEmail, $otp, 'Account Verification');

        return [
            'otp' => $this->otpService->formatOtpForResponse($otp),
        ];
    }

    /**
     * Initiate forgot password flow: generates OTP and 10-minute reset token.
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function forgotPassword(string $email): array
    {
        $normalizedEmail = strtolower(trim($email));

        $user = User::where('email', $normalizedEmail)->first();

        if (! $user) {
            throw new AppException(404, 'User account not found');
        }

        if ($user->status === 'deleted' || $user->is_deleted) {
            throw new AppException(400, 'This account has been deleted. Please contact support.');
        }

        if ($user->status === 'suspended') {
            throw new AppException(400, 'This account has been suspended. Please contact support.');
        }

        $otp = $this->otpService->generateOtp($normalizedEmail);
        $this->otpService->sendOtpEmail($normalizedEmail, $otp, 'Password Reset');

        $token = $this->jwtService->generatePasswordResetToken($user);

        return [
            'token' => $token,
            'otp' => $this->otpService->formatOtpForResponse($otp),
        ];
    }

    /**
     * Verify forgot password OTP using reset session token.
     *
     * @throws AppException
     */
    public function forgotPasswordOtpVerify(string $token, string $otp): void
    {
        $decoded = $this->jwtService->verifyToken($token);
        $email = isset($decoded->email) ? strtolower(trim((string) $decoded->email)) : null;

        if (! $email) {
            throw new AppException(400, 'Invalid token payload');
        }

        $this->otpService->verifyForgotPasswordOtp($email, $otp);
    }

    /**
     * Reset password using reset session token.
     *
     * @throws AppException
     */
    public function resetPassword(string $token, string $newPassword): void
    {
        $decoded = $this->jwtService->verifyToken($token);
        $email = isset($decoded->email) ? strtolower(trim((string) $decoded->email)) : null;

        if (! $email) {
            throw new AppException(400, 'Invalid token payload');
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            throw new AppException(404, 'User not found');
        }

        $user->password = Hash::make($newPassword);
        $user->save();
    }

    /**
     * Change password for currently authenticated user.
     *
     * @throws AppException
     */
    public function changePassword(User $user, string $oldPassword, string $newPassword): void
    {
        if ($oldPassword === $newPassword) {
            throw new AppException(400, 'New password must be different from old password');
        }

        if (! Hash::check($oldPassword, $user->password)) {
            throw new AppException(401, 'Old password is incorrect');
        }

        $user->password = Hash::make($newPassword);
        $user->save();
    }

    /**
     * Sign in with Google (Native mobile ID token or OAuth access token).
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function googleSignIn(array $payload): array
    {
        $token = $payload['idToken'] ?? ($payload['identityToken'] ?? ($payload['token'] ?? null));

        if (! $token) {
            throw new AppException(400, 'Google ID token is required.');
        }

        // Security check: non-admin roles only
        $requestedRole = $payload['role'] ?? UserRole::Customer->value;
        if ($requestedRole === UserRole::Admin->value) {
            throw new AppException(400, "Invalid role. Role must be 'customer' or 'shop_owner'.");
        }
        $role = in_array($requestedRole, [UserRole::ShopOwner->value, 'provider'], true)
            ? UserRole::ShopOwner->value
            : UserRole::Customer->value;

        $googleData = $this->googleAuthService->verifyGoogleToken($token);
        $googleId = $googleData['sub'];
        $email = $googleData['email'] ? strtolower(trim($googleData['email'])) : null;

        // Find existing user by providerId or email
        $user = User::where(function ($query) use ($googleId, $email) {
            $query->where('provider', 'google')->where('provider_id', $googleId);
            if ($email) {
                $query->orWhere('email', $email);
            }
        })->first();

        $displayName = ! empty($payload['fullName'])
            ? trim((string) $payload['fullName'])
            : ($googleData['name'] ?: ($email ? explode('@', $email)[0] : 'Google User'));

        if (! $user) {
            $user = User::create([
                'name' => $displayName,
                'email' => $email ?: "{$googleId}@google.com",
                'role' => $role,
                'provider' => 'google',
                'provider_id' => $googleId,
                'profile_url' => $googleData['picture'] ?: 'https://iter-bene.s3.eu-north-1.amazonaws.com/uploads/users/ea97d957-1bf9-4e4a-b84c-f00525e0cca3.webp',
                'password' => Hash::make(Str::random(32)),
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => false,
                'email_verified_at' => now(),
            ]);
        } else {
            $updated = false;
            if ($user->provider_id !== $googleId || $user->provider !== 'google') {
                $user->provider = 'google';
                $user->provider_id = $googleId;
                $updated = true;
            }
            if ($googleData['picture'] && empty($user->profile_url)) {
                $user->profile_url = $googleData['picture'];
                $updated = true;
            }
            if (! $user->is_verified) {
                $user->is_verified = true;
                $updated = true;
            }
            if ($user->status === 'pending') {
                $user->status = 'active';
                $updated = true;
            }
            if ($updated) {
                $user->save();
            }
        }

        if ($user->is_deleted || $user->status === 'deleted') {
            throw new AppException(400, 'Your account is deleted. Please contact support.');
        }

        if ($user->status === 'suspended') {
            throw new AppException(400, 'Your account is suspended. Please contact support.');
        }

        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        $resource = (new UserResource($user))->resolve();

        return [
            'user' => $resource,
            'results' => $resource,
            'role' => $user->role,
            'token' => $accessToken,
            'refreshToken' => $refreshToken,
        ];
    }

    /**
     * Sign in with Apple (Native mobile identity token flow).
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function appleSignIn(array $payload): array
    {
        $identityToken = (string) ($payload['identityToken'] ?? '');

        if (! $identityToken) {
            throw new AppException(400, 'Apple identity token is required.');
        }

        // Security check: non-admin roles only
        $requestedRole = $payload['role'] ?? UserRole::Customer->value;
        if ($requestedRole === UserRole::Admin->value) {
            throw new AppException(400, "Invalid role. Role must be 'customer' or 'shop_owner'.");
        }
        $role = in_array($requestedRole, [UserRole::ShopOwner->value, 'provider'], true)
            ? UserRole::ShopOwner->value
            : UserRole::Customer->value;

        $appleData = $this->appleAuthService->verifyIdentityToken($identityToken);
        $appleId = $appleData['sub'];
        $email = $appleData['email'];

        $user = User::where(function ($query) use ($appleId, $email) {
            $query->where('provider', 'apple')->where('provider_id', $appleId);
            if ($email) {
                $query->orWhere('email', $email);
            }
        })->first();

        $displayName = ! empty($payload['fullName'])
            ? trim((string) $payload['fullName'])
            : ($email ? explode('@', $email)[0] : 'Apple User');

        if (! $user) {
            $fallbackEmail = $email ?: "{$appleId}@privaterelay.appleid.com";
            $user = User::create([
                'name' => $displayName,
                'email' => $fallbackEmail,
                'role' => $role,
                'provider' => 'apple',
                'provider_id' => $appleId,
                'password' => Hash::make(Str::random(32)),
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => false,
                'email_verified_at' => now(),
            ]);
        } else {
            $updated = false;
            if ($user->provider_id !== $appleId || $user->provider !== 'apple') {
                $user->provider = 'apple';
                $user->provider_id = $appleId;
                $updated = true;
            }
            if (! $user->is_verified) {
                $user->is_verified = true;
                $updated = true;
            }
            if ($user->status === 'pending') {
                $user->status = 'active';
                $updated = true;
            }
            if ($updated) {
                $user->save();
            }
        }

        if ($user->is_deleted || $user->status === 'deleted') {
            throw new AppException(400, 'Your account is deleted. Please contact support.');
        }

        if ($user->status === 'suspended') {
            throw new AppException(400, 'Your account is suspended. Please contact support.');
        }

        $accessToken = $this->jwtService->generateAccessToken($user);
        $refreshToken = $this->jwtService->generateRefreshToken($user);

        $resource = (new UserResource($user))->resolve();

        return [
            'user' => $resource,
            'results' => $resource,
            'role' => $user->role,
            'token' => $accessToken,
            'refreshToken' => $refreshToken,
        ];
    }

    /**
     * Update user role. Security fix: 'admin' is strictly forbidden!
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function selectRole(string $targetIdentifier, string $role): array
    {
        // Normalize legacy roles
        if ($role === 'provider') {
            $role = UserRole::ShopOwner->value;
        } elseif ($role === 'client') {
            $role = UserRole::Customer->value;
        }

        // Security check: ONLY customer and shop_owner are permissible
        if (! in_array($role, UserRole::assignableValues(), true)) {
            throw new AppException(400, "Invalid role. Role must be 'shop_owner' or 'customer'");
        }

        // Try User model first
        $user = null;
        if (is_numeric($targetIdentifier)) {
            $user = User::find($targetIdentifier);
        }
        if (! $user) {
            $user = User::where('email', strtolower(trim($targetIdentifier)))->first();
        }

        if ($user) {
            $user->role = $role;
            $user->save();

            $newToken = $this->jwtService->generateAccessToken($user);

            return [
                'user' => (new UserResource($user))->resolve(),
                'role' => $user->role,
                'token' => $newToken,
            ];
        }

        // If not found in User, check TempUser (staging)
        $tempUser = null;
        if (is_numeric($targetIdentifier)) {
            $tempUser = TempUser::find($targetIdentifier);
        }
        if (! $tempUser) {
            $tempUser = TempUser::where('email', strtolower(trim($targetIdentifier)))->first();
        }

        if ($tempUser) {
            $tempUser->role = $role;
            $tempUser->save();

            $tempToken = $this->jwtService->generateVerificationToken($tempUser);

            return [
                'user' => [
                    '_id' => (string) $tempUser->id,
                    'id' => (string) $tempUser->id,
                    'email' => $tempUser->email,
                    'name' => (string) ($tempUser->name ?? ''),
                    'role' => $tempUser->role,
                ],
                'role' => $tempUser->role,
                'token' => $tempToken,
            ];
        }

        throw new AppException(404, 'User not found');
    }

    /**
     * Refresh access and refresh tokens.
     *
     * @return array<string, mixed>
     *
     * @throws AppException
     */
    public function refreshToken(string $refreshToken): array
    {
        $decoded = $this->jwtService->verifyToken($refreshToken);

        $userId = $decoded->id ?? ($decoded->userId ?? null);
        if (! $userId) {
            throw new AppException(401, 'Invalid token payload');
        }

        $user = User::find($userId);
        if (! $user) {
            throw new AppException(404, 'User not found');
        }

        if ($user->status === 'suspended' || $user->is_deleted || $user->status === 'deleted') {
            throw new AppException(403, 'Your account is inactive. Please contact support.');
        }

        $newAccessToken = $this->jwtService->generateAccessToken($user);
        $newRefreshToken = $this->jwtService->generateRefreshToken($user);

        return [
            'token' => $newAccessToken,
            'refreshToken' => $newRefreshToken,
            'user' => (new UserResource($user))->resolve(),
        ];
    }
}
