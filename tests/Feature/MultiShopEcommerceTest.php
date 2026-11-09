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
use Illuminate\Support\Facades\Hash;
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
            'password' => Hash::make('password123'),
            'is_verified' => true,
            'status' => 'active',
        ]);

        $this->ownerA = User::factory()->create([
            'role' => UserRole::ShopOwner->value,
            'email' => 'ownerA@test.com',
            'password' => Hash::make('password123'),
            'is_verified' => true,
            'status' => 'active',
        ]);

        $this->ownerB = User::factory()->create([
            'role' => UserRole::ShopOwner->value,
            'email' => 'ownerB@test.com',
            'password' => Hash::make('password123'),
            'is_verified' => true,
            'status' => 'active',
        ]);

        $this->shopA = Shop::create([
            'owner_id' => $this->ownerA->id,
            'name' => 'Tech World',
            'slug' => 'tech-world',
            'description' => 'Best gadgets in town',
            'status' => 'active',
        ]);

        $this->shopB = Shop::create([
            'owner_id' => $this->ownerB->id,
            'name' => 'Fashion Hub',
            'slug' => 'fashion-hub',
            'description' => 'Trendy outfits & accessories',
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

    // ==========================================
    // 1. ADMIN PANEL FUNCTIONAL REQUIREMENTS
    // ==========================================

    public function test_admin_authentication_via_login_api(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertNotEmpty($response->json('results.token'));
        $this->assertEquals('admin', $response->json('results.role'));
    }

    public function test_admin_can_manage_shops_crud(): void
    {
        // CREATE Shop
        $createRes = $this->withHeaders($this->authHeader($this->admin))
            ->postJson('/api/v1/admin/shops', [
                'name' => 'Gadget Galaxy',
                'description' => 'Top notch electronics',
                'ownerId' => $this->ownerA->id,
                'status' => 'active',
            ]);
        $createRes->assertStatus(201);
        $shopId = $createRes->json('results.id');
        $this->assertDatabaseHas('shops', ['name' => 'Gadget Galaxy']);

        // READ Shops
        $listRes = $this->withHeaders($this->authHeader($this->admin))
            ->getJson('/api/v1/admin/shops');
        $listRes->assertStatus(200);

        // UPDATE Shop
        $updateRes = $this->withHeaders($this->authHeader($this->admin))
            ->putJson("/api/v1/admin/shops/{$shopId}", [
                'name' => 'Gadget Galaxy Updated',
                'status' => 'inactive',
            ]);
        $updateRes->assertStatus(200);
        $this->assertDatabaseHas('shops', ['id' => $shopId, 'name' => 'Gadget Galaxy Updated', 'status' => 'inactive']);

        // DELETE Shop
        $deleteRes = $this->withHeaders($this->authHeader($this->admin))
            ->deleteJson("/api/v1/admin/shops/{$shopId}");
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('shops', ['id' => $shopId]);
    }

    public function test_admin_can_manage_master_products_catalog_crud(): void
    {
        // CREATE Product
        $createRes = $this->withHeaders($this->authHeader($this->admin))
            ->postJson('/api/v1/admin/products', [
                'name' => 'Sony WH-1000XM5',
                'categoryId' => $this->category->id,
                'description' => 'Industry-leading noise canceling headphones',
                'thumbnail' => 'https://example.com/sony.jpg',
            ]);
        $createRes->assertStatus(201);
        $productId = $createRes->json('results.id');
        $this->assertDatabaseHas('products', ['name' => 'Sony WH-1000XM5']);

        // READ Products
        $listRes = $this->withHeaders($this->authHeader($this->admin))
            ->getJson('/api/v1/admin/products');
        $listRes->assertStatus(200);

        // UPDATE Product
        $updateRes = $this->withHeaders($this->authHeader($this->admin))
            ->putJson("/api/v1/admin/products/{$productId}", [
                'name' => 'Sony WH-1000XM5 V2',
                'description' => 'Updated flagship headphones',
            ]);
        $updateRes->assertStatus(200);
        $this->assertDatabaseHas('products', ['id' => $productId, 'name' => 'Sony WH-1000XM5 V2']);

        // DELETE Product
        $deleteRes = $this->withHeaders($this->authHeader($this->admin))
            ->deleteJson("/api/v1/admin/products/{$productId}");
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_admin_can_create_and_manage_shop_owner_accounts(): void
    {
        $response = $this->withHeaders($this->authHeader($this->admin))
            ->postJson('/api/v1/admin/shop-owners', [
                'name' => 'New Merchant',
                'email' => 'new_merchant@test.com',
                'password' => 'password123',
                'phoneNumber' => '+8801700000000',
                'shopName' => 'Smart Store',
                'shopDescription' => 'Smart accessories',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'new_merchant@test.com', 'role' => 'shop_owner']);
        $this->assertDatabaseHas('shops', ['name' => 'Smart Store']);

        // Read shop owners list
        $listRes = $this->withHeaders($this->authHeader($this->admin))
            ->getJson('/api/v1/admin/shop-owners');
        $listRes->assertStatus(200);
    }

    // ==========================================
    // 2. SHOP MANAGEMENT (SHARED CATALOG & OVERRIDES)
    // ==========================================

    public function test_shop_owner_can_browse_shared_catalog(): void
    {
        Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Shared Item 1',
        ]);

        $response = $this->withHeaders($this->authHeader($this->ownerA))
            ->getJson('/api/v1/shop/catalog');

        $response->assertStatus(200);
        $names = collect($response->json('results'))->pluck('name')->all();
        $this->assertContains('Shared Item 1', $names);
    }

    public function test_products_created_by_shop_owner_become_available_in_shared_catalog_for_other_shops(): void
    {
        // Owner A creates a product from their shop dashboard
        $createRes = $this->withHeaders($this->authHeader($this->ownerA))
            ->postJson('/api/v1/shop/products', [
                'name' => 'Custom Mechanical Keyboard',
                'categoryId' => $this->category->id,
                'description' => 'RGB wireless mechanical keyboard',
                'thumbnail' => 'https://example.com/keyboard.jpg',
                'price' => 7500.00,
                'details' => 'Shop A custom brown switch edition',
            ]);
        $createRes->assertStatus(201);

        // Verify product was created in master products table
        $createdProduct = Product::where('name', 'Custom Mechanical Keyboard')->first();
        $this->assertNotNull($createdProduct);
        $this->assertEquals($this->ownerA->id, $createdProduct->created_by);

        // Verify it is listed in Shop A
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shopA->id,
            'product_id' => $createdProduct->id,
            'price' => 7500.00,
        ]);

        // Owner B browses shared catalog and sees this product
        $catalogRes = $this->withHeaders($this->authHeader($this->ownerB))
            ->getJson('/api/v1/shop/catalog');
        $catalogRes->assertStatus(200);
        $catalogNames = collect($catalogRes->json('results'))->pluck('name')->all();
        $this->assertContains('Custom Mechanical Keyboard', $catalogNames);

        // Owner B adds Owner A's product to Shop B with independent pricing
        $addRes = $this->withHeaders($this->authHeader($this->ownerB))
            ->postJson("/api/v1/shop/products/{$createdProduct->id}/add", [
                'price' => 7900.00,
                'details' => 'Shop B includes free braided cable',
            ]);
        $addRes->assertStatus(201);

        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $this->shopB->id,
            'product_id' => $createdProduct->id,
            'price' => 7900.00,
        ]);
    }

    public function test_shop_owners_can_modify_product_prices_details_and_thumbnails_for_their_own_shops(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Samsung Galaxy A56',
            'description' => 'Original master description',
            'thumbnail' => 'https://example.com/master-thumb.jpg',
        ]);

        // Shop A adds product
        $listingA = ShopProduct::create([
            'shop_id' => $this->shopA->id,
            'product_id' => $product->id,
            'price' => 45000.00,
            'is_active' => true,
        ]);

        // Shop B adds product
        $listingB = ShopProduct::create([
            'shop_id' => $this->shopB->id,
            'product_id' => $product->id,
            'price' => 46500.00,
            'is_active' => true,
        ]);

        // Shop A modifies its own price, details, and thumbnail
        $updateRes = $this->withHeaders($this->authHeader($this->ownerA))
            ->putJson("/api/v1/shop/products/{$listingA->id}", [
                'price' => 43999.00,
                'details' => 'Shop A discount offer with warranty card',
                'thumbnail' => 'https://example.com/shopA-custom-thumb.jpg',
            ]);
        $updateRes->assertStatus(200);

        // Check Shop A updated values
        $listingA->refresh();
        $this->assertEquals('43999.00', $listingA->price);
        $this->assertEquals('Shop A discount offer with warranty card', $listingA->effective_details);
        $this->assertEquals('https://example.com/shopA-custom-thumb.jpg', $listingA->effective_thumbnail);

        // Check Shop B remains completely untouched
        $listingB->refresh();
        $this->assertEquals('46500.00', $listingB->price);
        $this->assertEquals('Original master description', $listingB->effective_details);
        $this->assertEquals('https://example.com/master-thumb.jpg', $listingB->effective_thumbnail);
    }

    // ==========================================
    // 3. CUSTOMER VIEW REQUIREMENTS
    // ==========================================

    public function test_customer_only_sees_products_assigned_to_a_shop(): void
    {
        $assignedProduct = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Samsung Galaxy A56',
        ]);

        $unassignedProduct = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Stainless Steel Smart Thermos',
        ]);

        ShopProduct::create([
            'shop_id' => $this->shopA->id,
            'product_id' => $assignedProduct->id,
            'price' => 45000.00,
            'is_active' => true,
        ]);

        // Fetch products for Shop A
        $response = $this->getJson('/api/v1/store/tech-world/products');
        $response->assertStatus(200);

        $productNames = collect($response->json('results'))->pluck('name')->all();

        // Must see assigned product
        $this->assertContains('Samsung Galaxy A56', $productNames);

        // MUST NOT see unassigned product
        $this->assertNotContains('Stainless Steel Smart Thermos', $productNames);
    }

    public function test_customer_sees_shop_specific_information_prices_and_thumbnails(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'created_by' => $this->admin->id,
            'name' => 'Samsung Galaxy A56',
            'description' => 'Catalog baseline description',
            'thumbnail' => 'https://example.com/default-phone.jpg',
        ]);

        // Listed in Shop A at 45,000 with custom thumb
        ShopProduct::create([
            'shop_id' => $this->shopA->id,
            'product_id' => $product->id,
            'price' => 45000.00,
            'details' => 'Shop A 2-year official warranty',
            'thumbnail' => 'https://example.com/techworld-phone.jpg',
            'is_active' => true,
        ]);

        // Listed in Shop B at 46,500 with different details
        ShopProduct::create([
            'shop_id' => $this->shopB->id,
            'product_id' => $product->id,
            'price' => 46500.00,
            'details' => 'Shop B includes free leather case',
            'thumbnail' => null, // Falls back to catalog thumbnail
            'is_active' => true,
        ]);

        // Customer visits Shop A storefront
        $resA = $this->getJson('/api/v1/store/tech-world/products');
        $resA->assertStatus(200);
        $itemA = collect($resA->json('results'))->firstWhere('name', 'Samsung Galaxy A56');
        $this->assertEquals(45000.00, $itemA['price']);
        $this->assertEquals('Shop A 2-year official warranty', $itemA['effectiveDetails']);
        $this->assertEquals('https://example.com/techworld-phone.jpg', $itemA['effectiveThumbnail']);

        // Customer visits Shop B storefront
        $resB = $this->getJson('/api/v1/store/fashion-hub/products');
        $resB->assertStatus(200);
        $itemB = collect($resB->json('results'))->firstWhere('name', 'Samsung Galaxy A56');
        $this->assertEquals(46500.00, $itemB['price']);
        $this->assertEquals('Shop B includes free leather case', $itemB['effectiveDetails']);
        $this->assertEquals('https://example.com/default-phone.jpg', $itemB['effectiveThumbnail']);
    }

    public function test_customer_can_browse_all_active_shops(): void
    {
        $response = $this->getJson('/api/v1/store/shops');
        $response->assertStatus(200);

        $shopNames = collect($response->json('results'))->pluck('name')->all();
        $this->assertContains('Tech World', $shopNames);
        $this->assertContains('Fashion Hub', $shopNames);
    }
}
