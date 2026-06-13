<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $token = $request->route('token');
        $email = $request->email;

        // Validate that we have the required parameters
        if (!$token || !$email) {
            return redirect()->route('auth.invalid');
        }

        // Check if a password reset token exists for this email
        // If no token exists, it means it was already used or never created
        $tokenExists = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->exists();

        if (!$tokenExists) {
            return redirect()->route('auth.used');
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, redirect to login with success message
        if ($status == Password::PASSWORD_RESET) {
            // Explicitly delete the token to prevent reuse
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return redirect()->route('login')->with('status', 'Password reset successfully! Please log in with your new password.');
        }

        // Handle different failure scenarios
        switch ($status) {
            case Password::INVALID_TOKEN:
                return redirect()->route('auth.expired')->with('error', 'This password reset link has expired. Please request a new one.');

            case Password::INVALID_USER:
                return redirect()->route('auth.invalid')->with('error', 'We cannot find a user with that email address.');

            default:
                // For any other errors, redirect to expired page
                return redirect()->route('auth.expired')->with('error', 'This password reset link is no longer valid. Please request a new one.');
        }
    }
}
