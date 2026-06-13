<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Trust proxies (required for Hostinger)
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'not_expired' => \App\Http\Middleware\Verification\AccountExpiration::class,
            'verified' => \App\Http\Middleware\EnsureUserCanMakeTransactions::class,
            'officer' => \App\Http\Middleware\OfficerMiddleware::class,
            'head_officer' => \App\Http\Middleware\HeadOfficerMiddleware::class,
            'resident' => \App\Http\Middleware\ResidentMiddleware::class,
        ])->validateCsrfTokens();
        //
    })

    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {

            // Let API / JSON requests behave normally
            if ($request->expectsJson()) {
                return null;
            }

            // Handle invalid signature for email verification
            if ($e instanceof \Illuminate\Routing\Exceptions\InvalidSignatureException) {
                return redirect()->route('auth.expired')
                    ->with('error', 'This verification link has expired or is invalid.');
            }

            // $status = ($e instanceof HttpExceptionInterface)
            //     ? $e->getStatusCode()
            //     : 500;
            // // dd($status);

            // if (in_array($status, [401, 403, 404, 500, 503])) {
            //     return Inertia::render("Errors/Error", [
            //         'status' => $status,
            //     ])
            //         ->toResponse($request)
            //         ->setStatusCode($status);
            // }

            return null; // fallback to Laravel default
        });
    });
