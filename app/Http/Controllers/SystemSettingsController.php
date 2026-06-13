<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Models\Incident;
use App\Models\Announcement;
use App\Models\AwarenessMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SystemSettingsController extends Controller
{
    /**
     * Display the system settings page
     */
    public function index()
    {
        // Get available years from database
        $incidentYears = Incident::selectRaw('YEAR(created_at) as year')
            ->whereNotNull('created_at')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->map(fn($year) => (int)$year);

        $announcementYears = Announcement::selectRaw('YEAR(created_at) as year')
            ->whereNotNull('created_at')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->map(fn($year) => (int)$year);

        $materialYears = AwarenessMaterial::selectRaw('YEAR(created_at) as year')
            ->whereNotNull('created_at')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->filter()
            ->map(fn($year) => (int)$year);

        // Combine and get unique years
        $availableYears = $incidentYears
            ->merge($announcementYears)
            ->merge($materialYears)
            ->unique()
            ->sort()
            ->values()
            ->reverse()
            ->values()
            ->toArray();

        // If no years found, add current year
        if (empty($availableYears)) {
            $availableYears = [(int)date('Y')];
        }

        $activeYear = SystemSetting::getActiveYear();

        // Get statistics for the active year
        $stats = $this->getYearStatistics($activeYear);

        return Inertia::render('HeadOfficer/SystemSettings/Index', [
            'availableYears' => array_values($availableYears),
            'activeYear' => (int)$activeYear,
            'statistics' => $stats,
        ]);
    }

    /**
     * Update the active year
     */
    public function updateYear(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:' . (date('Y') + 1),
        ]);

        SystemSetting::set('active_year', $request->year);

        return redirect()->back()->with('success', 'Active year updated to ' . $request->year);
    }

    /**
     * Get statistics for a specific year
     */
    private function getYearStatistics($year)
    {
        return [
            'incidents' => [
                'total' => Incident::whereYear('created_at', $year)->count(),
                'active' => Incident::whereYear('created_at', $year)->where('status', 'active')->count(),
                'verified' => Incident::whereYear('created_at', $year)->where('status', 'verified')->count(),
                'resolved' => Incident::whereYear('created_at', $year)->where('status', 'resolved')->count(),
                'declined' => Incident::whereYear('created_at', $year)->where('status', 'declined')->count(),
            ],
            'announcements' => [
                'total' => Announcement::whereYear('created_at', $year)->count(),
                'pending' => Announcement::whereYear('created_at', $year)->where('status', 'pending')->count(),
                'approved' => Announcement::whereYear('created_at', $year)->where('status', 'approved')->count(),
                'declined' => Announcement::whereYear('created_at', $year)->where('status', 'declined')->count(),
            ],
            'awareness_materials' => [
                'total' => AwarenessMaterial::whereYear('created_at', $year)->count(),
                'pending' => AwarenessMaterial::whereYear('created_at', $year)->where('status', 'pending')->count(),
                'approved' => AwarenessMaterial::whereYear('created_at', $year)->where('status', 'approved')->count(),
                'declined' => AwarenessMaterial::whereYear('created_at', $year)->where('status', 'declined')->count(),
            ],
        ];
    }
}
