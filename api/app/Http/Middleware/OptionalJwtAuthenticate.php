<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OptionalJwtAuthenticate
{
    public function __construct(
        protected JwtService $jwtService
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken()
            ?: ($request->cookie('token') ?: $request->cookies->get('token'));

        if (! $token && $request->hasHeader('cookie')) {
            $rawCookie = (string) $request->header('cookie');
            if (preg_match('/(?:^|;\s*)token=([^;]+)/', $rawCookie, $matches)) {
                $token = urldecode($matches[1]);
            }
        }

        if ($token) {
            try {
                $decoded = $this->jwtService->verifyToken($token);
                $userId = $decoded->id ?? ($decoded->userId ?? null);
                if ($userId) {
                    $user = User::find($userId);
                    $request->setUserResolver(fn () => $user);
                }
                $request->attributes->set('jwt_payload', $decoded);
            } catch (Throwable) {
                // optional: proceed unauthenticated
            }
        }

        return $next($request);
    }
}
