<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    use ApiResponse;

    /**
     * Map database role to human readable label.
     */
    protected function formatRole(string $role): string
    {
        return match ($role) {
            UserRole::Admin->value => 'Admin',
            UserRole::ShopOwner->value => 'Shop Owner',
            UserRole::Customer->value => 'Customer',
            default => ucfirst(str_replace('_', ' ', $role)),
        };
    }

    /**
     * Transform user model into response array.
     *
     * @return array<string, mixed>
     */
    protected function formatUser(User $user): array
    {
        return [
            'id' => (int) $user->id,
            'name' => (string) $user->name,
            'email' => (string) $user->email,
            'role' => (string) $user->role,
            'roleName' => $this->formatRole($user->role),
            'phoneNumber' => $user->phone_number ? (string) $user->phone_number : null,
            'status' => (string) ($user->status ?? 'active'),
            'joinedDate' => $user->created_at?->format('M d, Y'),
            'createdAt' => $user->created_at?->toISOString(),
            'updatedAt' => $user->updated_at?->toISOString(),
        ];
    }

    /**
     * List all platform users with search and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->query('search', $request->query('searchTerm'))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
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
            $transformed = array_map(fn ($user) => $this->formatUser($user), $paginator->items());

            return $this->sendPaginatedResponse(
                $paginator,
                'Users retrieved successfully.',
                200,
                $transformed
            );
        }

        $users = $query->latest('id')->get()->map(fn (User $user) => $this->formatUser($user));

        return $this->sendResponse($users, 'Users retrieved successfully.');
    }

    /**
     * Create/Invite a new user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,shop_owner,customer',
            'phoneNumber' => 'nullable|string|max:30',
            'phone_number' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:active,suspended,inactive',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone_number' => $validated['phoneNumber'] ?? ($validated['phone_number'] ?? null),
            'status' => $validated['status'] ?? 'active',
            'is_verified' => true,
            'is_deleted' => false,
            'is_profile_completed' => true,
            'email_verified_at' => now(),
        ]);

        return $this->sendResponse(
            $this->formatUser($user),
            'User created successfully.',
            201
        );
    }

    /**
     * Show a single user details.
     */
    public function show(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return $this->sendResponse(
            $this->formatUser($user),
            'User details retrieved successfully.'
        );
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$id,
            'role' => 'sometimes|required|string|in:admin,shop_owner,customer',
            'phoneNumber' => 'nullable|string|max:30',
            'phone_number' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:active,suspended,inactive',
            'password' => 'nullable|string|min:6',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = strtolower(trim($validated['email']));
        }

        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }

        if (array_key_exists('phoneNumber', $validated) || array_key_exists('phone_number', $validated)) {
            $user->phone_number = $validated['phoneNumber'] ?? ($validated['phone_number'] ?? null);
        }

        if (! empty($validated['status'])) {
            $user->status = $validated['status'];
        }

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return $this->sendResponse(
            $this->formatUser($user),
            'User updated successfully.'
        );
    }

    /**
     * Toggle active/suspended status for a user.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $newStatus = ($user->status === 'suspended') ? 'active' : 'suspended';
        $user->status = $newStatus;
        $user->save();

        return $this->sendResponse(
            $this->formatUser($user),
            "User account has been {$newStatus} successfully."
        );
    }

    /**
     * Delete a user.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($request->user()?->id === $user->id) {
            return $this->sendError('You cannot delete your own active administrator account.', 400);
        }

        $user->delete();

        return $this->sendResponse(null, 'User deleted successfully.');
    }
}
