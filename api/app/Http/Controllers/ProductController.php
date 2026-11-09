<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $query = Product::with(['category', 'subcategory'])->latest();

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%'.$request->search.'%');
        }

        $products = $query->paginate(10)->withQueryString();

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return $this->sendResponse($products, 'Products retrieved successfully.');
        }

        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create(): View
    {
        $categories = Category::where('is_active', true)
            ->with(['subcategories' => fn ($q) => $q->where('is_active', true)->orderBy('name')])
            ->orderBy('name')
            ->get();

        return view('admin.products.create', compact('categories'));
    }

    public function store(ProductRequest $request): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        // 1. Thumbnail Image Upload
        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::upload($request->file('image'), 'products');
        } elseif ($request->hasFile('thumbnail')) {
            $data['image'] = FileUploadService::upload($request->file('thumbnail'), 'products');
        }

        // 2. Featured Images Upload (Gallery)
        if ($request->hasFile('featured_images')) {
            $featured = [];
            $files = is_array($request->file('featured_images')) ? $request->file('featured_images') : [$request->file('featured_images')];
            foreach ($files as $file) {
                if ($file) {
                    $featured[] = FileUploadService::upload($file, 'products/featured');
                }
            }
            $data['featured_images'] = $featured;
        }

        $product = Product::create($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($product, 'Product created successfully.', 201);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): View
    {
        $categories = Category::where('is_active', true)
            ->with(['subcategories' => fn ($q) => $q->where('is_active', true)->orderBy('name')])
            ->orderBy('name')
            ->get();
        $subcategories = Subcategory::where('category_id', $product->category_id)->where('is_active', true)->orderBy('name')->get();

        return view('admin.products.edit', compact('product', 'categories', 'subcategories'));
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        // 1. Thumbnail Image Update
        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::replace($product->image, $request->file('image'), 'products');
        } elseif ($request->hasFile('thumbnail')) {
            $data['image'] = FileUploadService::replace($product->image, $request->file('thumbnail'), 'products');
        }

        // 2. Featured Images Upload / Append
        if ($request->hasFile('featured_images')) {
            $featured = is_array($product->featured_images) ? $product->featured_images : [];
            $files = is_array($request->file('featured_images')) ? $request->file('featured_images') : [$request->file('featured_images')];
            foreach ($files as $file) {
                if ($file) {
                    $featured[] = FileUploadService::upload($file, 'products/featured');
                }
            }
            $data['featured_images'] = $featured;
        }

        $product->update($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($product, 'Product updated successfully.');
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        FileUploadService::delete($product->image);

        if (! empty($product->featured_images) && is_array($product->featured_images)) {
            foreach ($product->featured_images as $fImg) {
                FileUploadService::delete($fImg);
            }
        }

        $product->delete();

        if ($request->expectsJson()) {
            return $this->sendResponse(null, 'Product deleted successfully.');
        }

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
