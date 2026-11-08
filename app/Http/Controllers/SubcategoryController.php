<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubcategoryRequest;
use App\Models\Category;
use App\Models\Subcategory;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class SubcategoryController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $subcategories = Subcategory::with('category')->withCount('products')->latest()->paginate(10);

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return $this->sendResponse($subcategories, 'Subcategories retrieved successfully.');
        }

        return view('admin.subcategories.index', compact('subcategories'));
    }

    public function create(): View
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return view('admin.subcategories.create', compact('categories'));
    }

    public function store(SubcategoryRequest $request): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::upload($request->file('image'), 'subcategories');
        }

        $subcategory = Subcategory::create($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($subcategory, 'Subcategory created successfully.', 201);
        }

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory created successfully.');
    }

    public function edit(Subcategory $subcategory): View
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return view('admin.subcategories.edit', compact('subcategory', 'categories'));
    }

    public function update(SubcategoryRequest $request, Subcategory $subcategory): RedirectResponse|JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = FileUploadService::replace($subcategory->image, $request->file('image'), 'subcategories');
        }

        $subcategory->update($data);

        if ($request->expectsJson()) {
            return $this->sendResponse($subcategory, 'Subcategory updated successfully.');
        }

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory updated successfully.');
    }

    public function destroy(Request $request, Subcategory $subcategory): RedirectResponse|JsonResponse
    {
        foreach ($subcategory->products as $product) {
            FileUploadService::delete($product->image);
        }

        FileUploadService::delete($subcategory->image);

        $subcategory->delete();

        if ($request->expectsJson()) {
            return $this->sendResponse(null, 'Subcategory deleted successfully.');
        }

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategory deleted successfully.');
    }

    public function byCategory(Category $category): JsonResponse
    {
        $subcategories = $category->subcategories()->where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return response()->json($subcategories);
    }
}
