<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminShopOwnersManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        return User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => '12345678',
            'role' => 'admin',
            'status' => 'active',
            'is_verified' => true,
        ]);
    }

    public function test_admin_can_update_shop_owner_details(): void
    {
        $this->createAdmin();

        $owner = User::create([
            'name' => 'John Vendor',
            'email' => 'vendor@example.com',
            'password' => '12345678',
            'role' => 'shop_owner',
            'phone_number' => '+8801711111111',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $shop = Shop::create([
            'owner_id' => $owner->id,
            'name' => 'Old Shop Name',
            'slug' => 'old-shop-name',
            'status' => 'active',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->putJson("/api/v1/admin/shop-owners/{$owner->id}", [
            'name' => 'John Updated',
            'email' => 'vendor-updated@example.com',
            'phoneNumber' => '+8801799999999',
            'shopName' => 'Brand New Shop',
            'status' => 'active',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $owner->id,
            'name' => 'John Updated',
            'email' => 'vendor-updated@example.com',
            'phone_number' => '+8801799999999',
        ]);

        $this->assertDatabaseHas('shops', [
            'id' => $shop->id,
            'name' => 'Brand New Shop',
        ]);
    }

    public function test_admin_can_toggle_shop_owner_status_to_suspended_and_back(): void
    {
        $this->createAdmin();

        $owner = User::create([
            'name' => 'Target Owner',
            'email' => 'target@example.com',
            'password' => '12345678',
            'role' => 'shop_owner',
            'status' => 'active',
            'is_verified' => true,
        ]);

        Shop::create([
            'owner_id' => $owner->id,
            'name' => 'Target Store',
            'slug' => 'target-store',
            'status' => 'active',
        ]);

        // 1. Suspend
        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->patchJson("/api/v1/admin/shop-owners/{$owner->id}/status");

        $response->assertStatus(200);

        $owner->refresh();
        $this->assertSame('suspended', $owner->status);

        // 2. Reactivate
        $response2 = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->patchJson("/api/v1/admin/shop-owners/{$owner->id}/status");

        $response2->assertStatus(200);

        $owner->refresh();
        $this->assertSame('active', $owner->status);
    }

    public function test_admin_can_delete_shop_owner(): void
    {
        $this->createAdmin();

        $owner = User::create([
            'name' => 'Deletable Owner',
            'email' => 'delete-me@example.com',
            'password' => '12345678',
            'role' => 'shop_owner',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $shop = Shop::create([
            'owner_id' => $owner->id,
            'name' => 'Delete Store',
            'slug' => 'delete-store',
            'status' => 'active',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->deleteJson("/api/v1/admin/shop-owners/{$owner->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('users', [
            'id' => $owner->id,
        ]);

        $this->assertDatabaseMissing('shops', [
            'id' => $shop->id,
        ]);
    }
}
