<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'user_id';
    }

    /**
     * Get the column name for the "email" field.
     *
     * @return string
     */
    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

    /**
     * Get the email address that should be used for verification.
     *
     * @return string
     */
    public function getEmailForVerification()
    {
        return $this->email;
    }

    /**
     * Get the email address used for authentication.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'profile_image',
        'access',
        'position',
        'barangay',
        'email_verified_at',
        'deletion_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the incidents reported by this user.
     */
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'reported_by', 'user_id');
    }

    /**
     * Get the awareness materials created by this user.
     */
    public function awarenessMaterials(): HasMany
    {
        return $this->hasMany(AwarenessMaterial::class, 'created_by', 'user_id');
    }

    /**
     * Get the announcements created by this user.
     */
    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class, 'created_by', 'user_id');
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        $fullName = $this->first_name;

        if ($this->middle_name) {
            $fullName .= ' ' . $this->middle_name;
        }

        $fullName .= ' ' . $this->last_name;

        return $fullName;
    }

    /**
     * Check if user is a head officer.
     */
    public function isHeadOfficer(): bool
    {
        return $this->access === 'head_officer';
    }

    /**
     * Check if user is an officer.
     */
    public function isOfficer(): bool
    {
        return in_array($this->access, ['officer', 'head_officer']);
    }

    /**
     * Check if user is a resident.
     */
    public function isResident(): bool
    {
        return $this->access === 'resident';
    }

    /**
     * Check if user is pending.
     */
    public function isPending(): bool
    {
        return $this->access === 'pending';
    }

    /**
     * Scope a query to only include users with specific access level.
     */
    public function scopeWithAccess($query, $access)
    {
        return $query->where('access', $access);
    }

    /**
     * Scope a query to only include users from specific barangay.
     */
    public function scopeFromBarangay($query, $barangay)
    {
        return $query->where('barangay', $barangay);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\CustomResetPassword($token));
    }

    /**
     * Upgrade user from pending to buyer
     */
    public function unassignedBarangay()
    {
        return  $this->barangay == 'Unassigned';
    }

    public function upgradeToVerifiedUser(): void
    {
        if ($this->access === 'pending') {
            $this->access = 'resident';
            $this->save();
        }
    }
}
