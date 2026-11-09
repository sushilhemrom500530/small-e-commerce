<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'created_by',
        'name',
        'description',
        'thumbnail',
    ];

    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'created_by' => 'integer',
        ];
    }

    /**
     * Category of the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * The user (Admin or Shop Owner) who created this catalog product.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Shop listings referencing this shared catalog product.
     */
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class, 'product_id');
    }

    /**
     * Shops that currently list this product.
     */
    public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'shop_products')
            ->withPivot(['id', 'price', 'details', 'thumbnail', 'is_active'])
            ->withTimestamps();
    }
}
