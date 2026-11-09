<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'ios_client_id' => env('GOOGLE_IOS_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/v1/auth/google/callback'),
    ],

    'apple' => [
        'bundle_id' => env('APPLE_BUNDLE_ID'),
        'issuer' => env('APPLE_ISSUER', 'https://appleid.apple.com'),
        'keys_url' => env('APPLE_KEYS_URL', 'https://appleid.apple.com/auth/keys'),
    ],

    'cloudinary' => [
        'cloud_name' => env('CLOUDINARY_NAME'),
        'api_key' => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
    ],

];
