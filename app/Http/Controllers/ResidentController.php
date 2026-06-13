<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AwarenessMaterial;
use App\Models\Incident;
use App\Models\PageContent;
use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ResidentController extends Controller
{
    /**
     * Display announcements for authenticated residents
     */
    public function announcements(Request $request): Response
    {
        $search = $request->input('search');

        $query = Announcement::with('creator:user_id,first_name,last_name,position,access')
            ->where('status', 'approved')
            ->whereYear('created_at', $this->getActiveYear())
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $announcements = $query->paginate(12)->through(function ($announcement) {
            $images = is_string($announcement->images) ? json_decode($announcement->images, true) : $announcement->images;

            return [
                'id' => $announcement->announcement_id,
                'title' => $announcement->title,
                'description' => $announcement->description,
                'type' => $announcement->type,
                'images' => is_array($images) ? array_map(function ($img) {
                    return strpos($img, 'http') === 0 ? $img : asset('storage/' . $img);
                }, $images) : [],
                'created_at' => $announcement->created_at->format('M d, Y'),
                'creator' => $announcement->creator ? [
                    'name' => trim($announcement->creator->first_name . ' ' . $announcement->creator->last_name)
                ] : null,
            ];
        });

        return Inertia::render('Resident/Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a specific announcement for authenticated residents
     */
    public function showAnnouncement($id): Response
    {
        $activeYear = $this->getActiveYear();

        $announcement = Announcement::with('creator:user_id,first_name,last_name,profile_image,position,access')
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->findOrFail($id);

        $images = is_string($announcement->images) ? json_decode($announcement->images, true) : $announcement->images;

        // Get previous and next announcements
        $previousAnnouncement = Announcement::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('created_at', '<', $announcement->created_at)
            ->orderBy('created_at', 'desc')
            ->first();

        $nextAnnouncement = Announcement::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('created_at', '>', $announcement->created_at)
            ->orderBy('created_at', 'asc')
            ->first();

        // Get recent announcements
        $recentAnnouncements = Announcement::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('announcement_id', '!=', $id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->announcement_id,
                    'title' => $item->title,
                    'type' => $item->type,
                    'created_at' => $item->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Resident/Announcements/Show', [
            'announcement' => [
                'id' => $announcement->announcement_id,
                'title' => $announcement->title,
                'description' => $announcement->description,
                'images' => is_array($images) ? array_map(function ($img) {
                    return strpos($img, 'http') === 0 ? $img : asset('storage/' . $img);
                }, $images) : [],
                'created_at' => $announcement->created_at->format('F d, Y'),
                'updated_at' => $announcement->updated_at->format('F d, Y'),
                'creator' => $announcement->creator ? [
                    'first_name' => $announcement->creator->first_name,
                    'last_name' => $announcement->creator->last_name,
                    'name' => trim($announcement->creator->first_name . ' ' . $announcement->creator->last_name),
                    'position' => $announcement->creator->position,
                    'access' => $announcement->creator->access,
                    'profile_image' => $announcement->creator->profile_image,
                ] : null,
            ],
            'previousAnnouncement' => $previousAnnouncement ? [
                'id' => $previousAnnouncement->announcement_id,
                'title' => $previousAnnouncement->title,
            ] : null,
            'nextAnnouncement' => $nextAnnouncement ? [
                'id' => $nextAnnouncement->announcement_id,
                'title' => $nextAnnouncement->title,
            ] : null,
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }

    /**
     * Display awareness materials for authenticated residents
     */
    public function awarenessMaterials(Request $request): Response
    {
        $search = $request->input('search');
        $fileType = $request->input('file_type');

        $query = AwarenessMaterial::with('creator:user_id,first_name,last_name,position,access')
            ->where('status', 'approved')
            ->whereYear('created_at', $this->getActiveYear())
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($fileType) {
            $query->where('file_type', $fileType);
        }

        $materials = $query->paginate(12)->through(function ($material) {
            return [
                'id' => $material->material_id,
                'title' => $material->title,
                'description' => $material->description,
                'file_type' => $material->file_type,
                'file_path' => $material->file_path ? asset('storage/' . $material->file_path) : null,
                'video_link' => $material->video_link,
                'video_orientation' => $material->video_orientation,
                'created_at' => $material->created_at->format('M d, Y'),
                'creator' => $material->creator ? [
                    'name' => trim($material->creator->first_name . ' ' . $material->creator->last_name)
                ] : null,
            ];
        });

        return Inertia::render('Resident/AwarenessMaterials/Index', [
            'materials' => $materials,
            'filters' => $request->only(['search', 'file_type']),
        ]);
    }

    /**
     * Display a specific awareness material for authenticated residents
     */
    public function showAwarenessMaterial($id): Response
    {
        $activeYear = $this->getActiveYear();

        $material = AwarenessMaterial::with('creator:user_id,first_name,last_name,profile_image,position,access')
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->findOrFail($id);

        // Get previous and next materials
        $previousMaterial = AwarenessMaterial::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('created_at', '<', $material->created_at)
            ->orderBy('created_at', 'desc')
            ->first();

        $nextMaterial = AwarenessMaterial::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('created_at', '>', $material->created_at)
            ->orderBy('created_at', 'asc')
            ->first();

        // Get related materials (same file type)
        $relatedMaterials = AwarenessMaterial::where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->where('material_id', '!=', $id)
            ->where('file_type', $material->file_type)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->material_id,
                    'title' => $item->title,
                    'file_type' => $item->file_type,
                    'created_at' => $item->created_at->format('M d, Y'),
                ];
            });

        $hero = PageContent::getSection('awareness_materials', 'hero');

        return Inertia::render('Resident/AwarenessMaterials/Show', [
            'material' => [
                'id' => $material->material_id,
                'title' => $material->title,
                'description' => $material->description,
                'file_type' => $material->file_type,
                'file_path' => $material->file_path ? asset('storage/' . $material->file_path) : null,
                'video_link' => $material->video_link,
                'video_orientation' => $material->video_orientation,
                'created_at' => $material->created_at->format('F d, Y'),
                'updated_at' => $material->updated_at->format('F d, Y'),
                'creator' => $material->creator ? [
                    'first_name' => $material->creator->first_name,
                    'last_name' => $material->creator->last_name,
                    'name' => trim($material->creator->first_name . ' ' . $material->creator->last_name),
                    'position' => $material->creator->position,
                    'access' => $material->creator->access,
                    'profile_image' => $material->creator->profile_image,
                ] : null,
            ],
            'previousMaterial' => $previousMaterial ? [
                'id' => $previousMaterial->material_id,
                'title' => $previousMaterial->title,
            ] : null,
            'nextMaterial' => $nextMaterial ? [
                'id' => $nextMaterial->material_id,
                'title' => $nextMaterial->title,
            ] : null,
            'relatedMaterials' => $relatedMaterials,
            'hero' => $hero,
        ]);
    }

    public function hazardMap(Request $request)
    {
        $user = Auth::user();
        $activeYear = $this->getActiveYear();

        // Get only verified incidents with coordinates for the map
        $incidentsQuery = Incident::query()
            ->with(['user'])
            ->where('status', 'verified')
            ->whereYear('created_at', $activeYear)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude');

        // Apply time filter to map incidents
        if ($request->filled('time_filter')) {
            $timeFilter = $request->time_filter;
            if ($timeFilter === '24h') {
                $incidentsQuery->where('created_at', '>=', now()->subHours(24));
            } elseif ($timeFilter === '3d') {
                $incidentsQuery->where('created_at', '>=', now()->subDays(3));
            } elseif ($timeFilter === '7d') {
                $incidentsQuery->where('created_at', '>=', now()->subDays(7));
            } elseif ($timeFilter === '31d') {
                $incidentsQuery->where('created_at', '>=', now()->subDays(31));
            }
            // 'all' doesn't filter by time
        }

        $incidents = $incidentsQuery->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($incident) {
                return [
                    'id' => $incident->incident_id,
                    'type' => $incident->type,
                    'severity' => $incident->severity,
                    'status' => $incident->status,
                    'barangay' => $incident->barangay,
                    'latitude' => (float) $incident->latitude,
                    'longitude' => (float) $incident->longitude,
                    'description' => $incident->description,
                    'reported_by' => $incident->user ? $incident->user->first_name . ' ' . $incident->user->last_name : 'Unknown',
                    'created_at' => $incident->created_at->format('M d, Y h:i A'),
                ];
            });

        // Get all incidents for the list below
        $allIncidentsQuery = Incident::query()->with(['user']);

        // Apply year filter
        $allIncidentsQuery->whereYear('created_at', $activeYear);

        // Exclude declined incidents from head officer view
        $allIncidentsQuery->where('status', '!=', 'declined');
        $allIncidentsQuery->where('status', '!=', 'active');

        // Apply time filter
        if ($request->filled('time_filter')) {
            $timeFilter = $request->time_filter;
            if ($timeFilter === '24h') {
                $allIncidentsQuery->where('created_at', '>=', now()->subHours(24));
            } elseif ($timeFilter === '3d') {
                $allIncidentsQuery->where('created_at', '>=', now()->subDays(3));
            } elseif ($timeFilter === '7d') {
                $allIncidentsQuery->where('created_at', '>=', now()->subDays(7));
            } elseif ($timeFilter === '31d') {
                $allIncidentsQuery->where('created_at', '>=', now()->subDays(31));
            }
            // 'all' doesn't filter by time
        }

        // Apply filters
        if ($request->filled('type')) {
            $allIncidentsQuery->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $allIncidentsQuery->where('status', $request->status);
        }

        if ($request->filled('severity')) {
            $allIncidentsQuery->where('severity', $request->severity);
        }

        if ($request->filled('barangay')) {
            $allIncidentsQuery->where('barangay', $request->barangay);
        }

        if ($request->filled('from_date')) {
            $allIncidentsQuery->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $allIncidentsQuery->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $allIncidentsQuery->where(function ($q) use ($search) {
                $q->where('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%");
            });
        }

        // Order by latest first
        $allIncidentsQuery->orderBy('created_at', 'desc');

        // Paginate results
        $allIncidents = $allIncidentsQuery->paginate(12)->withQueryString();

        // Transform the data
        $allIncidents->getCollection()->transform(function ($incident) {
            return [
                'id' => $incident->incident_id,
                'type' => $incident->type,
                'severity' => $incident->severity,
                'status' => $incident->status,
                'barangay' => $incident->barangay,
                'latitude' => $incident->latitude,
                'longitude' => $incident->longitude,
                'description' => $incident->description,
                'reported_by' => $incident->user ? $incident->user->first_name . ' ' . $incident->user->last_name : 'Unknown',
                'reporter_id' => $incident->reported_by,
                'created_at' => $incident->created_at->format('M d, Y h:i A'),
                'updated_at' => $incident->updated_at->format('M d, Y h:i A'),
            ];
        });

        return Inertia::render('Resident/HazardMap/Index', [
            'incidents' => $incidents,
            'allIncidents' => $allIncidents,
            'filters' => $request->only(['type', 'status', 'severity', 'barangay', 'from_date', 'to_date', 'search', 'time_filter']),
        ]);
    }

    /**
     * Display the contact page for residents
     */
    public function contact()
    {
        // Fetch contact page content
        $hero = PageContent::getSection('contact', 'hero');
        $contactInfo = PageContent::getSection('contact', 'info');
        $officeHours = PageContent::getSection('contact', 'hours');
        $socialMedia = PageContent::getSection('contact', 'social');
        $mapEmbed = PageContent::getSection('contact', 'map');

        return Inertia::render('Resident/Contact', [
            'hero' => $hero,
            'contactInfo' => $contactInfo,
            'officeHours' => $officeHours,
            'socialMedia' => $socialMedia,
            'mapEmbed' => $mapEmbed,
        ]);
    }

    /**
     * Handle contact form submission from residents
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);
        // Add user data to validated array
        $validated['name'] = Auth::user()->first_name . ' ' . Auth::user()->last_name;
        $validated['email'] = Auth::user()->email;

        try {
            // Send email to admin using Mailable
            Mail::to(config('mail.from.address'))
                ->send(new ContactFormMail($validated));

            return redirect()->back()->with('success', 'Your message has been sent successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            Log::error('Contact form email failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'There was an error sending your message. Please try again later.');
        }
    }
}
