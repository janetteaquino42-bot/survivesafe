<?php

namespace App\Http\Controllers;

use App\Models\AwarenessMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class AwarenessMaterialController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = AwarenessMaterial::query()->with(['creator']);

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

        if ($request->filled('file_type')) {
            $query->where('file_type', $request->file_type);
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
        $materials = $query->paginate(10)->withQueryString();

        // Transform the data
        $materials->getCollection()->transform(function ($material) {
            return [
                'id' => $material->material_id,
                'title' => $material->title,
                'description' => $material->description,
                'file_path' => $material->file_path ? asset('storage/' . $material->file_path) : null,
                'file_type' => $material->file_type,
                'video_link' => $material->video_link,
                'video_orientation' => $material->video_orientation,
                'status' => $material->status,
                'decline_reason' => $material->decline_reason,
                'created_by' => $material->creator ? $material->creator->first_name . ' ' . $material->creator->last_name : 'Unknown',
                'creator_role' => $material->creator ? $material->creator->access : null,
                'created_at' => $material->created_at->format('M d, Y h:i A'),
                'updated_at' => $material->updated_at->format('M d, Y h:i A'),
            ];
        });

        return Inertia::render('Officer/AwarenessMaterials/Index', [
            'materials' => $materials,
            'filters' => $request->only(['status', 'file_type', 'from_date', 'to_date', 'search']),
            'canManage' => in_array($user->access, ['officer', 'head_officer']),
            'isHeadOfficer' => $user->access === 'head_officer',
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Only officers and head officers can create awareness materials
        if (!in_array($user->access, ['officer', 'head_officer'])) {
            return back()->with('error', 'You do not have permission to create awareness materials.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif|max:10240', // 10MB max
            'video_link' => 'nullable|url',
            'video_orientation' => 'nullable|in:portrait,landscape',
        ], [
            'file.mimes' => 'File must be PDF, Word, PowerPoint, or Image format.',
            'file.max' => 'File must not exceed 10MB.',
            'video_link.url' => 'Video link must be a valid URL.',
        ]);

        // Validate that either file or video_link is provided
        if (!$request->hasFile('file') && !$request->filled('video_link')) {
            return back()->withErrors(['file' => 'Please provide either a file upload or a video link.'])->withInput();
        }

        $filePath = null;
        $fileType = null;
        $videoOrientation = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();

            // Determine file type
            if (in_array($extension, ['pdf'])) {
                $fileType = 'pdf';
            } elseif (in_array($extension, ['doc', 'docx'])) {
                $fileType = 'docx';
            } elseif (in_array($extension, ['ppt', 'pptx'])) {
                $fileType = 'pptx';
            } elseif (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                $fileType = 'image';
            }

            $filePath = $file->store('awareness_materials', 'public');
        } elseif ($request->filled('video_link')) {
            $fileType = 'video_link';
            $videoOrientation = $validated['video_orientation'] ?? 'landscape';
        }

        // Head officers have auto-approved materials
        $status = $user->access === 'head_officer' ? 'approved' : 'pending';

        AwarenessMaterial::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_path' => $filePath,
            'file_type' => $fileType,
            'video_link' => $validated['video_link'] ?? null,
            'video_orientation' => $videoOrientation,
            'status' => $status,
            'created_by' => $user->user_id,
        ]);

        return back()->with('success', $user->access === 'head_officer'
            ? 'Awareness material created and published successfully.'
            : 'Awareness material created and pending approval.');
    }

    public function update(Request $request, $id)
    {
        $material = AwarenessMaterial::findOrFail($id);
        $user = Auth::user();

        // Head officers can edit ANY material
        // Regular officers can only edit their own pending or declined materials
        if ($user->access !== 'head_officer') {
            if ($material->created_by !== $user->user_id) {
                return back()->with('error', 'You can only update your own materials.');
            }
            // Regular officers can only edit pending or declined
            if (!in_array($material->status, ['pending', 'declined'])) {
                return back()->with('error', 'Only pending or declined materials can be updated.');
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif|max:10240',
            'video_link' => 'nullable|url',
            'video_orientation' => 'nullable|in:portrait,landscape',
            'remove_file' => 'nullable|boolean',
        ], [
            'file.mimes' => 'File must be PDF, Word, PowerPoint, or Image format.',
            'file.max' => 'File must not exceed 10MB.',
            'video_link.url' => 'Video link must be a valid URL.',
        ]);

        $filePath = $material->file_path;
        $fileType = $material->file_type;
        $videoLink = $material->video_link;
        $videoOrientation = $material->video_orientation ?? 'landscape';

        // Handle file removal
        if ($request->input('remove_file')) {
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            $filePath = null;
            $fileType = null;
        }

        // Handle new file upload
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();

            // Determine file type
            if (in_array($extension, ['pdf'])) {
                $fileType = 'pdf';
            } elseif (in_array($extension, ['doc', 'docx'])) {
                $fileType = 'docx';
            } elseif (in_array($extension, ['ppt', 'pptx'])) {
                $fileType = 'pptx';
            } elseif (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                $fileType = 'image';
            }

            $filePath = $file->store('awareness_materials', 'public');
        }

        // Update video link
        if ($request->filled('video_link')) {
            $videoLink = $validated['video_link'];
            $videoOrientation = $validated['video_orientation'] ?? $videoOrientation;
            if (!$request->hasFile('file') && !$request->input('remove_file')) {
                $fileType = 'video_link';
            }
        } elseif (!$request->hasFile('file') && !$request->input('remove_file')) {
            $videoOrientation = $material->video_orientation ?? 'landscape';
        }

        // Head officers' edits are auto-approved, regular officers reset to pending
        $status = $user->access === 'head_officer' ? 'approved' : 'pending';

        $material->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_path' => $filePath,
            'file_type' => $fileType,
            'video_link' => $videoLink,
            'video_orientation' => $fileType === 'video_link' ? $videoOrientation : null,
            'status' => $status,
            'decline_reason' => null,
        ]);

        return back()->with('success', $user->access === 'head_officer'
            ? 'Awareness material updated successfully.'
            : 'Awareness material updated and resubmitted for approval.');
    }

    public function updateStatus(Request $request, $id)
    {
        // Only head officers can change status
        if (Auth::user()->access !== 'head_officer') {
            return back()->with('error', 'You do not have permission to change material status.');
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,declined',
            'decline_reason' => 'required_if:status,declined|nullable|string',
        ]);

        $material = AwarenessMaterial::findOrFail($id);
        $material->update([
            'status' => $validated['status'],
            'decline_reason' => $validated['status'] === 'declined' ? $validated['decline_reason'] : null,
        ]);

        return back()->with('success', 'Material status updated successfully.');
    }

    public function destroy($id)
    {
        $material = AwarenessMaterial::findOrFail($id);
        $user = Auth::user();

        // Head officers can archive any, officers can only archive their own
        if ($user->access !== 'head_officer' && $material->created_by !== $user->user_id) {
            return back()->with('error', 'You do not have permission to archive this material.');
        }

        $material->delete(); // Soft delete

        return back()->with('success', 'Awareness material moved to archive successfully.');
    }
}
