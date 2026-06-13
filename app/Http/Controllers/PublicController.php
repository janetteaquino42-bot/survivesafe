<?php

namespace App\Http\Controllers;

use App\Models\AwarenessMaterial;
use App\Models\Announcement;
use App\Models\Incident;
use App\Models\PageContent;
use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function home()
    {
        // Fetch home page content
        $hero = PageContent::getSection('home', 'hero');

        // Get all service sections (service_1, service_2, service_3, etc.)
        $services = PageContent::where('page_key', 'home')
            ->where('section_key', 'like', 'service_%')
            ->where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($service) {
                return [
                    'title' => $service->title,
                    'content' => $service->content,
                    'meta' => $service->meta,
                ];
            });

        $emergency = PageContent::getSection('home', 'emergency');

        // Get latest announcements
        $announcements = Announcement::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'type' => $announcement->type,
                    'created_at' => $announcement->created_at->format('M d, Y'),
                ];
            });

        // Get recent incidents (public overview) - only show verified or resolved
        $recentIncidents = Incident::whereIn('status', ['verified', 'resolved'])
            ->whereYear('created_at', $this->getActiveYear())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($incident) {
                return [
                    'type' => $incident->type,
                    'severity' => $incident->severity,
                    'barangay' => $incident->barangay,
                    'created_at' => $incident->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Public/Home', [
            'hero' => $hero,
            'services' => $services,
            'emergency' => $emergency,
            'announcements' => $announcements,
            'recentIncidents' => $recentIncidents,
        ]);
    }

    public function about()
    {
        // Fetch about page content
        $hero = PageContent::getSection('about', 'hero');
        $mission = PageContent::getSection('about', 'mission');
        $vision = PageContent::getSection('about', 'vision');
        $history = PageContent::getSection('about', 'history');
        $team = PageContent::getContent('about', 'team');
        $orgStructure = PageContent::getSection('about', 'org_structure');
        $gallery = PageContent::getContent('about', 'gallery');
        $coreFunctions = PageContent::getContent('about', 'core_function');

        return Inertia::render('Public/About', [
            'hero' => $hero,
            'mission' => $mission,
            'vision' => $vision,
            'history' => $history,
            'team' => $team,
            'orgStructure' => $orgStructure,
            'gallery' => $gallery,
            'coreFunctions' => $coreFunctions,
        ]);
    }

    public function contact()
    {
        // Fetch contact page content
        $hero = PageContent::getSection('contact', 'hero');
        $contactInfo = PageContent::getSection('contact', 'info');
        $officeHours = PageContent::getSection('contact', 'hours');
        $socialMedia = PageContent::getSection('contact', 'social');
        $mapEmbed = PageContent::getSection('contact', 'map');

        // Fetch recent verified incidents for hazard map
        $incidents = Incident::where('status', 'verified')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Public/Contact', [
            'hero' => $hero,
            'contactInfo' => $contactInfo,
            'officeHours' => $officeHours,
            'socialMedia' => $socialMedia,
            'mapEmbed' => $mapEmbed,
            'incidents' => $incidents,
        ]);
    }

    /**
     * Display public awareness materials page
     */
    public function awarenessMaterials(Request $request): Response
    {
        $hero = PageContent::getSection('awareness_materials', 'hero');
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

        return Inertia::render('Public/AwarenessMaterials/AwarenessMaterials', [
            'materials' => $materials,
            'hero' => $hero,
            'filters' => [
                'search' => $search,
                'file_type' => $fileType,
            ],
        ]);
    }

    /**
     * Display single awareness material
     */
    public function showAwarenessMaterial($id): Response
    {
        $material = AwarenessMaterial::with('creator:user_id,first_name,last_name,profile_image,position,access')
            ->where('material_id', $id)
            ->where('status', 'approved')
            ->whereYear('created_at', $this->getActiveYear())
            ->firstOrFail();

        $hero = PageContent::getSection('awareness_materials', 'hero');

        return Inertia::render('Public/AwarenessMaterials/AwarenessMaterialView', [
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
            'hero' => $hero,
        ]);
    }

    /**
     * Display public announcements page
     */
    public function announcements(Request $request): Response
    {
        $hero = PageContent::getSection('announcements', 'hero');
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

        $announcements = $query->paginate(12)->through(function ($announcement) {
            // Images is already cast as array in model
            $images = $announcement->images;
            if ($images && !is_array($images)) {
                $images = json_decode($images, true) ?? [];
            }

            return [
                'id' => $announcement->announcement_id,
                'title' => $announcement->title,
                'description' => $announcement->description,
                'images' => is_array($images) ? array_map(function ($img) {
                    return strpos($img, 'http') === 0 ? $img : asset('storage/' . $img);
                }, $images) : [],
                'created_at' => $announcement->created_at->format('M d, Y'),
                'creator' => $announcement->creator ? [
                    'name' => trim($announcement->creator->first_name . ' ' . $announcement->creator->last_name)
                ] : null,
            ];
        });

        return Inertia::render('Public/Announcements/Announcements', [
            'announcements' => $announcements,
            'hero' => $hero,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display single announcement
     */
    public function showAnnouncement($id): Response
    {
        $activeYear = $this->getActiveYear();

        $announcement = Announcement::with('creator:user_id,first_name,last_name,profile_image,position,access')
            ->where('announcement_id', $id)
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->firstOrFail();

        // Images is already cast as array in model
        $images = $announcement->images;
        if ($images && !is_array($images)) {
            $images = json_decode($images, true) ?? [];
        }

        // Get previous and next announcements
        $previousAnnouncement = Announcement::where('announcement_id', '<', $id)
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->orderBy('announcement_id', 'desc')
            ->first();

        $nextAnnouncement = Announcement::where('announcement_id', '>', $id)
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->orderBy('announcement_id', 'asc')
            ->first();

        // Get recent announcements
        $recentAnnouncements = Announcement::where('announcement_id', '!=', $id)
            ->where('status', 'approved')
            ->whereYear('created_at', $activeYear)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $images = $item->images;
                if ($images && !is_array($images)) {
                    $images = json_decode($images, true) ?? [];
                }
                return [
                    'id' => $item->announcement_id,
                    'title' => $item->title,
                    'image' => isset($images[0]) ? (strpos($images[0], 'http') === 0 ? $images[0] : asset('storage/' . $images[0])) : null,
                    'created_at' => $item->created_at->format('M d, Y'),
                ];
            });

        $hero = PageContent::getSection('announcements', 'hero');

        return Inertia::render('Public/Announcements/AnnouncementView', [
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
            'hero' => $hero,
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
     * Handle contact form submission and send email
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        try {
            // Send email to admin using Mailable
            Mail::to(config('mail.from.address'))
                ->send(new ContactFormMail($validated));

            return redirect()->back()->with('success', 'Your message has been sent successfully!');
        } catch (\Exception $e) {
            Log::error('Contact form email failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'There was an error sending your message. Please try again later.');
        }
    }

    /**
     * Display the public hazard map with verified incidents only.
     */
    public function hazardMap(Request $request): Response
    {
        $query = Incident::query()
            ->where('status', 'verified')
            ->whereYear('created_at', $this->getActiveYear())
            ->with(['reporter']);

        // Filter by type if provided
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by severity if provided
        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        // Filter by barangay if provided
        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $incidents = $query->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn($incident) => [
                'incident_id' => $incident->incident_id,
                'type' => $incident->type,
                'barangay' => $incident->barangay,
                'latitude' => $incident->latitude,
                'longitude' => $incident->longitude,
                'description' => $incident->description,
                'severity' => $incident->severity,
                'status' => $incident->status,
                'created_at' => $incident->created_at->format('F j, Y, g:i A'),
                'reporter' => [
                    'first_name' => $incident->reporter->first_name,
                    'last_name' => $incident->reporter->last_name,
                ],
            ]);

        // Get hazard map hero content
        $hero = PageContent::getSection('hazard_map', 'hero');

        return Inertia::render('Public/HazardMap', [
            'incidents' => $incidents,
            'filters' => $request->only(['type', 'severity', 'barangay', 'date_from', 'date_to']),
            'hero' => $hero,
        ]);
    }

    /**
     * Handle public incident reporting from the contact page
     */
    public function reportIncident(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:fire,flood,earthquake,landslide',
            'barangay' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string|max:5000',
            'severity' => 'required|in:low,medium,high',
        ]);

        try {
            // Create incident with active status for public reports
            $incident = Incident::create([
                'reported_by' => auth()->id() ?? null,
                'type' => $validated['type'],
                'barangay' => $validated['barangay'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'description' => $validated['description'] ?? null,
                'severity' => $validated['severity'],
                'status' => 'active', // Set to active for immediate visibility
            ]);

            return redirect()->back()->with('success', 'Incident reported successfully!');
        } catch (\Exception $e) {
            Log::error('Public incident reporting failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to report incident. Please try again.');
        }
    }
}
