<?php

use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminShopController;
use App\Http\Controllers\Api\AdminShopOwnerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ShopCatalogController;
use App\Http\Controllers\Api\ShopProductController;
use App\Http\Controllers\Api\ShopProfileController;
use App\Http\Controllers\Api\StorefrontController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth.login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.optional');

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:auth.register');

    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:auth.login');

    Route::post('/logout', [AuthController::class, 'logout'])
        ->middleware('jwt.optional');

    Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])
        ->middleware('throttle:auth.otp');

    Route::post('/resend-otp', [AuthController::class, 'resendOtp'])
        ->middleware('throttle:auth.resend');

    Route::match(['post', 'patch'], '/select-role', [AuthController::class, 'selectRole'])
        ->middleware(['throttle:auth.role', 'jwt.optional']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:auth.resend');

    Route::post('/forgot-otp-verify', [AuthController::class, 'forgotOtpVerify'])
        ->middleware('throttle:auth.otp');

    Route::post('/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:auth.password.reset');

    Route::post('/change-password', [AuthController::class, 'changePassword'])
        ->middleware(['throttle:auth.password.change', 'jwt.auth:admin,shop_owner,customer']);

    Route::post('/google', [AuthController::class, 'googleSignIn'])
        ->middleware('throttle:auth.social');

    Route::get('/google', [AuthController::class, 'googleRedirect'])
        ->middleware('throttle:auth.social');

    Route::get('/google/callback', [AuthController::class, 'googleCallback'])
        ->middleware('throttle:auth.social');

    Route::post('/apple', [AuthController::class, 'appleSignIn'])
        ->middleware('throttle:auth.social');

    Route::post('/refresh-token', [AuthController::class, 'refreshToken'])
        ->middleware('throttle:auth.refresh');

    Route::get('/me', [AuthController::class, 'me'])
        ->middleware('jwt.auth:admin,shop_owner,customer');
});

// Authenticated current user shortcut & compatibility routes
Route::get('/me', [AuthController::class, 'me'])
    ->middleware('jwt.auth:admin,shop_owner,customer');
Route::get('/user/get-my-profile', [AuthController::class, 'me'])
    ->middleware('jwt.auth:admin,shop_owner,customer');
Route::get('/users/get-my-profile', [AuthController::class, 'me'])
    ->middleware('jwt.auth:admin,shop_owner,customer');

/*
|--------------------------------------------------------------------------
| Public Catalog & Categories
|--------------------------------------------------------------------------
*/
Route::get('/categories', [CategoryController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Public Customer Storefront Routes
|--------------------------------------------------------------------------
| Strict Requirement: Customers should only see products assigned to a shop.
| Displays shop-specific prices, thumbnails, and details.
*/
Route::prefix('store')->group(function () {
    Route::get('/shops', [StorefrontController::class, 'shops']);
    Route::get('/{slug}', [StorefrontController::class, 'shop']);
    Route::get('/{slug}/products', [StorefrontController::class, 'products']);
    Route::get('/{slug}/products/{productId}', [StorefrontController::class, 'product']);
});

/*
|--------------------------------------------------------------------------
| Admin Panel Routes (Strictly Role: admin)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware('jwt.auth:admin')->group(function () {
    // 1. Shop Management (CRUD)
    Route::apiResource('shops', AdminShopController::class);

    // 2. Shared Product Catalog Management (CRUD)
    Route::apiResource('products', AdminProductController::class);

    // 3. Shop Owners Management
    Route::get('/shop-owners', [AdminShopOwnerController::class, 'index']);
    Route::post('/shop-owners', [AdminShopOwnerController::class, 'store']);

    // 4. Categories Management
    Route::post('/categories', [CategoryController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Shop Owner Panel Routes (Roles: shop_owner, admin)
|--------------------------------------------------------------------------
*/
Route::prefix('shop')->middleware('jwt.auth:shop_owner,admin')->group(function () {
    // 1. My Shop Profile
    Route::get('/my-shop', [ShopProfileController::class, 'show']);
    Route::match(['put', 'patch'], '/my-shop', [ShopProfileController::class, 'update']);

    // 2. Shared Product Catalog Browser
    Route::get('/catalog', [ShopCatalogController::class, 'index']);
    Route::post('/catalog/{id}/add', [ShopCatalogController::class, 'addToShop']);
    Route::post('/products/{id}/add', [ShopCatalogController::class, 'addToShop']);

    // 3. Shop-Specific Product Listings & Management
    Route::get('/my-products', [ShopProductController::class, 'index']);
    Route::get('/products', [ShopProductController::class, 'index']);
    Route::post('/products', [ShopProductController::class, 'store']);
    Route::get('/products/{id}', [ShopProductController::class, 'show']);
    Route::match(['put', 'patch'], '/products/{id}', [ShopProductController::class, 'update']);
    Route::delete('/products/{id}', [ShopProductController::class, 'destroy']);
});
