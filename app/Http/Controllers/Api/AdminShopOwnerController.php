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
}

