<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ContentManagementController extends Controller
{
    public function index()
    {
        // Only head officers can manage content
        if (auth()->user()->access !== 'head_officer') {
            abort(403, 'Unauthorized. Only head officers can manage content.');
        }

        $contents = PageContent::whereIn('page_key', ['home', 'about', 'contact', 'announcements', 'awareness_materials', 'hazard_map'])
            ->orderBy('page_key')
            ->orderBy('section_key')
            ->orderBy('order')
            ->get();

        return Inertia::render('HeadOfficer/ContentManagement/Index', [
            'contents' => $contents,
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'Unauthorized.');
        }

        $validated = $request->validate([
            'page_key' => 'required|string|max:50',
            'section_key' => 'nullable|string|max:50',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'meta' => 'nullable',
            'images' => 'nullable',
            'new_images' => 'nullable|array',
            'new_images.*' => 'nullable|file|image|max:5120', // 5MB max
            'embed_code' => 'nullable|string',
            'is_active' => 'nullable',
            'order' => 'nullable|integer',
        ]);

        // Convert is_active to boolean
        $isActive = true;
        if (isset($validated['is_active'])) {
            $isActive = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Parse meta if it's a JSON string
        $meta = null;
        if (isset($validated['meta'])) {
            $meta = is_string($validated['meta']) ? json_decode($validated['meta'], true) : $validated['meta'];
        }

        // Parse images if it's a JSON string
        $existingImages = [];
        if (isset($validated['images'])) {
            $existingImages = is_string($validated['images']) ? json_decode($validated['images'], true) : $validated['images'];
        }

        // Handle new image uploads
        $newImagePaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('page-content', 'public');
                $newImagePaths[] = $path;
            }
        }

        $allImages = array_merge($existingImages ?: [], $newImagePaths);

        $data = [
            'page_key' => $validated['page_key'],
            'section_key' => $validated['section_key'] ?? null,
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'] ?? null,
            'meta' => $meta,
            'images' => !empty($allImages) ? $allImages : null,
            'embed_code' => $validated['embed_code'] ?? null,
            'is_active' => $isActive,
            'order' => $validated['order'] ?? 0,
        ];

        PageContent::create($data);

        return back()->with('success', 'Content created successfully.');
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'Unauthorized.');
        }

        $content = PageContent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'meta' => 'nullable',
            'images' => 'nullable',
            'new_images' => 'nullable|array',
            'new_images.*' => 'nullable|file|image|max:5120',
            'embed_code' => 'nullable|string',
            'is_active' => 'nullable',
            'order' => 'nullable|integer',
        ]);

        // Convert is_active to boolean
        $isActive = $content->is_active;
        if (isset($validated['is_active'])) {
            $isActive = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Parse meta if it's a JSON string
        $meta = $content->meta;
        if (isset($validated['meta'])) {
            $meta = is_string($validated['meta']) ? json_decode($validated['meta'], true) : $validated['meta'];
        }

        // Parse images if it's a JSON string
        $existingImages = [];
        if (isset($validated['images'])) {
            $existingImages = is_string($validated['images']) ? json_decode($validated['images'], true) : $validated['images'];
        } else {
            $existingImages = $content->images ?? [];
        }

        // Handle new image uploads
        $newImagePaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('page-content', 'public');
                $newImagePaths[] = $path;
            }
        }

        // Combine existing and new images
        $allImages = array_merge($existingImages ?: [], $newImagePaths);

        $content->update([
            'title' => $validated['title'] ?? $content->title,
            'content' => $validated['content'] ?? $content->content,
            'meta' => $meta,
            'images' => !empty($allImages) ? $allImages : $content->images,
            'embed_code' => $validated['embed_code'] ?? $content->embed_code,
            'is_active' => $isActive,
            'order' => $validated['order'] ?? $content->order,
        ]);

        return back()->with('success', 'Content updated successfully.');
    }

    public function destroy($id)
    {
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'Unauthorized.');
        }

        $content = PageContent::findOrFail($id);

        // Delete associated images
        if ($content->images) {
            foreach ($content->images as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $content->delete();

        return back()->with('success', 'Content deleted successfully.');
    }

    public function deleteImage(Request $request, $id)
    {
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'Unauthorized.');
        }

        $content = PageContent::findOrFail($id);
        $imageToDelete = $request->input('image');

        if ($content->images && in_array($imageToDelete, $content->images)) {
            // Remove from array
            $images = array_filter($content->images, function ($img) use ($imageToDelete) {
                return $img !== $imageToDelete;
            });

            // Delete file
            Storage::disk('public')->delete($imageToDelete);

            // Update content
            $content->update(['images' => array_values($images)]);

            return back()->with('success', 'Image deleted successfully.');
        }

        return back()->with('error', 'Image not found.');
    }
}
