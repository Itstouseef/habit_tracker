<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Add all possible origins for your React app here
    'allowed_origins' => [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'http://192.168.100.34:5173' // Add this if you access React via IP
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];