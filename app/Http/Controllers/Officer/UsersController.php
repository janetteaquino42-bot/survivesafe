<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('barangay', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        }

        // Filter by access level
        if ($request->has('access') && $request->access) {
            $query->where('access', $request->access);
        }

        // Filter by position
        if ($request->has('position') && $request->position) {
            $query->where('position', $request->position);
        }

        // Filter by barangay
        if ($request->has('barangay') && $request->barangay) {
            $query->where('barangay', $request->barangay);
        }

        // Sort
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(15)->through(function ($user) {
            return [
                'user_id' => $user->user_id,
                'first_name' => $user->first_name,
                'middle_name' => $user->middle_name,
                'last_name' => $user->last_name,
                'full_name' => trim("{$user->first_name} {$user->middle_name} {$user->last_name}"),
                'email' => $user->email,
                'access' => $user->access,
                'position' => $user->position,
                'barangay' => $user->barangay,
                'email_verified_at' => $user->email_verified_at,
                'profile_image' => $user->profile_image,
                'created_at' => $user->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('HeadOfficer/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'access', 'position', 'barangay']),
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'access' => ['required', Rule::in(['pending', 'resident', 'officer', 'head_officer'])],
            'position' => 'nullable|string|max:255',
            'custom_position' => 'nullable|string|max:255',
            'barangay' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validated['position'] === 'Other') {
            $validated['position'] = $validated['custom_position'];
        }

        $validated['password'] = Hash::make($validated['password']);

        // Auto-verify email for officer and head_officer
        if (in_array($validated['access'], ['officer', 'head_officer'])) {
            $validated['email_verified_at'] = now();
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = Storage::url($path);
        }

        $user = User::create($validated);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->user_id, 'user_id')],
            'password' => 'nullable|string|min:8',
            'access' => ['required', Rule::in(['pending', 'resident', 'officer', 'head_officer'])],
            'position' => 'nullable|string|max:255',
            'barangay' => 'required|string|max:255',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Only update password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Auto-verify email for officer and head_officer
        if (in_array($validated['access'], ['officer', 'head_officer']) && !$user->email_verified_at) {
            $validated['email_verified_at'] = now();
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($user->profile_image) {
                $oldPath = str_replace('/storage/', '', $user->profile_image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = Storage::url($path);
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->user_id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        // Validate deletion reason
        $validated = request()->validate([
            'deletion_reason' => 'nullable|string',
        ]);

        // Update user with deletion reason before deleting
        if (isset($validated['deletion_reason'])) {
            $user->update([
                'deletion_reason' => $validated['deletion_reason'],
            ]);
        }

        // Delete profile image if exists
        if ($user->profile_image) {
            $path = str_replace('/storage/', '', $user->profile_image);
            Storage::disk('public')->delete($path);
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Bulk delete users
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,user_id',
        ]);

        // Prevent deleting yourself
        $userIds = array_filter($validated['user_ids'], function ($id) {
            return $id != Auth::id();
        });

        if (empty($userIds)) {
            return redirect()->back()->with('error', 'Cannot delete selected users.');
        }

        // Delete profile images
        $users = User::whereIn('user_id', $userIds)->get();
        foreach ($users as $user) {
            if ($user->profile_image) {
                $path = str_replace('/storage/', '', $user->profile_image);
                Storage::disk('public')->delete($path);
            }
        }

        User::whereIn('user_id', $userIds)->delete();

        return redirect()->back()->with('success', count($userIds) . ' user(s) deleted successfully.');
    }

    /**
     * Download CSV template
     */
    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="users_import_template.csv"',
        ];

        $columns = [
            'first_name',
            'middle_name',
            'last_name',
            'email',
            'password',
            'access',
            'position',
            'barangay'
        ];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, $columns);

            // Add example row
            fputcsv($file, [
                'Juan',
                'Dela',
                'Cruz',
                'juan.delacruz@example.com',
                'password123',
                'officer',
                'Barangay Tanod',
                'Barangay Poblacion'
            ]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Import users from CSV/Excel
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // Max 10MB
        ]);

        $file = $request->file('file');
        $imported = 0;
        $errors = [];

        try {
            $handle = fopen($file->getRealPath(), 'r');

            // Skip header row
            $headers = fgetcsv($handle);

            $row = 1;
            while (($data = fgetcsv($handle)) !== false) {
                $row++;

                // Map data to fields
                $userData = [
                    'first_name' => $data[0] ?? '',
                    'middle_name' => $data[1] ?? '',
                    'last_name' => $data[2] ?? '',
                    'email' => $data[3] ?? '',
                    'password' => $data[4] ?? '',
                    'access' => $data[5] ?? 'officer',
                    'position' => $data[6] ?? '',
                    'barangay' => $data[7] ?? '',
                ];

                // Validate
                $validator = Validator::make($userData, [
                    'first_name' => 'required|string|max:255',
                    'middle_name' => 'nullable|string|max:255',
                    'last_name' => 'required|string|max:255',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required|string|min:8',
                    'access' => ['required', Rule::in(['pending', 'resident', 'officer', 'head_officer'])],
                    'position' => 'nullable|string|max:255',
                    'barangay' => 'required|string|max:255',
                ]);

                if ($validator->fails()) {
                    $errors[] = "Row {$row}: " . implode(', ', $validator->errors()->all());
                    continue;
                }

                // Hash password
                $userData['password'] = Hash::make($userData['password']);

                // Auto-verify officers
                if (in_array($userData['access'], ['officer', 'head_officer'])) {
                    $userData['email_verified_at'] = now();
                }

                User::create($userData);
                $imported++;
            }

            fclose($handle);

            $message = "{$imported} user(s) imported successfully.";
            if (!empty($errors)) {
                $message .= " " . count($errors) . " row(s) skipped due to errors.";
            }

            return redirect()->back()->with('success', $message)->with('import_errors', $errors);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
