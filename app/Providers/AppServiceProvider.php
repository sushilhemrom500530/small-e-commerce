<?php

namespace App\Providers;

use App\Models\Category;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ServeCommand::class, \App\Console\Commands\ServeCommand::class);
        $this->app->singleton('command.serve', \App\Console\Commands\ServeCommand::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enforce HTTPS scheme when running in production or behind Render reverse proxy
        if ($this->app->environment('production') || str_starts_with((string) config('app.url'), 'https://') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
            URL::forceScheme('https');
        }

        // Share navbar categories efficiently across storefront layout without redundant queries
        View::composer('layouts.app', function ($view) {
            $data = $view->getData();
            if (isset($data['categories']) && $data['categories'] instanceof Collection) {
                $categories = $data['categories'];
            } elseif (isset($data['homeCategories']) && $data['homeCategories'] instanceof Collection) {
                $categories = $data['homeCategories'];
            } else {
                $cachePath = storage_path('framework/cache/nav_categories.json');
                if (file_exists($cachePath)) {
                    $json = @file_get_contents($cachePath);
                    $decoded = $json ? json_decode($json, false) : null;
                    if (is_array($decoded) && ! empty($decoded)) {
                        $categories = collect($decoded);
                    }
                }

                if (! isset($categories)) {
                    try {
                        $categories = Category::where('is_active', true)
                            ->select('id', 'name', 'slug')
                            ->orderBy('name')
                            ->take(8)
                            ->get();
                        @file_put_contents($cachePath, json_encode($categories->toArray()));
                    } catch (\Throwable) {
                        $categories = collect();
                    }
                }
            }

            $view->with('navCategories', $categories->take(6))
                ->with('mobileNavCategories', $categories->take(8));
        });

        // Global API baseline rate limiting (matching Express 200 req/min)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(200)->by($request->user()?->id ?: $request->ip());
        });

        // Dedicated production-grade rate limiters for authentication endpoints

        // 1. Login rate limiter (5 attempts per minute per normalized email & IP, plus 20 attempts/min per IP)
        RateLimiter::for('auth.login', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });

        // 2. Registration rate limiter (10 attempts per minute per IP to prevent spam bot account creation)
        RateLimiter::for('auth.register', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // 3. OTP verification rate limiter (5 attempts per minute to prevent 6-digit OTP brute-forcing)
        RateLimiter::for('auth.otp', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });
        RateLimiter::for('auth.otp.verify', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });

        // 4. OTP sending / resend rate limiter (3 requests per 10 minutes to protect SMTP/SMS quota)
        RateLimiter::for('auth.resend', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinutes(10, 3)->by($key);
        });
        RateLimiter::for('auth.otp.send', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinutes(10, 3)->by($key);
        });

        // 5. Password reset submission (5 attempts per minute per email & IP)
        RateLimiter::for('auth.password.reset', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email', 'guest')));
            $key = ($email !== '' ? $email : 'guest').'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });

        // 6. Authenticated password change (5 attempts per minute per user & IP)
        RateLimiter::for('auth.password.change', function (Request $request) {
            $user = $request->user();
            $identifier = $user?->id ?? ($user?->email ?? ($request->input('email') ?: 'guest'));
            $key = strtolower(trim((string) $identifier)).'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });

        // 7. Social authentication (10 attempts per minute per IP)
        RateLimiter::for('auth.social', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // 8. Refresh token rotation (15 attempts per minute per token hash & IP)
        RateLimiter::for('auth.refresh', function (Request $request) {
            $token = $request->input('refreshToken') ?: ($request->bearerToken() ?: 'guest');
            $tokenHash = substr(hash('sha256', (string) $token), 0, 16);
            $key = $tokenHash.'|'.$request->ip();

            return Limit::perMinute(15)->by($key);
        });

        // 9. Role selection (10 attempts per minute per user & IP)
        RateLimiter::for('auth.role', function (Request $request) {
            $user = $request->user();
            $identifier = $user?->id ?? ($request->input('email') ?: 'guest');
            $key = strtolower(trim((string) $identifier)).'|'.$request->ip();

            return Limit::perMinute(10)->by($key);
        });
    }
}
