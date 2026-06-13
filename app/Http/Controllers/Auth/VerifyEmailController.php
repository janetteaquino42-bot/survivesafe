<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerifyEmailController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function notice(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->route('home')
            : Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        // Check if already verified
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('auth.used')
                ->with('message', 'This email has already been verified.');
        }

        // Check if signature is valid (Laravel does this automatically via 'signed' middleware)
        // If signature is invalid, Laravel will throw 403, but we can catch invalid signatures

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            // Upgrade user from pending to buyer after verification
            $request->user()->upgradeToVerifiedUser();
        }

        return redirect()->intended(route('home', absolute: false) . '?verified=1')
            ->with('message', 'Email verified successfully! You can now make transactions.');
    }

    /**
     * Send a new email verification notification.
     */
    public function resend(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('home', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
