<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Preserves exact response shape of Express formatUserResponse.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $base = [
            '_id' => (string) $this->id,
            'id' => (string) $this->id,
            'name' => (string) ($this->name ?? ''),
            'email' => (string) $this->email,
            'profileUrl' => (string) ($this->profile_url ?? ''),
            'role' => (string) $this->role,
            'phoneNumber' => (string) ($this->phone_number ?? ''),
            'address' => (string) ($this->address ?? ''),
            'gender' => $this->gender,
            'isDeleted' => (bool) $this->is_deleted,
            'status' => (string) $this->status,
            'isVerified' => (bool) $this->is_verified,
            'isProfileCompleted' => (bool) $this->is_profile_completed,
            'provider' => $this->provider,
            'providerId' => $this->provider_id,
            'createdAt' => $this->created_at?->toISOString() ?? $this->created_at,
            'updatedAt' => $this->updated_at?->toISOString() ?? $this->updated_at,
        ];

        if ($this->role === 'shop_owner' || $this->role === 'provider') {
            $base['serviceName'] = (string) ($this->service_name ?? '');
            $base['serviceLisence'] = (string) ($this->service_lisence ?? '');
        }

        return $base;
    }
}
