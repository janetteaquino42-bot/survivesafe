<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailConfiguration extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:email {email}';

    /**
     * The console command description.
     */
    protected $description = 'Test email configuration by sending a test email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Testing email configuration...');
        $this->info("Sending test email to: {$email}");
        
        try {
            Mail::raw('This is a test email from Art Carousel to verify your email configuration is working correctly!', function ($message) use ($email) {
                $message->to($email)
                        ->subject('🎨 Art Carousel - Email Configuration Test');
            });
            
            $this->info('✅ Test email sent successfully!');
            $this->info('Check your inbox for the test email.');
            $this->info('If you don\'t receive it, check your spam folder and verify your SMTP settings.');
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email!');
            $this->error("Error: {$e->getMessage()}");
            $this->info('Please check your .env email configuration and try again.');
        }
    }
}