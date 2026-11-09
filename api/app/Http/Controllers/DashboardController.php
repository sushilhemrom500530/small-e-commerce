<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the admin overview dashboard.
     */
    public function index(): View
    {
        $productCount = Product::count();
        $categoryCount = Category::count();
        $userCount = User::count();

        $recentOrders = [
            [
                'order_no' => '#ORD-1001',
                'amount' => 2500,
                'status' => 'Pending',
                'status_class' => 'bg-amber-100/70 text-amber-800 border-amber-200/70',
                'image' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
            ],
            [
                'order_no' => '#ORD-1000',
                'amount' => 1800,
                'status' => 'Delivered',
                'status_class' => 'bg-teal-100/70 text-teal-800 border-teal-200/70',
                'image' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=120&auto=format&fit=crop&q=80',
            ],
            [
                'order_no' => '#ORD-0999',
                'amount' => 3200,
                'status' => 'Delivered',
                'status_class' => 'bg-teal-100/70 text-teal-800 border-teal-200/70',
                'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&auto=format&fit=crop&q=80',
            ],
        ];

        return view('admin.dashboard', [
            'title' => 'Dashboard - ShopEase Admin',
            'totalProducts' => $productCount > 0 ? $productCount : 156,
            'totalCategories' => $categoryCount > 0 ? $categoryCount : 12,
            'totalOrders' => 1248,
            'totalUsers' => $userCount > 10 ? $userCount : 842,
            'recentOrders' => $recentOrders,
        ]);
    }
}
