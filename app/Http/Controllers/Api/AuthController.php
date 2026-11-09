<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Exceptions\AppException;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppleLoginRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\GoogleLoginRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\SelectRoleRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\GoogleAuthService;
use App\Services\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Cookie;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService,
        protected JwtService $jwtService,
        protected GoogleAuthService $googleAuthService
    ) {}

    /**
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->registerUser($request->validated());

        return $this->sendResponse(
            $result,
            'OTP has been sent to your email address. Please verify it to activate your account.',
            201
        );
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginUser($request->input('email'), $request->input('password'));

        $isProduction = app()->environment('production');

        $response = $this->sendResponse($result, 'Login successfully.', 201);

        $response->headers->setCookie(
            new Cookie('refreshToken', $result['refreshToken'], time() + (365 * 86400), '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );
        $response->headers->setCookie(
            new Cookie('token', $result['token'], time() + 86400, '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );

        return $response;
    }

    /**
     * POST /api/v1/auth/verify-otp
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $token = $request->bearerToken() ?? $request->cookie('token');
        $result = $this->authService->verifyOtp($token, $request->input('otp'), $request->input('email'));

        $isProduction = app()->environment('production');

        $response = $this->sendResponse($result, 'Account activated successfully.', 200);

        if (isset($result['refreshToken'])) {
            $response->headers->setCookie(
                new Cookie('refreshToken', $result['refreshToken'], time() + (365 * 86400), '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
            );
        }
        if (isset($result['token'])) {
            $response->headers->setCookie(
                new Cookie('token', $result['token'], time() + 86400, '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
            );
        }

        return $response;
    }

    /**
     * POST|PATCH /api/v1/auth/select-role
     */
    public function selectRole(SelectRoleRequest $request): JsonResponse
    {
        $authUser = $request->user();
        $targetIdentifier = $authUser?->id
            ?: ($authUser?->email
                ?: ($request->input('userId') ?: $request->input('email')));

        if (! $targetIdentifier) {
            throw new AppException(
                401,
                'User identification required. Please provide a Bearer token or pass email/userId.'
            );
        }

        $result = $this->authService->selectRole((string) $targetIdentifier, (string) $request->input('role'));

        return $this->sendResponse($result, 'Role updated successfully.', 200);
    }

    /**
     * POST /api/v1/auth/resend-otp
     */
    public function resendOtp(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->authService->resendOtp($request->input('email'));

        return $this->sendResponse($result, 'Otp send successfully. Please check your email.', 201);
    }

    /**
     * POST /api/v1/auth/forgot-password
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->authService->forgotPassword($request->input('email'));

        return $this->sendResponse($result, 'Otp send successfully. Please check your email to reset password.', 201);
    }

    /**
     * POST /api/v1/auth/forgot-otp-verify
     */
    public function forgotOtpVerify(VerifyOtpRequest $request): JsonResponse
    {
        $token = $request->bearerToken() ?? $request->cookie('token');
        if (! $token) {
            throw new AppException(401, 'Token not found');
        }

        $this->authService->forgotPasswordOtpVerify($token, $request->input('otp'));

        return $this->sendResponse(null, 'Opt verified successfully. Please reset your password.', 201);
    }

    /**
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $token = $request->bearerToken() ?? $request->cookie('token');
        if (! $token) {
            throw new AppException(401, 'Token not found');
        }

        $this->authService->resetPassword($token, $request->input('newPassword'));

        return $this->sendResponse([
            'message' => 'Password reset successful',
        ], 'Password reset successfully.', 201);
    }

    /**
     * POST /api/v1/auth/change-password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            throw new AppException(401, 'User not found');
        }

        $this->authService->changePassword($user, $request->input('oldPassword'), $request->input('newPassword'));

        return $this->sendResponse([
            'message' => 'Password changed successfully',
        ], 'Password changed successfully.', 201);
    }

    /**
     * POST /api/v1/auth/google (Native mobile / API)
     */
    public function googleSignIn(GoogleLoginRequest $request): JsonResponse
    {
        $result = $this->authService->googleSignIn($request->validated());

        $isProduction = app()->environment('production');

        $response = $this->sendResponse([
            'user' => $result['user'],
            'accessToken' => $result['token'],
            'token' => $result['token'],
            'refreshToken' => $result['refreshToken'],
        ], 'Google sign-in successful.', 200);

        $response->headers->setCookie(
            new Cookie('refreshToken', $result['refreshToken'], time() + (365 * 86400), '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );
        $response->headers->setCookie(
            new Cookie('token', $result['token'], time() + 86400, '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );

        return $response;
    }

    /**
     * POST /api/v1/auth/apple (Native mobile / API)
     */
    public function appleSignIn(AppleLoginRequest $request): JsonResponse
    {
        $result = $this->authService->appleSignIn($request->validated());

        $isProduction = app()->environment('production');

        $response = $this->sendResponse([
            'user' => $result['user'],
            'accessToken' => $result['token'],
            'token' => $result['token'],
            'refreshToken' => $result['refreshToken'],
        ], 'Apple sign-in successful.', 200);

        $response->headers->setCookie(
            new Cookie('refreshToken', $result['refreshToken'], time() + (365 * 86400), '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );
        $response->headers->setCookie(
            new Cookie('token', $result['token'], time() + 86400, '/', null, $isProduction, true, false, Cookie::SAMESITE_LAX)
        );

        return $response;
    }

    /**
     * GET /api/v1/auth/google (Web redirect OAuth flow)
     */
    public function googleRedirect(Request $request): RedirectResponse|JsonResponse
    {
        $role = $request->query('role', UserRole::Customer->value);
        $validRoles = UserRole::assignableValues(); // Security fix: 'admin' is prohibited

        if (! in_array($role, $validRoles, true)) {
            return $this->sendError('Invalid role parameter. Must be shop_owner or customer.', 400);
        }

        $clientId = config('services.google.client_id');
        $redirectUri = config('services.google.redirect');

        $state = base64_encode(json_encode([
            'role' => $role,
            'mobile' => $request->query('mobile') === 'true',
        ]));

        $url = 'https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid profile email',
            'state' => $state,
            'access_type' => 'offline',
        ]);

        return redirect()->away($url);
    }

    /**
     * GET /api/v1/auth/google/callback
     */
    public function googleCallback(Request $request): RedirectResponse|JsonResponse
    {
        $code = $request->query('code');
        if (! $code) {
            return $this->sendError('Authentication failed', 401);
        }

        $stateDecoded = ['role' => UserRole::Customer->value, 'mobile' => false];
        if ($request->query('state')) {
            try {
                $decoded = json_decode(base64_decode((string) $request->query('state')), true);
                if (is_array($decoded)) {
                    $stateDecoded = $decoded;
                }
            } catch (\Throwable) {
            }
        }

        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect');

        // Exchange code for token
        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
        ]);

        if (! $response->successful()) {
            return $this->sendError('Failed to obtain access token from Google', 400);
        }

        $tokenData = $response->json();
        $idToken = $tokenData['id_token'] ?? null;
        $accessToken = $tokenData['access_token'] ?? null;

        $role = in_array($stateDecoded['role'] ?? '', UserRole::assignableValues(), true) ? $stateDecoded['role'] : UserRole::Customer->value;

        $result = $this->authService->googleSignIn([
            'idToken' => $idToken,
            'token' => $accessToken,
            'role' => $role,
        ]);

        $isMobile = ! empty($stateDecoded['mobile']);

        if ($isMobile) {
            $deepLink = 'Practice Backend api://oauth-callback?token='.urlencode($result['token'])
                .'&refreshToken='.urlencode($result['refreshToken'])
                .'&role='.urlencode($result['role']);

            return redirect()->away($deepLink);
        }

        $clientUrl = env('CLIENT_URL', 'http://localhost:3000');

        return redirect()->away("{$clientUrl}/auth/callback?token=".urlencode($result['token'])
            .'&refreshToken='.urlencode($result['refreshToken']));
    }

    /**
     * POST /api/v1/auth/refresh-token
     */
    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->input('refreshToken')
            ?? ($request->bearerToken() ?? $request->cookie('refreshToken'));

        if (! $refreshToken) {
            throw new AppException(401, 'Refresh token is required');
        }

        $result = $this->authService->refreshToken($refreshToken);

        return $this->sendResponse($result, 'Token refreshed successfully.', 200);
    }

    /**
     * GET /api/v1/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            throw new AppException(401, 'Unauthenticated');
        }

        return $this->sendResponse((new UserResource($user))->resolve(), 'User profile retrieved successfully.', 200);
    }
}
