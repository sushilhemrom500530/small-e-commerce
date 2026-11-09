<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo data matching technical assessment specifications.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        // 1. Seed System Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Administrator',
                'password' => $defaultPassword,
                'role' => UserRole::Admin->value,
                'phone_number' => '+8801700000001',
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Shop Owners
        $techOwner = User::updateOrCreate(
            ['email' => 'tech_owner@example.com'],
            [
                'name' => 'John Tech',
                'password' => $defaultPassword,
                'role' => UserRole::ShopOwner->value,
                'phone_number' => '+8801700000002',
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => true,
                'email_verified_at' => now(),
            ]
        );

        $fashionOwner = User::updateOrCreate(
            ['email' => 'fashion_owner@example.com'],
            [
                'name' => 'Sarah Fashion',
                'password' => $defaultPassword,
                'role' => UserRole::ShopOwner->value,
                'phone_number' => '+8801700000003',
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => true,
                'email_verified_at' => now(),
            ]
        );

        // 3. Seed Demo Customer
        User::updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Alice Customer',
                'password' => $defaultPassword,
                'role' => UserRole::Customer->value,
                'phone_number' => '+8801700000004',
                'status' => 'active',
                'is_verified' => true,
                'is_deleted' => false,
                'is_profile_completed' => true,
                'email_verified_at' => now(),
            ]
        );

        // 4. Seed Shops
        $techShop = Shop::updateOrCreate(
            ['slug' => 'tech-world'],
            [
                'owner_id' => $techOwner->id,
                'name' => 'Tech World',
                'description' => 'Your premier electronics, smartphones, and innovative computer gadgets hub.',
                'logo' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=80',
                'status' => 'active',
            ]
        );

        $fashionShop = Shop::updateOrCreate(
            ['slug' => 'fashion-hub'],
            [
                'owner_id' => $fashionOwner->id,
                'name' => 'Fashion Hub',
                'description' => 'Trendy modern apparel, urban accessories, and curated lifestyle collections.',
                'logo' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80',
                'status' => 'active',
            ]
        );

        // 5. Seed Categories
        $categoriesData = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Gadgets, phones, audio, and computing gear.'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Clothing, jackets, bags, and urban footwear.'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'description' => 'Smart appliances, decor, and comfort items.'],
            ['name' => 'Sports & Fitness', 'slug' => 'sports', 'description' => 'Fitness monitors, gear, and athletics.'],
            ['name' => 'Beauty & Care', 'slug' => 'beauty', 'description' => 'Skincare and personal wellness products.'],
        ];

        $categories = [];
        foreach ($categoriesData as $cData) {
            $categories[$cData['slug']] = Category::updateOrCreate(
                ['slug' => $cData['slug']],
                ['name' => $cData['name'], 'description' => $cData['description'], 'is_active' => true]
            );
        }

        // 6. Seed Shared Product Catalog (Products created by Admin & Shop Owners)
        $catalogProducts = [
            [
                'name' => 'Samsung Galaxy A56',
                'category_slug' => 'electronics',
                'created_by' => $admin->id,
                'description' => 'Official Samsung Galaxy A56 5G with Super AMOLED 120Hz display, 8GB RAM, and 50MP triple OIS camera.',
                'thumbnail' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Apple MacBook Pro 14"',
                'category_slug' => 'electronics',
                'created_by' => $admin->id,
                'description' => 'Apple M3 Pro chip, 18GB unified memory, Liquid Retina XDR display, and 18-hour battery life.',
                'thumbnail' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'category_slug' => 'electronics',
                'created_by' => $techOwner->id,
                'description' => 'Industry-leading noise canceling wireless headphones with two processors and 8 microphones.',
                'thumbnail' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Smart Fitness Watch Ultra',
                'category_slug' => 'sports',
                'created_by' => $techOwner->id,
                'description' => 'Rugged titanium GPS smartwatch with ECG, SpO2 sensor, water resistance up to 50m, and sapphire crystal.',
                'thumbnail' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Minimalist Urban Backpack',
                'category_slug' => 'fashion',
                'created_by' => $admin->id,
                'description' => 'Waterproof 20L city backpack with padded 15.6" laptop compartment, hidden anti-theft pocket, and USB port.',
                'thumbnail' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Classic Slim-Fit Denim Jacket',
                'category_slug' => 'fashion',
                'created_by' => $fashionOwner->id,
                'description' => 'Premium washed 100% cotton denim jacket with antique brass buttons and reinforced stitching.',
                'thumbnail' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Mechanical Gaming Keyboard RGB',
                'category_slug' => 'electronics',
                'created_by' => $techOwner->id,
                'description' => 'Hot-swappable mechanical switches, per-key RGB backlighting, durable PBT keycaps, and aircraft-grade aluminum frame.',
                'thumbnail' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Breathable Running Sneakers',
                'category_slug' => 'sports',
                'created_by' => $fashionOwner->id,
                'description' => 'Lightweight engineered mesh running shoes with responsive foam cushioning and high-grip rubber outsole.',
                'thumbnail' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
            ],
            [
                'name' => 'Stainless Steel Smart Thermos',
                'category_slug' => 'home-living',
                'created_by' => $admin->id,
                'description' => 'Double-wall vacuum insulated flask with touch LED temperature display. Keeps drinks hot for 12h or cold for 24h.',
                'thumbnail' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
            ],
        ];

        $products = [];
        foreach ($catalogProducts as $pData) {
            $cat = $categories[$pData['category_slug']] ?? null;
            $products[$pData['name']] = Product::updateOrCreate(
                ['name' => $pData['name']],
                [
                    'category_id' => $cat?->id,
                    'created_by' => $pData['created_by'],
                    'description' => $pData['description'],
                    'thumbnail' => $pData['thumbnail'],
                ]
            );
        }

        // 7. Seed Shop-Specific Listings (Demonstrating Shared Catalog logic!)
        // Product 1: Samsung Galaxy A56 (Listed in BOTH Tech World & Fashion Hub with different prices & thumbnails)
        $samsung = $products['Samsung Galaxy A56'];
        ShopProduct::updateOrCreate(
            ['shop_id' => $techShop->id, 'product_id' => $samsung->id],
            [
                'price' => 45000.00,
                'details' => 'Tech World Exclusive Deal: Free 25W Fast Charger & 1-Year Official Warranty included.',
                'thumbnail' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        ShopProduct::updateOrCreate(
            ['shop_id' => $fashionShop->id, 'product_id' => $samsung->id],
            [
                'price' => 46500.00,
                'details' => 'Fashion Hub Edition: Bundled with an aesthetic designer leather back case.',
                'thumbnail' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        // Product 2: Minimalist Urban Backpack (Listed in BOTH shops with different prices & details)
        $backpack = $products['Minimalist Urban Backpack'];
        ShopProduct::updateOrCreate(
            ['shop_id' => $techShop->id, 'product_id' => $backpack->id],
            [
                'price' => 4200.00,
                'details' => 'Tech Commuter Special: Fits up to 16" gaming laptops with cable organizer pouch.',
                'thumbnail' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        ShopProduct::updateOrCreate(
            ['shop_id' => $fashionShop->id, 'product_id' => $backpack->id],
            [
                'price' => 3900.00,
                'details' => 'Seasonal Streetwear Collection: Sleek monochrome aesthetic with matte hardware.',
                'thumbnail' => 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
                'is_active' => true,
            ]
        );

        // Products for Tech World only
        ShopProduct::updateOrCreate(
            ['shop_id' => $techShop->id, 'product_id' => $products['Apple MacBook Pro 14"']->id],
            ['price' => 245000.00, 'details' => 'Space Black finish, Brand new in box with Apple Bangladesh warranty.', 'is_active' => true]
        );
        ShopProduct::updateOrCreate(
            ['shop_id' => $techShop->id, 'product_id' => $products['Sony WH-1000XM5 Headphones']->id],
            ['price' => 38500.00, 'details' => 'Includes premium hard carrying case and gold-plated airplane adapter.', 'is_active' => true]
        );
        ShopProduct::updateOrCreate(
            ['shop_id' => $techShop->id, 'product_id' => $products['Mechanical Gaming Keyboard RGB']->id],
            ['price' => 8500.00, 'details' => 'Custom lubricated red switches, noise-dampening foam pre-installed.', 'is_active' => true]
        );

        // Products for Fashion Hub only
        ShopProduct::updateOrCreate(
            ['shop_id' => $fashionShop->id, 'product_id' => $products['Classic Slim-Fit Denim Jacket']->id],
            ['price' => 5500.00, 'details' => 'Available in sizes S, M, L, XL. Handcrafted vintage wash finish.', 'is_active' => true]
        );
        ShopProduct::updateOrCreate(
            ['shop_id' => $fashionShop->id, 'product_id' => $products['Breathable Running Sneakers']->id],
            ['price' => 6200.00, 'details' => 'Ultra-cushioned sole for all-day comfort. Available in sizes 40-45 EU.', 'is_active' => true]
        );

        // NOTE: "Stainless Steel Smart Thermos" is deliberately NOT assigned to any shop!
        // This validates requirement: "Products that are not assigned to any shop must not be visible to customers."
    }
}
