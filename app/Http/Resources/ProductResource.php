<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'categoryId' => $this->category_id ? (int) $this->category_id : null,
            'categoryName' => $this->category?->name,
            'categorySlug' => $this->category?->slug,
            'createdBy' => (int) $this->created_by,
            'creatorName' => $this->creator?->name,
            'creatorRole' => $this->creator?->role,
            'name' => (string) $this->name,
            'price' => (float) ($this->shopProducts?->first()?->price ?? 89.99),
            'rating' => 4.8,
            'description' => $this->description ? (string) $this->description : null,
            'thumbnail' => $this->thumbnail ? (string) $this->thumbnail : null,
            'isAddedToCurrentShop' => $this->when(isset($this->is_added), (bool) $this->is_added),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
