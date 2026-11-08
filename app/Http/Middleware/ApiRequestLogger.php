<?php

namespace App\Http\Middleware;

use App\Support\ClientDetector;
use App\Support\HttpConsoleLog;
use Closure;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ApiRequestLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);
        $request->attributes->set('_request_start_time', $start);

        try {
            return $next($request);
        } catch (Throwable $e) {
            $durationMs = (microtime(true) - $start) * 1000;
            $this->persist($request, null, $durationMs, $e);
            throw $e;
        }
    }

    /**
     * Perform any final actions for the request lifecycle after response has been sent to client.
     */
    public function terminate(Request $request, Response $response): void
    {
        $start = (float) $request->attributes->get('_request_start_time', microtime(true));
        $durationMs = (microtime(true) - $start) * 1000;
        $this->persist($request, $response, $durationMs);
    }

    /**
     * Persist request record to HttpConsoleLog and application logs.
     */
    protected function persist(Request $request, ?Response $response, float $durationMs, ?Throwable $exception = null): void
    {
        if ($this->shouldIgnore($request)) {
            return;
        }

        $date = now()->format('Y-m-d H:i:s');
        $method = strtoupper($request->method());
        $path = $request->getRequestUri();

        $statusCode = $exception
            ? (method_exists($exception, 'getStatusCode') ? (int) $exception->getStatusCode() : 500)
            : (int) ($response?->getStatusCode() ?? 200);

        $statusText = $this->getStatusText($statusCode);
        $clientInfo = ClientDetector::detect($request->userAgent());
        $ip = $this->resolveClientIp($request);
        $user = $this->resolveUser($request);
        $size = $response ? $this->contentSize($response) : 0;
        $ms = round($durationMs, 2);

        $body = $response?->getContent();
        $bodyStr = is_string($body) ? $body : '';
        $snip = strlen($bodyStr) > 8000 ? substr($bodyStr, 0, 8000) : $bodyStr;
        $decoded = $snip !== '' ? json_decode($snip, true) : null;
        $isHtml = $this->looksLikeHtml($snip);
        $isLoginPage = $isHtml && (
            str_contains($snip, 'Sign-in to Dashboard')
            || str_contains($snip, '/login"')
        );

        $message = null;
        $errors = null;
        $cause = null;
        $exceptionName = $exception ? class_basename($exception) : null;
        $stack = null;
        $sql = null;

        if ($exception) {
            $message = $this->friendlyExceptionMessage($exception);
            $cause = class_basename($exception);
            $stack = $message."\n".$this->shortStack($exception);
            if ($exception instanceof QueryException) {
                $sql = $exception->getSql();
            }
        } elseif (is_array($decoded)) {
            $message = $decoded['message'] ?? ($decoded['errorMessages'][0]['message'] ?? null);
            $errors = $decoded['errorMessages'] ?? ($decoded['errors'] ?? null);
        } elseif ($isLoginPage) {
            $message = 'Redirected to login page';
            $cause = 'Unauthenticated redirect to /login';
        } elseif ($statusCode >= 400) {
            $message = 'Request failed with status '.$statusCode;
        }

        $record = [
            'id' => (string) microtime(true),
            'date' => $date,
            'method' => $method,
            'path' => $path,
            'status' => $statusCode,
            'status_text' => $statusText,
            'duration_ms' => $ms,
            'client' => $clientInfo['display'],
            'browser' => $clientInfo['browser'],
            'platform' => $clientInfo['platform'],
            'device' => $clientInfo['device'],
            'ip' => $ip,
            'user' => $user,
            'size' => $size,
            'is_api' => $request->is('api/*'),
            'is_html' => $isHtml,
            'is_login_page' => $isLoginPage,
            'message' => $message,
            'cause' => $cause,
            'errors' => $errors,
            'exception' => $exceptionName,
            'stack' => $stack,
            'sql' => $sql,
        ];

        // 1. Write to the fast bridge for ServeCommand console output
        HttpConsoleLog::write($record);

        // 2. Also write to Laravel application log
        if (config('request-logger.log_file', true)) {
            $logMessage = "{$date} {$method} {$path} {$statusCode} {$statusText} ~ {$ms}ms [{$clientInfo['display']}] {$ip}".($user ? " ({$user})" : '');

            $logContext = [
                'method' => $method,
                'uri' => $path,
                'path' => $path,
                'status_code' => $statusCode,
                'status' => $statusCode,
                'duration_ms' => $ms,
                'ip' => $ip,
                'client' => $clientInfo['display'],
                'browser' => $clientInfo['browser'],
                'platform' => $clientInfo['platform'],
                'device' => $clientInfo['device'],
                'user' => $user,
            ];

            if ($statusCode >= 400 || $exception) {
                Log::warning($logMessage, array_filter(array_merge($logContext, [
                    'message' => $message,
                    'cause' => $cause,
                    'sql' => $sql,
                ])));
            } else {
                Log::info($logMessage, $logContext);
            }
        }
    }

    /**
     * Determine if the request should be skipped by the logger.
     */
    protected function shouldIgnore(Request $request): bool
    {
        if (! config('request-logger.enabled', true)) {
            return true;
        }

        $ignorePaths = config('request-logger.ignore_paths', ['favicon.ico', '*.ico', 'up']);

        foreach ($ignorePaths as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get a short description of the HTTP status code.
     */
    protected function getStatusText(int $statusCode): string
    {
        $standard = Response::$statusTexts[$statusCode] ?? 'UNKNOWN';

        return match ($statusCode) {
            422 => 'UNPROCESSABLE',
            500 => 'SERVER ERROR',
            default => strtoupper($standard),
        };
    }

    /**
     * Resolve the identifier for an authenticated user if available.
     */
    protected function resolveUser(Request $request): ?string
    {
        if (! config('request-logger.include_user', true)) {
            return null;
        }

        $user = $request->user();

        if ($user) {
            return (string) ($user->email ?? $user->name ?? "ID: {$user->getAuthIdentifier()}");
        }

        $jwtPayload = $request->attributes->get('jwt_payload');

        if (is_object($jwtPayload)) {
            if (! empty($jwtPayload->email)) {
                return (string) $jwtPayload->email;
            }

            $userId = $jwtPayload->id ?? ($jwtPayload->userId ?? null);

            if ($userId) {
                return "ID: {$userId}";
            }
        }

        return null;
    }

    private function friendlyExceptionMessage(Throwable $e): string
    {
        if ($e instanceof QueryException) {
            return $e->getMessage();
        }

        $message = $e->getMessage();

        return $message !== '' ? $message : 'Unhandled exception';
    }

    private function shortStack(Throwable $e): string
    {
        $lines = explode("\n", $e->getTraceAsString());
        $appLines = array_values(array_filter($lines, static function (string $line): bool {
            return str_contains($line, DIRECTORY_SEPARATOR.'app'.DIRECTORY_SEPARATOR)
                || str_contains($line, '/app/');
        }));

        $picked = $appLines !== [] ? array_slice($appLines, 0, 8) : array_slice($lines, 0, 5);

        return implode("\n", $picked);
    }

    private function looksLikeHtml(string $body): bool
    {
        $trim = ltrim($body);

        return $trim !== '' && (
            str_starts_with($trim, '<!DOCTYPE')
            || str_starts_with($trim, '<html')
            || str_starts_with($trim, '<HTML')
        );
    }

    private function contentSize(Response $response): int
    {
        $content = $response->getContent();

        if ($content === false || $content === null) {
            return 0;
        }

        return strlen($content);
    }

    protected static ?string $cachedLocalIp = null;

    /**
     * Resolve the requesting client IP address (from proxy headers, remote socket, or client LAN IP).
     */
    protected function resolveClientIp(Request $request): string
    {
        // 1. Direct proxy headers (Cloudflare, reverse proxies, ngrok, Vite dev proxy, Node proxy)
        $headers = [
            'cf-connecting-ip',
            'x-real-ip',
            'x-forwarded-for',
            'true-client-ip',
            'x-client-ip',
            'client-ip',
        ];

        foreach ($headers as $header) {
            $value = $request->header($header);
            if (! empty($value)) {
                $ips = array_map('trim', explode(',', $value));
                foreach ($ips as $candidate) {
                    if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                        if (! $this->isLoopback($candidate)) {
                            return $candidate;
                        }
                    }
                }
            }
        }

        // 2. Standard Laravel request IP (via trusted proxies)
        $requestIp = $request->ip();
        if ($requestIp && filter_var($requestIp, FILTER_VALIDATE_IP) && ! $this->isLoopback($requestIp)) {
            return $requestIp;
        }

        // 3. Direct server REMOTE_ADDR
        $remoteAddr = $request->server('REMOTE_ADDR');
        if ($remoteAddr && filter_var($remoteAddr, FILTER_VALIDATE_IP) && ! $this->isLoopback($remoteAddr)) {
            return $remoteAddr;
        }

        // 4. When the request originates from the local machine (loopback 127.0.0.1 / ::1),
        // resolve the client machine's actual LAN interface IP (e.g. 10.10.13.35 or 192.168.x.x)
        $localLanIp = $this->getLocalLanIp();
        if ($localLanIp) {
            return $localLanIp;
        }

        return $requestIp ?: ($remoteAddr ?: '127.0.0.1');
    }

    /**
     * Determine if an IP is a local loopback address.
     */
    protected function isLoopback(string $ip): bool
    {
        return $ip === '127.0.0.1' || $ip === '::1' || str_starts_with($ip, '127.');
    }

    /**
     * Detect the client machine's primary non-virtual LAN network interface IP.
     */
    protected function getLocalLanIp(): ?string
    {
        if (self::$cachedLocalIp !== null) {
            return self::$cachedLocalIp;
        }

        if (PHP_OS_FAMILY === 'Windows') {
            $output = @shell_exec('ipconfig');
            if ($output && preg_match_all('/IPv4 Address[ .]*:[ ]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/i', $output, $matches)) {
                foreach ($matches[1] as $candidate) {
                    if (! str_starts_with($candidate, '127.') && ! str_starts_with($candidate, '169.254.') && ! str_starts_with($candidate, '172.')) {
                        return self::$cachedLocalIp = $candidate;
                    }
                }
                foreach ($matches[1] as $candidate) {
                    if (! str_starts_with($candidate, '127.') && ! str_starts_with($candidate, '169.254.')) {
                        return self::$cachedLocalIp = $candidate;
                    }
                }
            }
        }

        $hostIp = @gethostbyname(gethostname());
        if ($hostIp && ! str_starts_with($hostIp, '127.')) {
            return self::$cachedLocalIp = $hostIp;
        }

        return self::$cachedLocalIp = null;
    }
}
