<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Incident extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'incident_id';

    protected $fillable = [
        'reported_by',
        'type',
        'barangay',
        'latitude',
        'longitude',
        'description',
        'severity',
        'status',
        'decline_reason',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the user who reported this incident.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by', 'user_id');
    }

    /**
     * Get the user who reported this incident (alias for consistency).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by', 'user_id');
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by severity.
     */
    public function scopeWithSeverity($query, $severity)
    {
        return $query->where('severity', $severity);
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
