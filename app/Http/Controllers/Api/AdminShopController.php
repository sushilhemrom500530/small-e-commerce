<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminShopController extends Controller
{
    use ApiResponse;

    /**
     * List all shops with owner and product counts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Shop::with('owner')->withCount('shopProducts');

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhereHas('owner', function ($ownerQ) use ($search) {
                        $ownerQ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $shops = $query->latest('id')->get();

        return $this->sendResponse(
            ShopResource::collection($shops),
            'Shops retrieved successfully.'
        );
    }

    /**
     * Create a new shop.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:shops,slug',
            'ownerId' => 'nullable|exists:users,id',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $ownerId = $validated['ownerId'] ?? ($validated['owner_id'] ?? null);

        // Fallback: if owner not specified, assign to current user or first shop_owner
        if (! $ownerId) {
            $owner = User::where('role', 'shop_owner')->first() ?? $request->user();
            $ownerId = $owner->id;
        }

        $slug = ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        // Ensure unique slug
        $baseSlug = $slug;
        $counter = 1;
        while (Shop::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $shop = Shop::create([
            'owner_id' => $ownerId,
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        return $this->sendResponse(
            new ShopResource($shop->load('owner')),
            'Shop created successfully.',
            201
        );
    }

    /**
     * Show single shop details.
     */
    public function show(Shop $shop): JsonResponse
    {
        return $this->sendResponse(
            new ShopResource($shop->load('owner')),
            'Shop details retrieved successfully.'
        );
    }

    /**
     * Update an existing shop.
     */
    public function update(Request $request, Shop $shop): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => "sometimes|nullable|string|max:255|unique:shops,slug,{$shop->id}",
            'ownerId' => 'sometimes|nullable|exists:users,id',
            'owner_id' => 'sometimes|nullable|exists:users,id',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        if (isset($validated['name'])) {
            $shop->name = $validated['name'];
        }

        if (! empty($validated['slug'])) {
            $shop->slug = Str::slug($validated['slug']);
        }

        if (isset($validated['ownerId']) || isset($validated['owner_id'])) {
            $shop->owner_id = $validated['ownerId'] ?? $validated['owner_id'];
        }

        if (array_key_exists('description', $validated)) {
            $shop->description = $validated['description'];
        }

        if (array_key_exists('logo', $validated)) {
            $shop->logo = $validated['logo'];
        }

        if (! empty($validated['status'])) {
            $shop->status = $validated['status'];
        }

        $shop->save();

        return $this->sendResponse(
            new ShopResource($shop->load('owner')),
            'Shop updated successfully.'
        );
    }

    /**
     * Delete a shop.
     */
    public function destroy(Shop $shop): JsonResponse
    {
        $shop->delete();

        return $this->sendResponse(null, 'Shop deleted successfully.');
    }
}

