<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contact:test-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test contact form email functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing email...');

        try {
            $testData = [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'subject' => 'Test Subject',
                'message' => 'This is a test message from the contact form.',
            ];

            Mail::to(config('mail.from.address'))
                ->send(new ContactFormMail($testData));

            $this->info('Email sent successfully!');
            return 0;
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return 1;
        }
    }
}
