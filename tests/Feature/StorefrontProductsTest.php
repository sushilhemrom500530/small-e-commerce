<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontProductsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_retrieve_all_products_via_storefront_api(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_storefront@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-storefront',
        ]);

        for ($i = 1; $i <= 12; $i++) {
            Product::create([
                'name' => "Product {$i}",
                'created_by' => $admin->id,
                'category_id' => $category->id,
            ]);
        }

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertEquals(200, $data['statusCode']);
        $this->assertArrayHasKey('meta', $data);
        $this->assertEquals(12, $data['meta']['totalResult']);
        $this->assertCount(10, $data['results']);
        $this->assertArrayHasKey('price', $data['results'][0]);
    }

    public function test_can_retrieve_single_product_details_via_storefront_api(): void
    {
        $admin = User::create([
            'name' => 'Admin User 2',
            'email' => 'admin_single@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $category = Category::create([
            'name' => 'Audio',
            'slug' => 'audio-storefront',
        ]);

        $product = Product::create([
            'name' => 'Noise Cancelling Headphones',
            'created_by' => $admin->id,
            'category_id' => $category->id,
        ]);

        $response = $this->getJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertEquals('Noise Cancelling Headphones', $data['results']['name']);
        $this->assertEquals('Audio', $data['results']['categoryName']);
        $this->assertArrayHasKey('price', $data['results']);
    }
}
