<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Pagination\LengthAwarePaginator;
use Tests\TestCase;

class ApiResponsePaginationTest extends TestCase
{
    use ApiResponse;
    use RefreshDatabase;

    /**
     * Test trait response when data is greater than 10.
     */
    public function test_response_structure_when_data_is_more_than_10(): void
    {
        $items = collect(range(1, 25))->map(fn ($i) => ['id' => $i, 'name' => "Item {$i}"]);

        $response = $this->sendResponse($items);
        $data = $response->getData(true);

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Items retrieved successfully.', $data['message']);
        $this->assertArrayHasKey('meta', $data);
        $this->assertEquals(1, $data['meta']['currentPage']);
        $this->assertEquals(10, $data['meta']['limit']);
        $this->assertEquals(25, $data['meta']['totalResult']);
        $this->assertEquals(3, $data['meta']['totalPages']);
        $this->assertCount(10, $data['results']);
    }

    /**
     * Test trait response when data is 10 or less.
     */
    public function test_response_structure_when_data_is_10_or_less(): void
    {
        $items = collect(range(1, 5))->map(fn ($i) => ['id' => $i, 'name' => "Item {$i}"]);

        $response = $this->sendResponse($items);
        $data = $response->getData(true);

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Operation completed successfully.', $data['message']);
        $this->assertArrayNotHasKey('meta', $data);
        $this->assertCount(5, $data['results']);
    }

    /**
     * Test single object response.
     */
    public function test_single_object_response_has_no_meta(): void
    {
        $item = ['id' => 1, 'name' => 'Single Item'];

        $response = $this->sendResponse($item);
        $data = $response->getData(true);

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Operation completed successfully.', $data['message']);
        $this->assertArrayNotHasKey('meta', $data);
        $this->assertEquals($item, $data['results']);
    }

    /**
     * Test paginator response directly.
     */
    public function test_paginator_response_with_more_than_10_items(): void
    {
        $paginator = new LengthAwarePaginator(
            range(1, 10),
            100,
            10,
            1
        );

        $response = $this->sendPaginatedResponse($paginator);
        $data = $response->getData(true);

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Items retrieved successfully.', $data['message']);
        $this->assertArrayHasKey('meta', $data);
        $this->assertEquals(1, $data['meta']['currentPage']);
        $this->assertEquals(10, $data['meta']['limit']);
        $this->assertEquals(100, $data['meta']['totalResult']);
        $this->assertEquals(10, $data['meta']['totalPages']);
    }

    /**
     * Test API endpoint with more than 10 products.
     */
    public function test_admin_products_endpoint_returns_paginated_format_when_more_than_10(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin_pag_test@example.com',
            'password' => '12345678',
            'role' => 'admin',
            'status' => 'active',
        ]);

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-pag-test',
        ]);

        for ($i = 1; $i <= 15; $i++) {
            Product::create([
                'name' => "Product {$i}",
                'category_id' => $category->id,
                'created_by' => $admin->id,
            ]);
        }

        $response = $this->withHeaders(['Authorization' => 'Bearer admin-session-token'])
            ->getJson('/api/v1/admin/products');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Items retrieved successfully.', $data['message']);
        $this->assertArrayHasKey('meta', $data);
        $this->assertEquals(1, $data['meta']['currentPage']);
        $this->assertEquals(10, $data['meta']['limit']);
        $this->assertEquals(15, $data['meta']['totalResult']);
        $this->assertEquals(2, $data['meta']['totalPages']);
        $this->assertCount(10, $data['results']);
    }

    /**
     * Test API endpoint with 10 or fewer products has no meta key.
     */
    public function test_admin_products_endpoint_returns_unpaginated_format_when_10_or_fewer(): void
    {
        $admin = User::create([
            'name' => 'Admin User 2',
            'email' => 'admin_pag_test2@example.com',
            'password' => '12345678',
            'role' => 'admin',
            'status' => 'active',
        ]);

        $category = Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics-pag-test-2',
        ]);

        for ($i = 1; $i <= 5; $i++) {
            Product::create([
                'name' => "Product {$i}",
                'category_id' => $category->id,
                'created_by' => $admin->id,
            ]);
        }

        $response = $this->withHeaders(['Authorization' => 'Bearer admin-session-token'])
            ->getJson('/api/v1/admin/products');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertEquals(200, $data['statusCode']);
        $this->assertTrue($data['success']);
        $this->assertEquals('Operation completed successfully.', $data['message']);
        $this->assertArrayNotHasKey('meta', $data);
        $this->assertCount(5, $data['results']);
    }
}
