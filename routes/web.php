<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\AwarenessMaterialController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\Public\HazardMapController;
use App\Http\Controllers\Officer\UsersController;
use App\Http\Controllers\Officer\ContentManagementController;
use App\Http\Controllers\Officer\ArchiveController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// OAuth Routes
Route::prefix('auth/google')->group(function () {
    Route::get('/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
});

// Home & Information Pages
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/about', [PublicController::class, 'about'])->name('about');
Route::get('/contact', [PublicController::class, 'contact'])->name('contact');
Route::post('/contact', [PublicController::class, 'submitContact'])->name('contact.submit');

// Public Awareness Materials
Route::get('/awareness', [PublicController::class, 'awarenessMaterials'])->name('public.awareness');
Route::get('/awareness/{id}', [PublicController::class, 'showAwarenessMaterial'])->name('public.awareness.show');

// Public Announcements
Route::get('/announcements', [PublicController::class, 'announcements'])->name('public.announcements');
Route::get('/announcements/{id}', [PublicController::class, 'showAnnouncement'])->name('public.announcements.show');

// Public Hazard Map (Verified Incidents Only)
Route::get('/hazard-map', [PublicController::class, 'hazardMap'])->name('public.hazard-map');

// Public Incident Reporting
Route::post('/incidents', [PublicController::class, 'reportIncident'])->name('incidents.store');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'settings'])->name('profile.show');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile/image', [ProfileController::class, 'destroy'])->name('profile.image.delete');

    // Resident Routes (Authenticated residents)
    Route::prefix('resident')->name('resident.')->group(function () {
        Route::get('/announcements', [ResidentController::class, 'announcements'])->name('announcements.index');
        Route::get('/announcements/{id}', [ResidentController::class, 'showAnnouncement'])->name('announcements.show');
        Route::get('/awareness-materials', [ResidentController::class, 'awarenessMaterials'])->name('awareness-materials.index');
        Route::get('/awareness-materials/{id}', [ResidentController::class, 'showAwarenessMaterial'])->name('awareness-materials.show');
        Route::get('/hazard-map', [ResidentController::class, 'hazardMap'])->name('hazard-map');
        Route::get('/contact', [ResidentController::class, 'contact'])->name('contact');
        Route::post('/contact', [ResidentController::class, 'submitContact'])->name('contact.submit');
    });

    Route::prefix('officer')->name('officer.')->middleware('officer')->group(function () {
        // Hazard Mapping (All authenticated users can access - Officer version)
        Route::get('/hazard-map', [IncidentController::class, 'hazardMap'])->name('hazard-map');
    });

    // Incident Management (for backwards compatibility / specific actions)
    Route::post('/incidents/{id}/status', [IncidentController::class, 'updateStatus'])->name('incidents.updateStatus')->where('id', '[0-9]+');
    Route::delete('/incidents/{id}', [IncidentController::class, 'destroy'])->name('incidents.destroy')->where('id', '[0-9]+');

    Route::prefix('officer')->name('officer.')->middleware('officer')->group(function () {
        Route::get('/incidents', [IncidentController::class, 'index'])->name('incidents.index');
        Route::get('/incidents/create', [IncidentController::class, 'create'])->name('incidents.create');
        Route::post('/incidents', [IncidentController::class, 'store'])->name('incidents.store');
        Route::put('/incidents/{id}', [IncidentController::class, 'update'])->name('incidents.update')->where('id', '[0-9]+');

        Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('/announcements/{id}', [AnnouncementController::class, 'update'])->name('announcements.update');
        Route::post('/announcements/{id}/status', [AnnouncementController::class, 'updateStatus'])->name('announcements.updateStatus');
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        Route::get('/awareness-materials', [AwarenessMaterialController::class, 'index'])->name('awareness-materials.index');
        Route::post('/awareness-materials', [AwarenessMaterialController::class, 'store'])->name('awareness-materials.store');
        Route::put('/awareness-materials/{id}', [AwarenessMaterialController::class, 'update'])->name('awareness-materials.update');
        Route::post('/awareness-materials/{id}/status', [AwarenessMaterialController::class, 'updateStatus'])->name('awareness-materials.updateStatus');
        Route::delete('/awareness-materials/{id}', [AwarenessMaterialController::class, 'destroy'])->name('awareness-materials.destroy');
    });

    // Head Officer Routes
    Route::prefix('officer')->name('officer.')->middleware('head_officer')->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name('users.index');
        Route::post('/users', [UsersController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/bulk-delete', [UsersController::class, 'bulkDelete'])->name('users.bulk-delete');
        Route::get('/users/template', [UsersController::class, 'downloadTemplate'])->name('users.template');
        Route::post('/users/import', [UsersController::class, 'import'])->name('users.import');

        // Content Management
        Route::get('/content-management', [ContentManagementController::class, 'index'])->name('content-management.index');
        Route::post('/content-management', [ContentManagementController::class, 'store'])->name('content-management.store');
        Route::put('/content-management/{id}', [ContentManagementController::class, 'update'])->name('content-management.update');
        Route::delete('/content-management/{id}', [ContentManagementController::class, 'destroy'])->name('content-management.destroy');
        Route::post('/content-management/{id}/delete-image', [ContentManagementController::class, 'deleteImage'])->name('content-management.delete-image');

        // System Settings
        Route::get('/system-settings', [SystemSettingsController::class, 'index'])->name('system-settings.index');
        Route::post('/system-settings/year', [SystemSettingsController::class, 'updateYear'])->name('system-settings.update-year');

        // Archive Management
        Route::get('/archive', [ArchiveController::class, 'index'])->name('archive.index');
        Route::post('/archive/incidents/{id}/restore', [ArchiveController::class, 'restoreIncident'])->name('archive.incidents.restore');
        Route::delete('/archive/incidents/{id}/force-delete', [ArchiveController::class, 'forceDeleteIncident'])->name('archive.incidents.force-delete');
        Route::post('/archive/announcements/{id}/restore', [ArchiveController::class, 'restoreAnnouncement'])->name('archive.announcements.restore');
        Route::delete('/archive/announcements/{id}/force-delete', [ArchiveController::class, 'forceDeleteAnnouncement'])->name('archive.announcements.force-delete');
        Route::post('/archive/materials/{id}/restore', [ArchiveController::class, 'restoreMaterial'])->name('archive.materials.restore');
        Route::delete('/archive/materials/{id}/force-delete', [ArchiveController::class, 'forceDeleteMaterial'])->name('archive.materials.force-delete');
    });
});

require __DIR__ . '/auth.php';
