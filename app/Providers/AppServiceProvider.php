<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Models\Admin\Courses\CoursesModel;
use App\Observers\CoursesObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // CoursesModel::observe(CoursesObserver::class);
    }
}
