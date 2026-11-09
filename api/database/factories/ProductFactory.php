<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);
        $newPrice = fake()->randomFloat(2, 50, 2000);
        $oldPrice = fake()->boolean(70) ? $newPrice + fake()->randomFloat(2, 10, 500) : null;

        return [
            'category_id' => Category::factory(),
            'subcategory_id' => function (array $attributes) {
                return Subcategory::factory()->create(['category_id' => $attributes['category_id']])->id;
            },
            'name' => ucfirst($name),
            'slug' => fn (array $attributes) => Str::slug($attributes['name']),
            'description' => fake()->paragraph(),
            'image' => null,
            'old_price' => $oldPrice,
            'new_price' => $newPrice,
            'stock' => fake()->numberBetween(5, 100),
            'is_active' => true,
        ];
    }
}
