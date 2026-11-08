<?php

use App\Http\Middleware\ApiRequestLogger;
use App\Http\Middleware\JwtAuthenticate;
use App\Http\Middleware\OptionalJwtAuthenticate;
use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: env('API_PREFIX', 'api/v1'),
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->append(ApiRequestLogger::class);

        $middleware->alias([
            'jwt.auth' => JwtAuthenticate::class,
            'jwt.optional' => OptionalJwtAuthenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $errorMessages = [];
            foreach ($e->errors() as $field => $messages) {
                foreach ($messages as $message) {
                    $errorMessages[] = [
                        'path' => $field,
                        'message' => $message,
                    ];
                }
            }

            return ApiResponse::formatError('Validation Error', 400, $errorMessages);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::formatError('Access denied. No token provided.', 401, [
                ['path' => '', 'message' => $e->getMessage() ?: 'Access denied. No token provided.'],
            ]);
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::formatError('You are not authorized', 403, [
                ['path' => '', 'message' => $e->getMessage() ?: 'You are not authorized'],
            ]);
        });

        $exceptions->render(function (ThrottleRequestsException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $response = ApiResponse::formatError('Too many requests from this IP, please try again later', 429, [
                ['path' => '', 'message' => 'Too many requests. Please try again later.'],
            ]);
            foreach ($e->getHeaders() as $key => $value) {
                $response->headers->set($key, $value);
            }

            return $response;
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            return ApiResponse::formatError('Resource not found', 404, [
                ['path' => '', 'message' => $e->getMessage() ?: 'Resource not found'],
            ]);
        });
    })->create();
