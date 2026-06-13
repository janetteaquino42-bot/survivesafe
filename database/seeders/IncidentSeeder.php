<?php

namespace Database\Seeders;

use App\Models\Incident;
use App\Models\User;
use Illuminate\Database\Seeder;

class IncidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $residents = User::where('access', 'resident')->get();

        if ($residents->isEmpty()) {
            return;
        }

        $incidents = [
            [
                'reported_by' => $residents->random()->user_id,
                'type' => 'fire',
                'barangay' => 'MOLINO II',
                'latitude' => 14.408745,
                'longitude' => 120.973334,
                'description' => 'Fire incident reported near the marketplace. Multiple structures affected.',
                'severity' => 'high',
                'status' => 'active',
            ],
            [
                'reported_by' => $residents->random()->user_id,
                'type' => 'flood',
                'barangay' => 'MAMBOG III',
                'latitude' => 14.428488,
                'longitude' => 120.955117,
                'description' => 'Heavy flooding in residential area due to continuous rainfall.',
                'severity' => 'medium',
                'status' => 'verified',
            ],
            [
                'reported_by' => $residents->random()->user_id,
                'type' => 'earthquake',
                'barangay' => 'QUEENS ROW EAST',
                'latitude' => 14.397106,
                'longitude' => 120.995157,
                'description' => 'Earthquake felt in the area. Minor structural damage observed.',
                'severity' => 'low',
                'status' => 'resolved',
            ],
            [
                'reported_by' => $residents->random()->user_id,
                'type' => 'landslide',
                'barangay' => 'BAYANAN',
                'latitude' => 14.427656,
                'longitude' => 120.973828,
                'description' => 'Landslide blocking the main road. Immediate attention required.',
                'severity' => 'high',
                'status' => 'verified',
            ],
            [
                'reported_by' => $residents->random()->user_id,
                'type' => 'flood',
                'barangay' => 'LIGAS II',
                'latitude' => 14.441496,
                'longitude' => 120.971875,
                'description' => 'Street flooding reported. Water level rising.',
                'severity' => 'medium',
                'status' => 'active',
            ],
        ];

        foreach ($incidents as $incident) {
            Incident::create($incident);
        }
    }
}
