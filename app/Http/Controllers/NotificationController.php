<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get unread notifications count and recent notifications
     */
    public function index()
    {
        $notifications = Auth::user()->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Get unread notifications for polling
     */
    public function poll()
    {
        $user = Auth::user();

        $unreadCount = $user->notifications()
            ->unread()
            ->count();

        $recentNotifications = $user->notifications()
            ->unread()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'unread_count' => $unreadCount,
            'notifications' => $recentNotifications,
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        Auth::user()->notifications()
            ->unread()
            ->update(['read' => true, 'read_at' => now()]);

        // Always return JSON for AJAX requests
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'unread_count' => 0
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return redirect()->back()->with('success', 'Notification deleted successfully');
    }

    /**
     * Clear all read notifications
     */
    public function clearRead()
    {
        Auth::user()->notifications()
            ->read()
            ->delete();

        return redirect()->back()->with('success', 'Read notifications cleared');
    }
}
