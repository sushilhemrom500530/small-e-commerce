<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopProductResource;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopProductController extends Controller
{
    use ApiResponse;

    /**
     * Resolve the active shop for the authenticated user.
     */
    protected function resolveShop(Request $request): ?Shop
    {
        $user = $request->user();

        $shop = $user?->shops()->first();

        if (! $shop && $user?->isAdmin() && $request->query('shopId')) {
            $shop = Shop::find($request->query('shopId'));
        }

        if (! $shop) {
            $shop = Shop::first();
        }

        return $shop;
    }

    /**
     * List all products assigned to the authenticated user's shop.
     */
    public function index(Request $request): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendResponse([], 'No shop found for this account.');
        }

        $query = ShopProduct::where('shop_id', $shop->id)
            ->with(['product.category', 'shop']);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('categoryId', $request->query('category_id'))) {
            $query->whereHas('product', function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        $shopProducts = $query->latest('id')->get();

        return $this->sendResponse(
            ShopProductResource::collection($shopProducts),
            'Shop products retrieved successfully.'
        );
    }

    /**
     * Shop owner creates their own product:
     * 1. Saves to global `products` shared catalog.
     * 2. Automatically creates a listing in `shop_products` for this shop.
     */
    public function store(Request $request): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('You must have a registered shop to create products.', 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'categoryId' => 'nullable|exists:categories,id',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'details' => 'nullable|string',
        ]);

        // 1. Create in Shared Catalog
        $product = Product::create([
            'category_id' => $validated['categoryId'] ?? ($validated['category_id'] ?? null),
            'created_by' => $request->user()?->id ?? $shop->owner_id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
        ]);

        // 2. Add to Shop's listing
        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'price' => $validated['price'],
            'details' => $validated['details'] ?? $validated['description'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'is_active' => true,
        ]);

        return $this->sendResponse(
            new ShopProductResource($shopProduct->load(['product.category', 'shop'])),
            'Product created and listed in your shop successfully.',
            201
        );
    }

    /**
     * Show a single shop product listing.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('Shop not found.', 404);
        }

        $shopProduct = ShopProduct::where('shop_id', $shop->id)
            ->where('id', $id)
            ->with(['product.category', 'shop'])
            ->firstOrFail();

        return $this->sendResponse(
            new ShopProductResource($shopProduct),
            'Product details retrieved successfully.'
        );
    }

    /**
     * Modify product price, details, and thumbnail for own shop.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('Shop not found.', 404);
        }

        $shopProduct = ShopProduct::where('shop_id', $shop->id)
            ->where('id', $id)
            ->with(['product.category', 'shop'])
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'details' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'isActive' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'categoryId' => 'sometimes|nullable|exists:categories,id',
            'category_id' => 'sometimes|nullable|exists:categories,id',
        ]);

        if (! empty($validated['name']) && $shopProduct->product) {
            $shopProduct->product->update(['name' => $validated['name']]);
        }

        if ((array_key_exists('categoryId', $validated) || array_key_exists('category_id', $validated)) && $shopProduct->product) {
            $catId = $validated['categoryId'] ?? $validated['category_id'];
            $shopProduct->product->update(['category_id' => $catId]);
        }

        if (array_key_exists('price', $validated)) {
            $shopProduct->price = $validated['price'];
        }

        if (array_key_exists('details', $validated)) {
            $shopProduct->details = $validated['details'];
        }

        if (array_key_exists('thumbnail', $validated)) {
            $shopProduct->thumbnail = $validated['thumbnail'];
        }

        if (array_key_exists('isActive', $validated) || array_key_exists('is_active', $validated)) {
            $shopProduct->is_active = $validated['isActive'] ?? $validated['is_active'];
        }

        $shopProduct->save();

        return $this->sendResponse(
            new ShopProductResource($shopProduct->fresh(['product.category', 'shop'])),
            'Shop product listing updated successfully.'
        );
    }

    /**
     * Remove product from shop listing (remains in shared catalog).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('Shop not found.', 404);
        }

        $shopProduct = ShopProduct::where('shop_id', $shop->id)
            ->where('id', $id)
            ->firstOrFail();

        $shopProduct->delete();

        return $this->sendResponse(null, 'Product removed from your shop successfully.');
    }
}
