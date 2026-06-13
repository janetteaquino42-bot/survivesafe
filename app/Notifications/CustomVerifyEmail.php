<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmailBase
{

    /**
     * Get the verification URL for the given notifiable.
     */
    protected function verificationUrl($notifiable)
    {
        // Force APP_URL to be used for URL generation
        URL::forceRootUrl(config('app.url'));

        // Get email address safely
        $email = method_exists($notifiable, 'getEmailForVerification')
            ? $notifiable->getEmailForVerification()
            : $notifiable->email_address;

        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($email),
            ]
        );
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        \Log::info('[Email Verification] Getting channels for notification');
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        \Log::info('[Email Verification] Preparing to send email', [
            'user_id' => $notifiable->getKey(),
            'email' => $notifiable->getEmailForVerification(),
            'url' => $verificationUrl,
        ]);

        try {
            $mailMessage = (new MailMessage)
                ->subject('Verify Your Email Address - BACOOR DRRMO')
                ->view('emails.verify-email', [
                    'user' => $notifiable,
                    'verificationUrl' => $verificationUrl,
                ]);

            \Log::info('[Email Verification] Mail message created successfully');

            return $mailMessage;
        } catch (\Exception $e) {
            \Log::error('[Email Verification] Error creating mail message: ' . $e->getMessage());
            throw $e;
        }
    }
}
