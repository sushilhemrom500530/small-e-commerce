<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StorefrontController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\WebAuthController;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Public Storefront
Route::get('/', [StorefrontController::class, 'index'])->name('storefront.index');
Route::get('/products', [StorefrontController::class, 'products'])->name('storefront.products');
Route::get('/product/{product:slug}', [StorefrontController::class, 'show'])->name('storefront.product');
Route::get('/about', [StorefrontController::class, 'about'])->name('storefront.about');
Route::get('/contact', [StorefrontController::class, 'contact'])->name('storefront.contact');
Route::post('/contact', [StorefrontController::class, 'submitContact'])->name('storefront.contact.submit');

// Shopping Cart & Checkout
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
Route::post('/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

// Web Authentication & User Profile
Route::middleware('guest')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [WebAuthController::class, 'login'])->name('login.submit');
    Route::get('/register', [WebAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [WebAuthController::class, 'register'])->name('register.submit');
});

Route::middleware('auth')->group(function () {
    Route::match(['get', 'post'], '/logout', [WebAuthController::class, 'logout'])->name('logout');
    Route::get('/profile', [WebAuthController::class, 'profile'])->name('profile');
    Route::put('/profile', [WebAuthController::class, 'updateProfile'])->name('profile.update');
});

// Server Health Route
Route::get('/health', function (): JsonResponse {
    try {
        $dbStatus = Cache::remember('server_db_status', 10, function (): string {
            try {
                DB::connection()->getPdo();

                return 'connected';
            } catch (Throwable) {
                return 'disconnected';
            }
        });
    } catch (Throwable) {
        try {
            DB::connection()->getPdo();

            $dbStatus = 'connected';
        } catch (Throwable) {
            $dbStatus = 'disconnected';
        }
    }

    $appName = (string) config('app.name', 'E-Commerce Platform');

    return ApiResponse::formatResponse([
        'name' => $appName,
        'status' => 'online',
        'environment' => config('app.env', 'production'),
        'version' => '1.0.0',
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
        'timestamp' => now()->toIso8601String(),
        'services' => [
            'database' => $dbStatus,
        ],
        'endpoints' => [
            'health' => url('/health'),
            'auth' => url(trim((string) env('API_PREFIX', 'api/v1'), '/').'/auth'),
        ],
    ], "{$appName} is running smoothly.", 200);
})->name('health');

// Admin Management Portal
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('subcategories', SubcategoryController::class)->except(['show']);
    Route::get('categories/{category}/subcategories', [SubcategoryController::class, 'byCategory'])->name('categories.subcategories');
    Route::resource('products', ProductController::class)->except(['show']);
});
