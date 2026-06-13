<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


class FacebookAuthController extends Controller
{
    /**
     * Redirect the user to Facebook's OAuth page.
     */
    public function redirect()
    {
        return Socialite::driver('facebook')->redirect();
    }

    /**
     * Handle the callback from Facebook.
     */
    public function callback()
    {
        try {
            // Get the user information from Facebook
            $user = Socialite::driver('facebook')->user();
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Facebook authentication failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return redirect('/')->with('error', 'Facebook authentication failed.');
        }
    
        // Check if the user already exists in the database
        $existingUser = User::where('email', $user->email)->first();
    
        if ($existingUser) {
            // Log the user in if they already exist
            Auth::login($existingUser);
        } else {
            try {
                // Otherwise, create a new user and log them in
                $newUser = User::updateOrCreate([
                    'email' => $user->email,
                ], [
                    'full_name' => $user->name,
                    'password' => bcrypt(Str::random(16)), // Set a random password
                    'email_verified_at' => now(),
                ]);
                Auth::login($newUser);
            } catch (\Exception $e) {
                // Log any errors during user creation
                Log::error('Error creating or logging in user', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
    
                return redirect('/')->with('error', 'An error occurred while creating your account.');
            }
        }
    
        // Redirect the user to the dashboard or home page
        return redirect('/student/');
    }
}

