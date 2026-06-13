<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Create a notification for order status change
     */
    public static function orderStatusChanged($order, $oldStatus, $newStatus)
    {
        $statusMessages = [
            'pending' => 'Your order is pending confirmation',
            'confirmed' => 'Your order has been confirmed',
            'processing' => 'Your order is being processed',
            'out_for_delivery' => 'Your order is out for delivery',
            'delivered' => 'Your order has been delivered',
            'completed' => 'Your order has been completed',
            'cancelled' => 'Your order has been cancelled',
        ];

        $title = "Order #{$order->order_number} Status Update";
        $message = $statusMessages[$newStatus] ?? "Your order status has been updated to {$newStatus}";

        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order_status',
            'title' => $title,
            'message' => $message,
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);

        // Notify seller as well
        if ($order->seller_id) {
            $sellerMessage = "Order #{$order->order_number} Status Changed to " . ucwords(str_replace('_', ' ', $newStatus));
            Notification::create([
                'user_id' => $order->seller_id,
                'type' => 'order_status',
                'title' => $title,
                'message' => $sellerMessage,
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ],
                'action_url' => route('seller.orders.index'),
                'read' => false,
            ]);
        }
    }

    /**
     * Create a notification for seller application
     */
    public static function sellerApplicationSubmitted($seller)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'seller_application',
                'title' => 'New Seller Application',
                'message' => "{$seller->user->first_name} {$seller->user->last_name} has submitted a seller application",
                'data' => [
                    'seller_id' => $seller->id,
                    'user_id' => $seller->user_id,
                ],
                'action_url' => route('admin.sellers.applications'),
                'read' => false,
            ]);
        }

        // Notify the applicant
        Notification::create([
            'user_id' => $seller->user_id,
            'type' => 'seller_application',
            'title' => 'Seller Application Submitted',
            'message' => 'Your seller application has been submitted and is under review',
            'data' => [
                'seller_id' => $seller->id,
            ],
            'action_url' => route('my.profile'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for seller application status change
     */
    public static function sellerApplicationStatusChanged($seller, $status, $declineReason = null)
    {
        $messages = [
            'approved' => 'Congratulations! Your seller application has been approved',
            'declined' => 'Your seller application has been declined',
        ];

        $message = $messages[$status] ?? "Your seller application status: {$status}";

        // Add decline reason if provided
        if ($status === 'declined' && $declineReason) {
            $message .= ". Reason: {$declineReason}";
        }

        Notification::create([
            'user_id' => $seller->user_id,
            'type' => 'seller_application',
            'title' => 'Seller Application ' . ucfirst($status),
            'message' => $message,
            'data' => [
                'seller_id' => $seller->id,
                'status' => $status,
                'decline_reason' => $declineReason,
            ],
            'action_url' => $status === 'approved' ? route('seller.dashboard') : route('seller.apply.create'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for artwork submission
     */
    public static function artworkSubmitted($artwork)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'artwork_submission',
                'title' => 'New Artwork Submission',
                'message' => "{$artwork->artist->first_name} {$artwork->artist->last_name} submitted: {$artwork->title}",
                'data' => [
                    'artwork_id' => $artwork->id,
                    'artist_id' => $artwork->artist_id,
                ],
                'action_url' => route('admin.artworks.pending'),
                'read' => false,
            ]);
        }

        // Notify the artist
        Notification::create([
            'user_id' => $artwork->artist_id,
            'type' => 'artwork_submission',
            'title' => 'Artwork Submitted',
            'message' => "Your artwork '{$artwork->title}' has been submitted for review",
            'data' => [
                'artwork_id' => $artwork->id,
            ],
            'action_url' => route('seller.artworks.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for artwork status change
     */
    public static function artworkStatusChanged($artwork, $status, $declineReason = null)
    {
        $messages = [
            'available' => 'Your artwork has been approved and is now available',
            'declined' => 'Your artwork submission has been declined',
        ];

        $message = $messages[$status] ?? "Your artwork status: {$status}";

        // Add decline reason if provided
        if ($status === 'declined' && $declineReason) {
            $message .= ". Reason: {$declineReason}";
        }

        Notification::create([
            'user_id' => $artwork->artist_id,
            'type' => 'artwork_submission',
            'title' => "Artwork '{$artwork->title}' " . ucfirst($status),
            'message' => $message,
            'data' => [
                'artwork_id' => $artwork->id,
                'status' => $status,
                'decline_reason' => $declineReason,
            ],
            'action_url' => route('seller.artworks.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for material submission
     */
    public static function materialSubmitted($material)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'material_submission',
                'title' => 'New Material Submission',
                'message' => "{$material->artist->first_name} {$material->artist->last_name} submitted: {$material->name}",
                'data' => [
                    'material_id' => $material->id,
                    'artist_id' => $material->artist_id,
                ],
                'action_url' => route('admin.materials.pending'),
                'read' => false,
            ]);
        }

        // Notify the artist
        Notification::create([
            'user_id' => $material->artist_id,
            'type' => 'material_submission',
            'title' => 'Material Submitted',
            'message' => "Your material '{$material->name}' has been submitted for review",
            'data' => [
                'material_id' => $material->id,
            ],
            'action_url' => route('seller.materials.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for material status change
     */
    public static function materialStatusChanged($material, $status, $declineReason = null)
    {
        $messages = [
            'available' => 'Your material has been approved and is now available',
            'declined' => 'Your material submission has been declined',
        ];

        $message = $messages[$status] ?? "Your material status: {$status}";

        // Add decline reason if provided
        if ($status === 'declined' && $declineReason) {
            $message .= ". Reason: {$declineReason}";
        }

        Notification::create([
            'user_id' => $material->artist_id,
            'type' => 'material_submission',
            'title' => "Material '{$material->name}' " . ucfirst($status),
            'message' => $message,
            'data' => [
                'material_id' => $material->id,
                'status' => $status,
                'decline_reason' => $declineReason,
            ],
            'action_url' => route('seller.materials.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for exhibit submission
     */
    public static function exhibitSubmitted($exhibit)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'exhibit_submission',
                'title' => 'New Exhibit Submission',
                'message' => "{$exhibit->user->first_name} {$exhibit->user->last_name} submitted: {$exhibit->name}",
                'data' => [
                    'exhibit_id' => $exhibit->id,
                    'user_id' => $exhibit->user_id,
                ],
                'action_url' => route('admin.exhibits.pending'),
                'read' => false,
            ]);
        }

        // Notify the user
        Notification::create([
            'user_id' => $exhibit->user_id,
            'type' => 'exhibit_submission',
            'title' => 'Exhibit Submitted',
            'message' => "Your exhibit '{$exhibit->name}' has been submitted for review",
            'data' => [
                'exhibit_id' => $exhibit->id,
            ],
            'action_url' => route('seller.exhibits.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for exhibit approval
     */
    public static function exhibitApproved($exhibit)
    {
        // Notify the exhibit organizer
        Notification::create([
            'user_id' => $exhibit->user_id,
            'type' => 'exhibit_approved',
            'title' => 'Exhibit Application Approved! 🎉',
            'message' => "Great news! Your exhibit '{$exhibit->name}' has been approved and is now visible to the public.",
            'data' => [
                'exhibit_id' => $exhibit->id,
                'exhibit_name' => $exhibit->name,
                'status' => 'approved',
            ],
            'action_url' => route('exhibits.show', $exhibit->id),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for exhibit decline
     */
    public static function exhibitDeclined($exhibit, $declineReasons = [])
    {
        $reasonsText = is_array($declineReasons) && !empty($declineReasons)
            ? implode('; ', $declineReasons)
            : 'Please review the requirements and try again.';

        // Notify the exhibit organizer
        Notification::create([
            'user_id' => $exhibit->user_id,
            'type' => 'exhibit_declined',
            'title' => 'Exhibit Application Declined',
            'message' => "Your exhibit '{$exhibit->name}' has been declined. Reasons: {$reasonsText}",
            'data' => [
                'exhibit_id' => $exhibit->id,
                'exhibit_name' => $exhibit->name,
                'status' => 'declined',
                'decline_reasons' => $declineReasons,
            ],
            'action_url' => route('seller.exhibits.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for exhibit status change (DEPRECATED - use exhibitApproved or exhibitDeclined)
     */
    public static function exhibitStatusChanged($exhibit, $status, $declineReason = null)
    {
        if ($status === 'approved') {
            self::exhibitApproved($exhibit);
        } elseif ($status === 'declined') {
            $reasons = is_array($declineReason) ? $declineReason : [$declineReason];
            self::exhibitDeclined($exhibit, $reasons);
        }
    }

    /**
     * Create notifications when seller edits an exhibit (requires re-review)
     */
    public static function exhibitEditedBySeller($exhibit)
    {
        // Notify all admins about the edited exhibit needing review
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'exhibit_edited',
                'title' => 'Exhibit Edited - Review Required',
                'message' => "{$exhibit->user->first_name} {$exhibit->user->last_name} edited exhibit: {$exhibit->name}. Review required.",
                'data' => [
                    'exhibit_id' => $exhibit->id,
                    'user_id' => $exhibit->user_id,
                    'exhibit_name' => $exhibit->name,
                ],
                'action_url' => route('admin.exhibits.pending'),
                'read' => false,
            ]);
        }

        // Notify the seller that their edit requires review
        Notification::create([
            'user_id' => $exhibit->user_id,
            'type' => 'exhibit_edited',
            'title' => 'Exhibit Updated - Pending Review',
            'message' => "Your exhibit '{$exhibit->name}' has been updated and is now pending admin review.",
            'data' => [
                'exhibit_id' => $exhibit->id,
                'exhibit_name' => $exhibit->name,
            ],
            'action_url' => route('seller.exhibits.index'),
            'read' => false,
        ]);
    }

    /**
     * Create notification when admin edits an exhibit
     */
    public static function exhibitEditedByAdmin($exhibit)
    {
        // Notify the exhibit organizer about admin's changes
        Notification::create([
            'user_id' => $exhibit->user_id,
            'type' => 'exhibit_edited_admin',
            'title' => 'Exhibit Updated by Admin',
            'message' => "Your exhibit '{$exhibit->name}' has been updated by an administrator.",
            'data' => [
                'exhibit_id' => $exhibit->id,
                'exhibit_name' => $exhibit->name,
            ],
            'action_url' => route('seller.exhibits.index'),
            'read' => false,
        ]);
    }

    /**
     * Create notification for admins when payment proof is uploaded
     */
    public static function paymentProofUploaded($orders, $paymentGroupId)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        $orderNumbers = $orders->pluck('order_number')->join(', ');
        $totalAmount = $orders->sum('total_amount');

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'payment_verification',
                'title' => 'New Proof of Payment for Verification',
                'message' => "Proof of Payment uploaded for order: {$orderNumbers} (Total: ₱" . number_format($totalAmount, 2) . ")",
                'data' => [
                    'payment_group_id' => $paymentGroupId,
                    'order_ids' => $orders->pluck('id')->toArray(),
                    'total_amount' => $totalAmount,
                ],
                'action_url' => route('admin.payment-verification.index'),
                'read' => false,
            ]);
        }
    }

    /**
     * Create notification when order is placed
     */
    public static function orderPlaced($order)
    {
        // Notify buyer
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order_placed',
            'title' => 'Order Placed Successfully',
            'message' => "Your order #{$order->order_number} has been placed. Please upload payment proof to proceed.",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);
    }

    /**
     * Create notification when payment is verified
     */
    public static function paymentVerified($order)
    {
        // Notify buyer
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'payment_verified',
            'title' => 'Payment Verified',
            'message' => "Your payment for order #{$order->order_number} has been verified. The seller will now process your order.",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);

        // Notify seller
        if ($order->seller_id) {
            Notification::create([
                'user_id' => $order->seller_id,
                'type' => 'payment_verified',
                'title' => 'Payment Verified - Ready to Process',
                'message' => "Payment for order #{$order->order_number} has been verified. You can now process this order.",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
                'action_url' => route('seller.orders.index', ['order_number' => $order->order_number]),
                'read' => false,
            ]);
        }
    }

    /**
     * Create notification when payment is rejected
     */
    public static function paymentRejected($order, $rejectionReason)
    {
        // Notify buyer
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'payment_rejected',
            'title' => 'Payment Rejected',
            'message' => "Your payment for order #{$order->order_number} has been rejected. Reason: {$rejectionReason}",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'rejection_reason' => $rejectionReason,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);

        // Notify seller
        if ($order->seller_id) {
            Notification::create([
                'user_id' => $order->seller_id,
                'type' => 'payment_rejected',
                'title' => 'Payment Rejected for Order',
                'message' => "Payment for order #{$order->order_number} has been rejected by admin.",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
                'action_url' => route('seller.orders.index', ['order_number' => $order->order_number]),
                'read' => false,
            ]);
        }
    }

    /**
     * Create a notification when someone follows a user
     */
    public static function userFollowed($followedUser, $follower)
    {
        $followerName = trim($follower->first_name . ' ' . $follower->last_name);

        Notification::create([
            'user_id' => $followedUser->id,
            'type' => 'user_followed',
            'title' => 'New Follower',
            'message' => "{$followerName} just followed you!",
            'data' => [
                'follower_id' => $follower->id,
                'follower_name' => $followerName,
            ],
            'action_url' => route('artists.show', ['id' => $followedUser->id]),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for artwork update requiring verification
     */
    public static function artworkUpdated($artwork)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'artwork_submission',
                'title' => 'Artwork Updated - Needs Review',
                'message' => "{$artwork->artist->first_name} {$artwork->artist->last_name} updated artwork: {$artwork->title}",
                'data' => [
                    'artwork_id' => $artwork->id,
                    'artist_id' => $artwork->artist_id,
                    'is_update' => true,
                ],
                'action_url' => route('admin.artworks.pending'),
                'read' => false,
            ]);
        }

        // Notify the artist
        Notification::create([
            'user_id' => $artwork->artist_id,
            'type' => 'artwork_submission',
            'title' => 'Artwork Update Submitted',
            'message' => "Your artwork '{$artwork->title}' has been updated and submitted for review",
            'data' => [
                'artwork_id' => $artwork->id,
                'is_update' => true,
            ],
            'action_url' => route('seller.artworks.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification for material update requiring verification
     */
    public static function materialUpdated($material)
    {
        // Notify all admins
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'material_submission',
                'title' => 'Material Updated - Needs Review',
                'message' => "{$material->artist->first_name} {$material->artist->last_name} updated material: {$material->name}",
                'data' => [
                    'material_id' => $material->id,
                    'artist_id' => $material->artist_id,
                    'is_update' => true,
                ],
                'action_url' => route('admin.materials.pending'),
                'read' => false,
            ]);
        }

        // Notify the artist
        Notification::create([
            'user_id' => $material->artist_id,
            'type' => 'material_submission',
            'title' => 'Material Update Submitted',
            'message' => "Your material '{$material->name}' has been updated and submitted for review",
            'data' => [
                'material_id' => $material->id,
                'is_update' => true,
            ],
            'action_url' => route('seller.materials.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification when admin creates artwork for a seller
     */
    public static function artworkCreatedByAdmin($artwork)
    {
        Notification::create([
            'user_id' => $artwork->artist_id,
            'type' => 'artwork_submission',
            'title' => 'New Artwork Available',
            'message' => "An admin has added a new artwork '{$artwork->title}' to your gallery. It is now available for sale.",
            'data' => [
                'artwork_id' => $artwork->id,
                'created_by_admin' => true,
            ],
            'action_url' => route('seller.artworks.index'),
            'read' => false,
        ]);
    }

    /**
     * Create a notification when admin creates material for a seller
     */
    public static function materialCreatedByAdmin($material)
    {
        Notification::create([
            'user_id' => $material->artist_id,
            'type' => 'material_submission',
            'title' => 'New Material Available',
            'message' => "An admin has added a new material '{$material->name}' to your inventory. It is now available for sale.",
            'data' => [
                'material_id' => $material->id,
                'created_by_admin' => true,
            ],
            'action_url' => route('seller.materials.index'),
            'read' => false,
        ]);
    }

    /**
     * Notify admin about refund needed for cancelled order
     */
    public static function notifyAdminAboutRefund($order)
    {
        // Get all admin users
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'order_refund',
                'title' => 'Refund Request - Order Cancelled',
                'message' => "Order #{$order->order_number} has been cancelled after payment verification. Refund of ₱" . number_format($order->total_amount, 2) . " needs to be processed.",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'refund_amount' => $order->total_amount,
                    'buyer_id' => $order->buyer_id,
                ],
                'action_url' => route('admin.refund-requests.index'),
                'read' => false,
            ]);

        }

        // Also notify buyer
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order_refund',
            'title' => 'Order Cancelled - Refund Pending',
            'message' => "Your order #{$order->order_number} has been cancelled. Your refund will be processed within 1-3 business days. Please provide your refund bank details.",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'refund_amount' => $order->total_amount,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);

    }

    /**
     * Notify admin and buyer when buyer submits refund details
     */
    public static function notifyRefundDetailsSubmitted($order)
    {
        // Notify all admin users
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'order_refund',
                'title' => 'Refund Details Submitted',
                'message' => "Buyer has submitted refund bank details for Order #{$order->order_number}. Refund amount: ₱" . number_format($order->refund_amount ?? $order->total_amount, 2) . ". Please process the refund.",
                'data' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'refund_amount' => $order->refund_amount ?? $order->total_amount,
                    'buyer_id' => $order->buyer_id,
                    'refund_bank_name' => $order->refund_bank_name,
                ],
                'action_url' => '/admin/refund-requests',
                'read' => false,
            ]);
        }

        // Notify buyer with confirmation
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order_refund',
            'title' => 'Refund Details Received',
            'message' => "Your refund bank details for Order #{$order->order_number} have been received. The admin will process your refund within 1-3 business days.",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'refund_amount' => $order->refund_amount ?? $order->total_amount,
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);
    }

    /**
     * Notify buyer about fake receipt when cancelling unverified payment
     */
    public static function notifyBuyerFakeReceipt($order)
    {
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order_warning',
            'title' => 'Order Cancelled - Payment Not Verified',
            'message' => "Order #{$order->order_number} has been cancelled. Our records show that no payment was received for this order. If you believe this is an error, please contact support with your valid payment proof.",
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'warning_type' => 'no_payment_received',
            ],
            'action_url' => route('orders.buyer', ['order_number' => $order->order_number]),
            'read' => false,
        ]);
    }

    /**
     * Notify post author when someone likes their post
     */
    public static function forumPostLiked($post, $liker)
    {
        // Don't notify if user likes their own post
        if ($post->user_id === $liker->id) {
            return;
        }

        Notification::create([
            'user_id' => $post->user_id,
            'type' => 'forum_post_liked',
            'title' => 'Someone Liked Your Post',
            'message' => "{$liker->first_name} {$liker->last_name} liked your post \"{$post->title}\"",
            'data' => [
                'post_id' => $post->id,
                'liker_id' => $liker->id,
                'post_title' => $post->title,
            ],
            'action_url' => route('forum.posts.show', $post->id),
            'read' => false,
        ]);
    }

    /**
     * Notify post author when someone comments on their post
     */
    public static function forumPostCommented($post, $comment, $commenter)
    {
        // Don't notify if user comments on their own post
        if ($post->user_id === $commenter->id) {
            return;
        }

        // Truncate comment for notification message
        $commentPreview = strlen($comment->content) > 100
            ? substr($comment->content, 0, 100) . '...'
            : $comment->content;

        Notification::create([
            'user_id' => $post->user_id,
            'type' => 'forum_post_commented',
            'title' => 'New Comment on Your Post',
            'message' => "{$commenter->first_name} {$commenter->last_name} commented on \"{$post->title}\": {$commentPreview}",
            'data' => [
                'post_id' => $post->id,
                'comment_id' => $comment->id,
                'commenter_id' => $commenter->id,
                'post_title' => $post->title,
            ],
            'action_url' => route('forum.posts.show', $post->id),
            'read' => false,
        ]);
    }
}
