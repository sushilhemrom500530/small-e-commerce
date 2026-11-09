<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone_number',
        'gender',
        'address',
        'profile_url',
        'service_name',
        'service_lisence',
        'status',
        'is_verified',
        'is_deleted',
        'is_profile_completed',
        'provider',
        'provider_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
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
            'is_verified' => 'boolean',
            'is_deleted' => 'boolean',
            'is_profile_completed' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin->value;
    }

    public function isShopOwner(): bool
    {
        return $this->role === UserRole::ShopOwner->value;
    }

    public function isCustomer(): bool
    {
        return $this->role === UserRole::Customer->value;
    }

    /**
     * Backwards-compatible aliases.
     */
    public function isProvider(): bool
    {
        return $this->isShopOwner();
    }

    public function isClient(): bool
    {
        return $this->isCustomer();
    }
}
