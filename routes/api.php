<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    // 1. Registration & Login
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:auth.register');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:auth.login');

    // 2. OTP Verification & Resend
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])
        ->middleware('throttle:auth.otp');

    Route::post('/resend-otp', [AuthController::class, 'resendOtp'])
        ->middleware('throttle:auth.resend');

    // 3. Role Selection
    Route::match(['post', 'patch'], '/select-role', [AuthController::class, 'selectRole'])
        ->middleware(['throttle:auth.role', 'jwt.optional']);

    // 4. Password Reset Flow
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:auth.resend');

    Route::post('/forgot-otp-verify', [AuthController::class, 'forgotOtpVerify'])
        ->middleware('throttle:auth.otp');

    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:auth.password.reset');

    // 5. Password Change (requires valid JWT access token)
    Route::post('/change-password', [AuthController::class, 'changePassword'])
        ->middleware(['throttle:auth.password.change', 'jwt.auth:admin,shop_owner,customer']);

    // 6. Social Authentication
    Route::post('/google', [AuthController::class, 'googleSignIn'])
        ->middleware('throttle:auth.social');

    Route::get('/google', [AuthController::class, 'googleRedirect'])
        ->middleware('throttle:auth.social');

    Route::get('/google/callback', [AuthController::class, 'googleCallback'])
        ->middleware('throttle:auth.social');

    Route::post('/apple', [AuthController::class, 'appleSignIn'])
        ->middleware('throttle:auth.social');

    // 7. Token Management & Authenticated Profile
    Route::post('/refresh-token', [AuthController::class, 'refreshToken'])
        ->middleware('throttle:auth.refresh');

    Route::get('/me', [AuthController::class, 'me'])
        ->middleware('jwt.auth:admin,shop_owner,customer');
});
