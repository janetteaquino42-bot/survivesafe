<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Announcement::query()->with(['creator']);

        // Apply active year filter
        $this->applyYearFilter($query);

        // Officers see all approved materials, their own pending materials, and their own declined materials
        if ($user->access === 'officer') {
            $query->where(function ($q) use ($user) {
                $q->where('status', 'approved')
                    ->orWhere(function ($q2) use ($user) {
                        $q2->where('created_by', $user->user_id)
                            ->whereIn('status', ['pending', 'declined']);
                    });
            });
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by latest first
        $query->orderBy('created_at', 'desc');

        // Paginate results
        $announcements = $query->paginate(10)->withQueryString();

        // Transform the data
        $announcements->getCollection()->transform(function ($announcement) {
            return [
                'id' => $announcement->announcement_id,
                'title' => $announcement->title,
                'description' => $announcement->description,
                'images' => !empty($announcement->images) ? array_map(fn($img) => asset('storage/' . $img), $announcement->images) : [],
                'status' => $announcement->status,
                'decline_reason' => $announcement->decline_reason,
                'created_by' => $announcement->creator ? $announcement->creator->first_name . ' ' . $announcement->creator->last_name : 'Unknown',
                'creator_role' => $announcement->creator ? $announcement->creator->access : null,
                'created_at' => $announcement->created_at->format('M d, Y h:i A'),
                'updated_at' => $announcement->updated_at->format('M d, Y h:i A'),
            ];
        });

        return Inertia::render('Officer/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['status', 'from_date', 'to_date', 'search']),
            'canManage' => in_array($user->access, ['officer', 'head_officer']),
            'isHeadOfficer' => $user->access === 'head_officer',
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Only officers and head officers can create announcements
        if (!in_array($user->access, ['officer', 'head_officer'])) {
            return back()->with('error', 'You do not have permission to create announcements.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'images.max' => 'You can upload a maximum of 5 images.',
            'images.*.image' => 'All uploaded files must be images.',
            'images.*.mimes' => 'Images must be in JPEG, PNG, JPG, or GIF format.',
            'images.*.max' => 'Each image must not exceed 2MB.',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('announcements', 'public');
            }
        }

        // Head officers have auto-approved announcements
        $status = $user->access === 'head_officer' ? 'approved' : 'pending';

        Announcement::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'images' => $imagePaths,
            'status' => $status,
            'created_by' => $user->user_id,
        ]);

        return back()->with('success', $user->access === 'head_officer'
            ? 'Announcement created and published successfully.'
            : 'Announcement created and pending approval.');
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        $user = auth()->user();

        // Head officers can edit ANY announcement
        // Regular officers can only edit their own pending or declined announcements
        if ($user->access !== 'head_officer') {
            if ($announcement->created_by !== $user->user_id) {
                return back()->with('error', 'You can only update your own announcements.');
            }
            // Regular officers can only edit pending or declined
            if (!in_array($announcement->status, ['pending', 'declined'])) {
                return back()->with('error', 'Only pending or declined announcements can be updated.');
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'removed_images' => 'nullable|array',
            'removed_images.*' => 'string',
        ], [
            'images.max' => 'You can upload a maximum of 5 images.',
            'images.*.image' => 'All uploaded files must be images.',
            'images.*.mimes' => 'Images must be in JPEG, PNG, JPG, or GIF format.',
            'images.*.max' => 'Each image must not exceed 2MB.',
        ]);

        // Start with existing images
        $imagePaths = $announcement->images ?? [];

        // Handle removed images
        if ($request->has('removed_images')) {
            $removedUrls = $request->input('removed_images');
            foreach ($removedUrls as $url) {
                // Extract the path from the full URL
                // URL format: http://domain/storage/announcements/filename.jpg
                // We need to extract: announcements/filename.jpg
                $urlParts = parse_url($url);
                $path = ltrim($urlParts['path'], '/');
                // Remove 'storage/' prefix to get the actual storage path
                $path = str_replace('storage/', '', $path);

                // Remove from array
                $imagePaths = array_filter($imagePaths, function ($img) use ($path) {
                    return $img !== $path;
                });

                // Delete the file
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
            // Re-index array
            $imagePaths = array_values($imagePaths);
        }

        // Add new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('announcements', 'public');
            }
        }

        // Validate total images doesn't exceed 5
        if (count($imagePaths) > 5) {
            return back()->withErrors(['images' => 'Total images cannot exceed 5.'])->withInput();
        }

        // Head officers' edits are auto-approved, regular officers reset to pending
        $status = $user->access === 'head_officer' ? 'approved' : 'pending';

        $announcement->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'images' => $imagePaths,
            'status' => $status,
            'decline_reason' => null,
        ]);

        return back()->with('success', $user->access === 'head_officer'
            ? 'Announcement updated successfully.'
            : 'Announcement updated and resubmitted for approval.');
    }

    public function updateStatus(Request $request, $id)
    {
        // Only head officers can change status
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'You do not have permission to change announcement status.');
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,declined',
            'decline_reason' => 'required_if:status,declined|nullable|string',
        ]);

        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'status' => $validated['status'],
            'decline_reason' => $validated['status'] === 'declined' ? $validated['decline_reason'] : null,
        ]);

        return back()->with('success', 'Announcement status updated successfully.');
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $user = auth()->user();

        // Head officers can archive any, officers can only archive their own
        if ($user->access !== 'head_officer' && $announcement->created_by !== $user->user_id) {
            return back()->with('error', 'You do not have permission to archive this announcement.');
        }

        $announcement->delete(); // Soft delete

        return back()->with('success', 'Announcement moved to archive successfully.');
    }
}
