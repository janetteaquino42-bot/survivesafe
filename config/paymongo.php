<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PayMongo Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for PayMongo payment gateway integration.
    | You can get your API keys from https://dashboard.paymongo.com/
    |
    */

    'public_key' => env('PAYMONGO_PUBLIC_KEY', ''),
    'secret_key' => env('PAYMONGO_SECRET_KEY', ''),
    
    'webhook_secret' => env('PAYMONGO_WEBHOOK_SECRET', ''),
    
    'base_url' => env('PAYMONGO_BASE_URL', 'https://api.paymongo.com/v1'),
    
    /*
    |--------------------------------------------------------------------------
    | Payment Method Types
    |--------------------------------------------------------------------------
    |
    | Available payment methods for checkout sessions
    |
    */
    'payment_methods' => [
        'card',
        'paymaya',
        'gcash',
        'grab_pay',
        'billease',
        'dob',
        'dob_ubp'
    ],

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Default currency for payments
    |
    */
    'currency' => env('PAYMONGO_CURRENCY', 'PHP'),

    /*
    |--------------------------------------------------------------------------
    | Webhook Events
    |--------------------------------------------------------------------------
    |
    | Events to listen for from PayMongo webhooks
    |
    */
    'webhook_events' => [
        'checkout_session.payment.paid',
        'checkout_session.payment.failed',
        'payment_intent.payment.created',
        'payment_intent.payment.failed'
    ]
];