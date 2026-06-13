<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AwarenessMaterial extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'material_id';

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'file_type',
        'video_link',
        'video_orientation',
        'status',
        'decline_reason',
        'created_by',
    ];

    protected $casts = [];

    /**
     * Get the user who created this material.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }

    /**
     * Scope a query to filter by file type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('file_type', $type);
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
