<?php

return [
    'secret' => env('JWT_SECRET_KEY', env('JWT_SECRET', 'default_jwt_secret_change_in_production_key_32_bytes')),
    'access_ttl' => (int) env('JWT_ACCESS_TOKEN_TTL', 2592000), // 30 days in seconds
    'refresh_ttl' => (int) env('JWT_REFRESH_TOKEN_TTL', 31536000), // 365 days in seconds
    'algo' => 'HS256',
    'issuer' => env('APP_URL', 'http://localhost'),
];
