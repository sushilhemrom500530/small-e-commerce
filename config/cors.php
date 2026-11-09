<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => [
        (env('API_PREFIX') ? trim((string) env('API_PREFIX'), '/').'/*' : 'api/*'),
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => env('CORS_ORIGIN') && trim((string) env('CORS_ORIGIN')) !== ''
        ? array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ORIGIN')))))
        : ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => (bool) env('CORS_SUPPORTS_CREDENTIALS', false),

];
