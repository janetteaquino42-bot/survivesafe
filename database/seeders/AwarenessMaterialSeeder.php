<?php

namespace Database\Seeders;

use App\Models\AwarenessMaterial;
use App\Models\User;
use Illuminate\Database\Seeder;

class AwarenessMaterialSeeder extends Seeder
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

        $materials = [
            [
                'title' => 'Fire Safety Guidelines',
                'description' => 'Comprehensive guide on fire prevention and safety measures for residential areas.',
                'created_by' => $officers->random()->user_id,
                'file_type' => 'document',
                'file_path' => 'awareness_materials/fire_safety_guidelines.pdf',
            ],
            [
                'title' => 'Earthquake Preparedness Video',
                'description' => 'Educational video on what to do before, during, and after an earthquake.',
                'created_by' => $officers->random()->user_id,
                'file_type' => 'video',
                'file_path' => 'awareness_materials/earthquake_preparedness.mp4',
            ],
            [
                'title' => 'Flood Emergency Response',
                'description' => 'Step-by-step instructions for emergency response during flooding events.',
                'created_by' => $officers->random()->user_id,
                'file_type' => 'document',
                'file_path' => 'awareness_materials/flood_response.pdf',
            ],
            [
                'title' => 'Evacuation Route Map',
                'description' => 'Visual map showing designated evacuation routes and assembly points.',
                'created_by' => $officers->random()->user_id,
                'file_type' => 'image',
                'file_path' => 'awareness_materials/evacuation_map.png',
            ],
            [
                'title' => 'Disaster Preparedness Kit',
                'description' => 'Infographic showing essential items for a disaster preparedness kit.',
                'created_by' => $officers->random()->user_id,
                'file_type' => 'image',
                'file_path' => 'awareness_materials/preparedness_kit.jpg',
            ],
        ];

        foreach ($materials as $material) {
            AwarenessMaterial::create($material);
        }
    }
}
