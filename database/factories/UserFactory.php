<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password123'),
            'role' => UserRole::Customer->value,
            'phone_number' => fake()->phoneNumber(),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'address' => fake()->address(),
            'profile_url' => 'https://iter-bene.s3.eu-north-1.amazonaws.com/uploads/users/ea97d957-1bf9-4e4a-b84c-f00525e0cca3.webp',
            'status' => 'active',
            'is_verified' => true,
            'is_deleted' => false,
            'is_profile_completed' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin->value,
        ]);
    }

    public function shopOwner(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::ShopOwner->value,
            'service_name' => fake()->company(),
            'service_lisence' => Str::upper(Str::random(10)),
        ]);
    }

    public function customer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Customer->value,
        ]);
    }

    /**
     * Backwards-compatible factory aliases.
     */
    public function provider(): static
    {
        return $this->shopOwner();
    }

    public function client(): static
    {
        return $this->customer();
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
            'is_verified' => false,
            'status' => 'pending',
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }

    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'deleted',
            'is_deleted' => true,
        ]);
    }
}
