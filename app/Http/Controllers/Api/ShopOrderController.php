<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Shop;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopOrderController extends Controller
{
    use ApiResponse;

    /**
     * Resolve the shop for the authenticated shop owner.
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
     * GET /api/v1/shop/orders
     * List all orders for the authenticated shop owner's shop.
     */
    public function index(Request $request): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendResponse([], 'No shop found for this account.');
        }

        $query = Order::where('shop_id', $shop->id);

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search): void {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', ucfirst(strtolower($status)));
        }

        $orders = $query->orderBy('id', 'desc')->get();

        return $this->sendResponse(
            OrderResource::collection($orders),
            'Shop orders retrieved successfully.'
        );
    }

    /**
     * GET /api/v1/shop/orders/{id}
     * Get single order details.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('Shop not found.', 404);
        }

        $order = Order::where('shop_id', $shop->id)
            ->where('id', $id)
            ->firstOrFail();

        return $this->sendResponse(
            new OrderResource($order),
            'Order details retrieved successfully.'
        );
    }

    /**
     * PATCH /api/v1/shop/orders/{id}/status
     * Update order status (e.g. Delivered).
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $shop = $this->resolveShop($request);
        if (! $shop) {
            return $this->sendError('Shop not found.', 404);
        }

        $order = Order::where('shop_id', $shop->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Processing,Delivered,Cancelled,pending,processing,delivered,cancelled',
        ]);

        $normalizedStatus = ucfirst(strtolower($validated['status']));
        $order->status = $normalizedStatus;

        if ($normalizedStatus === 'Delivered') {
            $order->delivered_at = now();
        }

        $order->save();

        return $this->sendResponse(
            new OrderResource($order),
            "Order {$order->order_number} marked as {$normalizedStatus} successfully."
        );
    }
}
