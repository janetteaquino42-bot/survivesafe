<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google’s OAuth page.
     */
    public function redirect()
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    /**
     * Handle the callback from Google.
     */
    public function callback()
    {
        try {
            // Get the user information from Google
            $user = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            return redirect('/')->with('error', 'Google authentication failed.');
        }
        $existingUser = User::where('email', $user->email)->first();

        $avatar = $user->avatar;
        $highResAvatar = preg_replace('/=s\d+-c$/', '=s400-c', $avatar);

        if ($existingUser) {
            // Update the avatar URL if it doesn't exist
            if (! $existingUser->avatar_url) {
                $existingUser->update(['profile_image' => $highResAvatar]);
            }

            // Log the user in if they already exist
            Auth::login($existingUser);
        } else {
            $newUser = User::updateOrCreate([
                'email' => $user->email,
            ], [
                'first_name' => $user->user['given_name'],
                'last_name' => $user->user['family_name'],
                'password' => bcrypt(Str::random(16)), // Set a random password
                'email_verified_at' => now(),
                'profile_image' => $highResAvatar,
                'access' => 'resident',
                'barangay' => 'Unassigned',
            ]);
            Auth::login($newUser);
        }

        // Redirect the user to the dashboard or any other secure page
        return redirect('/register-barangay');
    }
}
