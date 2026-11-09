<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CategoryController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $categories = Category::withCount(['subcategories', 'products'])->latest()->paginate(10);

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return $this->sendResponse($categories, 'Categories retrieved successfully.');
        }

        return view('admin.categories.index', compact('categories'));
    }

    public function create(): View
    {
        return view('admin.categories.create');
    }

    public function store(CategoryRequest $request): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::upload($request->file('image'), 'categories');
        }

        $category = Category::create($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($category, 'Category created successfully.', 201);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category): View
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::replace($category->image, $request->file('image'), 'categories');
        }

        $category->update($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($category, 'Category updated successfully.');
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Request $request, Category $category): RedirectResponse|JsonResponse
    {
        foreach ($category->products as $product) {
            FileUploadService::delete($product->image);
        }

        FileUploadService::delete($category->image);

        $category->delete();

        if ($request->expectsJson()) {
            return $this->sendResponse(null, 'Category deleted successfully.');
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
