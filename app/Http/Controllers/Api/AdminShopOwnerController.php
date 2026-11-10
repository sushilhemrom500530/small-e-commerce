<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminShopOwnerController extends Controller
{
    use ApiResponse;

    /**
     * List all shop owners.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', UserRole::ShopOwner->value)->with('shops');

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $owners = $query->latest('id')->get()->map(function (User $user) {
            $primaryShop = $user->shops->first();

            return [
                'id' => (int) $user->id,
                'name' => (string) $user->name,
                'email' => (string) $user->email,
                'phoneNumber' => $user->phone_number ? (string) $user->phone_number : null,
                'status' => (string) ($user->status ?? 'active'),
                'shopName' => $primaryShop ? (string) $primaryShop->name : 'No Shop Assigned',
                'shopId' => $primaryShop ? (int) $primaryShop->id : null,
                'shopSlug' => $primaryShop ? (string) $primaryShop->slug : null,
                'joinedDate' => $user->created_at?->format('M d, Y'),
                'createdAt' => $user->created_at?->toISOString(),
            ];
        });

        return $this->sendResponse($owners, 'Shop owners retrieved successfully.');
    }

    /**
     * Create a new shop owner account.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'phoneNumber' => 'nullable|string|max:30',
            'phone_number' => 'nullable|string|max:30',
            'shopName' => 'nullable|string|max:255',
        ]);

        $owner = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'role' => UserRole::ShopOwner->value,
            'phone_number' => $validated['phoneNumber'] ?? ($validated['phone_number'] ?? null),
            'status' => 'active',
            'is_verified' => true,
            'is_deleted' => false,
            'is_profile_completed' => true,
            'email_verified_at' => now(),
        ]);

        // Auto-create shop if shopName provided
        if (! empty($validated['shopName'])) {
            Shop::create([
                'owner_id' => $owner->id,
                'name' => $validated['shopName'],
                'status' => 'active',
            ]);
        }

        $primaryShop = $owner->shops()->first();

        return $this->sendResponse([
            'id' => (int) $owner->id,
            'name' => (string) $owner->name,
            'email' => (string) $owner->email,
            'phoneNumber' => $owner->phone_number ? (string) $owner->phone_number : null,
            'status' => (string) $owner->status,
            'shopName' => $primaryShop ? (string) $primaryShop->name : null,
            'shopId' => $primaryShop ? (int) $primaryShop->id : null,
        ], 'Shop owner account created successfully.', 201);
    }

    /**
     * Show single shop owner details.
     */
    public function show(int $id): JsonResponse
    {
        $owner = User::where('role', UserRole::ShopOwner->value)
            ->with('shops')
            ->findOrFail($id);

        $primaryShop = $owner->shops->first();

        return $this->sendResponse([
            'id' => (int) $owner->id,
            'name' => (string) $owner->name,
            'email' => (string) $owner->email,
            'phoneNumber' => $owner->phone_number ? (string) $owner->phone_number : null,
            'status' => (string) ($owner->status ?? 'active'),
            'shopName' => $primaryShop ? (string) $primaryShop->name : 'No Shop Assigned',
            'shopId' => $primaryShop ? (int) $primaryShop->id : null,
            'shopSlug' => $primaryShop ? (string) $primaryShop->slug : null,
            'joinedDate' => $owner->created_at?->format('M d, Y'),
            'createdAt' => $owner->created_at?->toISOString(),
        ], 'Shop owner retrieved successfully.');
    }

    /**
     * Update an existing shop owner.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $owner = User::where('role', UserRole::ShopOwner->value)
            ->with('shops')
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$id,
            'phoneNumber' => 'nullable|string|max:30',
            'phone_number' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:active,suspended,inactive,pending',
            'shopName' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        if (isset($validated['name'])) {
            $owner->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $owner->email = strtolower(trim($validated['email']));
        }

        if (array_key_exists('phoneNumber', $validated) || array_key_exists('phone_number', $validated)) {
            $owner->phone_number = $validated['phoneNumber'] ?? ($validated['phone_number'] ?? null);
        }

        if (! empty($validated['status'])) {
            $owner->status = $validated['status'];
        }

        if (! empty($validated['password'])) {
            $owner->password = Hash::make($validated['password']);
        }

        $owner->save();

        if (array_key_exists('shopName', $validated) && ! empty($validated['shopName'])) {
            $primaryShop = $owner->shops()->first();
            if ($primaryShop) {
                $primaryShop->name = $validated['shopName'];
                $primaryShop->save();
            } else {
                Shop::create([
                    'owner_id' => $owner->id,
                    'name' => $validated['shopName'],
                    'status' => 'active',
                ]);
            }
        }

        $primaryShop = $owner->shops()->first();

        return $this->sendResponse([
            'id' => (int) $owner->id,
            'name' => (string) $owner->name,
            'email' => (string) $owner->email,
            'phoneNumber' => $owner->phone_number ? (string) $owner->phone_number : null,
            'status' => (string) ($owner->status ?? 'active'),
            'shopName' => $primaryShop ? (string) $primaryShop->name : 'No Shop Assigned',
            'shopId' => $primaryShop ? (int) $primaryShop->id : null,
            'shopSlug' => $primaryShop ? (string) $primaryShop->slug : null,
            'joinedDate' => $owner->created_at?->format('M d, Y'),
            'createdAt' => $owner->created_at?->toISOString(),
        ], 'Shop owner updated successfully.');
    }

    /**
     * Toggle active/suspended status for a shop owner.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $owner = User::where('role', UserRole::ShopOwner->value)
            ->with('shops')
            ->findOrFail($id);

        $newStatus = ($owner->status === 'suspended') ? 'active' : 'suspended';
        $owner->status = $newStatus;
        $owner->save();

        // Also update their shops' status
        foreach ($owner->shops as $shop) {
            $shop->status = ($newStatus === 'active') ? 'active' : 'inactive';
            $shop->save();
        }

        $primaryShop = $owner->shops()->first();

        return $this->sendResponse([
            'id' => (int) $owner->id,
            'name' => (string) $owner->name,
            'email' => (string) $owner->email,
            'phoneNumber' => $owner->phone_number ? (string) $owner->phone_number : null,
            'status' => (string) $owner->status,
            'shopName' => $primaryShop ? (string) $primaryShop->name : 'No Shop Assigned',
            'shopId' => $primaryShop ? (int) $primaryShop->id : null,
            'shopSlug' => $primaryShop ? (string) $primaryShop->slug : null,
            'joinedDate' => $owner->created_at?->format('M d, Y'),
            'createdAt' => $owner->created_at?->toISOString(),
        ], "Shop owner account has been {$newStatus} successfully.");
    }

    /**
     * Delete a shop owner account.
     */
    public function destroy(int $id): JsonResponse
    {
        $owner = User::where('role', UserRole::ShopOwner->value)->findOrFail($id);
        $owner->delete();

        return $this->sendResponse(null, 'Shop owner account deleted successfully.');
    }
}
