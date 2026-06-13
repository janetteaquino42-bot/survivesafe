<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserCanMakeTransactions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, let auth middleware handle it
        if (!$user) {
            return $next($request);
        }

        // If user is pending verification, redirect to verification notice
        if ($user->isPending() || !$user->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your email address is not verified or your account is pending approval.',
                    'redirect' => route('verification.notice')
                ], 403);
            }

            return redirect()->route('verification.notice')
                ->with('warning', 'Please verify your email address to access this feature.');
        }

        if ($user->unassignedBarangay()) {
            return redirect()->route('register.barangay')
                ->with('warning', 'Please select your barangay to access this feature.');
        }

        return $next($request);
    }
}
