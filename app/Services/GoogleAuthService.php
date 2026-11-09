<?php

namespace App\Services;

use App\Exceptions\AppException;
use Illuminate\Support\Facades\Http;
use Throwable;

class GoogleAuthService
{
    /**
     * Verify Google ID token or Access Token and return profile data.
     *
     * @return array{sub: string, email: ?string, name: ?string, picture: ?string}
     *
     * @throws AppException
     */
    public function verifyGoogleToken(string $token): array
    {
        // 1. Try Google tokeninfo endpoint (standard for ID tokens)
        try {
            $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $token,
            ]);

            if ($response->successful()) {
                $payload = $response->json();
                if (! empty($payload['sub'])) {
                    $clientId = config('services.google.client_id');
                    $iosClientId = config('services.google.ios_client_id');
                    $allowedAudiences = array_values(array_filter([$clientId, $iosClientId]));

                    if (! empty($allowedAudiences) && ! empty($payload['aud'])) {
                        if (! in_array($payload['aud'], $allowedAudiences, true)) {
                            throw new AppException(401, 'Google token audience mismatch.');
                        }
                    }

                    return [
                        'sub' => (string) $payload['sub'],
                        'email' => isset($payload['email']) ? (string) $payload['email'] : null,
                        'name' => isset($payload['name']) ? (string) $payload['name'] : null,
                        'picture' => isset($payload['picture']) ? (string) $payload['picture'] : null,
                    ];
                }
            }
        } catch (AppException $e) {
            throw $e;
        } catch (Throwable) {
            // fallback below
        }

        // 2. Fallback: try Google's userinfo endpoint (in case mobile client passed access token)
        try {
            $userinfoRes = Http::timeout(10)
                ->withToken($token)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($userinfoRes->successful()) {
                $userinfo = $userinfoRes->json();
                if (! empty($userinfo['sub'])) {
                    return [
                        'sub' => (string) $userinfo['sub'],
                        'email' => isset($userinfo['email']) ? (string) $userinfo['email'] : null,
                        'name' => isset($userinfo['name']) ? (string) $userinfo['name'] : null,
                        'picture' => isset($userinfo['picture']) ? (string) $userinfo['picture'] : null,
                    ];
                }
            }
        } catch (Throwable) {
            // handled by final throw
        }

        throw new AppException(401, 'Invalid or expired Google token. Please try again.');
    }
}
