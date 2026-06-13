<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
    /**
     * Update profile photo (or seller store image for sellers)
     */
    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif,jfif|max:5120',
        ]);

        $user = Auth::user();

        // Check if user is an approved seller
        $seller = \App\Models\Seller::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if ($seller) {
            // For sellers, update store_image instead of profile_image
            if ($seller->store_image) {
                Storage::disk('public')->delete($seller->store_image);
            }

            $path = $request->file('profile_image')->store('sellers/store-images', 'public');
            $seller->update(['store_image' => '/storage/'.$path]);

            return back()->with('success', 'Store logo updated successfully');
        } else {
            // For regular users, update profile_image
            if ($user->profile_image) {
                $oldPath = str_replace('/storage/', '', $user->profile_image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('profile_image')->store('profile_images', 'public');
            $user->update(['profile_image' => '/storage/'.$path]);

            return back()->with('success', 'Profile photo updated successfully');
        }
    }

    /**
     * Update cover photo (or seller store banner for sellers)
     */
    public function updateCoverPhoto(Request $request)
    {
        $request->validate([
            'cover_photo' => 'required|image|mimes:jpeg,png,jpg,jfif,webp|max:5120',
        ]);

        $user = Auth::user();

        // Check if user is an approved seller
        $seller = \App\Models\Seller::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if ($seller) {
            // For sellers, update store_banner instead of cover_photo
            if ($seller->store_banner) {
                Storage::disk('public')->delete($seller->store_banner);
            }

            $path = $request->file('cover_photo')->store('sellers/store-banners', 'public');
            $seller->update(['store_banner' => '/storage/'.$path]);

            return back()->with('success', 'Store banner updated successfully');
        } else {
            // For regular users, update cover_photo
            if ($user->cover_photo) {
                $oldPath = str_replace('/storage/', '', $user->cover_photo);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('cover_photo')->store('cover_photos', 'public');
            $user->update(['cover_photo' => '/storage/'.$path]);

            return back()->with('success', 'Cover photo updated successfully');
        }
    }
}
