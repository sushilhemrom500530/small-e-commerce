<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopProductResource extends JsonResource
{
    /**
     * Transform the resource into an array with camelCase properties.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->product;

        return [
            'id' => (int) $this->id,
            'shopId' => (int) $this->shop_id,
            'productId' => (int) $this->product_id,
            'name' => (string) ($product?->name ?? ''),
            'catalogDescription' => $product?->description ? (string) $product->description : null,
            'details' => $this->details ? (string) $this->details : null,
            'effectiveDetails' => (string) ($this->details ?: ($product?->description ?? '')),
            'price' => (float) $this->price,
            'formattedPrice' => '৳'.number_format((float) $this->price, 2),
            'thumbnail' => $this->thumbnail ? (string) $this->thumbnail : null,
            'catalogThumbnail' => $product?->thumbnail ? (string) $product->thumbnail : null,
            'effectiveThumbnail' => (string) ($this->thumbnail ?: ($product?->thumbnail ?? '')),
            'isActive' => (bool) $this->is_active,
            'category' => $product?->category ? [
                'id' => (int) $product->category->id,
                'name' => (string) $product->category->name,
                'slug' => (string) $product->category->slug,
            ] : null,
            'shop' => $this->whenLoaded('shop', function () {
                return [
                    'id' => (int) $this->shop->id,
                    'name' => (string) $this->shop->name,
                    'slug' => (string) $this->shop->slug,
                ];
            }),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
