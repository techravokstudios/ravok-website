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

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Add your production frontend URL(s) here or in .env CORS_ALLOWED_ORIGINS
    'allowed_origins' => array_filter(array_merge(
        explode(',', env('CORS_ALLOWED_ORIGINS', '')),
        [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://testing.ravokstudios.com',
        ]
    )),

    // Allow any localhost port (e.g. 3001), production domain, and Vercel previews
    // for techravokstudios's `ravok-website` repo (branch + commit-hash forms).
    'allowed_origins_patterns' => [
        '#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#',
        '#^https://(www\.)?ravokstudios\.com$#',
        '#^https://ravok-website(-git)?-[a-z0-9-]+-techravokstudios\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
