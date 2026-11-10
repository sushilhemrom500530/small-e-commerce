<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    use ApiResponse;

    /**
     * List all products in the shared catalog.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'creator', 'shopProducts']);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('categoryId', $request->query('category_id'))) {
            $query->where('category_id', $categoryId);
        }

        $limit = (int) $request->query('limit', $request->query('perPage', 10));
        $page = (int) $request->query('page', $request->query('currentPage', 1));
        if ($limit <= 0) {
            $limit = 10;
        }
        if ($page <= 0) {
            $page = 1;
        }

        $total = $query->count();
        if ($total > 10) {
            $paginator = $query->latest('id')->paginate($limit, ['*'], 'page', $page);

            return $this->sendPaginatedResponse(
                $paginator,
                'Items retrieved successfully.',
                200,
                ProductResource::collection($paginator->items())
            );
        }

        $products = $query->latest('id')->get();

        return $this->sendResponse(
            ProductResource::collection($products),
            'Operation completed successfully.'
        );
    }

    /**
     * Create a new product into the shared catalog.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'categoryId' => 'nullable|exists:categories,id',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'details' => 'nullable|string',
        ]);

        $product = Product::create([
            'category_id' => $validated['categoryId'] ?? ($validated['category_id'] ?? null),
            'created_by' => $request->user()?->id ?? 1,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
        ]);

        if (isset($validated['price'])) {
            $user = $request->user();
            $shop = $user?->shops()->first() ?? Shop::first();
            if ($shop) {
                ShopProduct::firstOrCreate(
                    [
                        'shop_id' => $shop->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'price' => $validated['price'],
                        'details' => $validated['details'] ?? $validated['description'] ?? null,
                        'thumbnail' => $validated['thumbnail'] ?? null,
                        'is_active' => true,
                    ]
                );
            }
        }

        return $this->sendResponse(
            new ProductResource($product->load(['category', 'creator', 'shopProducts'])),
            'Product added to shared catalog successfully.',
            201
        );
    }

    /**
     * Show single product details.
     */
    public function show(Product $product): JsonResponse
    {
        return $this->sendResponse(
            new ProductResource($product->load(['category', 'creator', 'shopProducts'])),
            'Product details retrieved successfully.'
        );
    }

    /**
     * Update an existing product in the shared catalog.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'categoryId' => 'sometimes|nullable|exists:categories,id',
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'details' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $product->name = $validated['name'];
        }

        if (array_key_exists('categoryId', $validated) || array_key_exists('category_id', $validated)) {
            $product->category_id = $validated['categoryId'] ?? $validated['category_id'];
        }

        if (array_key_exists('description', $validated)) {
            $product->description = $validated['description'];
        }

        if (array_key_exists('thumbnail', $validated)) {
            $product->thumbnail = $validated['thumbnail'];
        }

        $product->save();

        if (isset($validated['price'])) {
            $user = $request->user();
            $shop = $user?->shops()->first() ?? Shop::first();
            if ($shop) {
                ShopProduct::updateOrCreate(
                    [
                        'shop_id' => $shop->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'price' => $validated['price'],
                        'details' => $validated['details'] ?? $validated['description'] ?? null,
                        'thumbnail' => $validated['thumbnail'] ?? $product->thumbnail,
                        'is_active' => true,
                    ]
                );
            }
        }

        return $this->sendResponse(
            new ProductResource($product->load(['category', 'creator', 'shopProducts'])),
            'Product updated successfully.'
        );
    }

    /**
     * Delete a product from the shared catalog.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return $this->sendResponse(null, 'Product removed from catalog successfully.');
    }
}
