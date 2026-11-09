import { useState } from "react";
import { Store, Package, Users, ShoppingCart, ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";
import { Link } from "react-router-dom";
import {
    useGetAdminShopsQuery,
    useGetAdminProductsQuery,
    useGetAdminShopOwnersQuery,
} from "../../../redux/features/ecommerce/index.js";

export default function Dashboard() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [timeRange, setTimeRange] = useState("6 Months");

    const { data: shopsData, isLoading: isShopsLoading } = useGetAdminShopsQuery();
    const { data: productsData, isLoading: isProductsLoading } = useGetAdminProductsQuery();
    const { data: ownersData, isLoading: isOwnersLoading } = useGetAdminShopOwnersQuery();

    const shops = shopsData?.results || [];
    const products = productsData?.results || [];
    const owners = ownersData?.results || [];

    const statCards = [
        {
            title: "Total Shops",
            value: isShopsLoading ? "..." : shops.length.toString(),
            icon: Store,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
        },
        {
            title: "Catalog Products",
            value: isProductsLoading ? "..." : products.length.toString(),
            icon: Package,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-50",
        },
        {
            title: "Shop Owners",
            value: isOwnersLoading ? "..." : owners.length.toString(),
            icon: Users,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50",
        },
        {
            title: "Active Listings",
            value: isShopsLoading ? "..." : shops.reduce((acc, s) => acc + (s.productsCount || 0), 0).toString(),
            icon: ShoppingCart,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Greeting */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b3a] tracking-tight">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500 font-normal">
                    Welcome back, {user?.fullName || "Admin"}!
                </p>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow"
                        >
                            <div
                                className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} mb-4`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                {stat.title}
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-black text-[#0c1b3a] tracking-tight mt-1">
                                {stat.value}
                            </h2>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Row: Recent Shops & Sales Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Shops */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a]">
                                Recent Shops
                            </h2>
                            <Link
                                to="/admin/dashboard/shops"
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400">
                                        <th className="py-3 font-semibold">Shop Name</th>
                                        <th className="py-3 font-semibold">Owner</th>
                                        <th className="py-3 font-semibold text-right sm:text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {shops.slice(0, 5).map((shop) => (
                                        <tr key={shop.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 font-semibold text-slate-800">
                                                {shop.name}
                                            </td>
                                            <td className="py-3.5 text-slate-500 font-normal">
                                                {shop.owner?.name || "Unassigned"}
                                            </td>
                                            <td className="py-3.5 text-right sm:text-left">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 capitalize">
                                                    {shop.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {shops.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-4 text-center text-xs text-slate-400">
                                                No shops registered yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sales Overview */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4">
                            <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a]">
                                Sales Overview
                            </h2>
                            <div className="relative inline-block text-xs">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <span>{timeRange}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Area Line Chart */}
                        <div className="w-full pt-3 pb-2">
                            <svg
                                viewBox="0 0 420 180"
                                className="w-full h-auto overflow-visible select-none"
                            >
                                <defs>
                                    <linearGradient
                                        id="salesGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="var(--primary, #4353ff)"
                                            stopOpacity="0.25"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--primary, #4353ff)"
                                            stopOpacity="0.0"
                                        />
                                    </linearGradient>
                                </defs>

                                {/* Dotted Horizontal Grid lines */}
                                <line
                                    x1="20"
                                    y1="40"
                                    x2="400"
                                    y2="40"
                                    stroke="#f1f5f9"
                                    strokeDasharray="4 4"
                                />
                                <line
                                    x1="20"
                                    y1="90"
                                    x2="400"
                                    y2="90"
                                    stroke="#f1f5f9"
                                    strokeDasharray="4 4"
                                />
                                <line
                                    x1="20"
                                    y1="140"
                                    x2="400"
                                    y2="140"
                                    stroke="#f1f5f9"
                                    strokeDasharray="4 4"
                                />

                                {/* Area Fill */}
                                <path
                                    d="M 20 140 
                                       C 70 135, 110 120, 150 115 
                                       C 190 110, 220 95, 270 85 
                                       C 320 75, 360 40, 400 25 
                                       L 400 150 
                                       L 20 150 Z"
                                    fill="url(#salesGradient)"
                                />

                                {/* Smooth Curve Line */}
                                <path
                                    d="M 20 140 
                                       C 70 135, 110 120, 150 115 
                                       C 190 110, 220 95, 270 85 
                                       C 320 75, 360 40, 400 25"
                                    fill="none"
                                    stroke="var(--primary, #4353ff)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                {/* Nodes */}
                                {[
                                    { cx: 20, cy: 140, label: "Jan" },
                                    { cx: 96, cy: 128, label: "Feb" },
                                    { cx: 172, cy: 112, label: "Mar" },
                                    { cx: 248, cy: 92, label: "Apr" },
                                    { cx: 324, cy: 68, label: "May" },
                                    { cx: 400, cy: 25, label: "Jun" },
                                ].map((pt, i) => (
                                    <g key={i}>
                                        <circle
                                            cx={pt.cx}
                                            cy={pt.cy}
                                            r="4.5"
                                            fill="#ffffff"
                                            stroke="var(--primary, #4353ff)"
                                            strokeWidth="2.5"
                                        />
                                        <text
                                            x={pt.cx}
                                            y="170"
                                            textAnchor="middle"
                                            className="text-[11px] fill-slate-400 font-medium"
                                        >
                                            {pt.label}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
