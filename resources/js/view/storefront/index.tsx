import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Store,
    Search,
    ShoppingBag,
    Info,
    ArrowLeft,
    CheckCircle2,
    Eye,
    X
} from "lucide-react";
import {
    useGetStoreShopQuery,
    useGetStoreShopProductsQuery,
    useGetCategoriesQuery,
} from "../../redux/features/ecommerce/index.js";
import type { IShopProduct } from "../../redux/features/ecommerce/index.js";
import Loading from "../../Components/reuseable/loading/index.js";

export default function StorefrontPage() {
    const { slug } = useParams<{ slug: string }>();
    const safeSlug = slug || "";

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedProduct, setSelectedProduct] = useState<IShopProduct | null>(null);

    const {
        data: shopData,
        isLoading: isShopLoading,
        isError: isShopError
    } = useGetStoreShopQuery(safeSlug, { skip: !safeSlug });

    const {
        data: productsData,
        isLoading: isProductsLoading
    } = useGetStoreShopProductsQuery(
        {
            slug: safeSlug,
            search: searchQuery || undefined,
            category: selectedCategory !== "all" ? selectedCategory : undefined
        },
        { skip: !safeSlug }
    );

    const { data: categoriesData } = useGetCategoriesQuery();

    const shop = shopData?.results;
    const products = productsData?.results || [];
    const categories = categoriesData?.results || [];

    if (isShopLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
                <Loading title="Loading storefront..." />
            </div>
        );
    }

    if (isShopError || !shop) {
        return (
            <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 text-center shadow-xs">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Shop Not Found</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        We could not find the shop you requested. It might have been disabled or renamed.
                    </p>
                    <Link
                        to="/shops"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-xs"
                    >
                        <ArrowLeft className="w-4 h-4" /> Browse All Shops
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
            {/* Storefront Hero Banner */}
            <div className="bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-primary/10 to-indigo-100 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                {shop.logo ? (
                                    <img
                                        src={shop.logo}
                                        alt={shop.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Store className="w-10 h-10 text-primary" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {shop.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Shop
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                                    {shop.description || "Welcome to our shop! Explore our hand-picked inventory with exclusive prices and fast delivery."}
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                    {shop.owner && (
                                        <span>
                                            Owner: <strong className="text-slate-700 font-medium">{shop.owner.name}</strong>
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span>
                                        Active Listings: <strong className="text-slate-700 font-medium">{products.length} Products</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                            <Link
                                to="/shops"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> All Shops
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notice Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start sm:items-center gap-3 text-indigo-950 text-xs sm:text-sm">
                    <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                        <span className="font-semibold text-indigo-900">Custom Shop Catalog: </span>
                        All products shown below are specifically assigned to <strong>{shop.name}</strong>. Prices, custom details, and thumbnails are managed directly by this shop.
                    </div>
                </div>
            </div>

            {/* Filter and Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Search & Categories Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search inside ${shop.name}...`}
                            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "all"
                                ? "bg-primary text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === cat.slug
                                    ? "bg-primary text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {isProductsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 h-72 animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((item) => {
                            const effectiveThumb = item.effectiveThumbnail || item.thumbnail || item.catalogThumbnail || "/images/product-headphone-main@2x.jpg";
                            const effectiveDesc = item.effectiveDetails || item.details || item.catalogDescription || "No specific details provided.";

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-slate-200/90 hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col group"
                                >
                                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                                        <img
                                            src={effectiveThumb}
                                            alt={item.name || "Product"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                                            }}
                                        />
                                        {item.category && (
                                            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide">
                                                {item.category.name}
                                            </span>
                                        )}
                                        {item.isCustomized && (
                                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold">
                                                Custom Price
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col justify-between flex-1">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {effectiveDesc}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-[11px] font-medium text-slate-400 block uppercase">Shop Price</span>
                                                <span className="text-base sm:text-lg font-extrabold text-slate-900">
                                                    ৳{Number(item.price).toLocaleString()}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => setSelectedProduct(item)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            This shop currently has no products matching your search or category filter. Check back soon!
                        </p>
                    </div>
                )}
            </div>

            {/* Product Quick-View Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 bg-white/80 backdrop-blur-xs rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-slate-100 relative min-h-[260px] md:min-h-full">
                                <img
                                    src={
                                        selectedProduct.effectiveThumbnail ||
                                        selectedProduct.thumbnail ||
                                        selectedProduct.catalogThumbnail ||
                                        "/images/product-headphone-main@2x.jpg"
                                    }
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                                    }}
                                />
                            </div>

                            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                                            {selectedProduct.category?.name || "Catalog Product"}
                                        </span>
                                        <span className="text-xs text-slate-400">• Sold by {shop.name}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                                        {selectedProduct.name}
                                    </h2>
                                    <div className="mt-3">
                                        <span className="text-2xl font-extrabold text-primary">
                                            ৳{Number(selectedProduct.price).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Product Details & Description
                                    </h4>
                                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                                        {selectedProduct.effectiveDetails ||
                                            selectedProduct.details ||
                                            selectedProduct.catalogDescription ||
                                            "No additional specifications."}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span>Availability: <strong className="text-emerald-600 font-semibold">In Stock</strong></span>
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
