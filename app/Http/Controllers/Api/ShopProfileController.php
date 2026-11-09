<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopProfileController extends Controller
{
    use ApiResponse;

    /**
     * Get profile of the current shop owner's shop.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $shop = $user?->shops()->with('owner')->first();

        if (! $shop && $user?->isAdmin() && $request->query('shopId')) {
            $shop = Shop::with('owner')->find($request->query('shopId'));
        }

        if (! $shop) {
            $shop = Shop::with('owner')->first();
        }

        if (! $shop) {
            return $this->sendError('No shop found.', 404);
        }

        $shop->products_count = $shop->shopProducts()->count();
        $shop->active_products_count = $shop->shopProducts()->where('is_active', true)->count();

        return $this->sendResponse(
            new ShopResource($shop),
            'Shop profile retrieved successfully.'
        );
    }

    /**
     * Update current shop profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $shop = $user?->shops()->first();

        if (! $shop && $user?->isAdmin() && $request->query('shopId')) {
            $shop = Shop::find($request->query('shopId'));
        }

        if (! $shop) {
            $shop = Shop::first();
        }

        if (! $shop) {
            return $this->sendError('No shop found.', 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $shop->name = $validated['name'];
        }

        if (array_key_exists('description', $validated)) {
            $shop->description = $validated['description'];
        }

        if (array_key_exists('logo', $validated)) {
            $shop->logo = $validated['logo'];
        }

        $shop->save();

        return $this->sendResponse(
            new ShopResource($shop->load('owner')),
            'Shop profile updated successfully.'
        );
    }
}
