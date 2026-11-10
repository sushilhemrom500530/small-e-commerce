<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUsersManagementTest extends TestCase
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

    public function test_admin_can_list_users(): void
    {
        $this->createAdmin();

        User::create([
            'name' => 'Sample Customer',
            'email' => 'customer@example.com',
            'password' => '12345678',
            'role' => 'customer',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'message',
                'results',
            ]);

        $this->assertGreaterThanOrEqual(2, count($response->json('results')));
    }

    public function test_admin_can_create_new_user(): void
    {
        $this->createAdmin();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->postJson('/api/v1/admin/users', [
            'name' => 'New Staff',
            'email' => 'staff@example.com',
            'password' => 'secure123',
            'role' => 'shop_owner',
            'phoneNumber' => '+8801700001111',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'staff@example.com',
            'name' => 'New Staff',
            'role' => 'shop_owner',
        ]);
    }

    public function test_admin_can_update_user(): void
    {
        $this->createAdmin();

        $user = User::create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'password' => '12345678',
            'role' => 'customer',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->putJson("/api/v1/admin/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'shop_owner',
            'status' => 'active',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'shop_owner',
        ]);
    }

    public function test_admin_can_toggle_user_status(): void
    {
        $this->createAdmin();

        $user = User::create([
            'name' => 'Status User',
            'email' => 'status@example.com',
            'password' => '12345678',
            'role' => 'customer',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->patchJson("/api/v1/admin/users/{$user->id}/status");

        $response->assertStatus(200);

        $user->refresh();
        $this->assertSame('suspended', $user->status);
    }

    public function test_admin_can_delete_user(): void
    {
        $this->createAdmin();

        $user = User::create([
            'name' => 'To Delete',
            'email' => 'delete@example.com',
            'password' => '12345678',
            'role' => 'customer',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer admin-session-token',
        ])->deleteJson("/api/v1/admin/users/{$user->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}
