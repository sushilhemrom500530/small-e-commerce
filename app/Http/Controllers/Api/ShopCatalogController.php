<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ShopProductResource;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopCatalogController extends Controller
{
    use ApiResponse;

    /**
     * Helper to resolve the authenticated user's active shop.
     */
    protected function resolveShop(Request $request): ?Shop
    {
        $user = $request->user();

        // 1. Check direct shop relationship
        $shop = $user?->shops()->first();

        // 2. If admin testing as shop owner, allow passing ?shopId=X or pick first
        if (! $shop && $user?->isAdmin() && $request->query('shopId')) {
            $shop = Shop::find($request->query('shopId'));
        }

        if (! $shop) {
            $shop = Shop::first();
        }

        return $shop;
    }

    /**
     * Browse the shared product catalog with indicators of what is already in this shop.
     */
    public function index(Request $request): JsonResponse
    {
        $shop = $this->resolveShop($request);
        $addedProductIds = $shop ? $shop->shopProducts()->pluck('product_id')->all() : [];

        $query = Product::with(['category', 'creator']);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('categoryId', $request->query('category_id'))) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->latest('id')->get()->map(function (Product $product) use ($addedProductIds) {
            $product->is_added = in_array($product->id, $addedProductIds, true);

            return $product;
        });

        return $this->sendResponse(
            ProductResource::collection($products),
            'Shared catalog retrieved successfully.'
        );
    }

    /**
     * Add a product from the shared catalog into the authenticated owner's shop.
     */
    public function addToShop(Request $request, int $productId): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('You must have a registered shop to add products.', 400);
        }

        $product = Product::findOrFail($productId);

        // Check if already in shop
        $existing = ShopProduct::where('shop_id', $shop->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            return $this->sendResponse(
                new ShopProductResource($existing->load(['product.category', 'shop'])),
                'Product is already in your shop.'
            );
        }

        $validated = $request->validate([
            'price' => 'nullable|numeric|min:0',
            'details' => 'nullable|string',
            'thumbnail' => 'nullable|string',
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'price' => $validated['price'] ?? 0.00,
            'details' => $validated['details'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'is_active' => true,
        ]);

        return $this->sendResponse(
            new ShopProductResource($shopProduct->load(['product.category', 'shop'])),
            "{$product->name} has been added to your shop successfully.",
            201
        );
    }
}
