<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;

abstract class Controller
{
    /**
     * Get the active year for filtering data
     */
    protected function getActiveYear(): int
    {
        return SystemSetting::getActiveYear();
    }

    /**
     * Apply active year filter to a query
     */
    protected function applyYearFilter($query)
    {
        return $query->whereYear('created_at', $this->getActiveYear());
    }
}
