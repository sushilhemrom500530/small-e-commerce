<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'description',
        'logo',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'owner_id' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Shop $shop): void {
            if (empty($shop->slug)) {
                $shop->slug = Str::slug($shop->name);
            }
        });
    }

    /**
     * The owner of this shop.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Shop product listings.
     */
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class, 'shop_id');
    }

    /**
     * Orders placed in this shop.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'shop_id');
    }

    /**
     * Products assigned to this shop via shop_products pivot.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'shop_products')
            ->withPivot(['id', 'price', 'details', 'thumbnail', 'is_active'])
            ->withTimestamps();
    }
}
