<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'announcement_id';

    protected $fillable = [
        'title',
        'description',
        'images',
        'status',
        'decline_reason',
        'created_by',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    /**
     * Get the user who created this announcement.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    /**
     * Scope a query to get recent announcements.
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    /**
     * Scope a query to only include non-deleted records.
     * Note: SoftDeletes trait already excludes soft-deleted records by default.
     * This scope is for explicit clarity in queries.
     */
    public function scopeNotDeleted($query)
    {
        return $query->whereNull('deleted_at');
    }
}
