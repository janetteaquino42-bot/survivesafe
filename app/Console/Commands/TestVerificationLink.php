<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TestVerificationLink extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:verification-link {userId}';

    /**
     * The console command description.
     */
    protected $description = 'Generate a fresh verification link for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('userId');
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found!");
            return;
        }
        
        if ($user->hasVerifiedEmail()) {
            $this->info("User {$user->email} is already verified!");
            return;
        }
        
        // Generate fresh verification link
        $user->sendEmailVerificationNotification();
        
        $this->info("✅ Fresh verification email sent to: {$user->email}");
        $this->info("Check your email inbox for the new verification link.");
        $this->info("Current APP_URL: " . config('app.url'));
    }
}