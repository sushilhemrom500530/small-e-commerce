<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    /**
     * Transform the resource into an array with camelCase properties.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'ownerId' => (int) $this->owner_id,
            'name' => (string) $this->name,
            'slug' => (string) $this->slug,
            'description' => $this->description ? (string) $this->description : null,
            'logo' => $this->logo ? (string) $this->logo : null,
            'status' => (string) $this->status,
            'owner' => $this->whenLoaded('owner', function () {
                return [
                    'id' => (int) $this->owner->id,
                    'name' => (string) $this->owner->name,
                    'email' => (string) $this->owner->email,
                    'phoneNumber' => $this->owner->phone_number ? (string) $this->owner->phone_number : null,
                ];
            }),
            'productsCount' => (int) ($this->products_count ?? $this->shop_products_count ?? $this->shopProducts()->count()),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}

