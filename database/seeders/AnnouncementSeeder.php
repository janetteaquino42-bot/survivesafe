<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $officers = User::whereIn('access', ['officer', 'head_officer'])->get();

        if ($officers->isEmpty()) {
            return;
        }

        $announcements = [
            [
                'title' => 'Community Emergency Drill',
                'description' => 'A community-wide emergency drill will be conducted on December 20, 2025, at 9:00 AM. All residents are encouraged to participate.',
                'created_by' => $officers->random()->user_id,
            ],
            [
                'title' => 'Typhoon Warning Alert',
                'description' => 'PAGASA has issued a typhoon warning for our area. Residents are advised to prepare emergency supplies and monitor weather updates.',
                'created_by' => $officers->random()->user_id,
            ],
            [
                'title' => 'New Evacuation Center',
                'description' => 'A new evacuation center has been established at Barangay Hall 2. Facilities include sleeping quarters, medical station, and food distribution area.',
                'created_by' => $officers->random()->user_id,
            ],
            [
                'title' => 'Disaster Preparedness Seminar',
                'description' => 'Join us for a free disaster preparedness seminar on January 5, 2026. Learn essential survival skills and emergency response procedures.',
                'created_by' => $officers->random()->user_id,
            ],
            [
                'title' => 'Road Closure Due to Flooding',
                'description' => 'Main Street is temporarily closed due to flooding. Please use alternate routes. Updates will be provided as the situation develops.',
                'created_by' => $officers->random()->user_id,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}
