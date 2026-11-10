<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_owner_can_list_orders_from_database(): void
    {
        $owner = User::create([
            'name' => 'Test Owner',
            'email' => 'testowner@example.com',
            'password' => '12345678',
            'role' => 'shop_owner',
            'status' => 'active',
        ]);

        $shop = Shop::create([
            'owner_id' => $owner->id,
            'name' => 'Owner Shop',
            'slug' => 'owner-shop',
            'status' => 'active',
        ]);

        Order::create([
            'order_number' => 'ORD-100',
            'shop_id' => $shop->id,
            'customer_name' => 'Alice Customer',
            'items_count' => 2,
            'total_amount' => 500.00,
            'status' => 'Pending',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer owner-session-token',
        ])->getJson('/api/v1/shop/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'message',
                'results',
            ]);
    }

    public function test_shop_owner_can_mark_order_as_delivered_and_persist_in_database(): void
    {
        $owner = User::create([
            'name' => 'Test Owner 2',
            'email' => 'testowner2@example.com',
            'password' => '12345678',
            'role' => 'shop_owner',
            'status' => 'active',
        ]);

        $shop = Shop::create([
            'owner_id' => $owner->id,
            'name' => 'Owner Shop 2',
            'slug' => 'owner-shop-2',
            'status' => 'active',
        ]);

        $order = Order::create([
            'order_number' => 'ORD-TEST-999',
            'shop_id' => $shop->id,
            'customer_name' => 'Test Customer',
            'total_amount' => 1500.00,
            'status' => 'Pending',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer owner-session-token',
        ])->patchJson("/api/v1/shop/orders/{$order->id}/status", [
            'status' => 'Delivered',
        ]);

        $response->assertStatus(200);

        // Verify database persistence
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'Delivered',
        ]);

        $order->refresh();
        $this->assertSame('Delivered', $order->status);
        $this->assertNotNull($order->delivered_at);
    }
}
