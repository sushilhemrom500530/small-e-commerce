<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiShopEcommerceTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $ownerA;

    protected User $ownerB;

    protected Shop $shopA;

    protected Shop $shopB;

    protected Category $category;

    protected JwtService $jwtService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->jwtService = app(JwtService::class);

        $this->admin = User::factory()->create([
            'role' => UserRole::Admin->value,
            'email' => 'admin@test.com',
        ]);

        $this->ownerA = User::factory()->create([
            'role' => UserRole::ShopOwner->value,
            'email' => 'ownerA@test.com',
        ]);

        $this->ownerB = User::factory()->create([
            'role' => UserRole::ShopOwner->value,
            'email' => 'ownerB@test.com',
        ]);

        $this->shopA = Shop::create([
            'owner_id' => $this->ownerA->id,
            'name' => 'Shop A',
            'slug' => 'shop-a',
            'status' => 'active',
        ]);

        $this->shopB = Shop::create([
            'owner_id' => $this->ownerB->id,
            'name' => 'Shop B',
            'slug' => 'shop-b',
            'status' => 'active',
        ]);

        $this->category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'is_active' => true,
        ]);
    }

    protected function authHeader(User $user): array
    {
        $token = $this->jwtService->generateAccessToken($user);

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_admin_can_create_product_in_shared_catalog(): void
    {
        $response = $this->withHeaders($this->authHeader($this->admin))
            ->postJson('/api/v1/admin/products', [
                'name' => 'Samsung Galaxy A56',
                'categoryId' => $this->category->id,
                'description' => 'Global catalog product',
                'thumbnail' => 'https://example.com/a56.jpg',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['name' => 'Samsung Galaxy A56']);
    }

    public function test_shop_owners_can_add_shared_catalog_product_with_independent_prices(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Samsung Galaxy A56',
            'description' => 'Original description',
            'thumbnail' => 'https://example.com/global.jpg',
        ]);

        // Shop A adds product with price 45000
        $resA = $this->withHeaders($this->authHeader($this->ownerA))
            ->postJson("/api/v1/shop/products/{$product->id}/add", [
                'price' => 45000,
                'details' => 'Shop A exclusive package',
                'thumbnail' => 'https://example.com/shopA.jpg',
            ]);
        $resA->assertStatus(201);

        // Shop B adds same product with price 46500
        $resB = $this->withHeaders($this->authHeader($this->ownerB))
            ->postJson("/api/v1/shop/products/{$product->id}/add", [
                'price' => 46500,
                'details' => 'Shop B premium edition',
                'thumbnail' => 'https://example.com/shopB.jpg',
            ]);
        $resB->assertStatus(201);

        // Verify independent prices in database
        $listingA = ShopProduct::where('shop_id', $this->shopA->id)->where('product_id', $product->id)->first();
        $listingB = ShopProduct::where('shop_id', $this->shopB->id)->where('product_id', $product->id)->first();

        $this->assertEquals('45000.00', $listingA->price);
        $this->assertEquals('46500.00', $listingB->price);

        // When Shop A updates price, Shop B is unaffected
        $this->withHeaders($this->authHeader($this->ownerA))
            ->putJson("/api/v1/shop/products/{$listingA->id}", [
                'price' => 44000,
            ])->assertStatus(200);

        $listingB->refresh();
        $this->assertEquals('46500.00', $listingB->price);
    }

    public function test_customer_only_sees_products_assigned_to_specific_shop(): void
    {
        $assignedProduct = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Assigned Product',
        ]);

        $unassignedProduct = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Unassigned Product',
        ]);

        ShopProduct::create([
            'shop_id' => $this->shopA->id,
            'product_id' => $assignedProduct->id,
            'price' => 99.00,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/store/shop-a/products');
        $response->assertStatus(200);

        $names = collect($response->json('results'))->pluck('name')->all();
        $this->assertContains('Assigned Product', $names);
        $this->assertNotContains('Unassigned Product', $names);
    }
}

