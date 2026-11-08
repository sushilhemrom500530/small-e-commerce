<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $otp,
        public string $purpose = 'Account Verification'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $brand = config('mail.from.name', 'Practice Backend api');

        return new Envelope(
            subject: "{$brand} - {$this->purpose} Code: {$this->otp}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                    <h2>{$this->purpose}</h2>
                    <p>Your one-time verification code is:</p>
                    <div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb; margin: 20px 0;'>
                        {$this->otp}
                    </div>
                    <p>This code expires in 2.5 minutes. If you did not request this, please ignore this email.</p>
                </div>
            ",
        );
    }
}
