<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_key',
        'section_key',
        'title',
        'content',
        'meta',
        'images',
        'embed_code',
        'is_active',
        'order',
    ];

    protected $casts = [
        'meta' => 'array',
        'images' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get content for a specific page and section
     */
    public static function getContent($pageKey, $sectionKey = null)
    {
        $query = static::where('page_key', $pageKey)
            ->where('is_active', true);

        if ($sectionKey) {
            $query->where('section_key', $sectionKey);
        }

        return $query->orderBy('order')->get();
    }

    /**
     * Get a single section's content
     */
    public static function getSection($pageKey, $sectionKey)
    {
        return static::where('page_key', $pageKey)
            ->where('section_key', $sectionKey)
            ->where('is_active', true)
            ->first();
    }
}
