<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Incident::query()->with(['user']);

        // Apply active year filter
        $this->applyYearFilter($query);

        // New flow: 
        // - Officers can see: their own incidents (all statuses) + verified/resolved incidents from others
        // - Head officers can see: all incidents
        if ($user->access === 'officer') {
            $query->where(function ($q) use ($user) {
                // Show own incidents regardless of status
                $q->where('reported_by', $user->user_id)
                    // OR show verified/resolved incidents from anyone
                    ->orWhereIn('status', ['verified', 'resolved']);
            });
        }
        // Head officers see everything (no filter needed)

        // Apply filters
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->filled('barangay')) {
            $query->where('barangay', $request->barangay);
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
                $q->where('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%");
            });
        }

        // Order by latest first
        $query->orderBy('created_at', 'desc');

        // Paginate results
        $incidents = $query->paginate(12)->withQueryString();

        // Transform the data
        $incidents->getCollection()->transform(function ($incident) {
            return [
                'id' => $incident->incident_id,
                'title' => $incident->type . ' Incident', // Using type as title since there's no title field
                'description' => $incident->description,
                'type' => $incident->type,
                'severity' => $incident->severity,
                'status' => $incident->status,
                'decline_reason' => $incident->decline_reason,
                'location' => $incident->latitude && $incident->longitude
                    ? $incident->latitude . ', ' . $incident->longitude
                    : 'Not specified',
                'barangay' => $incident->barangay,
                'latitude' => $incident->latitude,
                'longitude' => $incident->longitude,
                'reported_by' => $incident->user ? $incident->user->first_name . ' ' . $incident->user->last_name : 'Unknown',
                'reporter_id' => $incident->reported_by,
                'created_at' => $incident->created_at->format('M d, Y h:i A'),
                'updated_at' => $incident->updated_at->format('M d, Y h:i A'),
            ];
        });

        // Get declined incidents for officers to edit/resubmit
        $declinedIncidents = [];
        if ($user->access === 'officer') {
            $declinedIncidents = Incident::query()
                ->with(['user'])
                ->where('reported_by', $user->user_id)
                ->where('status', 'declined')
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($incident) {
                    return [
                        'id' => $incident->incident_id,
                        'title' => $incident->type . ' Incident',
                        'description' => $incident->description,
                        'type' => $incident->type,
                        'severity' => $incident->severity,
                        'status' => $incident->status,
                        'decline_reason' => $incident->decline_reason,
                        'barangay' => $incident->barangay,
                        'latitude' => $incident->latitude,
                        'longitude' => $incident->longitude,
                        'created_at' => $incident->created_at->format('M d, Y h:i A'),
                        'updated_at' => $incident->updated_at->format('M d, Y h:i A'),
                    ];
                });
        }

        // Get unique barangays for filter
        $barangays = Incident::distinct()->pluck('barangay')->filter()->sort()->values();

        return Inertia::render('Officer/Incidents/Index', [
            'incidents' => $incidents,
            'declinedIncidents' => $declinedIncidents,
            'barangays' => $barangays,
            'filters' => $request->only(['type', 'status', 'severity', 'barangay', 'from_date', 'to_date', 'search']),
            'canChangeStatus' => $user->access === 'head_officer',
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        // Only head officers can change status
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'You do not have permission to change incident status.');
        }

        $request->validate([
            'status' => 'required|in:active,verified,resolved,declined',
            'decline_reason' => 'required_if:status,declined|nullable|string',
        ]);

        $incident = Incident::findOrFail($id);
        $incident->update([
            'status' => $request->status,
            'decline_reason' => $request->status === 'declined' ? $request->decline_reason : null,
        ]);

        return back()->with('success', 'Incident status updated successfully.');
    }

    public function create()
    {
        // Only officers and head officers can create incidents
        if (!in_array(auth()->user()->access, ['officer', 'head_officer'])) {
            abort(403, 'Unauthorized. Only officers can report incidents.');
        }

        return Inertia::render('Officer/Incidents/Create');
    }

    public function store(Request $request)
    {
        // Only officers and head officers can create incidents
        if (!in_array(auth()->user()->access, ['officer', 'head_officer'])) {
            return back()->with('error', 'Unauthorized. Only officers can report incidents.');
        }

        $validated = $request->validate([
            'type' => 'required|in:fire,flood,earthquake,landslide',
            'barangay' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string',
            'severity' => 'required|in:low,medium,high',
        ]);

        $incident = Incident::create([
            'reported_by' => auth()->id(),
            'type' => $validated['type'],
            'barangay' => $validated['barangay'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'description' => $validated['description'] ?? null,
            'severity' => $validated['severity'],
            'status' => 'active',
        ]);

        return redirect()->route('officer.hazard-map')->with('success', 'Incident reported successfully.');
    }

    public function update(Request $request, $id)
    {
        $incident = Incident::findOrFail($id);
        $user = auth()->user();

        // Only the reporter can edit their declined incident
        if ($incident->reported_by !== $user->user_id) {
            return back()->with('error', 'You can only edit your own incidents.');
        }

        // Only declined incidents can be edited
        if ($incident->status !== 'declined') {
            return back()->with('error', 'Only declined incidents can be edited.');
        }

        $validated = $request->validate([
            'type' => 'required|in:flood,fire,earthquake,typhoon,landslide,other',
            'barangay' => 'required|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'description' => 'nullable|string|max:1000',
            'severity' => 'required|in:low,medium,high',
        ]);

        // Update incident and reset status to active for re-review
        $incident->update([
            'type' => $validated['type'],
            'barangay' => $validated['barangay'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'description' => $validated['description'] ?? null,
            'severity' => $validated['severity'],
            'status' => 'active',
            'decline_reason' => null, // Clear decline reason on resubmission
        ]);

        return redirect()->route('officer.incidents.index')->with('success', 'Incident updated and resubmitted for review.');
    }

    public function destroy($id)
    {
        // Only head officers can archive incidents
        if (auth()->user()->access !== 'head_officer') {
            return back()->with('error', 'You do not have permission to archive incidents.');
        }

        $incident = Incident::findOrFail($id);
        $incident->delete(); // Soft delete

        return back()->with('success', 'Incident moved to archive successfully.');
    }

    public function hazardMap(Request $request)
    {
        $user = auth()->user();
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

        return Inertia::render('HeadOfficer/HazardMap/Index', [
            'incidents' => $incidents,
            'allIncidents' => $allIncidents,
            'canChangeStatus' => $user->access === 'head_officer',
            'filters' => $request->only(['type', 'status', 'severity', 'barangay', 'from_date', 'to_date', 'search', 'time_filter']),
        ]);
    }
}
