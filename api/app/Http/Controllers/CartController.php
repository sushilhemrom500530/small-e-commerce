<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CartController extends Controller
{
    /**
     * Display the shopping cart page.
     */
    public function index(Request $request): View
    {
        $cart = session()->get('cart', []);

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += ($item['price'] * $item['quantity']);
        }

        $shipping = $subtotal > 0 ? ($subtotal >= 2000 ? 0 : 60) : 0;
        $total = $subtotal + $shipping;

        return view('storefront.cart', compact('cart', 'subtotal', 'shipping', 'total'));
    }

    /**
     * Add product to cart.
     */
    public function add(Request $request): JsonResponse|RedirectResponse
    {
        $productId = (int) $request->input('product_id');
        $quantity = max(1, (int) $request->input('quantity', 1));

        $product = Product::findOrFail($productId);

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->new_price,
                'image' => $product->image_url,
                'quantity' => $quantity,
            ];
        }

        session()->put('cart', $cart);

        $totalCount = array_sum(array_column($cart, 'quantity'));

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "{$product->name} added to cart!",
                'cart' => $cart,
                'total_count' => $totalCount,
            ]);
        }

        return redirect()->route('cart.index')->with('success', "{$product->name} added to cart!");
    }

    /**
     * Update product quantity in cart.
     */
    public function update(Request $request): JsonResponse|RedirectResponse
    {
        $productId = (int) $request->input('product_id');
        $quantity = (int) $request->input('quantity', 1);

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            if ($quantity > 0) {
                $cart[$productId]['quantity'] = $quantity;
            } else {
                unset($cart[$productId]);
            }
            session()->put('cart', $cart);
        }

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += ($item['price'] * $item['quantity']);
        }
        $shipping = $subtotal > 0 ? ($subtotal >= 2000 ? 0 : 60) : 0;
        $total = $subtotal + $shipping;
        $totalCount = array_sum(array_column($cart, 'quantity'));

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'cart' => $cart,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'total_count' => $totalCount,
            ]);
        }

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove product from cart.
     */
    public function remove(Request $request): JsonResponse|RedirectResponse
    {
        $productId = (int) $request->input('product_id');
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
        }

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += ($item['price'] * $item['quantity']);
        }
        $shipping = $subtotal > 0 ? ($subtotal >= 2000 ? 0 : 60) : 0;
        $total = $subtotal + $shipping;
        $totalCount = array_sum(array_column($cart, 'quantity'));

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'cart' => $cart,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'total_count' => $totalCount,
            ]);
        }

        return back()->with('success', 'Product removed from cart.');
    }

    /**
     * Sync client-side localStorage cart with server session.
     */
    public function sync(Request $request): JsonResponse
    {
        $items = $request->input('items', []);
        $cart = [];

        foreach ($items as $item) {
            if (isset($item['id'], $item['quantity']) && $item['quantity'] > 0) {
                $cart[$item['id']] = [
                    'id' => (int) $item['id'],
                    'name' => (string) $item['name'],
                    'slug' => (string) ($item['slug'] ?? ''),
                    'price' => (float) $item['price'],
                    'image' => (string) ($item['image'] ?? ''),
                    'quantity' => (int) $item['quantity'],
                ];
            }
        }

        session()->put('cart', $cart);
        $totalCount = array_sum(array_column($cart, 'quantity'));

        return response()->json([
            'success' => true,
            'total_count' => $totalCount,
        ]);
    }

    /**
     * Checkout and place order.
     */
    public function checkout(Request $request): RedirectResponse
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('storefront.products')->with('error', 'Your cart is empty.');
        }

        $orderNumber = 'ORD-'.strtoupper(substr(uniqid(), -5));
        session()->forget('cart');

        return redirect()->route('storefront.index')->with('success', "Order #{$orderNumber} placed successfully! Thank you for shopping with ShopEase.");
    }
}
