<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Password;

class TestPasswordReset extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:password-reset {email}';

    /**
     * The console command description.
     */
    protected $description = 'Test password reset functionality by sending reset link';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Testing password reset functionality...');
        $this->info("Sending password reset email to: {$email}");
        
        // Check if user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->error("❌ User with email {$email} not found!");
            $this->info('Available users:');
            $users = User::select('id', 'email', 'first_name', 'last_name')->take(5)->get();
            foreach ($users as $user) {
                $this->line("  - {$user->email} ({$user->first_name} {$user->last_name})");
            }
            return;
        }
        
        try {
            $status = Password::sendResetLink(['email' => $email]);
            
            if ($status === Password::RESET_LINK_SENT) {
                $this->info('✅ Password reset email sent successfully!');
                $this->info('Check your email inbox for the reset link.');
                $this->info('The link will expire in 60 minutes for security.');
            } else {
                $this->error("❌ Failed to send reset link: {$status}");
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to send password reset email!');
            $this->error("Error: {$e->getMessage()}");
            $this->info('Please check your email configuration and try again.');
        }
    }
}