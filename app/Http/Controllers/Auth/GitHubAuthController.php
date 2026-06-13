<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Str;

class GitHubAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('github')->redirect();
    }

    public function callback()
    {
        $githubUser = Socialite::driver('github')->user();

        $user = User::firstOrCreate([
            'email' => $githubUser->getEmail(),
        ], [
            'full_name' => $githubUser->getName() ?? $githubUser->getNickname(),
            'password' => bcrypt(Str::random(16)),
            'email_verified_at' => now(),
        ]);

        Auth::login($user);

        return redirect('/student/');
    }
}
