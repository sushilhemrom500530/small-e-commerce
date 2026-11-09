<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopProduct extends Model
{
    use HasFactory;

    protected $table = 'shop_products';

    protected $fillable = [
        'shop_id',
        'product_id',
        'price',
        'details',
        'thumbnail',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'shop_id' => 'integer',
            'product_id' => 'integer',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The shop listing this product.
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }

    /**
     * The underlying shared catalog product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the effective thumbnail (shop-specific override or catalog fallback).
     */
    public function getEffectiveThumbnailAttribute(): ?string
    {
        return $this->thumbnail ?: $this->product?->thumbnail;
    }

    /**
     * Get the effective details/description (shop-specific override or catalog fallback).
     */
    public function getEffectiveDetailsAttribute(): ?string
    {
        return $this->details ?: $this->product?->description;
    }
}

