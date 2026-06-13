<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Head Officer Account
        User::create([
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'email' => 'headofficer@bdrrmo.com',
            'password' => Hash::make('password123'),
            'access' => 'head_officer',
            'barangay' => 'Barangay 1',
            'email_verified_at' => now(),
        ]);

        // Officer Account
        User::create([
            'first_name' => 'Maria',
            'middle_name' => 'Garcia',
            'last_name' => 'Reyes',
            'email' => 'officer@bdrrmo.com',
            'password' => Hash::make('password123'),
            'access' => 'officer',
            'barangay' => 'Barangay 1',
            'email_verified_at' => now(),
        ]);

        // Resident Account
        User::create([
            'first_name' => 'Pedro',
            'middle_name' => 'Luna',
            'last_name' => 'Aquino',
            'email' => 'resident@bdrrmo.com',
            'password' => Hash::make('password123'),
            'access' => 'resident',
            'barangay' => 'Barangay 2',
            'email_verified_at' => now(),
        ]);

        // Pending Account
        User::create([
            'first_name' => 'Anna',
            'middle_name' => 'Cruz',
            'last_name' => 'Villanueva',
            'email' => 'pending@bdrrmo.com',
            'password' => Hash::make('password123'),
            'access' => 'pending',
            'barangay' => 'Barangay 3',
            'email_verified_at' => null,
        ]);

        // Additional Residents
        User::create([
            'first_name' => 'Jose',
            'middle_name' => 'Ramos',
            'last_name' => 'Torres',
            'email' => 'jose.torres@example.com',
            'password' => Hash::make('password123'),
            'access' => 'resident',
            'barangay' => 'Barangay 1',
            'email_verified_at' => now(),
        ]);

        User::create([
            'first_name' => 'Carmen',
            'middle_name' => 'Bautista',
            'last_name' => 'Santos',
            'email' => 'carmen.santos@example.com',
            'password' => Hash::make('password123'),
            'access' => 'resident',
            'barangay' => 'Barangay 2',
            'email_verified_at' => now(),
        ]);
    }
}
