<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'barangay' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'barangay' => $request->barangay,
            'access' => 'pending', // Default to pending for approval
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('verification.notice', absolute: false));
    }

    /**
     * Update the barangay for OAuth registered users.
     */
    public function viewBarangay()
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail() && ! $user->unassignedBarangay()) {
            return redirect()->intended(route('home', absolute: false));
        }

        return Inertia::render('Auth/OAuthBarangay', [
            'user' => $user,
        ]);
    }

    /**
     * Update the barangay for OAuth registered users.
     */
    public function updateBarangay(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail() && ! $user->unassignedBarangay()) {
            return redirect()->intended(route('home', absolute: false));
        }

        $request->validate([
            'barangay' => 'required|string|max:255',
        ]);

        $user->update([
            'barangay' => $request->barangay,
        ]);

        return redirect()->route('home')
            ->with('success', 'Barangay successfully updated.');
    }
}
