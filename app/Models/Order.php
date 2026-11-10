<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'shop_id',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'items_count',
        'total_amount',
        'currency',
        'status',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'shop_id' => 'integer',
            'customer_id' => 'integer',
            'items_count' => 'integer',
            'total_amount' => 'decimal:2',
            'delivered_at' => 'datetime',
        ];
    }

    /**
     * The shop this order belongs to.
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Customer who placed the order (if registered user).
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
