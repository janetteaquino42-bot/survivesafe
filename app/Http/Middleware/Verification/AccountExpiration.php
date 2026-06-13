<?php

namespace App\Http\Middleware\Verification;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;


class AccountExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            Auth::check() &&
            Auth::user()->account_expires_at !== null &&
            strtotime(Auth::user()->account_expires_at) < strtotime(now())
        ) {
            Auth::logout(); // Log out the user
            return redirect('/login')->with('error', 'Your account has expired. Please contact support to renew your account.');
        }
        return $next($request);
    }
}
