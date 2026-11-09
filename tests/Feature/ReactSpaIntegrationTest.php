<?php

namespace Tests\Feature;

use Tests\TestCase;

class ReactSpaIntegrationTest extends TestCase
{
    /**
     * Test root URL renders React SPA entry point.
     */
    public function test_root_renders_react_spa_entry_point(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('<div id="root"></div>', false);
        $content = $response->getContent();
        $hasViteScript = str_contains($content, 'assets/main-') || str_contains($content, 'resources/js/main.tsx');
        $this->assertTrue($hasViteScript, 'Expected React entry script in page output.');
    }

    /**
     * Test React Router client-side routes fallback to Blade view.
     */
    public function test_spa_routes_fallback_to_blade_view(): void
    {
        $routes = ['/auth/login', '/admin/dashboard', '/customer/dashboard'];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertStatus(200);
            $response->assertSee('<div id="root"></div>', false);
        }
    }

    /**
     * Test health check route returns JSON server status.
     */
    public function test_health_check_returns_json_status(): void
    {
        $response = $this->get('/health');

        $response->assertStatus(200);
        $response->assertJson([
            'statusCode' => 200,
            'success' => true,
        ]);
    }

    /**
     * Test API routes are preserved and routed correctly.
     */
    public function test_api_routes_are_preserved(): void
    {
        // Unauthenticated request to /me returns 401 JSON API response
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
        ]);
    }
}
