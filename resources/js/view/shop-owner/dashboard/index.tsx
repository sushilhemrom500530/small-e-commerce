import { Store, Package, ShoppingCart, ArrowRight, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store.js";
import { Link } from "react-router-dom";

interface OrderItem {
    orderNo: string;
    amount: string;
    status: "Pending" | "Delivered" | "Processing";
}

const recentOrders: OrderItem[] = [
    { orderNo: "#ORD-1001", amount: "$120", status: "Pending" },
    { orderNo: "#ORD-1002", amount: "$85", status: "Delivered" },
    { orderNo: "#ORD-1003", amount: "$200", status: "Delivered" },
];

export default function ShopOwnerDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);

    const statCards = [
        {
            title: "My Shop",
            value: "1",
            icon: Store,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
        },
        {
            title: "My Products",
            value: "24",
            icon: Package,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-50",
        },
        {
            title: "Total Sales",
            value: "$2,450",
            icon: DollarSign,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50",
        },
        {
            title: "Orders",
            value: "68",
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
                    Welcome back, {user?.fullName || "Shop Owner"}!
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

            {/* Bottom Row: My Shop Overview & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* My Shop Overview */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a] mb-5">
                            My Shop Overview
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                            {/* 3D Storefront Image */}
                            <div className="w-36 h-32 sm:w-40 sm:h-36 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                <img
                                    src="/images/storefront-3d-transparent.png"
                                    alt="Tech World Storefront"
                                    className="w-full h-full object-contain drop-shadow-sm"
                                />
                            </div>

                            {/* Shop Details */}
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
                                <h3 className="text-xl font-extrabold text-[#0c1b3a] tracking-tight">
                                    Tech World
                                </h3>

                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 my-2.5">
                                    Active
                                </span>

                                <Link
                                    to="/shop-owner/dashboard/my-shop"
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#4353ff] hover:bg-[#3234a8] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#4353ff]/20 transition-all cursor-pointer mt-1"
                                >
                                    Manage Shop
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h2 className="text-base sm:text-lg font-bold text-[#0c1b3a]">
                                Recent Orders
                            </h2>
                            <Link
                                to="/shop-owner/dashboard/orders"
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#4353ff] hover:text-[#3234a8] transition-colors"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Orders List Table */}
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-4 font-bold text-slate-800">
                                                {order.orderNo}
                                            </td>
                                            <td className="py-4 font-semibold text-slate-700">
                                                {order.amount}
                                            </td>
                                            <td className="py-4 text-right">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                        order.status === "Pending"
                                                            ? "bg-amber-50 text-amber-600 border-amber-200/60"
                                                            : "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                                                    }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
