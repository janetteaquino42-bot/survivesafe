<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Announcement;
use App\Models\AwarenessMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    /**
    * Display the unified archive page
     */
    public function index(Request $request)
    {
        $type = $request->get('type', 'incidents');

        // Validate type
        if (!in_array($type, ['incidents', 'announcements', 'materials'])) {
            $type = 'incidents';
        }

        // Call the appropriate method based on type
        switch ($type) {
            case 'announcements':
                return $this->getAnnouncements($request);
            case 'materials':
                return $this->getMaterials($request);
            default:
                return $this->getIncidents($request);
        }
    }

    /**
     * Get deleted incidents
     */
    private function getIncidents(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', '');
        $severity = $request->get('severity', '');
        $type = $request->get('type', '');
        $fromDate = $request->get('from_date', '');
        $toDate = $request->get('to_date', '');

        // Fetch deleted incidents
        $query = Incident::onlyTrashed()
            ->with(['user:user_id,first_name,last_name,position,access']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($severity) {
            $query->where('severity', $severity);
        }

        if ($type) {
            $query->where('type', $type);
        }

        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }

        $incidents = $query->orderBy('deleted_at', 'desc')->paginate(10);

        return Inertia::render('Officer/Archive/Index', [
            'type' => 'incidents',
            'items' => $incidents,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'severity' => $severity,
                'type' => $type,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ],
        ]);
    }

    /**
     * Get deleted announcements
     */
    private function getAnnouncements(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', '');
        $fromDate = $request->get('from_date', '');
        $toDate = $request->get('to_date', '');

        // Fetch deleted announcements
        $query = Announcement::onlyTrashed()
            ->with('creator:user_id,first_name,last_name,position,access');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }

        $announcements = $query->orderBy('deleted_at', 'desc')->paginate(10);

        return Inertia::render('Officer/Archive/Index', [
            'type' => 'announcements',
            'items' => $announcements,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ],
        ]);
    }

    /**
     * Get deleted awareness materials
     */
    private function getMaterials(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', '');
        $fileType = $request->get('file_type', '');
        $fromDate = $request->get('from_date', '');
        $toDate = $request->get('to_date', '');

        // Fetch deleted awareness materials
        $query = AwarenessMaterial::onlyTrashed()
            ->with('creator:user_id,first_name,last_name,position,access');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($fileType) {
            $query->where('file_type', $fileType);
        }

        if ($fromDate) {
            $query->whereDate('created_at', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('created_at', '<=', $toDate);
        }

        $materials = $query->orderBy('deleted_at', 'desc')->paginate(10);

        return Inertia::render('Officer/Archive/Index', [
            'type' => 'materials',
            'items' => $materials,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'file_type' => $fileType,
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ],
        ]);
    }

    /**
     * Restore a deleted incident
     */
    public function restoreIncident($id)
    {
        $incident = Incident::onlyTrashed()->findOrFail($id);
        $incident->restore();

        return redirect()->back()->with('message', 'Incident restored successfully');
    }

    /**
     * Permanently delete an incident
     */
    public function forceDeleteIncident($id)
    {
        $incident = Incident::onlyTrashed()->findOrFail($id);
        $incident->forceDelete();

        return redirect()->back()->with('message', 'Incident permanently deleted');
    }

    /**
     * Restore a deleted announcement
     */
    public function restoreAnnouncement($id)
    {
        $announcement = Announcement::onlyTrashed()->findOrFail($id);
        $announcement->restore();

        return redirect()->back()->with('message', 'Announcement restored successfully');
    }

    /**
     * Permanently delete an announcement
     */
    public function forceDeleteAnnouncement($id)
    {
        $announcement = Announcement::onlyTrashed()->findOrFail($id);

        // Delete associated images
        if ($announcement->images) {
            foreach ($announcement->images as $image) {
                if (file_exists(public_path($image))) {
                    unlink(public_path($image));
                }
            }
        }

        $announcement->forceDelete();

        return redirect()->back()->with('message', 'Announcement permanently deleted');
    }

    /**
     * Restore a deleted awareness material
     */
    public function restoreMaterial($id)
    {
        $material = AwarenessMaterial::onlyTrashed()->findOrFail($id);
        $material->restore();

        return redirect()->back()->with('message', 'Awareness material restored successfully');
    }

    /**
     * Permanently delete an awareness material
     */
    public function forceDeleteMaterial($id)
    {
        $material = AwarenessMaterial::onlyTrashed()->findOrFail($id);

        // Delete associated file
        if ($material->file_path && file_exists(public_path($material->file_path))) {
            unlink(public_path($material->file_path));
        }

        $material->forceDelete();

        return redirect()->back()->with('message', 'Awareness material permanently deleted');
    }
}
