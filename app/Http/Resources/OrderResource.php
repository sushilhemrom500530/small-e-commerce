<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'orderId' => (string) $this->order_number,
            'orderNumber' => (string) $this->order_number,
            'customer' => (string) $this->customer_name,
            'customerName' => (string) $this->customer_name,
            'customerEmail' => (string) ($this->customer_email ?? ''),
            'customerPhone' => (string) ($this->customer_phone ?? ''),
            'shippingAddress' => (string) ($this->shipping_address ?? ''),
            'date' => $this->created_at ? $this->created_at->format('M d, Y') : 'N/A',
            'itemsCount' => (int) $this->items_count,
            'total' => '৳ '.number_format((float) $this->total_amount, 2),
            'totalAmount' => (float) $this->total_amount,
            'currency' => (string) ($this->currency ?? 'BDT'),
            'status' => (string) $this->status,
            'deliveredAt' => $this->delivered_at?->toISOString(),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
