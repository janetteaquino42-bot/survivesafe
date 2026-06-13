<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\User;
use App\Models\Announcement;
use App\Models\AwarenessMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $period = $request->input('period', '7days');
        if (!in_array($period, ['7days', '1month', 'year'], true)) {
            $period = '7days';
        }

        [$startDate, $endDate, $chartLabel, $dateFormat, $bucketType] = $this->getDashboardPeriodRange($period);

        $incidentQuery = fn() => Incident::notDeleted()->whereBetween('created_at', [$startDate, $endDate]);
        $announcementQuery = fn() => Announcement::notDeleted()->whereBetween('created_at', [$startDate, $endDate]);

        // Get incident statistics
        $incidentStats = [
            'total' => $incidentQuery()->count(),
            'fire' => $incidentQuery()->ofType('fire')->count(),
            'flood' => $incidentQuery()->ofType('flood')->count(),
            'earthquake' => $incidentQuery()->ofType('earthquake')->count(),
            'landslide' => $incidentQuery()->ofType('landslide')->count(),
            'active' => $incidentQuery()->withStatus('active')->count(),
            'verified' => $incidentQuery()->withStatus('verified')->count(),
            'resolved' => $incidentQuery()->withStatus('resolved')->count(),
            'low' => $incidentQuery()->withSeverity('low')->count(),
            'medium' => $incidentQuery()->withSeverity('medium')->count(),
            'high' => $incidentQuery()->withSeverity('high')->count(),
        ];

        // Get recent incidents (last 5)
        $recentIncidents = Incident::notDeleted()
            ->with('reporter:user_id,first_name,last_name')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($incident) {
                return [
                    'id' => $incident->incident_id,
                    'type' => $incident->type,
                    'barangay' => $incident->barangay,
                    'severity' => $incident->severity,
                    'status' => $incident->status,
                    'description' => $incident->description,
                    'reporter_name' => $incident->reporter ? $incident->reporter->full_name : 'Unknown',
                    'created_at' => $incident->created_at->diffForHumans(),
                ];
            });

        // Get recent announcements
        $recentAnnouncements = $announcementQuery()
            ->with('creator:user_id,first_name,last_name,position,access')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($announcement) {
                $creatorName = 'System';
                if ($announcement->creator) {
                    if ($announcement->creator->position && $announcement->creator->access !== 'resident') {
                        $creatorName = $announcement->creator->position . ' - ' . $announcement->creator->full_name;
                    } else {
                        $creatorName = $announcement->creator->full_name;
                    }
                }
                return [
                    'id' => $announcement->announcement_id,
                    'title' => $announcement->title,
                    'description' => $announcement->description,
                    'creator_name' => $creatorName,
                    'created_at' => $announcement->created_at->diffForHumans(),
                ];
            });

        // User-specific stats
        $userStats = [];
        if ($user->isResident() || $user->isPending()) {
            $userStats = [
                'my_reports' => Incident::where('reported_by', $user->user_id)->notDeleted()->whereBetween('created_at', [$startDate, $endDate])->count(),
                'pending_reports' => Incident::where('reported_by', $user->user_id)->notDeleted()->withStatus('active')->whereBetween('created_at', [$startDate, $endDate])->count(),
                'resolved_reports' => Incident::where('reported_by', $user->user_id)->notDeleted()->withStatus('resolved')->whereBetween('created_at', [$startDate, $endDate])->count(),
            ];
        }

        if ($user->isOfficer()) {
            $userStats = [
                'total_users' => User::count(),
                'pending_users' => User::withAccess('pending')->count(),
                'total_materials' => AwarenessMaterial::notDeleted()->whereBetween('created_at', [$startDate, $endDate])->count(),
                'my_materials' => AwarenessMaterial::where('created_by', $user->user_id)->notDeleted()->whereBetween('created_at', [$startDate, $endDate])->count(),
            ];
        }

        // Chart data for incident trends using the selected period
        $chartData = $this->buildDashboardChartData($incidentQuery(), $startDate, $endDate, $bucketType, $dateFormat);

        return Inertia::render('Dashboard/Index', [
            'incidentStats' => $incidentStats,
            'recentIncidents' => $recentIncidents,
            'recentAnnouncements' => $recentAnnouncements,
            'userStats' => $userStats,
            'chartData' => $chartData,
            'selectedPeriod' => $period,
            'chartLabel' => $chartLabel,
            'userRole' => $user->access,
        ]);
    }

    private function getDashboardPeriodRange(string $period): array
    {
        $endDate = now();

        return match ($period) {
            '1month' => [$endDate->copy()->subMonthNoOverflow()->startOfDay(), $endDate, 'Last 1 Month', 'M d', 'day'],
            'year' => [$endDate->copy()->subYearNoOverflow()->startOfDay(), $endDate, 'Last 1 Year', 'M Y', 'month'],
            default => [$endDate->copy()->subDays(6)->startOfDay(), $endDate, 'Last 7 Days', 'M d', 'day'],
        };
    }

    private function buildDashboardChartData($query, $startDate, $endDate, string $bucketType, string $dateFormat): array
    {
        $data = [];
        $cursor = $startDate->copy();

        if ($bucketType === 'month') {
            while ($cursor->lessThanOrEqualTo($endDate)) {
                $monthStart = $cursor->copy()->startOfMonth();
                $monthEnd = $cursor->copy()->endOfMonth();
                $rangeStart = $monthStart->greaterThan($startDate) ? $monthStart->copy() : $startDate->copy();
                $rangeEnd = $monthEnd->lessThan($endDate) ? $monthEnd->copy() : $endDate->copy();

                $data[] = [
                    'date' => $cursor->format($dateFormat),
                    'count' => (clone $query)->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                ];

                $cursor->addMonthNoOverflow()->startOfMonth();
            }

            return $data;
        }

        while ($cursor->lessThanOrEqualTo($endDate)) {
            $data[] = [
                'date' => $cursor->format($dateFormat),
                'count' => (clone $query)->whereDate('created_at', $cursor->toDateString())->count(),
            ];

            $cursor->addDay();
        }

        return $data;
    }
}
