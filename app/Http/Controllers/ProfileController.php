<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(): Response
    {
        $user = Auth::user();

        return Inertia::render('Profile/Index', [
            'user' => [
                'user_id' => $user->user_id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'profile_image' => $user->profile_image,
                'access' => $user->access,
                'position' => $user->position,
                'barangay' => $user->barangay,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at->format('F j, Y'),
            ]
        ]);
    }

    /**
     * Display the account settings page.
     */
    public function settings(Request $request): Response
    {
        return $this->show();
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->user_id . ',user_id'],
            'profile_image' => ['nullable', 'image', 'max:2048'], // 2MB max
        ]);

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old profile image if exists
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Store new profile image
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = '/storage/' . $path;
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully');
    }

    /**
     * Delete the user's profile image.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
            $user->update(['profile_image' => null]);
        }

        return redirect()->back()->with('success', 'Profile image deleted successfully');
    }
}
