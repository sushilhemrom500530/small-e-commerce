<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopProductResource;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    use ApiResponse;

    /**
     * Public list of all active shops.
     */
    public function shops(Request $request): JsonResponse
    {
        $query = Shop::where('status', 'active')
            ->withCount(['shopProducts' => function ($q) {
                $q->where('is_active', true);
            }]);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where('name', 'like', "%{$search}%");
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
                ShopResource::collection($paginator->items())
            );
        }

        $shops = $query->latest('id')->get();

        return $this->sendResponse(
            ShopResource::collection($shops),
            'Operation completed successfully.'
        );
    }

    /**
     * Get specific shop metadata by slug.
     */
    public function shop(string $slug): JsonResponse
    {
        $shop = Shop::where('slug', $slug)
            ->where('status', 'active')
            ->withCount(['shopProducts' => function ($q) {
                $q->where('is_active', true);
            }])
            ->firstOrFail();

        return $this->sendResponse(
            new ShopResource($shop),
            'Shop details retrieved successfully.'
        );
    }

    /**
     * Customer View: List ONLY products assigned to this shop with shop-specific price and thumbnail.
     * Unassigned products in the shared catalog are strictly excluded.
     */
    public function products(Request $request, string $slug): JsonResponse
    {
        $shop = Shop::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $query = ShopProduct::where('shop_id', $shop->id)
            ->where('is_active', true)
            ->with(['product.category', 'shop']);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categorySlug = $request->query('category')) {
            $query->whereHas('product.category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
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
                ShopProductResource::collection($paginator->items())
            );
        }

        $products = $query->latest('id')->get();

        return $this->sendResponse(
            ShopProductResource::collection($products),
            'Operation completed successfully.'
        );
    }

    /**
     * Customer View: Single product detail in the context of this shop.
     */
    public function product(string $slug, int|string $productIdentifier): JsonResponse
    {
        $shop = Shop::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        $query = ShopProduct::where('shop_id', $shop->id)
            ->where('is_active', true)
            ->with(['product.category', 'shop']);

        if (is_numeric($productIdentifier)) {
            $query->where(function ($q) use ($productIdentifier) {
                $q->where('id', $productIdentifier)
                    ->orWhere('product_id', $productIdentifier);
            });
        } else {
            $query->whereHas('product', function ($q) use ($productIdentifier) {
                $q->where('name', 'like', "%{$productIdentifier}%");
            });
        }

        $shopProduct = $query->firstOrFail();

        return $this->sendResponse(
            new ShopProductResource($shopProduct),
            'Product details retrieved successfully.'
        );
    }
}
