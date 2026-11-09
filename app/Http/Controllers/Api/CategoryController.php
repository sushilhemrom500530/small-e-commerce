<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse;

    /**
     * List all categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::where('is_active', true)->withCount('products')->get()->map(function (Category $category) {
            return [
                'id' => (int) $category->id,
                'name' => (string) $category->name,
                'slug' => (string) $category->slug,
                'description' => $category->description ? (string) $category->description : null,
                'productsCount' => (int) ($category->products_count ?? 0),
            ];
        });

        return $this->sendResponse($categories, 'Categories retrieved successfully.');
    }

    /**
     * Store a category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        return $this->sendResponse([
            'id' => (int) $category->id,
            'name' => (string) $category->name,
            'slug' => (string) $category->slug,
            'description' => $category->description ? (string) $category->description : null,
        ], 'Category created successfully.', 201);
    }
}
