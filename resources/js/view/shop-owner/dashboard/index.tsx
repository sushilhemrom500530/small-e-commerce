import { Store, Package, BookOpen, ExternalLink, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";
import { Link } from "react-router-dom";
import {
    useGetMyShopProfileQuery,
    useGetMyShopProductsQuery,
    useGetShopCatalogQuery
} from "../../../redux/features/ecommerce/index.js";
import Loading from "../../../Components/reuseable/loading/index.js";

export default function ShopOwnerDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: shopData, isLoading: isShopLoading } = useGetMyShopProfileQuery();
    const { data: productsData, isLoading: isProductsLoading } = useGetMyShopProductsQuery();
    const { data: catalogData } = useGetShopCatalogQuery();

    const shop = shopData?.results;
    const myProducts = productsData?.results || [];
    const catalogProducts = catalogData?.results || [];

    if (isShopLoading && isProductsLoading) {
        return <Loading title="Loading shop dashboard..." className="h-[50vh]" />;
    }

    const statCards = [
        {
            title: "Shop Status",
            value: shop ? (shop.status ? shop.status.toUpperCase() : "ACTIVE") : "PENDING",
            subtitle: shop?.name || "My Store",
            icon: Store,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
        },
        {
            title: "My Listed Products",
            value: isProductsLoading ? "..." : myProducts.length.toString(),
            subtitle: "Assigned to my shop",
            icon: Package,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-50",
        },
        {
            title: "Shared Catalog Items",
            value: catalogProducts.length.toString(),
            subtitle: "Available to select & list",
            icon: BookOpen,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                        Shop Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 font-normal">
                        Welcome back, <strong className="text-slate-800">{user?.fullName || user?.name || "Shop Owner"}</strong>! Manage your catalog and storefront.
                    </p>
                </div>

                {shop && (
                    <Link
                        to={`/shops/${shop.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors self-start shadow-xs"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> View Public Storefront
                    </Link>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                                    {stat.title}
                                </span>
                                <div
                                    className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1b3a] tracking-tight">
                                {stat.value}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{stat.subtitle}</p>
                        </div>
                    );
                })}
            </div>

            {/* Shop Overview and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* My Shop Card */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a] mb-4">
                            My Shop Profile
                        </h2>

                        {isShopLoading ? (
                            <div className="p-8 text-center text-slate-400 text-sm animate-pulse">Loading shop profile...</div>
                        ) : shop ? (
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                                    {shop.logo ? (
                                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store className="w-10 h-10 text-primary" />
                                    )}
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-extrabold text-[#0c1b3a]">
                                        {shop.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {shop.description || "No description set yet. Click Manage Shop to update."}
                                    </p>

                                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Status: {shop.status}
                                        </span>
                                        <Link
                                            to="/shop-owner/dashboard/my-shop"
                                            className="text-xs font-semibold text-primary hover:underline"
                                        >
                                            Edit Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center text-slate-500">
                                <p className="text-sm">No shop assigned to your account yet. Contact administrator.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Manage settings and custom banner</span>
                        <Link
                            to="/shop-owner/dashboard/my-shop"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            Shop Settings <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Shared Catalog Shortcuts */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a] mb-2">
                            Quick Catalog Actions
                        </h2>
                        <p className="text-xs text-slate-500 mb-4">
                            Expand your inventory by choosing products from the master catalog or adding your own brand items.
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/shop-owner/dashboard/catalog"
                                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 hover:border-primary hover:bg-primary/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            Browse Shared Catalog
                                        </h4>
                                        <p className="text-[11px] text-slate-400">
                                            Select existing products & add to your shop
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </Link>

                            <Link
                                to="/shop-owner/dashboard/products"
                                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                            Manage My Listings
                                        </h4>
                                        <p className="text-[11px] text-slate-400">
                                            Customize your prices, details & thumbnails
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center sm:text-left">
                        <p className="text-[11px] text-slate-400">
                            * When you add a new product, it automatically joins the shared catalog for all shop owners.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
