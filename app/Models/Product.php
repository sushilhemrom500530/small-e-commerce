<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'subcategory_id',
        'name',
        'slug',
        'description',
        'image',
        'featured_images',
        'old_price',
        'new_price',
        'stock',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'featured_images' => 'array',
            'old_price' => 'decimal:2',
            'new_price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product): void {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return is_numeric($value)
            ? $this->where('id', $value)->first()
            : $this->where($field ?? 'slug', $value)->first();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): string {
                if (! empty($this->image)) {
                    if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
                        return $this->image;
                    }

                    return Storage::disk('public')->url($this->image);
                }

                return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }
        );
    }

    protected function featuredImagesUrls(): Attribute
    {
        return Attribute::make(
            get: function (): array {
                if (empty($this->featured_images) || ! is_array($this->featured_images)) {
                    return [];
                }

                return array_map(function ($img): string {
                    if (str_starts_with($img, 'http://') || str_starts_with($img, 'https://')) {
                        return $img;
                    }

                    return Storage::disk('public')->url($img);
                }, $this->featured_images);
            }
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function (): ?int {
                if ($this->old_price && (float) $this->old_price > (float) $this->new_price) {
                    return (int) round((((float) $this->old_price - (float) $this->new_price) / (float) $this->old_price) * 100);
                }

                return null;
            }
        );
    }
}
