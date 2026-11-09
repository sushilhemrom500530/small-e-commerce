<?php

namespace App\Services;

use App\Exceptions\AppException;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class AppleAuthService
{
    /**
     * Verify Apple identity token and extract claims.
     *
     * @return array{sub: string, email: ?string}
     *
     * @throws AppException
     */
    public function verifyIdentityToken(string $identityToken): array
    {
        $parts = explode('.', $identityToken);
        if (count($parts) !== 3) {
            throw new AppException(401, 'Invalid Apple identity token. Please try again.');
        }

        $headerJson = base64_decode(strtr($parts[0], '-_', '+/'));
        $header = json_decode($headerJson, true);

        if (! isset($header['kid'])) {
            throw new AppException(401, 'Invalid Apple identity token. Please try again.');
        }

        $kid = $header['kid'];
        $keys = $this->getApplePublicKeys();

        if (! isset($keys[$kid])) {
            // Force refresh cache once in case keys rotated
            Cache::forget('apple_public_keys');
            $keys = $this->getApplePublicKeys();
            if (! isset($keys[$kid])) {
                throw new AppException(401, 'Invalid Apple identity token. Please try again.');
            }
        }

        try {
            $parsedKeys = JWK::parseKeySet(['keys' => array_values($keys)]);
            $decoded = JWT::decode($identityToken, $parsedKeys);

            $issuer = config('services.apple.issuer', 'https://appleid.apple.com');
            if (isset($decoded->iss) && $decoded->iss !== $issuer) {
                throw new AppException(401, 'Invalid Apple identity token issuer.');
            }

            $bundleIdConfig = config('services.apple.bundle_id');
            if ($bundleIdConfig) {
                $allowedAudiences = array_map('trim', explode(',', $bundleIdConfig));
                if (! empty($allowedAudiences) && isset($decoded->aud)) {
                    if (! in_array($decoded->aud, $allowedAudiences, true)) {
                        throw new AppException(401, 'Apple identity token audience mismatch.');
                    }
                }
            }

            if (empty($decoded->sub)) {
                throw new AppException(401, 'Could not extract user information from Apple token.');
            }

            return [
                'sub' => (string) $decoded->sub,
                'email' => isset($decoded->email) ? strtolower(trim((string) $decoded->email)) : null,
            ];
        } catch (AppException $e) {
            throw $e;
        } catch (Throwable) {
            throw new AppException(401, 'Invalid or expired Apple identity token. Please try again.');
        }
    }

    /**
     * Retrieve and cache Apple's public JWK keys.
     *
     * @return array<string, array<string, mixed>>
     *
     * @throws AppException
     */
    protected function getApplePublicKeys(): array
    {
        return Cache::remember('apple_public_keys', 3600, function () {
            $url = config('services.apple.keys_url', 'https://appleid.apple.com/auth/keys');

            try {
                $response = Http::timeout(10)->get($url);
                if (! $response->successful()) {
                    throw new AppException(503, 'Could not reach Apple to verify your sign-in. Please try again.');
                }

                $body = $response->json();
                if (! isset($body['keys']) || ! is_array($body['keys'])) {
                    throw new AppException(503, 'Could not parse Apple keys.');
                }

                $keyed = [];
                foreach ($body['keys'] as $key) {
                    if (isset($key['kid'])) {
                        $keyed[$key['kid']] = $key;
                    }
                }

                return $keyed;
            } catch (AppException $e) {
                throw $e;
            } catch (Throwable) {
                throw new AppException(503, 'Could not reach Apple to verify your sign-in. Please try again.');
            }
        });
    }
}
