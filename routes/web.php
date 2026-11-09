<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/**
 * Server Status & Health Check Handler.
 */
$serverStatusHandler = function (): JsonResponse {
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

    $appName = (string) config('app.name', 'Small E-Commerce API');
    $apiPrefix = trim((string) env('API_PREFIX', 'api/v1'), '/');

    return response()->json([
        'statusCode' => 200,
        'success' => true,
        'message' => "{$appName} API server is running smoothly.",
        'results' => [
            'name' => $appName,
            'type' => 'api-server',
            'status' => 'online',
            'environment' => config('app.env', 'local'),
            'version' => '1.0.0',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'timestamp' => now()->toIso8601String(),
            'services' => [
                'database' => $dbStatus,
            ],
            'endpoints' => [
                'root' => url('/'),
                'health' => url('/health'),
                'api_base' => url($apiPrefix),
                'auth' => url($apiPrefix.'/auth'),
            ],
        ],
    ], 200);
};

// Health Check Route
Route::get('/health', $serverStatusHandler)->name('server.health');

// React Frontend SPA Routes
Route::get('/', function () {
    return view('app');
})->name('home');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$')->name('react');
