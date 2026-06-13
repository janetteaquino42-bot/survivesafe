<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // Seed in proper order to respect foreign key constraints
        $this->call([
            UserSeeder::class,
            IncidentSeeder::class,
            // AwarenessMaterialSeeder::class,
            // AnnouncementSeeder::class,
            // ContentSeeder::class,
            PageContentSeeder::class,
        ]);

        $this->command->info('✅ Database seeding completed successfully!');
    }
}
